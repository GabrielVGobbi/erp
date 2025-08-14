<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Models\Role;
use App\Supports\Traits\GenerateUuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Modules\ACL\Traits\HasPermissionsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasPermissionsTrait, SoftDeletes, GenerateUuidTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
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
        ];
    }

    public const RELATIONSHIP_USER_PERMISSION = 'users_permissions';

    public const RELATIONSHIP_USER_ROLE = 'users_roles';

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, self::RELATIONSHIP_USER_PERMISSION, 'user_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, self::RELATIONSHIP_USER_ROLE, 'user_id');
    }
}
