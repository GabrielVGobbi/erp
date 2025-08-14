<?php

namespace App\Modules\Compras\Observers;

use App\Modules\Compras\Models\PurchaseRequisition;

class PurchaseRequisitionObserver
{
    /**
     * Handle the PurchaseRequisition "created" event.
     */
    public function created(PurchaseRequisition $purchaseRequisition): void
    {
        //
    }

    /**
     * Handle the PurchaseRequisition "updated" event.
     */
    public function updated(PurchaseRequisition $purchaseRequisition): void
    {
        //
    }

    /**
     * Handle the PurchaseRequisition "deleted" event.
     */
    public function deleted(PurchaseRequisition $purchaseRequisition): void
    {
        //
    }

    /**
     * Handle the PurchaseRequisition "restored" event.
     */
    public function restored(PurchaseRequisition $purchaseRequisition): void
    {
        //
    }

    /**
     * Handle the PurchaseRequisition "force deleted" event.
     */
    public function forceDeleted(PurchaseRequisition $purchaseRequisition): void
    {
        //
    }
}
