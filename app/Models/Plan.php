<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'price',
        'description',
        'responses_included',
        'delivery_time',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'price' => 'integer',
        'responses_included' => 'integer',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePyme($query)
    {
        return $query->where('category', 'pyme');
    }

    public function scopeCorp($query)
    {
        return $query->where('category', 'corp');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('price');
    }

    // Accessors
    public function getFormattedPriceAttribute()
    {
        return '$' . number_format($this->price, 0, ',', '.');
    }

    public function getIsPymeAttribute()
    {
        return $this->category === 'pyme';
    }

    public function getIsCorpAttribute()
    {
        return $this->category === 'corp';
    }
}
