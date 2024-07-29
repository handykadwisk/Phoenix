<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashAdvanceCostClassification extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_COST_CLASSIFICATION_ID';

    protected $table = 'r_cash_advance_cost_classification';

    protected $guarded = ['CASH_ADVANCE_COST_CLASSIFICATION_ID'];
}
