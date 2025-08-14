<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            OrganizationSeeder::class,
            BranchSeeder::class,
            SupplierSeeder::class,
            ChartAccountSeeder::class,
            AccountingEntrySeeder::class,
            CostCenterSeeder::class,
            InventorySeeder::class,
            ProjectSeeder::class,
            InventorySeeder::class,
            PermissionsSeeder::class,
        ]);
    }
}
