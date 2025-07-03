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
        Schema::create('campaign_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable(); // mismo session_id que en responses
            $table->string('type'); // scan, open, start, complete, incomplete
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('address')->nullable();
            $table->string('referrer')->nullable(); // de dónde vino (QR, link directo, etc.)
            $table->json('metadata')->nullable(); // información adicional
            $table->timestamps();

            $table->index(['campaign_id', 'type']);
            $table->index(['campaign_id', 'created_at']);
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_interactions');
    }
};
