<?php

namespace App\Modules\Compras\Services;

use App\Modules\Compras\Models\PurchaseRequisition;
use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;
use Illuminate\Validation\ValidationException;

class PurchaseRequisitionService
{
    /**
     * Atualiza o status da requisição de compra
     */
    public function updateStatus(PurchaseRequisition $purchaseRequisition, PurchaseRequisitionStatus $newStatus): PurchaseRequisition
    {
        if (!$purchaseRequisition->canUpdate($newStatus)) {
            throw ValidationException::withMessages([
                'status' => "Não é possível alterar o status de '{$purchaseRequisition->status->getLabelText()}' para '{$newStatus->getLabelText()}'"
            ]);
        }

        $purchaseRequisition->status = $newStatus;

        // Atualiza campos específicos baseado no novo status
        $this->updateStatusSpecificFields($purchaseRequisition, $newStatus);

        $purchaseRequisition->save();

        return $purchaseRequisition;
    }

    /**
     * TODO: colocar em handle: Atualiza campos específicos baseado no status
     */
    private function updateStatusSpecificFields(PurchaseRequisition $purchaseRequisition, PurchaseRequisitionStatus $status): void
    {
        switch ($status) {
            case PurchaseRequisitionStatus::UNDER_NEGOTIATION:
                $purchaseRequisition->under_negotiation_at = now();
                break;
            case PurchaseRequisitionStatus::CLOSED:
                break;
        }
    }
}
