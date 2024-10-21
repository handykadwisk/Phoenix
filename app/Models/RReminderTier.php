<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RReminderTier extends Model
{
    use HasFactory;

    protected $primaryKey = 'REMINDER_TIER_ID';

    protected $table = 'r_reminder_tier';

    protected $guarded = [
        'REMINDER_TIER_ID',
    ];
}
