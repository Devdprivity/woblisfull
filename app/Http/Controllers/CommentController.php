<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::with('post')
            ->recent()
            ->paginate(20);

        return response()->json($comments);
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
            'post_id' => 'required|exists:posts,id',
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'content' => 'required|string|max:1000',
        ]);

        $validated['ip_address'] = $request->ip();
        $validated['user_agent'] = $request->userAgent();
        $validated['status'] = 'approved'; // Auto-approve for now

        $comment = Comment::create($validated);
        $comment->load('post');

        return response()->json([
            'comment' => $comment,
            'message' => 'Comentario agregado exitosamente',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        return response()->json($comment->load('post'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'content' => 'required|string|max:1000',
            'status' => 'required|in:approved,pending,rejected',
        ]);

        $comment->update($validated);

        return response()->json([
            'comment' => $comment,
            'message' => 'Comentario actualizado exitosamente',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return response()->json([
            'message' => 'Comentario eliminado exitosamente',
        ]);
    }

    /**
     * Toggle like for a comment
     */
    public function toggleLike(Comment $comment)
    {
        $ipAddress = request()->ip();
        $sessionId = session()->getId();
        $userAgent = request()->userAgent();

        $result = Like::toggle($comment, $ipAddress, $sessionId, $userAgent);

        return response()->json($result);
    }

    /**
     * Get comments for a specific post
     */
    public function getByPost(Post $post)
    {
        $ipAddress = request()->ip();
        $sessionId = session()->getId();

        $comments = $post->comments()
            ->recent()
            ->get()
            ->map(function($comment) use ($ipAddress, $sessionId) {
                return [
                    ...$comment->toArray(),
                    'is_liked' => Like::isLiked($comment, $ipAddress, $sessionId),
                    'time_ago' => $comment->time_ago,
                ];
            });

        return response()->json($comments);
    }
}
