<?php

namespace App\Services;

use App\Http\Requests\AccountingEntries\StoreAccountingEntryRequest;
use App\Models\AccountingEntries;
use App\Models\ChartAccount;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AccountingEntriesService
{
    /**
     *
     */
    public function store($attributes)
    {
        return  $accountingEntry = AccountingEntries::create([
            'chart_account_id' => $attributes->account_id,
            'amount' => $attributes->amount,
            'description' => $attributes->description,
            'entry_date' => Carbon::parse($attributes->entry_date),
        ]);
    }
}
