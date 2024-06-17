<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleAccessMenuController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\RelationGroupController;
use App\Http\Controllers\TPersonController;
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
    Route::post('/getRelation', [RelationController::class, 'getRelationJson'])->name('getRelation.getRelationJson');
    Route::post('/getSalutationById', [RelationController::class, 'getSalutation'])->name('getSalutationById.getSalutation');
    Route::get('/getRelation/{id}', [RelationController::class, 'getRelationById'])->name('relation.getRelationById');
    Route::patch('/editRelation/{id}', [RelationController::class, 'edit'])->name('relation.edit');
    Route::get('relation/detailRelation/{id}', [RelationController::class, 'detail'])->name('relation.detailRelation.detail');
    Route::post('/getRelationDetail', [RelationController::class, 'get_detail'])->name('getRelationDetail.get_detail');


    //Policy
    Route::get('/policy', [PolicyController::class, 'index'])->name('policy');

    // Group
    Route::get('group', [RelationGroupController::class, 'index'])->name('group');
    Route::post('/getRelationGroup', [RelationGroupController::class, 'getRelationGroupJson'])->name('getRelationGroup.getRelationGroupJson');
    Route::post('/group', [RelationGroupController::class, 'store'])->name('group.store');
    Route::post('/getRelationById', [RelationGroupController::class, 'getRelationByIdGroup'])->name('getRelationById.getRelationByIdGroup');
    Route::get('/getGroup/{id}', [RelationGroupController::class, 'getGroupById'])->name('group.getGroupById');
    Route::get('/group/detailGroup/{id}', [RelationGroupController::class, 'detailGroup'])->name('group.detailGroup.Group');
    Route::post('/getRelationGroupDetail', [RelationGroupController::class, 'get_detail'])->name('getRelationGroupDetail.get_detail');
    Route::post('/getGroup', [RelationGroupController::class, 'get_group'])->name('getGroup.get_group');

    // Person
    Route::post('/getPersons', [TPersonController::class, 'getPersonJson'])->name('getPersons.getPersonJson');
    Route::get('getPersonRelationship', [TPersonController::class, 'getDataPersonRelationship'])->name('getPersonRelationship.getDataPersonRelationship');
    Route::post('/person', [TPersonController::class, 'store'])->name('person.store');
    Route::post('/getPersonDetail', [TPersonController::class, 'get_detail'])->name('getPersonDetail.get_detail');
    Route::post('/personEmployment', [TPersonController::class, 'addPersonEmployment'])->name('personEmployment.addPersonEmployment');
    Route::get('/getTaxStatus', [TPersonController::class, 'getTStatus'])->name('getTaxStatus.getTStatus');


});

require __DIR__ . '/auth.php';
