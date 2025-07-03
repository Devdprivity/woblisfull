<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Response extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'session_id', 'status', 'started_at', 'completed_at',
        'ip_address', 'user_agent', 'referrer', 'metadata', 'completion_time',
        'completion_percentage'
    ];

    protected $casts = [
        'metadata' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'completion_percentage' => 'decimal:5,2',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function answers()
    {
        return $this->hasMany(ResponseAnswer::class);
    }

    public static function generateSessionId()
    {
        return Str::uuid()->toString();
    }

    public function markAsCompleted()
    {
        $completionTime = null;
        if ($this->started_at) {
            // Calcular tiempo en segundos y convertir a entero
            $completionTime = (int) abs(now()->diffInSeconds($this->started_at));
        }

        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completion_time' => $completionTime,
            'completion_percentage' => 100,
        ]);
    }

    public function getLocationAttribute()
    {
        if ($this->metadata && isset($this->metadata['location'])) {
            $location = $this->metadata['location'];
            if (isset($location['address'])) {
                return $location['address'];
            }
            if (isset($location['lat']) && isset($location['lng'])) {
                return "Lat: {$location['lat']}, Lng: {$location['lng']}";
            }
        }

        return 'Ubicación no disponible';
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeIncomplete($query)
    {
        return $query->where('status', '!=', 'completed');
    }
}
