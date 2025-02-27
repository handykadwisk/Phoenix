<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MInsurerCoverage extends Model
{
    use HasFactory;
    protected $primaryKey = 'INSURER_COVERAGE_ID';
    protected $table = 'm_insurer_coverage';

    public $timestamps = false;
    // public $with = ['currency'];

    protected $guarded = ['INSURER_COVERAGE_ID'];
}
