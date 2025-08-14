<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\ACL\Models\Role;
use App\Modules\ACL\Models\Permission;
use Illuminate\Http\Request;

class ACLTablesApiController extends Controller
{
    /**
     * Get users data for DataTable
     */
    public function users(Request $request)
    {
        $query = User::with(['roles', 'permissions']);

        // Aplicar filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('slug', $request->role);
            });
        }

        if ($request->filled('verified')) {
            if ($request->verified === 'verified') {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        // Ordenação
        #$sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy('id', $sortOrder);

        // Paginação
        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'total' => $users->total(),
            'per_page' => $users->perPage(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ]);
    }

    /**
     * Get roles data for DataTable
     */
    public function roles(Request $request)
    {
        $query = Role::withCount('users')->with('permissions');

        // Aplicar filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('has_users')) {
            if ($request->has_users === 'yes') {
                $query->has('users');
            } else {
                $query->doesntHave('users');
            }
        }

        // Ordenação
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginação
        $perPage = $request->get('per_page', 10);
        $roles = $query->paginate($perPage);

        return response()->json([
            'data' => $roles->items(),
            'total' => $roles->total(),
            'per_page' => $roles->perPage(),
            'current_page' => $roles->currentPage(),
            'last_page' => $roles->lastPage(),
        ]);
    }

    /**
     * Get permissions data for DataTable
     */
    public function permissions(Request $request)
    {
        $query = Permission::withCount('users')->with('roles');

        // Aplicar filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('group', 'like', "%{$search}%");
            });
        }

        if ($request->filled('group')) {
            $query->where('group', $request->group);
        }

        if ($request->filled('has_roles')) {
            if ($request->has_roles === 'yes') {
                $query->has('roles');
            } else {
                $query->doesntHave('roles');
            }
        }

        // Ordenação
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginação
        $perPage = $request->get('per_page', 10);
        $permissions = $query->paginate($perPage);

        return response()->json([
            'data' => $permissions->items(),
            'total' => $permissions->total(),
            'per_page' => $permissions->perPage(),
            'current_page' => $permissions->currentPage(),
            'last_page' => $permissions->lastPage(),
        ]);
    }
}
