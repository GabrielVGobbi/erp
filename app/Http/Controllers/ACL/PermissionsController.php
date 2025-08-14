<?php

namespace App\Http\Controllers\ACL;

use App\Http\Controllers\Controller;
use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/permissions/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();

        $groups = config('permissions.groups', [
            'ACL' => 'Controle de Acesso',
            'Users' => 'Usuários',
            'Compras' => 'Compras',
            'Vendas' => 'Vendas',
            'Estoque' => 'Estoque',
            'Financeiro' => 'Financeiro',
            'Relatorios' => 'Relatórios',
        ]);

        return Inertia::render('app/permissions/create', [
            'roles' => $roles,
            'groups' => array_keys($groups)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'group' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Se selecionou grupo customizado, usar o valor do custom_group
        $group = $request->group === 'custom' ? $request->custom_group : $request->group;

        $permission = Permission::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'group' => $group,
            'description' => $request->description,
        ]);

        // Atribuir a roles se fornecido
        if ($request->has('roles')) {
            $permission->roles()->sync($request->roles);
        }

        return redirect()
            ->route('acl.permissions.show', $permission->id)
            ->with('success', 'Permissão criada com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $permission->load(['roles', 'users']);

        return Inertia::render('app/permissions/show', [
            'permission' => $permission
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        $permission->load('roles');
        $roles = Role::all();

        $groups = config('permissions.groups', [
            'ACL' => 'Controle de Acesso',
            'Users' => 'Usuários',
            'Compras' => 'Compras',
            'Vendas' => 'Vendas',
            'Estoque' => 'Estoque',
            'Financeiro' => 'Financeiro',
            'Relatorios' => 'Relatórios',
        ]);

        return Inertia::render('app/permissions/edit', [
            'permission' => $permission,
            'roles' => $roles,
            'groups' => array_keys($groups)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            #'group' => 'required|string|max:255',
            #'custom_group' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            #'roles' => 'array',
        ]);

        $permission->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Atualizar roles
        if ($request->has('roles')) {
            $permission->roles()->sync($request->roles);
        }

        return redirect()->route('acl.permissions.show', $permission)
            ->with('success', 'Permissão atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route('acl.permissions.index')
            ->with('success', 'Permissão removida com sucesso.');
    }
}
