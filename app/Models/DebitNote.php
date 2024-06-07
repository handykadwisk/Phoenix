<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DebitNote extends Model
{
    use HasFactory;

    protected $primaryKey = 'DEBIT_NOTE_ID';

    protected $table = 't_debit_note';

    public $timestamps = false;
    // public $with = ['policyInitialPremium', 'policyInstallment', 'insuranceType', 'relation'];
    protected $guarded = ['DEBIT_NOTE_ID'];
}
