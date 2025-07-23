import * as React from "react"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { Download, RotateCcw, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface DataTableServerViewOptionsProps<TData> {
    table: Table<TData>
    storageKey?: string
    enableLocalStorage?: boolean
    onResetTable?: () => void
    onExportData?: () => void
    defaultPageSize?: number
}

export function DataTableServerViewOptions<TData>({
    table,
    storageKey,
    enableLocalStorage = false,
    onResetTable,
    onExportData,
    defaultPageSize = 10,
}: DataTableServerViewOptionsProps<TData>) {

    // Função para limpar completamente o estado da tabela
    const handleResetTable = React.useCallback(() => {
        // Limpar os filtros de coluna
        table.resetColumnFilters();

        // Resetar ordenação
        table.resetSorting();

        // Resetar visibilidade de colunas
        table.getAllColumns().forEach(column => {
            if (column.getCanHide()) {
                column.toggleVisibility(true);
            }
        });

        // Resetar paginação - voltar para a primeira página e para o tamanho padrão
        table.setPagination({
            pageIndex: 0,
            pageSize: defaultPageSize
        });

        // Limpar localStorage se habilitado
        if (enableLocalStorage && storageKey) {
            try {
                localStorage.removeItem(`data-table-${storageKey}`);
            } catch (error) {
                console.error('Error removing table state from localStorage:', error);
            }
        }

        // Chamar callback personalizado se fornecido
        if (onResetTable) {
            onResetTable();
        }
    }, [table, enableLocalStorage, storageKey, onResetTable, defaultPageSize]);

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 lg:hidden"
                    >
                        <Settings2 className="h-4 w-4" />
                        <span className="sr-only">Opções da tabela</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Ações da tabela</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleResetTable}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Resetar tabela</span>
                    </DropdownMenuItem>

                    {onExportData && (
                        <DropdownMenuItem onClick={onExportData}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Exportar dados</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    // Usar mousedown para evitar problemas de eventos
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        column.toggleVisibility(column.getIsVisible() ? false : true);
                                    }}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                    }}
                                >

                                    {/* Usar um rótulo amigável para as colunas comuns */}
                                    {column.id === "email" ? "Email" :
                                        column.id === "name" ? "Nome" :
                                            column.id === "role" ? "Papel" :
                                                column.id === "status" ? "Status" :
                                                    column.id === "created_at" ? "Criado em" :
                                                        column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto hidden h-8 lg:flex"
                    >
                        <Settings2 className="mr-2 h-4 w-4" />
                        Visualizar
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Ações da tabela</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleResetTable}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Resetar tabela</span>
                    </DropdownMenuItem>

                    {onExportData && (
                        <DropdownMenuItem onClick={onExportData}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Exportar dados</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    // Usar mousedown para evitar problemas de eventos
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        column.toggleVisibility(column.getIsVisible() ? false : true);
                                    }}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    {/* Usar um rótulo amigável para as colunas comuns */}
                                    {column.id === "email" ? "Email" :
                                        column.id === "name" ? "Nome" :
                                            column.id === "role" ? "Papel" :
                                                column.id === "status" ? "Status" :
                                                    column.id === "created_at" ? "Criado em" :
                                                        column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
