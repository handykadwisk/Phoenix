<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    public function index()
    {
        return Inertia::render('Receipt/Receipt');
    }
}