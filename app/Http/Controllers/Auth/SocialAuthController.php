<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            Log::info('Google OAuth callback received', [
                'google_id' => $googleUser->id,
                'email' => $googleUser->email,
                'name' => $googleUser->name,
            ]);

            // Check if user already exists
            $user = User::where('google_id', $googleUser->id)
                       ->orWhere('email', $googleUser->email)
                       ->first();

            if ($user) {
                Log::info('Existing user found, updating', ['user_id' => $user->id]);

                // Update existing user
                $user->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'provider' => 'google',
                ]);

                // Ensure user has a role
                if (!$user->role_id) {
                    $clientRole = Role::where('name', 'client')->first();
                    $user->update([
                        'role_id' => $clientRole ? $clientRole->id : null,
                        'account_type' => 'client',
                        'status' => 'active',
                        'activated_at' => now(),
                    ]);
                }
            } else {
                Log::info('Creating new user from Google OAuth');

                // Get client role
                $clientRole = Role::where('name', 'client')->first();

                if (!$clientRole) {
                    Log::error('Client role not found in database');
                    return redirect()->route('login')->with('error', 'Error de configuración. Contacta al administrador.');
                }

                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'provider' => 'google',
                    'account_type' => 'client',
                    'role_id' => $clientRole->id,
                    'status' => 'active',
                    'activated_at' => now(),
                    'email_verified_at' => now(), // Google emails are pre-verified
                ]);

                Log::info('New user created successfully', ['user_id' => $user->id]);
            }

            // Login the user
            Auth::login($user, true); // Remember the user

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'is_authenticated' => Auth::check(),
            ]);

            return redirect()->intended(route('dashboard'));

        } catch (\Exception $e) {
            Log::error('Google OAuth error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('login')->with('error', 'Error al autenticar con Google: ' . $e->getMessage());
        }
    }
}
