<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RPluginProcess extends Model
{
    use HasFactory;

    protected $primaryKey = 'PLUGIN_PROCESS_ID';

    protected $table = 'r_plugin_process';

    protected $guarded = [
        'PLUGIN_PROCESS_ID',
    ];

    public $timestamps = false;
}
