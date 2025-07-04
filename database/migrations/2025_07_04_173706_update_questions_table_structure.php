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
        Schema::table('questions', function (Blueprint $table) {
            // Renombrar columnas para que coincidan con el modelo
            $table->renameColumn('title', 'question');
            $table->renameColumn('description', 'help_text');
            $table->renameColumn('is_required', 'required');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Revertir cambios
            $table->renameColumn('question', 'title');
            $table->renameColumn('help_text', 'description');
            $table->renameColumn('required', 'is_required');
        });
    }
};
