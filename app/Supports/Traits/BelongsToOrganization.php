<?php

declare(strict_types=1);

namespace App\Supports\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::creating(function ($model) {
            if (Auth::check() && empty($model->organization_id)) {
                $model->organization_id = Auth::user()->organization_id;
            }
        });

        static::addGlobalScope('organization', function (Builder $builder) {
            if (Auth::check()) {
                $builder->where($builder->getModel()->getTable() . '.organization_id', Auth::user()->organization_id);
            }
        });
    }

    public function scopeForOrganization(Builder $query, $organizationId = null): Builder
    {
        $organizationId = $organizationId ?? Auth::user()?->organization_id;
        return $query->where($this->getTable() . '.organization_id', $organizationId);
    }
}
