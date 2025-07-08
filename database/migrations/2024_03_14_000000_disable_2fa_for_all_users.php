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
        DB::table('users')->update([
            'google2fa_enabled' => false,
            'google2fa_secret' => null,
            'google2fa_enabled_at' => null,
            'recovery_codes' => null
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No es necesario revertir esta migración
    }
};
