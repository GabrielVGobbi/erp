import { useCallback, useRef } from 'react'

/**
 * Hook que cria callbacks estáveis que não mudam entre renders
 * mas sempre executam a versão mais recente da função
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
    const callbackRef = useRef(callback)
    
    // Sempre manter a referência atualizada
    callbackRef.current = callback
    
    // Retornar uma função estável que chama a versão mais recente
    return useCallback(((...args: Parameters<T>) => {
        return callbackRef.current(...args)
    }) as T, [])
}

/**
 * Hook para memoizar objetos complexos e evitar re-renders desnecessários
 */
export function useDeepMemo<T>(value: T, deps: React.DependencyList): T {
    const memoizedRef = useRef<T>(value)
    const depsRef = useRef(deps)
    
    // Comparação simples de dependências
    const depsChanged = deps.some((dep, index) => 
        dep !== depsRef.current[index]
    )
    
    if (depsChanged) {
        memoizedRef.current = value
        depsRef.current = deps
    }
    
    return memoizedRef.current
} 