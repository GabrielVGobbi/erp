<?php

namespace Database\Seeders;

use App\Models\AccountingEntries;
use App\Models\ChartAccount;
use App\Models\Organization;
use App\Services\GeneralLedgerService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AccountingEntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organization = Organization::first();
        if (!$organization) {
            $this->command->warn('Nenhuma organização encontrada. Execute o OrganizationSeeder primeiro.');
            return;
        }

        $chartAccounts = ChartAccount::where('organization_id', $organization->id)->get();
        if ($chartAccounts->isEmpty()) {
            $this->command->warn('Nenhuma conta contábil encontrada. Execute o ChartAccountSeeder primeiro.');
            return;
        }

        $generalLedgerService = app(GeneralLedgerService::class);

        // Gerar lançamentos de abertura
        $this->command->info('Gerando lançamentos de abertura...');
        foreach ($chartAccounts as $chartAccount) {

            if ($chartAccount->amount->raw() > 0) {
                $generalLedgerService->generateOpeningEntry(
                    $chartAccount->id,
                    $organization->id,
                    $chartAccount->amount->raw(),
                    Carbon::now()->startOfYear()
                );
            }
        }

        // Gerar lançamentos de exemplo
        $this->command->info('Gerando lançamentos de exemplo...');

        $voucherTypes = [
            'Purchase Receipt' => 'Recebimento de Compra',
            'Sales Invoice' => 'Fatura de Venda',
            'Payment Entry' => 'Entrada de Pagamento',
            'Journal Entry' => 'Lançamento Manual',
            'Bank Entry' => 'Lançamento Bancário',
        ];

        $projects = ['Projeto A', 'Projeto B', 'Projeto C', null];
        $costCenters = ['Administrativo', 'Comercial', 'Produção', 'Financeiro', null];

        // Lançamentos de exemplo para diferentes contas
        $sampleEntries = [
            [
                'chart_account_code' => '1.1.1.5', // Caixa
                'entries' => [
                    ['debit' => 5000, 'credit' => 0, 'description' => 'Abertura de caixa'],
                    ['debit' => 0, 'credit' => 2000, 'description' => 'Pagamento de despesas'],
                ]
            ],
            [
                'chart_account_code' => '1.1.0.2', // Banco
                'entries' => [
                    ['debit' => 10000, 'credit' => 0, 'description' => 'Depósito bancário'],
                    ['debit' => 0, 'credit' => 5000, 'description' => 'Pagamento de fornecedor'],
                ]
            ],
            [
                'chart_account_code' => '2.1.0.1', // Fornecedores
                'entries' => [
                    ['debit' => 0, 'credit' => 3000, 'description' => 'Compra de mercadorias'],
                    ['debit' => 2000, 'credit' => 0, 'description' => 'Pagamento parcial'],
                ]
            ],
            [
                'chart_account_code' => '3.1.0.1', // Receita de Vendas
                'entries' => [
                    ['debit' => 0, 'credit' => 8000, 'description' => 'Venda de produtos'],
                    ['debit' => 0, 'credit' => 5000, 'description' => 'Venda de serviços'],
                ]
            ],
            [
                'chart_account_code' => '4.1.0.1', // Custos
                'entries' => [
                    ['debit' => 2000, 'credit' => 0, 'description' => 'Custo de mercadorias vendidas'],
                    ['debit' => 1500, 'credit' => 0, 'description' => 'Despesas operacionais'],
                ]
            ],
        ];

        foreach ($sampleEntries as $sample) {
            $chartAccount = $chartAccounts->where('code', $sample['chart_account_code'])->first();
            if (!$chartAccount) continue;

            foreach ($sample['entries'] as $index => $entryData) {
                $voucherType = array_rand($voucherTypes);
                $voucherNumber = strtoupper(substr($voucherType, 0, 3)) . '-' . date('Y') . '-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);

                $generalLedgerService->createEntry([
                    'chart_account_id' => $chartAccount->id,
                    'organization_id' => $organization->id,
                    'posting_date' => Carbon::now()->subDays(rand(1, 30)),
                    'voucher_type' => $voucherType,
                    'voucher_number' => $voucherNumber,
                    'description' => $entryData['description'],
                    'debit' => $entryData['debit'],
                    'credit' => $entryData['credit'],
                    'project' => $projects[array_rand($projects)],
                    'cost_center' => $costCenters[array_rand($costCenters)],
                    'currency' => 'BRL',
                    'status' => 'active',
                ]);
            }
        }

        $this->command->info('AccountingEntrySeeder concluído com sucesso!');
    }
}
