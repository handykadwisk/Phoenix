<?php

namespace App\Http\Controllers;

use App\Models\RCurrency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function getCurrency()
    { 
        $data = RCurrency::all();

        return response()->json($data);
    }
}