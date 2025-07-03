<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index(Request $request)
    {
        $query = Post::withCount(['allComments', 'likes']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('author_name', 'like', "%{$search}%");
            });
        }

        // Filter by author
        if ($request->filled('author')) {
            $query->where('author_name', 'like', "%{$request->author}%");
        }

        $posts = $query->latest('published_at')
                      ->paginate(10)
                      ->withQueryString();

        // Get statistics
        $stats = [
            'total' => Post::count(),
            'published' => Post::where('status', 'published')->count(),
            'draft' => Post::where('status', 'draft')->count(),
            'archived' => Post::where('status', 'archived')->count(),
            'total_views' => Post::sum('views_count'),
            'total_likes' => Post::sum('likes_count'),
            'total_comments' => Post::sum('comments_count'),
            'avg_engagement' => Post::where('views_count', '>', 0)->avg('likes_count'),
        ];

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'author']),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        return Inertia::render('admin/posts/create');
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:published,draft,archived',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'published_at' => 'nullable|date',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set published_at if status is published
        if ($validated['status'] === 'published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')
                        ->with('success', 'Post creado exitosamente.');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        $post->load(['allComments', 'likes']);

        return Inertia::render('admin/posts/show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug,' . $post->id,
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:published,draft,archived',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'published_at' => 'nullable|date',
        ]);

        // Update slug if title changed
        if ($validated['title'] !== $post->title && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set published_at if status changed to published
        if ($validated['status'] === 'published' && $post->status !== 'published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')
                        ->with('success', 'Post actualizado exitosamente.');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')
                        ->with('success', 'Post eliminado exitosamente.');
    }

    /**
     * Get post statistics for API.
     */
    public function stats()
    {
        $stats = [
                         'total' => Post::count(),
             'published' => Post::where('status', 'published')->count(),
             'draft' => Post::where('status', 'draft')->count(),
             'archived' => Post::where('status', 'archived')->count(),
             'total_views' => Post::sum('views_count'),
             'total_likes' => Post::sum('likes_count'),
             'total_comments' => Post::sum('comments_count'),
             'avg_engagement' => round(Post::where('views_count', '>', 0)->avg('likes_count'), 2),
        ];

        return response()->json($stats);
    }
}
