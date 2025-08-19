<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
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
            OrganizationSeeder::class,
            UserSeeder::class,
            PermissionsSeeder::class,
            RolesSeeder::class,
            ApprovalRolesSeeder::class,
            BranchSeeder::class,
            SupplierSeeder::class,
            ChartAccountSeeder::class,
            AccountingEntrySeeder::class,
            CostCenterSeeder::class,
            InventorySeeder::class,
            ProjectSeeder::class,
            InventorySeeder::class,
            BusinessUnitSeeder::class,
            ApprovalAssignmentsSeeder::class,
        ]);
    }
}
