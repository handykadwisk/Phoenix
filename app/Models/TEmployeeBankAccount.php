<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeBankAccount extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_BANK_ACCOUNT_ID';

    protected $table = 't_employee_bank_account';

    protected $guarded = [
        'EMPLOYEE_BANK_ACCOUNT_ID',
    ];

    public $with = ['mForBank','employee'];

    public $timestamps = false;

    public function mForBank() {
        return $this->hasMany(MForEmployeeBankAccount::class, 'EMPLOYEE_BANK_ACCOUNT_ID', 'EMPLOYEE_BANK_ACCOUNT_ID');
    }

    public function employee() {
        return $this->belongsTo(TEmployee::class, 'EMPLOYEE_ID');
    } 
}