<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use PragmaRX\Google2FA\Google2FA;

class Enable2FAForAdmin extends Command
{
    protected $signature = 'admin:enable-2fa';
    protected $description = 'Activa 2FA para el usuario administrador';

    public function handle()
    {
        $admin = User::where('email', 'admin@woblis.cl')->first();

        if (!$admin) {
            $this->error('Usuario administrador no encontrado');
            return 1;
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Generar códigos de recuperación
        $recoveryCodes = collect(range(1, 8))->map(function () {
            return sprintf('%s-%s-%s',
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)
            );
        })->all();

        $admin->google2fa_secret = encrypt($secret);
        $admin->recovery_codes = encrypt(json_encode($recoveryCodes));
        $admin->google2fa_enabled = true;
        $admin->google2fa_enabled_at = now();
        $admin->save();

        $this->info('2FA activado para el administrador');
        $this->info('Secreto: ' . $secret);
        $this->info('Códigos de recuperación:');
        foreach ($recoveryCodes as $code) {
            $this->info('- ' . $code);
        }

        return 0;
    }
}
