import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import DetailView, { DetailField, DetailTab, DetailAction } from '@/components/app/detail-view';
import ActivityFeed, { ActivityItem } from '@/components/app/activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Building,
    Hash,
    Calendar,
    User,
    MessageSquare,
    BarChart3,
    Trash2,
    Copy
} from 'lucide-react';
import FormView from '@/components/app/form-view';

interface CostCenter {
    id: number;
    name: string;
    organization_id: number;
    parent_id?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    organization?: {
        id: number;
        name: string;
    };
    parent?: {
        id: number;
        name: string;
    };
    children?: CostCenter[];
}

interface ShowProps extends PageProps {
    costCenter: CostCenter;
    activities?: ActivityItem[];
}

const CostCenterShow: React.FC<ShowProps> = ({ costCenterData, organizationsData, activities = [] }) => {
    const costCenter = costCenterData.data;
    const organizations = organizationsData.data;

    // Define os campos que serão exibidos
    const fields: DetailField[] = [
        {
            key: 'id',
            label: 'ID',
            type: 'text',
            icon: <Hash className="h-4 w-4" />
        },
        {
            key: 'name',
            label: 'Nome',
            type: 'text',
            icon: <Building className="h-4 w-4" />
        },
        {
            key: 'organization',
            label: 'Organização',
            type: 'custom',
            icon: <Building className="h-4 w-4" />,
            render: (value) => value?.name || '—'
        },
        {
            key: 'parent',
            label: 'Centro de Custo Pai',
            type: 'custom',
            icon: <Building className="h-4 w-4" />,
            render: (value) => value?.name || 'Nenhum'
        }
    ];

    // Define as abas adicionais
    const tabs: DetailTab[] = [
        {
            id: 'children',
            label: 'Centros Filhos',
            icon: <BarChart3 className="h-4 w-4" />,
            badge: costCenter.children?.length || 0,
            content: (
                <Card>
                    <CardHeader>
                        <CardTitle>Centros de Custo Filhos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {costCenter.children && costCenter.children.length > 0 ? (
                            <div className="space-y-2">
                                {costCenter.children.map((child) => (
                                    <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{child.name}</p>
                                            <p className="text-sm text-muted-foreground">ID: {child.id}</p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(child.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                Nenhum centro de custo filho encontrado.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )
        },

        //{
        //  id: 'activity',
        //  label: 'Atividades',
        //  icon: <MessageSquare className="h-4 w-4" />,
        //  badge: activities.length,
        //  content: (
        //    <ActivityFeed
        //      activities={activities}
        //      canAddComment={true}
        //      onAddComment={(content) => {
        //        // Implementar lógica para adicionar comentário
        //        console.log('Adicionar comentário:', content);
        //      }}
        //      onEditActivity={(id, content) => {
        //        // Implementar lógica para editar atividade
        //        console.log('Editar atividade:', id, content);
        //      }}
        //      onDeleteActivity={(id) => {
        //        // Implementar lógica para excluir atividade
        //        console.log('Excluir atividade:', id);
        //      }}
        //    />
        //  )
        //}
    ];

    // Define as ações disponíveis
    const actions: DetailAction[] = [
        {
            label: 'Duplicar',
            icon: <Copy className="h-4 w-4 mr-2" />,
            variant: 'outline',
            onClick: () => {
                // Implementar lógica de duplicação
                console.log('Duplicar centro de custo');
            }
        },
        {
            label: 'Excluir',
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            variant: 'destructive',
            onClick: () => {
                if (confirm('Tem certeza que deseja excluir este centro de custo?')) {
                    router.delete(route('cost-centers.destroy', costCenter.id));
                }
            }
        }
    ];

    const isEdit = true;

    const initialData = costCenter || {
        name: '',
        organization_id: 1,
        parent_id: ''
    };

    const sections: FormSection[] = [
        {
            title: 'Informações Básicas',
            description: 'Dados principais do centro de custo',
            fields: [
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Digite o nome do centro de custo',
                    required: true,
                    colSpan: 2
                },
                {
                    name: 'organization_id',
                    label: 'Organização',
                    type: 'select',
                    required: true,
                    options: organizations.map(org => ({
                        value: org.id,
                        label: org.name
                    }))
                }
            ]
        },
        //{
        //    title: 'Hierarquia',
        //    description: 'Configuração da estrutura hierárquica',
        //    fields: [
        //        {
        //            name: 'parent_id',
        //            label: 'Centro de Custo Pai',
        //            type: 'select',
        //            placeholder: 'Selecione o centro de custo pai (opcional)',
        //            options: [
        //                { value: '', label: 'Nenhum (Centro raiz)' },
        //                ...parentCostCenters.map(parent => ({
        //                    value: parent.id!,
        //                    label: parent.name
        //                }))
        //            ],
        //            description: 'Deixe em branco para criar um centro de custo raiz'
        //        }
        //    ]
        //}
    ];

    return (
        <AppLayout>
            <Head title={`Centro de Custo - ${costCenter.name}`} />

            <div className="max-w-7xl mx-auto">
                <FormView
                    title={isEdit ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
                    subtitle={isEdit ? `Editando: ${costCenter?.name}` : 'Criar um novo centro de custo'}
                    backUrl={route('cost-centers.show', costCenter.id)}
                    submitUrl={isEdit ? route('cost-centers.update', costCenter!.id) : route('cost-centers.store')}
                    method={isEdit ? 'put' : 'post'}
                    initialData={initialData}
                    sections={sections}
                    onSuccess={() => {
                        // Redirecionar após sucesso será tratado pelo backend
                    }}
                    submitLabel={isEdit ? 'Atualizar' : 'Criar'}
                />
            </div>
        </AppLayout>
    );
};

export default CostCenterShow;
