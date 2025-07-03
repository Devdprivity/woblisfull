<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::with(['role', 'plan']);

        // Filter by account type
        if ($request->account_type) {
            $query->where('account_type', $request->account_type);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by role
        if ($request->role) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15);

        $stats = [
            'total' => User::count(),
            'clients' => User::clients()->count(),
            'companies' => User::companies()->count(),
            'pending' => User::pending()->count(),
            'active' => User::active()->count(),
            'suspended' => User::suspended()->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['account_type', 'status', 'role', 'search']),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'required|in:client,company',
            'role_id' => 'required|exists:roles,id',
            'status' => 'required|in:pending,active,suspended',
        ];

        // Add company fields if needed
        if ($request->account_type === 'company') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'company_rut' => 'required|string|max:20|unique:users,company_rut',
                'company_address' => 'nullable|string|max:500',
                'company_phone' => 'nullable|string|max:20',
            ]);
        }

        $validated = $request->validate($rules);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'account_type' => $validated['account_type'],
            'role_id' => $validated['role_id'],
            'status' => $validated['status'],
            'provider' => 'email',
            'email_verified_at' => now(),
        ];

        // Add company data if applicable
        if ($validated['account_type'] === 'company') {
            $userData = array_merge($userData, [
                'company_name' => $validated['company_name'],
                'company_rut' => $validated['company_rut'],
                'company_address' => $validated['company_address'] ?? null,
                'company_phone' => $validated['company_phone'] ?? null,
            ]);
        }

        if ($validated['status'] === 'active') {
            $userData['activated_at'] = now();
        }

        User::create($userData);

        return redirect()->route('admin.users.index')->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['role', 'plan']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $roles = Role::all();

        return Inertia::render('admin/users/edit', [
            'user' => $user->load(['role', 'plan']),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'account_type' => 'required|in:client,company',
            'role_id' => 'required|exists:roles,id',
            'status' => 'required|in:pending,active,suspended',
        ];

        // Add company fields if needed
        if ($request->account_type === 'company') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'company_rut' => 'required|string|max:20|unique:users,company_rut,' . $user->id,
                'company_address' => 'nullable|string|max:500',
                'company_phone' => 'nullable|string|max:20',
            ]);
        }

        // Password is optional for updates
        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'account_type' => $validated['account_type'],
            'role_id' => $validated['role_id'],
            'status' => $validated['status'],
        ];

        // Update password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($validated['password']);
        }

        // Add company data if applicable
        if ($validated['account_type'] === 'company') {
            $userData = array_merge($userData, [
                'company_name' => $validated['company_name'],
                'company_rut' => $validated['company_rut'],
                'company_address' => $validated['company_address'] ?? null,
                'company_phone' => $validated['company_phone'] ?? null,
            ]);
        } else {
            // Clear company data if switching to client
            $userData = array_merge($userData, [
                'company_name' => null,
                'company_rut' => null,
                'company_address' => null,
                'company_phone' => null,
            ]);
        }

        // Handle activation
        if ($validated['status'] === 'active' && $user->status !== 'active') {
            $userData['activated_at'] = now();
        }

        $user->update($userData);

        return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado correctamente.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        // Prevent deleting other admins (optional)
        if ($user->isAdmin()) {
            return back()->with('error', 'No se puede eliminar una cuenta de administrador.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * Toggle user status between active/suspended.
     */
    public function toggleStatus(User $user)
    {
        $newStatus = $user->status === 'active' ? 'suspended' : 'active';

        $updateData = ['status' => $newStatus];

        if ($newStatus === 'active' && !$user->activated_at) {
            $updateData['activated_at'] = now();
        }

        $user->update($updateData);

        $message = $newStatus === 'active' ? 'Usuario activado.' : 'Usuario suspendido.';

        return back()->with('success', $message);
    }

    /**
     * Get users data for API calls.
     */
    public function api(Request $request)
    {
        $query = User::with(['role', 'plan']);

        // Apply filters same as index method
        if ($request->account_type) {
            $query->where('account_type', $request->account_type);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->role) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }
}
