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
        'google2fa_secret',
        'google2fa_enabled',
        'google2fa_enabled_at',
        'login_attempts',
        'locked_until',
        'last_login_at',
        'last_login_ip',
        'login_history',
        'force_password_change',
        'password_changed_at',
        'failed_login_attempts',
        'last_failed_login_at',
        'recovery_codes',
        'company_industry',
        'company_size',
        'phone',
        'timezone',
        'language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
        'recovery_codes',
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
            'google2fa_enabled' => 'boolean',
            'google2fa_enabled_at' => 'datetime',
            'locked_until' => 'datetime',
            'last_login_at' => 'datetime',
            'login_history' => 'array',
            'force_password_change' => 'boolean',
            'password_changed_at' => 'datetime',
            'last_failed_login_at' => 'datetime',
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

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
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

    // Security methods
    public function isAccountLocked()
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function lockAccount($minutes = 15)
    {
        $this->update([
            'locked_until' => now()->addMinutes($minutes),
            'login_attempts' => 0,
        ]);
    }

    public function unlockAccount()
    {
        $this->update([
            'locked_until' => null,
            'login_attempts' => 0,
            'failed_login_attempts' => 0,
        ]);
    }

    public function incrementLoginAttempts()
    {
        $this->increment('login_attempts');
        $this->increment('failed_login_attempts');
        $this->update(['last_failed_login_at' => now()]);

        // Lock account after 5 failed attempts
        if ($this->login_attempts >= 5) {
            $this->lockAccount(30); // 30 minutes
        }
    }

    public function resetLoginAttempts()
    {
        $this->update([
            'login_attempts' => 0,
            'failed_login_attempts' => 0,
        ]);
    }

    public function recordSuccessfulLogin($ip = null)
    {
        $loginHistory = $this->login_history ?? [];

        // Keep only last 10 logins
        if (count($loginHistory) >= 10) {
            array_shift($loginHistory);
        }

        $loginHistory[] = [
            'ip' => $ip,
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toISOString(),
        ];

        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
            'login_history' => $loginHistory,
            'login_attempts' => 0,
            'failed_login_attempts' => 0,
        ]);
    }

    public function has2FAEnabled()
    {
        return $this->google2fa_enabled && !empty($this->google2fa_secret);
    }

    public function enable2FA($secret)
    {
        $this->update([
            'google2fa_secret' => $secret,
            'google2fa_enabled' => true,
            'google2fa_enabled_at' => now(),
        ]);
    }

    public function disable2FA()
    {
        $this->update([
            'google2fa_secret' => null,
            'google2fa_enabled' => false,
            'google2fa_enabled_at' => null,
        ]);
    }

    public function needsPasswordChange()
    {
        return $this->force_password_change ||
               ($this->password_changed_at && $this->password_changed_at->diffInDays() > 90);
    }

    public function updatePassword($password)
    {
        $this->update([
            'password' => bcrypt($password),
            'password_changed_at' => now(),
            'force_password_change' => false,
        ]);
    }
}
