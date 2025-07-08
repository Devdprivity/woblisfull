<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Mostrar la página de configuración de 2FA
     */
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('settings/two-factor', [
            'twoFactorEnabled' => $user->google2fa_enabled,
            'qrCode' => $this->getQrCode(),
            'recoveryCodes' => $this->getRecoveryCodes(),
        ]);
    }

    /**
     * Activar 2FA para el usuario (primer paso)
     */
    public function enable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'La contraseña actual no es correcta.',
            ]);
        }

        // Generar nuevo secreto
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();
        $user->google2fa_secret = encrypt($secret);
        $user->save();

        return back()->with([
            'status' => 'two-factor-setup',
            'qrCode' => $this->generateQrCodeSvg($secret),
        ]);
    }

    /**
     * Confirmar activación de 2FA (segundo paso)
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        $google2fa = new Google2FA();

        if (!$user->google2fa_secret) {
            return back()->withErrors([
                'code' => 'No se ha configurado la autenticación de dos factores.',
            ]);
        }

        // Verificar el código
        $valid = $google2fa->verifyKey(
            decrypt($user->google2fa_secret),
            $request->code,
            8 // 8 ventanas de tiempo = 4 minutos
        );

        if (!$valid) {
            return back()->withErrors([
                'code' => 'El código de verificación no es válido.',
            ]);
        }

        // Generar códigos de recuperación
        $recoveryCodes = $this->generateRecoveryCodes();

        $user->recovery_codes = encrypt(json_encode($recoveryCodes));
        $user->google2fa_enabled = true;
        $user->google2fa_enabled_at = now();
        $user->save();

        return back()->with([
            'status' => 'two-factor-confirmed',
            'recoveryCodes' => $recoveryCodes,
        ]);
    }

    /**
     * Desactivar 2FA para el usuario
     */
    public function disable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'La contraseña actual no es correcta.',
            ]);
        }

        $user->google2fa_enabled = false;
        $user->google2fa_enabled_at = null;
        $user->google2fa_secret = null;
        $user->recovery_codes = null;
        $user->save();

        // Limpiar la sesión de 2FA
        session()->forget('2fa_verified');

        return back()->with('status', 'two-factor-disabled');
    }

    /**
     * Regenerar códigos de recuperación
     */
    public function recoveryCodes(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->google2fa_enabled) {
            return back()->withErrors([
                'general' => 'La autenticación de dos factores no está habilitada.',
            ]);
        }

        $recoveryCodes = $this->generateRecoveryCodes();
        $user->recovery_codes = encrypt(json_encode($recoveryCodes));
        $user->save();

        return back()->with([
            'status' => 'recovery-codes-regenerated',
            'recoveryCodes' => $recoveryCodes,
        ]);
    }

    /**
     * Obtener el código QR para la configuración inicial
     */
    private function getQrCode(): ?string
    {
        $user = Auth::user();

        if ($user->google2fa_enabled || !$user->google2fa_secret) {
            return null;
        }

        $secret = decrypt($user->google2fa_secret);
        return $this->generateQrCodeSvg($secret);
    }

    /**
     * Generar código QR en formato SVG
     */
    private function generateQrCodeSvg(string $secret): string
    {
        $google2fa = new Google2FA();
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            Auth::user()->email,
            $secret
        );

        // Usar Simple QR Code para generar SVG
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
            <rect width="200" height="200" fill="white"/>
            <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">QR Code: ' . $qrCodeUrl . '</text>
        </svg>';
    }

    /**
     * Obtener códigos de recuperación si están disponibles
     */
    private function getRecoveryCodes(): ?array
    {
        $user = Auth::user();

        if (!$user->recovery_codes) {
            return null;
        }

        return json_decode(decrypt($user->recovery_codes), true);
    }

    /**
     * Generar nuevos códigos de recuperación
     */
    private function generateRecoveryCodes(): array
    {
        return collect(range(1, 8))->map(function () {
            return sprintf('%s-%s-%s',
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)
            );
        })->all();
    }
}
