<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RelationGroupController extends Controller
{
    public function index()
    {

        $xxx = "aaa";

        return Inertia::render('Group/Group', [
            'xxx' => $xxx,
        ]);
    }
}
