<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCollectiveLeave extends Model
{
    use HasFactory;
    protected $primaryKey = 'COLLECTIVE_LEAVE_ID';

    protected $table = 't_collective_leave';

    protected $guarded = [
        'COLLECTIVE_LEAVE_ID',
    ];

    public $timestamps = false;

     protected $with = [
        'detail',
    ];
    
     public function detail() {
        return $this->hasMany(TCollectiveLeaveDetail::class, 'COLLECTIVE_LEAVE_ID', 'COLLECTIVE_LEAVE_ID');
    }
}
