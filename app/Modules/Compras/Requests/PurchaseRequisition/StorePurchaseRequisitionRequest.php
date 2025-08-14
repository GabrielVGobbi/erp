<?php

namespace App\Modules\Compras\Requests\PurchaseRequisition;

use App\Modules\Compras\Supports\Enums\PurchaseCategory;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StorePurchaseRequisitionRequest extends FormRequest
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
            'type' => ['required', Rule::in(['project', 'cost_center', 'business_unit'])],

            'project_id' => ['required_if:type,project','exists:projects,id'],
            'cost_center_ids' => ['required_if:type,cost_center','exists:cost_centers,id'],
            'business_unit_ids' => ['required_if:type,business_unit'],#,'exists:business_unit,id'],

            'cost_center_ids.*' => ['integer', 'exists:cost_centers,id'],
            'business_unit_ids.*' => ['integer', 'exists:business_units,id'],

            'category' => ['required', Rule::in(PurchaseCategory::options()->pluck('value'))],
            'delivery_date' => ['required', 'date', 'after_or_equal:' . Carbon::now()->addDays(3)->toDateString()],
            'observations' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.inventory_id' => ['required', 'exists:inventories,id'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.stock' => ['required', 'numeric'],
            'items.*.total' => ['required', 'numeric'],

            'link_app' => ['nullable', 'url'],
        ];
    }


    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'delivery_forecast' => $this->validateDate($this->delivery_forecast, 'delivery_forecast'),
            #'at' => $this->validateDate($this->at),
        ]);
    }

    private function  validateDate($date, $col)
    {
        if (!$date) {
            return null;
        }

        throw_if(
            !validateDate($date),
            ValidationException::withMessages([$col => 'Por favor digite uma data válida'])
        );

        return date_format(Carbon::parse(str_replace('/', '-', $date)), 'Y-m-d');
    }


    public function messages(): array
    {
        return [
            'type.required' => 'O campo "type" é obrigatório.',
            'type.in' => 'O tipo deve ser "project", "cost_center" ou "business_unit".',

            'project_id.required' => 'O campo "project_id" é obrigatório quando o tipo é "project".',
            'project_id.exists' => 'O projeto selecionado não existe.',

            'cost_center_ids.*.exists' => 'Um ou mais centros de custo são inválidos.',
            'business_unit_ids.*.exists' => 'Uma ou mais unidades de negócio são inválidas.',

            'category.required' => 'A categoria é obrigatória.',
            'category.in' => 'A categoria selecionada é inválida.',

            'delivery_date.required' => 'A data de entrega é obrigatória.',
            'delivery_date.date' => 'A data de entrega deve ser uma data válida.',
            'delivery_date.after_or_equal' => 'A data de entrega deve ser pelo menos 3 dias após hoje.',

            'items.required' => 'É necessário informar ao menos um item.',
            'items.*.inventory_id.required' => 'O campo "inventory_id" é obrigatório para cada item.',
            'items.*.inventory_id.exists' => 'O inventário informado não existe.',
            'items.*.description.required' => 'A descrição do item é obrigatória.',
            'items.*.quantity.required' => 'A quantidade do item é obrigatória.',
            'items.*.quantity.numeric' => 'A quantidade deve ser um número.',
            'items.*.unit_price.required' => 'O preço unitário é obrigatório.',
            'items.*.unit_price.numeric' => 'O preço unitário deve ser numérico.',
            'items.*.stock.required' => 'O estoque é obrigatório.',
            'items.*.stock.numeric' => 'O estoque deve ser numérico.',
            'items.*.total.required' => 'O total é obrigatório.',
            'items.*.total.numeric' => 'O total deve ser numérico.',

            'link_app.url' => 'O link do app deve ser uma URL válida.',
        ];
    }
}
