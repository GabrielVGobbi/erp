<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branchNames = ['Coaquira', 'Teresina', 'Campinhas', 'Jaguaré', 'Camacan', 'Carapicuiba'];

        foreach ($branchNames as $name) {
            Branch::forceCreate([
                'name' => $name,
                'organization_id' => 1
            ]);
        }
    }
}
