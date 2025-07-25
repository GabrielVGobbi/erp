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
        title: 'Gestão',
        href: '#',
    },

];

interface Organization {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    created_at: string;
}

export default function OrganizationsIndex() {
    // Estado para os dados da tabela
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const totalRecords = organizations.length;

    // Estado para forçar refresh do DataTableServer
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // Hook para períodos de data com alguns períodos customizados
    const datePeriods = useDatePeriods([
        {
            label: 'Ano atual',
            value: 'current_year',
            calculate: () => ({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date(new Date().getFullYear(), 11, 31)
            })
        }
    ]);

    // Função para recarregar os dados da tabela
    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<Organization>[]>(() => [
        createSelectionColumn<Organization>(),
        createSortableColumn<Organization>('Nome', 'name'),
        createSortableColumn<Organization>('CNPJ', 'cnpj'),
        createAdvancedActionsColumn<Organization>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (inventory: Organization) => route('organizations.show', inventory.id)
                        },
                        {
                            label: 'Histórico',
                            icon: <TrendingUp className="w-4 h-4" />,
                            type: 'link',
                            href: (inventory: Organization) => '/'
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
                            href: (inventory: Organization) => '/'
                        },
                        {
                            label: 'Ativar',
                            icon: <Check className="w-4 h-4" />,
                            type: 'action',
                            variant: 'secondary',
                            condition: (inventory: Organization) => inventory.status === 'inactive',
                            onClick: async (inventory: Organization, onRefresh) => {
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
                            condition: (inventory: Organization) => inventory.status === 'active',
                            onClick: async (inventory: Organization, onRefresh) => {
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
                            onClick: async (inventory: Organization, onRefresh) => {
                                try {
                                    await api.delete(route('api.v2.organizations.destroy', inventory.id));
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

    return (
        <AppLayout>
            <Head title="Organizações / Empresa " />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Organizações / Empresa"
                    description=""
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}

                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={organizations}
                            pageCount={1}
                            apiEndpoint={route('table.organizations')}
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setOrganizations}
                            customFilters={customFilters}
                            storageKey="organizations-table-bulk"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
