import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import {
    Edit,
    ArrowLeft,
    Calendar,
    User,
    Building,
    Hash,
    Clock,
    MoreHorizontal,
    Trash2,
    Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DetailField {
    key: string;
    label: string;
    value?: any;
    type?: 'text' | 'date' | 'datetime' | 'badge' | 'currency' | 'boolean' | 'custom';
    render?: (value: any) => React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

export interface DetailTab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    badge?: string | number;
}

export interface DetailAction {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    className?: string;
}

interface DetailViewProps {
    title: string;
    subtitle?: string;
    backUrl?: string;
    editUrl?: string;
    data: Record<string, any>;
    fields: DetailField[];
    tabs?: DetailTab[];
    actions?: DetailAction[];
    status?: {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
    };
    metadata?: {
        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        updatedBy?: string;
    };
    className?: string;
}

export default function DetailView({
    title,
    subtitle,
    backUrl,
    editUrl,
    data,
    fields,
    tabs = [],
    actions = [],
    status,
    metadata,
    className
}: DetailViewProps) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'details');

    const formatValue = (field: DetailField) => {
        const { value, type, render } = field;

        if (render) {
            return render(value);
        }

        if (value === null || value === undefined || value === '') {
            return <span className="text-muted-foreground">—</span>;
        }

        switch (type) {
            case 'date':
                return new Date(value).toLocaleDateString('pt-BR');
            case 'datetime':
                return new Date(value).toLocaleString('pt-BR');
            case 'currency':
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            case 'boolean':
                return (
                    <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Sim' : 'Não'}
                    </Badge>
                );
            case 'badge':
                return <Badge variant="outline">{value}</Badge>;
            default:
                return String(value);
        }
    };

    const getFieldIcon = (field: DetailField) => {
        if (field.icon) return field.icon;

        switch (field.type) {
            case 'date':
            case 'datetime':
                return <Calendar className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        {backUrl && (
                            <Link href={backUrl}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                                {status && (
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                )}
                            </div>
                            {subtitle && (
                                <p className="text-muted-foreground">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={action.onClick}
                            className={action.className}
                        >
                            {action.icon}
                            {action.label}
                        </Button>
                    ))}
                    {editUrl && (
                        <Link href={editUrl}>
                            <Button size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Content */}
            {tabs.length > 0 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-auto">
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                                {tab.badge && (
                                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                        {tab.badge}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <DetailFields fields={fields} data={data} formatValue={formatValue} getFieldIcon={getFieldIcon} />
                        {metadata && <MetadataSection metadata={metadata} />}
                    </TabsContent>

                    {tabs.map((tab) => (
                        <TabsContent key={tab.id} value={tab.id}>
                            {tab.content}
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <div className="space-y-6">
                    <DetailFields fields={fields} data={data} formatValue={formatValue} getFieldIcon={getFieldIcon} />
                    {metadata && <MetadataSection metadata={metadata} />}
                </div>
            )}
        </div>
    );
}

function DetailFields({
    fields,
    data,
    formatValue,
    getFieldIcon
}: {
    fields: DetailField[];
    data: Record<string, any>;
    formatValue: (field: DetailField) => React.ReactNode;
    getFieldIcon: (field: DetailField) => React.ReactNode;
}) {


    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fields.map((field, index) => (
                        <div key={field.key} className={cn("space-y-2", field.className)}>
                            <div className="flex items-center gap-2">
                                {getFieldIcon(field)}
                                <label className="text-sm font-medium text-muted-foreground">
                                    {field.label}
                                </label>
                            </div>
                            <div className="text-sm font-medium">
                                {formatValue({ ...field, value: data[field?.key] })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MetadataSection({ metadata }: { metadata: NonNullable<DetailViewProps['metadata']> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Informações do Sistema
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metadata.createdAt && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Criado em
                            </label>
                            <div className="text-sm font-medium">
                                {new Date(metadata.createdAt).toLocaleString('pt-BR')}
                            </div>
                        </div>
                    )}
                    {metadata.updatedAt && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Atualizado em
                            </label>
                            <div className="text-sm font-medium">
                                {new Date(metadata.updatedAt).toLocaleString('pt-BR')}
                            </div>
                        </div>
                    )}
                    {metadata.createdBy && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Criado por
                            </label>
                            <div className="text-sm font-medium">
                                {metadata.createdBy}
                            </div>
                        </div>
                    )}
                    {metadata.updatedBy && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Atualizado por
                            </label>
                            <div className="text-sm font-medium">
                                {metadata.updatedBy}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
