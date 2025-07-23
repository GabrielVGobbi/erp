<?php

namespace App\Casts;

use App\Supports\Casts\MoneyValue;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Support\Number;
use Cknow\Money\Money;
use Illuminate\Support\Facades\Log;

/*
$product = Product::find(1);
$product->price->raw(); // 12.50
$product->price->formatted(); // R$ 12,50
echo $product->price; // R$ 12,50
*/

class Currency implements CastsAttributes
{
    public function __construct(
        protected string $currency = 'BRL',
        protected string $locale = 'pt-BR'
    ) {}

    public function get($model, string $key, $value, array $attributes): MoneyValue
    {
        return new MoneyValue($value / 100, $this->currency, $this->locale);
    }

    public function set($model, string $key, $value, array $attributes): int
    {
        if ($value instanceof MoneyValue) {
            return (int) round($value->raw() * 100);
        }

        if (is_string($value) && str_contains($value, 'R$')) {
            return (int) valorToDec($value) * 100;
        }

        if (is_numeric($value)) {
            return (int) round($value * 100);
        }

        return valorToDec($value) * 100;
    }
}
