<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RJournalSettingDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'JOURNAL_SETTING_DETAIL_ID';

    protected $table = 'r_journal_setting_detail';

    protected $guarded = ['JOURNAL_SETTING_DETAIL_ID'];

    public $timestamps = false;
}