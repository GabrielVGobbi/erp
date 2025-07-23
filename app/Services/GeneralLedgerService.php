<?php

namespace App\Services;

use App\Models\AccountingEntries;
use App\Models\ChartAccount;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GeneralLedgerService
{
    /**
     * Gera o relatório do Livro Razão
     */
    public function generateGeneralLedger($filters = [])
    {
        $startDate = $filters['start_date'] ?? Carbon::now()->startOfYear();
        $endDate = $filters['end_date'] ?? Carbon::now()->endOfYear();
        $chartAccountId = $filters['chart_account_id'] ?? null;
        $organizationId = $filters['organization_id'] ?? null;
        $showOpeningEntries = $filters['show_opening_entries'] ?? true;
        $showCancelledEntries = $filters['show_cancelled_entries'] ?? false;

        $query = AccountingEntries::with(['organization', 'chartAccount', 'supplier', 'branch'])
            ->where('status', 'active');

        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        }

        if ($chartAccountId) {
            $query->where('chart_account_id', $chartAccountId);
        }

        if (!$showCancelledEntries) {
            $query->where('status', 'active');
        }

        // Buscar lançamentos do período
        $entries = $query->whereBetween('posting_date', [$startDate, $endDate])
            ->orderBy('posting_date')
            ->orderBy('id')
            ->get();

        $result = [];

        if ($showOpeningEntries) {
            $openingEntries = $this->generateOpeningStructure($chartAccountId, $startDate, $organizationId);
            $result = array_merge($result, $openingEntries);
        }

        // Calcular saldo acumulado após abertura
        $runningBalance = $this->calculateOpeningBalance($chartAccountId, $startDate, $organizationId);

        // Adicionar lançamentos regulares
        foreach ($entries as $entry) {
            $entry->balance = $runningBalance + ($entry->debit - $entry->credit);
            $runningBalance = $entry->balance;
            $result[] = $entry;
        }

        // Adicionar totais
        $totals = $this->calculateTotals($entries);
        $result[] = $this->createTotalEntry($totals, $endDate);

        // Adicionar fechamento
        $result[] = $this->createClosingEntry($totals, $endDate);

        return $result;
    }

    /**
     * Gera estrutura completa de abertura
     */
    private function generateOpeningStructure($chartAccountId, $startDate, $organizationId = null)
    {
        $openingEntries = [];

        // 1. CABEÇALHO DE ABERTURA
        $openingEntries[] = $this->createOpeningHeader($startDate);

        // 2. SALDO ANTERIOR (se houver)
        $previousBalance = $this->calculateOpeningBalance($chartAccountId, $startDate, $organizationId);
        if ($previousBalance != 0) {
            $openingEntries[] = $this->createPreviousBalanceEntry($previousBalance, $startDate, $chartAccountId);
        }

        // 3. LANÇAMENTOS DE ABERTURA DO PERÍODO
        $periodOpeningEntries = $this->getPeriodOpeningEntries($chartAccountId, $startDate, $organizationId);
        foreach ($periodOpeningEntries as $entry) {
            $openingEntries[] = $entry;
        }

        // 4. SALDO DE ABERTURA FINAL
        $finalOpeningBalance = $this->calculateFinalOpeningBalance($chartAccountId, $startDate, $organizationId);
        #$openingEntries[] = $this->createFinalOpeningBalanceEntry($finalOpeningBalance, $startDate);

        return $openingEntries;
    }

    /**
     * Cria cabeçalho de abertura
     */
    private function createOpeningHeader($date)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = null;
        $entry->voucher_type = 'Opening Header';
        $entry->voucher_number = 'ABERTURA-PERIODO';
        $entry->description = '=== ABERTURA DO PERÍODO ===';
        $entry->debit = 0;
        $entry->credit = 0;
        $entry->balance = 0;
        $entry->is_opening_entry = true;
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Cria entrada de saldo anterior
     */
    private function createPreviousBalanceEntry($balance, $date, $chartAccountId = null)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = $chartAccountId;
        $entry->voucher_type = 'Previous Balance';
        $entry->voucher_number = 'SALDO-ANTERIOR';
        $entry->description = 'Saldo Anterior ao Período';
        $entry->debit = $balance > 0 ? $balance : 0;
        $entry->credit = $balance < 0 ? abs($balance) : 0;
        $entry->balance = $balance;
        $entry->is_opening_entry = true;
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Busca lançamentos de abertura do período
     */
    private function getPeriodOpeningEntries($chartAccountId, $startDate, $organizationId = null)
    {
        $query = AccountingEntries::where('posting_date', $startDate)
            ->where('is_opening_entry', true)
            ->where('status', 'active');

        if ($chartAccountId) {
            $query->where('chart_account_id', $chartAccountId);
        }

        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        }

        return $query->orderBy('id')->get();
    }

    /**
     * Cria entrada de saldo de abertura final
     */
    private function createFinalOpeningBalanceEntry($balance, $date)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = null;
        $entry->voucher_type = 'Final Opening Balance';
        $entry->voucher_number = 'SALDO-ABERTURA-FINAL';
        $entry->description = 'Saldo de Abertura Final do Período';
        $entry->debit = $balance > 0 ? $balance : 0;
        $entry->credit = $balance < 0 ? abs($balance) : 0;
        $entry->balance = $balance;
        $entry->is_opening_entry = true;
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Calcula saldo de abertura final (anterior + lançamentos de abertura)
     */
    private function calculateFinalOpeningBalance($chartAccountId, $startDate, $organizationId = null)
    {
        // Saldo anterior
        $previousBalance = $this->calculateOpeningBalance($chartAccountId, $startDate, $organizationId);

        // Lançamentos de abertura do período
        $openingEntries = $this->getPeriodOpeningEntries($chartAccountId, $startDate, $organizationId);
        $openingBalance = $openingEntries->sum(function ($entry) {
            return $entry->debit - $entry->credit;
        });

        return $previousBalance + $openingBalance;
    }

    /**
     * Calcula o saldo de abertura (apenas lançamentos anteriores)
     */
    private function calculateOpeningBalance($chartAccountId, $startDate, $organizationId = null)
    {
        $query = AccountingEntries::where('posting_date', '<', $startDate)
            ->where('status', 'active');

        if ($chartAccountId) {
            $query->where('chart_account_id', $chartAccountId);
        }

        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        }

        return $query->selectRaw('SUM(debit - credit) as opening_balance')
            ->value('opening_balance') ?? 0;
    }

    /**
     * Cria entrada de abertura (método legado - mantido para compatibilidade)
     */
    private function createOpeningEntry($balance, $date)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = null;
        $entry->voucher_type = 'Opening Balance';
        $entry->voucher_number = 'ABERTURA';
        $entry->description = 'Saldo de Abertura';
        $entry->debit = $balance > 0 ? $balance : 0;
        $entry->credit = $balance < 0 ? abs($balance) : 0;
        $entry->balance = $balance;
        $entry->is_opening_entry = true;
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Cria entrada de total
     */
    private function createTotalEntry($totals, $date)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = null;
        $entry->voucher_type = 'Total';
        $entry->voucher_number = 'TOTAL';
        $entry->description = 'Total do Período';
        $entry->debit = $totals['total_debit'];
        $entry->credit = $totals['total_credit'];
        $entry->balance = $totals['total_debit'] - $totals['total_credit'];
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Cria entrada de fechamento
     */
    private function createClosingEntry($totals, $date)
    {
        $entry = new AccountingEntries();
        $entry->posting_date = $date;
        $entry->chart_account_id = null;
        $entry->voucher_type = 'Closing';
        $entry->voucher_number = 'FECHAMENTO';
        $entry->description = 'Saldo de Fechamento';
        $entry->debit = $totals['total_debit'];
        $entry->credit = $totals['total_credit'];
        $entry->balance = $totals['total_debit'] - $totals['total_credit'];
        $entry->is_closing_entry = true;
        $entry->is_system_generated = true;
        $entry->status = 'active';

        return $entry;
    }

    /**
     * Calcula totais dos lançamentos
     */
    private function calculateTotals($entries)
    {
        $totalDebit = $entries->sum('debit');
        $totalCredit = $entries->sum('credit');

        return [
            'total_debit' => $totalDebit,
            'total_credit' => $totalCredit,
            'balance' => $totalDebit - $totalCredit
        ];
    }

    /**
     * Cria um novo lançamento contábil
     */
    public function createEntry($data)
    {
        DB::beginTransaction();

        try {
            $entry = AccountingEntries::create($data);

            // Recalcular saldos para esta conta
            $this->recalculateBalances($entry->chart_account_id, $entry->organization_id);

            DB::commit();
            return $entry;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Recalcula os saldos de uma conta
     */
    public function recalculateBalances($chartAccountId, $organizationId)
    {
        $entries = AccountingEntries::where('chart_account_id', $chartAccountId)
            ->where('organization_id', $organizationId)
            ->where('status', 'active')
            ->orderBy('posting_date')
            ->orderBy('id')
            ->get();

        $runningBalance = 0;

        foreach ($entries as $entry) {
            $runningBalance += ($entry->debit - $entry->credit);
            $entry->update(['balance' => $runningBalance]);
        }
    }

    /**
     * Gera lançamento de abertura para uma conta
     */
    public function generateOpeningEntry($chartAccountId, $organizationId, $amount, $date = null)
    {
        $date = $date ?? Carbon::now()->startOfYear();

        return $this->createEntry([
            'chart_account_id' => $chartAccountId,
            'organization_id' => $organizationId,
            'posting_date' => $date,
            'voucher_type' => 'Opening Entry',
            'voucher_number' => 'ABERTURA-' . $chartAccountId,
            'description' => 'Lançamento de Abertura',
            'debit' => $amount > 0 ? $amount : 0,
            'credit' => $amount < 0 ? abs($amount) : 0,
            'balance' => $amount,
            'is_opening_entry' => true,
            'is_system_generated' => true,
            'status' => 'active',
        ]);
    }

    /**
     * Gera estrutura de abertura para múltiplas contas
     */
    public function generateBulkOpeningEntries($organizationId, $date = null, $accountsData = [])
    {
        $date = $date ?? Carbon::now()->startOfYear();
        $results = [];

        DB::beginTransaction();

        try {
            foreach ($accountsData as $accountData) {
                $chartAccountId = $accountData['chart_account_id'];
                $amount = $accountData['amount'] ?? 0;

                // Verificar se já existe lançamento de abertura
                $existingEntry = AccountingEntries::where('chart_account_id', $chartAccountId)
                    ->where('organization_id', $organizationId)
                    ->where('is_opening_entry', true)
                    ->where('posting_date', $date)
                    ->first();

                if (!$existingEntry && $amount != 0) {
                    $entry = $this->generateOpeningEntry($chartAccountId, $organizationId, $amount, $date);
                    $results[] = $entry;
                }
            }

            DB::commit();
            return $results;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
