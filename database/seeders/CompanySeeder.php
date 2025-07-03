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
        // Obtener roles y planes
        $companyPendingRole = Role::where('name', 'company_pending')->first();
        $companyActiveRole = Role::where('name', 'company_active')->first();

        $plans = Plan::all();

        // Empresas de ejemplo
        $companies = [
            [
                'name' => 'María González',
                'email' => 'maria@techsolutions.cl',
                'company_name' => 'TechSolutions SpA',
                'company_rut' => '77.123.456-7',
                'company_address' => 'Av. Providencia 1234, Providencia, Santiago',
                'company_phone' => '+56 2 2234 5678',
                'status' => 'active',
                'plan_id' => $plans->where('slug', 'pro-pyme')->first()?->id,
                'role_id' => $companyActiveRole?->id,
                'activated_at' => now()->subDays(30),
                'activation_notes' => 'Empresa activada después de verificar documentación.',
            ],
            [
                'name' => 'Carlos Ramírez',
                'email' => 'carlos@innovadigital.cl',
                'company_name' => 'Innova Digital Ltda.',
                'company_rut' => '76.987.654-3',
                'company_address' => 'Av. Las Condes 567, Las Condes, Santiago',
                'company_phone' => '+56 2 2345 6789',
                'status' => 'pending',
                'plan_id' => $plans->where('slug', 'start-pyme')->first()?->id,
                'role_id' => $companyPendingRole?->id,
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana@consultaplus.cl',
                'company_name' => 'Consulta Plus Chile',
                'company_rut' => '77.555.888-9',
                'company_address' => 'Moneda 1230, Santiago Centro, Santiago',
                'company_phone' => '+56 2 2456 7890',
                'status' => 'active',
                'plan_id' => $plans->where('slug', 'woblis-max')->first()?->id,
                'role_id' => $companyActiveRole?->id,
                'activated_at' => now()->subDays(15),
                'activation_notes' => 'Activación express - cliente premium.',
            ],
            [
                'name' => 'Roberto Silva',
                'email' => 'roberto@dataanalytics.cl',
                'company_name' => 'Data Analytics Pro',
                'company_rut' => '76.444.777-2',
                'company_address' => 'Av. Vitacura 2890, Vitacura, Santiago',
                'company_phone' => '+56 2 2567 8901',
                'status' => 'suspended',
                'plan_id' => $plans->where('slug', 'test-lab')->first()?->id,
                'role_id' => $companyActiveRole?->id,
                'activated_at' => now()->subDays(60),
                'activation_notes' => 'Suspendido por falta de pago.',
            ],
            [
                'name' => 'Gabriela Torres',
                'email' => 'gabriela@marketingpro.cl',
                'company_name' => 'Marketing Pro Solutions',
                'company_rut' => '77.999.111-5',
                'company_address' => 'Av. Apoquindo 4567, Las Condes, Santiago',
                'company_phone' => '+56 2 2678 9012',
                'status' => 'pending',
                'plan_id' => $plans->where('slug', 'woblis-ultra')->first()?->id,
                'role_id' => $companyPendingRole?->id,
            ],
        ];

        foreach ($companies as $companyData) {
            User::create([
                'name' => $companyData['name'],
                'email' => $companyData['email'],
                'password' => Hash::make('password123'),
                'account_type' => 'company',
                'company_name' => $companyData['company_name'],
                'company_rut' => $companyData['company_rut'],
                'company_address' => $companyData['company_address'],
                'company_phone' => $companyData['company_phone'],
                'plan_id' => $companyData['plan_id'],
                'role_id' => $companyData['role_id'],
                'status' => $companyData['status'],
                'activated_at' => $companyData['activated_at'] ?? null,
                'activation_notes' => $companyData['activation_notes'] ?? null,
                'provider' => 'email',
                'email_verified_at' => now(),
                'created_at' => now()->subDays(rand(1, 90)),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ 5 empresas creadas exitosamente.');
        $this->command->info('🏢 Empresas creadas:');
        $this->command->info('   • TechSolutions SpA (Activa - Pro Pyme)');
        $this->command->info('   • Innova Digital Ltda. (Pendiente - Start Pyme)');
        $this->command->info('   • Consulta Plus Chile (Activa - Woblis Max)');
        $this->command->info('   • Data Analytics Pro (Suspendida - Test Lab)');
        $this->command->info('   • Marketing Pro Solutions (Pendiente - Woblis Ultra)');
    }
}
