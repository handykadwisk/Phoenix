<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCollectiveLeaveDetail extends Model
{
    use HasFactory;
    protected $primaryKey = 'COLLECTIVE_LEAVE_DETAIL_ID';

    protected $table = 't_collective_leave_detail';

    protected $guarded = [
        'COLLECTIVE_LEAVE_DETAIL_ID',
    ];

    public $timestamps = false;
}
