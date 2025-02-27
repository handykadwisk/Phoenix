<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RPaymentType extends Model
{
    use HasFactory;

    protected $primaryKey = 'PAYMENT_TYPE_ID';

    protected $table = 'r_payment_type';

    protected $guarded = ['PAYMENT_TYPE_ID'];

    public $timestamps = false;
}