<?php

namespace App\Modules\Compras\Models;

use App\Models\User;
use App\Modules\Compras\Supports\Enums\PurchaseCategory;
use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;
use App\Modules\Compras\Supports\Traits\Purchases\PurchaseTrait;
use App\Supports\Traits\GenerateUserIdTrait;
use App\Supports\Traits\GenerateUuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PurchaseRequisition extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseRequisitionFactory> */
    use HasFactory, GenerateUserIdTrait, GenerateUuidTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'responsible_buyer_id',
        'order',
        'observations',
        'terms_and_conditions',
        'category',
        'at',
        'delivery_forecast',
        'order_request',
        'under_negotiation_at',
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
            'category' => PurchaseCategory::class,
            'status' => PurchaseRequisitionStatus::class,
            'delivery_forecast' => 'datetime',
            'at' => 'datetime',
            'under_negotiation_at' => 'datetime',
        ];
    }

    protected $appends = ['OrderBadge'];

    public function requisitor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getOrderBadgeAttribute()
    {
        $span = '<span class="badge badge-phoenix fs-10 badge-phoenix-%s">
                %s
                <i class="%s mx-1"></i>
            </span>';

        if (!empty($this->order_request)) {
            return sprintf(
                $span,
                'success',
                'Pedido Feito',
                'fa-solid fa-check',
            );
        }

        return sprintf(
            $span,
            'warning',
            'Pedido não feito',
            'fa-solid fa-circle-exclamation',
        );
    }

    /**
     * Verifica se pode atualizar o status da requisição
     */
    public function canUpdate(PurchaseRequisitionStatus $newStatus): bool
    {
        return $this->status->canTransitionTo($newStatus);
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            // Busca o último número já salvo
            $lastOrder = self::orderBy('order_number', 'desc')->first();

            $nextNumber = $lastOrder
                ? intval($lastOrder->order_number) + 1
                : 1;

            // Formata com zeros à esquerda (mínimo 4 dígitos)
            $model->order_number = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
            $model->order = $nextNumber ?? 1;
            $model->at = now();
        });
    }
}
