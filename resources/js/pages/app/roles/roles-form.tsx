import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RoleForm({ data, setData, errors, mode = 'edit' }) {
    const isEditing = mode === 'create' || mode === 'edit';
    const isCreating = mode === 'create';

    return (
        <div className="space-y-5">
            <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name || ''}
                    onChange={isEditing ? (e) => setData('name', e.target.value) : undefined}
                    disabled={!isEditing}
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="name">Descrição</Label>
                <Textarea
                    id="description"
                    className="mt-1 block w-full"
                    value={data.description}
                    onChange={isEditing ? (e) => setData('description', e.target.value) : undefined}
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
        </div>
    );
}
