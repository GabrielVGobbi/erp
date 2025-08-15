import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BusinessUnitForm from './business-unit-form';
import { Save } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

interface BusinessUnit {
    id: number;
    name: string;
    // TODO: Adicionar outros campos conforme necessário
    created_at: string;
    updated_at: string;
}

interface EditProps {
    businessUnit: BusinessUnit;
}

export default function EditBusinessUnit({ businessUnit }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },

        {
            title: 'BusinessUnits',
            href: route('business-units.index'),
        },
        {
            title: businessUnit.name,
            href: route('business-units.show', businessUnit.id),
        },
        {
            title: 'Editar',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: businessUnit.name,
        // TODO: Adicionar outros campos conforme necessário
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('business-units.update', businessUnit.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${businessUnit.name}`} />
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center gap-4">
                                Editar Unidade de Negócio
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Atualize as informações do Unidade de Negócio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <BusinessUnitForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                mode='edit'
                            />

                            <div className="mt-6 flex justify-between items-center gap-4">
                                <BackButton backUrl={route('business-units.show', businessUnit.id)}></BackButton>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Atualizar Unidade de Negócio
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
