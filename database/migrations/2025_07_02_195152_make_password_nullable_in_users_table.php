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
        // Verificar si la columna password ya es nullable
        $columns = Schema::getColumnListing('users');
        if (in_array('password', $columns)) {
            $columnType = DB::select("SELECT is_nullable FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password'");
            if (!empty($columnType) && $columnType[0]->is_nullable === 'NO') {
                Schema::table('users', function (Blueprint $table) {
                    $table->string('password')->nullable()->change();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable(false)->change();
        });
    }
};
