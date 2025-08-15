import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BusinessUnitFormProps {
    data: {
        name: string;
        // TODO: Adicionar outros campos conforme necessário
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    mode: 'create' | 'edit';
}

export default function BusinessUnitForm({ data, setData, errors, mode }: BusinessUnitFormProps) {
    return (
        <div className="space-y-6">
            {/* Campo Principal */}
            <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Digite o nome"
                />
                {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            {/* TODO: Adicionar outros campos conforme necessário */}
            {/* Exemplo de campo de texto longo:
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    className={errors.description ? 'border-red-500' : ''}
                    placeholder="Digite a descrição (opcional)"
                    rows={3}
                />
                {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                )}
            </div>
            */}

            {/* Exemplo de campo select:
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    value={data.status || ''}
                    onChange={(e) => setData('status', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Selecione o status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                </select>
                {errors.status && (
                    <p className="text-sm text-red-600">{errors.status}</p>
                )}
            </div>
            */}
        </div>
    );
}
