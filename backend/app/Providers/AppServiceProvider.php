<?php

namespace App\Providers;

use App\Services\Cache;
use App\Services\DatabaseCache;
use App\Services\Sherdog;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Cache::class, fn($app) => new DatabaseCache);
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
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
