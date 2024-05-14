<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 't_tag';

    public $timestamps = false;

    public $fillable = [
        'TAG_NAME',
        'TAG_CREATED_BY',
        'TAG_CREATED_DATE',
        'TAG_UPDATED_BY',
        'TAG_UPDATED_DATE'
    ];
}
