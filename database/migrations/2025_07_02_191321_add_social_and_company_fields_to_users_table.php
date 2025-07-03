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
        Schema::table('users', function (Blueprint $table) {
            // Social auth fields
            $table->string('google_id')->nullable()->unique();
            $table->string('avatar')->nullable();
            $table->string('provider')->nullable(); // google, email

            // Company fields
            $table->enum('account_type', ['client', 'company'])->default('client');
            $table->string('company_name')->nullable();
            $table->string('company_rut')->nullable();
            $table->string('company_address')->nullable();
            $table->string('company_phone')->nullable();
            $table->foreignId('plan_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('role_id')->nullable()->constrained()->onDelete('set null');

            // Account status
            $table->enum('status', ['pending', 'active', 'suspended'])->default('active');
            $table->timestamp('activated_at')->nullable();
            $table->text('activation_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'google_id',
                'avatar',
                'provider',
                'account_type',
                'company_name',
                'company_rut',
                'company_address',
                'company_phone',
                'plan_id',
                'role_id',
                'status',
                'activated_at',
                'activation_notes'
            ]);
        });
    }
};
