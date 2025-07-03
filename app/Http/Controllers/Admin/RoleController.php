<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $query = Role::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('display_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Get roles with user count
        $roles = $query->withCount('users')
                      ->orderBy('name')
                      ->paginate(10)
                      ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Role::count(),
            'with_users' => Role::has('users')->count(),
            'permissions_avg' => round(Role::whereNotNull('permissions')->get()->avg(function ($role) {
                return count($role->permissions ?? []);
            }), 1),
        ];

        // Get all available permissions (from all roles)
        $allPermissions = collect();
        Role::whereNotNull('permissions')->get()->each(function ($role) use ($allPermissions) {
            if ($role->permissions) {
                $allPermissions = $allPermissions->merge($role->permissions);
            }
        });
        $availablePermissions = $allPermissions->unique()->sort()->values()->toArray();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'stats' => $stats,
            'filters' => $request->only(['search']),
            'availablePermissions' => $availablePermissions,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        // Get all available permissions
        $allPermissions = collect();
        Role::whereNotNull('permissions')->get()->each(function ($role) use ($allPermissions) {
            if ($role->permissions) {
                $allPermissions = $allPermissions->merge($role->permissions);
            }
        });
        $availablePermissions = $allPermissions->unique()->sort()->values()->toArray();

        return Inertia::render('admin/roles/create', [
            'availablePermissions' => $availablePermissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name|alpha_dash',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        Role::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('admin.roles.index')
                        ->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $role->load('users:id,name,email,account_type,status,role_id');

        return Inertia::render('admin/roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        // Get all available permissions
        $allPermissions = collect();
        Role::whereNotNull('permissions')->get()->each(function ($r) use ($allPermissions) {
            if ($r->permissions) {
                $allPermissions = $allPermissions->merge($r->permissions);
            }
        });
        $availablePermissions = $allPermissions->unique()->sort()->values()->toArray();

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'availablePermissions' => $availablePermissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|alpha_dash|unique:roles,name,' . $role->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role->update([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('admin.roles.index')
                        ->with('success', 'Rol actualizado exitosamente.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // Check if role has users
        if ($role->users()->count() > 0) {
            return back()->with('error', 'No se puede eliminar un rol que tiene usuarios asignados.');
        }

        // Prevent deletion of system roles
        $systemRoles = ['admin', 'client', 'company_pending', 'company_active'];
        if (in_array($role->name, $systemRoles)) {
            return back()->with('error', 'No se pueden eliminar los roles del sistema.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
                        ->with('success', 'Rol eliminado exitosamente.');
    }

    /**
     * Get role statistics for API.
     */
    public function stats()
    {
        $stats = [
            'total' => Role::count(),
            'with_users' => Role::has('users')->count(),
            'permissions_avg' => round(Role::whereNotNull('permissions')->get()->avg(function ($role) {
                return count($role->permissions ?? []);
            }), 1),
            'system_roles' => Role::whereIn('name', ['admin', 'client', 'company_pending', 'company_active'])->count(),
        ];

        return response()->json($stats);
    }
}
