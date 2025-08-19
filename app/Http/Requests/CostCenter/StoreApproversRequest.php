<?php

namespace App\Http\Requests\CostCenter;

use Illuminate\Foundation\Http\FormRequest;

class StoreApproversRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'assignments' => 'required|array|min:1',
            'assignments.*.user_id' => 'required|exists:users,id',
            'assignments.*.role_id' => 'required|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'assignments.required' => 'É necessário pelo menos uma atribuição.',
            'assignments.*.user_id.required' => 'O usuário é obrigatório.',
            'assignments.*.user_id.exists' => 'O usuário selecionado não existe.',
            'assignments.*.role_id.required' => 'O papel é obrigatório.',
            'assignments.*.role_id.exists' => 'O papel selecionado não existe.',
        ];
    }
}
