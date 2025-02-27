<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TAdditionalAllowance extends Model
{
    use HasFactory;
    protected $primaryKey = 'ADDITIONAL_ALLOWANCE_ID';

    protected $table = 't_additional_allowance';
    
    // protected $with = ['company'];

    protected $guarded = [
        'ADDITIONAL_ALLOWANCE_ID',
    ];

    public $timestamps = false;

    // public function company(){
    //     return $this->hasOne(TCompany::class, 'COMPANY_ID', 'COMPANY_ID');
    // }
}
