<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'question', 'type', 'options', 'required', 'order', 'validation_rules', 'help_text'
    ];

    protected $casts = [
        'options' => 'array',
        'validation_rules' => 'array',
        'required' => 'boolean',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function answers()
    {
        return $this->hasMany(ResponseAnswer::class);
    }

    public function getTypeNameAttribute()
    {
        $types = [
            'text' => 'Texto',
            'textarea' => 'Texto largo',
            'radio' => 'Opción única',
            'checkbox' => 'Múltiple selección',
            'select' => 'Lista desplegable',
            'number' => 'Número',
            'email' => 'Email',
            'phone' => 'Teléfono',
        ];
        
        return $types[$this->type] ?? $this->type;
    }

    public function scopeRequired($query)
    {
        return $query->where('required', true);
    }

    public function scopeByOrder($query)
    {
        return $query->orderBy('order');
    }
}
