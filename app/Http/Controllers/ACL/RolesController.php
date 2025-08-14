<?php

namespace App\Http\Controllers\ACL;

use App\Http\Controllers\Controller;
use App\Modules\ACL\Models\Role;
use App\Modules\ACL\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/roles/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('app/roles/create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $role = Role::create($request->only(['name', 'slug']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('acl.roles.show', $role->id)
            ->with('success', 'Role criada com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $role->load(['permissions', 'users']);

        return Inertia::render('app/roles/show', [
            'role' => $role
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all();

        return Inertia::render('app/roles/edit', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $role->update($request->only(['name', 'slug']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('acl.roles.show', $role)
            ->with('success', 'Role atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('acl.roles.index')
            ->with('success', 'Role removida com sucesso.');
    }

    /**
     * Show the form for managing role permissions.
     */
    public function managePermissions(Role $role)
    {
        $role->load('permissions');

        $permissions = Permission::all();

        return Inertia::render('app/roles/manage-permissions', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update role permissions.
     */
    public function updatePermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'array',
        ]);

        $role->permissions()->sync($request->permissions ?? []);

        return redirect()->route('acl.roles.show', $role)
            ->with('success', 'Permissões da role atualizadas com sucesso.');
    }
}
