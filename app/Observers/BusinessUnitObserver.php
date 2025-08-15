<?php

namespace App\Observers;

use App\Models\BusinessUnit;

class BusinessUnitObserver
{
    /**
     * Handle the BusinessUnit "creating" event.
     */
    public function creating(BusinessUnit $businessUnit): void
    {
        $this->global($businessUnit);
    }

    /**
     * Handle the BusinessUnit "updating" event.
     */
    public function updating(BusinessUnit $businessUnit): void
    {
        $this->global($businessUnit);
    }

    /**
     * Handle the BusinessUnit "created" event.
     */
    public function created(BusinessUnit $businessUnit): void {}

    /**
     * Handle the BusinessUnit "updated" event.
     */
    public function updated(BusinessUnit $businessUnit): void {}

    /**
     * Handle the BusinessUnit "deleted" event.
     */
    public function deleted(BusinessUnit $businessUnit): void
    {
        //
    }

    /**
     * Handle the BusinessUnit "restored" event.
     */
    public function restored(BusinessUnit $businessUnit): void
    {
        //
    }

    /**
     * Handle the BusinessUnit "force deleted" event.
     */
    public function forceDeleted(BusinessUnit $businessUnit): void
    {
        //
    }

    private function global(BusinessUnit $businessUnit)
    {
        $businessUnit->name = titleCase($businessUnit->name);
    }
}
