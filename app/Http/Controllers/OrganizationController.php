<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organizations\StoreOrganizationRequest;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/organizations/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.organization.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreOrganizationRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreOrganizationRequest $request)
    {
        $organization = Organization::create($request->validated());

        return redirect()
            ->route('admin.organization.index')
            ->with('success', 'Organization criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$organization = Organization::find($id)) {
            return redirect()
                ->route('admin.organization.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.organization.show', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Organization $organization
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(Organization $organization)
    {
        return view('admin.organization.edit', compact('organization'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreOrganizationRequest $request
     * @param Organization $organization
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreOrganizationRequest $request, Organization $organization)
    {
        $organization->update($request->validated());

        return redirect()
            ->route('admin.organization.show', organization->id)
            ->with('success', 'Organization atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Organization $organization
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Organization $organization)
    {
        $organization->delete();

        return redirect()
            ->route('admin.organization.index')
            ->with('success', 'Organization removido com sucesso!');
    }
}
