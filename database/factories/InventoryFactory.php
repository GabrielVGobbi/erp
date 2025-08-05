<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'sku' => $this->faker->unique()->ean8(),
            'unit' => $this->faker->randomElement(['pcs', 'kg', 'ltr', 'box']),
            'ean' => $this->faker->ean13(),
            'code_ncm' => $this->faker->numerify('########'),
            'material_type' => $this->faker->randomElement(['raw', 'finished', 'semi-finished']),

            'length' => $this->faker->randomFloat(2, 1, 100),
            'width' => $this->faker->randomFloat(2, 1, 100),
            'height' => $this->faker->randomFloat(2, 1, 100),

            'cover' => $this->faker->imageUrl(),

            'stock' => $this->faker->randomFloat(2, 0, 1000),
            'opening_stock' => $this->faker->randomFloat(2, 0, 1000),
            'refueling_point' => $this->faker->randomFloat(2, 0, 100),

            'market_price' => $this->faker->numberBetween(0, 10000),
            'last_buy_price' => $this->faker->numberBetween(0, 10000),
            'sale_price' => $this->faker->numberBetween(0, 10000),
        ];
    }
}
