<?php

use App\Http\Controllers\DivisionsController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\FightersController;
use App\Http\Controllers\FightsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/users/devices', [UserController::class, 'listDevices']);
    Route::get('/users/devices/{id}', [UserController::class, 'getDevice'])->where('id', '[0-9]+');
    Route::post('/users/devices/{id}', [UserController::class, 'updateDevice'])->where('id', '[0-9]+');
    Route::delete('/users/devices/{id}', [UserController::class, 'deleteDevice'])->where('id', '[0-9]+');

    Route::get('/events', [EventsController::class, 'index']);
    Route::get('/events/upcoming', [EventsController::class, 'upcoming']);
    Route::get('/events/{id}', [EventsController::class, 'get'])->where('id', '[0-9]+');
    Route::get('/events/{id}/fights', [EventsController::class, 'fightsByEvent'])->where('id', '[0-9]+');
    Route::get('/events/{id}/fighters', [EventsController::class, 'fightersByEvent'])->where('id', '[0-9]+');

    Route::get('/fights', [FightsController::class, 'index']);
    Route::get('/fights/{id}', [FightsController::class, 'get'])->where('id', '[0-9]+');

    Route::get('/fighters', [FightersController::class, 'index']);
    Route::get('/fighters/search', [FightersController::class, 'search']);
    Route::get('/fighters/{id}', [FightersController::class, 'get'])->where('id', '[0-9]+');
    Route::get('/fighters/{id}/fights', [FightersController::class, 'fightsByFighter'])->where('id', '[0-9]+');
    Route::get('/fighters/{id}/streaks', [FightersController::class, 'streaks'])->where('id', '[0-9]+');
    Route::get('/fighters/{id}/records', [FightersController::class, 'records'])->where('id', '[0-9]+');

    Route::get('/divisions', [DivisionsController::class, 'index']);
    Route::get('/divisions/{id}', [DivisionsController::class, 'get'])->where('id', '[0-9]+');
    Route::get('/divisions/{id}/fights', [DivisionsController::class, 'fightsByDivision'])->where('id', '[0-9]+');
    Route::get('/divisions/{id}/fighters', [DivisionsController::class, 'fightersByDivision'])->where('id', '[0-9]+');
})->middleware('auth:sanctum');
