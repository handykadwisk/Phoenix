<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RBankTransaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'BANK_TRANSACTION_ID';

    protected $table = 'r_bank_transaction';

    protected $guarded = ['BANK_TRANSACTION_ID'];

    public $timestamps = false;

    protected $with = ['bank','currency'];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(RBank::class, 'BANK_ID', 'BANK_ID');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(RCurrency::class, 'BANK_TRANSACTION_CURRENCY_ID');
    }
}