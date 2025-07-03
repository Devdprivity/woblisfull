<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::published()
            ->recent()
            ->with(['comments' => function($query) {
                $query->recent()->take(3);
            }])
            ->paginate(6);

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'featuredPost' => Post::published()->recent()->first(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('blog/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'tags' => 'nullable|array',
            'status' => 'required|in:published,draft,archived',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        $post = Post::create($validated);

        return redirect()->route('blog.show', $post->slug)
            ->with('success', 'Post creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load(['comments.likes', 'likes']);
        $post->incrementViews();

        $ipAddress = request()->ip();
        $sessionId = session()->getId();
        $isLiked = Like::isLiked($post, $ipAddress, $sessionId);

        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->recent()
            ->take(3)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'isLiked' => $isLiked,
            'relatedPosts' => $relatedPosts,
            'commentsWithLikes' => $post->comments->map(function($comment) use ($ipAddress, $sessionId) {
                return [
                    ...$comment->toArray(),
                    'is_liked' => Like::isLiked($comment, $ipAddress, $sessionId),
                ];
            }),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('blog/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'tags' => 'nullable|array',
            'status' => 'required|in:published,draft,archived',
        ]);

        if ($validated['title'] !== $post->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->route('blog.show', $post->slug)
            ->with('success', 'Post actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('blog.index')
            ->with('success', 'Post eliminado exitosamente');
    }

    /**
     * Toggle like for a post
     */
    public function toggleLike(Post $post)
    {
        $ipAddress = request()->ip();
        $sessionId = session()->getId();
        $userAgent = request()->userAgent();

        $result = Like::toggle($post, $ipAddress, $sessionId, $userAgent);

        return response()->json($result);
    }

    /**
     * Search posts
     */
    public function search(Request $request)
    {
        $query = $request->get('q');

        $posts = Post::published()
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('content', 'LIKE', "%{$query}%")
                  ->orWhere('excerpt', 'LIKE', "%{$query}%");
            })
            ->recent()
            ->paginate(6);

        return Inertia::render('blog/search', [
            'posts' => $posts,
            'query' => $query,
        ]);
    }
}
