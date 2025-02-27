<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class COA extends Model
{
    use HasFactory;

    protected $primaryKey = 'COA_ID';

    protected $table = 'r_coa';

    protected $guarded = ['COA_ID'];

    public $timestamps = false;
}
