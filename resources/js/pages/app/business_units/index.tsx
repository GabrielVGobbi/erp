import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, Eye, Edit, Trash2, Plus } from 'lucide-react';
import {
    DataTableServer,
    createAdvancedActionsColumn,
    createSelectionColumn,
    createSortableColumn,
    createDateColumn,
    CustomFilter,
} from '@/components/ui/data-table-server';
import { ColumnDef } from '@tanstack/react-table';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Unidade(s) de Negócio',
        href: route('business-units.index'),
    },
];

interface BusinessUnitData {
    id: string;
    name: string;
    // TODO: Adicionar outros campos conforme necessário
    created_at: string;
    updated_at: string;
}

export default function BusinessUnitIndex() {
    const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
    const totalRecords = businessUnits.length;
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<BusinessUnitData>[]>(() => [
        createSelectionColumn<BusinessUnitData>(),
        createSortableColumn<BusinessUnitData>('Nome', 'name'),
        createAdvancedActionsColumn<BusinessUnitData>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (businessUnit: BusinessUnitData) => route('business-units.show', businessUnit.id)
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
                            href: (businessUnit: BusinessUnitData) => route('business-units.edit', businessUnit.id)
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
                            confirmDescription: 'Tem certeza que deseja excluir este businessunit? Esta ação não pode ser desfeita.',
                            confirmButtonText: 'Excluir',
                            onClick: async (businessUnit: BusinessUnitData, onRefresh) => {
                                try {
                                    await router.delete(route('business-units.destroy', businessUnit.id));
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

    const customFilters: CustomFilter[] = [
        // TODO: Adicionar filtros personalizados conforme necessário
    ];

    return (
        <AppLayout>
            <Head title="Unidade(s) de Negócio" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Unidade(s) de Negócio"
                    description=""
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                    addButton={
                        {
                            label: 'Novo(a) Unidade de Negócio',
                            href: route('business-units.create'),
                        }
                    }
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={businessUnits}
                            pageCount={1}
                            apiEndpoint='tables/business-units'
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setBusinessUnits}
                            customFilters={customFilters}
                            storageKey="businessUnits-table"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
