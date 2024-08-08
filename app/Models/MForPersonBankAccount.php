<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MForPersonBankAccount extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_FOR_PERSON_BANK_ACCOUNT';

    protected $table = 'm_for_person_bank_account';

    public $timestamps = false;

    public $with = ['forBank'];

    public $guarded = [
        'M_FOR_PERSON_BANK_ACCOUNT'
    ];

    public function forBank() {
        return $this->hasOne(RForAccountBank::class, 'FOR_BANK_ACCOUNT_ID', 'FOR_BANK_ACCOUNT_ID');
    }
}
