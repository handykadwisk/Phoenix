<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MBankAccountRelation extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_BANK_ACCOUNT_RELATION_ID';

    protected $table = 'm_bank_account_relation';

    public $timestamps = false;

    public $guarded = [
        'M_BANK_ACCOUNT_RELATION_ID'
    ];

    public $with = ['rBank'];

    public function rBank(){
        return $this->hasOne(RBank::class, 'BANK_ID', 'BANK_ID');
    }
}
