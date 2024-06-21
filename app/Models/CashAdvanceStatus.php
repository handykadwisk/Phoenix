<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashAdvanceStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'ID';

    protected $table = 'r_cash_advance_status';

    protected $guarded = ['ID'];
}