<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryRequest extends FormRequest
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
            'name' => 'required',
            'description' => 'nullable',
            'sku' => 'required',
            'unit' => 'required',
            'ean' => 'nullable',
            'code_ncm' => 'nullable',
            'material_type' => 'required',
            'length' => 'nullable',
            'width' => 'nullable',
            'height' => 'nullable',
            'refueling_point' => 'nullable',
        ];
    }
}
