<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPersonAddress extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_ADDRESS_ID';

    protected $table = 'm_person_address';

    protected $with = ['tAddress'];

    public $timestamps = false;

    public $guarded = [
        'PERSON_ADDRESS_ID'
    ];

    public function tAddress(){
        return $this->hasOne(TAddress::class, 'ADDRESS_ID', 'ADDRESS_ID');
    }
}
