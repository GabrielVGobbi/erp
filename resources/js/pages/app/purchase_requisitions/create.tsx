import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/app/page-header';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AsyncSelect from '@/components/ui/async-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Search, ShoppingCart, Calendar, Package, Check, X, ShoppingBag, Filter } from 'lucide-react';
import InfiniteList from '@/components/ui/infinite-list';

// Types
interface PurchaseItem {
    id?: number;
    inventory_id?: number;
    description: string;
    quantity: number;
    unit_price?: number;
    stock?: number;
    total?: number;
}

interface FormData {
    type: 'project' | 'cost_center' | 'business_unit' | '';
    project_id?: number;
    cost_center_ids: number[];
    business_unit_ids: number[];
    category: string;
    delivery_date: string;
    observations: string;
    items: PurchaseItem[];
}

interface PRProps {
    projects: Array<{ id: number; name: string; code?: string; status?: string }>;
    cost_centers: Array<{ id: number; name: string; code?: string }>;
    business_units: Array<{ id: number; name: string; code?: string }>;
    categories: Array<{ value: string; label: string }>;
}

// Constants
const PURCHASE_CATEGORIES = [
    { value: 'materiais', label: 'Compra de Materiais', icon: '📝' },
    { value: 'servicos', label: 'Serviços', icon: '💻' },
    { value: 'locacao', label: 'Locação', icon: '🔧' },
    { value: 'outros', label: 'Outros', icon: '📦' },
];

const MINIMUM_DELIVERY_DAYS = 3;

export default function PurchaseRequisitionsCreate() {
    const { projects, cost_centers, business_units } = usePage().props as unknown as PRProps;

    // Form state using Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm<FormData & { [key: string]: any }>({
        type: '',
        cost_center_ids: [],
        business_unit_ids: [],
        category: '',
        delivery_date: '',
        observations: '',
        items: []
    });

    // Local state
    const [inventories, setInventories] = useState<any[]>([]);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [tempQuantities, setTempQuantities] = useState<Record<number, number>>({});

    // Computed values
    const minDeliveryDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + MINIMUM_DELIVERY_DAYS);
        return date.toISOString().split('T')[0];
    }, []);

    // Conjunto de IDs já adicionados para lookup O(1)
    const addedInventoryIds = useMemo(() => new Set<number>(data.items.map(it => Number(it.inventory_id))), [data.items]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Compras', href: route('purchase-requisitions.index') },
        { title: 'Nova Requisição', href: '#' },
    ];

    // Set default delivery date
    useEffect(() => {
        if (!data.delivery_date) {
            setData('delivery_date', minDeliveryDate);
        }
    }, [data.delivery_date, minDeliveryDate, setData]);

    // Debounced search function
    const debouncer = useDebounce();
    const debouncedSearch = useCallback((query: string) => {
        debouncer(async () => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const params = new URLSearchParams({ page: '1', pageSize: '10', search: query }).toString();
                const response = await fetch(`/tables/inventories?${params}`, { credentials: 'same-origin' });
                if (response.ok) {
                    const json = await response.json();
                    setSearchResults(json.data || []);
                }
            } catch (error) {
                console.error('Erro ao buscar inventários:', error);
                toast.error('Erro ao buscar itens');
            } finally {
                setIsSearching(false);
            }
        }, 300);
    }, [debouncer]);

    // Handle search input
    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => { };
    }, [searchTerm, debouncedSearch]);

    const handleTypeChange = (type: 'project' | 'cost_center' | 'business_unit') => {
        setData(prev => ({
            ...prev,
            type,
            project_id: undefined,
            cost_center_ids: [],
            business_unit_ids: []
        }));
    };

    // New handlers for multiple selection
    const toggleItemSelection = (inventoryId: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(inventoryId)) {
            newSelected.delete(inventoryId);
            const newQuantities = { ...tempQuantities };
            delete newQuantities[inventoryId];
            setTempQuantities(newQuantities);
        } else {
            newSelected.add(inventoryId);
            setTempQuantities(prev => ({ ...prev, [inventoryId]: 1 }));
        }
        setSelectedItems(newSelected);
    };

    const updateTempQuantity = (inventoryId: number, quantity: number) => {
        if (quantity < 1) return;
        setTempQuantities(prev => ({ ...prev, [inventoryId]: quantity }));
    };

    const addSelectedItems = () => {
        const itemsToAdd: PurchaseItem[] = [];
        const updatedItems = [...data.items];

        selectedItems.forEach(inventoryId => {
            const inventory = searchResults.find(item => item.id === inventoryId) as { id: number; name?: string; description?: string; unit_price?: number; stock?: number } | undefined;
            if (!inventory) return;

            const quantity = tempQuantities[inventoryId] || 1;
            const existingItemIndex = updatedItems.findIndex(item => item.inventory_id === inventoryId);

            if (existingItemIndex >= 0) {
                // Update existing item quantity
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                    total: (updatedItems[existingItemIndex].unit_price || 0) * (updatedItems[existingItemIndex].quantity + quantity)
                };
            } else {
                // Add new item
                const newItem: PurchaseItem = {
                    inventory_id: inventory.id,
                    description: inventory.name ?? inventory.description ?? '',
                    quantity,
                    unit_price: inventory.unit_price || 0,
                    stock: inventory.stock || 0,
                    total: (inventory.unit_price || 0) * quantity
                };
                itemsToAdd.push(newItem);
            }
        });

        setData('items', [...updatedItems, ...itemsToAdd]);

        // Reset selection state
        setSelectedItems(new Set());
        setTempQuantities({});
        setIsItemModalOpen(false);
        setSearchTerm('');
        setSearchResults([]);

        const totalSelected = selectedItems.size;
        toast.success(`${totalSelected} ${totalSelected === 1 ? 'item adicionado' : 'itens adicionados'} à requisição!`);
    };

    const clearSelection = () => {
        setSelectedItems(new Set());
        setTempQuantities({});
    };

    type InventoryLite = { id: number; name?: string; description?: string; unit_price?: number; stock?: number }
    const addItem = (inventory: InventoryLite) => {
        // Check if item already exists
        const existingItemIndex = data.items.findIndex(item => item.inventory_id === inventory.id);

        if (existingItemIndex >= 0) {
            // Increment quantity if item exists
            const updatedItems = [...data.items];
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + 1,
                total: (updatedItems[existingItemIndex].unit_price || 0) * (updatedItems[existingItemIndex].quantity + 1)
            };
            setData('items', updatedItems);
            toast.success('Quantidade do item aumentada!');
        } else {
            // Add new item
            const newItem: PurchaseItem = {
                inventory_id: inventory.id,
                description: inventory.name ?? inventory.description ?? '',
                quantity: 1,
                unit_price: inventory.unit_price || 0,
                stock: inventory.stock || 0,
                total: inventory.unit_price || 0
            };
            setData('items', [...data.items, newItem]);
            toast.success('Item adicionado à requisição!');
        }

        setIsItemModalOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeItem = (index: number) => {
        const updatedItems = data.items.filter((_, i) => i !== index);
        setData('items', updatedItems);
        toast.success('Item removido da requisição!');
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        if (quantity < 1) return;

        const updatedItems = data.items.map((item, i) => {
            if (i === index) {
                const total = (item.unit_price || 0) * quantity;
                return { ...item, quantity, total };
            }
            return item;
        });
        setData('items', updatedItems);
    };

    // Improved validation: Extract to a separate function, collect all errors at once
    const validateForm = (): string[] => {
        const validationErrors: string[] = [];

        if (!data.type) {
            validationErrors.push('Selecione o tipo de requisição');
        }

        if (data.items.length === 0) {
            validationErrors.push('Adicione pelo menos um item à requisição');
        }

        if (data.type === 'project' && !data.project_id) {
            validationErrors.push('Selecione um projeto');
        }

        if (data.type === 'cost_center' && data.cost_center_ids.length === 0) {
            validationErrors.push('Selecione pelo menos um centro de custo');
        }

        if (data.type === 'business_unit' && data.business_unit_ids.length === 0) {
            validationErrors.push('Selecione pelo menos uma unidade de negócio');
        }

        if (!data.category) {
            validationErrors.push('Selecione a categoria');
        }

        // You can add more validations here, e.g., for delivery_date if needed

        return validationErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            // Show all errors in one toast for better UX, or multiple if preferred
            toast.error(
                <>
                    <p className="font-bold">Erros de validação:</p>
                    <ul className="list-disc pl-4">
                        {validationErrors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </>,
                { duration: 5000 } // Longer duration to read all errors
            );
            return;
        }

        post(route('purchase-requisitions.store'), {
            onSuccess: () => {
                toast.success('Requisição de compra criada com sucesso!');
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat().join(', ');
                toast.error(`Erro ao criar requisição: ${errorMessages}`);
            },
        });
    };

    const handleCancel = () => {
        router.visit(route('purchase-requisitions.index'));
    };

    return (
        <AppLayout>
            <Head title="Nova Requisição de Compra" />

            <div className="max-w-4xl mx-auto space-y-6">
                <PageHeader
                    title="Nova Requisição de Compra"
                    description=""
                    breadcrumbs={breadcrumbs}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Tipo de Requisição
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    type="button"
                                    variant={data.type === 'project' ? 'default' : 'outline'}
                                    onClick={() => handleTypeChange('project')}
                                    className="h-20 flex flex-col gap-2"
                                >
                                    <Package className="h-6 w-6" />
                                    Projeto
                                </Button>
                                <Button
                                    type="button"
                                    variant={data.type === 'cost_center' ? 'default' : 'outline'}
                                    onClick={() => handleTypeChange('cost_center')}
                                    className="h-20 flex flex-col gap-2"
                                >
                                    <Package className="h-6 w-6" />
                                    Centro de Custo
                                </Button>
                                <Button
                                    type="button"
                                    variant={data.type === 'business_unit' ? 'default' : 'outline'}
                                    onClick={() => handleTypeChange('business_unit')}
                                    className="h-20 flex flex-col gap-2"
                                >
                                    <Package className="h-6 w-6" />
                                    Unidade de Negócio
                                </Button>
                            </div>
                            {errors.type && (
                                <p className="text-sm text-red-600 mt-2">{errors.type}</p>
                            )}
                        </CardContent>
                    </Card>

                    {data.type && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {data.type === 'project' && 'Selecionar Projeto'}
                                        {data.type === 'cost_center' && 'Selecionar Centros de Custo'}
                                        {data.type === 'business_unit' && 'Selecionar Unidades de Negócio'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.type === 'project' && (
                                        <AsyncSelect
                                            endpoint="/tables/projects" // ajuste quando existir endpoint de projetos
                                            multiple={false}
                                            value={data.project_id ? String(data.project_id) : null}
                                            onChange={(val) => setData('project_id', typeof val === 'string' ? parseInt(val) : undefined)}
                                            placeholder="Selecione um projeto"
                                            transform={(item) => ({ label: item.name ?? item.label ?? `#${item.id}`, value: String(item.id) })}
                                        />
                                    )}

                                    {data.type === 'cost_center' && (
                                        <AsyncSelect
                                            endpoint="/tables/cost-centers"
                                            multiple
                                            value={data.cost_center_ids.map(String)}
                                            onChange={(val) => setData('cost_center_ids', Array.isArray(val) ? val.map((v) => parseInt(v)) : [])}
                                            placeholder="Selecione centros de custo"
                                            transform={(item) => ({ label: item.name ?? item.label ?? `#${item.id}`, value: String(item.id) })}
                                        />
                                    )}

                                    {data.type === 'business_unit' && (
                                        <AsyncSelect
                                            endpoint="/tables/branches" // exemplo de unidade de negócio assumindo branches
                                            multiple
                                            value={data.business_unit_ids.map(String)}
                                            onChange={(val) => setData('business_unit_ids', Array.isArray(val) ? val.map((v) => parseInt(v)) : [])}
                                            placeholder="Selecione unidades de negócio"
                                            transform={(item) => ({ label: item.name ?? item.label ?? `#${item.id}`, value: String(item.id) })}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Itens da Requisição ({data.items.length})
                                    </CardTitle>

                                    <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button type="button" size="sm" >
                                                <ShoppingBag className="h-4 w-4 mr-2" />
                                                Selecionar Itens
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-hidden bg-white">
                                            <DialogHeader className="pb-4 border-b">
                                                <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                                                    <div className="p-2 bg-gradient-to-r  rounded-lg">
                                                        <ShoppingBag className="h-5 w-5 text-gray-800" />
                                                    </div>
                                                    Selecionar Itens para Requisição
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-600">
                                                    Busque e selecione os itens que deseja adicionar à sua requisição. Você pode selecionar múltiplos itens e definir quantidades.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col h-full space-y-4">
                                                {/* Search Bar */}
                                                <div className="flex gap-3">
                                                    <div className="relative flex-1">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            placeholder="Digite o nome, código ou descrição do item..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            autoFocus
                                                        />
                                                        {searchTerm && (
                                                            <button
                                                                onClick={() => setSearchTerm('')}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {selectedItems.size > 0 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={clearSelection}
                                                            className="h-11 px-4 border-gray-300 hover:bg-gray-50"
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Limpar ({selectedItems.size})
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Results Area - Infinite List */}
                                                <div className="flex-1 overflow-y-auto max-h-[45vh] border rounded-lg bg-gray-50/50">
                                                    <InfiniteList
                                                        endpoint="/tables/inventories"
                                                        pageSize={15}
                                                        search={searchTerm}
                                                        onItemsChange={(items) => setSearchResults(items as any[])}
                                                        className="p-2"
                                                        renderItem={(inventory: unknown) => {
                                                            const invId = Number(inventory.id);
                                                            const isSelected = selectedItems.has(invId);
                                                            const isAlreadyAdded = addedInventoryIds.has(invId);
                                                            // Ocultar itens já adicionados para evitar confusão visual
                                                            if (isAlreadyAdded) return null;
                                                            return (
                                                                <div
                                                                    key={invId}
                                                                    className={`
                                                                        flex items-center gap-3 p-3 mb-1 bg-white rounded border transition-all duration-200 cursor-pointer
                                                                        ${isSelected
                                                                            ? 'border-blue-500 bg-blue-50'
                                                                            : 'border-gray-200 hover:border-gray-300'}
                                                                    `}
                                                                    onClick={() => toggleItemSelection(invId)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() => toggleItemSelection(invId)}
                                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                    />

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <h4 className="font-medium text-sm text-gray-900 truncate max-w-[200px]">
                                                                                {inventory.name}
                                                                            </h4>
                                                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                                                                {inventory.material_type}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                            {inventory.sku && (
                                                                                <span>SKU: {inventory.sku}</span>
                                                                            )}
                                                                            {inventory.ean && (
                                                                                <span>EAN: {inventory.ean}</span>
                                                                            )}
                                                                            <span>Unidade: {inventory.unit}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <Badge
                                                                            variant={inventory.stock > 0 ? 'default' : 'destructive'}
                                                                            className="text-xs"
                                                                        >
                                                                            {inventory.stock || 0}
                                                                        </Badge>

                                                                        {isSelected && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Input
                                                                                    type="number"
                                                                                    min="1"
                                                                                    value={tempQuantities[inventory.id] || 1}
                                                                                    onChange={(e) => updateTempQuantity(inventory.id, parseInt(e.target.value) || 1)}
                                                                                    className="w-14 h-7 text-xs text-center"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }}
                                                        emptyState={
                                                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                                                <Package className="h-12 w-12 mb-4 opacity-50" />
                                                                <p className="text-lg font-medium">Nenhum item encontrado</p>
                                                            </div>
                                                        }
                                                    />
                                                </div>

                                                {/* Selection Summary */}
                                                {selectedItems.size > 0 && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <ShoppingBag className="h-5 w-5 text-blue-600" />
                                                                <span className="font-medium text-blue-900">
                                                                    {selectedItems.size} {selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-blue-700">
                                                                Total de itens: {Object.values(tempQuantities).reduce((sum, qty) => sum + qty, 0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
                                                <div className="text-sm text-gray-500">
                                                    {selectedItems.size > 0
                                                        ? `${selectedItems.size} ${selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'}`
                                                        : 'Selecione os itens desejados'
                                                    }
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsItemModalOpen(false)}
                                                        className="px-6"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={addSelectedItems}
                                                        disabled={selectedItems.size === 0}
                                                        className="px-6  shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Adicionar {selectedItems.size > 0 ? `(${selectedItems.size})` : ''}
                                                    </Button>
                                                </div>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    {data.items.length > 0 ? (
                                        <div className="space-y-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Item</TableHead>
                                                        <TableHead>Quantidade</TableHead>
                                                        <TableHead>Em Estoque</TableHead>
                                                        <TableHead className="w-20">Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">
                                                                {item.description}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                                                                    className="w-20"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{(item.stock || 0)}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => removeItem(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Nenhum item adicionado</p>
                                            <p className="text-sm">Clique em "Adicionar Item" para começar</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Informações Adicionais
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category">Categoria *</Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={(value) => setData('category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PURCHASE_CATEGORIES.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            <div className="flex items-center gap-2">
                                                                {category.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && (
                                                <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="delivery_date">Data de Entrega Desejada *</Label>
                                            <Input
                                                id="delivery_date"
                                                type="date"
                                                min={minDeliveryDate}
                                                value={data.delivery_date}
                                                onChange={(e) => setData('delivery_date', e.target.value)}
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Mínimo de {MINIMUM_DELIVERY_DAYS} dias úteis
                                            </p>
                                            {errors.delivery_date && (
                                                <p className="text-sm text-red-600 mt-1">{errors.delivery_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="observations">Observações</Label>
                                        <Textarea
                                            id="observations"
                                            placeholder="Descreva detalhes importantes sobre esta requisição..."
                                            value={data.observations}
                                            onChange={(e) => setData('observations', e.target.value)}
                                            rows={4}
                                        />
                                        {errors.observations && (
                                            <p className="text-sm text-red-600 mt-1">{errors.observations}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pb-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={processing}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || data.items.length === 0 || !data.type}
                                    className="min-w-32"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar Requisição'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                </form>
            </div>
        </AppLayout>
    );
}
