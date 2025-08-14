<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'sku',
        'unit',
        'ean',
        'code_ncm',
        'material_type',
        'length',
        'width',
        'height',
        'cover',
        'stock',
        'opening_stock',
        'refueling_point',
        'market_price',
        'last_buy_price',
        'sale_price',
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

    public function scopeSearchable($query, $term)
    {
        return $query->where(function ($query) use ($term) {
            $query->where('name', 'like', '%' . $term . '%');
            $query->orWhere('sku', 'like', '%' . $term . '%');
            $query->orWhere('ean', 'like', '%' . $term . '%');
            $query->orWhere('code_ncm', 'like', '%' . $term . '%');
            $query->orWhere('material_type', 'like', '%' . $term . '%');
        });
    }
}
