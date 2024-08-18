<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCompany extends Model
{
    use HasFactory;

    protected $primaryKey = 'COMPANY_ID';

    protected $table = 't_company';

    protected $guarded = [
        'COMPANY_ID',
    ];

    public $timestamps = false;
}
