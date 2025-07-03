<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $plans = Plan::active()->ordered()->get();

        return Inertia::render('auth/register', [
            'plans' => $plans,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'required|in:client,company',
        ];

        // Add company-specific validation rules
        if ($request->account_type === 'company') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'company_rut' => 'required|string|max:20|unique:users,company_rut',
                'company_address' => 'required|string|max:500',
                'company_phone' => 'required|string|max:20',
                'plan_id' => 'required|exists:plans,id',
            ]);
        }

        $validated = $request->validate($rules);

        // Determine role based on account type
        if ($validated['account_type'] === 'company') {
            $role = Role::companyPending();
            $status = 'pending';
        } else {
            $role = Role::client();
            $status = 'active';
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'account_type' => $validated['account_type'],
            'role_id' => $role->id,
            'status' => $status,
            'provider' => 'email',
        ];

        // Add company-specific data
        if ($validated['account_type'] === 'company') {
            $userData = array_merge($userData, [
                'company_name' => $validated['company_name'],
                'company_rut' => $validated['company_rut'],
                'company_address' => $validated['company_address'],
                'company_phone' => $validated['company_phone'],
                'plan_id' => $validated['plan_id'],
            ]);
        } else {
            $userData['activated_at'] = now();
        }

        $user = User::create($userData);

        event(new Registered($user));

        // Handle post-registration flow
        if ($user->account_type === 'company') {
            // Don't auto-login companies, they need activation
            return redirect()->route('login')->with('success',
                'Tu cuenta empresarial ha sido creada. Espera la activación por parte de nuestro equipo. Te contactaremos pronto.'
            );
        } else {
            // Auto-login individual clients
            Auth::login($user);
            return redirect()->intended(route('dashboard', absolute: false));
        }
    }
}
