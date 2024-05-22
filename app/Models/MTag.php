<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MTag extends Model
{
    use HasFactory;

    protected $table = 'm_tag_relation';

    public $timestamps = false;

    public $fillable = [
        'RELATION_ORGANIZATION_ID',
        'TAG_ID',
    ];
}
