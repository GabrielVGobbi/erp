<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessUnit\UpdateBusinessUnitRequest;
use App\Models\BusinessUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessUnitController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     *
     */
    public function index()
    {
        return Inertia::render('app/business_units/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('app/business_units/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * //@param StoreUpdateBusinessUnit $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:business_units'
        ]);

        $businessUnit = BusinessUnit::create([
            'name' => $request->name
        ]);

        // Verificar qual botão foi clicado
        if ($request->has('create_and_new')) {
            return redirect()->route('business-units.create')
                ->with('success', 'Unidade criado com sucesso! Você pode criar outro Unidade.');
        }


        return redirect()
            ->route('business-units.show', $businessUnit->id)
            ->with('success', 'Unidade(s) de Negócio criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     */
    public function show($id)
    {
        if (!$businessUnit = BusinessUnit::find($id)) {
            return redirect()
                ->route('business-units.index')
                ->with('message', 'Registro não encontrado!');
        }

        return Inertia::render('app/business_units/show', compact('businessUnit'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param BusinessUnit $businessUnit
     */
    public function edit(BusinessUnit $businessUnit)
    {
        return Inertia::render('app/business_units/edit', compact('businessUnit'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBusinessUnitRequest $request
     * @param BusinessUnit $businessUnit
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateBusinessUnitRequest $request, BusinessUnit $businessUnit)
    {
        $businessUnit->update($request->validated());

        return redirect()
            ->route('business-units.show', $businessUnit->id)
            ->with('success', 'BusinessUnit atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param BusinessUnit $businessUnit
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(BusinessUnit $businessUnit)
    {
        $businessUnit->delete();

        return redirect()
            ->route('business-units.index')
            ->with('success', 'BusinessUnit removido com sucesso!');
    }
}
