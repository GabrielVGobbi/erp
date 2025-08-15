import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BusinessUnitForm from './business-unit-form';
import { Save } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Unidade(s) de Negócio',
        href: route('business-units.index'),
    },
    {
        title: 'Novo BusinessUnit',
        href: '#',
    },
];

export default function CreateBusinessUnit() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        create_and_new: false,
    });

    const submit = (e) => {
        e.preventDefault();
        setData('create_and_new', false);
        post(route('business-units.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const submitAndNew = (e) => {
        e.preventDefault();
        setData('create_and_new', true);
        post(route('business-units.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };


    return (
        <AppLayout>
            <Head title="Nova Unidade(s) de Negócio" />
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center gap-4">
                                Nova Unidade(s) de Negócio
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Preencha as informações para criar um nova Unidade(s) de Negócio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <BusinessUnitForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                mode='create'
                            />

                            <div className="mt-6 flex justify-between items-center gap-4">
                                <BackButton backUrl={route('business-units.index')}></BackButton>
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
                                        Criar Unidade
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
