<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RJournalSetting extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'JOURNAL_SETTING_ID';

    protected $table = 'r_journal_setting';

    protected $guarded = ['JOURNAL_SETTING_ID'];

    public $timestamps = false;

    protected $with = ['journal_setting_detail'];

    public function journal_setting_detail(): HasMany
    {
        return $this->hasMany(RJournalSettingDetail::class, 'JOURNAL_SETTING_ID');
    }

}