import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';
import PageHeader from '@/components/app/page-header';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
}

interface EditProps extends PageProps {
    role: Role;
    permissions: Permission[];
}

export default function EditRole({ role, permissions }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },

        {
            title: 'Roles',
            href: route('acl.roles.index'),
        },
        {
            title: role.name,
            href: route('acl.roles.show', role.id),
        },
        {
            title: 'Editar',
            href: '#',
        },
    ];

    // Agrupar permissões por módulo
    const permissionsByModule = permissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const sections: FormSection[] = [
        {
            title: 'Informações Básicas',
            description: 'Dados básicos da Função',
            fields: [
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    required: true,
                    placeholder: 'Digite o nome da Função',
                    defaultValue: role.name,
                    required: true,
                    colSpan: 3
                }
            ],
        }
    ];

    return (
        <AppLayout>
            <Head title={`Editar ${role.name}`} />

            <div className="max-w-2xl mx-auto ">

                <PageHeader
                    title=""
                    breadcrumbs={breadcrumbs}
                />


                <FormView
                    title={`Editar ${role.name}`}
                    description="Atualize as informações da Função"
                    breadcrumbs={breadcrumbs}
                    sections={sections}
                    submitUrl={route('acl.roles.update', role.id)}
                    cancelUrl={route('acl.roles.show', role.id)}
                    submitLabel="Atualizar Função"
                    method="PUT"
                />

            </div>

        </AppLayout>
    );
}
