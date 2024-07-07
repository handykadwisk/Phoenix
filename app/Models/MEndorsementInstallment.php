<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MEndorsementInstallment extends Model
{
    use HasFactory;
    protected $primaryKey = 'ENDORSEMENT_INSTALLMENT_ID';

    protected $table = 'm_endorsement_installment';

    public $timestamps = false;

    protected $guarded = ['ENDORSEMENT_INSTALLMENT_ID'];
    
}
