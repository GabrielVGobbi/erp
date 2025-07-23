<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/branches/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.branch.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateBranch $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateBranch $request)
    {
        $branch = Branch::create($request->validated());

        return redirect()
            ->route('admin.branch.index')
            ->with('success', 'Branch criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$branch = Branch::find($id)) {
            return redirect()
                ->route('admin.branch.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.branch.show', [
            'branch' => $branch,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Branch $branch
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(Branch $branch)
    {
        return view('admin.branch.edit', compact('branch'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreUpdateBranch $request
     * @param Branch $branch
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreUpdateBranch $request, Branch $branch)
    {
        $branch->update($request->validated());

        return redirect()
            ->route('admin.branch.show', branch->id)
            ->with('success', 'Branch atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Branch $branch
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();

        return redirect()
            ->route('admin.branch.index')
            ->with('success', 'Branch removido com sucesso!');
    }
}
