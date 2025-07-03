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
        if (!Schema::hasTable('responses')) {
            Schema::create('responses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
                $table->string('session_id')->unique(); // identificador único de la sesión
                $table->string('status')->default('started'); // started, completed, abandoned
                $table->datetime('started_at');
                $table->datetime('completed_at')->nullable();
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->string('referrer')->nullable();
                $table->json('metadata')->nullable(); // datos adicionales
                $table->integer('completion_time')->nullable(); // tiempo en segundos
                $table->decimal('completion_percentage', 5, 2)->default(0);
                $table->timestamps();

                $table->index(['campaign_id', 'status']);
                $table->index(['started_at', 'completed_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
