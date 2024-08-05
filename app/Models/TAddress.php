<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TAddress extends Model
{
    use HasFactory;

    protected $primaryKey = 'ADDRESS_ID';

    protected $table = 't_address';

    protected $with = ['province', 'regency', 'district', 'village', 'addressStatus'];

    protected $guarded = [
        'ADDRESS_ID',
    ];

    public $timestamps = false;

    public function province(){
        return $this->hasOne(RWilayahKemendagri::class, 'kode', 'ADDRESS_PROVINCE');
    }
    public function regency(){
        return $this->hasOne(RWilayahKemendagri::class, 'kode_mapping', 'ADDRESS_REGENCY');
    }
    public function district(){
        return $this->hasOne(RWilayahKemendagri::class, 'kode_mapping', 'ADDRESS_DISTRICT');
    }
    public function village(){
        return $this->hasOne(RWilayahKemendagri::class, 'kode_mapping', 'ADDRESS_VILLAGE');
    }
    public function addressStatus(){
        return $this->hasOne(RAddressStatus::class, 'ADDRESS_STATUS_ID', 'ADDRESS_STATUS');
    }
    

}
