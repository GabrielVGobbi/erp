<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role, $permission = null): Response
    {
        if (auth()->user()->hasRole(config('permissions.developer_role', 'developer'))) {
            return $next($request);
        }

        if (!$request->user()->hasRole($role)) {
            abort(403, 'Acesso negado. Você não tem permissão necessária.');
        }

        if ($permission !== null && !$request->user()->can($permission)) {
            abort(403, 'Acesso negado. Você não tem a permissão necessária.');
        }

        return $next($request);
    }
}
