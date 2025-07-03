<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignInteraction;
use App\Models\Response;
use App\Models\ResponseAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function show(Campaign $campaign)
    {
        // Verificar que la campaña esté activa
        if ($campaign->status !== 'active') {
            abort(404, 'Encuesta no disponible');
        }

        // Verificar fechas
        if ($campaign->start_date && now() < $campaign->start_date) {
            abort(404, 'Encuesta aún no está disponible');
        }

        if ($campaign->end_date && now() > $campaign->end_date) {
            abort(404, 'Encuesta ha finalizado');
        }

        // Trackear la apertura
        CampaignInteraction::track($campaign->id, 'open');

        // Cargar preguntas
        $campaign->load('questions');

        return Inertia::render('survey/show', [
            'campaign' => $campaign,
        ]);
    }

    public function start(Request $request, Campaign $campaign)
    {
        $sessionId = Response::generateSessionId();

        // Crear respuesta inicial
        $response = Response::create([
            'campaign_id' => $campaign->id,
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_info' => [
                'platform' => $request->header('sec-ch-ua-platform'),
                'mobile' => $request->header('sec-ch-ua-mobile') === '?1',
            ],
            'started_at' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        // Obtener dirección de Google Maps si hay coordenadas
        if ($request->latitude && $request->longitude) {
            $this->getAddressFromCoordinates($response, $request->latitude, $request->longitude);
        }

        // Trackear inicio
        CampaignInteraction::track($campaign->id, 'start', $sessionId, [
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'session_id' => $sessionId,
            'response_id' => $response->id,
        ]);
    }

    public function submit(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'session_id' => 'required|string',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.answer' => 'required',
        ]);

        $response = Response::where('session_id', $validated['session_id'])
            ->where('campaign_id', $campaign->id)
            ->firstOrFail();

                // Guardar respuestas
        foreach ($validated['answers'] as $answerData) {
            ResponseAnswer::updateOrCreate([
                'response_id' => $response->id,
                'question_id' => $answerData['question_id'],
            ], [
                'answer' => $answerData['answer'],
            ]);
        }

        // Marcar como completada
        $response->markAsCompleted();

        // Trackear finalización
        CampaignInteraction::track($campaign->id, 'complete', $validated['session_id']);

        // Actualizar estadísticas de la campaña
        $campaign->updateStats();

        return response()->json([
            'success' => true,
            'message' => '¡Gracias por completar la encuesta!',
        ]);
    }

    public function qr(Campaign $campaign)
    {
        // Trackear escaneo del QR
        CampaignInteraction::track($campaign->id, 'scan', null, [
            'metadata' => ['source' => 'qr_code']
        ]);

        return redirect()->route('survey.show', $campaign);
    }

    private function getAddressFromCoordinates(Response $response, $latitude, $longitude)
    {
        // Aquí implementarías la llamada a Google Maps API
        // Por ahora, simularemos la respuesta

        try {
            $apiKey = config('services.google_maps.api_key');

            if (!$apiKey) {
                return;
            }

            $url = "https://maps.googleapis.com/maps/api/geocode/json";
            $params = [
                'latlng' => "{$latitude},{$longitude}",
                'key' => $apiKey,
                'language' => 'es',
            ];

            $response_data = file_get_contents($url . '?' . http_build_query($params));
            $data = json_decode($response_data, true);

            if ($data['status'] === 'OK' && !empty($data['results'])) {
                $result = $data['results'][0];

                $response->update([
                    'address' => $result['formatted_address'],
                    'city' => $this->extractComponent($result, 'locality'),
                    'country' => $this->extractComponent($result, 'country'),
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Error getting address from coordinates: ' . $e->getMessage());
        }
    }

    private function extractComponent($result, $type)
    {
        foreach ($result['address_components'] as $component) {
            if (in_array($type, $component['types'])) {
                return $component['long_name'];
            }
        }
        return null;
    }
}
