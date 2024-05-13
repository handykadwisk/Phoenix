<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\RelationController;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\UserLog;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // BR
    Route::get('/relation', [RelationController::class, 'index'])->name('relation');
    // policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');
    Route::post('/policy', [PolicyController::class, 'store'])->name('policy.store');
});

require __DIR__ . '/auth.php';
