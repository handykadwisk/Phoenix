<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TMedical extends Model
{
    use HasFactory;
    protected $primaryKey = 'MEDICAL_ID';

    protected $table = 't_medical';

    protected $guarded = [
        'MEDICAL_ID',
    ];

    public $timestamps = false;

    protected $with = [
        'employee',
        'detail',
        'document'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'EMPLOYEE_ID');
    }

     public function detail() {
        return $this->hasMany(MMedicalDetail::class, 'MEDICAL_ID', 'MEDICAL_ID');
    }

    public function document() {
        return $this->hasMany(MMedicalDocument::class, 'MEDICAL_ID', 'MEDICAL_ID');
    }
}
