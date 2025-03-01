<?php

namespace App\Http\Controllers;

use App\Models\RCob;
use Illuminate\Http\Request;

class RCobController extends Controller
{
    //
    public function cobJson()
    {
        $cob = RCob::all();
        return response()->json($cob);
    }
}
