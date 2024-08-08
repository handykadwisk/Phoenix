<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RInterestInsured extends Model
{
    use HasFactory;
    protected $primaryKey = 'INTEREST_INSURED_ID';

    protected $table = 'r_interest_insured';

    public $timestamps = false;
}
