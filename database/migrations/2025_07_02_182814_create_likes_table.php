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
        Schema::table('likes', function (Blueprint $table) {
            // Eliminar índices si existen
            try {
                $table->dropIndex('likes_likeable_type_likeable_id_index');
            } catch (\Exception $e) {
                // El índice no existía, continuamos
            }

            try {
                $table->dropIndex('unique_like');
            } catch (\Exception $e) {
                // El índice no existía, continuamos
            }

            // Crear nuevos índices
            $table->index(['likeable_type', 'likeable_id']);
            $table->unique(['likeable_type', 'likeable_id', 'ip_address', 'session_id'], 'unique_like');
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
