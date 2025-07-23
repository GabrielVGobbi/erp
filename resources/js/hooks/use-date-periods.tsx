import { useMemo } from 'react'
import {
    format,
    subDays,
    subWeeks,
    subMonths,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    addMonths,
    addWeeks
} from "date-fns"
import { ptBR } from "date-fns/locale"

export interface PeriodOption {
    label: string
    value: string
    calculate: () => { from: Date, to: Date }
}

export function useDatePeriods(customPeriods: PeriodOption[] = []): PeriodOption[] {
    return useMemo(() => {
        const defaultPeriods: PeriodOption[] = [
            {
                label: 'Hoje',
                value: 'today',
                calculate: () => ({
                    from: startOfDay(new Date()),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Ontem',
                value: 'yesterday',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 1)),
                    to: endOfDay(subDays(new Date(), 1))
                })
            },
            {
                label: 'Esta semana',
                value: 'this_week',
                calculate: () => ({
                    from: startOfWeek(new Date(), { locale: ptBR }),
                    to: endOfWeek(new Date(), { locale: ptBR })
                })
            },
            {
                label: 'Semana passada',
                value: 'last_week',
                calculate: () => ({
                    from: startOfWeek(subWeeks(new Date(), 1), { locale: ptBR }),
                    to: endOfWeek(subWeeks(new Date(), 1), { locale: ptBR })
                })
            },
            {
                label: 'Próxima semana',
                value: 'next_week',
                calculate: () => ({
                    from: startOfWeek(addWeeks(new Date(), 1), { locale: ptBR }),
                    to: endOfWeek(addWeeks(new Date(), 1), { locale: ptBR })
                })
            },
            {
                label: 'Este mês',
                value: 'this_month',
                calculate: () => ({
                    from: startOfMonth(new Date()),
                    to: endOfMonth(new Date())
                })
            },
            {
                label: 'Mês passado',
                value: 'last_month',
                calculate: () => ({
                    from: startOfMonth(subMonths(new Date(), 1)),
                    to: endOfMonth(subMonths(new Date(), 1))
                })
            },
            {
                label: 'Próximo mês',
                value: 'next_month',
                calculate: () => ({
                    from: startOfMonth(addMonths(new Date(), 1)),
                    to: endOfMonth(addMonths(new Date(), 1))
                })
            },
            {
                label: 'Últimos 7 dias',
                value: 'last_7_days',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 7)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Últimos 15 dias',
                value: 'last_15_days',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 15)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Últimos 30 dias',
                value: 'last_30_days',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 30)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Últimos 60 dias',
                value: 'last_60_days',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 60)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Últimos 90 dias',
                value: 'last_90_days',
                calculate: () => ({
                    from: startOfDay(subDays(new Date(), 90)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Últimos 6 meses',
                value: 'last_6_months',
                calculate: () => ({
                    from: startOfDay(subMonths(new Date(), 6)),
                    to: endOfDay(new Date())
                })
            },
            {
                label: 'Último ano',
                value: 'last_year',
                calculate: () => ({
                    from: startOfDay(subMonths(new Date(), 12)),
                    to: endOfDay(new Date())
                })
            }
        ]

        // Mesclar períodos padrão com customizados
        return [...defaultPeriods, ...customPeriods]
    }, [customPeriods])
}

// Helper function para converter valores do filtro avançado em parâmetros de API
export function convertAdvancedDateFilterToApiParams(
    filterId: string,
    filterValue: any,
    periodOptions: PeriodOption[]
): Record<string, string> {
    if (!filterValue?.column) return {}

    const params: Record<string, string> = {}
    const columnKey = filterValue.column

    if (filterValue.periodType === 'predefined' && filterValue.predefinedPeriod) {
        const period = periodOptions.find(p => p.value === filterValue.predefinedPeriod)
        if (period) {
            const { from, to } = period.calculate()
            params[`${columnKey}_from`] = format(from, 'yyyy-MM-dd')
            params[`${columnKey}_to`] = format(to, 'yyyy-MM-dd')
        }
    } else if (filterValue.periodType === 'custom' && filterValue.customFrom && filterValue.customTo) {
        params[`${columnKey}_from`] = format(filterValue.customFrom, 'yyyy-MM-dd')
        params[`${columnKey}_to`] = format(filterValue.customTo, 'yyyy-MM-dd')
    }

    return params
}
