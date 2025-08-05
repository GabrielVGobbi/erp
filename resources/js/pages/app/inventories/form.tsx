import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import FormView, { FormSection } from '@/components/app/form-view';

interface CostCenter {
    id?: number;
    name: string;
    organization_id: number;
    parent_id?: number;
}

interface Organization {
    id: number;
    name: string;
}

interface FormProps extends PageProps {
    costCenter?: CostCenter;
    organizations: Organization[];
    parentCostCenters: CostCenter[];
    isEdit?: boolean;
}

const CostCenterForm: React.FC<FormProps> = ({
    costCenter,
    organizations,
    parentCostCenters,
    isEdit = false
}) => {
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
        {
            title: 'Hierarquia',
            description: 'Configuração da estrutura hierárquica',
            fields: [
                {
                    name: 'parent_id',
                    label: 'Centro de Custo Pai',
                    type: 'select',
                    placeholder: 'Selecione o centro de custo pai (opcional)',
                    options: [
                        { value: '', label: 'Nenhum (Centro raiz)' },
                        ...parentCostCenters.map(parent => ({
                            value: parent.id!,
                            label: parent.name
                        }))
                    ],
                    description: 'Deixe em branco para criar um centro de custo raiz'
                }
            ]
        }
    ];

    const initialData = costCenter || {
        name: '',
        organization_id: organizations[0]?.id || '',
        parent_id: ''
    };

    return (
        <AppLayout>
            <Head title={isEdit ? `Editar Centro de Custo - ${costCenter?.name}` : 'Novo Centro de Custo'} />

            <FormView
                title={isEdit ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
                subtitle={isEdit ? `Editando: ${costCenter?.name}` : 'Criar um novo centro de custo'}
                backUrl={route('cost-centers.index')}
                submitUrl={isEdit ? route('cost-centers.update', costCenter!.id) : route('cost-centers.store')}
                method={isEdit ? 'put' : 'post'}
                initialData={initialData}
                sections={sections}
                onSuccess={() => {
                    // Redirecionar após sucesso será tratado pelo backend
                }}
                submitLabel={isEdit ? 'Atualizar' : 'Criar'}
            />
        </AppLayout>
    );
};

export default CostCenterForm;
