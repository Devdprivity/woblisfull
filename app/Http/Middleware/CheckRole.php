<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Check if user has any of the required roles
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        // Check if user is pending activation
        if ($user->is_company && $user->is_pending) {
            return redirect()->route('welcome')->with('error',
                'Tu cuenta empresarial está pendiente de activación. Te contactaremos pronto.'
            );
        }

        // User doesn't have required role
        abort(403, 'No tienes permisos para acceder a esta sección.');
    }
}
