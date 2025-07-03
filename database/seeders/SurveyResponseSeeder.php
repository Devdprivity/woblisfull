<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\Question;
use App\Models\Response;
use App\Models\ResponseAnswer;
use Illuminate\Support\Str;

class SurveyResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = Campaign::whereIn('status', ['active', 'completed', 'paused'])->with('questions')->get();

        foreach ($campaigns as $campaign) {
            $this->createResponsesForCampaign($campaign);
        }

        $this->command->info('Se crearon respuestas para todas las campañas activas y completadas.');
    }

    private function createResponsesForCampaign(Campaign $campaign)
    {
        $responseCount = $this->getResponseCount($campaign);

        for ($i = 0; $i < $responseCount; $i++) {
            $isCompleted = $this->shouldBeCompleted($campaign);
            $location = $this->getRandomChileanLocation();

            $response = Response::create([
                'campaign_id' => $campaign->id,
                'session_id' => Str::uuid(),
                'completed' => $isCompleted,
                'latitude' => $location['lat'],
                'longitude' => $location['lng'],
                'address' => $location['address'],
                'city' => $location['city'],
                'country' => 'Chile',
                'ip_address' => $this->getRandomIP(),
                'user_agent' => $this->getRandomUserAgent(),
                'started_at' => $this->getRandomStartTime($campaign),
                'completed_at' => $isCompleted ? now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)) : null,
            ]);

            if ($isCompleted || rand(1, 10) > 3) { // 70% de probabilidad de al menos responder algunas preguntas
                $this->createAnswersForResponse($response, $isCompleted);
            }
        }
    }

    private function getResponseCount(Campaign $campaign)
    {
        switch ($campaign->status) {
            case 'completed':
                return rand(80, min(150, $campaign->max_responses ?? 150));
            case 'active':
                return rand(30, min(100, ($campaign->max_responses ?? 100) * 0.6));
            case 'paused':
                return rand(10, 40);
            default:
                return 0;
        }
    }

    private function shouldBeCompleted(Campaign $campaign)
    {
        $completionRate = match ($campaign->status) {
            'completed' => 0.85, // 85% de completación para campañas completadas
            'active' => 0.65,    // 65% para activas
            'paused' => 0.45,    // 45% para pausadas
            default => 0.5
        };

        return rand(1, 100) <= ($completionRate * 100);
    }

    private function createAnswersForResponse(Response $response, bool $isCompleted)
    {
        $questions = $response->campaign->questions()->orderBy('order')->get();
        $questionsToAnswer = $isCompleted ? $questions : $questions->take(rand(1, max(1, $questions->count() - 2)));

        foreach ($questionsToAnswer as $question) {
            $answer = $this->generateRealisticAnswer($question, $response->campaign);

            if ($answer !== null) {
                ResponseAnswer::create([
                    'response_id' => $response->id,
                    'question_id' => $question->id,
                    'answer' => $answer,
                ]);
            }
        }
    }

    private function generateRealisticAnswer(Question $question, Campaign $campaign)
    {
        switch ($question->type) {
            case 'text':
                return $this->generateTextAnswer($question, $campaign);
            case 'email':
                return $this->generateRandomEmail();
            case 'phone':
                return '+5699' . rand(1000000, 9999999);
            case 'number':
                return $this->generateNumberAnswer($question);
            case 'radio':
            case 'select':
                return $this->selectRandomOption($question);
            case 'checkbox':
                return $this->selectMultipleOptions($question);
            case 'textarea':
                return $this->generateTextareaAnswer($question, $campaign);
            default:
                return null;
        }
    }

    private function generateTextAnswer(Question $question, Campaign $campaign)
    {
        if (str_contains(strtolower($question->question), 'nombre')) {
            $nombres = ['María', 'Carlos', 'Ana', 'José', 'Laura', 'Miguel', 'Sofía', 'Diego', 'Valentina', 'Andrés'];
            return $nombres[array_rand($nombres)];
        }
        return null; // Para campos opcionales de texto
    }

    private function generateRandomEmail()
    {
        $nombres = ['maria', 'carlos', 'ana', 'jose', 'laura', 'miguel', 'sofia', 'diego', 'valentina', 'andres'];
        $dominios = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

        return $nombres[array_rand($nombres)] . rand(1, 999) . '@' . $dominios[array_rand($dominios)];
    }

    private function generateNumberAnswer(Question $question)
    {
        $rules = json_decode($question->validation_rules ?? '[]', true);
        $min = 1;
        $max = 10;

        foreach ($rules as $rule) {
            if (str_starts_with($rule, 'min:')) {
                $min = (int) substr($rule, 4);
            } elseif (str_starts_with($rule, 'max:')) {
                $max = (int) substr($rule, 4);
            }
        }

        return rand($min, $max);
    }

    private function selectRandomOption(Question $question)
    {
        $options = json_decode($question->options, true);
        if (!$options) return null;

        // Simular distribución realista
        if (count($options) === 5) {
            $weights = [0.1, 0.25, 0.3, 0.25, 0.1]; // Distribución normal
        } else {
            $weights = array_fill(0, count($options), 1 / count($options));
        }

        $random = mt_rand() / mt_getrandmax();
        $cumulative = 0;

        foreach ($weights as $index => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $options[$index];
            }
        }

        return $options[array_rand($options)];
    }

    private function selectMultipleOptions(Question $question)
    {
        $options = json_decode($question->options, true);
        if (!$options) return null;

        $selectedCount = rand(1, min(3, count($options))); // Seleccionar 1-3 opciones
        $selected = array_rand($options, $selectedCount);

        if (!is_array($selected)) {
            $selected = [$selected];
        }

        return json_encode(array_map(fn($index) => $options[$index], $selected));
    }

    private function generateTextareaAnswer(Question $question, Campaign $campaign)
    {
        $answers = [
            'Muy buena experiencia en general, seguiré viniendo.',
            'Excelente servicio, muy recomendable.',
            'Algunas cosas por mejorar pero en general bien.',
            'Todo perfecto, sin comentarios adicionales.',
            'El personal muy amable y profesional.',
            'Podrían mejorar los tiempos de espera.',
            'Muy satisfecho con la calidad del servicio.',
            'Buena relación calidad-precio.',
            'Definitivamente volveré pronto.',
            'Superó mis expectativas.',
        ];

        // Solo responder en ~60% de los casos
        return rand(1, 10) <= 6 ? $answers[array_rand($answers)] : null;
    }

    private function getRandomChileanLocation()
    {
        $locations = [
            ['lat' => -33.4569, 'lng' => -70.6483, 'address' => 'Plaza de Armas 123', 'city' => 'Santiago'],
            ['lat' => -33.4372, 'lng' => -70.6506, 'address' => 'Providencia 456', 'city' => 'Providencia'],
            ['lat' => -33.4167, 'lng' => -70.6167, 'address' => 'Las Condes 789', 'city' => 'Las Condes'],
            ['lat' => -33.5183, 'lng' => -70.7269, 'address' => 'Maipú 321', 'city' => 'Maipú'],
            ['lat' => -33.0472, 'lng' => -71.6127, 'address' => 'Valparaíso 654', 'city' => 'Valparaíso'],
            ['lat' => -36.8270, 'lng' => -73.0498, 'address' => 'Concepción 987', 'city' => 'Concepción'],
            ['lat' => -29.9063, 'lng' => -71.2517, 'address' => 'La Serena 147', 'city' => 'La Serena'],
            ['lat' => -39.8196, 'lng' => -73.2452, 'address' => 'Valdivia 258', 'city' => 'Valdivia'],
            ['lat' => -45.8719, 'lng' => -71.2080, 'address' => 'Coyhaique 369', 'city' => 'Coyhaique'],
            ['lat' => -23.6524, 'lng' => -70.3954, 'address' => 'Antofagasta 741', 'city' => 'Antofagasta'],
        ];

        return $locations[array_rand($locations)];
    }

    private function getRandomIP()
    {
        return rand(190, 200) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255);
    }

    private function getRandomUserAgent()
    {
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 14; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        ];

        return $userAgents[array_rand($userAgents)];
    }

    private function getRandomStartTime(Campaign $campaign)
    {
        $start = $campaign->start_date ?? now()->subDays(30);
        $end = $campaign->status === 'completed' ? ($campaign->end_date ?? now()) : now();

        return fake()->dateTimeBetween($start, $end);
    }
}
