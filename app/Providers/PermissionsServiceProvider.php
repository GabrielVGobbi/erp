<?php

namespace App\Providers;

use App\Modules\ACL\Models\Permission;
use Exception;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PermissionsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            Permission::get()->map(function ($permission) {
                Gate::define(
                    $permission->slug,
                    function ($user) use ($permission) {
                        return $user->hasPermissionTo($permission);
                    }
                );
            });
        } catch (Exception $e) {
            report($e);
        }

        // Blade directives
        Blade::directive('role', function ($role) {
            $permission_released = config('app.permission_released', 'dev');
            return "<?php if((auth()->check() && auth()->user()->hasRole({$role}) || auth()->user()->hasRole('{$permission_released}'))): ?>";
        });

        Blade::directive('endrole', function ($role) {
            return "<?php endif; ?>";
        });

        Blade::directive('permission', function ($permission) {
            return "<?php if(auth()->check() && auth()->user()->can({$permission})): ?>";
        });

        Blade::directive('endpermission', function ($permission) {
            return "<?php endif; ?>";
        });
    }
}
