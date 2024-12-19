<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeOffMaster extends Model
{
    use HasFactory;
    protected $primaryKey = 'REQUEST_TIME_OFF_MASTER_ID';

    protected $table = 't_request_time_off_master';

    protected $guarded = [
        'REQUEST_TIME_OFF_MASTER_ID',
    ];

    public $timestamps = false;

    protected $with = [
        'employee',
        'requestTimeOff',
        'timeOffType',
        'document'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'EMPLOYEE_ID');
    }

    public function timeOffType(): BelongsTo
    {
        return $this->belongsTo(RTimeOffType::class, 'TIME_OFF_TYPE_ID');
    }

     public function requestTimeOff() {
        return $this->hasMany(TimeOff::class, 'REQUEST_TIME_OFF_MASTER_ID', 'REQUEST_TIME_OFF_MASTER_ID');
    }
    
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'FILE_ID');
    }
}
