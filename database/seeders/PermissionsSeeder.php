<?php

namespace Database\Seeders;

use App\Models\User;
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
        ];

        foreach ($permissions as $permission) {
            \App\Modules\ACL\Models\Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        $devRole = \App\Modules\ACL\Models\Role::firstOrCreate(
            ['slug' => 'developer'],
            ['name' => 'Developer']
        );

        // Criar roles básicas
        $adminRole = \App\Modules\ACL\Models\Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrador']
        );

        $userRole = \App\Modules\ACL\Models\Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'Usuário']
        );

        DB::table('roles')->insert([
            [
                'name' => 'Supervisor',
                'slug' => 'supervisor',
            ],
            [
                'name' => 'Coordenador',
                'slug' => 'coordinator',
            ],
            [
                'name' => 'Gerente',
                'slug' => 'manager',
            ],
            [
                'name' => 'Gerente Geral',
                'slug' => 'general-manager',
            ],
        ]);


        // Atribuir todas as permissões ao admin
        $allPermissions = \App\Modules\ACL\Models\Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id'));
        $devRole->permissions()->sync($allPermissions->pluck('id'));

        $developer = User::first();
        if ($developer) {
            $developer->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        User::first()->roles()->attach($devRole);
    }
}
