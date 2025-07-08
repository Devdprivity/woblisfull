<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class TwoFactorController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Show the 2FA setup page
     */
    public function show(): Response
    {
        $user = Auth::user();

        if (!$user->has2FAEnabled()) {
            $secret = $this->google2fa->generateSecretKey();
            $qrCodeUrl = $this->google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email,
                $secret
            );

            return Inertia::render('auth/two-factor-setup', [
                'secret' => $secret,
                'qrCodeUrl' => $qrCodeUrl,
                'enabled' => false,
            ]);
        }

        return Inertia::render('auth/two-factor-setup', [
            'enabled' => true,
        ]);
    }

    /**
     * Enable 2FA for the user
     */
    public function enable(Request $request)
    {
        $request->validate([
            'secret' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();
        $secret = $request->input('secret');
        $code = $request->input('code');

        // Verify the code
        $valid = $this->google2fa->verifyKey($secret, $code);

        if (!$valid) {
            throw ValidationException::withMessages([
                'code' => ['El código de verificación es inválido.'],
            ]);
        }

        // Enable 2FA
        $user->enable2FA($secret);

        return back()->with('success', '¡Autenticación de dos factores habilitada exitosamente!');
    }

    /**
     * Disable 2FA for the user
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        // Verify password
        if (!Hash::check($request->input('password'), $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta.'],
            ]);
        }

        // Disable 2FA
        $user->disable2FA();

        return back()->with('success', 'Autenticación de dos factores deshabilitada.');
    }

    /**
     * Show 2FA verification page
     */
    public function verify(): Response
    {
        return Inertia::render('auth/two-factor-verify');
    }

    /**
     * Verify 2FA code during login
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();
        $code = $request->input('code');

        if (!$user->has2FAEnabled()) {
            return redirect()->route('dashboard');
        }

        // Verify the code
        $valid = $this->google2fa->verifyKey($user->google2fa_secret, $code);

        if (!$valid) {
            throw ValidationException::withMessages([
                'code' => ['El código de verificación es inválido.'],
            ]);
        }

        // Mark 2FA as verified in session
        $request->session()->put('2fa_verified', true);

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Generate recovery codes
     */
    public function generateRecoveryCodes()
    {
        $user = Auth::user();
        $codes = [];

        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
        }

        // Store encrypted recovery codes
        $user->update([
            'recovery_codes' => encrypt($codes),
        ]);

        return response()->json([
            'codes' => $codes,
            'message' => 'Códigos de recuperación generados. Guárdalos en un lugar seguro.',
        ]);
    }

    /**
     * Show the 2FA challenge page.
     */
    public function challenge(Request $request): Response
    {
        // Si el usuario no está autenticado o no tiene 2FA habilitado, redirigir al login
        if (!$request->user() || !$request->user()->google2fa_enabled) {
            return redirect()->route('login');
        }

        // Si ya verificó 2FA, redirigir a la URL prevista
        if (session('2fa_verified')) {
            return redirect()->intended(route('dashboard'));
        }

        return Inertia::render('auth/two-factor-challenge');
    }

    /**
     * Handle the incoming 2FA challenge.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user || !$user->google2fa_enabled) {
            return redirect()->route('login');
        }

        $google2fa = new Google2FA();

        // Verificar el código
        try {
            $valid = $google2fa->verifyKey(
                decrypt($user->google2fa_secret),
                $request->code,
                8 // 8 ventanas de tiempo = 4 minutos
            );

            if (!$valid) {
                return back()->withErrors([
                    'code' => __('El código de verificación no es válido.'),
                ]);
            }

            // Marcar como verificado en la sesión
            session(['2fa_verified' => true]);

            // Obtener la URL prevista o redirigir al dashboard
            $redirectTo = session('url.intended', route('dashboard'));
            session()->forget('url.intended');

            return redirect()->to($redirectTo);
        } catch (\Exception $e) {
            Log::error('Error al verificar 2FA: ' . $e->getMessage());
            return back()->withErrors([
                'code' => __('Error al verificar el código. Por favor, intente de nuevo.'),
            ]);
        }
    }

    /**
     * Show the 2FA setup view.
     */
    public function setup()
    {
        $user = Auth::user();

        if ($user->google2fa_enabled) {
            return redirect()->route('profile.edit')->with('error', '2FA ya está activado.');
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Generate QR code
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);

        $qrCode = $writer->writeString($google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        ));

        // Generate recovery codes
        $recoveryCodes = collect(range(1, 8))->map(function () {
            return sprintf('%s-%s-%s',
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)
            );
        })->all();

        // Store secret and recovery codes in session temporarily
        session()->put('auth.2fa.secret', $secret);
        session()->put('auth.2fa.recovery_codes', $recoveryCodes);

        return Inertia::render('auth/two-factor/setup', [
            'qrCode' => $qrCode,
            'secret' => $secret,
            'recoveryCodes' => $recoveryCodes,
        ]);
    }

    /**
     * Store the new 2FA configuration.
     */
    public function setupStore(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();
        $google2fa = new Google2FA();
        $secret = session()->get('auth.2fa.secret');
        $recoveryCodes = session()->get('auth.2fa.recovery_codes');

        // Verify the code is valid
        $valid = $google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return back()->withErrors(['code' => 'Código inválido.']);
        }

        // Enable 2FA
        $user->google2fa_secret = encrypt($secret);
        $user->recovery_codes = encrypt(json_encode($recoveryCodes));
        $user->google2fa_enabled = true;
        $user->google2fa_enabled_at = now();
        $user->save();

        // Clean up session
        session()->forget(['auth.2fa.secret', 'auth.2fa.recovery_codes']);

        return redirect()->route('profile.edit')->with('status', '2FA activado correctamente.');
    }

    /**
     * Show recovery codes.
     */
    public function showRecoveryCodes()
    {
        $user = Auth::user();

        if (!$user->google2fa_enabled) {
            return redirect()->route('profile.edit')->with('error', '2FA no está activado.');
        }

        return Inertia::render('auth/two-factor/recovery-codes', [
            'recoveryCodes' => json_decode(decrypt($user->recovery_codes)),
        ]);
    }

    /**
     * Generate new recovery codes.
     */
    public function regenerateRecoveryCodes()
    {
        $user = Auth::user();

        if (!$user->google2fa_enabled) {
            return redirect()->route('profile.edit')->with('error', '2FA no está activado.');
        }

        // Generate new recovery codes
        $recoveryCodes = collect(range(1, 8))->map(function () {
            return sprintf('%s-%s-%s',
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)
            );
        })->all();

        $user->recovery_codes = encrypt(json_encode($recoveryCodes));
        $user->save();

        return redirect()->route('two-factor.recovery-codes')
            ->with('status', 'Códigos de recuperación regenerados correctamente.');
    }

    /**
     * Validate a recovery code.
     */
    private function validateRecoveryCode($user, $code)
    {
        $recoveryCodes = json_decode(decrypt($user->recovery_codes));
        return in_array($code, $recoveryCodes);
    }

    /**
     * Mark a recovery code as used by removing it.
     */
    private function markRecoveryCodeAsUsed($user, $code)
    {
        $recoveryCodes = json_decode(decrypt($user->recovery_codes));
        $recoveryCodes = array_diff($recoveryCodes, [$code]);
        $user->recovery_codes = encrypt(json_encode(array_values($recoveryCodes)));
        $user->save();
    }
}
