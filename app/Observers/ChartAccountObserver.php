<?php

namespace App\Observers;

use App\Models\ChartAccount;

class ChartAccountObserver
{
    /**
     * Handle the ChartAccount "created" event.
     */
    public function created(ChartAccount $chartAccount): void
    {
        //
    }

    /**
     * Handle the ChartAccount "updated" event.
     */
    public function updated(ChartAccount $chartAccount): void
    {
        //
    }

    /**
     * Handle the ChartAccount "deleted" event.
     */
    public function deleted(ChartAccount $chartAccount): void
    {
        //
    }

    /**
     * Handle the ChartAccount "restored" event.
     */
    public function restored(ChartAccount $chartAccount): void
    {
        //
    }

    /**
     * Handle the ChartAccount "force deleted" event.
     */
    public function forceDeleted(ChartAccount $chartAccount): void
    {
        //
    }
}
