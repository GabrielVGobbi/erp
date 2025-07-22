<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:clear', function () {
    $this->call('config:clear');
    $this->call('route:clear');
    $this->call('event:clear');
    $this->call('view:clear');
    $this->call('cache:clear');
    $this->call('telescope:prune');
    $this->info('Todos os caches foram limpos com sucesso!');
})->purpose('Clear application caches');
