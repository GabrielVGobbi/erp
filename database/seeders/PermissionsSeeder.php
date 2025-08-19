<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            //Painel
            ['name' => 'Acesso ao painel', 'group' => 'Painel'],

            // Grupo Usuários
            ['name' => 'Visualizar Usuários', 'slug' => 'users.view', 'group' => 'Users'],
            ['name' => 'Criar Usuários', 'slug' => 'users.create', 'group' => 'Users'],
            ['name' => 'Editar Usuários', 'slug' => 'users.edit', 'group' => 'Users'],
            ['name' => 'Excluir Usuários', 'slug' => 'users.delete', 'group' => 'Users'],

            // Grupo ACL
            ['name' => 'Visualizar Funções', 'slug' => 'roles.view', 'group' => 'ACL'],
            ['name' => 'Criar Funções', 'slug' => 'roles.create', 'group' => 'ACL'],
            ['name' => 'Editar Funções', 'slug' => 'roles.edit', 'group' => 'ACL'],
            ['name' => 'Excluir Funções', 'slug' => 'roles.delete', 'group' => 'ACL'],
            ['name' => 'Visualizar Permissões', 'slug' => 'permissions.view', 'group' => 'ACL'],
            ['name' => 'Criar Permissões', 'slug' => 'permissions.create', 'group' => 'ACL'],
            ['name' => 'Editar Permissões', 'slug' => 'permissions.edit', 'group' => 'ACL'],
            ['name' => 'Excluir Permissões', 'slug' => 'permissions.delete', 'group' => 'ACL'],

            // Requisição de Compra
            ['name' => 'Realizar Requisição de Compra', 'group' => 'Requisição de Material'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
