<?php

namespace App\Modules\ACL\Models;

use App\Supports\Traits\GenerateUniqueSlugTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Permission extends Model
{
    use HasFactory, GenerateUniqueSlugTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'group',
        'description'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'roles_permissions');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'users_permissions');
    }
}
