<?php

namespace App\Modules\Compras\Requests\PurchaseRequisition;

use App\Modules\Compras\Supports\Enums\PurchaseCategory;
use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePurchaseRequisitionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'responsible_buyer_id' => ['nullable', 'exists:users,id'],
            'observations' => ['nullable', 'string', 'max:1000'],
            'terms_and_conditions' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', Rule::enum(PurchaseCategory::class)],
            #'delivery_forecast' => ['nullable', 'date', 'after:today'],
            'order_request' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(PurchaseRequisitionStatus::class)],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'responsible_buyer_id.exists' => 'O comprador responsável selecionado não existe.',
            'delivery_forecast.after' => 'A data de previsão de entrega deve ser posterior a hoje.',
            'observations.max' => 'As observações não podem exceder 1000 caracteres.',
            'terms_and_conditions.max' => 'Os termos e condições não podem exceder 1000 caracteres.',
            'status.required' => 'O status é obrigatório.',
        ];
    }
}
