<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        setlocale(LC_ALL, 'nl_NL');
        Carbon::setLocale('pt_BR');
        date_default_timezone_set('America/Sao_Paulo');
        Model::preventLazyLoading(!app()->isProduction());
    }
}
