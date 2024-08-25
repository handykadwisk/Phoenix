<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MForEmployeeBankAccount extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_FOR_EMPLOYEE_BANK_ACCOUNT_ID';

    protected $table = 'm_for_employee_bank_account';

    public $timestamps = false;

    public $with = ['forBank'];

    public $guarded = [
        'M_FOR_EMPLOYEE_BANK_ACCOUNT_ID'
    ];

    public function forBank() {
        return $this->hasOne(RForAccountBank::class, 'FOR_BANK_ACCOUNT_ID', 'FOR_BANK_ACCOUNT_ID');
    }
}
