<?php

use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OtherExpensesController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\ReimburseController;
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
    // Cash Advance
    
    // Route::post('/getCA', [CashAdvanceController::class, 'getCA'])->name('getCA');
    Route::post('/getCA', [CashAdvanceController::class, 'getCA'])->name('cashAdvance.getCA');
    Route::post('/getCAReport', [CashAdvanceController::class, 'getCAReport'])->name('cashAdvance.getCAReport');
    Route::get('/getCANumber', [CashAdvanceController::class, 'getCANumber'])->name('getCANumber');
    Route::get('/getCAById/{id}', [CashAdvanceController::class, 'getCAById'])->name('getCAById');
    Route::get('/getCAReportById/{id}', [CashAdvanceController::class, 'getCAReportById'])->name('getCAReportById');
    Route::get('/cashAdvance', [CashAdvanceController::class, 'index'])->name('cashAdvance');
    Route::post('/cashAdvance', [CashAdvanceController::class, 'store'])->name('cashAdvance.store');
    Route::post('/cashAdvanceReport', [CashAdvanceController::class, 'report_cash_advance'])->name('cashAdvance.report_cash_advance');
    Route::patch('/cashAdvanceApprove/{id}', [CashAdvanceController::class, 'approve'])->name('cashAdvance.approve');
    Route::patch('/cashAdvanceRevised/{id}', [CashAdvanceController::class, 'revised'])->name('cashAdvance.revised');
    Route::patch('/cashAdvanceExecute/{id}', [CashAdvanceController::class, 'execute'])->name('cashAdvance.execute');
    Route::get('/cashAdvanceDownload/{id}', [CashAdvanceController::class, 'download'])->name('cashAdvance.download');

    // Reimburse
    Route::post('/getReimburse', [ReimburseController::class, 'getReimburse'])->name('cashAdvance.getReimburse');
    Route::get('/getReimburseNumber', [ReimburseController::class, 'getReimburseNumber'])->name('getReimburseNumber');
    Route::get('/getReimburseById/{id}', [ReimburseController::class, 'getReimburseById'])->name('getReimburseById');
    Route::get('/reimburse', [ReimburseController::class, 'index'])->name('reimburse');
    Route::post('/reimburse', [ReimburseController::class, 'store'])->name('reimburse.store');
    Route::patch('/reimburseApprove/{id}', [ReimburseController::class, 'approve'])->name('reimburse.approve');
    Route::patch('/reimburseRevised/{id}', [ReimburseController::class, 'revised'])->name('reimburse.revised');
    Route::get('/reimburseDownload/{id}', [ReimburseController::class, 'download'])->name('reimburse.download');

    // Other Expenses
    Route::post('/getOtherExpenses', [OtherExpensesController::class, 'getOtherExpenses'])->name('cashAdvance.getOtherExpenses');
    Route::get('/getOtherExpensesNumber', [OtherExpensesController::class, 'getOtherExpensesNumber'])->name('getOtherExpensesNumber');
    Route::get('/getOtherExpensesById/{id}', [OtherExpensesController::class, 'getOtherExpensesById'])->name('getOtherExpensesById');
    Route::get('/otherExpenses', [OtherExpensesController::class, 'index'])->name('otherExpenses');
    Route::post('/otherExpenses', [OtherExpensesController::class, 'store'])->name('otherExpenses.store');
    Route::patch('/otherExpensesApprove/{id}', [OtherExpensesController::class, 'approve'])->name('otherExpenses.approve');
    Route::patch('/otherExpensesRevised/{id}', [OtherExpensesController::class, 'revised'])->name('otherExpenses.revised');
    Route::get('/otherExpensesDownload/{id}', [OtherExpensesController::class, 'download'])->name('otherExpenses.download');

    // Approval Limit
    Route::get('/approvalLimit', [CashAdvanceController::class, 'index'])->name('approvalLimit');
});

require __DIR__ . '/auth.php';