<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TTagPluginProcess extends Model
{
    use HasFactory;

    protected $primaryKey = 'TAG_PLUGIN_PROCESS_ID';

    protected $table = 't_tag_plugin_process';

    protected $guarded = [
        'TAG_PLUGIN_PROCESS_ID',
    ];

    public $with = ['RPluginProcess'];

    public $timestamps = false;

    public function RPluginProcess(){
        return $this->hasOne(RPluginProcess::class, 'PLUGIN_PROCESS_ID', 'PLUGIN_PROCESS_ID');
    }
}
