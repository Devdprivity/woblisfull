<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::active()
            ->ordered()
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'category' => $plan->category,
                    'categoryName' => $plan->is_pyme ? 'Woblis - Pyme' : 'Woblis - Corp',
                    'price' => $plan->formatted_price,
                    'rawPrice' => $plan->price,
                    'description' => $plan->description,
                    'responsesIncluded' => $plan->responses_included,
                    'deliveryTime' => $plan->delivery_time,
                    'features' => $plan->features ?? [],
                    'sortOrder' => $plan->sort_order,
                ];
            });

        return response()->json($plans);
    }

    public function show(Plan $plan)
    {
        if (!$plan->is_active) {
            return response()->json(['message' => 'Plan no disponible'], 404);
        }

        return response()->json([
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'category' => $plan->category,
            'categoryName' => $plan->is_pyme ? 'Woblis - Pyme' : 'Woblis - Corp',
            'price' => $plan->formatted_price,
            'rawPrice' => $plan->price,
            'description' => $plan->description,
            'responsesIncluded' => $plan->responses_included,
            'deliveryTime' => $plan->delivery_time,
            'features' => $plan->features ?? [],
            'sortOrder' => $plan->sort_order,
        ]);
    }
}
