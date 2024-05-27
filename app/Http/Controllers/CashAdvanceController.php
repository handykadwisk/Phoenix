<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CashAdvanceController extends Controller
{
    public function index() 
    {
        // print_r("aa");die;
        return Inertia::render('CA/CashAdvance',[
            'aaa' => "Test"
        ]);
    }
}
