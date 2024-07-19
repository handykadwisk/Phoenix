<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAdditional;
use Illuminate\Support\Facades\Auth;

class UserAdditionalController extends Controller
{
    public function change_language (Request $request) {

        UserAdditional::where('user_id', $request->user_id)
                      ->update([
                        'user_language'                 => $request->lang,
                        'user_additional_updated_by'    => Auth::user()->id,
                        'user_additional_updated_date'  => now()
                      ]);

        return redirect()->back();

    }
}
