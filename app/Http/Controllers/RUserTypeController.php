<?php

namespace App\Http\Controllers;

use App\Models\RUserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RUserTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        
        return inertia('UserManagement/type');
    }

    public function getTypeJson()
    {
        $data = RUserType::get();
        Log::info($data);
        return response()->json($data);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // Log::info($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(RUserType $rUserType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RUserType $rUserType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RUserType $rUserType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RUserType $rUserType)
    {
        //
    }
}
