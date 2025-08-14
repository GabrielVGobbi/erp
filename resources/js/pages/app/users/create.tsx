import React from 'react';
import { Head, useForm, Link, PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import clsx from 'clsx'
import { Button } from '@/components/ui/button';
import UserForm from './user-form';
import { Save } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface FormProps extends PageProps {
    roles: Role[];
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
        title: 'Usuários',
        href: route('acl.users.index'),
    },
    {
        title: 'Novo Usuário',
        href: '#',
    },
];

export default function CreateUser() {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        create_and_new: false,
    });

    const submit = (e) => {
        e.preventDefault();
        setData('create_and_new', false);
        post(route('acl.users.store'), {
            onSuccess: () => {
                reset(); // limpa todos os campos
            },
        });
    };

    const submitAndNew = (e) => {
        e.preventDefault();
        setData('create_and_new', true);
        post(route('acl.users.store'), {
            onSuccess: () => {
                reset(); // limpa todos os campos
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Novo Usuário" />
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center gap-4">
                                Informações Básicas
                            </div>
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                mode='create'
                            />

                            <div className="mt-6 flex justify-between items-center gap-4">
                                <BackButton backUrl={route('acl.users.index')}></BackButton>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={processing}
                                        onClick={submitAndNew}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Criar e Adicionar Novo
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Criar Usuário
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
