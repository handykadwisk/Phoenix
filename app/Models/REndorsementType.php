<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class REndorsementType extends Model
{
    use HasFactory;

    protected $primaryKey = 'ENDORSEMENT_TYPE_ID';

    protected $table = 'r_endorsement_type';

    public $timestamps = false;
}
