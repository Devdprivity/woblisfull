<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LikeController extends Controller
{
    /**
     * Display a listing of likes.
     */
    public function index(Request $request)
    {
        $query = Like::with('likeable');

        // Filter by type
        if ($request->filled('type')) {
            if ($request->type === 'posts') {
                $query->where('likeable_type', 'App\\Models\\Post');
            } elseif ($request->type === 'comments') {
                $query->where('likeable_type', 'App\\Models\\Comment');
            }
        }

        // Search by IP address
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('user_agent', 'like', "%{$search}%");
            });
        }

        $likes = $query->latest()
                      ->paginate(20)
                      ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Like::count(),
            'post_likes' => Like::where('likeable_type', 'App\\Models\\Post')->count(),
            'comment_likes' => Like::where('likeable_type', 'App\\Models\\Comment')->count(),
            'unique_ips' => Like::distinct('ip_address')->count(),
            'recent_count' => Like::where('created_at', '>=', now()->subDays(7))->count(),
            'today_count' => Like::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('admin/likes/index', [
            'likes' => $likes,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    /**
     * Display the specified like.
     */
    public function show(Like $like)
    {
        $like->load('likeable');

        return Inertia::render('admin/likes/show', [
            'like' => $like,
        ]);
    }

    /**
     * Remove the specified like from storage.
     */
    public function destroy(Like $like)
    {
        $like->delete();

        return redirect()->route('admin.likes.index')
                        ->with('success', 'Like eliminado exitosamente.');
    }

    /**
     * Get like statistics for API.
     */
    public function stats()
    {
        $stats = [
            'total' => Like::count(),
            'post_likes' => Like::where('likeable_type', 'App\\Models\\Post')->count(),
            'comment_likes' => Like::where('likeable_type', 'App\\Models\\Comment')->count(),
            'unique_ips' => Like::distinct('ip_address')->count(),
            'recent_count' => Like::where('created_at', '>=', now()->subDays(7))->count(),
            'today_count' => Like::whereDate('created_at', today())->count(),
        ];

        return response()->json($stats);
    }
}
