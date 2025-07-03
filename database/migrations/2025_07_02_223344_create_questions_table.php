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
        if (!Schema::hasTable('questions')) {
            Schema::create('questions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('type'); // text, multiple_choice, checkbox, rating, date
                $table->json('options')->nullable(); // Para preguntas de opción múltiple
                $table->boolean('is_required')->default(false);
                $table->integer('order')->default(0);
                $table->json('validation_rules')->nullable();
                $table->timestamps();

                $table->index(['campaign_id', 'order']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
