import React, { useState } from 'react';
import { Link, PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    Trash2,
    Shield,
    Settings,
    Mail,
    Calendar,
    User as UserIcon,
    CheckCircle,
    XCircle,
    ArrowLeft,
    ShieldMinus
} from 'lucide-react';
import PageHeader from '@/components/app/page-header';

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
}

interface UserData extends User {
    roles: Role[];
    permissions: Permission[];
}

interface ShowProps extends PageProps {
    user: UserData;
}

export default function ShowUser({ user }: ShowProps) {
    const [activeTab, setActiveTab] = useState("roles");

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
            href: '#',
        },
    ];

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja desativar este usuário? Esta ação não pode ser desfeita.')) {
            router.delete(route('acl.users.destroy', user.id));
        }
    };

    return (
        <AppLayout>
            <Head title={user.name} />

            <div className="max-w-5xl mx-auto space-y-6">

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
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.users.index'))}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('acl.users.edit', user.id))}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <ShieldMinus className="w-4 h-4 mr-2" />
                            Desativar
                        </Button>
                    </div>
                </div>

                {/* User Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <UserIcon className="w-5 h-5" />
                            <span>Informações do Usuário</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nome</label>
                                <p className="text-gray-900 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Criado em</label>
                                <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                                <p className="text-gray-900">{new Date(user.updated_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="roles" className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Roles ({user.roles.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Permissões Diretas ({user.permissions.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="roles" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Roles do Usuário</CardTitle>
                                        <CardDescription>
                                            Roles definem conjuntos de permissões que o usuário possui
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline">
                                        <Link className="items-center flex" prefetch href={route('acl.users.roles', user.id)}>
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gerenciar Roles
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {user.roles.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {user.roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer"
                                            >
                                                <Link className="items-center flex" prefetch href={route('acl.roles.show', role.id)}>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                                            <p className="text-sm text-gray-600">{role.slug}</p>
                                                        </div>
                                                    </div>
                                                </Link>

                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma role atribuída</h3>
                                        <p className="text-gray-500 mb-4">Este usuário não possui nenhuma role atribuída.</p>
                                        <Button variant="outline">
                                            <Link className="items-center flex" prefetch href={route('acl.users.roles', user.id)}>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Atribuir Roles
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Permissões Diretas</CardTitle>
                                        <CardDescription>
                                            Permissões atribuídas diretamente ao usuário, independente de roles
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" >
                                        <Link className="items-center flex" prefetch href={route('acl.users.roles', user.id)}>
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gerenciar Permissões
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {user.permissions.length > 0 ? (
                                    <div className="space-y-6">
                                        {/* Agrupar permissões por grupo */}
                                        {Object.entries(
                                            user.permissions.reduce((acc, permission) => {
                                                if (!acc[permission.group]) {
                                                    acc[permission.group] = [];
                                                }
                                                acc[permission.group].push(permission);
                                                return acc;
                                            }, {} as Record<string, Permission[]>)
                                        ).map(([group, permissions]) => (
                                            <div key={group} className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Settings className="w-4 h-4 text-purple-600" />
                                                    <h3 className="font-semibold text-gray-900">{group}</h3>
                                                    <Badge variant="secondary">{permissions.length}</Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    {permissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-green-100"
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
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma permissão direta</h3>
                                        <p className="text-gray-500 mb-4">Este usuário não possui permissões atribuídas diretamente.</p>
                                        <Button variant="outline">
                                            <Link className="items-center flex" prefetch href={route('acl.users.permissions', user.id)}>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Atribuir Permissões
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout >
    );
}
