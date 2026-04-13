<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use Inertia\Inertia;

// Two Factor Challenge Routes
Route::middleware('auth')->group(function () {
    Route::get('two-factor-challenge', [TwoFactorController::class, 'challenge'])
        ->name('two-factor.challenge');

    Route::post('two-factor-challenge', [TwoFactorController::class, 'store'])
        ->name('two-factor.store');
});

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Social authentication routes
    Route::get('auth/google', [SocialAuthController::class, 'redirectToGoogle'])
        ->name('auth.google');

    Route::get('auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])
        ->name('auth.google.callback');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Rutas de verificación de 2FA
    Route::get('/verify-2fa', function () {
        // Si el usuario no tiene 2FA activado o ya está verificado, redirigir
        if (!auth()->user()->google2fa_enabled || session('2fa_verified')) {
            return redirect()->intended();
        }
        return Inertia::render('auth/two-factor-verify');
    })->name('two-factor.verify');

    Route::post('/verify-2fa', function (Request $request) {
        $user = $request->user();

        // Si el usuario no tiene 2FA activado o ya está verificado, continuar
        if (!$user->google2fa_enabled || session('2fa_verified')) {
            return redirect()->intended();
        }

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey(
            decrypt($user->google2fa_secret),
            $request->code,
            8
        );

        if (!$valid) {
            return back()->withErrors([
                'code' => 'El código de verificación no es válido.',
            ]);
        }

        session(['2fa_verified' => true]);

        return redirect()->intended();
    })->name('two-factor.verify.post');
});
