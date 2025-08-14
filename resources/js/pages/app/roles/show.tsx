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
    Calendar,
    Hash,
    ArrowLeft
} from 'lucide-react';
import PageHeader from '@/components/app/page-header';

interface Permission {
    id: number;
    name: string;
    slug: string;
    group: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
    users: User[];
    created_at: string;
    updated_at: string;
}

interface ShowProps extends PageProps {
    role: Role;
}

export default function ShowRole({ role }: ShowProps) {
    const [activeTab, setActiveTab] = useState("permissions");

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
            title: role.name,
            href: '#',
        },
    ];

    const handleDelete = () => {
        if (role.slug === 'admin' || role.slug === 'dev') {
            alert('Esta role não pode ser excluída pois é crítica para o sistema.');
            return;
        }

        if (confirm('Tem certeza que deseja excluir esta role? Esta ação não pode ser desfeita e afetará todos os usuários que possuem esta role.')) {
            router.delete(route('acl.roles.destroy', role.id));
        }
    };

    // Agrupar permissões por grupo
    const permissionsByGroup = role.permissions.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <AppLayout>
            <Head title={role.name} />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <PageHeader
                            title=""
                            breadcrumbs={breadcrumbs}
                        />
                        <h1 className="text-3xl font-bold text-gray-900">{role.name}</h1>
                        <div className="flex items-center space-x-2 mt-1">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{role.slug}</span>
                            {(role.slug === 'admin' || role.slug === 'dev') && (
                                <Badge variant="destructive">Sistema</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.roles.index'))}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.roles.edit', role.id))}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                        {role.slug !== 'admin' && role.slug !== 'dev' && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                            </Button>
                        )}
                    </div>
                </div>

                {/* Role Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span>Informações da Role</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nome</label>
                                <p className="text-gray-900 font-medium">{role.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Slug</label>
                                <p className="text-gray-900">{role.slug}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Usuários</label>
                                <p className="text-gray-900 font-medium">{role.users.length}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Permissões</label>
                                <p className="text-gray-900 font-medium">{role.permissions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="permissions" className="flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Permissões ({role.permissions.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Usuários ({role.users.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="permissions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Permissões da Role</CardTitle>
                                        <CardDescription>
                                            Permissões que esta role concede aos usuários
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(route('acl.roles.permissions', role.id))}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Gerenciar Permissões
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {role.permissions.length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(permissionsByGroup).map(([group, permissions]) => (
                                            <div key={group} className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Settings className="w-4 h-4 text-blue-600" />
                                                    <h3 className="font-semibold text-gray-900">{group}</h3>
                                                    <Badge variant="secondary">{permissions.length}</Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                                    {permissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer"
                                                            onClick={() => router.visit(route('acl.permissions.show', permission.id))}
                                                        >
                                                            <h4 className="font-medium text-gray-900">{permission.name}</h4>
                                                            <p className="text-sm text-gray-600">{permission.slug}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma permissão atribuída</h3>
                                        <p className="text-gray-500 mb-4">Esta role não possui nenhuma permissão atribuída.</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.visit(route('acl.roles.permissions', role.id))}
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Atribuir Permissões
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usuários com esta Role</CardTitle>
                                <CardDescription>
                                    Usuários que possuem esta role atribuída
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {role.users.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {role.users.map((user) => (
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
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário com esta role</h3>
                                        <p className="text-gray-500">Nenhum usuário possui esta role atribuída.</p>
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
