<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = Campaign::all();

        foreach ($campaigns as $campaign) {
            $this->createQuestionsForCampaign($campaign);
        }

        $this->command->info('Se crearon preguntas para todas las campañas.');
    }

    private function createQuestionsForCampaign(Campaign $campaign)
    {
        $questions = [];

        switch (true) {
            case str_contains($campaign->title, 'Satisfacción del Cliente - Restaurante'):
                $questions = $this->getRestaurantQuestions();
                break;
            case str_contains($campaign->title, 'Experiencia de Compra - TechStore'):
                $questions = $this->getTechStoreQuestions();
                break;
            case str_contains($campaign->title, 'Productos Ecológicos'):
                $questions = $this->getEcologicalQuestions();
                break;
            case str_contains($campaign->title, 'Aplicación Móvil'):
                $questions = $this->getAppFeedbackQuestions();
                break;
            case str_contains($campaign->title, 'Servicios Bancarios'):
                $questions = $this->getBankingQuestions();
                break;
            case str_contains($campaign->title, 'Hábitos de Consumo'):
                $questions = $this->getConsumptionQuestions();
                break;
        }

        foreach ($questions as $index => $questionData) {
            Question::create([
                ...$questionData,
                'campaign_id' => $campaign->id,
                'order' => $index + 1,
            ]);
        }
    }

    private function getRestaurantQuestions()
    {
        return [
            [
                'question' => '¿Cuál es tu nombre? (Opcional)',
                'type' => 'text',
                'required' => false,
                'help_text' => 'Tu nombre nos ayuda a personalizar el servicio'
            ],
            [
                'question' => '¿Cómo calificarías la calidad de la comida?',
                'type' => 'radio',
                'options' => json_encode(['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo calificarías la atención del personal?',
                'type' => 'radio',
                'options' => json_encode(['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']),
                'required' => true,
            ],
            [
                'question' => '¿Qué platos ordenaste? (Selecciona todos los que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['Entrada', 'Plato principal', 'Postre', 'Bebidas', 'Menu del día']),
                'required' => true,
            ],
            [
                'question' => '¿Cuánto tiempo esperaste por tu pedido?',
                'type' => 'select',
                'options' => json_encode(['Menos de 10 minutos', '10-20 minutos', '21-30 minutos', '31-45 minutos', 'Más de 45 minutos']),
                'required' => true,
            ],
            [
                'question' => 'Califíca del 1 al 10 la limpieza del local',
                'type' => 'number',
                'validation_rules' => json_encode(['min:1', 'max:10']),
                'required' => true,
            ],
            [
                'question' => '¿Recomendarías nuestro restaurante?',
                'type' => 'radio',
                'options' => json_encode(['Definitivamente sí', 'Probablemente sí', 'No estoy seguro', 'Probablemente no', 'Definitivamente no']),
                'required' => true,
            ],
            [
                'question' => '¿Tienes algún comentario adicional?',
                'type' => 'textarea',
                'required' => false,
                'help_text' => 'Cualquier sugerencia o comentario es bienvenido'
            ],
        ];
    }

    private function getTechStoreQuestions()
    {
        return [
            [
                'question' => 'Tu correo electrónico',
                'type' => 'email',
                'required' => true,
                'help_text' => 'Para poder contactarte sobre tu experiencia'
            ],
            [
                'question' => '¿Qué tipo de producto compraste?',
                'type' => 'select',
                'options' => json_encode(['Smartphone', 'Laptop', 'Tablet', 'Accesorios', 'Audio', 'Gaming', 'Otro']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo calificarías la facilidad de navegación en nuestra web?',
                'type' => 'radio',
                'options' => json_encode(['Muy fácil', 'Fácil', 'Regular', 'Difícil', 'Muy difícil']),
                'required' => true,
            ],
            [
                'question' => '¿El proceso de compra fue intuitivo?',
                'type' => 'radio',
                'options' => json_encode(['Totalmente de acuerdo', 'De acuerdo', 'Neutro', 'En desacuerdo', 'Totalmente en desacuerdo']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo calificarías el tiempo de entrega?',
                'type' => 'radio',
                'options' => json_encode(['Más rápido de lo esperado', 'Como esperaba', 'Un poco lento', 'Muy lento']),
                'required' => true,
            ],
            [
                'question' => '¿Qué aspectos mejorarías? (Selecciona todos los que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['Velocidad del sitio', 'Proceso de pago', 'Información de productos', 'Servicio al cliente', 'Tiempo de entrega', 'Embalaje']),
                'required' => false,
            ],
            [
                'question' => 'Del 1 al 10, ¿qué probabilidad hay de que nos recomiendes?',
                'type' => 'number',
                'validation_rules' => json_encode(['min:1', 'max:10']),
                'required' => true,
                'help_text' => 'Siendo 10 muy probable y 1 nada probable'
            ],
        ];
    }

    private function getEcologicalQuestions()
    {
        return [
            [
                'question' => '¿Cuál es tu rango de edad?',
                'type' => 'select',
                'options' => json_encode(['18-25', '26-35', '36-45', '46-55', '56-65', 'Más de 65']),
                'required' => true,
            ],
            [
                'question' => '¿Qué tan importante es para ti comprar productos ecológicos?',
                'type' => 'radio',
                'options' => json_encode(['Muy importante', 'Importante', 'Moderadamente importante', 'Poco importante', 'Nada importante']),
                'required' => true,
            ],
            [
                'question' => '¿Qué factores influyen en tu decisión de compra ecológica? (Selecciona todos los que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['Precio', 'Calidad', 'Impacto ambiental', 'Salud personal', 'Valores éticos', 'Disponibilidad']),
                'required' => true,
            ],
            [
                'question' => '¿Cuánto más estarías dispuesto a pagar por un producto ecológico?',
                'type' => 'radio',
                'options' => json_encode(['Hasta 10% más', '11-20% más', '21-30% más', '31-50% más', 'Más del 50%', 'Nada extra']),
                'required' => true,
            ],
            [
                'question' => '¿Dónde prefieres comprar productos ecológicos?',
                'type' => 'checkbox',
                'options' => json_encode(['Supermercados', 'Tiendas especializadas', 'Ferias orgánicas', 'Online', 'Directamente del productor']),
                'required' => true,
            ],
            [
                'question' => '¿Qué categorías de productos ecológicos compras regularmente?',
                'type' => 'checkbox',
                'options' => json_encode(['Alimentación', 'Productos de limpieza', 'Cosméticos', 'Ropa', 'Productos para el hogar', 'Ninguna']),
                'required' => true,
            ],
            [
                'question' => '¿Qué te impide comprar más productos ecológicos?',
                'type' => 'textarea',
                'required' => false,
                'help_text' => 'Describe los principales obstáculos que encuentras'
            ],
        ];
    }

    private function getAppFeedbackQuestions()
    {
        return [
            [
                'question' => '¿Qué dispositivo usas principalmente?',
                'type' => 'radio',
                'options' => json_encode(['iPhone', 'Android', 'Ambos']),
                'required' => true,
            ],
            [
                'question' => '¿Con qué frecuencia usas la app?',
                'type' => 'radio',
                'options' => json_encode(['Diariamente', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Primera vez']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo calificarías la nueva interfaz?',
                'type' => 'radio',
                'options' => json_encode(['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']),
                'required' => true,
            ],
            [
                'question' => '¿La app es más rápida que la versión anterior?',
                'type' => 'radio',
                'options' => json_encode(['Mucho más rápida', 'Más rápida', 'Igual', 'Más lenta', 'Mucho más lenta', 'No usé la versión anterior']),
                'required' => true,
            ],
            [
                'question' => '¿Qué funciones nuevas has usado? (Selecciona todas las que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['Seguimiento en tiempo real', 'Chat con repartidor', 'Programar pedidos', 'Favoritos mejorados', 'Ninguna']),
                'required' => true,
            ],
            [
                'question' => '¿Has experimentado algún problema?',
                'type' => 'checkbox',
                'options' => json_encode(['App se cierra inesperadamente', 'Carga lenta', 'Problemas de pago', 'GPS impreciso', 'Ningún problema']),
                'required' => false,
            ],
            [
                'question' => 'Describe tu experiencia general con la nueva versión',
                'type' => 'textarea',
                'required' => false,
            ],
        ];
    }

    private function getBankingQuestions()
    {
        return [
            [
                'question' => 'Tu número de teléfono',
                'type' => 'phone',
                'required' => true,
                'help_text' => 'Para verificar tu identidad como cliente'
            ],
            [
                'question' => '¿Cuáles servicios bancarios digitales usas? (Selecciona todos los que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['App móvil', 'Banca web', 'Transferencias', 'Pago de cuentas', 'Inversiones', 'Ninguno']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo calificarías la seguridad de nuestros servicios digitales?',
                'type' => 'radio',
                'options' => json_encode(['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']),
                'required' => true,
            ],
            [
                'question' => '¿La plataforma digital es fácil de usar?',
                'type' => 'radio',
                'options' => json_encode(['Muy fácil', 'Fácil', 'Regular', 'Difícil', 'Muy difícil']),
                'required' => true,
            ],
            [
                'question' => '¿Has necesitado ayuda del servicio al cliente?',
                'type' => 'radio',
                'options' => json_encode(['Sí, varias veces', 'Sí, una vez', 'No, nunca']),
                'required' => true,
            ],
            [
                'question' => 'Si usaste servicio al cliente, ¿cómo fue tu experiencia?',
                'type' => 'radio',
                'options' => json_encode(['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala', 'No aplica']),
                'required' => false,
            ],
            [
                'question' => '¿Qué tan probable es que recomiendes nuestros servicios digitales?',
                'type' => 'number',
                'validation_rules' => json_encode(['min:1', 'max:10']),
                'required' => true,
            ],
        ];
    }

    private function getConsumptionQuestions()
    {
        return [
            [
                'question' => '¿Con qué frecuencia visitas el mall?',
                'type' => 'radio',
                'options' => json_encode(['Varias veces por semana', 'Una vez por semana', 'Una vez al mes', 'Ocasionalmente', 'Primera vez']),
                'required' => true,
            ],
            [
                'question' => '¿Cuál es tu principal motivo de visita hoy?',
                'type' => 'radio',
                'options' => json_encode(['Compras necesarias', 'Entretenimiento', 'Comer', 'Pasear', 'Cine', 'Servicios']),
                'required' => true,
            ],
            [
                'question' => '¿En qué categorías has comprado hoy? (Selecciona todas las que apliquen)',
                'type' => 'checkbox',
                'options' => json_encode(['Ropa', 'Calzado', 'Tecnología', 'Hogar', 'Belleza', 'Deportes', 'Comida', 'Ninguna']),
                'required' => true,
            ],
            [
                'question' => '¿Cuánto dinero aproximadamente has gastado hoy?',
                'type' => 'select',
                'options' => json_encode(['Menos de $20.000', '$20.000 - $50.000', '$50.001 - $100.000', '$100.001 - $200.000', 'Más de $200.000']),
                'required' => false,
            ],
            [
                'question' => '¿Qué factores influyen más en tu decisión de compra?',
                'type' => 'checkbox',
                'options' => json_encode(['Precio', 'Calidad', 'Marca', 'Ofertas/Descuentos', 'Recomendaciones', 'Novedad']),
                'required' => true,
            ],
            [
                'question' => '¿Cómo prefieres pagar?',
                'type' => 'radio',
                'options' => json_encode(['Efectivo', 'Tarjeta de débito', 'Tarjeta de crédito', 'Transferencia', 'App de pago']),
                'required' => true,
            ],
            [
                'question' => '¿Qué servicios adicionales te gustaría ver en el mall?',
                'type' => 'textarea',
                'required' => false,
                'help_text' => 'Sugerencias para mejorar tu experiencia'
            ],
        ];
    }
}
