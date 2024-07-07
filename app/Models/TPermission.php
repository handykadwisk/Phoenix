<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPermission extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERMISSION_ID';

    protected $table = 't_permission';

    protected $guarded = [
        'PERMISSION_ID',
    ];

    public $timestamps = false;
}
