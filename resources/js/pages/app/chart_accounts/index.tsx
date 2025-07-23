import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import EmptyState from '@/components/app/empty-state';
import StatsCards from '@/components/app/stats-cards';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Eye, Edit, Trash2, Check, X, ToggleLeft, ToggleRight, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
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
    code: string;
    name: string;
    type: string;
    amount: any;
    parent_id?: string;
    organization_id: string;
    organization?: {
        id: string;
        name: string;
    };
    children?: ChartAccount[];
}

export default function ChartAccountsIndex({ chart_accounts }: { chart_accounts: Record<string, ChartAccount[]> }) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const totalRecords = Object.values(chart_accounts).flat().length;

    React.useEffect(() => {
        setIsPageLoading(false);
    }, []);

    const calculateGrandTotal = (): number => {
        let total = 0;
        Object.values(chart_accounts).forEach(accounts => {
            total += calculateTotal(accounts);
        });
        return total;
    };

    const toggleExpanded = (itemId: string) => {
        setIsLoading(true);
        setTimeout(() => {
            const newExpanded = new Set(expandedItems);
            if (newExpanded.has(itemId)) {
                newExpanded.delete(itemId);
            } else {
                newExpanded.add(itemId);
            }
            setExpandedItems(newExpanded);
            setIsLoading(false);
        }, 50);
    };

    const expandAll = () => {
        setIsLoading(true);
        setTimeout(() => {
            const allIds = new Set<string>();
            const collectIds = (accounts: ChartAccount[]) => {
                accounts.forEach(account => {
                    allIds.add(account.id);
                    if (account.children) {
                        collectIds(account.children);
                    }
                });
            };

            Object.values(chart_accounts).forEach(accounts => {
                collectIds(accounts);
            });

            setExpandedItems(allIds);
            setIsLoading(false);
        }, 100);
    };

    const collapseAll = () => {
        setIsLoading(true);
        setTimeout(() => {
            setExpandedItems(new Set());
            setIsLoading(false);
        }, 100);
    };

    const calculateTotal = (accounts: ChartAccount[]): number => {
        let total = 0;
        const calculate = (items: ChartAccount[]) => {
            items.forEach(item => {
                if (item.amount) {
                    const value = typeof item.amount === 'string' && item.amount.includes('R$')
                        ? parseFloat(item.amount.replace(/[^\d,]/g, '').replace(',', '.'))
                        : parseFloat(item.amount) ;
                    total += value;
                }
                if (item.children) {
                    calculate(item.children);
                }
            });
        };
        calculate(accounts);
        return total;
    };

    const calculateItemTotal = (item: ChartAccount): number => {
        let total = 0;
        if (item.amount) {
            const value = typeof item.amount === 'string' && item.amount.includes('R$')
                ? parseFloat(item.amount.replace(/[^\d,]/g, '').replace(',', '.'))
                : parseFloat(item.amount) ;
            total += value;
        }
        if (item.children) {
            item.children.forEach(child => {
                total += calculateItemTotal(child);
            });
        }
        return total;
    };

    const formatCurrency = (amount: any) => {


        if (!amount) return 'R$ 0,00';

        // Se já vem formatado do cast do Laravel
        if (typeof amount === 'string' && amount.includes('R$')) {
            return amount;
        }

        // Se vem como número (em centavos)
        const value = parseFloat(amount) ;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const renderTreeItem = (item: ChartAccount, level: number = 0) => {
        const isExpanded = expandedItems.has(item.id);
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id}>
                <div
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${level === 0 ? 'bg-gray-50' : level === 1 ? 'bg-blue-50' : 'bg-white'
                        } ${isLoading ? 'opacity-50' : ''}`}
                    style={{ marginLeft: `${level * 16}px` }}
                    onClick={() => !isLoading && toggleExpanded(item.id)}
                >
                    <div className="flex items-center space-x-2">
                        {hasChildren ? (
                            isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            )
                        ) : (
                            <div className="w-4" />
                        )}

                        {hasChildren ? (
                            isExpanded ? (
                                <FolderOpen className="h-4 w-4 text-blue-500" />
                            ) : (
                                <Folder className="h-4 w-4 text-blue-500" />
                            )
                        ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-300" />
                        )}

                        {level > 0 && (
                            <div className="flex space-x-1">
                                {Array.from({ length: level }, (_, i) => (
                                    <div key={i} className="w-1 h-4 bg-gray-200 rounded" />
                                ))}
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${hasChildren ? 'text-gray-900' : 'text-gray-600'}`}>
                                <span className={`font-mono ${level === 0 ? 'text-blue-600' :
                                        level === 1 ? 'text-green-600' :
                                            level === 2 ? 'text-purple-600' :
                                                'text-gray-600'
                                    }`}>{item.code}</span> - {item.name}
                            </span>
                            {hasChildren && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {item.children?.length} itens
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span
                            className={`text-xs px-2 py-1 rounded cursor-help ${item.type === 'C' ? 'bg-green-100 text-green-800' :
                                    item.type === 'D' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}
                            title={item.type === 'C' ? 'Crédito' : item.type === 'D' ? 'Débito' : 'Tipo não definido'}
                        >
                            {item.type}
                        </span>
                        <div className="text-right">
                            <div className={`text-sm font-semibold ${parseFloat(item.amount || '0') > 0 ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                {formatCurrency(item.amount)}
                            </div>
                            {hasChildren && (
                                <div className={`text-xs font-medium ${calculateItemTotal(item) > 0 ? 'text-green-600' : 'text-blue-600'
                                    }`}>
                                    Total: {formatCurrency(calculateItemTotal(item))}
                                    {calculateItemTotal(item) > parseFloat(item.amount || '0') && (
                                        <span className="ml-1 text-green-500" title="Valor maior que o próprio item">↑</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div>
                        {item.children?.map(child => renderTreeItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const renderOrganizationSection = (accounts: ChartAccount[]) => {
        if (accounts.length === 0) return null;

        const organization = accounts[0]?.organization;

        return (
            <div className="mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-blue-900">
                                    {organization?.name || 'Organização'}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${calculateTotal(accounts) > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {calculateTotal(accounts) > 0 ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <p className="text-sm text-blue-700">
                                Total: {formatCurrency(calculateTotal(accounts))} • {expandedItems.size} itens expandidos • {accounts.length} contas principais
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={expandAll}
                                disabled={isLoading}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Carregando...' : 'Expandir Tudo'}
                            </button>
                            <button
                                onClick={collapseAll}
                                disabled={isLoading}
                                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Carregando...' : 'Colapsar Tudo'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {accounts.map(item => renderTreeItem(item))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Plano de Contas" />

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Plano de Contas"
                    breadcrumbs={breadcrumbs}
                    totalRecords={totalRecords}
                />

                <StatsCards
                    cards={[
                        {
                            title: 'Total de Contas',
                            value: totalRecords.toString(),
                            icon: Package,
                            description: 'Contas no plano',
                        },
                        {
                            title: 'Total Geral',
                            value: formatCurrency(calculateGrandTotal()),
                            icon: DollarSign,
                            description: 'Valor total',
                        },
                        {
                            title: 'Organizações',
                            value: Object.keys(chart_accounts).length.toString(),
                            icon: TrendingUp,
                            description: 'Organizações ativas',
                        },
                    ]}
                />

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="space-y-2">
                            {isPageLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Carregando plano de contas...</span>
                                </div>
                            ) : totalRecords === 0 ? (
                                <EmptyState
                                    icon={Package}
                                    title="Nenhum plano de conta encontrado"
                                    description="Comece criando seu primeiro plano de conta."
                                />
                            ) : (
                                <>
                                    {Object.values(chart_accounts).map((accounts, index) => (
                                        <div key={index}>
                                            {renderOrganizationSection(accounts)}
                                        </div>
                                    ))}
                                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                Total Geral do Plano de Contas
                                            </h4>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(calculateGrandTotal())}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {totalRecords} contas • {Object.keys(chart_accounts).length} organizações
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
