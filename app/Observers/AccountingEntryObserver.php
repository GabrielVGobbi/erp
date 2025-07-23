<?php

namespace App\Observers;

use App\Models\AccountingEntry;

class AccountingEntryObserver
{
    /**
     * Handle the AccountingEntry "created" event.
     */
    public function created(AccountingEntry $accountingEntry): void
    {
        //
    }

    /**
     * Handle the AccountingEntry "updated" event.
     */
    public function updated(AccountingEntry $accountingEntry): void
    {
        //
    }

    /**
     * Handle the AccountingEntry "deleted" event.
     */
    public function deleted(AccountingEntry $accountingEntry): void
    {
        //
    }

    /**
     * Handle the AccountingEntry "restored" event.
     */
    public function restored(AccountingEntry $accountingEntry): void
    {
        //
    }

    /**
     * Handle the AccountingEntry "force deleted" event.
     */
    public function forceDeleted(AccountingEntry $accountingEntry): void
    {
        //
    }
}
