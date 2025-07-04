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

                // Índices para mejorar el rendimiento
                $table->index(['likeable_type', 'likeable_id']);
                $table->index('created_at');

                // Evitar likes duplicados por sesión/IP
                $table->unique(['likeable_type', 'likeable_id', 'ip_address', 'session_id'], 'unique_like');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
