<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCurrency extends Model
{
    use HasFactory;
    protected $primaryKey = 'CURRENCY_ID';

    protected $table = 'r_currency';

    public $timestamps = false;
}
