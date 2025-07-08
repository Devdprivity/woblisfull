<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Campos para 2FA
            $table->string('google2fa_secret')->nullable()->after('password');
            $table->boolean('google2fa_enabled')->default(false)->after('google2fa_secret');
            $table->timestamp('google2fa_enabled_at')->nullable()->after('google2fa_enabled');

            // Campos para rate limiting y seguridad
            $table->integer('login_attempts')->default(0)->after('google2fa_enabled_at');
            $table->timestamp('locked_until')->nullable()->after('login_attempts');
            $table->timestamp('last_login_at')->nullable()->after('locked_until');
            $table->string('last_login_ip')->nullable()->after('last_login_at');
            $table->text('login_history')->nullable()->after('last_login_ip'); // JSON para historial

            // Campos adicionales de seguridad
            $table->boolean('force_password_change')->default(false)->after('login_history');
            $table->timestamp('password_changed_at')->nullable()->after('force_password_change');
            $table->integer('failed_login_attempts')->default(0)->after('password_changed_at');
            $table->timestamp('last_failed_login_at')->nullable()->after('failed_login_attempts');
            $table->text('recovery_codes')->nullable()->after('last_failed_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
