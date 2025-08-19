<?php

namespace App\Models;

use App\Modules\ACL\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApprovalAssignment extends Model
{
    use HasFactory;

    // Ajuste o nome da tabela para a nova nomenclatura
    protected $table = 'approval_assignments';

    protected $fillable = [
        'user_id',
        'role_id',
        'context_id',
        'context_type',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            //
        ];
    }

    protected $appends = [];

    /**
     * Define a relação polimórfica para o contexto.
     */
    public function context()
    {
        return $this->morphTo();
    }

    /**
     * Define a relação com o usuário.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define a relação com o papel (role).
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
