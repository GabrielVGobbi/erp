<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingEntries extends Model
{
    /** @use HasFactory<\Database\Factories\AccountingEntriesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'chart_account_id',
        'type_voucher',
        'type_voucher_description',
        'debit',
        'credit',
        'balance',
        'at',
        'deleted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        //
    ];

     /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            //
        ];
    }

    protected $appends = [];

    public function ChartAccount()
    {
        return $this->belongsTo(ChartAccount::class, 'chart_account_id');
    }

}
