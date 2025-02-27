<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ROffSiteReason extends Model
{
    use HasFactory;
    protected $primaryKey = 'OFF_SITE_REASON_ID';

    protected $table = 'r_off_site_reason';

    public $timestamps = false;
}
