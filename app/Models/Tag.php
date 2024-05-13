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
        'CREATED_BY',
        'CREATED_DATE',
        'UPDATED_BY',
        'UPDATED_DATE'
    ];
}
