<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();

            // Record successful login
            $user = Auth::user();
            $user->recordSuccessfulLogin($request->ip());

            // Clear rate limiting for this IP
            RateLimiter::clear('login-attempts:' . $request->ip());

            $request->session()->regenerate();

            // Si el usuario tiene 2FA habilitado, redirigir al challenge
            if ($user->google2fa_enabled) {
                // Limpiar cualquier verificación 2FA anterior
                session()->forget('2fa_verified');
                return redirect()->route('two-factor.challenge');
            }

            // Si no tiene 2FA, redirigir a la URL prevista o al dashboard
            return redirect()->intended(route('dashboard'));
        } catch (ValidationException $e) {
            // Record failed login attempt
            if ($user = User::where('email', $request->email)->first()) {
                $user->recordFailedLogin($request->ip());
            }

            throw $e;
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
