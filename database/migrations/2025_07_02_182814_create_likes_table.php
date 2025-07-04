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

        // Verificar si los índices existen
        $indexExists = DB::select("
            SELECT 1
            FROM pg_indexes
            WHERE tablename = 'likes'
            AND indexname = 'likes_likeable_type_likeable_id_index'
        ");

        $uniqueIndexExists = DB::select("
            SELECT 1
            FROM pg_indexes
            WHERE tablename = 'likes'
            AND indexname = 'unique_like'
        ");

        Schema::table('likes', function (Blueprint $table) use ($indexExists, $uniqueIndexExists) {
            if (empty($indexExists)) {
                $table->index(['likeable_type', 'likeable_id']);
            }

            if (empty($uniqueIndexExists)) {
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
