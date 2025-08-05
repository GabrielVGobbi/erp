<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Http\Requests\Inventory\StoreInventoryRequest;
use App\Http\Requests\Inventory\UpdateInventoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/inventories/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.inventory.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreInventoryRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreInventoryRequest $request)
    {
        $inventory = Inventory::create($request->validated());

        return redirect()
            ->route('admin.inventory.index')
            ->with('success', 'Inventory criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$inventory = Inventory::find($id)) {
            return redirect()
                ->route('app.inventories.index')
                ->with('message', 'Registro não encontrado!');
        }

        return Inertia::render('app/inventories/show', [
            'inventory' => $inventory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Inventory $inventory
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(Inventory $inventory)
    {
        return view('admin.inventory.edit', compact('inventory'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateInventoryRequest $request
     * @param Inventory $inventory
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateInventoryRequest $request, Inventory $inventory)
    {
        $inventory->update($request->validated());

        return redirect()
            ->route('inventories.show', $inventory->id)
            ->with('success', 'Item atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Inventory $inventory
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();

        return redirect()
            ->route('admin.inventory.index')
            ->with('success', 'Inventory removido com sucesso!');
    }
}
