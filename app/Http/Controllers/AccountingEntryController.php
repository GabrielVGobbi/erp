<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AccountingEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountingEntryController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/accounting_entrys/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.accountingEntry.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateAccountingEntry $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateAccountingEntry $request)
    {
        $accountingEntry = AccountingEntry::create($request->validated());

        return redirect()
            ->route('admin.accountingEntry.index')
            ->with('success', 'AccountingEntry criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$accountingEntry = AccountingEntry::find($id)) {
            return redirect()
                ->route('admin.accountingEntry.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.accountingEntry.show', [
            'accountingEntry' => $accountingEntry,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param AccountingEntry $accountingEntry
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(AccountingEntry $accountingEntry)
    {
        return view('admin.accountingEntry.edit', compact('accountingEntry'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreUpdateAccountingEntry $request
     * @param AccountingEntry $accountingEntry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreUpdateAccountingEntry $request, AccountingEntry $accountingEntry)
    {
        $accountingEntry->update($request->validated());

        return redirect()
            ->route('admin.accountingEntry.show', accountingEntry->id)
            ->with('success', 'AccountingEntry atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param AccountingEntry $accountingEntry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(AccountingEntry $accountingEntry)
    {
        $accountingEntry->delete();

        return redirect()
            ->route('admin.accountingEntry.index')
            ->with('success', 'AccountingEntry removido com sucesso!');
    }
}
