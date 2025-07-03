<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Static methods for role checking
    public static function client()
    {
        return static::where('name', 'client')->first();
    }

    public static function companyPending()
    {
        return static::where('name', 'company_pending')->first();
    }

    public static function companyActive()
    {
        return static::where('name', 'company_active')->first();
    }

    public static function admin()
    {
        return static::where('name', 'admin')->first();
    }

    // Methods
    public function hasPermission($permission)
    {
        return in_array($permission, $this->permissions ?? []);
    }
}
