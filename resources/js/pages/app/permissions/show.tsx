import React, { useState } from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    Trash2,
    Shield,
    Settings,
    Users,
    Hash,
    Package,
    FileText,
    ArrowLeft
} from 'lucide-react';
import PageHeader from '@/components/app/page-header';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Permission {
    id: number;
    name: string;
    slug: string;
    group: string;
    description: string | null;
    roles: Role[];
    users: User[];
    created_at: string;
    updated_at: string;
}

interface ShowProps extends PageProps {
    permission: Permission;
}

export default function ShowPermission({ permission }: ShowProps) {
    const [activeTab, setActiveTab] = useState("roles");

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
            href: '#',
        },
    ];

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta permissão? Esta ação não pode ser desfeita e afetará todas as roles e usuários que possuem esta permissão.')) {
            router.delete(route('acl.permissions.destroy', permission.id));
        }
    };

    return (
        <AppLayout>
            <Head title={permission.name} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <PageHeader
                            title=""
                            breadcrumbs={breadcrumbs}

                        />
                        <h1 className="text-3xl font-bold text-gray-900">{permission.name}</h1>
                        <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center space-x-1">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{permission.slug}</span>
                            </div>
                            <Badge variant="outline">
                                <Package className="w-3 h-3 mr-1" />
                                {permission.group}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.permissions.index'))}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.permissions.edit', permission.id))}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
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

                {/* Permission Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Settings className="w-5 h-5" />
                            <span>Informações da Permissão</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nome</label>
                                <p className="text-gray-900 font-medium">{permission.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Slug</label>
                                <p className="text-gray-900">{permission.slug}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Grupo</label>
                                <Badge variant="secondary">{permission.group}</Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Roles</label>
                                <p className="text-gray-900 font-medium">{permission.roles.length}</p>
                            </div>
                            {permission.description && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Descrição</label>
                                    <p className="text-gray-900">{permission.description}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="roles" className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Roles ({permission.roles.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Usuários Diretos ({permission.users.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="roles" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Funções com esta Permissão</CardTitle>
                                <CardDescription>
                                    Funções que possuem esta permissão atribuída
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {permission.roles.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {permission.roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer"
                                                onClick={() => router.visit(route('acl.roles.show', role.id))}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                                        <p className="text-sm text-gray-600">{role.slug}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma role possui esta permissão</h3>
                                        <p className="text-gray-500">Esta permissão não está atribuída a nenhuma role.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usuários com Permissão Direta</CardTitle>
                                <CardDescription>
                                    Usuários que possuem esta permissão atribuída diretamente, independente de roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Info Alert */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-blue-900">
                                                Sobre Permissões Diretas
                                            </h3>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Estes usuários possuem esta permissão atribuída diretamente,
                                                independente de suas roles. A maioria das permissões deve ser
                                                gerenciada através de roles.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {permission.users.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {permission.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all cursor-pointer"
                                                onClick={() => router.visit(route('acl.users.show', user.id))}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                                                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário com permissão direta</h3>
                                        <p className="text-gray-500">Nenhum usuário possui esta permissão atribuída diretamente.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
