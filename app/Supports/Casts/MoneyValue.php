<?php

namespace App\Supports\Casts;

use Illuminate\Support\Number;

class MoneyValue
{
    public function __construct(
        protected int|float $value,
        protected string $currency = 'BRL',
        protected string $locale = 'pt-BR'
    ) {}

    public function raw(): float
    {
        return $this->value;
    }

    public function formatted(): string
    {
        return Number::currency($this->value, $this->currency, $this->locale);
    }

    public function __toString(): string
    {
        return $this->formatted();
    }
}
