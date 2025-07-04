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
        // Usar SQL raw para mayor compatibilidad con PostgreSQL
        try {
            // Verificar si la tabla questions existe
            if (!Schema::hasTable('questions')) {
                return;
            }

            $columns = Schema::getColumnListing('questions');

            // Renombrar columnas si es necesario
            if (in_array('title', $columns) && !in_array('question', $columns)) {
                DB::statement('ALTER TABLE questions RENAME COLUMN title TO question');
            }

            if (in_array('description', $columns) && !in_array('help_text', $columns)) {
                DB::statement('ALTER TABLE questions RENAME COLUMN description TO help_text');
            }

            if (in_array('is_required', $columns) && !in_array('required', $columns)) {
                DB::statement('ALTER TABLE questions RENAME COLUMN is_required TO required');
            }

        } catch (\Exception $e) {
            // Log error pero no fallar la migración
            \Log::error('Error in force_update_questions_structure: ' . $e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No revertir para evitar problemas
    }
};
