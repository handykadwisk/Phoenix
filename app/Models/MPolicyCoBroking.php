<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyCoBroking extends Model
{
    use HasFactory;

    protected $primaryKey = 'CO_BROKING_ID';

    protected $table = 'm_policy_co_broking';

    public $timestamps = false;

    public $guarded = [
        'CO_BROKING_ID'
    ];
}
