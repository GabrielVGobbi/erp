<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class MultiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        #if (Auth::guard('web')->check() || Auth::guard('sanctum')->check()) {
        #    return $next($request);
        #}

        if (Auth::guard('web')->check()) {
            Auth::shouldUse('web');
        } elseif (Auth::guard('sanctum')->check()) {
            Auth::shouldUse('sanctum');
        } else {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            return redirect()->to('login')->withInput();
        }

        return $next($request);
    }
}
