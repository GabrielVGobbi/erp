<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountingEntriesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type_voucher' => $this->type_voucher,
            'type_voucher_description' => $this->type_voucher_description,
            'debit' => $this->debit,
            'credit' => $this->credit,
            'balance' => $this->balance,
            'at' => $this->at,
            'ChartAccount' => $this->ChartAccount,
        ];
    }
}
