<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\FightsController;
use App\Http\Controllers\FightersController;
use App\Http\Controllers\DivisionsController;

Route::get('/events', [EventsController::class, 'index']);
Route::get('/events/{id}', [EventsController::class, 'get']);
Route::get('/events/{id}/fights', [EventsController::class, 'fightsByEvent']);
Route::get('/events/{id}/fighters', [EventsController::class, 'fightersByEvent']);

Route::get('/fights', [FightsController::class, 'index']);
Route::get('/fights/{id}', [FightsController::class, 'get']);

Route::get('/fighters', [FightersController::class, 'index']);
Route::get('/fighters/search', [FightersController::class, 'search']);
Route::get('/fighters/{id}', [FightersController::class, 'get']);
Route::get('/fighters/{id}/fights', [FightersController::class, 'fightsByFighter']);

Route::get('/divisions', [DivisionsController::class, 'index']);
Route::get('/divisions/{id}', [DivisionsController::class, 'get']);
Route::get('/divisions/{id}/fights', [DivisionsController::class, 'fightsByDivision']);
Route::get('/divisions/{id}/fighters', [DivisionsController::class, 'fightersByDivision']);
//->middleware('auth:sanctum')
