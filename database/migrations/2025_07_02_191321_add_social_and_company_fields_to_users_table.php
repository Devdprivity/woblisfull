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
            // Social login fields
            if (!Schema::hasColumn('users', 'provider')) {
                $table->string('provider')->nullable()->after('email'); // google, facebook, etc.
            }
            if (!Schema::hasColumn('users', 'provider_id')) {
                $table->string('provider_id')->nullable()->after('provider');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('provider_id');
            }

            // Company fields
            if (!Schema::hasColumn('users', 'company_name')) {
                $table->string('company_name')->nullable()->after('avatar');
            }
            if (!Schema::hasColumn('users', 'company_rut')) {
                $table->string('company_rut')->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('users', 'company_address')) {
                $table->text('company_address')->nullable()->after('company_rut');
            }
            if (!Schema::hasColumn('users', 'company_phone')) {
                $table->string('company_phone')->nullable()->after('company_address');
            }
            if (!Schema::hasColumn('users', 'company_industry')) {
                $table->string('company_industry')->nullable()->after('company_phone');
            }
            if (!Schema::hasColumn('users', 'company_size')) {
                $table->string('company_size')->nullable()->after('company_industry'); // small, medium, large
            }

            // Account type and status
            if (!Schema::hasColumn('users', 'account_type')) {
                $table->string('account_type')->default('client')->after('company_size'); // client, company, admin
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->after('account_type'); // active, pending, suspended
            }

            // Role relationship
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->foreignId('role_id')->nullable()->after('status')->constrained('roles')->onDelete('set null');
            }

            // Additional fields
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('role_id');
            }
            if (!Schema::hasColumn('users', 'timezone')) {
                $table->string('timezone')->default('America/Santiago')->after('phone');
            }
            if (!Schema::hasColumn('users', 'language')) {
                $table->string('language')->default('es')->after('timezone');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'provider', 'provider_id', 'avatar',
                'company_name', 'company_rut', 'company_address',
                'company_phone', 'company_industry', 'company_size',
                'account_type', 'status', 'role_id', 'phone',
                'timezone', 'language'
            ]);
        });
    }
};
