<?php

namespace App\Modules\Compras\Resources;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequisitionResource extends JsonResource
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
            'order_number' => $this->order_number,
            'type' => 'Projeto',
            'itens_count' => 1,
            'requisitor' => new UserResource($this->requisitor),
            'responsible_buyer_id' => $this->responsible_buyer_id,
            'order' => $this->order,
            'observations' => $this->observations,
            'terms_and_conditions' => $this->terms_and_conditions,
            'category' => $this->category?->value,
            'category_label' => $this->category?->getLabelText(),
            'at' => $this->at?->format('d/m/Y'),
            'delivery_forecast' => $this->delivery_forecast?->format('d/m/Y'),
            'order_request' => $this->order_request,
            'under_negotiation_at' => $this->under_negotiation_at?->format('d/m/Y'),

            'status' => $this->status->getLabelText(),
            'status_label' => $this->status->getLabelText(),
            'status_color' => $this->status->getLabelColor(),
            'status_icon' => $this->status->getIcon(),
            'status_order' => 'Sem Pedido',

            'available_transitions' => $this->status->getAvailableTransitions(),
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y H:i'),
        ];
    }
}
