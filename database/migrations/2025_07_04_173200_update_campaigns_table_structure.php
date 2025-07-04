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
        Schema::table('campaigns', function (Blueprint $table) {
            // Renombrar 'name' a 'title'
            $table->renameColumn('name', 'title');

            // Agregar columnas faltantes
            $table->string('client_name')->nullable()->after('description');
            $table->string('client_email')->nullable()->after('client_name');
            $table->string('client_phone')->nullable()->after('client_email');
            $table->text('qr_code')->nullable()->after('client_phone');
            $table->integer('max_responses')->nullable()->after('qr_code');

            // Agregar columnas de estadísticas
            $table->integer('total_scans')->default(0)->after('max_responses');
            $table->integer('total_opens')->default(0)->after('total_scans');
            $table->integer('total_starts')->default(0)->after('total_opens');
            $table->integer('total_completes')->default(0)->after('total_starts');
            $table->integer('total_incompletes')->default(0)->after('total_completes');

            // Cambiar tipo de fecha a datetime
            $table->datetime('start_date')->nullable()->change();
            $table->datetime('end_date')->nullable()->change();

            // Hacer user_id nullable ya que puede no estar siempre presente
            $table->foreignId('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Revertir cambios
            $table->renameColumn('title', 'name');
            $table->dropColumn([
                'client_name',
                'client_email',
                'client_phone',
                'qr_code',
                'max_responses',
                'total_scans',
                'total_opens',
                'total_starts',
                'total_completes',
                'total_incompletes'
            ]);

            // Revertir tipos de fecha
            $table->date('start_date')->nullable()->change();
            $table->date('end_date')->nullable()->change();

            // Revertir user_id a no nullable
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->change();
        });
    }
};
