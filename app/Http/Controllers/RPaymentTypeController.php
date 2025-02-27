<?php

namespace App\Http\Controllers;

use App\Models\RPaymentType;
use Illuminate\Http\Request;

class RPaymentTypeController extends Controller
{
    public function getPaymentType()
    {
        $data = RPaymentType::all();

        return response()->json($data);
    }
}