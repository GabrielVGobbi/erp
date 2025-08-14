import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';
import PageHeader from '@/components/app/page-header';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    [key: string]: any;
}

interface FormProps extends PageProps {
    roles: Role[];
    groups: string[];
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
        title: 'Permissões',
        href: route('acl.permissions.index'),
    },
    {
        title: 'Nova Permissão',
        href: '#',
    },
];

export default function CreatePermission({ roles, groups }: FormProps) {
    const sections: FormSection[] = [
        {
            title: 'Informações Básicas',
            description: 'Dados básicos da permissão',
            fields: [
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    required: true,
                    placeholder: 'Digite o nome da permissão (ex: Visualizar Usuários)',
                    colSpan: 3

                },

                {
                    name: 'group',
                    label: 'Grupo',
                    type: 'select',
                    required: true,
                    options: [
                        ...groups.map(group => ({
                            value: group,
                            label: group
                        })),
                        {
                            value: 'custom',
                            label: 'Outro (especificar abaixo)'
                        }
                    ],
                    placeholder: 'Selecione o grupo',
                    colSpan: 3
                },

                {
                    name: 'description',
                    label: 'Descrição',
                    type: 'textarea',
                    placeholder: 'Descreva o que esta permissão permite fazer',
                    help: 'Descrição opcional para facilitar o entendimento',
                    colSpan: 3
                }
            ]
        },

    ];

    return (
        <AppLayout>
            <Head title="Nova Permissão" />

            <div className="max-w-2xl mx-auto space-y-6 ">
                <PageHeader
                    title=""
                    breadcrumbs={breadcrumbs}
                />

                <FormView
                    title="Nova Permissão"
                    description="Crie uma nova permissão no sistema"
                    breadcrumbs={breadcrumbs}
                    sections={sections}
                    submitUrl={route('acl.permissions.store')}
                    cancelUrl={route('acl.permissions.index')}
                    submitLabel="Criar Permissão"
                />
            </div>

        </AppLayout>
    );
}
