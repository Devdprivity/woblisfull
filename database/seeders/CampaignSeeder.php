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
                'title' => 'Satisfacción del Cliente - Restaurante El Buen Sabor',
                'description' => 'Encuesta para medir la satisfacción de los clientes con nuestro servicio de restaurante y calidad de la comida.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'status' => 'active',
                'max_responses' => 200,
                'start_date' => now()->subDays(15),
                'end_date' => now()->addDays(15),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => true,
                    'send_notifications' => true,
                ],
            ],
            [
                'title' => 'Evaluación de Experiencia de Compra - TechStore',
                'description' => 'Conocer la experiencia de compra de nuestros clientes en nuestra tienda de tecnología online.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'status' => 'active',
                'max_responses' => 500,
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(30),
                'settings' => [
                    'allow_anonymous' => false,
                    'require_location' => false,
                    'send_notifications' => true,
                ],
            ],
            [
                'title' => 'Estudio de Mercado - Productos Ecológicos',
                'description' => 'Investigación sobre preferencias del consumidor chileno respecto a productos ecológicos y sustentables.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'status' => 'completed',
                'max_responses' => 1000,
                'start_date' => now()->subDays(60),
                'end_date' => now()->subDays(10),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => true,
                    'send_notifications' => false,
                ],
            ],
            [
                'title' => 'Feedback Aplicación Móvil - DeliveryFast',
                'description' => 'Recopilar feedback sobre la nueva versión de nuestra aplicación de delivery.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'status' => 'paused',
                'max_responses' => 300,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(25),
                'settings' => [
                    'allow_anonymous' => true,
                    'require_location' => false,
                    'send_notifications' => true,
                ],
            ],
            [
                'title' => 'Evaluación de Servicios Bancarios - Banco Digital',
                'description' => 'Encuesta para evaluar la satisfacción con nuestros servicios bancarios digitales.',
                'company_email' => 'maria@techsolutions.cl', // TechSolutions SpA
                'status' => 'active',
                'max_responses' => 150,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(35),
                'settings' => [
                    'allow_anonymous' => false,
                    'require_location' => true,
                    'send_notifications' => true,
                ],
            ],
            [
                'title' => 'Investigación de Hábitos de Consumo - Mall Plaza',
                'description' => 'Estudio sobre los hábitos de consumo y preferencias de los visitantes del mall.',
                'company_email' => 'ana@consultaplus.cl', // Consulta Plus Chile
                'status' => 'active',
                'max_responses' => 800,
                'start_date' => now()->subDays(20),
                'end_date' => now()->addDays(40),
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

            $slug = Str::slug($campaignData['title']);
            $originalSlug = $slug;
            $counter = 1;

            // Asegurar slug único
            while (Campaign::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            Campaign::create([
                'title' => $campaignData['title'],
                'description' => $campaignData['description'],
                'client_name' => $company->name,
                'client_email' => $company->email,
                'client_phone' => $company->company_phone,
                'status' => $campaignData['status'],
                'slug' => $slug,
                'qr_code' => route('survey.show', $slug),
                'max_responses' => $campaignData['max_responses'],
                'start_date' => $campaignData['start_date'],
                'end_date' => $campaignData['end_date'],
                'settings' => $campaignData['settings'],
            ]);
        }

        $createdCount = Campaign::count();
        $this->command->info("Se crearon {$createdCount} campañas de ejemplo relacionadas con empresas registradas.");

        // Mostrar resumen de campañas por empresa
        $companiesWithCampaigns = $companies->map(function ($company) {
            $campaignCount = Campaign::where('client_email', $company->email)->count();
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
