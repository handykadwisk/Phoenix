<?php

namespace App\Helpers;

use Illuminate\Support\Str;

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