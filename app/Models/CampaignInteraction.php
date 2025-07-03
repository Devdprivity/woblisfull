<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'session_id', 'type', 'ip_address', 'user_agent',
        'latitude', 'longitude', 'address', 'referrer', 'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public static function track($campaignId, $type, $sessionId = null, $data = [])
    {
        return static::create([
            'campaign_id' => $campaignId,
            'session_id' => $sessionId,
            'type' => $type,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referrer' => request()->header('referer'),
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'address' => $data['address'] ?? null,
            'metadata' => $data['metadata'] ?? null,
        ]);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
