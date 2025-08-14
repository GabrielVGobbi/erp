import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserForm({ data, setData, errors, mode = 'edit' }) {
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
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email || ''}
                    onChange={isEditing ? (e) => setData('email', e.target.value) : undefined}
                    disabled={!isEditing}
                    required
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            {isEditing && (
                <>
                    <div>
                        <Label htmlFor="password">{isCreating ? "Senha" : "Nova Senha (optional)"}</Label>
                        <Input
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password || ''}
                            onChange={(e) => setData('password', e.target.value)}
                            // O campo de senha só é 'required' na criação
                            required={isCreating}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                        {!isCreating && <p className="text-sm text-gray-500 mt-1">Deixe em branco para manter a senha atual.</p>}
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation" value="Confirm Password" >Confirmar Senha</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password_confirmation || ''}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            // O campo de confirmação só é 'required' na criação
                            required={isCreating}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </>
            )}
        </div>
    );
}
