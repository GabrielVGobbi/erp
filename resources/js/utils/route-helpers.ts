import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type SharedData } from '@/types';

/**
 * Hook para verificar se uma rota está ativa
 */
export function useActiveRoute() {
    const page = usePage<SharedData>();

    /**
     * Verifica se uma rota está ativa baseada no nome da rota
     */
    const isActiveRoute = (routeName: string, params?: any): boolean => {
        try {
            const routeUrl = route(routeName, params);
            return page.url === routeUrl || page.url.startsWith(routeUrl);
        } catch {
            return false;
        }
    };

    /**
     * Verifica se uma rota está ativa baseada na URL
     */
    const isActiveUrl = (url: string): boolean => {
        return page.url === url || page.url.startsWith(url);
    };

    /**
     * Verifica se qualquer uma das rotas está ativa
     */
    const isAnyRouteActive = (routes: string[]): boolean => {
        return routes.some(routeName => isActiveRoute(routeName));
    };

    return {
        isActiveRoute,
        isActiveUrl,
        isAnyRouteActive,
        currentUrl: page.url
    };
}
