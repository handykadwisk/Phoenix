<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RMethodNotification extends Model
{
    use HasFactory;

    protected $primaryKey = 'METHOD_NOTIFICATION_ID';

    protected $table = 'r_method_notification';

    protected $guarded = [
        'METHOD_NOTIFICATION_ID',
    ];

    public $timestamps = false;
}
