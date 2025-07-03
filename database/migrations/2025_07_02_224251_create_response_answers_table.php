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
        if (!Schema::hasTable('response_answers')) {
            Schema::create('response_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('response_id')->constrained()->onDelete('cascade');
                $table->foreignId('question_id')->constrained()->onDelete('cascade');
                $table->text('answer'); // respuesta del usuario
                $table->timestamps();

                $table->index(['response_id', 'question_id']);
                $table->unique(['response_id', 'question_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_answers');
    }
};
