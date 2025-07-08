<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class Require2FA
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si es una ruta pública, permitir el acceso
        if ($request->is('/') || $request->is('como-funciona') || $request->is('login') || $request->is('register')) {
            return $next($request);
        }

        $user = $request->user();

        // Si el usuario no está autenticado o no tiene 2FA activado, permitir el acceso
        if (!$user || !$user->google2fa_enabled) {
            return $next($request);
        }

        // Si ya está verificado en esta sesión, permitir el acceso
        if (session('2fa_verified')) {
            return $next($request);
        }

        // Si está intentando verificar 2FA o cerrar sesión, permitir el acceso
        if ($request->is('verify-2fa*') || $request->is('logout')) {
            return $next($request);
        }

        // Guardar la URL prevista para redireccionar después de la verificación
        session()->put('url.intended', $request->fullUrl());

        // Redirigir a la página de verificación 2FA
        return redirect('/verify-2fa');
    }
}
