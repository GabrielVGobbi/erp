import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import EmptyState from '@/components/app/empty-state';
import StatsCards from '@/components/app/stats-cards';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Package,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Eye,
    Edit,
    Trash2,
    Check,
    X,
    ToggleLeft,
    ToggleRight,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    Search,
    Plus,
    FileText,
    Calculator,
    BarChart3
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Contabilidade',
        href: '#',
    },
    {
        title: 'Livro Razão',
        href: route('accounting-entries.index'),
    },
];

interface ChartAccount {
    id: number;
    code: string;
    name: string;
}

interface Organization {
    id: number;
    name: string;
}

interface GeneralLedgerEntry {
    id: number;
    uuid: string;
    posting_date: string;
    chart_account: ChartAccount | null;
    debit: string;
    credit: string;
    balance: string;
    voucher_type: string;
    voucher_subtype: string | null;
    voucher_number: string;
    against_voucher_number: string | null;
    partner_type: string | null;
    partner: string | null;
    project: string | null;
    description: string | null;
    remarks: string | null;
    currency: string;
    is_opening_entry: boolean;
    is_closing_entry: boolean;
    is_system_generated: boolean;
    status: string;
    organization: Organization | null;
    branch: any | null;
    supplier: any | null;
    created_at: string;
    updated_at: string;
}

interface Filters {
    start_date: string;
    end_date: string;
    chart_account_id?: number;
    organization_id?: number;
    show_opening_entries: boolean;
    show_cancelled_entries: boolean;
    voucher_type?: string;
    voucher_number?: string;
    partner?: string;
    project?: string;
    [key: string]: any;
}

interface Props {
    generalLedger: GeneralLedgerEntry[];
    filters: Filters;
    chartAccounts: ChartAccount[];
    organizations: Organization[];
}

export default function AccountingEntriesIndex({ generalLedger, filters, chartAccounts, organizations }: Props) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Hook para períodos de data
    const datePeriods = useDatePeriods([
        {
            label: 'Ano atual',
            value: 'current_year',
            calculate: () => ({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date(new Date().getFullYear(), 11, 31)
            })
        },
        {
            label: 'Mês atual',
            value: 'current_month',
            calculate: () => ({
                from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            })
        },
        {
            label: 'Trimestre atual',
            value: 'current_quarter',
            calculate: () => {
                const now = new Date();
                const quarter = Math.floor(now.getMonth() / 3);
                const startMonth = quarter * 3;
                return {
                    from: new Date(now.getFullYear(), startMonth, 1),
                    to: new Date(now.getFullYear(), startMonth + 3, 0)
                };
            }
        }
    ]);

    // Calcular estatísticas
    const stats = useMemo(() => {
        const regularEntries = generalLedger.data.filter(entry =>
            !entry.is_opening_entry && !entry.is_closing_entry && entry.voucher_type !== 'Total'
        );

        const totalDebit = regularEntries.reduce((sum, entry) => {
            const debit = parseFloat(entry.debit.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            return sum + debit;
        }, 0);

        const totalCredit = regularEntries.reduce((sum, entry) => {
            const credit = parseFloat(entry.credit.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            return sum + credit;
        }, 0);

        return {
            totalEntries: regularEntries.length,
            totalDebit,
            totalCredit,
            balance: totalDebit - totalCredit,
            openingEntries: generalLedger.data.filter(entry => entry.is_opening_entry).length,
            closingEntries: generalLedger.data.filter(entry => entry.is_closing_entry).length,
        };
    }, [generalLedger]);

    // Aplicar filtros
    const applyFilters = () => {
        setIsLoading(true);
        router.get(route('accounting-entries.index'), localFilters, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Resetar filtros
    const resetFilters = () => {
        const defaultFilters = {
            start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
            end_date: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
            show_opening_entries: true,
            show_cancelled_entries: false,
        };
        setLocalFilters(defaultFilters);
        router.get(route('accounting-entries.index'), defaultFilters, {
            preserveState: true
        });
    };

    // Colunas não são mais necessárias com a tabela HTML simples

    return (
        <AppLayout>
            <Head title="Livro Razão - Contabilidade" />

            <div className="container mx-auto space-y-6">
                <PageHeader
                    title="Livro Razão"
                    description="Relatório detalhado de lançamentos contábeis com abertura, movimentações e fechamento"
                    breadcrumbs={breadcrumbs}
                    totalRecords={generalLedger.length}
                />

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Lançamentos</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEntries}</div>
                            <p className="text-xs text-muted-foreground">
                                Período selecionado
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Débitos</CardTitle>
                            <TrendingUp className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                R$ {stats.totalDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Movimentações a débito
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                R$ {stats.totalCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Movimentações a crédito
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
                            <Calculator className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stats.balance > 0 ? 'text-green-600' :
                                stats.balance < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Saldo do período
                            </p>
                        </CardContent>
                    </Card>
                </div>



                {/* Tabela */}
                <Card>

                    <CardHeader>
                        {/* Filtros */}
                        <Card className="mb-8">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Filter className="h-5 w-5" />
                                            <span>Filtros</span>
                                        </CardTitle>

                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={resetFilters}
                                        >
                                            Limpar
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {showFilters && (
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Período */}
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Data Inicial</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={localFilters.start_date}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    start_date: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">Data Final</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={localFilters.end_date}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    end_date: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="chart_account">Conta Contábil</Label>
                                            <Select
                                                value={localFilters.chart_account_id?.toString() || ''}
                                                onValueChange={(value) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    chart_account_id: value ? parseInt(value) : undefined
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Todas as contas" />
                                                </SelectTrigger>

                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="organization">Organização</Label>
                                            <Select
                                                value={localFilters.organization_id?.toString() || ''}
                                                onValueChange={(value) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    organization_id: value ? parseInt(value) : undefined
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Todas as organizações" />
                                                </SelectTrigger>

                                                {/* Lista de organizações
                                                <SelectContent>
                                                    <SelectItem value="">Todas as organizações</SelectItem>
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org.id} value={org.id.toString()}>
                                                            {org.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                                */}
                                            </Select>
                                        </div>

                                        {/* Filtros adicionais */}
                                        <div className="space-y-2">
                                            <Label htmlFor="voucher_type">Tipo de Comprovante</Label>
                                            <Input
                                                id="voucher_type"
                                                placeholder="Ex: Purchase Receipt"
                                                value={localFilters.voucher_type || ''}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    voucher_type: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="voucher_number">Nº do Comprovante</Label>
                                            <Input
                                                id="voucher_number"
                                                placeholder="Ex: MAT-PRE-2025-001"
                                                value={localFilters.voucher_number || ''}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    voucher_number: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="partner">Parceiro</Label>
                                            <Input
                                                id="partner"
                                                placeholder="Nome do parceiro"
                                                value={localFilters.partner || ''}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    partner: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="project">Projeto</Label>
                                            <Input
                                                id="project"
                                                placeholder="Nome do projeto"
                                                value={localFilters.project || ''}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    project: e.target.value
                                                }))}
                                            />
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show_opening_entries"
                                                checked={localFilters.show_opening_entries}
                                                onCheckedChange={(checked) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    show_opening_entries: checked as boolean
                                                }))}
                                            />
                                            <Label htmlFor="show_opening_entries">Mostrar Abertura</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show_cancelled_entries"
                                                checked={localFilters.show_cancelled_entries}
                                                onCheckedChange={(checked) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    show_cancelled_entries: checked as boolean
                                                }))}
                                            />
                                            <Label htmlFor="show_cancelled_entries">Mostrar Cancelados</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2 mt-4">
                                        <Button variant="outline" onClick={resetFilters}>
                                            Limpar Filtros
                                        </Button>
                                        <Button onClick={applyFilters} disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Aplicando...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="h-4 w-4 mr-2" />
                                                    Aplicar Filtros
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Lançamentos Contábeis</CardTitle>
                                <CardDescription>
                                    Relatório detalhado com {generalLedger.length} registros
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Exportar relatório</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={applyFilters}
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>

                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Novo Lançamento
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {generalLedger.length === 0 ? (
                            <EmptyState
                                icon={BarChart3}
                                title="Nenhum lançamento encontrado"
                                description="Não foram encontrados lançamentos contábeis para os filtros aplicados."
                                action={{
                                    label: "Limpar Filtros",
                                    onClick: resetFilters
                                }}
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 px-4 py-2 text-left">Data</th>
                                            <th className="border border-gray-200 px-4 py-2 text-left">Conta Contábil</th>
                                            <th className="border border-gray-200 px-4 py-2 text-right">Débito (BRL)</th>
                                            <th className="border border-gray-200 px-4 py-2 text-right">Crédito (BRL)</th>
                                            <th className="border border-gray-200 px-4 py-2 text-right">Saldo (BRL)</th>
                                            <th className="border border-gray-200 px-4 py-2 text-left">Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generalLedger.data.map((entry, index) => (
                                            <tr key={entry.id || index} className="hover:bg-gray-50">

                                                <td className="border border-gray-200 px-4 py-2">
                                                    {entry.is_opening_entry || entry.is_closing_entry || entry.voucher_type === 'Total' ? (
                                                        <span className="text-gray-500 italic">-</span>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="font-medium">{entry.posting_date}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {entry.chart_account ? (
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-gray-900">
                                                                {entry.chart_account.code} - {entry.chart_account.name}
                                                            </div>
                                                            {entry.description && (
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {entry.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <FileText className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-500 italic">
                                                                {entry.is_opening_entry && 'Saldo de Abertura'}
                                                                {entry.is_closing_entry && 'Saldo de Fechamento'}
                                                                {entry.voucher_type === 'Total' && 'Total do Período'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-right">
                                                    {parseFloat(entry.debit.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0 ? (
                                                        <span className="font-mono text-red-600 font-medium">
                                                            {entry.debit}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-gray-400">R$ 0,00</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-right">
                                                    {parseFloat(entry.credit.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0 ? (
                                                        <span className="font-mono text-green-600 font-medium">
                                                            {entry.credit}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-gray-400">R$ 0,00</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-right">
                                                    <span className={`font-mono font-bold ${parseFloat(entry.balance.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0 ? 'text-green-600' :
                                                            parseFloat(entry.balance.replace(/[^\d,.-]/g, '').replace(',', '.')) < 0 ? 'text-red-600' : 'text-gray-600'
                                                        }`}>
                                                        {entry.balance}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {entry.is_opening_entry || entry.is_closing_entry || entry.voucher_type === 'Total' ? (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {entry.voucher_type}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs">
                                                            {entry.voucher_type}
                                                        </Badge>
                                                    )}
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
