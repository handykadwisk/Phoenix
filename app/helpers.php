<?php

use App\Models\MPolicyCoBroking;

function getCoBrokingByPolicyId($policy_id = ""){
    $coBroking = MPolicyCoBroking::where('POLICY_ID', $policy_id)->get();
    return $coBroking; 
}