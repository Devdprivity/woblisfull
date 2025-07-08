<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Exceptions\ThrottleRequestsException;

class SecurityMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and account is locked
        if (Auth::check() && Auth::user()->isAccountLocked()) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Tu cuenta está temporalmente bloqueada debido a múltiples intentos de acceso fallidos. Inténtalo más tarde.');
        }

        // Rate limiting for login attempts
        if ($request->routeIs('login') && $request->isMethod('post')) {
            $key = 'login-attempts:' . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                throw new ThrottleRequestsException(
                    'Demasiados intentos de login. Inténtalo de nuevo en ' . ceil($seconds / 60) . ' minutos.'
                );
            }
        }

        // Rate limiting for registration
        if ($request->routeIs('register') && $request->isMethod('post')) {
            $key = 'register-attempts:' . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 3)) {
                $seconds = RateLimiter::availableIn($key);
                throw new ThrottleRequestsException(
                    'Demasiados intentos de registro. Inténtalo de nuevo en ' . ceil($seconds / 60) . ' minutos.'
                );
            }
        }

        // Rate limiting for password reset
        if ($request->routeIs('password.email') && $request->isMethod('post')) {
            $key = 'password-reset:' . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 3)) {
                $seconds = RateLimiter::availableIn($key);
                throw new ThrottleRequestsException(
                    'Demasiados intentos de restablecimiento de contraseña. Inténtalo de nuevo en ' . ceil($seconds / 60) . ' minutos.'
                );
            }
        }

        // Check for forced password change
        if (Auth::check() && Auth::user()->needsPasswordChange()) {
            if (!$request->routeIs('password.change') && !$request->routeIs('logout')) {
                return redirect()->route('password.change')->with('warning', 'Debes cambiar tu contraseña antes de continuar.');
            }
        }

        // Configurar headers de seguridad
        $response = $next($request);

        // Agregar headers de seguridad básicos
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Solo aplicar CSP en producción
        if (app()->environment('production')) {
            $cspRules = [
                "default-src" => ["'self'"],
                "script-src" => ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                "style-src" => ["'self'", "'unsafe-inline'", "https://fonts.bunny.net"],
                "img-src" => ["'self'", "data:", "https:"],
                "font-src" => ["'self'", "data:", "https://fonts.bunny.net"],
                "connect-src" => ["'self'"]
            ];

            $cspHeader = collect($cspRules)->map(function ($sources, $directive) {
                return $directive . ' ' . implode(' ', $sources);
            })->implode('; ');

            $response->headers->set('Content-Security-Policy', $cspHeader);
        }

        return $response;
    }
}
