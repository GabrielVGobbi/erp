<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AccountingEntries;
use App\Services\GeneralLedgerService;
use App\Http\Resources\GeneralLedgerResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AccountingEntryController extends Controller
{
    protected $generalLedgerService;

    public function __construct(GeneralLedgerService $generalLedgerService)
    {
        $this->generalLedgerService = $generalLedgerService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
            'chart_account_id',
            'organization_id',
            'show_opening_entries',
            'show_cancelled_entries',
            'voucher_type',
            'voucher_number',
            'partner',
            'project'
        ]);

        // Definir datas padrão se não fornecidas
        if (empty($filters['start_date'])) {
            $filters['start_date'] = Carbon::now()->startOfYear()->format('Y-m-d');
        }
        if (empty($filters['end_date'])) {
            $filters['end_date'] = Carbon::now()->endOfYear()->format('Y-m-d');
        }

        // Gerar relatório do Livro Razão
        $generalLedger = $this->generalLedgerService->generateGeneralLedger($filters);

        // Buscar contas contábeis para filtro
        $chartAccounts = \App\Models\ChartAccount::select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        // Buscar organizações para filtro
        $organizations = \App\Models\Organization::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('app/accounting_entrys/index', [
            'generalLedger' => GeneralLedgerResource::collection($generalLedger),
            'filters' => $filters,
            'chartAccounts' => $chartAccounts,
            'organizations' => $organizations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $chartAccounts = \App\Models\ChartAccount::select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        $organizations = \App\Models\Organization::select('id', 'name')
            ->orderBy('name')
            ->get();

        $branches = \App\Models\Branch::select('id', 'name')
            ->orderBy('name')
            ->get();

        $suppliers = \App\Models\Supplier::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('app/accounting_entrys/create', [
            'chartAccounts' => $chartAccounts,
            'organizations' => $organizations,
            'branches' => $branches,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'chart_account_id' => 'required|exists:chart_accounts,id',
            'organization_id' => 'required|exists:organizations,id',
            'branch_id' => 'nullable|exists:branches,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'posting_date' => 'required|date',
            'voucher_type' => 'required|string|max:255',
            'voucher_subtype' => 'nullable|string|max:255',
            'voucher_number' => 'required|string|max:255',
            'against_voucher_number' => 'nullable|string|max:255',
            'partner_type' => 'nullable|string|max:255',
            'partner' => 'nullable|string|max:255',
            'project' => 'nullable|string|max:255',
            'cost_center' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:3',
            'description' => 'nullable|string',
            'remarks' => 'nullable|string',
            'debit' => 'required_without:credit|numeric|min:0',
            'credit' => 'required_without:debit|numeric|min:0',
            'debit_foreign' => 'nullable|numeric|min:0',
            'credit_foreign' => 'nullable|numeric|min:0',
            'exchange_rate' => 'nullable|numeric|min:0',
        ]);

        // Garantir que apenas débito ou crédito seja preenchido
        if ($validated['debit'] > 0 && $validated['credit'] > 0) {
            return back()->withErrors(['error' => 'Apenas débito ou crédito deve ser preenchido']);
        }

        // Definir valores padrão
        $validated['debit'] = $validated['debit'] ?? 0;
        $validated['credit'] = $validated['credit'] ?? 0;
        $validated['currency'] = $validated['currency'] ?? 'BRL';
        $validated['exchange_rate'] = $validated['exchange_rate'] ?? 1;
        $validated['status'] = 'active';

        try {
            $entry = $this->generalLedgerService->createEntry($validated);

            return redirect()
                ->route('accounting-entries.index')
                ->with('success', 'Lançamento contábil criado com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao criar lançamento: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $entry = AccountingEntries::with(['chartAccount', 'organization', 'branch', 'supplier'])
            ->findOrFail($id);

        return Inertia::render('app/accounting_entrys/show', [
            'entry' => $entry,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $entry = AccountingEntries::findOrFail($id);

        $chartAccounts = \App\Models\ChartAccount::select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        $organizations = \App\Models\Organization::select('id', 'name')
            ->orderBy('name')
            ->get();

        $branches = \App\Models\Branch::select('id', 'name')
            ->orderBy('name')
            ->get();

        $suppliers = \App\Models\Supplier::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('app/accounting_entrys/edit', [
            'entry' => $entry,
            'chartAccounts' => $chartAccounts,
            'organizations' => $organizations,
            'branches' => $branches,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $entry = AccountingEntries::findOrFail($id);

        $validated = $request->validate([
            'chart_account_id' => 'required|exists:chart_accounts,id',
            'organization_id' => 'required|exists:organizations,id',
            'branch_id' => 'nullable|exists:branches,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'posting_date' => 'required|date',
            'voucher_type' => 'required|string|max:255',
            'voucher_subtype' => 'nullable|string|max:255',
            'voucher_number' => 'required|string|max:255',
            'against_voucher_number' => 'nullable|string|max:255',
            'partner_type' => 'nullable|string|max:255',
            'partner' => 'nullable|string|max:255',
            'project' => 'nullable|string|max:255',
            'cost_center' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:3',
            'description' => 'nullable|string',
            'remarks' => 'nullable|string',
            'debit' => 'required_without:credit|numeric|min:0',
            'credit' => 'required_without:debit|numeric|min:0',
            'debit_foreign' => 'nullable|numeric|min:0',
            'credit_foreign' => 'nullable|numeric|min:0',
            'exchange_rate' => 'nullable|numeric|min:0',
        ]);

        // Garantir que apenas débito ou crédito seja preenchido
        if ($validated['debit'] > 0 && $validated['credit'] > 0) {
            return back()->withErrors(['error' => 'Apenas débito ou crédito deve ser preenchido']);
        }

        try {
            $entry->update($validated);

            // Recalcular saldos
            $this->generalLedgerService->recalculateBalances($entry->chart_account_id, $entry->organization_id);

            return redirect()
                ->route('accounting-entries.show', $entry->id)
                ->with('success', 'Lançamento contábil atualizado com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao atualizar lançamento: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $entry = AccountingEntries::findOrFail($id);

        try {
            $entry->delete();

            // Recalcular saldos
            $this->generalLedgerService->recalculateBalances($entry->chart_account_id, $entry->organization_id);

            return redirect()
                ->route('accounting-entries.index')
                ->with('success', 'Lançamento contábil removido com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao remover lançamento: ' . $e->getMessage()]);
        }
    }

    /**
     * Gerar lançamento de abertura
     */
    public function generateOpeningEntry(Request $request)
    {
        $validated = $request->validate([
            'chart_account_id' => 'required|exists:chart_accounts,id',
            'organization_id' => 'required|exists:organizations,id',
            'amount' => 'required|numeric',
            'date' => 'nullable|date',
        ]);

        try {
            $entry = $this->generalLedgerService->generateOpeningEntry(
                $validated['chart_account_id'],
                $validated['organization_id'],
                $validated['amount'],
                $validated['date'] ?? null
            );

            return redirect()
                ->route('accounting-entries.index')
                ->with('success', 'Lançamento de abertura gerado com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao gerar lançamento de abertura: ' . $e->getMessage()]);
        }
    }
}
