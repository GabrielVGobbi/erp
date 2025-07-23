<?php

namespace App\Models;

use App\Casts\Currency;
use App\Supports\Traits\GenerateUuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountingEntries extends Model
{
    /** @use HasFactory<\Database\Factories\AccountingEntriesFactory> */
    use HasFactory, SoftDeletes, GenerateUuidTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'chart_account_id',
        'organization_id',
        'branch_id',
        'supplier_id',
        'posting_date',
        'voucher_type',
        'voucher_subtype',
        'voucher_number',
        'against_voucher_number',
        'partner_type',
        'partner',
        'project',
        'cost_center',
        'currency',
        'description',
        'remarks',
        'debit',
        'credit',
        'balance',
        'credit_foreign',
        'status',
        'is_opening_entry',
        'is_closing_entry',
        'is_system_generated',
        'posted_at',
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
            'posting_date' => 'date',
            'debit' => 'decimal:2',
            'credit' => 'decimal:2',
            'balance' => 'decimal:2',
            'debit_foreign' => 'decimal:2',
            'credit_foreign' => 'decimal:2',
            'exchange_rate' => 'decimal:6',
            'is_opening_entry' => 'boolean',
            'is_closing_entry' => 'boolean',
            'is_system_generated' => 'boolean',
            'posted_at' => 'datetime',
        ];
    }

    protected $appends = ['formatted_posting_date', 'formatted_debit', 'formatted_credit', 'formatted_balance'];

    // Relacionamentos
    public function chartAccount()
    {
        return $this->belongsTo(ChartAccount::class, 'chart_account_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Accessors
    public function getFormattedPostingDateAttribute()
    {
        return $this->posting_date ? $this->posting_date->format('d/m/Y') : null;
    }

    public function getFormattedDebitAttribute()
    {
        return $this->debit > 0 ? 'R$ ' . number_format($this->debit, 2, ',', '.') : 'R$ 0,00';
    }

    public function getFormattedCreditAttribute()
    {
        return $this->credit > 0 ? 'R$ ' . number_format($this->credit, 2, ',', '.') : 'R$ 0,00';
    }

    public function getFormattedBalanceAttribute()
    {
        return 'R$ ' . number_format($this->balance, 2, ',', '.');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('posting_date', [$startDate, $endDate]);
    }

    public function scopeByChartAccount($query, $chartAccountId)
    {
        return $query->where('chart_account_id', $chartAccountId);
    }

    public function scopeOpeningEntries($query)
    {
        return $query->where('is_opening_entry', true);
    }

    public function scopeClosingEntries($query)
    {
        return $query->where('is_closing_entry', true);
    }

    public function scopeRegularEntries($query)
    {
        return $query->where('is_opening_entry', false)->where('is_closing_entry', false);
    }

    // Métodos para cálculo de saldo
    public static function calculateBalance($chartAccountId, $startDate = null, $endDate = null)
    {
        $query = self::where('chart_account_id', $chartAccountId)
                    ->where('status', 'active');

        if ($startDate) {
            $query->where('posting_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('posting_date', '<=', $endDate);
        }

        $result = $query->selectRaw('
            SUM(debit) as total_debit,
            SUM(credit) as total_credit,
            SUM(debit - credit) as balance
        ')->first();

        return [
            'total_debit' => $result->total_debit ?? 0,
            'total_credit' => $result->total_credit ?? 0,
            'balance' => $result->balance ?? 0,
        ];
    }

    public static function getOpeningBalance($chartAccountId, $date)
    {
        return self::where('chart_account_id', $chartAccountId)
                  ->where('posting_date', '<', $date)
                  ->where('status', 'active')
                  ->selectRaw('SUM(debit - credit) as opening_balance')
                  ->value('opening_balance') ?? 0;
    }
}
