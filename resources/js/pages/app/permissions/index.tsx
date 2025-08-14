import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Settings, Eye, Edit, Trash2, Plus, Shield, Users } from 'lucide-react';
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
        title: 'Permissões',
        href: route('acl.permissions.index'),
    },
];

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface PermissionData {
    id: string;
    name: string;
    slug: string;
    group: string;
    description: string | null;
    roles: Role[];
    users_count: number;
    created_at: string;
    updated_at: string;
}

export default function PermissionsIndex() {
    const [permissions, setPermissions] = useState<PermissionData[]>([]);
    const totalRecords = permissions.length;
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<PermissionData>[]>(() => [
        createSelectionColumn<PermissionData>(),
        createSortableColumn<PermissionData>('Nome', 'name'),
        createSortableColumn<PermissionData>('Slug', 'slug'),
        {
            accessorKey: 'group',
            header: 'Grupo',
            cell: ({ row }) => {
                const group = row.original.group;
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {group}
                    </span>
                );
            },
        },
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.slice(0, 2).map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {role.name}
                            </span>
                        ))}
                        {roles.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{roles.length - 2}
                            </span>
                        )}
                        {roles.length === 0 && (
                            <span className="text-gray-400 text-sm">Nenhuma role</span>
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
        createDateColumn<PermissionData>('Criado em', 'created_at'),
        createAdvancedActionsColumn<PermissionData>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (permission: PermissionData) => route('acl.permissions.show', permission.id)
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
                            href: (permission: PermissionData) => route('acl.permissions.edit', permission.id)
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
                            confirmDescription: 'Tem certeza que deseja excluir esta permissão? Esta ação não pode ser desfeita e afetará todas as roles e usuários que possuem esta permissão.',
                            confirmButtonText: 'Excluir',
                            onClick: async (permission: PermissionData, onRefresh) => {
                                try {
                                    await router.delete(route('acl.permissions.destroy', permission.id));
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

    // Obter grupos únicos para filtro
    const uniqueGroups = [...new Set(permissions.map(p => p.group))];

    const customFilters: CustomFilter[] = [
        {
            id: 'group',
            title: 'Grupo',
            type: 'select',
            options: uniqueGroups.map(group => ({
                label: group,
                value: group
            }))
        },
        {
            id: 'has_roles',
            title: 'Com Função',
            type: 'select',
            options: [
                { label: 'Com função', value: 'yes' },
                { label: 'Sem função', value: 'no' },
            ]
        }
    ];

    return (
        <AppLayout>
            <Head title="Permissões" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Permissões"
                    description="Gerencie permissões do sistema"
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                    addButton={
                        {
                            label: 'Nova Permissão',
                            href: route('acl.permissions.create'),
                        }
                    }
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={permissions}
                            pageCount={1}
                            apiEndpoint={route('table.permissions')}
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setPermissions}
                            customFilters={customFilters}
                            storageKey="permissions-table"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
