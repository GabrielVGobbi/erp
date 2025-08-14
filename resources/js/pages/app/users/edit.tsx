import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import FormView, { FormSection } from '@/components/app/form-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm, Link, PageProps } from '@inertiajs/react';
import PageHeader from '@/components/app/page-header';
import UserForm from './user-form';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/back-button';
import { ArrowLeft, CheckCircle, Edit, Loader2, Mail, Trash2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function EditUser({ user, roles, permissions }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Usuários',
            href: route('acl.users.index'),
        },
        {
            title: user.name,
            href: route('acl.users.show', user.id),
        },
        {
            title: 'Editar',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('acl.users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${user.name}`} />

            <div className="max-w-2xl mx-auto space-y-6 ">
                <PageHeader
                    title=""
                    breadcrumbs={breadcrumbs}
                />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600 flex items-center space-x-2 mt-1">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                            {user.email_verified_at ? (
                                <Badge variant="default" className="ml-2">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verificado
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="ml-2">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Verificação Pendente
                                </Badge>
                            )}
                        </p>
                    </div>
                </div>

                <div className="">
                    <Card>
                        <CardContent>
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                mode={'edit'}
                            />
                            <form onSubmit={submit}>
                                <div className="mt-6 flex items-center gap-4">
                                    <BackButton label='Cancelar' backUrl={route('acl.users.show', { id: user.id })}></BackButton>
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
        </AppLayout >
    );
}
