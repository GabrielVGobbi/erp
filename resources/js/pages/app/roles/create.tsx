import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface FormProps extends PageProps {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'ACL',
        href: '#',
    },
    {
        title: 'Roles',
        href: route('acl.roles.index'),
    },
    {
        title: 'Nova Role',
        href: '#',
    },
];

export default function CreateRole({ permissions }: FormProps) {

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
            description: 'Dados básicos da role',
            fields: [
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    required: true,
                    placeholder: 'Digite o nome da role',
                    colSpan: 3
                }
            ]
        }
    ];

    return (
        <AppLayout>
            <Head title="Nova Função" />

            <div className="max-w-2xl mx-auto">
                <FormView
                    title="Nova Função"
                    description="Crie uma nova role no sistema"
                    breadcrumbs={breadcrumbs}
                    sections={sections}
                    submitUrl={route('acl.roles.store')}
                    cancelUrl={route('acl.roles.index')}
                    submitLabel="Criar Role"
                />
            </div>

        </AppLayout>
    );
}
