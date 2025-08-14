import React from 'react';
import { Head, useForm, Link, PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';
import PageHeader from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import PermissionForm from './permission-form';
import BackButton from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface Permission {
    id: number;
    name: string;
    slug: string;
    group: string;
    description: string | null;
    roles: Role[];
}

interface EditProps extends PageProps {
    permission: Permission;
    roles: Role[];
    groups: string[];
}

export default function EditPermission({ permission, roles, groups }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Permissões',
            href: route('acl.permissions.index'),
        },
        {
            title: permission.name,
            href: route('acl.permissions.show', permission.id),
        },
        {
            title: 'Editar',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        description: permission.description,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('acl.permissions.update', permission.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${permission.name}`} />

            <div className="max-w-2xl mx-auto space-y-6 ">
                <PageHeader
                    title=""
                    breadcrumbs={breadcrumbs}
                />

                <div className="flex items-center justify-between">
                    <div>
                        <span className="">Permissão</span>
                        <h1 className="text-3xl font-bold text-gray-900">{permission.name}</h1>
                    </div>
                </div>

                <div className="">
                    <Card>
                        <CardContent>
                            <PermissionForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                mode={'edit'}
                            />
                            <form onSubmit={submit}>
                                <div className="mt-6 flex items-center gap-4">
                                    <BackButton label='Cancelar' backUrl={route('acl.permissions.show', { id: permission.id })}></BackButton>
                                    <Button type="submit" loading={processing}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </AppLayout>
    );
}
