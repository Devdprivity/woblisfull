<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'likeable_type',
        'likeable_id',
        'ip_address',
        'user_agent',
        'session_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($like) {
            if ($like->likeable_type === 'App\\Models\\Post') {
                $like->likeable->updateLikesCount();
            } elseif ($like->likeable_type === 'App\\Models\\Comment') {
                $like->likeable->updateLikesCount();
            }
        });

        static::deleted(function ($like) {
            if ($like->likeable_type === 'App\\Models\\Post') {
                $like->likeable->updateLikesCount();
            } elseif ($like->likeable_type === 'App\\Models\\Comment') {
                $like->likeable->updateLikesCount();
            }
        });
    }

    // Relationships
    public function likeable()
    {
        return $this->morphTo();
    }

    // Static methods
    public static function toggle($likeable, $ipAddress, $sessionId = null, $userAgent = null)
    {
        $existingLike = static::where([
            'likeable_type' => get_class($likeable),
            'likeable_id' => $likeable->id,
            'ip_address' => $ipAddress,
            'session_id' => $sessionId,
        ])->first();

        if ($existingLike) {
            $existingLike->delete();
            return ['liked' => false, 'count' => $likeable->fresh()->likes_count];
        } else {
            static::create([
                'likeable_type' => get_class($likeable),
                'likeable_id' => $likeable->id,
                'ip_address' => $ipAddress,
                'session_id' => $sessionId,
                'user_agent' => $userAgent,
            ]);
            return ['liked' => true, 'count' => $likeable->fresh()->likes_count];
        }
    }

    public static function isLiked($likeable, $ipAddress, $sessionId = null)
    {
        return static::where([
            'likeable_type' => get_class($likeable),
            'likeable_id' => $likeable->id,
            'ip_address' => $ipAddress,
            'session_id' => $sessionId,
        ])->exists();
    }
}
