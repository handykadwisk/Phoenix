<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    use HasFactory;

    protected $primaryKey = 'JOURNAL_ID';

    protected $table = 't_journal';

    protected $guarded = ['JOURNAL_ID'];

    public $timestamps = false;
}