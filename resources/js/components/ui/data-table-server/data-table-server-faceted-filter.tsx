import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DataTableServerFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
    // Para suportar filtros customizados
    selectedValues?: string[]
    onValueChange?: (values: string[]) => void
}

export function DataTableServerFacetedFilter<TData, TValue>({
    column,
    title,
    options,
    selectedValues: externalSelectedValues,
    onValueChange,
}: DataTableServerFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues()
    const [open, setOpen] = React.useState(false)

    // Usar valores externos se fornecidos, senão usar o valor da coluna
    const selectedValues = externalSelectedValues ||
        new Set(column?.getFilterValue() as string[])

    const isColumnFilter = !!column && !externalSelectedValues
    const isCustomFilter = !column && !!onValueChange

    // Manipulador para alternar uma opção de filtro
    function toggleOption(value: string) {
        if (isColumnFilter && column) {
            const filterValues = column.getFilterValue() as string[] || []
            const newFilterValues = filterValues.includes(value)
                ? filterValues.filter((v) => v !== value)
                : [...filterValues, value]

            column.setFilterValue(newFilterValues.length ? newFilterValues : undefined)
        }
        else if (isCustomFilter && onValueChange) {
            const newValues = Array.isArray(selectedValues)
                ? selectedValues.includes(value)
                    ? selectedValues.filter(v => v !== value)
                    : [...selectedValues, value]
                : [value]

            onValueChange(newValues)
        }
    }

    // Função para verificar se um valor está selecionado
    function isSelected(value: string) {
        if (isColumnFilter) {
            const filterValues = column?.getFilterValue() as string[] || []
            return filterValues.includes(value)
        }

        if (Array.isArray(selectedValues)) {
            return selectedValues.includes(value)
        }

        return false
    }

    // Limpa todos os filtros
    function clearFilters() {
        if (isColumnFilter) {
            column?.setFilterValue(undefined)
        } else if (isCustomFilter && onValueChange) {
            onValueChange([])
        }

        setOpen(false)
    }

    // Obter a contagem de valores selecionados
    const selectedCount = Array.isArray(selectedValues)
        ? selectedValues.length
        : selectedValues?.size ?? 0

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {selectedCount > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedCount}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedCount > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedCount} selecionados
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option => isSelected(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput  placeholder={title} autoFocus={false} />
                    <CommandList>
                        <CommandGroup>
                            {options.map((option) => {
                                const selected = isSelected(option.value)
                                return (
                                    <div
                                        key={option.value}
                                        className="flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                                        onClick={() => toggleOption(option.value)}
                                        role="button"
                                        tabIndex={0}
                                        aria-selected={selected}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                toggleOption(option.value)
                                            }
                                        }}
                                        data-value={option.value}
                                        data-selected={selected}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className={cn("h-4 w-4")} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </CommandGroup>
                        {selectedCount > 0 && (
                            <>
                                <CommandSeparator />
                                <div
                                    className="flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm text-center hover:bg-accent hover:text-accent-foreground"
                                    onClick={clearFilters}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            clearFilters()
                                        }
                                    }}
                                >
                                    Limpar filtros
                                </div>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
