<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'provider',
        'account_type',
        'company_name',
        'company_rut',
        'company_address',
        'company_phone',
        'plan_id',
        'role_id',
        'status',
        'activated_at',
        'activation_notes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activated_at' => 'datetime',
        ];
    }

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    // Scopes
    public function scopeClients($query)
    {
        return $query->where('account_type', 'client');
    }

    public function scopeCompanies($query)
    {
        return $query->where('account_type', 'company');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    // Accessors & Mutators
    public function getIsClientAttribute()
    {
        return $this->account_type === 'client';
    }

    public function getIsCompanyAttribute()
    {
        return $this->account_type === 'company';
    }

    public function getIsPendingAttribute()
    {
        return $this->status === 'pending';
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }

    public function getIsSuspendedAttribute()
    {
        return $this->status === 'suspended';
    }

    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return $this->avatar;
        }

        // Fallback to Gravatar
        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($this->email))) . '?d=mp&s=200';
    }

    // Role & Permission methods
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->role && $this->role->name === $role;
        }

        return $this->role && $this->role->id === $role->id;
    }

    public function hasPermission($permission)
    {
        return $this->role && $this->role->hasPermission($permission);
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isCompanyActive()
    {
        return $this->hasRole('company_active');
    }

    public function isCompanyPending()
    {
        return $this->hasRole('company_pending');
    }

    public function canAccessDashboard()
    {
        return $this->is_active && ($this->isAdmin() || $this->isCompanyActive());
    }

    // Company methods
    public function needsActivation()
    {
        return $this->is_company && $this->is_pending;
    }

    public function activate($notes = null)
    {
        $this->update([
            'status' => 'active',
            'activated_at' => now(),
            'activation_notes' => $notes,
            'role_id' => Role::companyActive()->id,
        ]);
    }

    public function suspend($notes = null)
    {
        $this->update([
            'status' => 'suspended',
            'activation_notes' => $notes,
        ]);
    }
}
