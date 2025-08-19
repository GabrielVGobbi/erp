import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Users,
    Settings,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowDown
} from 'lucide-react';

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
    id: number;
    user_id: number;
    role_id: number;
    context_id: number;
    context_type: string;
    user: User;
    role: Role;
}

interface ApprovalHierarchyProps {
    assignments: ApprovalAssignment[];
    onManage?: () => void;
    showManageButton?: boolean;
    contextName?: string;
}

export default function ApprovalHierarchy({
    assignments,
    onManage,
    showManageButton = true,
    contextName = 'item'
}: ApprovalHierarchyProps) {

    // Definir a ordem hierárquica das roles
    const roleHierarchy = [
        'coordinator',
        'supervisor',
        'manager',
        'general-manager',
        //'ceo',
        //'cfo'
    ];

    // Organizar assignments por role seguindo a hierarquia
    const organizedAssignments = roleHierarchy
        .map(roleSlug => assignments.find(assignment => assignment.role.slug === roleSlug))
        .filter(Boolean) as ApprovalAssignment[];

    // Verificar se há roles críticas sem aprovadores
    const criticalRoles = ['general-manager', 'manager'];
    const missingCriticalRoles = criticalRoles.filter(roleSlug =>
        !assignments.some(assignment => assignment.role.slug === roleSlug)
    );

    const getRoleIcon = (roleSlug: string) => {
        switch (roleSlug) {
            case 'general-manager':
                return <Shield className="w-5 h-5 text-red-600" />;
            case 'finance':
                return <Shield className="w-5 h-5 text-green-600" />;
            case 'manager':
                return <Shield className="w-5 h-5 text-blue-600" />;
            case 'supervisor':
                return <Shield className="w-5 h-5 text-purple-600" />;
            case 'coordinator':
                return <Shield className="w-5 h-5 text-orange-600" />;
            default:
                return <Shield className="w-5 h-5 text-gray-600" />;
        }
    };

    const getRoleBadgeVariant = (roleSlug: string) => {
        if (criticalRoles.includes(roleSlug)) {
            return 'destructive';
        }
        return 'secondary';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Estrutura de Aprovação</span>
                        </CardTitle>
                        <CardDescription>
                            Hierarquia de aprovadores para este {contextName}
                        </CardDescription>
                    </div>
                    {showManageButton && onManage && (
                        <Button
                            variant="outline"
                            onClick={onManage}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Gerenciar Aprovadores
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {/* Alertas para roles críticas faltando */}
                {missingCriticalRoles.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-red-900">
                                    Roles Críticas Sem Aprovadores
                                </h3>
                                <p className="text-sm text-red-700 mt-1">
                                    As seguintes roles críticas não possuem aprovadores definidos:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {missingCriticalRoles.map(roleSlug => (
                                        <Badge key={roleSlug} variant="destructive" className="text-xs">
                                            {roleSlug === 'general-manager' ? 'Gerente Geral' :
                                                roleSlug === 'finance' ? 'Financeiro' : roleSlug}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hierarquia de Aprovação */}
                {organizedAssignments.length > 0 ? (
                    <div className="space-y-4">
                        {organizedAssignments.map((assignment, index) => (
                            <React.Fragment key={assignment.id}>
                                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                    {/* Ícone da Role */}
                                    <div className="flex-shrink-0">
                                        {getRoleIcon(assignment.role.slug)}
                                    </div>

                                    {/* Informações da Role */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {assignment.role.name}
                                            </h3>
                                            {/* Badge Role
                                            <Badge variant={getRoleBadgeVariant(assignment.role.slug)} className="text-xs">
                                                {assignment.role.slug}
                                            </Badge>
                                            */}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Nível {index + 1} da hierarquia de aprovação
                                        </p>
                                    </div>

                                    {/* Informações do Usuário */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {assignment.user.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {assignment.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>

                                {/* Seta para próximo nível */}
                                {index < organizedAssignments.length - 1 && (
                                    <div className="flex justify-center">
                                        <ArrowDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum aprovador definido
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Este {contextName} não possui aprovadores definidos na estrutura hierárquica.
                        </p>
                        {showManageButton && onManage && (
                            <Button
                                variant="outline"
                                onClick={onManage}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Definir Aprovadores
                            </Button>
                        )}
                    </div>
                )}

                {/* Estatísticas */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {organizedAssignments.length}
                            </p>
                            <p className="text-sm text-gray-500">Aprovadores Definidos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {organizedAssignments.filter(a => criticalRoles.includes(a.role.slug)).length}
                            </p>
                            <p className="text-sm text-gray-500">Roles Críticas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">
                                {missingCriticalRoles.length}
                            </p>
                            <p className="text-sm text-gray-500">Críticas Pendentes</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
