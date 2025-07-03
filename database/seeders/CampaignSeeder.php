<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Support\Str;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener empresas activas para asignar campañas
        $companies = User::where('account_type', 'company')
                        ->where('status', 'active')
                        ->get();

        if ($companies->isEmpty()) {
            $this->command->error('No hay empresas activas. Ejecuta primero CompanySeeder.');
            return;
        }

        $campaigns = [
            [
                'name' => 'Satisfacción del Cliente - Restaurante El Buen Sabor',
                'description' => 'Encuesta para medir la satisfacción de los clientes con nuestro servicio de restaurante y calidad de la comida.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'type' => 'survey',
                'status' => 'active',
                'target_responses' => 200,
                'start_date' => now()->subDays(15)->format('Y-m-d'),
                'end_date' => now()->addDays(15)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => true,
                    'send_notifications' => true,
                ],
            ],
            [
                'name' => 'Evaluación de Experiencia de Compra - TechStore',
                'description' => 'Conocer la experiencia de compra de nuestros clientes en nuestra tienda de tecnología online.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'type' => 'survey',
                'status' => 'active',
                'target_responses' => 500,
                'start_date' => now()->subDays(30)->format('Y-m-d'),
                'end_date' => now()->addDays(30)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => false,
                    'require_location' => false,
                    'send_notifications' => true,
                ],
            ],
            [
                'name' => 'Estudio de Mercado - Productos Ecológicos',
                'description' => 'Investigación sobre preferencias del consumidor chileno respecto a productos ecológicos y sustentables.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'type' => 'survey',
                'status' => 'completed',
                'target_responses' => 1000,
                'start_date' => now()->subDays(60)->format('Y-m-d'),
                'end_date' => now()->subDays(10)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => true,
                    'send_notifications' => false,
                ],
            ],
            [
                'name' => 'Feedback Aplicación Móvil - DeliveryFast',
                'description' => 'Recopilar feedback sobre la nueva versión de nuestra aplicación de delivery.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'type' => 'survey',
                'status' => 'paused',
                'target_responses' => 300,
                'start_date' => now()->subDays(5)->format('Y-m-d'),
                'end_date' => now()->addDays(25)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => false,
                    'send_notifications' => true,
                ],
            ],
            [
                'name' => 'Evaluación de Servicios Bancarios - Banco Digital',
                'description' => 'Encuesta para evaluar la satisfacción con nuestros servicios bancarios digitales.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'type' => 'survey',
                'status' => 'active',
                'target_responses' => 150,
                'start_date' => now()->subDays(5)->format('Y-m-d'),
                'end_date' => now()->addDays(35)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => false,
                    'require_location' => true,
                    'send_notifications' => true,
                ],
            ],
            [
                'name' => 'Investigación de Hábitos de Consumo - Mall Plaza',
                'description' => 'Estudio sobre los hábitos de consumo y preferencias de los visitantes del mall.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'type' => 'survey',
                'status' => 'active',
                'target_responses' => 800,
                'start_date' => now()->subDays(20)->format('Y-m-d'),
                'end_date' => now()->addDays(40)->format('Y-m-d'),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => true,
                    'send_notifications' => false,
                ],
            ],
        ];

        foreach ($campaigns as $campaignData) {
            // Buscar la empresa por email
            $company = $companies->where('email', $campaignData['company_email'])->first();

            if (!$company) {
                $this->command->warn("Empresa no encontrada para email: {$campaignData['company_email']}");
                continue;
            }

            $slug = Str::slug($campaignData['name']);
            $originalSlug = $slug;
            $counter = 1;

            // Asegurar slug único
            while (Campaign::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            Campaign::create([
                'name' => $campaignData['name'],
                'description' => $campaignData['description'],
                'type' => $campaignData['type'],
                'user_id' => $company->id,
                'status' => $campaignData['status'],
                'slug' => $slug,
                'target_responses' => $campaignData['target_responses'],
                'start_date' => $campaignData['start_date'],
                'end_date' => $campaignData['end_date'],
                'settings' => $campaignData['settings'],
            ]);
        }

        $createdCount = Campaign::count();
        $this->command->info("Se crearon {$createdCount} campañas de ejemplo relacionadas con empresas registradas.");

        // Mostrar resumen de campañas por empresa
        $companiesWithCampaigns = $companies->map(function ($company) {
            $campaignCount = Campaign::where('user_id', $company->id)->count();
            return [
                'company' => $company->company_name,
                'campaigns' => $campaignCount
            ];
        })->filter(fn($item) => $item['campaigns'] > 0);

        $this->command->info("📊 Campañas por empresa:");
        foreach ($companiesWithCampaigns as $item) {
            $this->command->info("   • {$item['company']}: {$item['campaigns']} campañas");
        }
    }
}
