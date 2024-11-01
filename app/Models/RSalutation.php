<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RSalutation extends Model
{
    use HasFactory;

    protected $primaryKey = 'salutation_id';

    protected $table = 'r_salutation';

    protected $guarded = [
        'salutation_id',
    ];

    public $timestamps = false;
}
