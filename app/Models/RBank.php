<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RBank extends Model
{
    use HasFactory;

    protected $primaryKey = 'BANK_ID';

    protected $table = 'r_bank';

    protected $guarded = [
        'BANK_ID',
    ];

    public $timestamps = false;
}
