<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Start Pyme',
                'slug' => 'start-pyme',
                'price' => 120000.00,
                'billing_cycle' => 'monthly',
                'description' => 'Tu primer acercamiento a datos reales en terreno. 100 respuestas validadas, ideal para explorar el modelo, medir impacto inicial o tomar decisiones puntuales sin comprometer tu presupuesto.',
                'features' => [
                    '100 respuestas validadas',
                    'Ideal para explorar el modelo',
                    'Medir impacto inicial',
                    'Decisiones puntuales',
                    'Sin comprometer presupuesto',
                    'Entrega en 48 horas hábiles',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Pro Pyme',
                'slug' => 'pro-pyme',
                'price' => 330000.00,
                'billing_cycle' => 'monthly',
                'description' => 'Datos más robustos para decisiones más precisas. 300 respuestas validadas con segmentación por zona incluida. Ideal para escalar tu análisis, detectar patrones y crecer con base real.',
                'features' => [
                    '300 respuestas validadas',
                    'Segmentación por zona incluida',
                    'Escalar análisis',
                    'Detectar patrones',
                    'Crecer con base real',
                    'Entrega en 48 horas hábiles',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Test Lab',
                'slug' => 'test-lab',
                'price' => 500000.00,
                'billing_cycle' => 'monthly',
                'description' => 'Lanza un piloto validado, sin burocracia ni esperas. 500 respuestas rápidas y confiables para testear campañas, conceptos o productos con datos reales.',
                'features' => [
                    '500 respuestas rápidas y confiables',
                    'Testear campañas',
                    'Testear conceptos o productos',
                    'Datos reales',
                    'Sin burocracia ni esperas',
                    'Entrega en 72 horas hábiles',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Woblis Max',
                'slug' => 'woblis-max',
                'price' => 950000.00,
                'billing_cycle' => 'monthly',
                'description' => '1.000 respuestas reales para respaldar tus decisiones estratégicas. Data validada, lista para presentación en comités o directorios. Ideal para evaluar campañas, comparar resultados y hacer benchmarking con confianza.',
                'features' => [
                    '1.000 respuestas reales',
                    'Data validada para presentaciones',
                    'Lista para comités o directorios',
                    'Evaluar campañas',
                    'Comparar resultados',
                    'Benchmarking con confianza',
                    'Entrega en 4 días hábiles',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Woblis Ultra',
                'slug' => 'woblis-ultra',
                'price' => 2200000.00,
                'billing_cycle' => 'monthly',
                'description' => 'Obtén 3.000 respuestas segmentadas, visualizadas en un dashboard, junto a un informe con recomendaciones clave para tu equipo.',
                'features' => [
                    '3.000 respuestas segmentadas',
                    'Dashboard con visualizaciones',
                    'Informe con recomendaciones clave',
                    'Para equipos estratégicos',
                    'Entrega garantizada',
                    'Entrega en 15 días hábiles',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 5,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }
    }
}
