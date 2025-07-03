<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlanController extends Controller
{
    /**
     * Display a listing of plans.
     */
    public function index(Request $request)
    {
        $query = Plan::query();

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Get plans with user count
        $plans = $query->withCount('users')
                      ->orderBy('sort_order')
                      ->orderBy('price')
                      ->paginate(10)
                      ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Plan::count(),
            'active' => Plan::where('is_active', true)->count(),
            'inactive' => Plan::where('is_active', false)->count(),
            'pyme' => Plan::where('category', 'pyme')->count(),
            'corp' => Plan::where('category', 'corp')->count(),
            'total_users' => Plan::withCount('users')->get()->sum('users_count'),
            'avg_price' => round(Plan::where('is_active', true)->avg('price'), 0),
        ];

        return Inertia::render('admin/plans/index', [
            'plans' => $plans,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new plan.
     */
    public function create()
    {
        return Inertia::render('admin/plans/create');
    }

    /**
     * Store a newly created plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:plans,slug|alpha_dash',
            'category' => 'required|in:pyme,corp',
            'price' => 'required|integer|min:0',
            'description' => 'required|string|max:1000',
            'responses_included' => 'required|integer|min:1',
            'delivery_time' => 'required|string|max:255',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'required|integer|min:0',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Plan::create($validated);

        return redirect()->route('admin.plans.index')
                        ->with('success', 'Plan creado exitosamente.');
    }

    /**
     * Display the specified plan.
     */
    public function show(Plan $plan)
    {
        $plan->load('users:id,name,email,company_name,account_type,status,plan_id');

        return Inertia::render('admin/plans/show', [
            'plan' => $plan,
        ]);
    }

    /**
     * Show the form for editing the specified plan.
     */
    public function edit(Plan $plan)
    {
        return Inertia::render('admin/plans/edit', [
            'plan' => $plan,
        ]);
    }

    /**
     * Update the specified plan in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|alpha_dash|unique:plans,slug,' . $plan->id,
            'category' => 'required|in:pyme,corp',
            'price' => 'required|integer|min:0',
            'description' => 'required|string|max:1000',
            'responses_included' => 'required|integer|min:1',
            'delivery_time' => 'required|string|max:255',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'required|integer|min:0',
        ]);

        $plan->update($validated);

        return redirect()->route('admin.plans.index')
                        ->with('success', 'Plan actualizado exitosamente.');
    }

    /**
     * Remove the specified plan from storage.
     */
    public function destroy(Plan $plan)
    {
        // Check if plan has users
        if ($plan->users()->count() > 0) {
            return back()->with('error', 'No se puede eliminar un plan que tiene usuarios asignados.');
        }

        $plan->delete();

        return redirect()->route('admin.plans.index')
                        ->with('success', 'Plan eliminado exitosamente.');
    }

    /**
     * Toggle plan status.
     */
    public function toggleStatus(Plan $plan)
    {
        $plan->update([
            'is_active' => !$plan->is_active
        ]);

        $status = $plan->is_active ? 'activado' : 'desactivado';

        return back()->with('success', "Plan {$status} exitosamente.");
    }

    /**
     * Get plan statistics for API.
     */
    public function stats()
    {
        $stats = [
            'total' => Plan::count(),
            'active' => Plan::where('is_active', true)->count(),
            'inactive' => Plan::where('is_active', false)->count(),
            'pyme' => Plan::where('category', 'pyme')->count(),
            'corp' => Plan::where('category', 'corp')->count(),
            'total_users' => Plan::withCount('users')->get()->sum('users_count'),
            'avg_price' => round(Plan::where('is_active', true)->avg('price'), 0),
        ];

        return response()->json($stats);
    }

    /**
     * Duplicate a plan.
     */
    public function duplicate(Plan $plan)
    {
        $newPlan = $plan->replicate();
        $newPlan->name = $plan->name . ' (Copia)';
        $newPlan->slug = $plan->slug . '-copy-' . time();
        $newPlan->is_active = false;
        $newPlan->sort_order = Plan::max('sort_order') + 1;
        $newPlan->save();

        return redirect()->route('admin.plans.edit', $newPlan)
                        ->with('success', 'Plan duplicado exitosamente. Recuerda activarlo cuando esté listo.');
    }

    /**
     * Reorder plans.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'plans' => 'required|array',
            'plans.*.id' => 'required|exists:plans,id',
            'plans.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->plans as $planData) {
            Plan::where('id', $planData['id'])->update([
                'sort_order' => $planData['sort_order']
            ]);
        }

        return back()->with('success', 'Orden de planes actualizado exitosamente.');
    }
}
