<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Display a listing of comments.
     */
    public function index(Request $request)
    {
        $query = Comment::with(['post:id,title,slug']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by post
        if ($request->filled('post_id')) {
            $query->where('post_id', $request->post_id);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                  ->orWhere('author_name', 'like', "%{$search}%")
                  ->orWhere('author_email', 'like', "%{$search}%");
            });
        }

        $comments = $query->latest()
                         ->paginate(15)
                         ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Comment::count(),
            'approved' => Comment::where('status', 'approved')->count(),
            'pending' => Comment::where('status', 'pending')->count(),
            'rejected' => Comment::where('status', 'rejected')->count(),
            'total_likes' => Comment::sum('likes_count'),
            'avg_likes' => round(Comment::avg('likes_count'), 2),
        ];

        // Get posts for filter dropdown
        $posts = Post::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('admin/comments/index', [
            'comments' => $comments,
            'stats' => $stats,
            'posts' => $posts,
            'filters' => $request->only(['search', 'status', 'post_id']),
        ]);
    }

    /**
     * Display the specified comment.
     */
    public function show(Comment $comment)
    {
        $comment->load(['post:id,title,slug', 'likes']);

        return Inertia::render('admin/comments/show', [
            'comment' => $comment,
        ]);
    }

    /**
     * Show the form for editing the specified comment.
     */
    public function edit(Comment $comment)
    {
        $comment->load('post:id,title');

        return Inertia::render('admin/comments/edit', [
            'comment' => $comment,
        ]);
    }

    /**
     * Update the specified comment in storage.
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

        return redirect()->route('admin.comments.index')
                        ->with('success', 'Comentario actualizado exitosamente.');
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return redirect()->route('admin.comments.index')
                        ->with('success', 'Comentario eliminado exitosamente.');
    }

    /**
     * Approve a comment.
     */
    public function approve(Comment $comment)
    {
        $comment->update(['status' => 'approved']);

        return back()->with('success', 'Comentario aprobado exitosamente.');
    }

    /**
     * Reject a comment.
     */
    public function reject(Comment $comment)
    {
        $comment->update(['status' => 'rejected']);

        return back()->with('success', 'Comentario rechazado exitosamente.');
    }

    /**
     * Bulk approve comments.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'comment_ids' => 'required|array',
            'comment_ids.*' => 'exists:comments,id',
        ]);

        Comment::whereIn('id', $request->comment_ids)->update(['status' => 'approved']);

        return back()->with('success', 'Comentarios aprobados exitosamente.');
    }

    /**
     * Bulk reject comments.
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'comment_ids' => 'required|array',
            'comment_ids.*' => 'exists:comments,id',
        ]);

        Comment::whereIn('id', $request->comment_ids)->update(['status' => 'rejected']);

        return back()->with('success', 'Comentarios rechazados exitosamente.');
    }

    /**
     * Bulk delete comments.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'comment_ids' => 'required|array',
            'comment_ids.*' => 'exists:comments,id',
        ]);

        Comment::whereIn('id', $request->comment_ids)->delete();

        return back()->with('success', 'Comentarios eliminados exitosamente.');
    }

    /**
     * Get comment statistics for API.
     */
    public function stats()
    {
        $stats = [
            'total' => Comment::count(),
            'approved' => Comment::where('status', 'approved')->count(),
            'pending' => Comment::where('status', 'pending')->count(),
            'rejected' => Comment::where('status', 'rejected')->count(),
            'total_likes' => Comment::sum('likes_count'),
            'avg_likes' => round(Comment::avg('likes_count'), 2),
            'recent_count' => Comment::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return response()->json($stats);
    }
}
