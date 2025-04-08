<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Sherdog;
use App\Services\Cache;
use App\Services\DatabaseCache;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Cache::class, function ($app) {
            return new DatabaseCache();
        });
        $this->app->singleton(Sherdog::class, function ($app) {
            $cache = $app->make(Cache::class);
            return new Sherdog($cache);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
