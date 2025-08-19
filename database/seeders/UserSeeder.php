<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::forceCreate([
            'organization_id' => '1',
            'name' => 'Admin',
            'email' => 'super@admin.com',
            'password' => 'superadmin',
        ]);

        User::create(['organization_id' => '1', 'name' => 'Nelly', 'email' => 'nelly@teste.com', 'password' => Hash::make('cena123')]);
        User::create(['organization_id' => '1', 'name' => 'Marcos Varella', 'email' => 'marcos_varella@teste.com', 'password' => Hash::make('cena123')]);
        User::create(['organization_id' => '1', 'name' => 'Requisitante', 'email' => 'requisitante@teste.com', 'password' => Hash::make('cena123')]);
        User::create(['organization_id' => '1', 'name' => 'Fabio', 'email' => 'fabio@teste.com', 'password' => Hash::make('cena123')]);
        User::create(['organization_id' => '1', 'name' => 'Carol', 'email' => 'carol_frotas@teste.com', 'password' => Hash::make('cena123')]);
        User::create(['organization_id' => '1', 'name' => 'Walter', 'email' => 'walter_gerente_geral@teste.com', 'password' => Hash::make('cena123')]);

    }
}
