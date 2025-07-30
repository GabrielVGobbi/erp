<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        $supplier = Supplier::first();

        return Inertia::render('app/suppliers/index', [
            'logs' => $supplier->logs(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.supplier.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateSupplier $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateSupplier $request)
    {
        $supplier = Supplier::create($request->validated());

        return redirect()
            ->route('admin.supplier.index')
            ->with('success', 'Supplier criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$supplier = Supplier::find($id)) {
            return redirect()
                ->route('admin.supplier.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.supplier.show', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Supplier $supplier
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(Supplier $supplier)
    {
        return view('admin.supplier.edit', compact('supplier'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreUpdateSupplier $request
     * @param Supplier $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreUpdateSupplier $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return redirect()
            ->route('admin.supplier.show', supplier->id)
            ->with('success', 'Supplier atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Supplier $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()
            ->route('admin.supplier.index')
            ->with('success', 'Supplier removido com sucesso!');
    }
}
