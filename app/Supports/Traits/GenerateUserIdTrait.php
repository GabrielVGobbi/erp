<?php

declare(strict_types=1);

namespace App\Supports\Traits;

use Illuminate\Support\Str;

trait GenerateUserIdTrait
{
    public static function bootGenerateUserIdTrait(): void
    {
        static::creating(function ($model) {
            if (empty($model->user_id)) {
                $model->user_id = auth()->user()->id;
            }
        });
    }
}
