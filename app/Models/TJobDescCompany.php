<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TJobDescCompany extends Model
{
    use HasFactory;

    protected $primaryKey = 'COMPANY_JOBDESC_ID';

    protected $table = 't_job_desc_company';

    protected $guarded = [
        'COMPANY_JOBDESC_ID',
    ];

    public $timestamps = false;

    public function toCompany(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID' , 'COMPANY_ID');
    }

    public function parent()
    {
        return $this->belongsTo(TJobDescCompany::class, 'COMPANY_JOBDESC_PARENT_ID');
    }
}
