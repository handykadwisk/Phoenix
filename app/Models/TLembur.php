<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TLembur extends Model
{
    use HasFactory;
    protected $primaryKey = 'LEMBUR_ID';

    protected $table = 't_lembur';

    protected $guarded = [
        'LEMBUR_ID',
    ];

    public $timestamps = false;

    protected $with = [
        // 'employee'
        'detail'
    ];

    // public function employee(): BelongsTo
    // {
    //     return $this->belongsTo(TEmployee::class, 'EMPLOYEE_ID');
    // }
    public function detail() {
        return $this->hasMany(MLemburDetail::class, 'LEMBUR_ID', 'LEMBUR_ID');
    }
}
