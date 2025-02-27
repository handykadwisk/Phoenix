<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RTaxStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'TAX_STATUS_ID';

    protected $table = 'r_tax_status';

    protected $guarded = [
        'TAX_STATUS_ID',
    ];

}
