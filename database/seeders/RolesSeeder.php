<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devRole = Role::firstOrCreate(
            ['slug' => 'developer'],
            ['name' => 'Developer']
        );

        // Criar roles básicas
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrador']
        );

        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'Usuário']
        );

        $developer = User::first();
        if ($developer) {
            $developer->roles()->syncWithoutDetaching([$adminRole->id]);
        }
        User::first()->roles()->attach($devRole);

        $roleGerGeral = Role::where('slug', 'general-manager')->first();
        $roleGerente = Role::where('slug', 'manager')->first();
        $roleCeo = Role::where('slug', 'ceo')->first();
        $roleCfo = Role::where('slug', 'cfo')->first();

        $ceo = User::where('email', 'marcos_varella@teste.com')->first();
        $cfo = User::where('email', 'nelly@teste.com')->first();

        #$walter = User::where('email', 'walter_gerente_geral@teste.com')->first();
        #$carol = User::where('email', 'carol_frotas@teste.com')->first();
        #$walter->roles()->attach($roleGerGeral);
        #$carol->roles()->attach($roleGerente);

        $ceo->roles()->attach($roleCeo);
        $cfo->roles()->attach($roleCfo);

        #$usersAll = User::all();
        #foreach ($usersAll as $user) {
        #    $user->roles()->attach($userRole);
        #}

        $permissionRequisitionCompra = Permission::where('name', 'Realizar Requisição de Compra')->first();
        $userRole->permissions()->sync($permissionRequisitionCompra);

        //// Atribuir todas as permissões ao admin
        //$allPermissions = Permission::all();
        //$adminRole->permissions()->sync($allPermissions->pluck('id'));
        //$devRole->permissions()->sync($allPermissions->pluck('id'));

        $usersAll = User::all();
        foreach ($usersAll as $user) {
            $user->roles()->attach($userRole);
        }

        DB::table('roles')->insert([
            [
                'name' => 'CEO',
                'slug' => 'ceo'
            ],
            [
                'name' => 'CFO',
                'slug' => 'cfo'
            ],
            [
                'name' => 'Gerente Geral',
                'slug' => 'general-manager',
            ],
            [
                'name' => 'Gerente',
                'slug' => 'manager',
            ],

            [
                'name' => 'Supervisor',
                'slug' => 'supervisor',
            ],
            [
                'name' => 'Coordenador',
                'slug' => 'coordinator',
            ],
            [
                'name' => 'Financeiro',
                'slug' => 'finance'
            ],
        ]);
    }
}
