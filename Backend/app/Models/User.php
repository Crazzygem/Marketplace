<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- IMPORTANT: Add this for API Auth

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Default primary key is 'id', so we don't need to specify it

    protected $fillable = [
        'name', 'email', 'password', 'is_customer', 'is_staff', 'is_shop_owner', 'is_admin', 'is_banned', 'is_verified',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'is_customer' => 'boolean',
        'is_staff' => 'boolean',
        'is_shop_owner' => 'boolean',
        'is_admin' => 'boolean',
        'is_banned' => 'boolean',
        'is_verified' => 'boolean',
    ];

    // Role checking methods
    public function hasRole($role)
    {
        return $this->{'is_'.$role} ?? false;
    }

    public function hasAnyRole($roles)
    {
        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    public function hasAllRoles($roles)
    {
        foreach ($roles as $role) {
            if (! $this->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    // Relationship: A user might own ONE shop
    public function ownShop()
    {
        return $this->hasOne(Shop::class, 'owner_id');
    }

    // Relationship: A user might be a member of MANY shops (as staff)
    public function shopMemberships()
    {
        return $this->hasMany(ShopMember::class, 'user_id');
    }
}
