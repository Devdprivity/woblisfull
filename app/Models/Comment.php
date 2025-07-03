<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'author_name',
        'author_email',
        'content',
        'status',
        'ip_address',
        'user_agent',
        'likes_count',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($comment) {
            $comment->post->updateCommentsCount();
        });

        static::deleted(function ($comment) {
            $comment->post->updateCommentsCount();
        });
    }

    // Relationships
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Methods
    public function updateLikesCount()
    {
        $this->likes_count = $this->likes()->count();
        $this->save();
    }

    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
