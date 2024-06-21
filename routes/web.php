<?php

use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\RelationController;
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
    Route::post('/relation', [RelationController::class, 'store'])->name('relation.store');
    Route::post('/getMappingParent', [RelationController::class, 'get_mapping'])->name('relation.get_mapping');
    Route::get('/getRelation', [RelationController::class, 'getRelationJson'])->name('getRelation.getRelationJson');
    Route::post('/getSalutationById', [RelationController::class, 'getSalutation'])->name('getSalutationById.getSalutation');


    //Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');

    // Finance > Operasional
    Route::post('/getCA', [CashAdvanceController::class, 'getCA'])->name('getCA');
    Route::post('/getCA', [CashAdvanceController::class, 'getCADataForJSON'])->name('cashAdvance.getCADataForJSON');
    Route::get('/getCAById/{id}', [CashAdvanceController::class, 'getCAById'])->name('getCAById');
    Route::get('/cashAdvance', [CashAdvanceController::class, 'index'])->name('cashAdvance');
    Route::post('/cashAdvance', [CashAdvanceController::class, 'store'])->name('cashAdvance.store');
    Route::patch('/cashAdvanceApprove/{id}', [CashAdvanceController::class, 'approve'])->name('cashAdvance.approve');
    Route::patch('/cashAdvanceRevised/{id}', [CashAdvanceController::class, 'revised'])->name('cashAdvance.revised');
});

require __DIR__ . '/auth.php';