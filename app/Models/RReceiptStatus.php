<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RReceiptStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'RECEIPT_STATUS_ID';

    protected $table = 'r_receipt_status';

    protected $guarded = ['RECEIPT_STATUS_ID'];

    public $timestamps = false;
}
