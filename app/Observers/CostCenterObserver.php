<?php

namespace App\Observers;

use App\Models\CostCenter;

class CostCenterObserver
{
    /**
     * Handle the CostCenter "created" event.
     */
    public function created(CostCenter $costCenter): void
    {
        //
    }

    /**
     * Handle the CostCenter "updated" event.
     */
    public function updated(CostCenter $costCenter): void
    {
        //
    }

    /**
     * Handle the CostCenter "deleted" event.
     */
    public function deleted(CostCenter $costCenter): void
    {
        //
    }

    /**
     * Handle the CostCenter "restored" event.
     */
    public function restored(CostCenter $costCenter): void
    {
        //
    }

    /**
     * Handle the CostCenter "force deleted" event.
     */
    public function forceDeleted(CostCenter $costCenter): void
    {
        //
    }
}
