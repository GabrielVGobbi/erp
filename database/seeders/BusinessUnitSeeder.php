<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusinessUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $BusinessUnits = ['enel', 'CTEEP', 'Obras', 'Chapas'];

        foreach ($BusinessUnits as $name) {
            BusinessUnit::forceCreate([
                'name' => $name,
                'organization_id' => 1
            ]);
        }
    }
}
