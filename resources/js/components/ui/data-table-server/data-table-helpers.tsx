import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Cria uma coluna para seleção de linhas usando checkbox
 */
export function createSelectionColumn<TData>(): ColumnDef<TData> {
    return {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecionar tudo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                onClick={(e) => e.stopPropagation()} // Para evitar que o clique propague para a linha
                aria-label="Selecionar linha"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    };
}

/**
 * Cria uma coluna ordenável com cabeçalho personalizado
 */
export function createSortableColumn<TData>(
    headerText: string,
    accessorKey: string
): ColumnDef<TData> {
    return {
        accessorKey,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <span>{headerText}</span>
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : null}
                </Button>
            );
        },
    };
}

/**
 * Cria uma coluna de data formatada
 */
export function createDateColumn<TData>(
    headerText: string,
    accessorKey: string,
    formatString: string = "dd/MM/yyyy"
): ColumnDef<TData> {
    return {
        accessorKey,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <span>{headerText}</span>
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : null}
                </Button>
            );
        },
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as string;
            if (!value) return null;
            
            try {
                const date = typeof value === 'string' ? parseISO(value) : new Date(value);
                return <span>{format(date, formatString, { locale: ptBR })}</span>;
            } catch (error) {
                console.error(`Error formatting date ${value}:`, error);
                return <span>{value}</span>;
            }
        },
    };
}

interface BadgeOptions {
    [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
    };
}

/**
 * Cria uma coluna com badges coloridos
 */
export function createBadgeColumn<TData>(
    headerText: string,
    accessorKey: string,
    badgeOptions: BadgeOptions
): ColumnDef<TData> {
    return {
        accessorKey,
        header: headerText,
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as string;
            if (!value) return null;
            
            const option = badgeOptions[value];
            if (!option) return <span>{value}</span>;
            
            return (
                <Badge variant={option.variant}>
                    {option.label}
                </Badge>
            );
        },
    };
}

interface ActionsColumnOptions<TData> {
    viewRoute?: (row: TData) => string;
    editRoute?: (row: TData) => string;
    deleteRoute?: (row: TData) => string;
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
}

/**
 * Cria uma coluna de ações (visualizar, editar, excluir)
 */
export function createActionsColumn<TData>(
    options: ActionsColumnOptions<TData>
): ColumnDef<TData> {
    return {
        id: "actions",
        cell: ({ row }) => {
            const handleClick = (e: React.MouseEvent) => {
                e.stopPropagation();
            };
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={handleClick}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {(options.viewRoute || options.onView) && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (options.onView) {
                                        options.onView(row.original);
                                    } else if (options.viewRoute) {
                                        window.location.href = options.viewRoute(row.original);
                                    }
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Visualizar</span>
                            </DropdownMenuItem>
                        )}
                        
                        {(options.editRoute || options.onEdit) && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (options.onEdit) {
                                        options.onEdit(row.original);
                                    } else if (options.editRoute) {
                                        window.location.href = options.editRoute(row.original);
                                    }
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                        )}
                        
                        {(options.deleteRoute || options.onDelete) && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (options.onDelete) {
                                        options.onDelete(row.original);
                                    } else if (options.deleteRoute) {
                                        // Aqui você pode implementar uma confirmação antes de excluir
                                        if (window.confirm('Tem certeza que deseja excluir este item?')) {
                                            // Implementação de exclusão depende da sua arquitetura
                                            // Pode ser uma chamada de API, navegação, etc.
                                            console.log('Excluir item:', options.deleteRoute(row.original));
                                        }
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };
} 