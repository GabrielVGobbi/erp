import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { User, Shield, Eye, Edit, Trash2, UserPlus, Settings } from 'lucide-react';
import {
    DataTableServer,
    createAdvancedActionsColumn,
    createSelectionColumn,
    createSortableColumn,
    createBadgeColumn,
    createDateColumn,
    CustomFilter,
    createColumn
} from '@/components/ui/data-table-server';
import { ColumnDef } from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import api from '@/lib/api';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Usuários',
        href: route('acl.users.index'),
    },
];

interface UserData {
    id: string;
    name: string;
    email: string;
    roles: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    permissions: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export default function UsersIndex() {
    const [users, setUsers] = useState<UserData[]>([]);
    const totalRecords = users.length;
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refreshTable = React.useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    const columns = React.useMemo<ColumnDef<UserData>[]>(() => [
        createSelectionColumn<UserData>(),
        createColumn<UserData>('Nome', 'name'),
        createColumn<UserData>('Email', 'email'),
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex flex-wrap gap-1 w-90">
                        {roles.map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {role.name}
                            </span>
                        ))}
                        {roles.length === 0 && (
                            <span className="text-gray-400 text-sm">Nenhuma role</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'email_verified_at',
            header: 'Status',
            cell: ({ row }) => {
                const verified = row.original.email_verified_at;
                return (
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}
                    >
                        {verified ? 'Verificado' : 'Email Pendente'}
                    </span>
                );
            },
        },
        createDateColumn<UserData>('Criado em', 'created_at'),
        createAdvancedActionsColumn<UserData>({
            groups: [
                {
                    label: 'Visualização',
                    actions: [
                        {
                            label: 'Visualizar',
                            icon: <Eye className="w-4 h-4" />,
                            type: 'link',
                            href: (user: UserData) => route('acl.users.show', user.id)
                        },
                        {
                            label: 'Permissões',
                            icon: <Shield className="w-4 h-4" />,
                            type: 'link',
                            href: (user: UserData) => route('acl.users.permissions', user.id)
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
                            href: (user: UserData) => route('acl.users.edit', user.id)
                        },
                        {
                            label: 'Gerenciar Roles',
                            icon: <Settings className="w-4 h-4" />,
                            type: 'link',
                            href: (user: UserData) => route('acl.users.roles', user.id)
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
                            confirmDescription: 'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
                            confirmButtonText: 'Excluir',
                            onClick: async (user: UserData, onRefresh) => {
                                try {
                                    await router.delete(route('acl.users.destroy', user.id));
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
            id: 'role',
            title: 'Funções',
            type: 'select',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Usuário', value: 'user' },
                { label: 'Desenvolvedor', value: 'dev' },
            ]
        },
    ];

    return (
        <AppLayout>
            <Head title="Usuários" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Usuários"
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                    addButton={
                        {
                            label: 'Novo Usuário',
                            href: route('acl.users.create'),
                        }
                    }
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DataTableServer
                            columns={columns}
                            data={users}
                            pageCount={1}
                            apiEndpoint={route('table.users')}
                            searchColumn="name"
                            defaultPageSize={10}
                            onDataLoaded={setUsers}
                            customFilters={customFilters}
                            storageKey="users-table"
                            enableLocalStorage={true}
                            refetchTrigger={refetchTrigger}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
