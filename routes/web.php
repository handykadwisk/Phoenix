<?php

use App\Http\Controllers\InsurancePanelController;
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

    // Group
    Route::get('/group', [GroupRelationController::class, 'index'])->name('group');

    // Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');
    Route::post('/policy', [PolicyController::class, 'store'])->name('policy.store');
    Route::get('/getPolicy/{id}', [PolicyController::class, 'get_id'])->name('policy.get_id');
    Route::post('/getPolicy', [PolicyController::class, 'getPolicyDataForJSON'])->name('policy.getPolicyDataForJSON');
    Route::patch('/editPolicy/{id}', [PolicyController::class, 'edit'])->name('policy.edit');
    Route::patch('/deactivatePolicy/{id}', [PolicyController::class, 'deactivate'])->name('policy.deactivate');

    // Insurance Panel
    Route::get('/insurancePanel', [InsurancePanelController::class, 'index'])->name('insurancePanel');
    Route::post('/insurancePanel', [InsurancePanelController::class, 'store'])->name('insurancePanel.store');
    Route::get('/getInsurancePanel/{id}', [InsurancePanelController::class, 'get_id'])->name('insurancePanel.get_id');
    Route::post('/getInsurancePanel', [InsurancePanelController::class, 'getInsurancePanelJson'])->name('insurancePanel.getInsurancePanelJson');
    Route::patch('/editInsurancePanel/{id}', [InsurancePanelController::class, 'edit'])->name('insurancePanel.edit');
    Route::get('/getInitialPremium/{id}', [InsurancePanelController::class, 'initialPremium'])->name('insurancePanel.initialPremium');
    
});

require __DIR__ . '/auth.php';
