<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = Campaign::with('questions')
            ->when($request->search, fn($query) => 
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('client_name', 'like', '%' . $request->search . '%')
            )
            ->when($request->status, fn($query) => 
                $query->where('status', $request->status)
            )
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Campaign::count(),
            'active' => Campaign::where('status', 'active')->count(),
            'draft' => Campaign::where('status', 'draft')->count(),
            'completed' => Campaign::where('status', 'completed')->count(),
            'total_responses' => \App\Models\Response::count(),
            'total_completes' => \App\Models\Response::where('completed', true)->count(),
        ];

        return Inertia::render('admin/campaigns/index', [
            'campaigns' => $campaigns,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/campaigns/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'nullable|string|max:20',
            'max_responses' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $campaign = Campaign::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
            'status' => 'draft',
        ]);

        return redirect()->route('admin.campaigns.show', $campaign)
            ->with('success', 'Campaña creada exitosamente.');
    }

    public function show(Campaign $campaign)
    {
        $campaign->load(['questions.answers', 'responses.answers.question', 'interactions']);

        $stats = [
            'total_questions' => $campaign->questions->count(),
            'total_responses' => $campaign->responses->count(),
            'completed_responses' => $campaign->completedResponses->count(),
            'completion_rate' => $campaign->completion_rate,
            'avg_time' => $campaign->responses()->whereNotNull('time_spent')->avg('time_spent'),
            'locations' => $campaign->responses()->whereNotNull('address')->distinct('address')->count(),
        ];

        return Inertia::render('admin/campaigns/show', [
            'campaign' => $campaign,
            'stats' => $stats,
        ]);
    }

    public function edit(Campaign $campaign)
    {
        return Inertia::render('admin/campaigns/edit', [
            'campaign' => $campaign,
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'nullable|string|max:20',
            'status' => 'required|in:draft,active,paused,completed',
            'max_responses' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        if ($validated['title'] !== $campaign->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $campaign->update($validated);

        return redirect()->route('admin.campaigns.show', $campaign)
            ->with('success', 'Campaña actualizada exitosamente.');
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaña eliminada exitosamente.');
    }
}
