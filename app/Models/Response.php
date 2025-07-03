<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Response extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'session_id', 'completed', 'latitude', 'longitude', 'address',
        'city', 'country', 'ip_address', 'user_agent', 'device_info', 'started_at',
        'completed_at', 'time_spent'
    ];

    protected $casts = [
        'completed' => 'boolean',
        'device_info' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
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
        $timeSpent = null;
        if ($this->started_at) {
            // Calcular tiempo en segundos y convertir a entero
            $timeSpent = (int) abs(now()->diffInSeconds($this->started_at));
        }

        $this->update([
            'completed' => true,
            'completed_at' => now(),
            'time_spent' => $timeSpent,
        ]);
    }

    public function getLocationAttribute()
    {
        if ($this->address) {
            return $this->address;
        }

        if ($this->latitude && $this->longitude) {
            return "Lat: {$this->latitude}, Lng: {$this->longitude}";
        }

        return 'Ubicación no disponible';
    }

    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopeIncomplete($query)
    {
        return $query->where('completed', false);
    }
}
