<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalDeleted extends Model
{
    use HasFactory;

    protected $primaryKey = 'JOURNAL_ID';

    protected $table = 't_journal_deleted';

    protected $guarded = ['JOURNAL_ID'];

    public $timestamps = false;
}