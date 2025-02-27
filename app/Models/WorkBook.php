<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkBook extends Model
{
    //
    protected $table = 'r_workbook';
    protected $guarded = ['WORKBOOK_ID'];
    protected $primaryKey = 'WORKBOOK_ID';
    public $timestamps = false;

    protected $with = ['insurance', 'milestone'];

    public function insurance()
    {
        return $this->belongsTo(RInsuranceType::class, 'COB_ID', 'INSURANCE_TYPE_ID');
    }

    //define relationship with milestone
    public function milestone()
    {
        return $this->hasMany(Milestone::class, 'WORKBOOK_ID', 'WORKBOOK_ID')
            ->whereNull('MILESTONE_PARENT_ID') // Hanya parent milestones
            ->with('children') // Sertakan relasi children
            ->orderBy('MILESTONE_SEQUENCE', 'asc') // Urutkan berdasarkan sequence
            ->where('MILESTONE_IS_DELETED', 0); // Hanya yang belum dihapus
    }
}
