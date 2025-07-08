<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Campos para 2FA
            if (!Schema::hasColumn('users', 'google2fa_secret')) {
                $table->string('google2fa_secret')->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'google2fa_enabled')) {
                $table->boolean('google2fa_enabled')->default(false)->after('google2fa_secret');
            }
            if (!Schema::hasColumn('users', 'google2fa_enabled_at')) {
                $table->timestamp('google2fa_enabled_at')->nullable()->after('google2fa_enabled');
            }

            // Campos para rate limiting y seguridad
            if (!Schema::hasColumn('users', 'login_attempts')) {
                $table->integer('login_attempts')->default(0)->after('google2fa_enabled_at');
            }
            if (!Schema::hasColumn('users', 'locked_until')) {
                $table->timestamp('locked_until')->nullable()->after('login_attempts');
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('locked_until');
            }
            if (!Schema::hasColumn('users', 'last_login_ip')) {
                $table->string('last_login_ip')->nullable()->after('last_login_at');
            }
            if (!Schema::hasColumn('users', 'login_history')) {
                $table->text('login_history')->nullable()->after('last_login_ip'); // JSON para historial
            }

            // Campos adicionales de seguridad
            if (!Schema::hasColumn('users', 'force_password_change')) {
                $table->boolean('force_password_change')->default(false)->after('login_history');
            }
            if (!Schema::hasColumn('users', 'password_changed_at')) {
                $table->timestamp('password_changed_at')->nullable()->after('force_password_change');
            }
            if (!Schema::hasColumn('users', 'failed_login_attempts')) {
                $table->integer('failed_login_attempts')->default(0)->after('password_changed_at');
            }
            if (!Schema::hasColumn('users', 'last_failed_login_at')) {
                $table->timestamp('last_failed_login_at')->nullable()->after('failed_login_attempts');
            }
            if (!Schema::hasColumn('users', 'recovery_codes')) {
                $table->text('recovery_codes')->nullable()->after('last_failed_login_at');
            }
        });

        // Inicializar todos los campos 2FA como deshabilitados solo si las columnas existen
        if (Schema::hasColumn('users', 'google2fa_enabled') &&
            Schema::hasColumn('users', 'google2fa_secret') &&
            Schema::hasColumn('users', 'google2fa_enabled_at') &&
            Schema::hasColumn('users', 'recovery_codes')) {

            DB::table('users')->update([
                'google2fa_enabled' => false,
                'google2fa_secret' => null,
                'google2fa_enabled_at' => null,
                'recovery_codes' => null
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'google2fa_secret',
                'google2fa_enabled',
                'google2fa_enabled_at',
                'login_attempts',
                'locked_until',
                'last_login_at',
                'last_login_ip',
                'login_history',
                'force_password_change',
                'password_changed_at',
                'failed_login_attempts',
                'last_failed_login_at',
                'recovery_codes'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
