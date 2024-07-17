<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TAddress extends Model
{
    use HasFactory;

    protected $primaryKey = 'ADDRESS_ID';

    protected $table = 't_address';

    protected $guarded = [
        'ADDRESS_ID',
    ];

    public $timestamps = false;
}
