<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
    }
}
