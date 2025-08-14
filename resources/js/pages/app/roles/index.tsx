import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Shield, Eye, Edit, Trash2, Plus, Users, Settings } from 'lucide-react';
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
        title: 'Roles',
        href: route('acl.roles.index'),
    },
];

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface RoleData {
    id: string;
    name: string;
    slug: string;
    permissions: Permission[];
    users_count: number;
    created_at: string;
    updated_at: string;
}

export default function RolesIndex() {
    const [roles, setRoles] = useState<RoleData[]>([]);
    const totalRecords = roles.length;
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<RoleData>[]>(() => [
        createSelectionColumn<RoleData>(),
        createSortableColumn<RoleData>('Nome', 'name'),
        {
            accessorKey: 'permissions',
            header: 'Permissões',
            cell: ({ row }) => {
                const permissions = row.original.permissions;
                return (
                    <div className="flex flex-wrap gap-1">
                        {permissions.map((permission, index) => (
                            <span
                                key={permission.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                                {permission.name}
                            </span>
                        ))}
                        {permissions.length === 0 && (
                            <span className="text-gray-400 text-sm">Nenhuma permissão</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'users_count',
            header: 'Usuários',
            cell: ({ row }) => {
                const count = row.original.users_count;
                return (
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{count}</span>
                    </div>
                );
            },
        },
        createAdvancedActionsColumn<RoleData>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (role: RoleData) => route('acl.roles.show', role.id)
                        },
                        {
                            label: 'Permissões',
                            icon: <Settings className="w-4 h-4" />,
                            type: 'link',
                            href: (role: RoleData) => route('acl.roles.permissions', role.id)
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
                            href: (role: RoleData) => route('acl.roles.edit', role.id)
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
                            confirmDescription: 'Tem certeza que deseja excluir esta role? Esta ação não pode ser desfeita e afetará todos os usuários que possuem esta role.',
                            confirmButtonText: 'Excluir',
                            condition: (role: RoleData) => role.slug !== 'admin' && role.slug !== 'dev',
                            onClick: async (role: RoleData, onRefresh) => {
                                try {
                                    await router.delete(route('acl.roles.destroy', role.id));
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
        {
            id: 'has_users',
            title: 'Com Usuários',
            type: 'select',
            options: [
                { label: 'Com usuários', value: 'yes' },
                { label: 'Sem usuários', value: 'no' },
            ]
        }
    ];

    return (
        <AppLayout>
            <Head title="Roles" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Roles"
                    description=""
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                    addButton={
                        {
                            label: 'Nova Função',
                            href: route('acl.roles.create'),
                        }
                    }
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={roles}
                            pageCount={1}
                            apiEndpoint={route('table.roles')}
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setRoles}
                            customFilters={customFilters}
                            storageKey="roles-table"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
