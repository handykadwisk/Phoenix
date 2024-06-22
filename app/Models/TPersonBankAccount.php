<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonBankAccount extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_BANK_ACCOUNT_ID';

    protected $table = 't_person_bank_account';

    protected $guarded = [
        'PERSON_BANK_ACCOUNT_ID',
    ];

    public $timestamps = false;
}
