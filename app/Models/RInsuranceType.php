<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RInsuranceType extends Model
{
    use HasFactory;
    protected $primaryKey = 'INSURANCE_TYPE_ID';

    protected $table = 'r_insurance_type';

    public $timestamps = false;
}
