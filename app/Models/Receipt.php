<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receipt extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'RECEIPT_ID';

    protected $table = 't_receipt';

    protected $guarded = ['RECEIPT_ID'];

    public $timestamps = false;

    protected $dates = ['deleted_at'];

    protected $with = ['relation_organization','currency','bank_account','status'];

    public function relation_organization(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'RECEIPT_RELATION_ORGANIZATION_ID');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(RCurrency::class, 'RECEIPT_CURRENCY_ID');
    }

    public function bank_account(): BelongsTo
    {
        return $this->belongsTo(RBankTransaction::class, 'RECEIPT_BANK_ID');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(RReceiptStatus::class, 'RECEIPT_STATUS');
    }
}