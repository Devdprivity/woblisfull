<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $likes = Like::with('likeable')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($likes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'likeable_type' => 'required|in:App\\Models\\Post,App\\Models\\Comment',
            'likeable_id' => 'required|integer',
        ]);

        $ipAddress = $request->ip();
        $sessionId = session()->getId();
        $userAgent = $request->userAgent();

        // Find the likeable model
        if ($validated['likeable_type'] === 'App\\Models\\Post') {
            $likeable = Post::findOrFail($validated['likeable_id']);
        } else {
            $likeable = Comment::findOrFail($validated['likeable_id']);
        }

        $result = Like::toggle($likeable, $ipAddress, $sessionId, $userAgent);

        return response()->json($result);
    }

    /**
     * Display the specified resource.
     */
    public function show(Like $like)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Like $like)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Like $like)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Like $like)
    {
        $like->delete();

        return response()->json([
            'message' => 'Like eliminado exitosamente',
        ]);
    }

    /**
     * Get like statistics
     */
    public function stats()
    {
        $totalLikes = Like::count();
        $postLikes = Like::where('likeable_type', 'App\\Models\\Post')->count();
        $commentLikes = Like::where('likeable_type', 'App\\Models\\Comment')->count();

        return response()->json([
            'total_likes' => $totalLikes,
            'post_likes' => $postLikes,
            'comment_likes' => $commentLikes,
        ]);
    }
}
