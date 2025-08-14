import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Building,
    Hash,
    Calendar,
    User,
    MessageSquare,
    BarChart3,
    Trash2,
    Copy,
    Edit,
    Save,
    X,
    Package,
    Tag,
    Ruler,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Image as ImageIcon,
    Plus,
    Minus
} from 'lucide-react';

interface Inventory {
    id: number;
    name: string;
    sku: string;
    unit: string;
    ean: string;
    code_ncm: string;
    material_type: string;
    length: number;
    width: number;
    height: number;
    cover: string;
    stock: number;
    opening_stock: number;
    refueling_point: number;
    market_price: number;
    last_buy_price: number;
    sale_price: number;
    description?: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    inventory: Inventory;
}

const InventoryShow: React.FC<ShowProps> = ({ inventory }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Inventário',
            href: route('inventories.index'),
        },
        {
            title: inventory.name,
            href: '#',
        },
    ];
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ...inventory,
        description: inventory.description || '',
        ean: inventory.ean || '',
        code_ncm: inventory.code_ncm || '',
        length: inventory.length || 0,
        width: inventory.width || 0,
        height: inventory.height || 0,
        market_price: inventory.market_price || 0,
        last_buy_price: inventory.last_buy_price || 0,
        sale_price: inventory.sale_price || 0,
        refueling_point: inventory.refueling_point || 0,
    });
    const [activeTab, setActiveTab] = useState('details');

    const handleSave = () => {

        router.put(route('inventories.update', { inventory: inventory.id }), formData as unknown, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        setFormData({
            ...inventory,
            description: inventory.description || '',
            ean: inventory.ean || '',
            code_ncm: inventory.code_ncm || '',
            length: inventory.length || 0,
            width: inventory.width || 0,
            height: inventory.height || 0,
            market_price: inventory.market_price || 0,
            last_buy_price: inventory.last_buy_price || 0,
            sale_price: inventory.sale_price || 0,
            refueling_point: inventory.refueling_point || 0,
        });
        setIsEditing(false);
    };

    const getStockStatus = (stock: number, refuelingPoint: number) => {
        if (stock <= 0) return { status: 'out', label: 'Sem Estoque', color: 'destructive' };
        if (stock <= refuelingPoint) return { status: 'low', label: 'Estoque Baixo', color: 'warning' };
        return { status: 'ok', label: 'Em Estoque', color: 'default' };
    };

    const stockStatus = getStockStatus(formData.stock, formData.refueling_point);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Item - ${inventory.name}`} />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Editar Item' : inventory.name}
                            </h1>
                            {isEditing && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    Modo de Edição
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            SKU: {inventory.sku} • Código EAN: {inventory.ean}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleCancel} variant="outline">
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna da Esquerda - Imagens e Informações Básicas */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Imagem do Produto */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Imagem do Produto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {inventory.cover ? (
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                        <img
                                            src={inventory.cover}
                                            alt={inventory.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm">
                                                    <ImageIcon className="w-4 h-4 mr-2" />
                                                    Alterar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                        {isEditing ? (
                                            <div className="text-center">
                                                <Button variant="outline" size="sm">
                                                    <ImageIcon className="w-4 h-4 mr-2" />
                                                    Adicionar Imagem
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">Sem imagem</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status do Estoque */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Status do Estoque
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Quantidade Atual:</span>
                                    <span className="text-lg font-bold">{formData.stock}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Ponto de Reposição:</span>
                                    <span className="text-sm">{formData.refueling_point}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={stockStatus.color as unknown}>
                                        {stockStatus.status === 'out' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {stockStatus.status === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {stockStatus.status === 'ok' && <CheckCircle className="w-3 h-3 mr-1" />}
                                        {stockStatus.label}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preços */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Informações de Preço
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Preço de Venda:</span>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.sale_price || ''}
                                            onChange={(e) => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                                            className="w-24 text-right"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-green-600">
                                            R$ {formData.sale_price?.toFixed(2) || '0,00'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Preço de Mercado:</span>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.market_price || ''}
                                            onChange={(e) => setFormData({ ...formData, market_price: Number(e.target.value) })}
                                            className="w-24 text-right"
                                        />
                                    ) : (
                                        <span className="text-sm">R$ {formData.market_price?.toFixed(2) || '0,00'}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Último Preço de Compra:</span>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.last_buy_price || ''}
                                            onChange={(e) => setFormData({ ...formData, last_buy_price: Number(e.target.value) })}
                                            className="w-24 text-right"
                                        />
                                    ) : (
                                        <span className="text-sm">R$ {formData.last_buy_price?.toFixed(2) || '0,00'}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna da Direita - Tabs com Dados Detalhados */}
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="details">Detalhes</TabsTrigger>
                                <TabsTrigger value="specifications">Especificações</TabsTrigger>
                                <TabsTrigger value="history">Histórico</TabsTrigger>
                                <TabsTrigger value="purchases">Compras</TabsTrigger>
                            </TabsList>

                            {/* Tab Detalhes */}
                            <TabsContent value="details" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informações Gerais</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nome do Produto</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.name}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sku">SKU</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="sku"
                                                        value={formData.sku}
                                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.sku}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ean">Código EAN</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="ean"
                                                        value={formData.ean}
                                                        onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.ean}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="unit">Unidade</Label>
                                                {isEditing ? (
                                                    <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UN">Unidade</SelectItem>
                                                            <SelectItem value="KG">Quilograma</SelectItem>
                                                            <SelectItem value="L">Litro</SelectItem>
                                                            <SelectItem value="M">Metro</SelectItem>
                                                            <SelectItem value="M2">Metro Quadrado</SelectItem>
                                                            <SelectItem value="M3">Metro Cúbico</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.unit}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Descrição</Label>
                                            {isEditing ? (
                                                <Textarea
                                                    id="description"
                                                    placeholder="Descrição detalhada do produto..."
                                                    value={formData.description || ''}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formData.description || 'Nenhuma descrição disponível'}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Controle de Estoque</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="stock">Estoque Atual</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.stock}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="opening_stock">Estoque Inicial</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.opening_stock}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="refueling_point">Ponto de Reposição</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="refueling_point"
                                                        type="number"
                                                        value={formData.refueling_point || ''}
                                                        onChange={(e) => setFormData({ ...formData, refueling_point: Number(e.target.value) })}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.refueling_point}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tab Especificações */}
                            <TabsContent value="specifications" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Especificações Técnicas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="code_ncm">Código NCM</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="code_ncm"
                                                        value={formData.code_ncm}
                                                        onChange={(e) => setFormData({ ...formData, code_ncm: e.target.value })}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.code_ncm}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="material_type">Tipo de Material</Label>
                                                {isEditing ? (
                                                    <Select value={formData.material_type} onValueChange={(value) => setFormData({ ...formData, material_type: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="raw">Matéria Prima</SelectItem>
                                                            <SelectItem value="finished">Produto Acabado</SelectItem>
                                                            <SelectItem value="semi_finished">Semi Acabado</SelectItem>
                                                            <SelectItem value="packaging">Embalagem</SelectItem>
                                                            <SelectItem value="consumable">Consumo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.material_type}</p>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <Ruler className="w-4 h-4" />
                                                Dimensões (cm)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="length">Comprimento</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="length"
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.length || ''}
                                                            onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formData.length} cm</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="width">Largura</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="width"
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.width || ''}
                                                            onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formData.width} cm</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="height">Altura</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id="height"
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.height || ''}
                                                            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formData.height} cm</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tab Histórico */}
                            <TabsContent value="history" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Histórico de Movimentações</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-gray-500">
                                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>Histórico de movimentações será implementado em breve</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tab Compras */}
                            <TabsContent value="purchases" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Ordens de Compra</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>Ordens de compra serão implementadas em breve</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default InventoryShow;
