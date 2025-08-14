<?php

namespace App\Http\Controllers\ACL;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\ACL\Models\Role;
use App\Modules\ACL\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function __construct() {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/users/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('app/users/create', [
            'roles' => $roles,
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
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Atribuir roles
        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        // Atribuir permissões diretas
        if ($request->has('permissions')) {
            $user->permissions()->sync($request->permissions);
        }

        // Verificar qual botão foi clicado
        if ($request->has('create_and_new')) {
            return redirect()->route('acl.users.create')
                ->with('success', 'Usuário criado com sucesso! Você pode criar outro usuário.');
        }

        return redirect()->route('acl.users.show', $user->id)
            ->with('success', 'Usuário criado com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load(['roles', 'permissions']);

        return Inertia::render('app/users/show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $user->load(['roles', 'permissions']);
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('app/users/edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Atualizar senha se fornecida
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        // Atualizar roles
        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        // Atualizar permissões diretas
        if ($request->has('permissions')) {
            $user->permissions()->sync($request->permissions);
        }

        return redirect()->route('acl.users.show', $user)
            ->with('success', 'Usuário atualizado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('acl.users.index')
            ->with('success', 'Usuário removido com sucesso.');
    }

    /**
     * Show the form for managing user roles.
     */
    public function manageRoles(User $user)
    {
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('app/users/manage-roles', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Update user roles.
     */
    public function updateRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'array',
        ]);

        $user->roles()->sync($request->roles ?? []);

        return redirect()->route('acl.users.show', $user)
            ->with('success', 'Roles do usuário atualizadas com sucesso.');
    }

    /**
     * Show the form for managing user permissions.
     */
    public function managePermissions(User $user)
    {
        $user->load('permissions');
        $permissions = Permission::all();

        return Inertia::render('app/users/manage-permissions', [
            'user' => $user,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update user permissions.
     */
    public function updatePermissions(Request $request, User $user)
    {
        $request->validate([
            'permissions' => 'array',
        ]);

        $user->permissions()->sync($request->permissions ?? []);

        return redirect()->route('acl.users.show', $user)
            ->with('success', 'Permissões do usuário atualizadas com sucesso.');
    }
}
