import React, { useState } from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Save, X, ArrowLeft, Search } from 'lucide-react';
import PageHeader from '@/components/app/page-header';

interface Permission {
    id: number;
    name: string;
    slug: string;
    group: string;
}

interface UserData extends User {
    permissions: Permission[];
}

interface ManagePermissionsProps extends PageProps {
    user: UserData;
    permissions: Permission[];
}

export default function ManageUserPermissions({ user, permissions }: ManagePermissionsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');

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
            title: user.name,
            href: route('acl.users.show', user.id),
        },
        {
            title: 'Gerenciar Permissões',
            href: '#',
        },
    ];

    const { data, setData, post, processing } = useForm({
        permissions: user.permissions.map(permission => permission.id)
    });

    // Agrupar permissões por grupo
    const permissionsByGroup = permissions.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    // Filtrar permissões
    const filteredGroups = Object.entries(permissionsByGroup).reduce((acc, [group, groupPermissions]) => {
        if (selectedGroup && group !== selectedGroup) return acc;

        const filtered = groupPermissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length > 0) {
            acc[group] = filtered;
        }

        return acc;
    }, {} as Record<string, Permission[]>);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('acl.users.permissions.update', user.id));
    };

    const groups = Object.keys(permissionsByGroup);

    return (
        <AppLayout>
            <Head title={`Gerenciar Permissões - ${user.name}`} />



            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <PageHeader
                            title="Gerenciar Permissões"
                            description={`${user.name} • ${user.email}`}
                            breadcrumbs={breadcrumbs}
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Buscar permissões..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <select
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos os grupos</option>
                                        {groups.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions by Group */}
                    <div className="space-y-6">
                        {Object.entries(filteredGroups).map(([group, groupPermissions]) => (
                            <Card key={group}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Settings className="w-5 h-5" />
                                            <span>{group}</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {groupPermissions.filter(p => data.permissions.includes(p.id)).length} / {groupPermissions.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupPermissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={data.permissions.includes(permission.id)}
                                                    onCheckedChange={(checked) =>
                                                        handlePermissionChange(permission.id, checked as boolean)
                                                    }
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="font-medium text-gray-900 cursor-pointer block truncate"
                                                    >
                                                        {permission.name}
                                                    </label>
                                                    <p className="text-sm text-gray-500 truncate">{permission.slug}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo das Permissões Selecionadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-600">
                                    Total selecionado: {data.permissions.length} permissões
                                </span>
                            </div>
                            {data.permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {permissions
                                        .filter(permission => data.permissions.includes(permission.id))
                                        .map((permission) => (
                                            <Badge key={permission.id} variant="default" className="text-xs">
                                                {permission.name}
                                            </Badge>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Nenhuma permissão selecionada</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Salvando...' : 'Salvar Permissões'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
