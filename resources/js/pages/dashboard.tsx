import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Building2, MessageCircle, Heart, FileText, ClipboardList, Target, TrendingUp, CheckCircle } from 'lucide-react';
import CustomBarChart from '@/components/charts/BarChart';
import CustomLineChart from '@/components/charts/LineChart';
import CustomPieChart from '@/components/charts/PieChart';
import DashboardFilters from '@/components/charts/DashboardFilters';
import EnhancedUserTrendsChart from '@/components/charts/EnhancedUserTrendsChart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    account_type: 'client' | 'company';
    status: 'pending' | 'active' | 'suspended';
    company_name?: string;
    avatar?: string;
    role?: {
        name: string;
        display_name: string;
    };
    plan?: {
        name: string;
        price: number;
        responses_included: number;
    };
}

interface Stats {
    totalUsers: number;
    totalCompanies: number;
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalResponses: number;
    completedResponses: number;
    completionRate: number;
    myCampaigns: number;
    myResponses: number;
    myCompletionRate: number;
}

interface ChartsData {
    userTrends: Array<{
        period: string;
        total_users: number;
        client_users: number;
        company_users: number;
        admin_users: number;
        users_with_campaigns: number;
        users_without_campaigns: number;
        active_users: number;
        pending_users: number;
        suspended_users: number;
    }>;
    campaignsByPeriod: Array<{ period: string; count: number }>;
    responsesByPeriod: Array<{ period: string; count: number }>;
    usersByRole: Array<{ account_type: string; count: number }>;
    campaignsByStatus: Array<{ status: string; count: number }>;
    contentTrends: Array<{ period: string; posts: number; comments: number }>;
    roleDistribution: Array<{ role: string; count: number; percentage: number; color: string }>;
    campaignAssociation: Array<{ category: string; count: number; percentage: number }>;
}

interface Filters {
    filterType: string;
    startDate: string;
    endDate: string;
}

interface DashboardProps {
    user: User;
    stats: Stats;
    recentCampaigns: any[];
    recentPosts: any[];
    chartsData: ChartsData;
    filters: Filters;
}

export default function Dashboard({ user, stats, recentCampaigns, recentPosts, chartsData, filters }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">Activo</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500">Pendiente</Badge>;
            case 'suspended':
                return <Badge className="bg-red-500">Suspendido</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    // Colores para los gráficos de torta
    const pieColors = ['#7FFF00', '#32CD32', '#228B22', '#006400', '#9ACD32'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Woblis" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ¡Bienvenido, {user.name}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {user.account_type === 'company'
                            ? `Gestiona tu cuenta empresarial${user.company_name ? ' de ' + user.company_name : ''}`
                            : 'Explora todas las funcionalidades de Woblis'
                        }
                    </p>
                </div>

                {/* User Info Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Account Info */}
                    <Card className="p-6">
                        <div className="flex items-center space-x-4">
                            {user.avatar && (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(user.status)}
                                    <Badge variant="outline">
                                        {user.role?.display_name || 'Usuario'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Account Type */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Tipo de Cuenta</h3>
                        <div className="space-y-2">
                            <p className="text-2xl font-bold text-[#7FFF00]">
                                {user.account_type === 'company' ? 'Empresa' : 'Cliente Individual'}
                            </p>
                            {user.company_name && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.company_name}
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Plan Info or Quick Actions */}
                    {user.plan ? (
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Plan Actual</h3>
                            <div className="space-y-2">
                                <p className="text-xl font-bold">{user.plan.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.plan.responses_included} respuestas incluidas
                                </p>
                                <p className="text-lg font-semibold text-[#7FFF00]">
                                    ${user.plan.price.toLocaleString('es-CL')}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Explora nuestro blog y mantente al día
                                </p>
                                <a
                                    href={route('blog.index')}
                                    className="inline-block bg-[#7FFF00] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#6FEF00] transition-colors"
                                >
                                    Ver Blog
                                </a>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Company Pending Message */}
                {user.account_type === 'company' && user.status === 'pending' && (
                    <Card className="p-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                    Cuenta Pendiente de Activación
                                </h3>
                                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                                    Tu cuenta empresarial está siendo revisada por nuestro equipo. Te contactaremos dentro de 24 horas hábiles.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                                {/* Filtros y Exportación */}
                {(user.role?.name === 'admin' || user.account_type === 'company') && (
                    <DashboardFilters
                        filters={filters}
                    />
                )}

                {/* Métricas Generales */}
                {(user.role?.name === 'admin' || user.account_type === 'company') && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Panel Principal
                        </h2>

                        {/* Métricas de Usuarios y Empresas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.totalCompanies} empresas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Empresas registradas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Posts del Blog</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.totalComments} comentarios
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Likes Totales</CardTitle>
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalLikes}</div>
                                    <p className="text-xs text-muted-foreground">
                                        En posts y comentarios
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Métricas de Campañas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Campañas</CardTitle>
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.activeCampaigns} activas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Respuestas Total</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalResponses}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Respuestas recibidas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.completedResponses}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.completionRate}% tasa
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Comentarios</CardTitle>
                                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalComments}</div>
                                    <p className="text-xs text-muted-foreground">
                                        En el blog
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Métricas específicas del usuario si es empresa */}
                        {user.account_type === 'company' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Mis Estadísticas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Mis Campañas</CardTitle>
                                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stats.myCampaigns}</div>
                                            <p className="text-xs text-muted-foreground">
                                                Campañas creadas
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Mis Respuestas</CardTitle>
                                            <Target className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stats.myResponses}</div>
                                            <p className="text-xs text-muted-foreground">
                                                Respuestas recibidas
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Mi Tasa Completado</CardTitle>
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stats.myCompletionRate}%</div>
                                            <p className="text-xs text-muted-foreground">
                                                De mis encuestas
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Gráficos */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Análisis y Tendencias
                            </h3>

                            {/* Gráfico Mejorado de Tendencias de Usuarios */}
                            <EnhancedUserTrendsChart
                                data={chartsData.userTrends}
                                roleDistribution={chartsData.roleDistribution}
                                campaignAssociation={chartsData.campaignAssociation}
                                height={400}
                            />

                            {/* Gráfico de Contenido */}
                            <div className="grid grid-cols-1 gap-6">
                                <CustomLineChart
                                    data={chartsData.contentTrends}
                                    title="Tendencia de Contenido (Posts y Comentarios)"
                                    xAxisKey="period"
                                    lineKeys={['posts', 'comments']}
                                    colors={['#7FFF00', '#32CD32']}
                                    height={350}
                                />
                            </div>

                            {/* Gráficos de barras */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CustomBarChart
                                    data={chartsData.campaignsByPeriod}
                                    title="Campañas por Período"
                                    xAxisKey="period"
                                    barKeys={['count']}
                                    colors={['#7FFF00']}
                                    height={350}
                                />

                                <CustomBarChart
                                    data={chartsData.responsesByPeriod}
                                    title="Respuestas por Período"
                                    xAxisKey="period"
                                    barKeys={['count']}
                                    colors={['#32CD32']}
                                    height={350}
                                />
                            </div>

                            {/* Gráficos de torta */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CustomPieChart
                                    data={chartsData.usersByRole}
                                    title="Distribución de Usuarios por Tipo"
                                    dataKey="count"
                                    nameKey="account_type"
                                    colors={pieColors}
                                    height={350}
                                />

                                <CustomPieChart
                                    data={chartsData.campaignsByStatus}
                                    title="Estados de Campañas"
                                    dataKey="count"
                                    nameKey="status"
                                    colors={pieColors}
                                    height={350}
                                />
                            </div>
                        </div>

                        {/* Actividad Reciente */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Campañas Recientes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentCampaigns.length > 0 ? (
                                        recentCampaigns.map((campaign: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{campaign.title}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {campaign.client_name || 'Cliente'}
                                                    </p>
                                                </div>
                                                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">No hay campañas recientes</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Posts Recientes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentPosts.length > 0 ? (
                                        recentPosts.map((post: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{post.title}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        por {post.author_name || 'Woblis Team'}
                                                    </p>
                                                </div>
                                                <Badge variant="outline">
                                                    {new Date(post.created_at).toLocaleDateString('es-ES')}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">No hay posts recientes</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Contenido para usuarios no admin/empresa */}
                {user.role?.name !== 'admin' && user.account_type !== 'company' && (
                    <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Panel Principal</h2>
                            <div className="text-center py-12">
                                <PlaceholderPattern className="mx-auto w-32 h-32 stroke-neutral-900/20 dark:stroke-neutral-100/20 mb-4" />
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Bienvenido a Zenit
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                                    Explora nuestro blog, participa en encuestas y mantente conectado con la comunidad Zenit.
                                </p>
                                <div className="mt-6 space-x-4">
                                    <a
                                        href={route('blog.index')}
                                        className="inline-block bg-[#7FFF00] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#6FEF00] transition-colors"
                                    >
                                        Ver Blog
                                    </a>
                                    <a
                                        href="/como-funciona"
                                        className="inline-block border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cómo Funciona
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
