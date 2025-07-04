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
        if (!Schema::hasTable('likes')) {
            Schema::create('likes', function (Blueprint $table) {
                $table->id();
                $table->morphs('likeable');
                $table->string('ip_address');
                $table->string('user_agent')->nullable();
                $table->string('session_id')->nullable();
                $table->timestamps();
            });
        }

        // Verificar y crear índices si no existen
        $schemaManager = DB::connection()->getDoctrineSchemaManager();
        $indexes = $schemaManager->listTableIndexes('likes');

        Schema::table('likes', function (Blueprint $table) use ($indexes) {
            // Crear índices solo si no existen
            if (!isset($indexes['likes_likeable_type_likeable_id_index'])) {
                $table->index(['likeable_type', 'likeable_id']);
            }

            if (!isset($indexes['unique_like'])) {
                $table->unique(['likeable_type', 'likeable_id', 'ip_address', 'session_id'], 'unique_like');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
