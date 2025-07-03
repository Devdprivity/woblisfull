<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index()
    {
        $companies = User::companies()
            ->with(['role', 'plan'])
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => User::companies()->count(),
            'pending' => User::companies()->pending()->count(),
            'active' => User::companies()->active()->count(),
            'suspended' => User::companies()->suspended()->count(),
        ];

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified company.
     */
    public function show(User $company)
    {
        if (!$company->is_company) {
            abort(404);
        }

        $company->load(['role', 'plan']);

        return Inertia::render('admin/companies/show', [
            'company' => $company,
        ]);
    }

    /**
     * Activate a company.
     */
    public function activate(Request $request, User $company)
    {
        if (!$company->is_company) {
            abort(404);
        }

        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $company->activate($request->notes);

        return back()->with('success', 'Empresa activada correctamente.');
    }

    /**
     * Suspend a company.
     */
    public function suspend(Request $request, User $company)
    {
        if (!$company->is_company) {
            abort(404);
        }

        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $company->suspend($request->notes);

        return back()->with('success', 'Empresa suspendida.');
    }

    /**
     * Update company plan.
     */
    public function updatePlan(Request $request, User $company)
    {
        if (!$company->is_company) {
            abort(404);
        }

        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        $company->update([
            'plan_id' => $plan->id,
            'activation_notes' => $request->notes,
        ]);

        return back()->with('success', "Plan actualizado a {$plan->name}.");
    }

    /**
     * Get companies data for API calls.
     */
    public function api(Request $request)
    {
        $query = User::companies()->with(['role', 'plan']);

        // Filter by status
        if ($request->status) {
            switch ($request->status) {
                case 'pending':
                    $query->pending();
                    break;
                case 'active':
                    $query->active();
                    break;
                case 'suspended':
                    $query->suspended();
                    break;
            }
        }

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('company_rut', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }
}
