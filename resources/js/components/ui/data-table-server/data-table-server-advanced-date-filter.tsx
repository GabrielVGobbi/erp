import * as React from "react"
import { CalendarIcon, PlusCircleIcon, X } from "lucide-react"
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export interface DateColumn {
    label: string
    value: string
}

export interface PeriodOption {
    label: string
    value: string
    calculate: () => { from: Date, to: Date }
}

interface AdvancedDateFilterValue {
    column?: string
    periodType?: 'predefined' | 'custom'
    predefinedPeriod?: string
    customFrom?: Date
    customTo?: Date
}

interface DataTableServerAdvancedDateFilterProps {
    title?: string
    dateColumns: DateColumn[]
    periodOptions?: PeriodOption[]
    selectedValue?: AdvancedDateFilterValue
    onValueChange?: (value: AdvancedDateFilterValue | undefined) => void
}

// Períodos pré-definidos padrão
const defaultPeriodOptions: PeriodOption[] = [
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
        label: 'Últimos 7 dias',
        value: 'last_7_days',
        calculate: () => ({
            from: startOfDay(subDays(new Date(), 7)),
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
        label: 'Últimos 90 dias',
        value: 'last_90_days',
        calculate: () => ({
            from: startOfDay(subDays(new Date(), 90)),
            to: endOfDay(new Date())
        })
    }
]

export function DataTableServerAdvancedDateFilter({
    title = "Filtro de Data",
    dateColumns,
    periodOptions = defaultPeriodOptions,
    selectedValue,
    onValueChange
}: DataTableServerAdvancedDateFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [showCustomDatePicker, setShowCustomDatePicker] = React.useState(false)

    // Função para atualizar o valor
    const updateValue = React.useCallback((updates: Partial<AdvancedDateFilterValue>) => {
        const newValue = { ...selectedValue, ...updates }

        // Se mudou o tipo de período, limpar valores específicos
        if (updates.periodType) {
            if (updates.periodType === 'predefined') {
                newValue.customFrom = undefined
                newValue.customTo = undefined
            } else {
                newValue.predefinedPeriod = undefined
            }
        }

        onValueChange?.(newValue)
    }, [selectedValue, onValueChange])

    // Função para limpar o filtro
    const clearFilter = React.useCallback(() => {
        onValueChange?.(undefined)
        setOpen(false)
    }, [onValueChange])

    // Função para obter o texto do filtro ativo
    const getFilterText = React.useCallback(() => {
        if (!selectedValue?.column) return null

        const column = dateColumns.find(col => col.value === selectedValue.column)
        if (!column) return null

        let periodText = ''

        if (selectedValue.periodType === 'predefined' && selectedValue.predefinedPeriod) {
            const option = periodOptions.find(opt => opt.value === selectedValue.predefinedPeriod)
            periodText = option?.label || ''
        } else if (selectedValue.periodType === 'custom' && selectedValue.customFrom && selectedValue.customTo) {
            periodText = `${format(selectedValue.customFrom, 'dd/MM/yyyy', { locale: ptBR })} - ${format(selectedValue.customTo, 'dd/MM/yyyy', { locale: ptBR })}`
        }

        return periodText ? `${column.label}: ${periodText}` : column.label
    }, [selectedValue, dateColumns, periodOptions])

    const filterText = getFilterText()
    const hasActiveFilter = !!selectedValue?.column

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    {title}
                    {hasActiveFilter && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal max-w-[290px] truncate"
                            >
                                {filterText}
                            </Badge>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <div className="p-4 space-y-4">
                    {/* Título */}
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Filtro por Data</h4>
                        {hasActiveFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilter}
                                className="h-6 px-2 text-xs"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    {/* Seleção da coluna de data */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Coluna de Data</label>
                        <Select
                            value={selectedValue?.column || ''}
                            onValueChange={(value) => updateValue({ column: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma coluna de data" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateColumns.map((column) => (
                                    <SelectItem key={column.value} value={column.value}>
                                        {column.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Seleção do tipo de período */}
                    {selectedValue?.column && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Período</label>
                            <Select
                                value={selectedValue?.periodType || ''}
                                onValueChange={(value: 'predefined' | 'custom') => updateValue({ periodType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="predefined">Período Pré-definido</SelectItem>
                                    <SelectItem value="custom">Período Específico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Período pré-definido */}
                    {selectedValue?.periodType === 'predefined' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Período</label>
                            <Select
                                value={selectedValue?.predefinedPeriod || ''}
                                onValueChange={(value) => updateValue({ predefinedPeriod: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um período" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periodOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Período específico */}
                    {selectedValue?.periodType === 'custom' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Período Específico</label>

                            {/* Data de início */}
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Data de Início</label>
                                <Popover open={showCustomDatePicker} onOpenChange={setShowCustomDatePicker}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedValue?.customFrom && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedValue?.customFrom ?
                                                format(selectedValue.customFrom, "dd/MM/yyyy", { locale: ptBR }) :
                                                "Selecione a data"
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedValue?.customFrom}
                                            onSelect={(date) => {
                                                updateValue({ customFrom: date })
                                                setShowCustomDatePicker(false)
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Data de fim */}
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Data de Fim</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedValue?.customTo && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedValue?.customTo ?
                                                format(selectedValue.customTo, "dd/MM/yyyy", { locale: ptBR }) :
                                                "Selecione a data"
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedValue?.customTo}
                                            onSelect={(date) => updateValue({ customTo: date })}
                                            disabled={(date) =>
                                                selectedValue?.customFrom ? date < selectedValue.customFrom : false
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    {/* Botão aplicar */}
                    {selectedValue?.column && selectedValue?.periodType && (
                        (selectedValue.periodType === 'predefined' && selectedValue.predefinedPeriod) ||
                        (selectedValue.periodType === 'custom' && selectedValue.customFrom && selectedValue.customTo)
                    ) && (
                        <Button
                            onClick={() => setOpen(false)}
                            className="w-full"
                            size="sm"
                        >
                            Aplicar Filtro
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
