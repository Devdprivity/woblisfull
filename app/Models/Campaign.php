<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'client_name', 'client_email', 'client_phone',
        'status', 'slug', 'qr_code', 'settings', 'max_responses', 'start_date',
        'end_date', 'total_scans', 'total_opens', 'total_starts', 'total_completes', 'total_incompletes',
    ];

    protected $casts = [
        'settings' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    public function completedResponses()
    {
        return $this->hasMany(Response::class)->where('completed', true);
    }

    public function interactions()
    {
        return $this->hasMany(CampaignInteraction::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function updateStats()
    {
        $this->update([
            'total_scans' => $this->interactions()->where('type', 'scan')->count(),
            'total_opens' => $this->interactions()->where('type', 'open')->count(),
            'total_starts' => $this->interactions()->where('type', 'start')->count(),
            'total_completes' => $this->completedResponses()->count(),
            'total_incompletes' => $this->responses()->where('completed', false)->count(),
        ]);
    }

    public function getCompletionRateAttribute()
    {
        if ($this->total_starts == 0) return 0;
        return round(($this->total_completes / $this->total_starts) * 100, 2);
    }
}
