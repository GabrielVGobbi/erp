<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChartAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChartAccountController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        $chartAccounts = ChartAccount::with(['organization', 'children.children.children'])
            ->whereNull('parent_id')
            ->get()
            ->groupBy('organization_id');

        return Inertia::render('app/chart_accounts/index', [
            'chart_accounts' => $chartAccounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.chartAccount.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateChartAccount $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateChartAccount $request)
    {
        $chartAccount = ChartAccount::create($request->validated());

        return redirect()
            ->route('admin.chartAccount.index')
            ->with('success', 'ChartAccount criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$chartAccount = ChartAccount::find($id)) {
            return redirect()
                ->route('admin.chartAccount.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.chartAccount.show', [
            'chartAccount' => $chartAccount,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param ChartAccount $chartAccount
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(ChartAccount $chartAccount)
    {
        return view('admin.chartAccount.edit', compact('chartAccount'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreUpdateChartAccount $request
     * @param ChartAccount $chartAccount
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreUpdateChartAccount $request, ChartAccount $chartAccount)
    {
        $chartAccount->update($request->validated());

        return redirect()
            ->route('admin.chartAccount.show', chartAccount->id)
            ->with('success', 'ChartAccount atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ChartAccount $chartAccount
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ChartAccount $chartAccount)
    {
        $chartAccount->delete();

        return redirect()
            ->route('admin.chartAccount.index')
            ->with('success', 'ChartAccount removido com sucesso!');
    }
}
