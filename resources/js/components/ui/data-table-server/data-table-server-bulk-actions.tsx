import React from "react";
import { Table } from "@tanstack/react-table";
import { Trash2, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DataTableServerBulkActionsProps<TData> {
    table: Table<TData>;
    actions?: BulkAction<TData>[];
}

export interface BulkAction<TData> {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    action: (selectedRows: TData[]) => Promise<void>;
}

export function DataTableServerBulkActions<TData>({
    table,
    actions = [],
}: DataTableServerBulkActionsProps<TData>) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<string | null>(null);

    // Obter as linhas selecionadas
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedRowsData = selectedRows.map(row => row.original);
    const hasSelectedRows = selectedRows.length > 0;

    // Função genérica para executar ações em massa
    const handleBulkAction = async (action: BulkAction<TData>, label: string) => {
        if (selectedRowsData.length === 0) return;

        try {
            setIsLoading(label);
            await action.action(selectedRowsData);

            toast({
                title: "Sucesso!",
                description: `Operação realizada com sucesso em ${selectedRowsData.length} ${selectedRowsData.length === 1 ? 'item' : 'itens'}.`,
            });

            // Limpar seleção após ação bem-sucedida
            table.resetRowSelection();
        } catch (error) {
            console.error("Erro ao executar ação em massa:", error);

            toast({
                variant: "destructive",
                title: "Erro!",
                description: `Não foi possível completar a operação: ${(error as Error).message || 'Erro desconhecido'}`,
            });
        } finally {
            setIsLoading(null);
        }
    };

    // Não renderiza nada se não houver linhas selecionadas
    if (!hasSelectedRows) return null;

    // Define as ações padrão se nenhuma for fornecida
    const defaultActions: BulkAction<TData>[] = [];
    const allActions = actions.length ? actions : defaultActions;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-primary text-white  shadow-md transition-all duration-300 transform",
            hasSelectedRows ? "translate-y-0" : "translate-y-full"
        )}>
            <div className="mx-auto  mx-auto w-[33%] flex items-center gap-4">
                <div className="flex items-center gap-4 ">
                    <span className="text-sm font-medium">
                        <span className="font-bold">{selectedRows.length}</span> {selectedRows.length === 1 ? 'item' : 'itens'} selecionado{selectedRows.length !== 1 ? 's' : ''}
                    </span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetRowSelection()}
                    >
                        Limpar seleção
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {allActions.map((action, index) => (
                        <Button
                            key={`bulk-action-${index}`}
                            variant={action.variant || "default"}
                            size="sm"
                            disabled={!!isLoading}
                            onClick={() => handleBulkAction(action, action.label)}
                            className={isLoading === action.label ? "opacity-80 pointer-events-none" : ""}
                        >
                            {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                            {isLoading === action.label && (
                                <svg className="animate-spin ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
