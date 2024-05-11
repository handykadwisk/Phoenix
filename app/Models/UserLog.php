<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    use HasFactory;

    protected $table = 't_user_log';

    protected $fillable = [
        'created_by',
        'action',
        'action_by'
    ];

    public $timestamps = false;
}
