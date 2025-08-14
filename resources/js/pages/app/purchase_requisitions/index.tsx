import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import EmptyState from '@/components/app/empty-state';
import StatsCards from '@/components/app/stats-cards';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Eye, Edit, Trash2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    DataTableServer,
    createAdvancedActionsColumn,
    createSelectionColumn,
    createSortableColumn,
    createColumn,
    createBadgeColumn,
    createDateColumn,
    CustomFilter,
    type ActionButton
} from '@/components/ui/data-table-server';
import { ColumnDef } from '@tanstack/react-table';
import { useDatePeriods } from '@/hooks/use-date-periods';
import { router } from '@inertiajs/react';
import api from '@/lib/api';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Compras',
        href: '#',
    },

];

interface PurchaseRequisition {
    id: string;
    name: string;
    created_at: string;
}

export default function PurchaseRequisitionsIndex() {
    const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>([]);
    const totalRecords = purchaseRequisitions.length;

    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<PurchaseRequisition>[]>(() => [
        createSelectionColumn<PurchaseRequisition>(),
        createColumn<PurchaseRequisition>('Nº Requisição', 'order_number'),
        createColumn<PurchaseRequisition>('Entrega Prevista', 'delivery_forecast'),
        createColumn<PurchaseRequisition>('Tipo Lançamento', 'type'),
        createColumn<PurchaseRequisition>('Qnt Itens', 'itens_count'),
        createColumn<PurchaseRequisition>('Requisitor', 'requisitor.name'),
        createColumn<PurchaseRequisition>('Status', 'status'),
        createColumn<PurchaseRequisition>('Pedido', 'status_order'),
        createAdvancedActionsColumn<PurchaseRequisition>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (purchaseRequisition: PurchaseRequisition) => route('purchase-requisitions.show', purchaseRequisition.id)
                        },
                        {
                            label: 'Histórico',
                            icon: <TrendingUp className="w-4 h-4" />,
                            type: 'link',
                            href: (purchaseRequisition: PurchaseRequisition) => '/'
                        }
                    ]
                },
                {
                    label: 'Ações',
                    actions: [
                        {
                            label: 'Editar',
                            icon: <Edit className="w-4 h-4" />,
                            type: 'link',
                            href: (purchaseRequisition: PurchaseRequisition) => '/'
                        },
                        {
                            label: 'Ativar',
                            icon: <Check className="w-4 h-4" />,
                            type: 'action',
                            variant: 'secondary',
                            condition: (purchaseRequisition: PurchaseRequisition) => purchaseRequisition.status === 'inactive',
                            onClick: async (purchaseRequisition: PurchaseRequisition, onRefresh) => {
                                try {
                                    await router.patch('/');
                                    if (onRefresh) onRefresh();
                                } catch (error) {
                                    console.error('Erro ao ativar:', error);
                                }
                            }
                        },
                        {
                            label: 'Desativar',
                            icon: <X className="w-4 h-4" />,
                            type: 'action',
                            variant: 'secondary',
                            condition: (purchaseRequisition: PurchaseRequisition) => purchaseRequisition.status === 'active',
                            onClick: async (purchaseRequisition: PurchaseRequisition, onRefresh) => {
                                try {
                                    await router.patch('/');
                                    if (onRefresh) onRefresh();
                                } catch (error) {
                                    console.error('Erro ao desativar:', error);
                                }
                            }
                        }
                    ],
                    separator: true
                },
                {
                    label: 'Zona de Perigo',
                    actions: [
                        {
                            label: 'Excluir',
                            icon: <Trash2 className="w-4 h-4" />,
                            type: 'confirm',
                            variant: 'destructive',
                            confirmTitle: 'Confirmar exclusão',
                            confirmDescription: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
                            confirmButtonText: 'Excluir',
                            onClick: async (purchaseRequisition: PurchaseRequisition, onRefresh) => {
                                try {
                                    await api.delete(route('api.v2.purchase-requisitions.destroy', purchaseRequisition.id));
                                    if (onRefresh) {
                                        onRefresh();
                                    }
                                } catch (error) {
                                    console.error('Erro ao excluir:', error);
                                }
                            }
                        }
                    ]
                }
            ],
            onRefresh: refreshTable
        }),
    ], [refreshTable]);

    const customFilters: CustomFilter[] = [];

    const addButton = {
        label: 'Nova Requisição de Compra',
        href: route('purchase-requisitions.create')
    };

    return (
        <AppLayout>

            <div className="max-w-8xl mx-auto">

                <PageHeader
                    title="Requisição de Compra "
                    description=""
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                    addButton={addButton}
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={purchaseRequisitions}
                            pageCount={1}
                            apiEndpoint={'/tables/purchase-requisitions'}
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setPurchaseRequisitions}
                            customFilters={customFilters}
                            storageKey="purchaseRequisitions-table-bulk"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
