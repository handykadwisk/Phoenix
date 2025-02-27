<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MAddressEmployee extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_ADDRESS_EMPLOYEE_ID';

    protected $table = 'm_address_employee';

    protected $with = ['tAddress'];

    public $timestamps = false;

    public $guarded = [
        'M_ADDRESS_EMPLOYEE_ID'
    ];

    public function tAddress(){
        return $this->hasOne(TAddress::class, 'ADDRESS_ID', 'ADDRESS_ID');
    }
}
