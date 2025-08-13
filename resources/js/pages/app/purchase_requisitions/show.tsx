import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    Eye,
    RotateCcw,
    Calendar,
    User,
    Building,
    Hash,
    Package,
    FileText,
    Clock,
    ShoppingCart
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface PurchaseRequisition {
    id: number;
    order_number: string;
    type: string;
    itens_count: number;
    requisitor: User;
    responsible_buyer_id?: number;
    order?: number;
    observations?: string;
    terms_and_conditions?: string;
    category?: string;
    category_label?: string;
    at: string;
    delivery_forecast?: string;
    order_request?: string;
    under_negotiation_at?: string;
    status: string;
    status_label: string;
    status_color: string;
    status_icon: string;
    status_order: string;
    available_transitions: Array<{
        value: string;
        label: string;
        color: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    purchaseRequisition: PurchaseRequisition;
}

const PurchaseRequisitionShow: React.FC<ShowProps> = ({ purchaseRequisitionData }) => {

    const purchaseRequisition = purchaseRequisitionData.data;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        responsible_buyer_id: purchaseRequisition.responsible_buyer_id || '',
        observations: purchaseRequisition.observations || '',
        terms_and_conditions: purchaseRequisition.terms_and_conditions || '',
        category: purchaseRequisition.category || '',
        delivery_forecast: purchaseRequisition.delivery_forecast || '',
        order_request: purchaseRequisition.order_request || '',
        status: purchaseRequisition.status,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Requisições de Compra',
            href: route('purchase-requisitions.index'),
        },
        {
            title: `#${purchaseRequisition.order_number}`,
            href: '#',
        },
    ];

    const handleSave = () => {
        put(route('purchase-requisitions.update', purchaseRequisition.id), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleStatusChange = (newStatus: string) => {
        setData('status', newStatus); // ainda atualiza o estado, se necessário

        put(route('purchase-requisitions.update', purchaseRequisition.id), {
            status: newStatus,
            preserveScroll: true,
        });
    };


    const getStatusBadgeVariant = (color: string) => {
        switch (color) {
            case 'success': return 'default';
            case 'warning': return 'secondary';
            case 'info': return 'outline';
            case 'danger': return 'destructive';
            default: return 'secondary';
        }
    };

    const canEdit = ['draft', 'submitted_for_approval'].includes(purchaseRequisition.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Requisição de Compra #${purchaseRequisition.order_number}`} />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => router.visit(route('purchase-requisitions.index'))}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        Requisição de Compra Número: {purchaseRequisition.order_number}
                                    </h1>
                                    <Badge variant={getStatusBadgeVariant(purchaseRequisition.status_color)}>
                                        {purchaseRequisition.status_label}
                                    </Badge>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Colocar dropdown Botões de transição de status */}
                        {purchaseRequisition.available_transitions.map((transition) => (
                            <Button
                                key={transition.value}
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(transition.value)}
                                disabled={processing}
                            >
                                {transition.label}
                            </Button>
                        ))}

                        {/* Botão de Cotação
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Cotação
                        </Button>

                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                                        PEDIDO NÃO FEITO
                                    </Badge>

                        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reiniciar Cotação
                        </Button>
*/}

                        {canEdit && (
                            <>
                                {!isEditing ? (
                                    <Button size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleSave} disabled={processing}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Salvar
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Informações Principais */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Comprador Responsável */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Comprador Responsável
                                </Label>
                                {isEditing && canEdit ? (
                                    <Input
                                        value={data.responsible_buyer_id}
                                        onChange={(e) => setData('responsible_buyer_id', e.target.value)}
                                        placeholder="Nome do comprador responsável"
                                        className="bg-gray-50"
                                    />
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                                        {purchaseRequisition.responsible_buyer_id || '—'}
                                    </div>
                                )}
                            </div>

                            {/* Usuário */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Usuário
                                </Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    {purchaseRequisition.requisitor.name}
                                </div>
                            </div>

                            {/* Projeto */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Projeto
                                </Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    {purchaseRequisition.type}
                                </div>
                            </div>

                            {/* Obra / Tipo de Lançamento */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Obra / Tipo de Lançamento
                                </Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    CONTRATO ETD
                                </div>
                            </div>

                            {/* Núm Ordem de Compra */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Núm Ordem de Compra
                                </Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    PO-{purchaseRequisition.order_number}
                                </div>
                            </div>

                            {/* Data de Requisição */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Data de Requisição
                                </Label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    {purchaseRequisition.at}
                                </div>
                            </div>

                            {/* Sugestão de Entrega */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Sugestão de Entrega
                                </Label>
                                {isEditing && canEdit ? (
                                    <Input
                                        type="date"
                                        value={data.delivery_forecast}
                                        onChange={(e) => setData('delivery_forecast', e.target.value)}
                                        className="bg-gray-50"
                                    />
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                                        {purchaseRequisition.delivery_forecast || '—'}
                                    </div>
                                )}
                            </div>

                            {/* Categoria */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Categoria
                                </Label>
                                {isEditing && canEdit ? (
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger className="bg-gray-50">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="materiais">Compras de Materiais</SelectItem>
                                            <SelectItem value="servicos">Serviços</SelectItem>
                                            <SelectItem value="locacao">Locação</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                                        {purchaseRequisition.category_label || 'Compras de Materiais'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela de Itens */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tabela de Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <div className="grid grid-cols-2 bg-gray-50 p-4 font-medium text-sm border-b">
                                <div>DETALHES DO ITEM</div>
                                <div>QUANTIDADE</div>
                            </div>
                            <div className="grid grid-cols-2 p-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>TUBO REDONDO DE AÇO PRETO 2" 1,20mm</span>
                                    <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <div>18</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Observações e Termos */}
                {(isEditing || purchaseRequisition.observations || purchaseRequisition.terms_and_conditions) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Observações */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Observações
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing && canEdit ? (
                                    <Textarea
                                        value={data.observations}
                                        onChange={(e) => setData('observations', e.target.value)}
                                        placeholder="Adicione observações..."
                                        rows={4}
                                    />
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        {purchaseRequisition.observations || 'Nenhuma observação'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Termos e Condições */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Termos e Condições
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing && canEdit ? (
                                    <Textarea
                                        value={data.terms_and_conditions}
                                        onChange={(e) => setData('terms_and_conditions', e.target.value)}
                                        placeholder="Adicione termos e condições..."
                                        rows={4}
                                    />
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        {purchaseRequisition.terms_and_conditions || 'Nenhum termo definido'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Informações do Sistema */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Informações do Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Criado em
                                </Label>
                                <div className="text-sm font-medium">
                                    {purchaseRequisition.created_at}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Atualizado em
                                </Label>
                                <div className="text-sm font-medium">
                                    {purchaseRequisition.updated_at}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Status do Pedido
                                </Label>
                                <div className="text-sm font-medium">
                                    {purchaseRequisition.status_order}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Itens
                                </Label>
                                <div className="text-sm font-medium">
                                    {purchaseRequisition.itens_count} item(s)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PurchaseRequisitionShow;
