<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MCashAdvanceDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_DOCUMENT_ID';

    protected $table = 'm_cash_advance_document';

    protected $guarded = ['CASH_ADVANCE_DOCUMENT_ID'];

    public $timestamps = false;
}
