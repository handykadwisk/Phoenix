<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalDeleted extends Model
{
    use HasFactory;

    protected $table = 't_journal_deleted';

    protected $guarded = ['TEMP'];

    public $timestamps = false;
}