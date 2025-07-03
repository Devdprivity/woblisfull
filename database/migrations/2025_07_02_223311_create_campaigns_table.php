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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone')->nullable();
            $table->string('status')->default('draft'); // draft, active, paused, completed
            $table->string('slug')->unique();
            $table->string('qr_code')->nullable();
            $table->json('settings')->nullable(); // configuraciones adicionales
            $table->integer('max_responses')->nullable(); // límite máximo de respuestas
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
            $table->integer('total_scans')->default(0);
            $table->integer('total_opens')->default(0);
            $table->integer('total_starts')->default(0);
            $table->integer('total_completes')->default(0);
            $table->integer('total_incompletes')->default(0);
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('client_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
