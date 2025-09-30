<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'type',
        'author_name',
        'author_email',
        'tags',
        'meta_data',
        'views_count',
        'likes_count',
        'comments_count',
        'allow_comments',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'meta_data' => 'array',
        'allow_comments' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    protected $attributes = [
        'status' => 'draft',
        'type' => 'post',
        'views_count' => 0,
        'likes_count' => 0,
        'comments_count' => 0,
        'allow_comments' => true,
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            if ($post->status === 'published' && empty($post->published_at)) {
                $post->published_at = now();
            }
        });
    }

    // Relationships
    public function comments()
    {
        return $this->hasMany(Comment::class)->where('status', 'approved');
    }

    public function allComments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Methods
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function updateLikesCount()
    {
        $this->likes_count = $this->likes()->count();
        $this->save();
    }

    public function updateCommentsCount()
    {
        $this->comments_count = $this->comments()->count();
        $this->save();
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image
            ? asset('storage/' . $this->featured_image)
            : asset('img/logoWoblis.png');
    }

    public function getExcerptAttribute($value)
    {
        return $value ?: Str::limit(strip_tags($this->content), 150);
    }
}
