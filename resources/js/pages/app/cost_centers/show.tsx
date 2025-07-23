import React from 'react';
import { PageProps } from '@inertiajs/inertia-react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type CostCenter = {
    data: {
        id: number;
        name: string;
        description?: string;
        created_at: string;
        updated_at: string;
    }
};

interface ShowProps extends PageProps {
    costCenterData: CostCenter;
}

const CostCenterShow: React.FC<ShowProps> = ({ costCenterData }) => {
    const costCenter: CostCenter = costCenterData.data;

    return (
        <AppLayout>
            <Head title="Centro(s) de Custo" />
            {/* Render the cost center details here */}
        </AppLayout>
    );
};

export default CostCenterShow;
