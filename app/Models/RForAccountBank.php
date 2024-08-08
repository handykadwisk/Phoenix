<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RForAccountBank extends Model
{
    use HasFactory;

    protected $primaryKey = 'FOR_BANK_ACCOUNT_ID';

    protected $table = 'r_for_account_bank';

    protected $guarded = [
        'FOR_BANK_ACCOUNT_ID',
    ];

    public $timestamps = false;
}
