<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\CampaignInteraction;
use App\Models\Response;

class CampaignInteractionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = Campaign::whereIn('status', ['active', 'completed', 'paused'])->get();

        foreach ($campaigns as $campaign) {
            $this->createInteractionsForCampaign($campaign);
        }

        $this->command->info('Se crearon interacciones para todas las campañas activas y completadas.');
    }

    private function createInteractionsForCampaign(Campaign $campaign)
    {
        // Obtener estadísticas base según el estado de la campaña
        $stats = $this->getCampaignStats($campaign);

        // Crear interacciones de escaneo QR
        $this->createQRScans($campaign, $stats['qr_scans']);

        // Crear interacciones de apertura de página
        $this->createPageOpens($campaign, $stats['page_opens']);

        // Crear interacciones de inicio de encuesta
        $this->createSurveyStarts($campaign, $stats['survey_starts']);

        // Actualizar estadísticas de la campaña
        $this->updateCampaignStats($campaign, $stats);
    }

    private function getCampaignStats(Campaign $campaign)
    {
        // Obtener respuestas existentes para calcular métricas realistas
        $responses = Response::where('campaign_id', $campaign->id)->get();
        $completedResponses = $responses->where('completed', true)->count();
        $totalResponses = $responses->count();

        // Calcular métricas según el estado de la campaña
        switch ($campaign->status) {
            case 'completed':
                $qrScans = rand(200, 400);
                $pageOpens = (int) ($qrScans * 0.85); // 85% de los escaneos abren la página
                $surveyStarts = (int) ($pageOpens * 0.70); // 70% de los que abren inician
                break;
            case 'active':
                $qrScans = rand(100, 250);
                $pageOpens = (int) ($qrScans * 0.80);
                $surveyStarts = (int) ($pageOpens * 0.65);
                break;
            case 'paused':
                $qrScans = rand(50, 120);
                $pageOpens = (int) ($qrScans * 0.75);
                $surveyStarts = (int) ($pageOpens * 0.60);
                break;
            default:
                $qrScans = $pageOpens = $surveyStarts = 0;
        }

        return [
            'qr_scans' => $qrScans,
            'page_opens' => $pageOpens,
            'survey_starts' => $surveyStarts,
            'survey_completions' => $completedResponses,
            'total_responses' => $totalResponses,
        ];
    }

    private function createQRScans(Campaign $campaign, int $count)
    {
        for ($i = 0; $i < $count; $i++) {
            CampaignInteraction::create([
                'campaign_id' => $campaign->id,
                'type' => 'scan',
                'session_id' => $this->generateSessionId(),
                'ip_address' => $this->getRandomIP(),
                'user_agent' => $this->getRandomUserAgent(),
                'referrer' => null,
                'latitude' => $this->getRandomLatitude(),
                'longitude' => $this->getRandomLongitude(),
                'address' => $this->getRandomAddress(),
                'metadata' => json_encode([
                    'device_type' => $this->getRandomDeviceType(),
                    'scan_location' => $this->getRandomScanLocation(),
                ]),
                'created_at' => $this->getRandomInteractionTime($campaign),
            ]);
        }
    }

    private function createPageOpens(Campaign $campaign, int $count)
    {
        for ($i = 0; $i < $count; $i++) {
            CampaignInteraction::create([
                'campaign_id' => $campaign->id,
                'type' => 'open',
                'session_id' => $this->generateSessionId(),
                'ip_address' => $this->getRandomIP(),
                'user_agent' => $this->getRandomUserAgent(),
                'referrer' => rand(1, 10) <= 8 ? 'qr_code' : 'https://google.com',
                'latitude' => $this->getRandomLatitude(),
                'longitude' => $this->getRandomLongitude(),
                'address' => $this->getRandomAddress(),
                'metadata' => json_encode([
                    'device_type' => $this->getRandomDeviceType(),
                    'browser' => $this->getRandomBrowser(),
                    'load_time' => rand(800, 3500), // ms
                ]),
                'created_at' => $this->getRandomInteractionTime($campaign),
            ]);
        }
    }

    private function createSurveyStarts(Campaign $campaign, int $count)
    {
        for ($i = 0; $i < $count; $i++) {
            CampaignInteraction::create([
                'campaign_id' => $campaign->id,
                'type' => 'start',
                'session_id' => $this->generateSessionId(),
                'ip_address' => $this->getRandomIP(),
                'user_agent' => $this->getRandomUserAgent(),
                'referrer' => 'survey_page',
                'latitude' => $this->getRandomLatitude(),
                'longitude' => $this->getRandomLongitude(),
                'address' => $this->getRandomAddress(),
                'metadata' => json_encode([
                    'device_type' => $this->getRandomDeviceType(),
                    'first_question_id' => $campaign->questions()->orderBy('order')->first()?->id,
                    'start_method' => rand(1, 10) <= 7 ? 'qr_scan' : 'direct_link',
                ]),
                'created_at' => $this->getRandomInteractionTime($campaign),
            ]);
        }
    }

    private function updateCampaignStats(Campaign $campaign, array $stats)
    {
        $campaign->update([
            'total_scans' => $stats['qr_scans'],
            'total_opens' => $stats['page_opens'],
            'total_starts' => $stats['survey_starts'],
            'total_completes' => $stats['survey_completions'],
            'total_incompletes' => $stats['total_responses'] - $stats['survey_completions'],
        ]);
    }

    private function generateSessionId()
    {
        return 'sess_' . bin2hex(random_bytes(16));
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

    private function getRandomDeviceType()
    {
        $devices = ['mobile', 'desktop', 'tablet'];
        $weights = [0.65, 0.25, 0.10]; // 65% móvil, 25% desktop, 10% tablet

        $random = mt_rand() / mt_getrandmax();
        $cumulative = 0;

        foreach ($weights as $index => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $devices[$index];
            }
        }

        return 'mobile';
    }

    private function getRandomScanLocation()
    {
        $locations = [
            'restaurant_table',
            'store_entrance',
            'product_display',
            'reception_desk',
            'mall_kiosk',
            'event_booth',
            'flyer_qr',
            'business_card',
            'poster',
            'website',
        ];

        return $locations[array_rand($locations)];
    }

    private function getRandomBrowser()
    {
        $browsers = [
            'Chrome' => 0.65,
            'Safari' => 0.20,
            'Firefox' => 0.08,
            'Edge' => 0.05,
            'Other' => 0.02,
        ];

        $random = mt_rand() / mt_getrandmax();
        $cumulative = 0;

        foreach ($browsers as $browser => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $browser;
            }
        }

        return 'Chrome';
    }

    private function getRandomLatitude()
    {
        // Coordenadas de Chile aproximadas
        return rand(-55000, -17000) / 1000; // -55.0 a -17.0
    }

    private function getRandomLongitude()
    {
        // Coordenadas de Chile aproximadas
        return rand(-109000, -66000) / 1000; // -109.0 a -66.0
    }

    private function getRandomAddress()
    {
        $addresses = [
            'Plaza de Armas 123, Santiago',
            'Providencia 456, Providencia',
            'Las Condes 789, Las Condes',
            'Maipú 321, Maipú',
            'Valparaíso 654, Valparaíso',
            'Concepción 987, Concepción',
            'La Serena 147, La Serena',
            'Valdivia 258, Valdivia',
            'Coyhaique 369, Coyhaique',
            'Antofagasta 741, Antofagasta',
        ];

        return $addresses[array_rand($addresses)];
    }

    private function getRandomInteractionTime(Campaign $campaign)
    {
        $start = $campaign->start_date ?? now()->subDays(30);
        $end = $campaign->status === 'completed' ? ($campaign->end_date ?? now()) : now();

        return fake()->dateTimeBetween($start, $end);
    }
}
