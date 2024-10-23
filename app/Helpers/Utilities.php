<?php

namespace App\Helpers;

use App\Models\UserLog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

function user_log_create($description, $module, $moduleId)
{
    $user = Auth::user();

    if ($user) {
        return UserLog::create([
            'created_by' => $user->id,
            'action'     => json_encode([
                'description' => $description,
                'module'      => $module,
                'id'          => $moduleId
            ]),
            'action_by'  => $user->user_login,
        ]);
    }

    return null;
}

if (!function_exists('replace_special_characters')) {
    /**
     * Replace special characters in a string with a hyphen.
     *
     * @param string $str
     * @return string
     */
    
    function replace_special_characters($str)
    {
        return Str::of($str)->replaceMatches('/[`\~ !@#\$%\^&\*\(\)\+\=\<\>\{\}\[\]\?\/\:;]/', '-');
    }
}