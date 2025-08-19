<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected static int $counter = 1;

    public function definition(): array
    {
        return [
            'name' => 'Projeto ' . self::$counter++,
        ];
    }
}
