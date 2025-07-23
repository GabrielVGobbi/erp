<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChartAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = json_decode(
            file_get_contents(database_path('seeders/jsons/chart_accounts.json')),
            true
        );

        $inserted = [];

        // função recursiva de inserção
        $insertFn = function (array $items, $parentId = null) use (&$insertFn, &$inserted) {
            foreach ($items as $acct) {
                $id = DB::table('chart_accounts')->insertGetId([
                    'organization_id' => 1,
                    'code'      => $acct['code'],
                    'name'      => $acct['name'],
                    'type'      => $acct['type'] ?? null,
                    'parent_id' => $parentId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // guarda map de código → id para eventuais buscas futuras
                $inserted[$acct['code']] = $id;

                if (!empty($acct['children'])) {
                    $insertFn($acct['children'], $id);
                }
            }
        };

        // executa a semente
        $insertFn($accounts);
    }
}
