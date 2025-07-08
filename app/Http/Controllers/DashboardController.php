<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Campaign;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Obtener el tipo de filtro y fechas
        $filterType = $request->get('filter_type', 'month'); // day, week, month
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Establecer rangos de fechas por defecto
        $now = Carbon::now();
        switch ($filterType) {
            case 'day':
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subDays(30);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
            case 'week':
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subWeeks(12);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
            case 'month':
            default:
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subMonths(12);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
        }

        // Calcular métricas generales
        $stats = [
            'users' => [
                'total' => User::count(),
                'clients' => User::where('account_type', 'client')->count(),
                'companies' => User::where('account_type', 'company')->count(),
                'active_companies' => User::where('account_type', 'company')
                    ->where('status', 'active')->count(),
                'pending_companies' => User::where('account_type', 'company')
                    ->where('status', 'pending')->count(),
            ],
            'content' => [
                'posts' => Post::count(),
                'comments' => Comment::count(),
                'likes' => Like::count(),
                'posts_this_month' => Post::whereMonth('created_at', now()->month)->count(),
                'comments_this_month' => Comment::whereMonth('created_at', now()->month)->count(),
            ],
            'campaigns' => [
                'total' => Campaign::count(),
                'active' => Campaign::where('status', 'active')->count(),
                'completed' => Campaign::where('status', 'completed')->count(),
                'draft' => Campaign::where('status', 'draft')->count(),
                'total_responses' => Response::count(),
                'completed_responses' => Response::where('status', 'completed')->count(),
                'responses_this_month' => Response::whereMonth('created_at', now()->month)->count(),
            ],
            'recent_activity' => [
                'recent_posts' => Post::latest()->take(3)->get(),
                'recent_campaigns' => Campaign::latest()->take(3)->get(),
                'recent_responses' => Response::with('campaign')->where('status', 'completed')->latest()->take(5)->get(),
            ]
        ];

        // Calcular métricas específicas del usuario si es empresa
        $userStats = null;
        if (auth()->check() && auth()->user()->account_type === 'company' && auth()->user()->status === 'active') {
            $userCampaigns = Campaign::where('user_id', auth()->user()->id)->get();
            $userStats = [
                'my_campaigns' => $userCampaigns->count(),
                'my_active_campaigns' => $userCampaigns->where('status', 'active')->count(),
                'my_total_responses' => Response::whereIn('campaign_id', $userCampaigns->pluck('id'))->count(),
                'my_completed_responses' => Response::whereIn('campaign_id', $userCampaigns->pluck('id'))
                    ->where('status', 'completed')->count(),
                'my_campaigns_list' => $userCampaigns->take(5),
            ];
        }

        // Datos para gráficos
        $chartsData = $this->getChartsData($filterType, $startDate, $endDate);

        // Actividad reciente
        $recentCampaigns = Campaign::latest()->take(5)->get();
        $recentPosts = Post::latest()->take(5)->get();

        // Calcular tasa de completado
        $completionRate = $stats['campaigns']['total_responses'] > 0 ?
            round(($stats['campaigns']['completed_responses'] / $stats['campaigns']['total_responses']) * 100, 1) : 0;

        // Calcular métricas personales para empresas
        $myCampaigns = 0;
        $myResponses = 0;
        $myCompletionRate = 0;

        if (auth()->check() && auth()->user()->account_type === 'company') {
            $userCampaigns = Campaign::where('user_id', auth()->user()->id)->get();
            $myCampaigns = $userCampaigns->count();
            $myResponses = Response::whereIn('campaign_id', $userCampaigns->pluck('id'))->count();
            $myCompletedResponses = Response::whereIn('campaign_id', $userCampaigns->pluck('id'))
                ->where('status', 'completed')->count();
            $myCompletionRate = $myResponses > 0 ? round(($myCompletedResponses / $myResponses) * 100, 1) : 0;
        }

        return Inertia::render('dashboard', [
            'user' => auth()->user()->load(['role', 'plan']),
            'stats' => [
                'totalUsers' => $stats['users']['total'],
                'totalCompanies' => $stats['users']['companies'],
                'totalPosts' => $stats['content']['posts'],
                'totalComments' => $stats['content']['comments'],
                'totalLikes' => $stats['content']['likes'],
                'totalCampaigns' => $stats['campaigns']['total'],
                'activeCampaigns' => $stats['campaigns']['active'],
                'totalResponses' => $stats['campaigns']['total_responses'],
                'completedResponses' => $stats['campaigns']['completed_responses'],
                'completionRate' => $completionRate,
                'myCampaigns' => $myCampaigns,
                'myResponses' => $myResponses,
                'myCompletionRate' => $myCompletionRate,
            ],
            'recentCampaigns' => $recentCampaigns,
            'recentPosts' => $recentPosts,
            'chartsData' => $chartsData,
            'filters' => [
                'filterType' => $filterType,
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    private function getChartsData($filterType, $startDate, $endDate)
    {
        // Formato de agrupación según el tipo de filtro (PostgreSQL)
        $groupFormat = match ($filterType) {
            'day' => 'YYYY-MM-DD',
            'week' => 'YYYY-WW',
            'month' => 'YYYY-MM',
        };

        // Gráfico de líneas - Tendencias de usuarios registrados (mejorado)
        // Primero obtenemos los datos básicos de usuarios
        $basicUserTrends = User::selectRaw("
            TO_CHAR(created_at, '$groupFormat') as period,
            COUNT(*) as total_users,
            COUNT(CASE WHEN account_type = 'client' THEN 1 END) as client_users,
            COUNT(CASE WHEN account_type = 'company' THEN 1 END) as company_users,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users,
            COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_users
        ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Ahora agregamos datos de administradores y campañas
        $userTrends = $basicUserTrends->map(function ($item) use ($filterType, $startDate, $endDate) {
            // Determinar el rango de fechas basado en el período
            try {
                switch ($filterType) {
                    case 'day':
                        $periodStart = Carbon::createFromFormat('Y-m-d', $item->period)->startOfDay();
                        $periodEnd = Carbon::createFromFormat('Y-m-d', $item->period)->endOfDay();
                        break;
                    case 'week':
                        // Para semanas, usar el rango completo por ahora
                        $periodStart = $startDate;
                        $periodEnd = $endDate;
                        break;
                    case 'month':
                    default:
                        $periodStart = Carbon::createFromFormat('Y-m', $item->period)->startOfMonth();
                        $periodEnd = Carbon::createFromFormat('Y-m', $item->period)->endOfMonth();
                        break;
                }
            } catch (Exception $e) {
                // Si hay error en el parsing, usar el rango completo
                $periodStart = $startDate;
                $periodEnd = $endDate;
            }

            $adminCount = User::whereHas('role', function($q) {
                $q->where('name', 'admin');
            })->whereBetween('created_at', [$periodStart, $periodEnd])->count();

            // Contar usuarios con campañas para este período
            $usersWithCampaigns = User::whereHas('campaigns')
                ->whereBetween('created_at', [$periodStart, $periodEnd])
                ->count();

            return [
                'period' => $item->period,
                'total_users' => (int) $item->total_users,
                'client_users' => (int) $item->client_users,
                'company_users' => (int) $item->company_users,
                'admin_users' => $adminCount,
                'users_with_campaigns' => $usersWithCampaigns,
                'users_without_campaigns' => (int) $item->total_users - $usersWithCampaigns,
                'active_users' => (int) $item->active_users,
                'pending_users' => (int) $item->pending_users,
                'suspended_users' => (int) $item->suspended_users,
            ];
        });

        // Gráfico de barras - Campañas por mes
        $campaignsByPeriod = Campaign::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as count")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Gráfico de barras - Respuestas por mes
        $responsesByPeriod = Response::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as count")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Gráfico de torta - Distribución por tipo de cuenta
        $usersByRole = User::selectRaw('account_type, COUNT(*) as count')
            ->groupBy('account_type')
            ->get();

        // Gráfico de torta - Estados de campañas
        $campaignsByStatus = Campaign::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Gráfico de barras - Posts y comentarios por mes
        $contentByPeriod = Post::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as posts")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $commentsByPeriod = Comment::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as comments")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Combinar posts y comentarios
        $allPeriods = $contentByPeriod->pluck('period')->merge($commentsByPeriod->pluck('period'))->unique();
        $contentTrends = $allPeriods->map(function ($period) use ($contentByPeriod, $commentsByPeriod) {
            $posts = $contentByPeriod->where('period', $period)->first();
            $comments = $commentsByPeriod->where('period', $period)->first();
            return [
                'period' => $period,
                'posts' => $posts ? $posts->posts : 0,
                'comments' => $comments ? $comments->comments : 0
            ];
        })->sortBy('period')->values();

        // Distribución por rol con porcentajes y colores
        $totalUsers = User::count();
        $roleDistribution = [
            [
                'role' => 'Clientes',
                'count' => User::where('account_type', 'client')->count(),
                'percentage' => $totalUsers > 0 ? round((User::where('account_type', 'client')->count() / $totalUsers) * 100, 1) : 0,
                'color' => '#45B7D1'
            ],
            [
                'role' => 'Empresas',
                'count' => User::where('account_type', 'company')->count(),
                'percentage' => $totalUsers > 0 ? round((User::where('account_type', 'company')->count() / $totalUsers) * 100, 1) : 0,
                'color' => '#4ECDC4'
            ],
            [
                'role' => 'Administradores',
                'count' => User::whereHas('role', function($q) { $q->where('name', 'admin'); })->count(),
                'percentage' => $totalUsers > 0 ? round((User::whereHas('role', function($q) { $q->where('name', 'admin'); })->count() / $totalUsers) * 100, 1) : 0,
                'color' => '#FF6B6B'
            ]
        ];

        // Asociación a campañas
        $usersWithCampaigns = User::whereHas('campaigns')->count();
        $usersWithoutCampaigns = $totalUsers - $usersWithCampaigns;

        $campaignAssociation = [
            [
                'category' => 'Con Campañas',
                'count' => $usersWithCampaigns,
                'percentage' => $totalUsers > 0 ? round(($usersWithCampaigns / $totalUsers) * 100, 1) : 0
            ],
            [
                'category' => 'Sin Campañas',
                'count' => $usersWithoutCampaigns,
                'percentage' => $totalUsers > 0 ? round(($usersWithoutCampaigns / $totalUsers) * 100, 1) : 0
            ]
        ];

        return [
            'userTrends' => $userTrends->toArray(),
            'campaignsByPeriod' => $campaignsByPeriod->toArray(),
            'responsesByPeriod' => $responsesByPeriod->toArray(),
            'usersByRole' => $usersByRole->map(function ($item) {
                return [
                    'account_type' => $item->account_type,
                    'count' => $item->count
                ];
            })->toArray(),
            'campaignsByStatus' => $campaignsByStatus->toArray(),
            'contentTrends' => $contentTrends->toArray(),
            'roleDistribution' => $roleDistribution,
            'campaignAssociation' => $campaignAssociation,
        ];
    }

    public function export(Request $request)
    {
        $filterType = $request->get('filter_type', 'month');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Establecer rangos de fechas
        $now = Carbon::now();
        switch ($filterType) {
            case 'day':
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subDays(30);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
            case 'week':
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subWeeks(12);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
            case 'month':
            default:
                $startDate = $startDate ? Carbon::parse($startDate) : $now->copy()->subMonths(12);
                $endDate = $endDate ? Carbon::parse($endDate) : $now;
                break;
        }

        // Obtener datos
        $data = $this->getExportData($filterType, $startDate, $endDate);

        return response()->json($data);
    }

    private function getExportData($filterType, $startDate, $endDate)
    {
        $groupFormat = match ($filterType) {
            'day' => 'YYYY-MM-DD',
            'week' => 'YYYY-WW',
            'month' => 'YYYY-MM',
        };

        // Datos para exportar
        $exportData = [
            'summary' => [
                'total_users' => User::count(),
                'total_companies' => User::where('account_type', 'company')->count(),
                'total_campaigns' => Campaign::count(),
                'total_responses' => Response::count(),
                'total_posts' => Post::count(),
                'total_comments' => Comment::count(),
                'total_likes' => Like::count(),
            ],
            'trends' => [
                'users' => User::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as count")
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get(),
                'campaigns' => Campaign::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as count")
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get(),
                'responses' => Response::selectRaw("TO_CHAR(created_at, '$groupFormat') as period, COUNT(*) as count")
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get(),
            ],
            'filter_info' => [
                'filter_type' => $filterType,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'generated_at' => now()->format('Y-m-d H:i:s'),
            ]
        ];

        return $exportData;
    }
}
