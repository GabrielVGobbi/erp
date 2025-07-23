import React, { useCallback, useEffect, useRef, useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableServerFacetedFilter } from "./data-table-server-faceted-filter"
import { DataTableServerAsyncSelectFilter } from "./data-table-server-async-select-filter"
import { DataTableServerAdvancedDateFilter } from "./data-table-server-advanced-date-filter"
import { CustomFilter, FilterType } from "./data-table-server"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useDebouncedInput } from "@/hooks/use-debounce"

interface DataTableServerToolbarProps<TData> {
    table: Table<TData>
    searchColumn?: string
    filterableColumns?: {
        id: string
        title: string
        options: {
            label: string
            value: string
            icon?: React.ComponentType<{ className?: string }>
        }[]
    }[]
    customFilters?: CustomFilter[]
    customFilterValues?: Record<string, any>
    onCustomFilterChange?: (filterId: string, value: any) => void
    storageKey?: string
    enableLocalStorage?: boolean
}

export function DataTableServerToolbar<TData>({
    table,
    searchColumn = "name",
    filterableColumns = [],
    customFilters = [],
    customFilterValues = {},
    onCustomFilterChange,
    storageKey,
    enableLocalStorage = false
}: DataTableServerToolbarProps<TData>) {

    const isFilteredHasValues = Object.keys(customFilterValues).some(
        (key) => customFilterValues[key] && customFilterValues[key].length > 0
    );

    // Check if there are any active filters
    const isFiltered = table.getState().columnFilters.length > 0 ||
        isFilteredHasValues ||
        customFilters.some(filter => customFilterValues[filter.id]);

    // Inicializar o searchValue com o valor do filtro da coluna de busca, se existir
    const initialSearchValue = (() => {
        if (searchColumn) {
            const column = table.getColumn(searchColumn);
            if (column) {
                const filterValue = column.getFilterValue();
                if (typeof filterValue === 'string') {
                    return filterValue;
                }
            }
        }
        return "";
    })();

    // Hook otimizado para input com debounce
    const searchInput = useDebouncedInput(
        initialSearchValue,
        useCallback((value: string) => {
            if (searchColumn) {
                const column = table.getColumn(searchColumn);
                if (column) {
                    column.setFilterValue(value || undefined);
                }
            }
        }, [searchColumn, table]),
        600 // Debounce de 600ms para melhor performance
    );

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Atualiza o searchValue quando o filtro da coluna muda externamente
    useEffect(() => {
        if (searchColumn) {
            const column = table.getColumn(searchColumn);
            if (column) {
                const filterValue = column.getFilterValue();
                if (typeof filterValue === 'string' && filterValue !== searchInput.value) {
                    searchInput.setValue(filterValue);
                }
            }
        }
    }, [table.getState().columnFilters, searchColumn, table, searchInput]);

    // Limpar todos os filtros
    const handleClearFilters = useCallback(() => {
        // Limpa o input de busca
        searchInput.setValue("");

        // Cancela qualquer debounce pendente
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Limpa todos os filtros da tabela de uma vez
        table.resetColumnFilters();

        // Limpa os filtros customizados
        if (onCustomFilterChange) {
            customFilters.forEach(filter => {
                onCustomFilterChange(filter.id, undefined);
            });
        }
    }, [table, customFilters, onCustomFilterChange, searchInput]);

    // Limpeza ao desmontar o componente
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    // Renderiza um filtro customizado com base no tipo
    const renderCustomFilter = useCallback((filter: CustomFilter) => {

        const value = customFilterValues[filter.id];

        switch (filter.type) {
            case 'select':
                if (!filter.options) return null;
                return (
                    <DataTableServerFacetedFilter
                        key={filter.id}
                        title={filter.title}
                        options={filter.options}
                        selectedValues={Array.isArray(value) ? value : value ? [value] : []}
                        onValueChange={(values) => {
                            if (onCustomFilterChange) {
                                onCustomFilterChange(filter.id, values.length ? values : undefined);
                            }
                        }}
                    />
                );

            case 'text':
                // Hook otimizado para cada filtro de texto
                const textInput = useDebouncedInput(
                    value || '',
                    (newValue: string) => {
                        if (onCustomFilterChange) {
                            onCustomFilterChange(filter.id, newValue || undefined);
                        }
                    },
                    600
                );

                return (
                    <div key={filter.id} className="flex items-center">
                        <Input
                            placeholder={`Filtrar por ${filter.title}...`}
                            value={textInput.value}
                            onChange={(e) => textInput.onChange(e.target.value)}
                            className="h-8 w-[150px] lg:w-[180px]"
                        />
                    </div>
                );

            case 'date':
                return (
                    <div key={filter.id} className="flex items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`h-8 border-dashed ${value ? "" : "text-muted-foreground"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {value ? format(new Date(value), "dd/MM/yyyy", { locale: ptBR }) : filter.title}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={value ? new Date(value) : undefined}
                                    onSelect={(date) => {
                                        if (onCustomFilterChange) {
                                            onCustomFilterChange(filter.id, date ? date.toISOString().split('T')[0] : undefined)
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )

            case 'async-select':
                if (!filter.apiEndpoint) return null;
                return (
                    <DataTableServerAsyncSelectFilter
                        key={filter.id}
                        title={filter.title}
                        apiEndpoint={filter.apiEndpoint}
                        selectedValues={Array.isArray(value) ? value : value ? [value] : []}
                        onValueChange={(values) => {
                            if (onCustomFilterChange) {
                                onCustomFilterChange(filter.id, values.length ? values : undefined);
                            }
                        }}
                        transformData={filter.transformData}
                        searchPlaceholder={filter.searchPlaceholder}
                    />
                );

            case 'advanced-date':
                if (!filter.dateColumns) return null;
                return (
                    <DataTableServerAdvancedDateFilter
                        key={filter.id}
                        title={filter.title}
                        dateColumns={filter.dateColumns}
                        periodOptions={filter.periodOptions}
                        selectedValue={value}
                        onValueChange={(advancedValue) => {
                            if (onCustomFilterChange) {
                                onCustomFilterChange(filter.id, advancedValue);
                            }
                        }}
                    />
                );

            default:
                return null;
        }
    }, [customFilterValues, onCustomFilterChange, debounceTimeout]);

    return (
        <div className="flex-1 flex-wrap items-center gap-2 py-4">
            <div className="flex flex-wrap items-center gap-2">
                {searchColumn && (
                    <Input
                        placeholder="Buscador Global"
                        value={searchInput.value}
                        onChange={(e) => searchInput.onChange(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}

                {filterableColumns.map((column) => {
                    const tableColumn = table.getColumn(column.id);
                    if (!tableColumn) return null;

                    return (
                        <DataTableServerFacetedFilter
                            key={column.id}
                            column={tableColumn}
                            title={column.title}
                            options={column.options}
                        />
                    );
                })}

                {customFilters.map(renderCustomFilter)}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpar
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
