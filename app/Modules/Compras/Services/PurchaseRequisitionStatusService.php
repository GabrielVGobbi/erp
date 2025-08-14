<?php

namespace App\Modules\Compras\Services;

use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;

class PurchaseRequisitionStatusService
{
    /**
     * Verifica se a transição de status é válida
     */
    public function canTransitionTo(PurchaseRequisitionStatus $currentStatus, PurchaseRequisitionStatus $newStatus): bool
    {
        return $currentStatus->canTransitionTo($newStatus);
    }

    /**
     * Retorna os status disponíveis para transição
     */
    public function getAvailableTransitions(PurchaseRequisitionStatus $currentStatus): array
    {
        return $currentStatus->getAvailableTransitions();
    }
}
