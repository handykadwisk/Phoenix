<?php

use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\CashAdvanceReportController;
use App\Http\Controllers\DebitNoteController;
use App\Http\Controllers\EndorsementController;
use App\Http\Controllers\InsurancePanelController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OtherExpensesController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\ReimburseController;
use App\Http\Controllers\RelationGroupController;
use App\Http\Controllers\TJobDescController;
use App\Http\Controllers\TPermissionController;
use App\Http\Controllers\TPersonController;
use App\Http\Controllers\TRelationAgentController;
use App\Http\Controllers\TRelationDivisionController;
use App\Http\Controllers\TRelationOfficeController;
use App\Http\Controllers\TRelationStructureController;
use App\Http\Controllers\UserAdditionalController;
use App\Models\TPermission;
use App\Models\TRelationAgent;
use App\Models\TRelationDivision;
use App\Models\TRelationStructure;
use App\Http\Controllers\PolicyCoverageController;
use App\Http\Controllers\PolicyInsuredController;
use App\Http\Controllers\PolicyPartnerController;
use App\Http\Controllers\RelationController;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\UserLog;
use App\Http\Middleware\Language;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest');

// TAMBAHKAN " ->middleware(Language:class) " di tiap route di class index saja
// Tidak perlu semua method ditambahkan middleware language, cukup di route yang memuat halaman pertama kali (biasanya class index)
// Di bawah/ route dashboard contoh penggunaannya.
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard')->middleware(Language::class);

Route::middleware('auth')->group(function () {
    // user additional
    Route::post('/user_additional/change_language', [UserAdditionalController::class, 'change_language'])->name('user_additional.change_language');

    // BR
    Route::get('/relation', [RelationController::class, 'index'])->name('relation');
    Route::post('/relation', [RelationController::class, 'store'])->name('relation.store');
    Route::post('/getMappingParent', [RelationController::class, 'get_mapping'])->name('relation.get_mapping');
    Route::post('/getRelation', [RelationController::class, 'getRelationJson'])->name('getRelation.getRelationJson');
    Route::post('/getPostSalutationById', [RelationController::class, 'getPostSalutation'])->name('getPostSalutationById.getPostSalutation');
    Route::post('/getPreSalutationById', [RelationController::class, 'getPreSalutation'])->name('getPreSalutationById.getPreSalutation');
    Route::get('/getRelation/{id}', [RelationController::class, 'getRelationById'])->name('relation.getRelationById');
    Route::patch('/editRelation/{id}', [RelationController::class, 'edit'])->name('relation.edit');
    Route::get('relation/detailRelation/{id}', [RelationController::class, 'detail'])->name('relation.detailRelation.detail');
    Route::post('/getRelationDetail', [RelationController::class, 'get_detail'])->name('getRelationDetail.get_detail');


    //Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');

    // Group
    Route::get('/relation/group', [RelationGroupController::class, 'index'])->name('relation/group');
    Route::post('/getRelationGroup', [RelationGroupController::class, 'getRelationGroupJson'])->name('getRelationGroup.getRelationGroupJson');
    Route::post('/relation/group', [RelationGroupController::class, 'store'])->name('group.store');
    Route::post('/getRelationById', [RelationGroupController::class, 'getRelationByIdGroup'])->name('getRelationById.getRelationByIdGroup');
    Route::get('/getGroup/{id}', [RelationGroupController::class, 'getGroupById'])->name('group.getGroupById');
    Route::get('/group/detailGroup/{id}', [RelationGroupController::class, 'detailGroup'])->name('group.detailGroup.Group');
    Route::post('/getRelationGroupDetail', [RelationGroupController::class, 'get_detail'])->name('getRelationGroupDetail.get_detail');
    Route::post('/getGroup', [RelationGroupController::class, 'get_group'])->name('getGroup.get_group');


    // Agent
    Route::get('/relation/agent', [TRelationAgentController::class, 'index'])->name('relation/agent');
    Route::post('/getRelationAgent', [TRelationAgentController::class, 'getRelationAgentJson'])->name('getRelationAgent.getRelationAgentJson');
    Route::post('/relation/agent', [TRelationAgentController::class, 'store'])->name('agent.store');
    Route::post('/getMRelationAgent', [TRelationAgentController::class, 'getMRelationAgent'])->name('getMRelationAgent.getMRelationAgent');
    Route::post('/getRelationAgentSelect', [TRelationAgentController::class, 'relationAgent'])->name('getRelationAgentSelect.relationAgent');
    Route::post('/addMRelationAgent', [TRelationAgentController::class, 'addMRelationAgent'])->name('addMRelationAgent.addMRelationAgent');
    Route::post('/deleteAgent', [TRelationAgentController::class, 'deleteAgent'])->name('deleteAgent.deleteAgent');


    // Person
    Route::post('/getPersons', [TPersonController::class, 'getPersonJson'])->name('getPersons.getPersonJson');
    Route::get('getPersonRelationship', [TPersonController::class, 'getDataPersonRelationship'])->name('getPersonRelationship.getDataPersonRelationship');
    Route::post('/person', [TPersonController::class, 'store'])->name('person.store');
    Route::post('/editPersons', [TPersonController::class, 'edit'])->name('editPersons.edit');
    Route::post('/getPersonDetail', [TPersonController::class, 'get_detail'])->name('getPersonDetail.get_detail');
    Route::post('/personEmployment', [TPersonController::class, 'addPersonEmployment'])->name('personEmployment.addPersonEmployment');
    Route::get('/getTaxStatus', [TPersonController::class, 'getTStatus'])->name('getTaxStatus.getTStatus');
    Route::post('/getStructurePerson', [TPersonController::class, 'getStructure'])->name('getStructurePerson.getStructure');
    Route::post('/getDivisionPerson', [TPersonController::class, 'getDivision'])->name('getDivisionPerson.getDivision');
    Route::post('/getOfficePerson', [TPersonController::class, 'getOffice'])->name('getOfficePerson.getOffice');
    Route::post('/getRBank', [TPersonController::class, 'getRBank'])->name('getRBank.getRBank');
    Route::post('/personStructureDivision', [TPersonController::class, 'addPersonStructureDivision'])->name('peronStructureDivision.addPersonStructureDivision');
    Route::post('/uploadFile', [TPersonController::class, 'uploadFile'])->name('uploadFile.uploadFile');
    Route::post('/addBankAccount', [TPersonController::class, 'addBankAccount'])->name('addBankAccount.addBankAccount');

    // Structure
    Route::post('/getStructure', [TRelationStructureController::class, 'getStructureJson'])->name('getStructure.getStructureJson');
    Route::post('/getGrade', [TRelationStructureController::class, 'getGrade'])->name('getGrade.getGrade');
    Route::post('/getStructureCombo', [TRelationStructureController::class, 'getStructureCombo'])->name('getStructureCombo.getStructureCombo');
    Route::post('/addStructure', [TRelationStructureController::class, 'store'])->name('addStructure.store');
    Route::post('/getStructureDetail', [TRelationStructureController::class, 'get_detail'])->name('getStructureDetail.get_detail');
    Route::post('/editStructure', [TRelationStructureController::class, 'edit'])->name('editStructure.edit');

    // Division
    Route::post('/getDivision', [TRelationDivisionController::class, 'getDivisionJson'])->name('getDivision.getDivisionJson');
    Route::post('/addDivision', [TRelationDivisionController::class, 'store'])->name('addDivision.store');
    Route::post('/getDivisionCombo', [TRelationDivisionController::class, 'getDivisionCombo'])->name('getDivisionCombo.getDivisionCombo');
    Route::post('/getDivisionDetail', [TRelationDivisionController::class, 'get_detail'])->name('getDivisionDetail.get_detail');
    Route::post('/editDivision', [TRelationDivisionController::class, 'edit'])->name('editDivision.edit');

    // Office
    Route::post('/getOffice', [TRelationOfficeController::class, 'getOfficeJson'])->name('getOffice.getOfficeJson');
    Route::post('/getLocationType', [TRelationOfficeController::class, 'getLocationType'])->name('getLocationType.getLocationType');
    Route::post('/getOfficeCombo', [TRelationOfficeController::class, 'getOfficeCombo'])->name('getOfficeCombo.getOfficeCombo');
    Route::post('/getWilayah', [TRelationOfficeController::class, 'get_wilayah'])->name('getWilayah.get_wilayah');
    Route::post('/getRegency', [TRelationOfficeController::class, 'get_regency'])->name('getRegency.get_regency');
    Route::post('/addAddress', [TRelationOfficeController::class, 'store'])->name('addAddress.store');
    Route::post('/getOfficeDetail', [TRelationOfficeController::class, 'get_detail'])->name('getOfficeDetail.get_detail');
    Route::post('/editOffice', [TRelationOfficeController::class, 'edit'])->name('editOffice.edit');

    // Job Desc
    Route::post('/getJobDesc', [TJobDescController::class, 'getJobDescJson'])->name('getJobDesc.getJobDescJson');
    Route::post('/getJobDescCombo', [TJobDescController::class, 'getJobDescCombo'])->name('getJobDescCombo.getJobDescCombo');
    Route::post('/addJobDesc', [TJobDescController::class, 'store'])->name('addJobDesc.store');
    Route::post('/getJobDescDetail', [TJobDescController::class, 'get_detail'])->name('getJobDescDetail.get_detail');
    Route::post('/editJobDesc', [TJobDescController::class, 'edit'])->name('editJobDesc.edit');

    //Menu
    Route::get('/setting/menu', [MenuController::class, 'index'])->name('setting/menu');
    Route::post('/getMenus', [MenuController::class, 'getMenusJson'])->name('getMenus.getMenusJson');
    Route::post('/setting/addMenu', [MenuController::class, 'store'])->name('addMenu.store');
    Route::post('/getMenuCombo', [MenuController::class, 'getMenuCombo'])->name('getMenuCombo.getMenuCombo');
    Route::post('/getMenuById', [MenuController::class, 'getMenuById'])->name('getMenuById.getMenuById');
    Route::post('/setting/editMenu', [MenuController::class, 'edit'])->name('editMenu.edit');

    // Permission
    Route::get('/setting/permission', [TPermissionController::class, 'index'])->name('setting/permission');
    Route::post('/getPermission', [TPermissionController::class, 'getPermissionJson'])->name('getPermission.getPermissionJson');
    Route::post('/setting/addPermission', [TPermissionController::class, 'store'])->name('addPermission.store');
    Route::post('/getPermissionById',  [TPermissionController::class, 'get_detail'])->name('getPermissionById.get_detail');
    Route::post('/setting/editPermission', [TPermissionController::class, 'edit'])->name('editPermission.store');

    // Role
    Route::get('/setting/role', [RoleController::class, 'index'])->name('setting/role');
    Route::post('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/setting/addRole', [RoleController::class, 'store'])->name('addRole.store');

    // Finance > Operasional

    // Get Count Cash Advance Status
    Route::get('/getCountCARequestStatus', [CashAdvanceController::class, 'getCountCARequestStatus'])->name('getCountCARequestStatus');
    Route::get('/getCountCAApprove1Status', [CashAdvanceController::class, 'getCountCAApprove1Status'])->name('getCountCAApprove1Status');
    Route::get('/getCountCAApprove2Status', [CashAdvanceController::class, 'getCountCAApprove2Status'])->name('getCountCAApprove2Status');
    Route::get('/getCountCAApprove3Status', [CashAdvanceController::class, 'getCountCAApprove3Status'])->name('getCountCAApprove3Status');
    Route::get('/getCountCAPendingReportStatus', [CashAdvanceController::class, 'getCountCAPendingReportStatus'])->name('getCountCAPendingReportStatus');
    Route::get('/getCountCANeedRevisionStatus', [CashAdvanceController::class, 'getCountCANeedRevisionStatus'])->name('getCountCANeedRevisionStatus');
    Route::get('/getCountCARejectStatus', [CashAdvanceController::class, 'getCountCARejectStatus'])->name('getCountCARejectStatus');

    // Get Count Cash Advance Report Status
    Route::get('/getCountCAReportRequestStatus', [CashAdvanceReportController::class, 'getCountCAReportRequestStatus'])->name('getCountCAReportRequestStatus');
    Route::get('/getCountCAReportApprove1Status', [CashAdvanceReportController::class, 'getCountCAReportApprove1Status'])->name('getCountCAReportApprove1Status');
    Route::get('/getCountCAReportApprove2Status', [CashAdvanceReportController::class, 'getCountCAReportApprove2Status'])->name('getCountCAReportApprove2Status');
    Route::get('/getCountCAReportApprove3Status', [CashAdvanceReportController::class, 'getCountCAReportApprove3Status'])->name('getCountCAReportApprove3Status');
    Route::get('/getCountCAReportNeedRevisionStatus', [CashAdvanceReportController::class, 'getCountCAReportNeedRevisionStatus'])->name('getCountCAReportNeedRevisionStatus');
    Route::get('/getCountCAReportRejectStatus', [CashAdvanceReportController::class, 'getCountCAReportRejectStatus'])->name('getCountCARejectStatus');
    Route::get('/getCountCAReportComplitedStatus', [CashAdvanceReportController::class, 'getCountCAReportComplitedStatus'])->name('getCountCAReportComplitedStatus');

    // Cash Advance
    Route::post('/getCA', [CashAdvanceController::class, 'getCA'])->name('cashAdvance.getCA');
    Route::get('/getCANumber', [CashAdvanceController::class, 'getCANumber'])->name('getCANumber');
    Route::get('/getCAById/{id}', [CashAdvanceController::class, 'getCAById'])->name('getCAById');
    Route::get('/cashAdvance', [CashAdvanceController::class, 'index'])->name('cashAdvance');
    Route::post('/cashAdvance', [CashAdvanceController::class, 'store'])->name('cashAdvance.store');
    Route::post('/cashAdvanceAddFiles', [CashAdvanceController::class, 'cash_advance_add_files'])->name('cashAdvance.report_cash_advance');
    Route::patch('/cashAdvanceApprove/{id}', [CashAdvanceController::class, 'cash_advance_approve'])->name('cashAdvance.approve');
    Route::post('/cashAdvanceRevised/{id}', [CashAdvanceController::class, 'cash_advance_revised'])->name('cashAdvance.revised');
    Route::patch('/cashAdvanceExecute/{id}', [CashAdvanceController::class, 'cash_advance_execute'])->name('cashAdvance.execute');
    Route::get('/cashAdvanceDownload/{id}/{key}', [CashAdvanceController::class, 'cash_advance_download'])->name('cashAdvance.download');

    // Cash Advance Report
    Route::post('/getCAReport', [CashAdvanceReportController::class, 'getCAReport'])->name('cashAdvance.getCAReport');
    Route::get('/getCAReportById/{id}', [CashAdvanceReportController::class, 'getCAReportById'])->name('getCAReportById');
    Route::get('/getCashAdvanceDifferents', [CashAdvanceReportController::class, 'getCashAdvanceDifferents'])->name('getCashAdvanceDifferents');
    Route::get('/getCashAdvanceApproval', [CashAdvanceReportController::class, 'getCashAdvanceApproval'])->name('getCashAdvanceApproval');
    Route::get('/getCashAdvanceMethod', [CashAdvanceReportController::class, 'getCashAdvanceMethod'])->name('getCashAdvanceMethod');
    Route::post('/cashAdvanceReport', [CashAdvanceReportController::class, 'cash_advance_report'])->name('cashAdvanceReport.cash_advance_report');
    Route::patch('/cashAdvanceReportApprove/{id}', [CashAdvanceReportController::class, 'cash_advance_report_approve'])->name('cashAdvanceReport.approve');
    Route::post('/cashAdvanceReportRevised/{id}', [CashAdvanceReportController::class, 'cash_advance_report_revised'])->name('cashAdvanceReport.revised');
    Route::post('/cashAdvanceReportExecute', [CashAdvanceReportController::class, 'cash_advance_report_execute'])->name('cashAdvanceReport.execute');
    Route::get('/cashAdvanceReportDownload/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_download'])->name('cashAdvanceReport.download');
    Route::get('/cashAdvanceReportProofOfDocumentDownload/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_proof_of_document_download'])->name('cashAdvanceReportProofOfDocument.download');

    // Get Count Reimburse Status
    Route::get('/getCountReimburseRequestStatus', [ReimburseController::class, 'getCountReimburseRequestStatus'])->name('getCountReimburseRequestStatus');
    Route::get('/getCountReimburseApprove1Status', [ReimburseController::class, 'getCountReimburseApprove1Status'])->name('getCountReimburseApprove1Status');
    Route::get('/getCountReimburseApprove2Status', [ReimburseController::class, 'getCountReimburseApprove2Status'])->name('getCountReimburseApprove2Status');
    Route::get('/getCountReimburseApprove3Status', [ReimburseController::class, 'getCountReimburseApprove3Status'])->name('getCountReimburseApprove3Status');
    Route::get('/getCountReimburseNeedRevisionStatus', [ReimburseController::class, 'getCountReimburseNeedRevisionStatus'])->name('getCountReimburseNeedRevisionStatus');
    Route::get('/getCountReimburseRejectStatus', [ReimburseController::class, 'getCountReimburseRejectStatus'])->name('getCountReimburseRejectStatus');
    Route::get('/getCountReimburseComplitedStatus', [ReimburseController::class, 'getCountReimburseComplitedStatus'])->name('getCountReimburseComplitedStatus');

    // Reimburse
    Route::post('/getReimburse', [ReimburseController::class, 'getReimburse'])->name('cashAdvance.getReimburse');
    Route::get('/getReimburseNumber', [ReimburseController::class, 'getReimburseNumber'])->name('getReimburseNumber');
    Route::get('/getReimburseById/{id}', [ReimburseController::class, 'getReimburseById'])->name('getReimburseById');
    Route::get('/getReimburseApproval', [ReimburseController::class, 'getReimburseApproval'])->name('getReimburseApproval');
    Route::get('/getReimburseNotes', [ReimburseController::class, 'getReimburseNotes'])->name('getReimburseNotes');
    Route::get('/getReimburseMethod', [ReimburseController::class, 'getReimburseMethod'])->name('getReimburseMethod');
    Route::get('/reimburse', [ReimburseController::class, 'index'])->name('reimburse');
    Route::post('/reimburse', [ReimburseController::class, 'store'])->name('reimburse.store');
    Route::patch('/reimburseApprove/{id}', [ReimburseController::class, 'approve'])->name('reimburse.approve');
    Route::post('/reimburseRevised', [ReimburseController::class, 'revised'])->name('reimburse.revised');
    Route::post('/reimburseExecute', [ReimburseController::class, 'execute'])->name('reimburse.execute');
    Route::get('/reimburseDownload/{id}/{key}', [ReimburseController::class, 'download'])->name('reimburse.download');
    Route::get('/reimburseProofOfDocumentDownload/{id}/{key}', [ReimburseController::class, 'reimburse_proof_of_document_download'])->name('reimburseProofOfDocument.download');

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


    // Partners
    Route::post('/insertPartners', [PolicyPartnerController::class, 'store'])->name('policyInsured.store');


});

require __DIR__ . '/auth.php';