import React, { useState, useEffect, useCallback, useRef } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    PaginationState,
} from "@tanstack/react-table"
import { useStableCallback } from "@/hooks/use-stable-callback"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTableServerPagination } from "./data-table-server-pagination"
import { DataTableServerToolbar } from "./data-table-server-toolbar"
import { DataTableServerViewOptions } from "./data-table-server-view-options"
import { BulkAction, DataTableServerBulkActions } from "./data-table-server-bulk-actions"

interface FilterOption {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

export type FilterType = 'select' | 'text' | 'date' | 'daterange' | 'boolean' | 'async-select' | 'advanced-date'

export interface CustomFilter {
    id: string
    title: string
    type: FilterType
    options?: FilterOption[]
    defaultValue?: any
    // Propriedades específicas para async-select
    apiEndpoint?: string
    transformData?: (data: any) => { label: string; value: string }[]
    searchPlaceholder?: string
    // Propriedades específicas para advanced-date
    dateColumns?: { label: string; value: string }[]
    periodOptions?: { label: string; value: string; calculate: () => { from: Date; to: Date } }[]
}

interface DataTableServerProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    apiEndpoint: string
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
    onRowClick?: (row: TData) => void
    defaultPageSize?: number
    defaultFilters?: Record<string, any>
    initialPageIndex?: number
    extraParams?: Record<string, any>
    transformResponse?: (data: any) => { data: TData[], meta: { total: number, last_page: number } }
    onDataLoaded?: (data: TData[]) => void
    // Chave única para identificar esta tabela no localStorage
    storageKey?: string
    // Se verdadeiro, ativa a persistência no localStorage (padrão: false)
    enableLocalStorage?: boolean
    // Ações em massa para as linhas selecionadas
    bulkActions?: BulkAction<TData>[]
    // Trigger para forçar refresh dos dados (incrementar para forçar reload)
    refetchTrigger?: number
}

// Interface para o estado salvo no localStorage
interface SavedTableState {
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    columnVisibility: VisibilityState
    customFilterValues: Record<string, any>
}

// Função para salvar o estado da tabela no localStorage
const saveTableState = (key: string, state: SavedTableState) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(`data-table-${key}`, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving table state to localStorage:', error);
    }
};

// Função para carregar o estado da tabela do localStorage
const loadTableState = (key: string): SavedTableState | null => {
    if (typeof window === 'undefined') return null;

    try {
        const savedState = localStorage.getItem(`data-table-${key}`);
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Error loading table state from localStorage:', error);
    }

    return null;
};

export function DataTableServer<TData, TValue>({
    columns,
    data: initialData,
    pageCount: initialPageCount = 1,
    apiEndpoint,
    searchColumn,
    filterableColumns = [],
    customFilters = [],
    onRowClick,
    defaultPageSize = 10,
    defaultFilters = {},
    initialPageIndex = 0,
    extraParams = {},
    transformResponse,
    onDataLoaded,
    storageKey,
    enableLocalStorage = false,
    bulkActions = [],
    refetchTrigger,
}: DataTableServerProps<TData, TValue>) {
    // Verificar se devemos usar localStorage e se há uma chave válida
    const useLocalStorage = enableLocalStorage && !!storageKey;

    // Carregar estado salvo do localStorage se disponível
    const savedState = useLocalStorage ? loadTableState(storageKey!) : null;

    // Estado para os dados da tabela
    const [data, setData] = useState<TData[]>(initialData);

    // Estado para controle de carregamento
    const [loading, setLoading] = useState(false);

    // Estado para contagem de páginas
    const [pageCount, setPageCount] = useState(initialPageCount);

    // Estado para seleção de linhas
    const [rowSelection, setRowSelection] = useState({});

    // Estado para visibilidade de colunas (usar salvo ou padrão)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        savedState?.columnVisibility || {}
    );

    // Estado para filtros de colunas (usar salvo ou padrão)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        savedState?.columnFilters || []
    );

    // Estado para ordenação (usar salvo ou padrão)
    const [sorting, setSorting] = useState<SortingState>(
        savedState?.sorting || []
    );

    // Estado para paginação (usar salvo ou padrão)
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(
        savedState?.pagination || {
            pageIndex: initialPageIndex,
            pageSize: defaultPageSize,
        }
    );

    // Estado para filtros customizados (usar salvo ou padrão)
    const [customFilterValues, setCustomFilterValues] = useState<Record<string, any>>(
        savedState?.customFilterValues || {}
    );

    // Flag para evitar chamadas iniciais desnecessárias
    const initialLoadRef = useRef(true);

    // Referência para o timeout de debounce
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Referência para os últimos parâmetros usados para evitar chamadas duplicadas
    const lastFetchParamsRef = useRef<string>('');

    // Manipulador para mudanças nos filtros customizados
    const handleCustomFilterChange = useStableCallback((filterId: string, value: any) => {
        setCustomFilterValues((prev) => {
            const newValues = {
                ...prev,
                [filterId]: value
            };

            // Salvar estado atualizado no localStorage se habilitado
            if (useLocalStorage) {
                saveTableState(storageKey!, {
                    pagination: { pageIndex, pageSize },
                    sorting,
                    columnFilters,
                    columnVisibility,
                    customFilterValues: newValues
                });
            }

            return newValues;
        });
    });

    // Função para buscar dados da API com todos os parâmetros necessários
    const fetchData = useStableCallback(async (options: {
        pageIndex: number;
        pageSize: number;
        filters: ColumnFiltersState;
        sorting: SortingState;
        forceRefetch?: boolean;
    }) => {
        if (!apiEndpoint) return;

        // Preparar os parâmetros de paginação
        const params = new URLSearchParams({
            page: (options.pageIndex + 1).toString(),
            per_page: options.pageSize.toString(),
        });

        // Adicionar parametros extra se existirem
        Object.entries(extraParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });

        // Adicionar parâmetros de busca a partir dos filtros de colunas
        options.filters.forEach(filter => {
            if (filter.id === searchColumn && typeof filter.value === 'string') {
                params.append('search', filter.value);
            } else if (Array.isArray(filter.value) && filter.value.length > 0) {
                params.append(filter.id, filter.value.join(','));
            } else if (typeof filter.value === 'string' || typeof filter.value === 'number') {
                params.append(filter.id, filter.value.toString());
            }
        });

        // Adicionar filtros customizados
        Object.entries(customFilterValues).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value) && value.length > 0) {
                    params.append(key, value.join(','));
                } else if (typeof value === 'object' && value !== null) {
                    // Para filtros de data range simples
                    if (value.from && value.to) {
                        params.append(`${key}_from`, value.from);
                        params.append(`${key}_to`, value.to);
                    }
                    // Para filtros avançados de data
                    else if (value.column) {
                        const columnKey = value.column;

                        if (value.periodType === 'predefined' && value.predefinedPeriod) {
                            // Encontrar o filtro customizado correspondente para obter os periodOptions
                            const customFilter = customFilters.find(filter => filter.id === key);
                            if (customFilter?.periodOptions) {
                                const period = customFilter.periodOptions.find(p => p.value === value.predefinedPeriod);
                                if (period) {
                                    const { from, to } = period.calculate();
                                    params.append(`${columnKey}_from`, from.toISOString().split('T')[0]);
                                    params.append(`${columnKey}_to`, to.toISOString().split('T')[0]);
                                }
                            }
                        } else if (value.periodType === 'custom' && value.customFrom && value.customTo) {
                            params.append(`${columnKey}_from`, value.customFrom.toISOString().split('T')[0]);
                            params.append(`${columnKey}_to`, value.customTo.toISOString().split('T')[0]);
                        }
                    }
                } else if (value !== '') {
                    params.append(key, value.toString());
                }
            }
        });

        // Adicionar parâmetros de ordenação
        if (options.sorting.length > 0) {
            const sort = options.sorting[0];
            params.append('sort_by', sort.id);
            params.append('sort_direction', sort.desc ? 'desc' : 'asc');
        }

        // Adicionar filtros padrão
        Object.entries(defaultFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== 'all') {
                params.append(key, value.toString());
            }
        });

        // Criar uma string única para estes parâmetros
        const paramsString = params.toString();

        // Verificar se os parâmetros são iguais aos últimos usados (exceto se for forceRefetch)
        if (!options.forceRefetch && paramsString === lastFetchParamsRef.current) {
            return; // Evita chamadas duplicadas com os mesmos parâmetros
        }

        // Atualizar a referência dos últimos parâmetros usados
        lastFetchParamsRef.current = paramsString;

        setLoading(true);

        try {
            console.log(`Fetching data from ${apiEndpoint}`, options.forceRefetch ? '(FORCE REFRESH)' : '');

            // Fazer a requisição para a API
            const response = await fetch(`${apiEndpoint}?${params}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const responseData = await response.json();

            // Transformar a resposta se necessário ou usar o formato padrão
            const { data: tableData, meta } = transformResponse
                ? transformResponse(responseData)
                : responseData;

            // Atualizar os dados e a contagem de páginas
            setData(tableData);
            setPageCount(data.last_page);

            // Notificar o componente pai se necessário
            if (onDataLoaded) {
                onDataLoaded(tableData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    });

    // Função para aplicar filtros com debounce
    const debouncedFetchData = useCallback((options: {
        pageIndex: number;
        pageSize: number;
        filters: ColumnFiltersState;
        sorting: SortingState;
    }) => {
        // Limpar o timeout anterior se existir
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Definir novo timeout para buscar dados após 600ms para melhor performance
        debounceTimeoutRef.current = setTimeout(() => {
            fetchData(options);
        }, 600);
    }, [fetchData]);

    // Efetuar busca quando mudar paginação, filtros, ordenação ou filtros customizados
    useEffect(() => {
        // Skip primeira renderização para evitar chamadas duplicadas
        if (initialLoadRef.current) {
            initialLoadRef.current = false;

            // Definir valores padrão para filtros customizados
            const initialCustomFilters: Record<string, any> = {};
            customFilters.forEach(filter => {
                if (filter.defaultValue !== undefined) {
                    initialCustomFilters[filter.id] = filter.defaultValue;
                }
            });

            if (Object.keys(initialCustomFilters).length > 0) {
                setCustomFilterValues(prev => ({ ...prev, ...initialCustomFilters }));
            }

            // Fazer a primeira chamada se os dados iniciais estiverem vazios
            if (initialData.length === 0) {
                debouncedFetchData({
                    pageIndex,
                    pageSize,
                    filters: columnFilters,
                    sorting
                });
            }
            return;
        }

        debouncedFetchData({
            pageIndex,
            pageSize,
            filters: columnFilters,
            sorting
        });

        // Limpar timeout ao desmontar componente
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [
        pageIndex,
        pageSize,
        columnFilters,
        sorting,
        customFilterValues,
        debouncedFetchData
    ]);

    // Efeito para forçar refresh quando refetchTrigger mudar
    useEffect(() => {
        if (refetchTrigger !== undefined && !initialLoadRef.current) {
            fetchData({
                pageIndex,
                pageSize,
                filters: columnFilters,
                sorting,
                forceRefetch: true
            });
        }
    }, [refetchTrigger, fetchData, pageIndex, pageSize, columnFilters, sorting]);

    // Efeito para salvar o estado no localStorage quando houver mudanças
    useEffect(() => {
        if (useLocalStorage && !initialLoadRef.current) {
            // Salvar o estado atual no localStorage
            saveTableState(storageKey!, {
                pagination: { pageIndex, pageSize },
                sorting,
                columnFilters,
                columnVisibility,
                customFilterValues
            });
        }
    }, [
        useLocalStorage,
        storageKey,
        pageIndex,
        pageSize,
        sorting,
        columnFilters,
        columnVisibility,
        customFilterValues,
    ]);

    // Configurar a tabela
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination: { pageIndex, pageSize },
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
    });

    // Handler para resetar completamente a tabela, incluindo filtros customizados
    const handleResetTable = useCallback(() => {
        // Resetar filtros customizados
        setCustomFilterValues({});

        // Limpar seleção de linhas
        table.resetRowSelection();

        // Forçar busca de dados após reset
        fetchData({
            pageIndex: 0,
            pageSize: defaultPageSize, // Usar o tamanho padrão da página
            filters: [],
            sorting: []
        });
    }, [fetchData, defaultPageSize, table]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <DataTableServerToolbar
                    table={table}
                    searchColumn={searchColumn}
                    filterableColumns={filterableColumns}
                    customFilters={customFilters}
                    customFilterValues={customFilterValues}
                    onCustomFilterChange={handleCustomFilterChange}
                    storageKey={storageKey}
                    enableLocalStorage={enableLocalStorage}
                />
                <DataTableServerViewOptions
                    table={table}
                    storageKey={storageKey}
                    enableLocalStorage={enableLocalStorage}
                    onResetTable={handleResetTable}
                    defaultPageSize={defaultPageSize}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-gray-800 text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Mostrar skeleton loader enquanto carrega
                            Array.from({ length: pageSize }).map((_, index) => (
                                <TableRow key={`loading-${index}`} className="animate-pulse">
                                    {Array.from({ length: columns.length }).map((_, colIndex) => (
                                        <TableCell key={`loading-cell-${colIndex}`}>
                                            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                                    onClick={() => onRowClick && onRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTableServerPagination table={table} />

            <DataTableServerBulkActions table={table} actions={bulkActions} />
        </div>
    );
}
