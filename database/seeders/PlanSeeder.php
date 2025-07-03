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
                'category' => 'pyme',
                'price' => 120000,
                'description' => 'Tu primer acercamiento a datos reales en terreno. 100 respuestas validadas, ideal para explorar el modelo, medir impacto inicial o tomar decisiones puntuales sin comprometer tu presupuesto.',
                'responses_included' => 100,
                'delivery_time' => '48 horas hábiles',
                'features' => [
                    '100 respuestas validadas',
                    'Ideal para explorar el modelo',
                    'Medir impacto inicial',
                    'Decisiones puntuales',
                    'Sin comprometer presupuesto',
                ],
                'sort_order' => 1,
            ],
            [
                'name' => 'Pro Pyme',
                'slug' => 'pro-pyme',
                'category' => 'pyme',
                'price' => 330000,
                'description' => 'Datos más robustos para decisiones más precisas. 300 respuestas validadas con segmentación por zona incluida. Ideal para escalar tu análisis, detectar patrones y crecer con base real.',
                'responses_included' => 300,
                'delivery_time' => '48 horas hábiles',
                'features' => [
                    '300 respuestas validadas',
                    'Segmentación por zona incluida',
                    'Escalar análisis',
                    'Detectar patrones',
                    'Crecer con base real',
                ],
                'sort_order' => 2,
            ],
            [
                'name' => 'Test Lab',
                'slug' => 'test-lab',
                'category' => 'corp',
                'price' => 500000,
                'description' => 'Lanza un piloto validado, sin burocracia ni esperas. 500 respuestas rápidas y confiables para testear campañas, conceptos o productos con datos reales.',
                'responses_included' => 500,
                'delivery_time' => '72 horas hábiles',
                'features' => [
                    '500 respuestas rápidas y confiables',
                    'Testear campañas',
                    'Testear conceptos o productos',
                    'Datos reales',
                    'Sin burocracia ni esperas',
                ],
                'sort_order' => 3,
            ],
            [
                'name' => 'Woblis Max',
                'slug' => 'woblis-max',
                'category' => 'corp',
                'price' => 950000,
                'description' => '1.000 respuestas reales para respaldar tus decisiones estratégicas. Data validada, lista para presentación en comités o directorios. Ideal para evaluar campañas, comparar resultados y hacer benchmarking con confianza.',
                'responses_included' => 1000,
                'delivery_time' => '4 días hábiles',
                'features' => [
                    '1.000 respuestas reales',
                    'Data validada para presentaciones',
                    'Lista para comités o directorios',
                    'Evaluar campañas',
                    'Comparar resultados',
                    'Benchmarking con confianza',
                ],
                'sort_order' => 4,
            ],
            [
                'name' => 'Woblis Ultra',
                'slug' => 'woblis-ultra',
                'category' => 'corp',
                'price' => 2200000,
                'description' => 'Obtén 3.000 respuestas segmentadas, visualizadas en un dashboard, junto a un informe con recomendaciones clave para tu equipo.',
                'responses_included' => 3000,
                'delivery_time' => '15 días hábiles',
                'features' => [
                    '3.000 respuestas segmentadas',
                    'Dashboard con visualizaciones',
                    'Informe con recomendaciones clave',
                    'Para equipos estratégicos',
                    'Entrega garantizada',
                ],
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
