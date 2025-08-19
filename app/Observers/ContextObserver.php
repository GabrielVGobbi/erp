<?php

namespace App\Observers;

use App\Models\CostCenter;
use App\Models\User;
use App\Modules\ACL\Models\Role;
use Illuminate\Database\Eloquent\Model;

class ContextObserver
{
    /**
     * Handle the Model "created" event.
     *
     * @param  Model $context
     * @return void
     */
    public function created(Model $context)
    {
        // Encontra os usuários e papéis de forma segura
        $ceo = User::whereHas('roles', function ($query) {
            $query->where('slug', 'ceo');
        })->first();

        $cfo = User::whereHas('roles', function ($query) {
            $query->where('slug', 'cfo');
        })->first();

        $role_ceo = Role::where('slug', 'ceo')->first();
        $role_cfo = Role::where('slug', 'cfo')->first();

        // Se os usuários e papéis existirem, cria as atribuições
        if ($ceo && $role_ceo) {
            $context->approvers()->create([
                'user_id' => $ceo->id,
                'role_id' => $role_ceo->id,
            ]);
        }

        if ($cfo && $role_cfo) {
            $context->approvers()->create([
                'user_id' => $cfo->id,
                'role_id' => $role_cfo->id,
            ]);
        }
    }
}
