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
            // Verificar si la columna 'name' existe y renombrarla a 'title'
            $columns = Schema::getColumnListing('campaigns');

            if (in_array('name', $columns) && !in_array('title', $columns)) {
                DB::statement('ALTER TABLE campaigns RENAME COLUMN name TO title');
            }

            // Agregar columnas faltantes una por una
            $this->addColumnIfNotExists('campaigns', 'client_name', 'VARCHAR(255)');
            $this->addColumnIfNotExists('campaigns', 'client_email', 'VARCHAR(255)');
            $this->addColumnIfNotExists('campaigns', 'client_phone', 'VARCHAR(255)');
            $this->addColumnIfNotExists('campaigns', 'qr_code', 'TEXT');
            $this->addColumnIfNotExists('campaigns', 'max_responses', 'INTEGER');
            $this->addColumnIfNotExists('campaigns', 'total_scans', 'INTEGER DEFAULT 0');
            $this->addColumnIfNotExists('campaigns', 'total_opens', 'INTEGER DEFAULT 0');
            $this->addColumnIfNotExists('campaigns', 'total_starts', 'INTEGER DEFAULT 0');
            $this->addColumnIfNotExists('campaigns', 'total_completes', 'INTEGER DEFAULT 0');
            $this->addColumnIfNotExists('campaigns', 'total_incompletes', 'INTEGER DEFAULT 0');

            // Cambiar tipos de fecha si es necesario
            DB::statement('ALTER TABLE campaigns ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::timestamp');
            DB::statement('ALTER TABLE campaigns ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::timestamp');

            // Hacer user_id nullable si no lo es
            DB::statement('ALTER TABLE campaigns ALTER COLUMN user_id DROP NOT NULL');

        } catch (\Exception $e) {
            // Log error pero no fallar la migración
            \Log::error('Error in force_update_campaigns_structure: ' . $e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No revertir para evitar problemas
    }

    private function addColumnIfNotExists($table, $column, $definition)
    {
        try {
            $columns = Schema::getColumnListing($table);
            if (!in_array($column, $columns)) {
                DB::statement("ALTER TABLE {$table} ADD COLUMN {$column} {$definition}");
            }
        } catch (\Exception $e) {
            \Log::error("Error adding column {$column} to {$table}: " . $e->getMessage());
        }
    }
};
