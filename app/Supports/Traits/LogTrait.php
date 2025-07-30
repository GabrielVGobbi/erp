<?php

declare(strict_types=1);

namespace App\Supports\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;

trait LogTrait
{
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly($this->getFillable())
            ->logOnlyDirty()
            ->useLogName($this->resolveLogName())
            ->setDescriptionForEvent(fn(string $eventName) => "logs.events.badge.{$eventName}")
            ->dontSubmitEmptyLogs();
    }

    /**
     * Relacionamento de logs com paginação.
     */
    public function logs()
    {
        return Activity::forSubject($this)
            ->with('causer')
            ->orderByDesc('id')
            ->paginate(15, ['*'], 'logspage')
            ->fragment('logspage');
    }

    /**
     * Criação manual de log customizado.
     */
    public function setLog(array|string $attributes, ?User $user = null): void
    {
        if (is_string($attributes)) {
            $attributes = ['message' => $attributes];
        }

        $message     = $attributes['message']     ?? 'undefined';
        $description = $attributes['description'] ?? '';
        $icon        = $attributes['icon']        ?? '<i class="fa-solid fa-info text-primary"></i>';
        $route       = $attributes['route']       ?? null;

        $adminRoute  = $this->resolveRoute('admin', $this->getKey(), $route);
        $webRoute    = $this->resolveRoute('web', $this->getKey(), $route);

        _log(
            $this->resolveLogName(),
            $this,
            $user ?? (auth()->check() ? auth()->user() : null),
            "{$this->getTable()}.log.badge.{$message}",
            [
                'attributes' => $attributes,
                'routes'     => [
                    'admin' => $adminRoute,
                    'web'   => $webRoute,
                ],
                'description' => $description,
                'icon' => $icon,
            ]
        );
    }

    /**
     * Resolve nome de log amigável e seguro.
     */
    protected function resolveLogName(): string
    {
        return method_exists($this, 'logName')
            ? $this->logName()
            : __singular($this->getTable()) ?? $this->getTable();
    }

    /**
     * Resolve rotas admin/web com fallback seguro.
     */
    protected function resolveRoute(string $prefix, int|string $id, ?string $fallback = null): ?string
    {
        $baseRoute = $prefix === 'admin' ? "admin.{$this->getTable()}.show" : "{$this->getTable()}.show";

        return Route::has($baseRoute)
            ? route($baseRoute, $id)
            : $fallback;
    }
}
