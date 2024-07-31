<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RAddressStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'ADDRESS_STATUS_ID';

    protected $table = 'r_address_status';

    public $timestamps = false;

    public $guarded = [
        'ADDRESS_STATUS_ID'
    ];
}
