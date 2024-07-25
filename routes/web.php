<?php

use App\Http\Controllers\DebitNoteController;
use App\Http\Controllers\EndorsementController;
use App\Http\Controllers\InsurancePanelController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\PolicyCoverageController;
use App\Http\Controllers\PolicyInsuredController;
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
    Route::get('/detailPolicy/{id}', [PolicyController::class, 'detailPolicy'])->name('detailPolicy');
    Route::post('/policy', [PolicyController::class, 'store'])->name('policy.store');
    Route::get('/getPolicy/{id}', [PolicyController::class, 'get_id'])->name('policy.get_id');
    Route::post('/getPolicy', [PolicyController::class, 'getPolicyDataForJSON'])->name('policy.getPolicyDataForJSON');
    Route::get('/getRelation/{id}', [PolicyController::class, 'getRelationById'])->name('policy.getRelationById');
    Route::patch('/editPolicy/{id}', [PolicyController::class, 'edit'])->name('policy.edit');
    Route::patch('/deactivatePolicy/{id}', [PolicyController::class, 'deactivate'])->name('policy.deactivate');

    // Insurance Panel
    Route::get('/insurancePanel', [InsurancePanelController::class, 'index'])->name('insurancePanel');
    Route::post('/insurancePanel', [InsurancePanelController::class, 'store'])->name('insurancePanel.store');
    Route::post('/insertManyInsurer', [InsurancePanelController::class, 'insertManyInsurer'])->name('insurancePanel.insertManyInsurer');
    Route::post('/editManyInsurer', [InsurancePanelController::class, 'editManyInsurer'])->name('insurancePanel.editManyInsurer');
    Route::get('/getInsurancePanel/{id}', [InsurancePanelController::class, 'get_id'])->name('insurancePanel.get_id');
    Route::post('/getInsurancePanel', [InsurancePanelController::class, 'getInsurancePanelJson'])->name('insurancePanel.getInsurancePanelJson');
    Route::patch('/editInsurancePanel/{id}', [InsurancePanelController::class, 'edit'])->name('insurancePanel.edit');
    Route::post('/getPremium', [InsurancePanelController::class, 'getPremium'])->name('insurancePanel.getPremium');
    Route::post('/getCurrency', [InsurancePanelController::class, 'getCurrency'])->name('insurancePanel.getCurrency');
    Route::get('/getPolicyInstallment/{id}', [InsurancePanelController::class, 'policyInstallment'])->name('insurancePanel.policyInstallment');
    Route::post('/getPremiumById', [InsurancePanelController::class, 'getPremiumById'])->name('insurancePanel.getPremiumById');
    Route::post('/getPremiumByCurrency', [InsurancePanelController::class, 'getPremiumByCurrency'])->name('insurancePanel.getPremiumByCurrency');
    Route::get('/getInsurancePanelByPremiumId/{id}', [InsurancePanelController::class, 'getInsurancePanelByPremiumId'])->name('insurancePanel.getInsurancePanelByPremiumId');
    Route::get('/insurancePanelByPolicyId/{id}', [InsurancePanelController::class, 'getInsurancPanelByPolicyId'])->name('insurancePanel.getInsurancPanelByPolicyId');
    Route::patch('/deactivateInsurer/{id}', [InsurancePanelController::class, 'deactivate'])->name('insurancePanel.deactivate');
    Route::delete('/deleteInsurer/{id}', [InsurancePanelController::class, 'destroy'])->name('insurancePanel.destroy');

    // Debit Note
    Route::get('/debitNote', [DebitNoteController::class, 'index'])->name('debitNote');
    // Route::get('/getPolicyInstallment/{id}', [DebitNoteController::class, 'policyInstallment'])->name('debitNote.policyInstallment');


    // Endorsement
    Route::get('/endorsement', [EndorsementController::class, 'index'])->name('endorsement');
    Route::post('/endorsement', [EndorsementController::class, 'store'])->name('endorsement.store');
    Route::post('/getEndorsement', [EndorsementController::class, 'getEndorsementDataForJSON'])->name('endorsement.getEndorsementDataForJSON');
    Route::get('/getEndorsement/{id}', [EndorsementController::class, 'get_id'])->name('endorsement.get_id');
    Route::get('/getEndorsementByPolicyId/{id}', [EndorsementController::class, 'getEndorsementByPolicyId'])->name('endorsement.getEndorsementByPolicyId');
    Route::patch('/editEndorsement/{id}', [EndorsementController::class, 'edit'])->name('endorsement.edit');
    Route::patch('/deactivateEndorsement/{id}', [EndorsementController::class, 'deactivate'])->name('endorsement.deactivate');
    Route::get('/getEndorsementInstallment/{id}', [EndorsementController::class, 'endorsementInstallment'])->name('endorsement.endorsementInstallment');

    // Policy Coverage Name
    Route::get('/getCoverageByPolicyId/{id}', [PolicyCoverageController::class, 'get_by_policy_id'])->name('policyCoverage.get_by_policy_id');
    Route::get('/getDataCoverage/{id}', [PolicyCoverageController::class, 'getDataCoverage'])->name('policyCoverage.getDataCoverage');
    Route::get('/getCoverageById/{id}', [PolicyCoverageController::class, 'getCoverageById'])->name('policyCoverage.getCoverageById');
    Route::post('/insertManyCoverage', [PolicyCoverageController::class, 'store'])->name('policyCoverage.store');
    Route::post('/editCoverage', [PolicyCoverageController::class, 'editCoverage'])->name('policyCoverage.editCoverage');

    // Policy Insured
    Route::post('/insertManyInsured', [PolicyInsuredController::class, 'store'])->name('policyInsured.store');
    Route::get('/getDataInsured/{id}', [PolicyInsuredController::class, 'getDataInsured'])->name('policyInsured.getDataInsured');
    Route::get('/getInsuredById/{id}', [PolicyInsuredController::class, 'getInsuredById'])->name('policyCoverage.getInsuredById');
    Route::post('/editInsured', [PolicyInsuredController::class, 'editInsured'])->name('policyCoverage.editInsured');
    
    
});

require __DIR__ . '/auth.php';
