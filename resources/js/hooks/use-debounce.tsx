import React, { useEffect, useRef, useCallback } from 'react'

/**
 * Hook de debounce otimizado que evita re-renders desnecessários
 */
export function useDebounce() {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const debouncedCallback = useCallback((callback: () => void, delay: number = 600) => {
        // Limpar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Configurar novo timeout
        timeoutRef.current = setTimeout(callback, delay)
    }, [])

    // Cleanup ao desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return debouncedCallback
}

/**
 * Hook para debounce de valores com estado interno
 */
export function useDebouncedValue<T>(value: T, delay: number = 600): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * Hook para input com debounce que mantém valor local
 */
export function useDebouncedInput(
    initialValue: string = '',
    onDebouncedChange: (value: string) => void,
    delay: number = 600
) {
    const [localValue, setLocalValue] = React.useState(initialValue)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Atualizar valor local quando o inicial mudar (ex: reset)
    useEffect(() => {
        setLocalValue(initialValue)
    }, [initialValue])

    // Handler otimizado para mudanças
    const handleChange = useCallback((value: string) => {
        setLocalValue(value)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            onDebouncedChange(value)
        }, delay)
    }, [onDebouncedChange, delay])

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return {
        value: localValue,
        onChange: handleChange,
        setValue: setLocalValue
    }
} 