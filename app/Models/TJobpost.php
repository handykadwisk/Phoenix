<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TJobpost extends Model
{
    use HasFactory;

    protected $primaryKey = 'jobpost_id';

    protected $table = 't_job_posts';
    public $timestamps = false;

    protected $guarded = [
        'jobpost_id',
    ];

    public $with = ['children', 'company_division'];

    public function jobpost()
    {
        return $this->hasMany(TJobpost::class, 'jobpost_parent', 'jobpost_id');
    }
    public function children() {
        return $this->hasMany(TJobpost::class, 'jobpost_parent');
    }
    public function parent()
    {
        return $this->belongsTo(TJobpost::class, 'jobpost_id');
    }
    public function company_division()
    {
        return $this->belongsTo(TCompanyDivision::class, 'company_division_id');
    }

}
