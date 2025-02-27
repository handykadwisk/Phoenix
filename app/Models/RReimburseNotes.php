<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RReimburseNotes extends Model
{
    use HasFactory;

    protected $primaryKey = 'REIMBURSE_NOTES_ID';

    protected $table = 'r_reimburse_notes';

    protected $guarded = ['REIMBURSE_NOTES_ID'];

    public $timestamps = false;
}