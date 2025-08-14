<?php

namespace App\Modules\ACL\Helpers;

use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Models\Role;
use App\Models\User;

class PermissionHelper
{
    /**
     * Atribui uma role a um usuário
     */
    public static function assignRoleToUser(User $user, string $roleSlug): bool
    {
        $role = Role::where('slug', $roleSlug)->first();

        if (!$role) {
            return false;
        }

        $user->roles()->syncWithoutDetaching([$role->id]);
        return true;
    }

    /**
     * Remove uma role de um usuário
     */
    public static function removeRoleFromUser(User $user, string $roleSlug): bool
    {
        $role = Role::where('slug', $roleSlug)->first();

        if (!$role) {
            return false;
        }

        $user->roles()->detach($role->id);
        return true;
    }

    /**
     * Atribui uma permissão diretamente a um usuário
     */
    public static function assignPermissionToUser(User $user, string $permissionSlug): bool
    {
        $permission = Permission::where('slug', $permissionSlug)->first();

        if (!$permission) {
            return false;
        }

        $user->permissions()->syncWithoutDetaching([$permission->id]);
        return true;
    }

    /**
     * Remove uma permissão diretamente de um usuário
     */
    public static function removePermissionFromUser(User $user, string $permissionSlug): bool
    {
        $permission = Permission::where('slug', $permissionSlug)->first();

        if (!$permission) {
            return false;
        }

        $user->permissions()->detach($permission->id);
        return true;
    }

    /**
     * Verifica se um usuário tem uma permissão específica
     */
    public static function userHasPermission(User $user, string $permissionSlug): bool
    {
        $permission = Permission::where('slug', $permissionSlug)->first();

        if (!$permission) {
            return false;
        }

        return $user->hasPermissionTo($permission);
    }

    /**
     * Verifica se um usuário tem uma role específica
     */
    public static function userHasRole(User $user, string $roleSlug): bool
    {
        return $user->hasRole($roleSlug);
    }

    /**
     * Obtém todas as permissões de um módulo
     */
    public static function getModulePermissions(string $module): array
    {
        return Permission::where('module', $module)->get()->toArray();
    }

    /**
     * Cria permissões para um módulo
     */
    public static function createModulePermissions(string $module, array $actions = ['view', 'create', 'edit', 'delete']): void
    {
        foreach ($actions as $action) {
            Permission::firstOrCreate([
                'slug' => strtolower($module) . '.' . $action
            ], [
                'name' => ucfirst($action) . ' ' . ucfirst($module),
                'module' => $module,
                'description' => "Permissão para {$action} no módulo {$module}"
            ]);
        }
    }
}
