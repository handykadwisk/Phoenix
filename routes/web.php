<?php

use App\Http\Controllers\AdditionalAllowanceController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceSettingController;
use App\Http\Controllers\BankTransactionController;
use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\CashAdvanceReportController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\CoBrokingController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CollectiveLeaveController;
use App\Http\Controllers\DebitNoteController;
use App\Http\Controllers\EndorsementController;
use App\Http\Controllers\ExchangeRateBIController;
use App\Http\Controllers\ExchangeRateTaxController;
use App\Http\Controllers\InsurancePanelController;
use App\Http\Controllers\LemburController;
use App\Http\Controllers\MedicalController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MRelationFBIPKSController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\MilestoneController;
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
use App\Http\Controllers\RCobController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleAccesMenuController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RUserTypeController;
use App\Http\Controllers\ReportAttendanceController;
use App\Http\Controllers\RPaymentTypeController;
use App\Http\Controllers\TCompanyController;
use App\Http\Controllers\TCompanyDivisionController;
use App\Http\Controllers\TCompanyOfficeController;
use App\Http\Controllers\TCompanyStructureController;
use App\Http\Controllers\TEmployeeController;
use App\Http\Controllers\TimeOffController;
use App\Http\Controllers\TJobDescCompanyController;
use App\Http\Controllers\TDetailChatController;
use App\Http\Controllers\TReminderController;
use App\Http\Controllers\TJobpostController;
use App\Http\Controllers\TTagPluginProcessController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\WorkBookController;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\UserLog;
use App\Http\Middleware\Language;
use App\Mail\SendEmail;
use App\Models\RPaymentType;
use App\Models\TCompanyDivision;
use App\Models\TEmployee;
use Illuminate\Support\Facades\Mail;

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
    Route::get('/getAllRelations', [RelationController::class, 'getAllRelations'])->name('getAllRelations');
    Route::post('/relation', [RelationController::class, 'store'])->name('relation.store');
    Route::post('/getMappingParent', [RelationController::class, 'get_mapping'])->name('relation.get_mapping');
    Route::get('/getRelation', [RelationController::class, 'getRelationJson'])->name('getRelation.getRelationJson');
    Route::post('/getPostSalutationById', [RelationController::class, 'getPostSalutation'])->name('getPostSalutationById.getPostSalutation');
    Route::post('/getPreSalutationById', [RelationController::class, 'getPreSalutation'])->name('getPreSalutationById.getPreSalutation');
    Route::get('/getRelation/{id}', [RelationController::class, 'getRelationById'])->name('relation.getRelationById');
    Route::patch('/editRelation/{id}', [RelationController::class, 'edit'])->name('relation.edit');
    Route::get('relation/detailRelation/{id}', [RelationController::class, 'detail'])->name('relation.detailRelation.detail');
    Route::post('/getRelationDetail', [RelationController::class, 'get_detail'])->name('getRelationDetail.get_detail');
    Route::post('/getCekAbbreviation', [RelationController::class, 'getCekAbbreviation'])->name('getCekAbbreviation.getCekAbbreviation');
    Route::post('/getRelationAll', [RelationController::class, 'getRelationAll'])->name('getRelationAll.getRelationAll');
    Route::post('/getCorporatePIC', [RelationController::class, 'get_corporate'])->name('getCorporatePIC.get_corporate');
    Route::post('/editCorporatePIC', [RelationController::class, 'edit_corporate'])->name('editCorporatePIC.edit_corporate');
    Route::post('/getIndividuAKA', [RelationController::class, 'get_individu_aka'])->name('getIndividuAKA.get_individu_aka');
    Route::post('/editBankRelation', [RelationController::class, 'edit_bank'])->name('editBankRelation.edit_bank');
    Route::get('/getDocumentPKSAgent', [RelationController::class, 'getPKSAgentJson'])->name('getDocumentPKSAgent.getPKSAgentJson');
    Route::get('/getDocumentPKSFbi', [RelationController::class, 'getPKSFbiJson'])->name('getDocumentPKSFbi.getPKSFbiJson');
    Route::post('/editDocumentPks', [RelationController::class, 'edit_document_pks'])->name('editDocumentPks.edit_document_pks');
    Route::post('/getRelationClient', [RelationController::class, 'get_relation_client'])->name('getRelationClient.get_relation_client');

    //milestone
    Route::post('/addMilestone', [MilestoneController::class, 'store'])->name('addMilestone');
    Route::get('/getMilestoneById/{id}', [MilestoneController::class, 'getMilestoneById'])->name('getMilestoneById');
    Route::post('/deleteMilestone/{id}', [MilestoneController::class, 'deleteMilestone'])->name('deleteMilestone');
    Route::post('/editMilestone', [MilestoneController::class, 'edit'])->name('editMilestone');
    Route::post('/updateSequence', [MilestoneController::class, 'updateSequence'])->name('updateSequence');

    // Work Book
    Route::get('/workbook', [WorkBookController::class, 'index'])->name('workbook');
    Route::get('/getWorkbook', [WorkBookController::class, 'getWorkbookJson'])->name('getWorkbook.getWorkBookJson');
    Route::post('/storeWorkbook', [WorkBookController::class, 'store'])->name('storeWorkbook.storeWorkbook');
    Route::get('/workbookId/{id}', [WorkBookController::class, 'getWorkBookById'])->name('workbook.getWorkBookById');
    Route::post('/editWorkbook/{id}', [WorkBookController::class, 'edit'])->name('editWorkbook.edit');
    Route::post('/copyWorkbookMilestone/{id}', [WorkBookController::class, 'copyWorkbookMilestone'])->name('copyWorkbookMilestone.copyMilestone');

    // Claim
    Route::get('/claim', [ClaimController::class, 'index'])->name('claim');
    Route::get('/getClaim', [ClaimController::class, 'getClaimJson'])->name('getClaim.getClaimJson');
    Route::post('/addClaim', [ClaimController::class, 'store'])->name('addClaim.store');
    Route::post('/storeInsuredValue', [ClaimController::class, 'storeInsuredValue'])->name('revisiInsured.storeInsuredValue');
    Route::get('/getClaimById/{id}', [ClaimController::class, 'getClaimById'])->name('getClaimById.getClaimById');
    Route::post('/editClaim/{id}', [ClaimController::class, 'edit'])->name('editClaim.edit');
    Route::post('/deleteClaim/{id}', [ClaimController::class, 'delete'])->name('deleteClaim.delete');
    Route::post('/storeInsuredValue', [ClaimController::class, 'storeInsuredValue'])->name('storeInsuredValue.storeInsuredValue');

    // Class of Business
    Route::get('/cob', [RCobController::class, 'cobJson'])->name('cob');



    //Job Position
    Route::get('/jobpost', [TJobpostController::class, 'index'])->name('jobpost');
    Route::get('/getAllJobpost', [TJobpostController::class, 'getAllJobpost'])->name('getAllJobpost.getAllJobpost');
    Route::get('/getjobpost', [TJobpostController::class, 'getJobpostJson'])->name('getjobpost.getJobpostJson');
    Route::get('/getjobpost/{id}', [TJobpostController::class, 'getJobpostById'])->name('getJobpostById.getJobpostById');
    Route::post('/addJobpost', [TJobpostController::class, 'store'])->name('addJobpost.store');
    Route::get('/getJobpostById/{id}', [TJobpostController::class, 'getJobpostId'])->name('getJobpostById.getJobpostId');
    Route::get('/getJobpostByCom/{id}', [TJobpostController::class, 'getJobpostsByCompany'])->name('getJobpostByCom.getJobpostsByCompany');
    Route::get('/getJobpostByDiv', [TJobpostController::class, 'getDevJobpost'])->name('getJobpostByDiv.getDevJobpost');
    Route::get('/JobpostByDiv/{id}', [TJobpostController::class, 'getDevJobpostById'])->name('JobpostByDiv.getDevJobpostById');
    Route::post('/setJobpostStatus/{id}/{status}', [TJobpostController::class, 'setJobpostStatus'])->name('setJobpostStatus.setJobpostStatus');
    Route::post('/editJobpost', [TJobpostController::class, 'edit'])->name('editJobpost.edit');
    Route::get('/getJobpostByCompany', [TJobpostController::class, 'getJobpostByCompany'])->name('getJobpostByCompany.getJobpostByCompany');


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
    Route::post('/getMappingParentGroup', [RelationGroupController::class, 'get_mapping'])->name('getMappingParentGroup.get_mapping');
    Route::post('/getDetailSubGroupParent', [RelationGroupController::class, 'get_detail_group_parent'])->name('getDetailSubGroupParent.get_detail_group_parent');
    Route::post('/addSubGroup', [RelationGroupController::class, 'add_subGroup'])->name('addSubGroup.add_subGroup');
    Route::post('/getRelationNoGroup', [RelationGroupController::class, 'relation_nogroup'])->name('getRelationNoGroup.relation_nogroup');
    Route::post('/addRelation', [RelationGroupController::class, 'add_Relation'])->name('addRelation.add_Relation');
    Route::post('/getRelationChange', [RelationGroupController::class, 'relation_change'])->name('getRelationChange.relation_change');
    Route::post('/getSubGroupById', [RelationGroupController::class, 'subGroupById'])->name('getSubGroupById.subGroupById');
    Route::post('/changeSubGroup', [RelationGroupController::class, 'changeSubGroup'])->name('changeSubGroup.changeSubGroup');
    Route::post('/removeRelation', [RelationGroupController::class, 'remove_relation'])->name('removeRelation.remove_relation');
    Route::post('/editSubGroup', [RelationGroupController::class, 'edit_subgroup'])->name('editSubGroup.edit_subgroup');
    Route::post('/changeParent', [RelationGroupController::class, 'change_parent'])->name('changeParent.change_parent');
    Route::get('/getRelationGroupNew', [RelationGroupController::class, 'get_relation_group'])->name('getRelationGroupNew.get_relation_group');





    // Agent
    Route::get('/relation/agent', [TRelationAgentController::class, 'index'])->name('relation/agent');
    Route::get('/getRelationAgent', [TRelationAgentController::class, 'getRelationAgentJson'])->name('getRelationAgent.getRelationAgentJson');
    Route::post('/relation/agent', [TRelationAgentController::class, 'store'])->name('agent.store');
    Route::get('/getMRelationAgent', [TRelationAgentController::class, 'getMRelationAgent'])->name('getMRelationAgent.getMRelationAgent');
    Route::post('/getRelationAgentSelect', [TRelationAgentController::class, 'relationAgent'])->name('getRelationAgentSelect.relationAgent');
    Route::post('/addMRelationAgent', [TRelationAgentController::class, 'addMRelationAgent'])->name('addMRelationAgent.addMRelationAgent');
    Route::post('/deleteAgent', [TRelationAgentController::class, 'deleteAgent'])->name('deleteAgent.deleteAgent');

    // BAA
    Route::get('/relation/baa', [TRelationAgentController::class, 'index_baa'])->name('relation/baa');
    Route::get('/getBAA', [TRelationAgentController::class, 'getBAA'])->name('getBAA.getBAA');
    Route::get('/getMRelationBAA', [TRelationAgentController::class, 'getMRelationBAA'])->name('getMRelationBAA.getMRelationBAA');
    Route::post('/addMRelationBaa', [TRelationAgentController::class, 'addMRelationBaa'])->name('addMRelationBaa.addMRelationBaa');
    Route::post('/getRelationBaaSelect', [TRelationAgentController::class, 'relationBaa'])->name('getRelationBaaSelect.relationBaa');
    Route::post('/deleteBaa', [TRelationAgentController::class, 'deleteBaa'])->name('deleteBaa.deleteBaa');
    Route::post('/getRelationByIdPerson', [TRelationAgentController::class, 'getRelationByIdPerson'])->name('getRelationByIdPerson.getRelationByIdPerson');
    Route::get('/getPolicyByRelationId', [TRelationAgentController::class, 'getPolicyByRelationId'])->name('getPolicyByRelationId.getPolicyByRelationId');

    // FBI by PKS

    Route::get('/relation/fbipks', [MRelationFBIPKSController::class, 'index'])->name('relation/fbipks');
    Route::get('/getRelationFBI', [MRelationFBIPKSController::class, 'getRelationFBI'])->name('getRelationFBI.getRelationFBI');
    Route::get('/getMRelationFBI', [MRelationFBIPKSController::class, 'getMRelationFBI'])->name('getMRelationFBI.getMRelationFBI');
    Route::post('/getRelationFBISelect', [MRelationFBIPKSController::class, 'relationFbi'])->name('getRelationFBISelect.relationFbi');
    Route::post('/addMRelationFBI', [MRelationFBIPKSController::class, 'addMRelationFBI'])->name('addMRelationFBI.addMRelationFBI');
    Route::post('/deleteFBI', [MRelationFBIPKSController::class, 'deleteFBI'])->name('deleteFBI.deleteFBI');







    // Person
    Route::post('/getPersons', [TPersonController::class, 'getPersonJson'])->name('getPersons.getPersonJson');
    Route::get('getPersonRelationship', [TPersonController::class, 'getDataPersonRelationship'])->name('getPersonRelationship.getDataPersonRelationship');
    Route::get('getPersonRelationshipFamily', [TPersonController::class, 'getPersonRelationshipFamily'])->name('getPersonRelationshipFamily.getPersonRelationshipFamily');
    Route::post('/person', [TPersonController::class, 'store'])->name('person.store');
    Route::post('/editPersonRelation', [TPersonController::class, 'edit_person_relation'])->name('editPersonRelation.edit_person_relation');
    Route::post('/editPersons', [TPersonController::class, 'edit'])->name('editPersons.edit');
    Route::post('/getPersonDetail', [TPersonController::class, 'get_detail'])->name('getPersonDetail.get_detail');
    Route::post('/personEmployment', [TPersonController::class, 'addPersonEmployment'])->name('personEmployment.addPersonEmployment');
    Route::post('/editPersonEmployment', [TPersonController::class, 'editPersonEmployment'])->name('editPersonEmployment.editPersonEmployment');
    Route::get('/getTaxStatus', [TPersonController::class, 'getTStatus'])->name('getTaxStatus.getTStatus');
    Route::post('/getStructurePerson', [TPersonController::class, 'getStructure'])->name('getStructurePerson.getStructure');
    Route::post('/getDivisionPerson', [TPersonController::class, 'getDivision'])->name('getDivisionPerson.getDivision');
    Route::post('/getOfficePerson', [TPersonController::class, 'getOffice'])->name('getOfficePerson.getOffice');
    Route::post('/getRBank', [TPersonController::class, 'getRBank'])->name('getRBank.getRBank');
    Route::post('/personStructureDivision', [TPersonController::class, 'addPersonStructureDivision'])->name('peronStructureDivision.addPersonStructureDivision');
    Route::post('/uploadFile', [TPersonController::class, 'uploadFile'])->name('uploadFile.uploadFile');
    // Route::post('/addBankAccount', [TPersonController::class, 'addBankAccount'])->name('addBankAccount.addBankAccount');
    Route::post('/getDistrict', [TPersonController::class, 'get_district'])->name('getDistrict.get_district');
    Route::post('/getVillage', [TPersonController::class, 'get_village'])->name('getVillage.get_village');
    Route::post('/get_regency', [TPersonController::class, 'get_regency'])->name('get_regency.get_regency');
    Route::post('/getAddressStatus', [TPersonController::class, 'get_address_status'])->name('getAddressStatus.get_address_status');
    // Route::post('/addAddressPerson', [TPersonController::class, 'add_address_person'])->name('addAddressPerson.add_address_person');
    Route::post('/getPersonAddress', [TPersonController::class, 'getPersonAddress'])->name('getPersonAddress.getPersonAddress');
    Route::post('/detailAddress', [TPersonController::class, 'getDetailAddress'])->name('detailAddress.getDetailAddress');
    // Route::post('/editAddress', [TPersonController::class, 'editAddress'])->name('editAddress.geteditAddress');
    Route::post('/getEducationDegree', [TPersonController::class, 'getEducationDegree'])->name('getEducationDegree.getEducationDegree');
    // Route::post('/addEducationPerson', [TPersonController::class, 'add_education_degree'])->name('addEducationPerson.add_education_degree');
    // Route::post('/editEducationPerson', [TPersonController::class, 'edit_education_degree'])->name('editEducationPerson.add_education_degree');
    Route::post('/getQualification', [TPersonController::class, 'getQualification'])->name('getQualification.getQualification');
    // Route::post('/addCertificate', [TPersonController::class, 'add_Certificate'])->name('addCertificate.add_Certificate');
    // Route::post('/EditCertificate', [TPersonController::class, 'edit_Certificate'])->name('EditCertificate.edit_Certificate');
    // Route::post('/addDocumentPerson', [TPersonController::class, 'add_document'])->name('addDocumentPerson.add_document');
    // Route::post('/deleteDocument', [TPersonController::class, 'delete_document'])->name('deleteDocument.delete_document');
    Route::get('/downloadImage/{id}', [TPersonController::class, 'download_document'])->name('downloadImage.download_document');
    Route::post('/getForBankAccount', [TPersonController::class, 'getForBankAccount'])->name('getForBankAccount.getForBankAccount');
    Route::post('/getTPersonBank', [TPersonController::class, 'getTPersonBank'])->name('getTPersonBank.getTPersonBank');
    // Route::post('/editBankAccount', [TPersonController::class, 'editBankAccount'])->name('editBankAccount.editBankAccount');
    // Route::get('/downloadPersonDocument/{id}', [TPersonController::class, 'person_document_download'])->name('downloadPersonDocument.person_document_download');
    Route::post('/getIndividuRelation', [TPersonController::class, 'get_individu_relation'])->name('getIndividuRelation.get_individu_relation');
    Route::post('/addPic', [TPersonController::class, 'add_pic'])->name('addPic.add_pic');
    Route::post('/deletePerson', [TPersonController::class, 'delete_person'])->name('deletePerson.delete_person');
    Route::post('/getDataPic', [TPersonController::class, 'get_Data_Pic'])->name('getDataPic.get_Data_Pic');
    Route::post('/setStatusVip', [TPersonController::class, 'set_status_vip'])->name('setStatusVip.set_status_vip');
    Route::post('/setUnStatusVip', [TPersonController::class, 'set_unstatus_vip'])->name('setUnStatusVip.set_unstatus_vip');









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
    Route::get('/getMenusJson', [MenuController::class, 'getMenusJson'])->name('getMenus.getMenusJson');
    Route::post('/getMenus', [MenuController::class, 'getMenusJson'])->name('getMenus.getMenusJson');
    Route::post('/setting/addMenu', [MenuController::class, 'store'])->name('addMenu.store');
    Route::post('/getMenuCombo', [MenuController::class, 'getMenuCombo'])->name('getMenuCombo.getMenuCombo');
    Route::post('/getMenuById', [MenuController::class, 'getMenuById'])->name('getMenuById.getMenuById');
    Route::post('/setting/editMenu', [MenuController::class, 'edit'])->name('editMenu.edit');
    Route::post('/setting/editMenu', [MenuController::class, 'edit'])->name('editMenu.edit');
    Route::post(('/setting/changeSeqMenu'), [MenuController::class, 'updateMenuSequence'])->name('changeMenu.changeMenu');
    Route::get('/showMenu', [MenuController::class, 'showMenu'])->name('showMenu.showMenu');
    Route::post('/changeMenuStatus', [MenuController::class, 'changeMenuStatus'])->name('changeMenuStatus.changeMenuStatus');
    // Permission
    Route::get('/setting/permission', [TPermissionController::class, 'index'])->name('setting/permission');
    Route::get('/getPermission', [TPermissionController::class, 'getPermissionJson'])->name('getPermission.getPermissionJson');
    Route::post('/getPermission', [TPermissionController::class, 'getPermissionJson'])->name('getPermission.getPermissionJson');
    Route::post('/setting/addPermission', [TPermissionController::class, 'store'])->name('addPermission.store');
    Route::post('/getPermissionById',  [TPermissionController::class, 'get_detail'])->name('getPermissionById.get_detail');
    Route::post('/setting/editPermission', [TPermissionController::class, 'edit'])->name('editPermission.store');

    // Role
    Route::get('/setting/role', [RoleController::class, 'index'])->name('setting/role');
    Route::get('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/setting/addRole', [RoleController::class, 'store'])->name('addRole.store');
    Route::post('/getRoleById', [RoleController::class, 'getDetail'])->name('getRole.getRoleByidJson');

    // Role
    Route::get('/setting/role', [RoleController::class, 'index'])->name('setting/role');
    Route::post('/getRole', [RoleController::class, 'getRoleJson'])->name('getRole.getRoleJson');
    Route::post('/getAllRole', [RoleController::class, 'getRole'])->name('/getAllRole');
    Route::post('/getRoleById', [RoleController::class, 'getDetail'])->name('getRole.getRoleByidJson');
    Route::post('/setting/addRole', [RoleController::class, 'store'])->name('addRole.store');

    // access role menu
    Route::get('/getRoleAccessMenuByRoleId/{role_id}', [RoleAccesMenuController::class, 'getAccessMenuByRoleId'])->name('getRoleAccessMenuByRoleId.getMenuByRole');
    Route::post('/roleAccessMenu', [RoleAccesMenuController::class, 'store'])->name('roleAccessMenu.store');
    Route::post('/addAccessMenu/{role_id}', [RoleAccesMenuController::class, 'addAccessMenu'])->name('addAccessMenu.addAccessMenu');


    //role permission
    Route::get('/rolePermission/{role_id}', [RolePermissionController::class, 'getPermissionByRoleId'])->name('rolePermission.getPermissionByRoleId');
    Route::post('/rolePermission', [RolePermissionController::class, 'store'])->name('rolePermission.store');

    //settings/userManagement
    Route::post('/getUser', [UserManagementController::class, 'getUserJson'])->name('getUser.getUserJson');
    Route::get('/getUser', [UserManagementController::class, 'getUserJson'])->name('getUser');
    Route::get('/settings/user', [UserManagementController::class, 'index'])->name('settings/user');
    Route::post('/settings/addUser', [UserManagementController::class, 'store'])->name('settings/addUser.store');
    Route::get('/settings/getUserJson', [UserManagementController::class, 'getUserDataByMRole'])->name('settings/getUserJson.getUserJson');
    Route::post('/settings/getUserId/{id}', [UserManagementController::class, 'getUserDataById'])->name('settings/getUserId.getUserId');
    Route::post('/settings/UserId/{id}', [UserManagementController::class, 'dataById'])->name('settings/UserId.getUserId');
    Route::patch('/settings/userEdit/{id}', [UserManagementController::class, 'update'])->name('settings/userEdit.update');
    Route::patch('/settings/userResetPassword/{id}', [UserManagementController::class, 'resetPassword'])->name('settings/userResetPassword.resetPassword');
    Route::patch('/settings/userChangePassword/{id}', [UserManagementController::class, 'changePassword'])->name('settings/userChangePassword.changePassword');
    Route::get('/user', [UserManagementController::class, 'getAllUser'])->name('user.getAllUser');
    Route::get('/getAllCompany', [UserManagementController::class, 'getAllCompanyJson'])->name('getAllComapny.getAllCompanyJson');


    //setting/usertype
    Route::get('/settings/type', [RUserTypeController::class, 'index'])->name('type');
    // Route::get('/getType', [RUserTypeController::class, 'getTypeJson'])->name('getType');
    Route::post('/getType', [RUserTypeController::class, 'getTypeJson'])->name('getType.getTypeJson');

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

    Route::get('/getEmployeeBankAccount', [CashAdvanceController::class, 'getEmployeeBankAccount'])->name('cashAdvance.getEmployeeBankAccount');
    Route::get('/getCompanies', [CashAdvanceController::class, 'getCompanies'])->name('cashAdvance.getCompanies');

    // Cash Advance
    Route::get('/getCA', [CashAdvanceController::class, 'getCA'])->name('cashAdvance.getCA');
    Route::get('/getCANumber', [CashAdvanceController::class, 'getCANumber'])->name('getCANumber');
    Route::get('/getCAById/{id}', [CashAdvanceController::class, 'getCAById'])->name('getCAById');
    Route::get('/cashAdvance', [CashAdvanceController::class, 'index'])->name('cashAdvance');
    Route::post('/cashAdvance', [CashAdvanceController::class, 'store'])->name('cashAdvance.store');
    Route::post('/cashAdvanceAddFiles', [CashAdvanceController::class, 'cash_advance_add_files'])->name('cashAdvance.report_cash_advance');
    Route::patch('/cashAdvanceApprove', [CashAdvanceController::class, 'cash_advance_approve'])->name('cashAdvance.approve');
    Route::post('/cashAdvanceRevised/{id}', [CashAdvanceController::class, 'cash_advance_revised'])->name('cashAdvance.revised');
    Route::patch('/cashAdvanceExecute/{id}', [CashAdvanceController::class, 'cash_advance_execute'])->name('cashAdvance.execute');
    Route::get('/cashAdvanceDownload/{id}/{key}', [CashAdvanceController::class, 'cash_advance_download'])->name('cashAdvance.download');
    Route::get('/cashAdvanceDocReader/{id}/{key}', [CashAdvanceController::class, 'cash_advance_doc_reader'])->name('cashAdvanceDocReader.cash_advance_doc_reader');

    // Cash Advance Report
    Route::post('/getCAReport', [CashAdvanceReportController::class, 'getCAReport'])->name('cashAdvance.getCAReport');
    Route::get('/getCAReportById/{id}', [CashAdvanceReportController::class, 'getCAReportById'])->name('getCAReportById');
    Route::get('/getCashAdvanceDifference', [CashAdvanceReportController::class, 'getCashAdvanceDifference'])->name('getCashAdvanceDifference');
    Route::get('/getCashAdvanceApproval', [CashAdvanceReportController::class, 'getCashAdvanceApproval'])->name('getCashAdvanceApproval');
    Route::get('/getCashAdvanceMethod', [CashAdvanceReportController::class, 'getCashAdvanceMethod'])->name('getCashAdvanceMethod');
    Route::post('/cashAdvanceReport', [CashAdvanceReportController::class, 'cash_advance_report'])->name('cashAdvanceReport.cash_advance_report');
    Route::patch('/cashAdvanceReportApprove', [CashAdvanceReportController::class, 'cash_advance_report_approve'])->name('cashAdvanceReport.approve');
    Route::post('/cashAdvanceReportRevised/{id}', [CashAdvanceReportController::class, 'cash_advance_report_revised'])->name('cashAdvanceReport.revised');
    Route::post('/cashAdvanceReportExecute', [CashAdvanceReportController::class, 'cash_advance_report_execute'])->name('cashAdvanceReport.execute');
    Route::get('/cashAdvanceReportDownload/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_download'])->name('cashAdvanceReport.download');
    Route::get('/cashAdvanceReportProofOfDocumentDownload/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_proof_of_document_download'])->name('cashAdvanceReportProofOfDocument.download');
    Route::get('/cashAdvanceReportDocReader/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_doc_reader'])->name('cashAdvanceReport.cash_advance_doc_reader');
    Route::get('/cashAdvanceReportProofOfDocumentDocReader/{id}/{key}', [CashAdvanceReportController::class, 'cash_advance_report_proof_of_document_doc_reader'])->name('cashAdvanceReport.cash_advance_doc_reader');

    // Get Count Reimburse Status
    Route::get('/getCountReimburseRequestStatus', [ReimburseController::class, 'getCountReimburseRequestStatus'])->name('getCountReimburseRequestStatus');
    Route::get('/getCountReimburseApprove1Status', [ReimburseController::class, 'getCountReimburseApprove1Status'])->name('getCountReimburseApprove1Status');
    Route::get('/getCountReimburseApprove2Status', [ReimburseController::class, 'getCountReimburseApprove2Status'])->name('getCountReimburseApprove2Status');
    Route::get('/getCountReimburseApprove3Status', [ReimburseController::class, 'getCountReimburseApprove3Status'])->name('getCountReimburseApprove3Status');
    Route::get('/getCountReimburseNeedRevisionStatus', [ReimburseController::class, 'getCountReimburseNeedRevisionStatus'])->name('getCountReimburseNeedRevisionStatus');
    Route::get('/getCountReimburseRejectStatus', [ReimburseController::class, 'getCountReimburseRejectStatus'])->name('getCountReimburseRejectStatus');
    Route::get('/getCountReimburseComplitedStatus', [ReimburseController::class, 'getCountReimburseComplitedStatus'])->name('getCountReimburseComplitedStatus');

    // Reimburse
    Route::get('/getReimburse', [ReimburseController::class, 'getReimburse'])->name('cashAdvance.getReimburse');
    Route::get('/getReimburseNumber', [ReimburseController::class, 'getReimburseNumber'])->name('getReimburseNumber');
    Route::get('/getReimburseById/{id}', [ReimburseController::class, 'getReimburseById'])->name('getReimburseById');
    Route::get('/getReimburseApproval', [ReimburseController::class, 'getReimburseApproval'])->name('getReimburseApproval');
    Route::get('/getReimburseNotes', [ReimburseController::class, 'getReimburseNotes'])->name('getReimburseNotes');
    Route::get('/getReimburseMethod', [ReimburseController::class, 'getReimburseMethod'])->name('getReimburseMethod');
    Route::get('/reimburse', [ReimburseController::class, 'index'])->name('reimburse');
    Route::post('/reimburse', [ReimburseController::class, 'store'])->name('reimburse.store');
    Route::patch('/reimburseApprove', [ReimburseController::class, 'approve'])->name('reimburse.approve');
    Route::post('/reimburseRevised', [ReimburseController::class, 'revised'])->name('reimburse.revised');
    Route::post('/reimburseExecute', [ReimburseController::class, 'execute'])->name('reimburse.execute');
    Route::get('/reimburseDownload/{id}/{key}', [ReimburseController::class, 'download'])->name('reimburse.download');
    Route::get('/reimburseProofOfDocumentDownload/{id}/{key}', [ReimburseController::class, 'reimburse_proof_of_document_download'])->name('reimburseProofOfDocument.download');
    Route::get('/reimburseDocReader/{id}/{key}', [ReimburseController::class, 'reimburse_doc_reader'])->name('reimburseDocReader.reimburse_doc_reader');
    Route::get('/reimburseProofOfDocumentDocReader/{id}/{key}', [ReimburseController::class, 'reimburse_proof_of_document_doc_reader'])->name('reimburseProofOfDocumentDocReader.reimburse_proof_of_document_doc_reader');

    // Get Count Expenses Status
    Route::get('/getCountExpensesRequestStatus', [ExpensesController::class, 'getCountExpensesRequestStatus'])->name('getCountExpensesRequestStatus');
    Route::get('/getCountExpensesApprove1Status', [ExpensesController::class, 'getCountExpensesApprove1Status'])->name('getCountExpensesApprove1Status');
    Route::get('/getCountExpensesApprove2Status', [ExpensesController::class, 'getCountExpensesApprove2Status'])->name('getCountExpensesApprove2Status');
    Route::get('/getCountExpensesApprove3Status', [ExpensesController::class, 'getCountExpensesApprove3Status'])->name('getCountExpensesApprove3Status');
    Route::get('/getCountExpensesNeedRevisionStatus', [ExpensesController::class, 'getCountExpensesNeedRevisionStatus'])->name('getCountExpensesNeedRevisionStatus');
    Route::get('/getCountExpensesRejectStatus', [ExpensesController::class, 'getCountExpensesRejectStatus'])->name('getCountExpensesRejectStatus');
    Route::get('/getCountExpensesComplitedStatus', [ExpensesController::class, 'getCountExpensesComplitedStatus'])->name('getCountExpensesComplitedStatus');

    // Expenses
    Route::get('/getPaymentType', [RPaymentTypeController::class, 'getPaymentType'])->name('getPaymentType');
    Route::get('/getExpenses', [ExpensesController::class, 'getExpenses'])->name('cashAdvance.getExpenses');
    Route::get('/getExpensesNumber', [ExpensesController::class, 'getExpensesNumber'])->name('getExpensesNumber');
    Route::get('/getExpensesById/{id}', [ExpensesController::class, 'getExpensesById'])->name('getExpensesById');
    Route::get('/getExpensesApproval', [ExpensesController::class, 'getExpensesApproval'])->name('getExpensesApproval');
    Route::get('/getExpensesNotes', [ExpensesController::class, 'getExpensesNotes'])->name('getExpensesNotes');
    Route::get('/getExpensesMethod', [ExpensesController::class, 'getExpensesMethod'])->name('getExpensesMethod');
    Route::get('/expenses', [ExpensesController::class, 'index'])->name('expenses');
    Route::post('/expensesCreate', [ExpensesController::class, 'create'])->name('otherExpenses.create');
    Route::patch('/expensesApprove', [ExpensesController::class, 'approve'])->name('expenses.approve');
    Route::post('/expensesRevised', [ExpensesController::class, 'revised'])->name('expenses.revised');
    Route::post('/expensesExecute', [ExpensesController::class, 'execute'])->name('expenses.execute');
    Route::get('/expensesDownload/{id}/{key}', [ExpensesController::class, 'download'])->name('expenses.download');
    Route::get('/expensesProofOfDocumentDownload/{id}/{key}', [ExpensesController::class, 'expenses_proof_of_document_download'])->name('expensesProofOfDocument.download');
    Route::get('/expensesDocReader/{id}/{key}', [ExpensesController::class, 'expenses_doc_reader'])->name('expensesDocReader.expenses_doc_reader');
    Route::get('/expensesProofOfDocumentDocReader/{id}/{key}', [ExpensesController::class, 'expenses_proof_of_document_doc_reader'])->name('expensesProofOfDocumentDocReader.expenses_proof_of_document_doc_reader');

    // Approval Limit
    Route::get('/approvalLimit', [CashAdvanceController::class, 'index'])->name('approvalLimit');

    // Exchange Rate Tax
    Route::get('/getCurrenciesRateTax', [ExchangeRateTaxController::class, 'getCurrenciesRateTax'])->name('getCurrenciesRateTax');
    Route::get('/getExchangeRateTax', [ExchangeRateTaxController::class, 'getExchangeRateTax'])->name('getExchangeRateTax');
    Route::get('/getExchangeRateTaxById/{id}', [ExchangeRateTaxController::class, 'getExchangeRateTaxById'])->name('getExchangeRateTaxById');
    Route::get('/getExchangeRateTaxByDate/{date}', [ExchangeRateTaxController::class, 'getExchangeRateTaxByDate'])->name('getExchangeRateTaxByDate');
    Route::get('/getExchangeRateTaxDetailById/{id}', [ExchangeRateTaxController::class, 'getExchangeRateTaxDetailById'])->name('getExchangeRateTaxDetailById');
    Route::get('/exchangeRateTax', [ExchangeRateTaxController::class, 'index'])->name('exchangeRateTax');
    Route::post('/exchangeRateTaxAdd', [ExchangeRateTaxController::class, 'exchange_rate_tax_add'])->name('exchangeRateTax.add');
    Route::patch('/exchangeRateTaxEdit', [ExchangeRateTaxController::class, 'exchange_rate_tax_edit'])->name('exchangeRateTax.edit');
    Route::get('/exchangeRateTaxDownloadTemplate', [ExchangeRateTaxController::class, 'exchange_rate_tax_download_template'])->name('exchangeRateTaxDownloadTemplate');

    // Exchange Rate BI
    Route::get('/getCurrencies', [ExchangeRateBIController::class, 'getCurrencies'])->name('getCurrencies');
    Route::get('/getExchangeRateBI', [ExchangeRateBIController::class, 'getExchangeRateBI'])->name('getExchangeRateBI');
    Route::get('/getExchangeRateBIById/{id}', [ExchangeRateBIController::class, 'getExchangeRateBIById'])->name('getExchangeRateBIById');
    Route::get('/getExchangeRateBIByDate/{date}', [ExchangeRateBIController::class, 'getExchangeRateBIByDate'])->name('getExchangeRateBIByDate');
    Route::get('/getExchangeRateBIDetailById/{id}', [ExchangeRateBIController::class, 'getExchangeRateBIDetailById'])->name('getExchangeRateBIDetailById');
    Route::get('/exchangeRateBI', [ExchangeRateBIController::class, 'index'])->name('exchangeRateBI');
    Route::post('/exchangeRateBIAdd', [ExchangeRateBIController::class, 'exchange_rate_bi_add'])->name('exchangeRateBI.add');
    Route::patch('/exchangeRateBIEdit', [ExchangeRateBIController::class, 'exchange_rate_bi_edit'])->name('exchangeRateBI.edit');
    Route::get('/exchangeRateBIDownloadTemplate', [ExchangeRateBIController::class, 'exchange_rate_bi_download_template'])->name('exchangeRateBIDownloadTemplate');

    // Bank Transaction
    Route::get('/getBankTransaction', [BankTransactionController::class, 'getBankTransaction'])->name('getBankTransaction');
    Route::get('/getBankTransactionById/{id}', [BankTransactionController::class, 'getBankTransactionById'])->name('receipt.getBankTransactionById');
    Route::get('/bankTransaction', [BankTransactionController::class, 'index'])->name('bankTransaction');
    Route::get('/getBank', [BankTransactionController::class, 'getBank'])->name('bankTransaction.getBank');
    Route::get('/getCOABankTransaction', [BankTransactionController::class, 'getCOABankTransaction'])->name('bankTransaction.getCOABankTransaction');
    Route::post('/bankTransactionAdd', [BankTransactionController::class, 'add'])->name('bankTransaction.bankTransactionAdd');
    Route::patch('/bankTransactionEdit', [BankTransactionController::class, 'edit'])->name('bankTransaction.bankTransactionEdit');
    Route::patch('/bankTransactionDisableBank', [BankTransactionController::class, 'disable_bank'])->name('bankTransaction.bankTransactionDisableBank');

    // Currency
    Route::get('/getCurrency', [CurrencyController::class, 'getCurrency'])->name('getCurrency');

    // Receipt
    Route::get('/getClient', [ReceiptController::class, 'getClient'])->name('getClient');
    Route::get('/getBankAccount', [ReceiptController::class, 'getBankAccount'])->name('getBankAccount');
    Route::get('/getReceipt', [ReceiptController::class, 'getReceipt'])->name('receipt.getReceipt');
    Route::get('/getReceiptById/{id}', [ReceiptController::class, 'getReceiptById'])->name('receipt.getReceiptById');
    Route::get('/receipt', [ReceiptController::class, 'index'])->name('receipt');
    Route::post('/receiptAdd', [ReceiptController::class, 'add'])->name('receipt.add');
    Route::patch('/receiptDraft', [ReceiptController::class, 'draft'])->name('receipt.draft');
    Route::patch('/receiptEdit', [ReceiptController::class, 'edit'])->name('receipt.edit');
    Route::delete('/receiptDelete/{id}', [ReceiptController::class, 'delete'])->name('receipt.delete');


    // Bank Transaction
    Route::post('/getBankTransaction', [BankTransactionController::class, 'getBankTransaction'])->name('getBankTransaction');
    Route::get('/bankTransaction', [BankTransactionController::class, 'index'])->name('bankTransaction');

    // Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');
    Route::get('/detailPolicy/{id}', [PolicyController::class, 'detailPolicy'])->name('detailPolicy');
    Route::post('/policy', [PolicyController::class, 'store'])->name('policy.store');
    Route::get('/getPolicy/{id}', [PolicyController::class, 'get_id'])->name('policy.get_id');
    Route::post('/getPolicy', [PolicyController::class, 'getPolicyDataForJSON'])->name('policy.getPolicyDataForJSON');
    Route::get('/getRelation/{id}', [PolicyController::class, 'getRelationById'])->name('policy.getRelationById');
    Route::patch('/editPolicy/{id}', [PolicyController::class, 'edit'])->name('policy.edit');
    Route::patch('/deactivatePolicy/{id}', [PolicyController::class, 'deactivate'])->name('policy.deactivate');
    Route::get('/getPolicyForAgGrid', [PolicyController::class, 'getPolicyForAgGrid'])->name('getPolicyForAgGrid.getPolicyForAgGrid');

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

    // Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');
    Route::get('/detailPolicy/{id}', [PolicyController::class, 'detailPolicy'])->name('detailPolicy');
    Route::post('/policy', [PolicyController::class, 'store'])->name('policy.store');
    Route::get('/getPolicy/{id}', [PolicyController::class, 'get_id'])->name('policy.get_id');
    Route::post('/getPolicy', [PolicyController::class, 'getPolicyDataForJSON'])->name('policy.getPolicyDataForJSON');
    Route::get('/getRelation/{id}', [PolicyController::class, 'getRelationById'])->name('policy.getRelationById');
    Route::patch('/editPolicy/{id}', [PolicyController::class, 'edit'])->name('policy.edit');
    Route::patch('/deactivatePolicy/{id}', [PolicyController::class, 'deactivate'])->name('policy.deactivate');
    Route::get('/getCurrencyOnPolicyCoverage/{id}', [PolicyController::class, 'getCurrencyOnPolicyCoverage'])->name('policy.getCurrencyOnPolicyCoverage');

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
    Route::get('/getCoverageGroupingByPolicyId/{id}', [PolicyCoverageController::class, 'getCoverageGroupingByPolicyId'])->name('policyCoverage.getCoverageGroupingByPolicyId');
    Route::get('/getDataCoverage/{id}', [PolicyCoverageController::class, 'getDataCoverage'])->name('policyCoverage.getDataCoverage');
    Route::get('/getCoverageById/{id}', [PolicyCoverageController::class, 'getCoverageById'])->name('policyCoverage.getCoverageById');
    Route::post('/insertManyCoverage', [PolicyCoverageController::class, 'store'])->name('policyCoverage.store');
    Route::post('/editCoverage', [PolicyCoverageController::class, 'editCoverage'])->name('policyCoverage.editCoverage');
    Route::get('/getInterestInsured', [PolicyCoverageController::class, 'getInterestInsured'])->name('policyCoverage.getInterestInsured');
    Route::get('/getLossLimit', [PolicyCoverageController::class, 'getLossLimit'])->name('policyCoverage.getLossLimit');

    // Policy Insured
    Route::post('/insertManyInsured', [PolicyInsuredController::class, 'store'])->name('policyInsured.store');
    Route::get('/getDataInsured/{id}', [PolicyInsuredController::class, 'getDataInsured'])->name('policyInsured.getDataInsured');
    Route::get('/getInsuredById/{id}', [PolicyInsuredController::class, 'getInsuredById'])->name('policyCoverage.getInsuredById');
    Route::post('/getSummaryInsured', [PolicyInsuredController::class, 'getSummaryInsured'])->name('policyCoverage.getSummaryInsured');
    Route::post('/editInsured', [PolicyInsuredController::class, 'editInsured'])->name('policyCoverage.editInsured');
    Route::post('/getInsurerNettPremi', [PolicyInsuredController::class, 'getInsurerNettPremi'])->name('policyCoverage.getInsurerNettPremi');


    // Partners
    Route::post('/insertPartners', [PolicyPartnerController::class, 'store'])->name('policyPartner.store');
    Route::post('/editPartners', [PolicyPartnerController::class, 'editPartners'])->name('policyPartner.editPartners');
    Route::get('/getDataPartner/{id}', [PolicyPartnerController::class, 'getDataPartner'])->name('policyPartner.getDataPartner');
    Route::get('/getPolicyExchangeRate/{id}', [PolicyPartnerController::class, 'getPolicyExchangeRate'])->name('policyPartner.getPolicyExchangeRate');
    Route::get('/getRelationByType/{id}', [PolicyPartnerController::class, 'getRelationByType'])->name('policyPartner.getRelationByType');
    Route::get('/getPersonBaa/{id}', [PolicyPartnerController::class, 'getPersonBaa'])->name('policyPartner.getPersonBaa');
    Route::get('/getCoa', [PolicyPartnerController::class, 'getCoa'])->name('policyPartner.getCoa');

    Route::get('/getSummary/{id}', [PolicyPartnerController::class, 'getSummary'])->name('policyPartner.getSummary');
    Route::get('/getPksNumber/{id}', [PolicyPartnerController::class, 'getPksNumber'])->name('policyPartner.getPksNumber');
    Route::get('/getDefaultPayable/{id}', [PolicyPartnerController::class, 'getDefaultPayable'])->name('policyPartner.getDefaultPayable');

    // HR
    Route::get('hr/settingCompany', [TCompanyController::class, 'index'])->name('hr/settingCompany');
    Route::post('/addCompany', [TCompanyController::class, 'store'])->name('addCompany.store');
    Route::get('/getCompany', [TCompanyController::class, 'getCompanyJson'])->name('getCompany.getCompanyJson');
    Route::post('/getCompanyDetail', [TCompanyController::class, 'get_company_detail'])->name('getCompanyDetail.get_company_detail');
    Route::post('/editCompany', [TCompanyController::class, 'editStore'])->name('editCompany.editStore');
    Route::post('/getCompany', [TCompanyController::class, 'getCompany'])->name('getCompany.getCompany');

    // Employee
    Route::get('/getAllEmployee', [TEmployeeController::class, 'getAllEmployeeJson'])->name('getAllEmployee.');
    Route::get('/getEmployee', [TEmployeeController::class, 'getEmployeeJson'])->name('getEmployee.getEmployeeJson');
    Route::post('/addEmployee', [TEmployeeController::class, 'store'])->name('addEmployee.store');
    Route::post('/getDetailEmployee', [TEmployeeController::class, 'get_employeeById'])->name('getDetailEmployee.get_employeeById');
    Route::post('/editEmployee', [TEmployeeController::class, 'edit_Employee'])->name('editEmployee.edit_Employee');
    Route::post('/employmentEdit', [TEmployeeController::class, 'employmentEdit'])->name('employmentEdit.employmentEdit');
    Route::post('/getEmployeeDetail', [TEmployeeController::class, 'get_detail'])->name('getEmployeeDetail.get_detail');
    Route::post('/editEmployeeDetail', [TEmployeeController::class, 'editEmployeeDetail'])->name('editEmployeeDetail.editEmployeeDetail');
    Route::post('/addEducationPerson', [TEmployeeController::class, 'add_education_degree'])->name('addEducationPerson.add_education_degree');
    Route::post('/editEducationPerson', [TEmployeeController::class, 'edit_education_degree'])->name('editEducationPerson.add_education_degree');
    Route::post('/addCertificate', [TEmployeeController::class, 'add_Certificate'])->name('addCertificate.add_Certificate');
    Route::post('/EditCertificate', [TEmployeeController::class, 'edit_Certificate'])->name('EditCertificate.edit_Certificate');
    Route::post('/addDocumentPerson', [TEmployeeController::class, 'add_document'])->name('addDocumentPerson.add_document');
    Route::get('/downloadPersonDocument/{id}', [TEmployeeController::class, 'person_document_download'])->name('downloadPersonDocument.person_document_download');
    Route::post('/deleteDocument', [TEmployeeController::class, 'delete_document'])->name('deleteDocument.delete_document');
    Route::post('/addAddressPerson', [TEmployeeController::class, 'add_address_person'])->name('addAddressPerson.add_address_person');
    Route::post('/getEmployeeAddress', [TEmployeeController::class, 'getEmployeeAddress'])->name('getEmployeeAddress.getEmployeeAddress');
    Route::post('/editAddress', [TEmployeeController::class, 'editAddress'])->name('editAddress.editAddress');
    Route::post('/addBankAccount', [TEmployeeController::class, 'addBankAccount'])->name('addBankAccount.addBankAccount');
    Route::post('/editBankAccount', [TEmployeeController::class, 'editBankAccount'])->name('editBankAccount.editBankAccount');
    Route::post('/uploadProfile', [TEmployeeController::class, 'uploadProfile'])->name('uploadProfile.uploadProfile');





    // Company Structure
    Route::post('/getCompanyStructureCombo', [TCompanyStructureController::class, 'get_StructureCombo'])->name('getCompanyStructureCombo.get_StructureCombo');
    Route::post('/addCompanyStructure', [TCompanyStructureController::class, 'store'])->name('addCompanyStructure.store');
    Route::get('/getCompanyStructure', [TCompanyStructureController::class, 'getCompanyStructureJson'])->name('getCompanyStructure.getCompanyStructureJson');
    Route::post('/getCompanyStructureDetail', [TCompanyStructureController::class, 'get_CompanyStructureDetail'])->name('getCompanyStructureDetail.get_CompanyStructureDetail');
    Route::post('/editStructureCompany', [TCompanyStructureController::class, 'edit'])->name('editStructureCompany.edit');
    Route::post('/getStructureCompany', [TCompanyStructureController::class, 'getStructure'])->name('getStructureCompany.getStructure');


    // Company Division
    Route::get('/getDivisionCompany', [TCompanyDivisionController::class, 'getCompanyDivisionJson'])->name('getDivisionCompany.getCompanyDivisionJson');
    Route::get('/getAllDivisionCompany', [TCompanyDivisionController::class, 'getAllDivisionCompanyJson'])->name('getAllDivisionCompany.getAllDivisionCompanyJson');
    Route::post('/addDivisionCompany', [TCompanyDivisionController::class, 'store'])->name('addDivisionCompany.store');
    Route::post('/getDivisionComboCompany', [TCompanyDivisionController::class, 'getDivisionComboCompany'])->name('getDivisionComboCompany.getDivisionComboCompany');
    Route::post('/getDivisionDetailCompany', [TCompanyDivisionController::class, 'get_detail'])->name('getDivisionDetailCompany.get_detail');
    Route::post('/editDivisionCompany', [TCompanyDivisionController::class, 'edit'])->name('editDivisionCompany.edit');
    Route::post('/getComboDivision', [TCompanyDivisionController::class, 'getDivision'])->name('getComboDivision.getDivision');

    Route::post('/getComboDivision', [TCompanyDivisionController::class, 'getDivision'])->name('getComboDivision.getDivision');

    // Office
    Route::get('/getOfficeCompany', [TCompanyOfficeController::class, 'getOfficeCompanyJson'])->name('getOfficeCompany.getOfficeCompanyJson');
    // Route::post('/getLocationType', [TCompanyOfficeController::class, 'getLocationType'])->name('getLocationType.getLocationType');
    Route::post('/getOfficeComboCompany', [TCompanyOfficeController::class, 'getOfficeComboCompany'])->name('getOfficeComboCompany.getOfficeComboCompany');
    // Route::post('/getWilayah', [TCompanyOfficeController::class, 'get_wilayah'])->name('getWilayah.get_wilayah');
    // Route::post('/getRegency', [TCompanyOfficeController::class, 'get_regency'])->name('getRegency.get_regency');
    Route::post('/addAddressCompany', [TCompanyOfficeController::class, 'store'])->name('addAddressCompany.store');
    Route::post('/getOfficeCompanyDetail', [TCompanyOfficeController::class, 'get_detail'])->name('getOfficeCompanyDetail.get_detail');
    Route::post('/editOfficeCompany', [TCompanyOfficeController::class, 'edit'])->name('editOfficeCompany.edit');
    Route::post('/getComboOffice', [TCompanyOfficeController::class, 'getOffice'])->name('getComboOffice.getOffice');

    // Job Desc
    Route::get('/getJobDescCompany', [TJobDescCompanyController::class, 'getJobDescCompanyJson'])->name('getJobDescCompany.getJobDescCompanyJson');
    Route::get('/getJobDescCompany', [TJobDescCompanyController::class, 'getJobDescCompanyJson'])->name('getJobDescCompany.getJobDescCompanyJson');
    Route::post('/getJobDescCompanyCombo', [TJobDescCompanyController::class, 'getJobDescCompanyCombo'])->name('getJobDescCompanyCombo.getJobDescCompanyCombo');
    Route::post('/addJobDescCompany', [TJobDescCompanyController::class, 'store'])->name('addJobDescCompany.store');
    Route::post('/getJobDescCompanyDetail', [TJobDescCompanyController::class, 'get_detail'])->name('getJobDescCompanyDetail.get_detail');
    Route::post('/editJobDescCompany', [TJobDescCompanyController::class, 'edit'])->name('editJobDescCompany.edit');

    // Plugin Process
    Route::post('/getRPluginProcess', [TTagPluginProcessController::class, 'getPlugin'])->name('getRPluginProcess.getPlugin');
    Route::post('/addPluginProcess', [TTagPluginProcessController::class, 'store'])->name('addPluginProcess.store');
    Route::post('/getTPluginProcess', [TTagPluginProcessController::class, 'getTPlugin'])->name('getTPluginProcess.getTPlugin');

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance');
    Route::post('/saveClockIn', [AttendanceController::class, 'saveClockIn'])->name('attendance.saveClockIn');
    Route::post('/saveClockOut', [AttendanceController::class, 'saveClockOut'])->name('attendance.saveClockOut');
    Route::post('/getAttendanceByEmployeeIdAndDate', [AttendanceController::class, 'getAttendanceByEmployeeIdAndDate'])->name('attendance.getAttendanceByEmployeeIdAndDate');
    Route::post('/getMEmployeeAttendanceByEmployeeId', [AttendanceController::class, 'getMEmployeeAttendanceByEmployeeId'])->name('attendance.getMEmployeeAttendanceByEmployeeId');
    Route::post('/getAttendanceSettingById', [AttendanceController::class, 'getAttendanceSettingById'])->name('attendance.getAttendanceSettingById');

    // Message Chat
    Route::post('/getMessageChatByTypeId', [TDetailChatController::class, 'getMessage'])->name('getMessageChatByTypeId.getMessage');
    Route::post('/addChatMessage', [TDetailChatController::class, 'store'])->name('addChatMessage.store');
    Route::post('/getTypeChatByTagId', [TDetailChatController::class, 'getTypeChatByTagId'])->name('getTypeChatByTagId.getTypeChatByTagId');
    Route::post('/pinMessage', [TDetailChatController::class, 'pin_message'])->name('pinMessage.pin_message');
    Route::post('/pinMessageObject', [TDetailChatController::class, 'pinMessageObject'])->name('pinMessageObject.pinMessageObject');
    Route::post('/getChatPin', [TDetailChatController::class, 'getChatPin'])->name('getChatPin.getChatPin');
    Route::post('/getDataParticipant', [TDetailChatController::class, 'get_participant'])->name('getDataParticipant.get_participant');
    Route::post('/unPinMessageObject', [TDetailChatController::class, 'unPinMessageObject'])->name('unPinMessageObject.unPinMessageObject');
    Route::post('/getDataParticipantById', [TDetailChatController::class, 'getDataParticipantById'])->name('getDataParticipantById.getDataParticipantById');
    Route::post('/addParticipant', [TDetailChatController::class, 'add_participant'])->name('addParticipant.add_participant');
    Route::post('/removeParticipant', [TDetailChatController::class, 'remove_participant'])->name('removeParticipant.remove_participant');
    Route::post('/getDataChatDetailUser', [TDetailChatController::class, 'getDataChatDetailUser'])->name('getDataChatDetailUser.getDataChatDetailUser');
    Route::post('/actionUpdateReadMention', [TDetailChatController::class, 'actionUpdateReadMention'])->name('actionUpdateReadMention.actionUpdateReadMention');
    Route::post('/getDataPluginChat', [TDetailChatController::class, 'get_plugin_chat'])->name('getDataPluginChat.get_plugin_chat');
    Route::post('/getObjectChat', [TDetailChatController::class, 'get_object_chat'])->name('getObjectChat.get_object_chat');
    Route::post('/getDataChatDetailMention', [TDetailChatController::class, 'getDataChatDetailMention'])->name('getDataChatDetailMention.getDataChatDetailMention');
    Route::post('/getParticipantAll', [TDetailChatController::class, 'getParticipantAll'])->name('getParticipantAll.getParticipantAll');
    Route::post('/getSumMessageUnread', [TDetailChatController::class, 'get_message_unread'])->name('getSumMessageUnread.get_message_unread');
    Route::post('/getCekDetailChatRead', [TDetailChatController::class, 'get_message_cek_detail'])->name('getCekDetailChatRead.get_message_cek_detail');



    // Time Off
    Route::get('/timeOff', [TimeOffController::class, 'index'])->name('timeOff');
    Route::post('/getSubtitute', [TimeOffController::class, 'getSubtitute'])->name('timeOff.getSubtitute');
    Route::post('/getRequestTo', [TimeOffController::class, 'getRequestTo'])->name('timeOff.getRequestTo');
    // Route::post('/updatePolicyCoBroking', [CoBrokingController::class, 'updatePolicyCoBroking'])->name('policyCoBroking.updatePolicyCoBroking');
    // Route::get('/getCoBrokingByPolicyId/{policy_id}', [CoBrokingController::class, 'getCoBrokingByPolicyId'])->name('policyCoBroking.getCoBrokingByPolicyId');



    // Reminder
    Route::get('reminder', [TCompanyController::class, 'reminder'])->name('reminder');
    Route::post('/getReminderTier', [TReminderController::class, 'getReminderTier'])->name('getReminderTier.getReminderTier');
    Route::post('/getMethodNotification', [TReminderController::class, 'getMethodNotification'])->name('getMethodNotification.getMethodNotification');
    Route::post('/addReminder', [TReminderController::class, 'store'])->name('addReminder.addReminder');
    Route::post('/getTReminder', [TReminderController::class, 'get_reminder'])->name('getTReminder.getTReminder');
    Route::post('/getDetailReminder', [TReminderController::class, 'get_detail_reminder'])->name('getDetailReminder.get_detail_reminder');
    Route::patch('/editReminder/{id}', [TReminderController::class, 'edit'])->name('editReminder.edit');
    Route::post('/getReminderStart', [TReminderController::class, 'get_reminder_start'])->name('getReminderStart.get_reminder_start');
    Route::post('/getReminderEnd', [TReminderController::class, 'get_reminder_end'])->name('getReminderEnd.get_reminder_end');
    Route::post('/getCekDetailReminder', [TReminderController::class, 'get_detail_reminder_new'])->name('getCekDetailReminder.get_detail_reminder_new');


    // Report
    Route::get('/reportRelation', [ReportController::class, 'index'])->name('reportRelation');
    Route::post('/exportReportRelation', [ReportController::class, 'excelReportRelation'])->name('exportReportRelation.excelReportRelation');
});

require __DIR__ . '/auth.php';
