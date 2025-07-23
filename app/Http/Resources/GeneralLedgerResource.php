<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GeneralLedgerResource extends JsonResource
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
            'uuid' => $this->uuid,
            'posting_date' => $this->formatted_posting_date,
            'chart_account' => $this->chartAccount ? [
                'id' => $this->chartAccount->id,
                'code' => $this->chartAccount->code,
                'name' => $this->chartAccount->name,
            ] : null,
            'debit' => $this->formatted_debit,
            'credit' => $this->formatted_credit,
            'balance' => $this->formatted_balance,
            'voucher_type' => $this->voucher_type,
            'voucher_subtype' => $this->voucher_subtype,
            'voucher_number' => $this->voucher_number,
            'against_voucher_number' => $this->against_voucher_number,
            'partner_type' => $this->partner_type,
            'partner' => $this->partner,
            'project' => $this->project,
            'description' => $this->description,
            'remarks' => $this->remarks,
            'currency' => $this->currency,
            'is_opening_entry' => $this->is_opening_entry,
            'is_closing_entry' => $this->is_closing_entry,
            'is_system_generated' => $this->is_system_generated,
            'status' => $this->status,
            'organization' => $this->organization ? [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
            ] : null,
            'branch' => $this->branch ? [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ] : null,
            'supplier' => $this->supplier ? [
                'id' => $this->supplier->id,
                'name' => $this->supplier->name,
            ] : null,
            'created_at' => $this->created_at?->format('d/m/Y H:i:s'),
            'updated_at' => $this->updated_at?->format('d/m/Y H:i:s'),
        ];
    }
} 