import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"
import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Column actions helper
export function createActionsColumn<TData>({
    editRoute,
    deleteRoute,
    viewRoute,
    canEdit = true,
    canDelete = true,
    canView = true,
    onEdit,
    onDelete,
    extraActions = [],
}: {
    editRoute?: (row: TData) => string
    deleteRoute?: (row: TData) => string
    viewRoute?: (row: TData) => string
    canEdit?: boolean
    canDelete?: boolean
    canView?: boolean
    onEdit?: (row: TData) => void
    onDelete?: (row: TData) => void
    extraActions?: {
        label: string
        onClick: (row: TData) => void
        icon?: React.ReactNode
    }[]
}): ColumnDef<TData, any> {
    return {
        id: "actions",
        cell: ({ row }) => {
            const record = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {canView && viewRoute && (
                            <DropdownMenuItem asChild>
                                <Link href={viewRoute(record)}>Visualizar</Link>
                            </DropdownMenuItem>
                        )}

                        {canEdit && (editRoute || onEdit) && (
                            <DropdownMenuItem
                                onClick={() => onEdit && onEdit(record)}
                                asChild={!!editRoute}
                            >
                                {editRoute ? (
                                    <Link href={editRoute(record)}>Editar</Link>
                                ) : (
                                    "Editar"
                                )}
                            </DropdownMenuItem>
                        )}

                        {extraActions.map((action, index) => (
                            <DropdownMenuItem
                                key={`extra-action-${index}`}
                                onClick={() => action.onClick(record)}
                            >
                                {action.icon && (
                                    <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                            </DropdownMenuItem>
                        ))}

                        {canDelete && (deleteRoute || onDelete) && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete && onDelete(record)}
                                    asChild={!!deleteRoute}
                                    className="text-destructive"
                                >
                                    {deleteRoute ? (
                                        <Link href={deleteRoute(record)}>Excluir</Link>
                                    ) : (
                                        "Excluir"
                                    )}
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
}

// Selection column helper
export function createSelectionColumn<TData>(): ColumnDef<TData, any> {
    return {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecionar todos"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Selecionar linha"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }
}

export function createColumn<TData, TValue = any>(
    header: string,
    accessorKey: string
): ColumnDef<TData, TValue> {
    return {
        accessorKey,
        header: header

    }
}

// Sortable column helper
export function createSortableColumn<TData, TValue = any>(
    header: string,
    accessorKey: string
): ColumnDef<TData, TValue> {
    return {
        accessorKey,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {header}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }
}

// Badge column helper
export function createBadgeColumn<TData>(
    header: string,
    accessorKey: string,
    options: {
        [key: string]: {
            label: string;
            variant: 'default' | 'secondary' | 'destructive' | 'outline';
        }
    }
): ColumnDef<TData, any> {
    return {
        accessorKey,
        header,
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as string;
            const option = options[value];

            if (!option) return value;

            return (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${option.variant === 'default' ? 'bg-primary text-primary-foreground' :
                        option.variant === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                            option.variant === 'destructive' ? 'bg-destructive text-destructive-foreground' :
                                'bg-background text-foreground border border-input'
                    }`}>
                    {option.label}
                </span>
            );
        },
        filterFn: (row, id, value) => {
            return Array.isArray(value) ? value.includes(row.getValue(id)) : true;
        },
    };
}

// Date column helper
export function createDateColumn<TData>(
    header: string,
    accessorKey: string,
    formatString: string = 'dd/MM/yyyy'
): ColumnDef<TData, any> {
    return {
        accessorKey,
        header,
        cell: ({ row }) => {
            const dateValue = row.getValue(accessorKey);
            if (!dateValue) return null;

            const date = new Date(dateValue as string);
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: formatString.includes('HH') ? '2-digit' : undefined,
                minute: formatString.includes('mm') ? '2-digit' : undefined,
            });

            return formatter.format(date);
        },
    };
}

// Advanced Actions Column with full customization
export interface ActionButton<TData> {
    label: string
    icon?: React.ReactNode
    variant?: 'default' | 'destructive' | 'secondary' | 'ghost' | 'outline'
    type: 'link' | 'action' | 'confirm'
    href?: (row: TData) => string
    onClick?: (row: TData, onRefresh?: () => void) => void | Promise<void>
    condition?: (row: TData) => boolean
    tooltip?: string
    className?: string
    confirmTitle?: string
    confirmDescription?: string
    confirmButtonText?: string
    loading?: boolean
    disabled?: (row: TData) => boolean
}

export interface ActionGroup<TData> {
    label?: string
    actions: ActionButton<TData>[]
    separator?: boolean
}

export function createAdvancedActionsColumn<TData>({
    groups,
    actions,
    size = 'default',
    onRefresh
}: {
    groups?: ActionGroup<TData>[]
    actions?: ActionButton<TData>[]
    size?: 'sm' | 'default' | 'lg'
    onRefresh?: () => void
}): ColumnDef<TData, any> {
    return {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            const record = row.original
            const [loadingActions, setLoadingActions] = React.useState<Set<string>>(new Set())
            const [confirmAction, setConfirmAction] = React.useState<{
                action: ActionButton<TData>
                actionId: string
                isOpen: boolean
            } | null>(null)
            
            const handleAction = async (action: ActionButton<TData>, actionId: string) => {
                if (action.type === 'confirm') {
                    setConfirmAction({
                        action,
                        actionId,
                        isOpen: true
                    })
                } else if (action.type === 'action' && action.onClick) {
                    setLoadingActions(prev => new Set(prev.add(actionId)))
                    try {
                        await action.onClick(record, onRefresh)
                    } finally {
                        setLoadingActions(prev => {
                            const newSet = new Set(prev)
                            newSet.delete(actionId)
                            return newSet
                        })
                    }
                }
            }

            const executeConfirmAction = async () => {
                if (!confirmAction) return
                
                const { action, actionId } = confirmAction
                setLoadingActions(prev => new Set(prev.add(actionId)))
                
                try {
                    if (action.onClick) {
                        await action.onClick(record, onRefresh)
                    }
                } finally {
                    setLoadingActions(prev => {
                        const newSet = new Set(prev)
                        newSet.delete(actionId)
                        return newSet
                    })
                    setConfirmAction(null)
                }
            }

            // Renderizar botões como ações simples (sem dropdown)
            if (actions && actions.length <= 3) {
                return (
                    <>
                        <div className="flex items-center gap-1">
                            {actions
                                .filter(action => !action.condition || action.condition(record))
                                .map((action, index) => {
                                    const actionId = `action-${index}`
                                    const isLoading = loadingActions.has(actionId)
                                    const isDisabled = action.disabled ? action.disabled(record) : false

                                    if (action.type === 'link' && action.href) {
                                        return (
                                            <Button
                                                key={actionId}
                                                asChild
                                                variant={action.variant || 'ghost'}
                                                size={size}
                                                className={action.className}
                                                disabled={isDisabled}
                                            >
                                                <Link href={action.href(record)}>
                                                    {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                                                    {size !== 'sm' && <span className="ml-1">{action.label}</span>}
                                                </Link>
                                            </Button>
                                        )
                                    }

                                    return (
                                        <Button
                                            key={actionId}
                                            variant={action.variant || 'ghost'}
                                            size={size}
                                            className={action.className}
                                            onClick={() => handleAction(action, actionId)}
                                            disabled={isLoading || isDisabled}
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                            ) : (
                                                action.icon && <span className="w-4 h-4">{action.icon}</span>
                                            )}
                                            {size !== 'sm' && <span className="ml-1">{action.label}</span>}
                                        </Button>
                                    )
                                })}
                        </div>

                        {/* Modal de Confirmação */}
                        <Dialog open={confirmAction?.isOpen || false} onOpenChange={(open) => {
                            if (!open) {
                                setConfirmAction(null)
                            }
                        }}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {confirmAction?.action.confirmTitle || 'Confirmar ação'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {confirmAction?.action.confirmDescription || 'Tem certeza que deseja continuar?'}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setConfirmAction(null)}
                                        disabled={confirmAction?.actionId ? loadingActions.has(confirmAction.actionId) : false}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant={confirmAction?.action.variant || 'default'}
                                        onClick={executeConfirmAction}
                                        disabled={confirmAction?.actionId ? loadingActions.has(confirmAction.actionId) : false}
                                    >
                                        {(confirmAction?.actionId && loadingActions.has(confirmAction.actionId)) ? (
                                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 mr-2" />
                                        ) : null}
                                        {confirmAction?.action.confirmButtonText || 'Confirmar'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )
            }

            // Renderizar dropdown para muitas ações ou grupos
            const allActions = groups ? groups.flatMap(group => group.actions) : actions || []
            const visibleActions = allActions.filter(action => !action.condition || action.condition(record))

            if (visibleActions.length === 0) return null

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {groups ? groups.map((group, groupIndex) => (
                                <div key={`group-${groupIndex}`}>
                                    {group.label && (
                                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                            {group.label}
                                        </div>
                                    )}
                                    {group.actions
                                        .filter(action => !action.condition || action.condition(record))
                                        .map((action, actionIndex) => {
                                            const actionId = `group-${groupIndex}-action-${actionIndex}`
                                            const isLoading = loadingActions.has(actionId)
                                            const isDisabled = action.disabled ? action.disabled(record) : false

                                            if (action.type === 'link' && action.href) {
                                                return (
                                                    <DropdownMenuItem key={actionId} asChild>
                                                        <Link 
                                                            href={action.href(record)}
                                                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                                        >
                                                            {action.icon && <span className="mr-2 w-4 h-4">{action.icon}</span>}
                                                            {action.label}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )
                                            }

                                            return (
                                                <DropdownMenuItem
                                                    key={actionId}
                                                    onClick={() => handleAction(action, actionId)}
                                                    disabled={isLoading || isDisabled}
                                                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                                >
                                                    {isLoading ? (
                                                        <div className="mr-2 w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                                    ) : (
                                                        action.icon && <span className="mr-2 w-4 h-4">{action.icon}</span>
                                                    )}
                                                    {action.label}
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    {group.separator && <DropdownMenuSeparator />}
                                </div>
                            )) : (
                                actions?.filter(action => !action.condition || action.condition(record))
                                    .map((action, actionIndex) => {
                                        const actionId = `action-${actionIndex}`
                                        const isLoading = loadingActions.has(actionId)
                                        const isDisabled = action.disabled ? action.disabled(record) : false

                                        if (action.type === 'link' && action.href) {
                                            return (
                                                <DropdownMenuItem key={actionId} asChild>
                                                    <Link 
                                                        href={action.href(record)}
                                                        className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                                    >
                                                        {action.icon && <span className="mr-2 w-4 h-4">{action.icon}</span>}
                                                        {action.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            )
                                        }

                                        return (
                                            <DropdownMenuItem
                                                key={actionId}
                                                onClick={() => handleAction(action, actionId)}
                                                disabled={isLoading || isDisabled}
                                                className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                            >
                                                {isLoading ? (
                                                    <div className="mr-2 w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                                ) : (
                                                    action.icon && <span className="mr-2 w-4 h-4">{action.icon}</span>
                                                )}
                                                {action.label}
                                            </DropdownMenuItem>
                                        )
                                    })
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Modal de Confirmação */}
                    <Dialog open={confirmAction?.isOpen || false} onOpenChange={(open) => {
                        if (!open) {
                            setConfirmAction(null)
                        }
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {confirmAction?.action.confirmTitle || 'Confirmar ação'}
                                </DialogTitle>
                                <DialogDescription>
                                    {confirmAction?.action.confirmDescription || 'Tem certeza que deseja continuar?'}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setConfirmAction(null)}
                                    disabled={confirmAction?.actionId ? loadingActions.has(confirmAction.actionId) : false}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    variant={confirmAction?.action.variant || 'default'}
                                    onClick={executeConfirmAction}
                                    disabled={confirmAction?.actionId ? loadingActions.has(confirmAction.actionId) : false}
                                >
                                    {(confirmAction?.actionId && loadingActions.has(confirmAction.actionId)) ? (
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 mr-2" />
                                    ) : null}
                                    {confirmAction?.action.confirmButtonText || 'Confirmar'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    }
}
