<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RSetting extends Model
{
    use HasFactory;

    protected $primaryKey = 'SETTING_ID';

    protected $table = 'r_setting';

    protected $guarded = ['SETTING_ID'];

    public $timestamps = false;
}