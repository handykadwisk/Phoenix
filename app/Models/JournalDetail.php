<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'JOURNAL_DETAIL_ID';

    protected $table = 't_journal_detail';

    protected $guarded = ['JOURNAL_DETAIL_ID'];

    public $timestamps = false;
}