<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener roles
        $companyRole = Role::where('name', 'company_active')->first() ?? Role::where('name', 'client')->first();

        if (!$companyRole) {
            $this->command->error('❌ No se encontró rol de company. Ejecuta RoleSeeder primero.');
            return;
        }

        // Empresas de ejemplo
        $companies = [
            [
                'name' => 'María González',
                'email' => 'maria@techsolutions.cl',
                'company_name' => 'TechSolutions SpA',
                'company_rut' => '77.123.456-7',
                'company_address' => 'Av. Providencia 1234, Providencia, Santiago',
                'company_phone' => '+56 2 2234 5678',
                'company_industry' => 'Tecnología',
                'company_size' => 'medium',
                'status' => 'active',
            ],
            [
                'name' => 'Carlos Ramírez',
                'email' => 'carlos@innovadigital.cl',
                'company_name' => 'Innova Digital Ltda.',
                'company_rut' => '76.987.654-3',
                'company_address' => 'Av. Las Condes 567, Las Condes, Santiago',
                'company_phone' => '+56 2 2345 6789',
                'company_industry' => 'Marketing Digital',
                'company_size' => 'small',
                'status' => 'pending',
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana@consultaplus.cl',
                'company_name' => 'Consulta Plus Chile',
                'company_rut' => '77.555.888-9',
                'company_address' => 'Moneda 1230, Santiago Centro, Santiago',
                'company_phone' => '+56 2 2456 7890',
                'company_industry' => 'Consultoría',
                'company_size' => 'large',
                'status' => 'active',
            ],
            [
                'name' => 'Roberto Silva',
                'email' => 'roberto@dataanalytics.cl',
                'company_name' => 'Data Analytics Pro',
                'company_rut' => '76.444.777-2',
                'company_address' => 'Av. Vitacura 2890, Vitacura, Santiago',
                'company_phone' => '+56 2 2567 8901',
                'company_industry' => 'Análisis de Datos',
                'company_size' => 'medium',
                'status' => 'suspended',
            ],
            [
                'name' => 'Gabriela Torres',
                'email' => 'gabriela@marketingpro.cl',
                'company_name' => 'Marketing Pro Solutions',
                'company_rut' => '77.999.111-5',
                'company_address' => 'Av. Apoquindo 4567, Las Condes, Santiago',
                'company_phone' => '+56 2 2678 9012',
                'company_industry' => 'Marketing y Publicidad',
                'company_size' => 'large',
                'status' => 'pending',
            ],
        ];

        foreach ($companies as $companyData) {
            if (!User::where('email', $companyData['email'])->exists()) {
                User::create([
                    'name' => $companyData['name'],
                    'email' => $companyData['email'],
                    'password' => Hash::make('password123'),
                    'account_type' => 'company',
                    'company_name' => $companyData['company_name'],
                    'company_rut' => $companyData['company_rut'],
                    'company_address' => $companyData['company_address'],
                    'company_phone' => $companyData['company_phone'],
                    'company_industry' => $companyData['company_industry'],
                    'company_size' => $companyData['company_size'],
                    'role_id' => $companyRole->id,
                    'status' => $companyData['status'],
                    'provider' => 'email',
                    'email_verified_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $createdCount = User::where('account_type', 'company')->count();
        $this->command->info("✅ {$createdCount} empresas verificadas/creadas exitosamente.");
        $this->command->info('🏢 Empresas en base de datos:');
        $this->command->info('   • TechSolutions SpA (Activa - Tecnología)');
        $this->command->info('   • Innova Digital Ltda. (Pendiente - Marketing Digital)');
        $this->command->info('   • Consulta Plus Chile (Activa - Consultoría)');
        $this->command->info('   • Data Analytics Pro (Suspendida - Análisis de Datos)');
        $this->command->info('   • Marketing Pro Solutions (Pendiente - Marketing y Publicidad)');
    }
}
