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
        if (!Schema::hasTable('campaigns')) {
            Schema::create('campaigns', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('type'); // survey, quiz, poll
                $table->string('status')->default('draft'); // draft, active, paused, completed
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->json('settings')->nullable();
                $table->integer('target_responses')->nullable();
                $table->integer('actual_responses')->default(0);
                $table->timestamps();

                $table->index(['status', 'type']);
                $table->index(['user_id', 'status']);
                $table->index(['start_date', 'end_date']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
