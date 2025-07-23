import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import EmptyState from '@/components/app/empty-state';
import StatsCards from '@/components/app/stats-cards';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Eye, Edit, Trash2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    DataTableServer,
    createAdvancedActionsColumn,
    createSelectionColumn,
    createSortableColumn,
    createColumn,
    createBadgeColumn,
    createDateColumn,
    CustomFilter,
    type ActionButton
} from '@/components/ui/data-table-server';
import { ColumnDef } from '@tanstack/react-table';
import { useDatePeriods } from '@/hooks/use-date-periods';
import { router } from '@inertiajs/react';
import api from '@/lib/api';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Gestão',
        href: '#',
    },

];

interface ChartAccount {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    created_at: string;
}

export default function ChartAccountsIndex({ chart_accounts }) {
    // Estado para os dados da tabela
    //const [chart_accounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const totalRecords = chart_accounts.length;

    return (
        <AppLayout>
            <Head title="Plano de Contas" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Plano de Contas"
                    description=""
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}

                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        //Criar List Tree
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
