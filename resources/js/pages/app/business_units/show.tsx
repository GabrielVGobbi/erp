import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    Trash2,
    Package,
    Calendar,
    ArrowLeft,
    Info,
} from 'lucide-react';
import PageHeader from '@/components/app/page-header';

interface BusinessUnit {
    id: number;
    name: string;
    // TODO: Adicionar outros campos conforme necessário
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    businessUnit: BusinessUnit;
}

export default function ShowBusinessUnit({ businessUnit }: ShowProps) {
    const [activeTab, setActiveTab] = useState("details");

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Unidade de Negócio',
            href: route('business-units.index'),
        },
        {
            title: businessUnit.name,
            href: '#',
        },
    ];

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este Unidade de Negócio? Esta ação não pode ser desfeita.')) {
            router.delete(route('business-units.destroy', businessUnit.id));
        }
    };

    return (
        <AppLayout>
            <Head title={businessUnit.name} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <PageHeader
                            title=""
                            breadcrumbs={breadcrumbs}
                        />

                        <h1 className="text-3xl font-bold text-gray-900">{businessUnit.name}</h1>
                        <p className="text-gray-600 mt-1">
                            Unidade de Negócio • ID: {businessUnit.id}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">



                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('business-units.index'))}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button variant="outline" >
                            <Link className="flex" href={route('business-units.edit', businessUnit.id)} prefetch>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Package className="w-5 h-5" />
                            <span>Informações da Unidade de Negócio</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nome</label>
                                <p className="text-gray-900 font-medium">{businessUnit.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Criado em</label>
                                <p className="text-gray-900">{new Date(businessUnit.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                                <p className="text-gray-900">{new Date(businessUnit.updated_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details" className="flex items-center space-x-2">
                            <Info className="w-4 h-4" />
                            <span>Detalhes</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Histórico</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes do Unidade de Negócio</CardTitle>
                                <CardDescription>
                                    Informações detalhadas sobre este Unidade de Negócio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nome</label>
                                        <p className="text-gray-900">{businessUnit.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Histórico de Alterações</CardTitle>
                                <CardDescription>
                                    Registro de alterações realizadas neste Unidade de Negócio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum histórico disponível</h3>
                                    <p className="text-gray-500">O histórico de alterações será exibido aqui quando disponível.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
