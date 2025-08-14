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

const CostCenterShow: React.FC<ShowProps> = ({ costCenterData, activities = [] }) => {
    const costCenter = costCenterData.data;
    //const organizations = organizationsData.data;

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
        },
    ];


    // Define as ações disponíveis
    const actions: DetailAction[] = [
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

    return (
        <AppLayout>
            <Head title={`Centro de Custo - ${costCenter.name}`} />

            <div className="max-w-4xl mx-auto">

                <DetailView
                    title={costCenter.name}
                    subtitle={`Centro de Custo #${costCenter.id}`}
                    backUrl={route('cost-centers.index')}
                    editUrl={route('cost-centers.edit', costCenter.id)}
                    data={costCenter}
                    fields={fields}
                    actions={actions}
                    status={{
                        label: costCenter.deleted_at ? 'Inativo' : 'Ativo',
                        variant: costCenter.deleted_at ? 'destructive' : 'default'
                    }}

                />
            </div>

        </AppLayout>
    );
};

export default CostCenterShow;
