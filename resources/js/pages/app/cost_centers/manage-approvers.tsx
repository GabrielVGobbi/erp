import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Save,
    X,
    ArrowLeft,
    Search,
    Shield,
    UserCheck,
    UserCircle,
    Check
} from 'lucide-react';
import PageHeader from '@/components/app/page-header';

// Interfaces de dados
interface User {
    id: number;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface ApprovalAssignment {
    user_id: number;
    role_id: number;
    user: User;
    role: Role;
}

interface CostCenter {
    id: number;
    name: string;
    organization: string;
    parent?: string | 'Principal';
}

interface AssignmentData {
    role_id: number;
    user_id: number;
}

interface ManageApproversProps {
    costCenterData: { data: CostCenter };
    approvalAssignments: { data: ApprovalAssignment[] };
    users: { data: User[] };
    approvalRoles: Role[];
}

export default function ManageApprovers({
    costCenterData,
    approvalAssignments,
    users,
    approvalRoles,
}: ManageApproversProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const costCenter = costCenterData.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Centros de Custo', href: route('cost-centers.index') },
        { title: costCenter.name, href: route('cost-centers.show', costCenter.id) },
        { title: 'Gerenciar Aprovadores', href: '#' },
    ];

    // Inicializa o useForm com a estrutura correta
    const { data, setData, post, processing } = useForm({
        assignments: [] as any[],
    });

    // Carrega os dados das atribuições existentes
    useEffect(() => {
        if (approvalAssignments?.data && Array.isArray(approvalAssignments.data)) {
            const initialAssignments = approvalAssignments.data.map(assignment => ({
                role_id: assignment.role.id,
                user_id: assignment.user.id
            }));
            setData('assignments', initialAssignments);
        }
    }, [approvalAssignments?.data]);

    const userMap = useMemo(() => {
        return new Map(users.data.map(user => [user.id, user]));
    }, [users.data]);

    const filteredUsers = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return users.data.filter(user =>
            user.name.toLowerCase().includes(lowercasedSearchTerm) ||
            user.email.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [users.data, searchTerm]);

    const getCurrentAssignment = (roleId: number): any => {
        return (data.assignments as any[])?.find((assignment: any) => assignment.role_id === roleId);
    };

    const updateAssignment = (roleId: number, userId: number | null) => {
        const currentAssignments = Array.isArray(data.assignments) ? data.assignments : [];
        const newAssignments = currentAssignments.filter((assignment: any) => assignment.role_id !== roleId);
        if (userId !== null) {
            newAssignments.push({ role_id: roleId, user_id: userId });
        }
        setData('assignments', newAssignments);
        setSelectedUser(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cost-centers.approvers.update', costCenter.id));
    };

    const criticalRoles = ['manager', 'general-manager', 'finance', 'ceo'];

    return (
        <AppLayout>
            <Head title={`Gerenciar Aprovadores - ${costCenter.name}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <PageHeader
                            title="Gerenciar Aprovadores"
                            description={`Centro de Custo: ${costCenter.name}`}
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

                <form onSubmit={handleSubmit} className="md:flex md:space-x-8">
                    {/* Painel de Seleção de Usuários */}
                    <div className="w-full md:w-1/3 md:sticky md:top-24 md:h-[calc(100vh-10rem)] md:overflow-y-auto">
                        <Card className="h-full border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle>Selecionar Usuário</CardTitle>
                                <CardDescription>
                                    Clique em um usuário para atribuí-lo a um papel.
                                </CardDescription>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-[calc(100%-120px)] overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors
                                                ${selectedUser?.id === user.id
                                                ? 'bg-blue-100 border-blue-400'
                                                : 'hover:bg-gray-50 border-gray-200'
                                                }`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <UserCircle className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                {selectedUser?.id === user.id && (
                                                    <Check className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-gray-500">Nenhum usuário encontrado.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Painel de Papéis de Aprovação */}
                    <div className="w-full md:w-2/3 space-y-6 mt-6 md:mt-0">
                        {approvalRoles.map((role) => {
                            const currentAssignment = getCurrentAssignment(role.id);
                            const assignedUser = currentAssignment ? userMap.get(currentAssignment.user_id) : null;
                            const isCritical = criticalRoles.includes(role.slug);

                            return (
                                <Card key={role.id} className={isCritical ? 'border-orange-200' : ''}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Shield className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <span>{role.name}</span>
                                                        {isCritical && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Crítica
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {assignedUser ? `Aprovador: ${assignedUser.name}` : 'Sem aprovador definido'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            {assignedUser && (
                                                <Badge variant="secondary">
                                                    <UserCheck className="w-3 h-3 mr-1" />
                                                    Atribuído
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {assignedUser ? (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                        <UserCircle className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-green-900">{assignedUser.name}</p>
                                                        <p className="text-sm text-green-700">{assignedUser.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateAssignment(role.id, null)}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Remover
                                                </Button>
                                            </div>
                                        ) : (
                                            selectedUser ? (
                                                <Button
                                                    type="button"
                                                    className="w-full"
                                                    onClick={() => updateAssignment(role.id, selectedUser.id)}
                                                >
                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                    Atribuir {selectedUser.name}
                                                </Button>
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    Selecione um usuário para atribuir.
                                                </div>
                                            )
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Botões de Ação */}
                        <div className="flex items-center justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Salvando...' : 'Salvar Aprovadores'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
