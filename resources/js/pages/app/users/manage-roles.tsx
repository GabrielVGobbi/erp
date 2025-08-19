import React, { useState } from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, Save, X, ArrowLeft } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface UserData extends User {
    roles: Role[];
}

interface ManageRolesProps extends PageProps {
    user: UserData;
    roles: Role[];
}

export default function ManageUserRoles({ user, roles }: ManageRolesProps) {
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
            title: 'Gerenciar Funções',
            href: '#',
        },
    ];

    const { data, setData, post, processing } = useForm({
        roles: user.roles.map(role => role.id)
    });

    const handleRoleChange = (roleId: number, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleId]);
        } else {
            setData('roles', data.roles.filter(id => id !== roleId));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('acl.users.roles.update', user.id));
    };

    return (
        <AppLayout>
            <Head title={`Gerenciar Funções - ${user.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            {breadcrumbs.map((item, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span>/</span>}
                                    <span>{item.title}</span>
                                </React.Fragment>
                            ))}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Funções</h1>
                        <p className="text-gray-600">{user.name} • {user.email}</p>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Roles Disponíveis</span>
                            </CardTitle>
                            <CardDescription>
                                Selecione as roles que este usuário deve possuir. As roles definem conjuntos de permissões.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.id)}
                                            onCheckedChange={(checked) =>
                                                handleRoleChange(role.id, checked as boolean)
                                            }
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor={`role-${role.id}`}
                                                className="font-medium text-gray-900 cursor-pointer"
                                            >
                                                {role.name}
                                            </label>
                                            <p className="text-sm text-gray-500">{role.slug}</p>
                                        </div>
                                        {data.roles.includes(role.id) && (
                                            <Badge variant="secondary">
                                                Selecionada
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Roles Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo das Roles Selecionadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data.roles.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {roles
                                        .filter(role => data.roles.includes(role.id))
                                        .map((role) => (
                                            <Badge key={role.id} variant="default">
                                                {role.name}
                                            </Badge>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Nenhuma role selecionada</p>
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
                            {processing ? 'Salvando...' : 'Salvar Roles'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
