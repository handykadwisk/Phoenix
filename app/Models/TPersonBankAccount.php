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

    public $with = ['mForBank'];

    public $timestamps = false;

    public function mForBank() {
        return $this->hasMany(MForPersonBankAccount::class, 'PERSON_BANK_ACCOUNT_ID', 'PERSON_BANK_ACCOUNT_ID');
    }
}
