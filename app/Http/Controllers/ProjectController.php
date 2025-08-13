<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     *
     */
    public function index()
    {
        return Inertia::render('app/projects/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.project.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateProject $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateProject $request)
    {
        $project = Project::create($request->validated());

        return redirect()
            ->route('admin.project.index')
            ->with('success', 'Project criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        if (!$project = Project::find($id)) {
            return redirect()
                ->route('admin.project.index')
                ->with('message', 'Registro não encontrado!');
        }

        return view('admin.project.show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Project $project
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(Project $project)
    {
        return view('admin.project.edit', compact('project'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreUpdateProject $request
     * @param Project $project
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreUpdateProject $request, Project $project)
    {
        $project->update($request->validated());

        return redirect()
            ->route('admin.project.show', project->id)
            ->with('success', 'Project atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Project $project
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()
            ->route('admin.project.index')
            ->with('success', 'Project removido com sucesso!');
    }
}
