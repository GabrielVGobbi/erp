<?php

namespace App\Providers;

use App\Models\BusinessUnit;
use App\Observers\BusinessUnitObserver;
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
        $this->registerObservers();

        $this->registerLocale();

        Model::preventLazyLoading(!app()->isProduction());
    }

    private function registerLocale(): void
    {
        setlocale(LC_ALL, 'nl_NL');
        Carbon::setLocale('pt_BR');
        date_default_timezone_set('America/Sao_Paulo');
    }

    private function registerObservers(): void
    {
        BusinessUnit::observe(BusinessUnitObserver::class);
    }
}
