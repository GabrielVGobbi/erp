<?php

declare(strict_types=1);

namespace App\Supports\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;

trait LogTrait
{
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly($this->getFillable())
            ->logOnlyDirty()
            ->useLogName(__singular($this->getTable()))
            ->setDescriptionForEvent(fn (string $eventName) => "logs.events.badge.{$eventName}")
            ->dontSubmitEmptyLogs();
    }

    public function logs()
    {
        return Activity::forSubject($this)
            ->with('causer')
            ->orderBy('id', 'desc')
            ->paginate(15, ['*'], 'logspage')->fragment('logspage');
    }

    public function setLog($attributes, User $user = null): void
    {
        $message = $attributes['message'] ?? $attributes;
        $description = $attributes['description'] ?? '';
        $icon = $attributes['description'] ?? '<i class="fa-solid fa-info text-primary"></i>';
        $route = $attributes['route'] ?? null;

        $routeAdmin = Route::has('admin.' . $this->getTable() . '.show') ? route('admin.' . $this->getTable() . '.show', $this->getKey()) : null;

        $routeWeb = Route::has($this->getTable() . '.show') ? route('admin.' . $this->getTable() . '.show', $this->getKey()) : (
            $route ?? null
        );

        _log(
            __singular($this->getTable()),
            $this,
            $user ? $user : auth()->user()->id,
            $this->getTable() . ".log.badge.$message",
            [
                'attributes' => $attributes,
                'routes' => [
                    'admin' => $routeAdmin,
                    'web' => $routeWeb
                ]
            ]
        );
    }
}
