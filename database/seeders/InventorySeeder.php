<?php

namespace Database\Seeders;

use App\Models\Inventory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventories = json_decode(
            file_get_contents(database_path('seeders/jsons/inventories.json')),
            true
        );

        $inventories = array_slice($inventories, 0, 1000);

        $inserted = [];

        $insertFn = function (array $items, $parentId = null) use (&$insertFn, &$inserted) {
            foreach ($items as $acct) {
                $id = DB::table('inventories')->insertGetId([
                    'name' => $acct['name'],
                    'sku'      => $acct['sku'],
                    'ean'      => $acct['ean'],
                    'material_type'      => $acct['material_type'] ?? null,
                ]);
            }
        };

        $insertFn($inventories);

        #Inventory::factory(600)->create();
    }
}
