<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAdditional extends Model
{
    use HasFactory;

    protected $table = 'm_user_additional';

    protected $fillable = [
        'user_id',
        'user_language',
        'user_additional_created_by',
        'user_additional_created_date',
        'user_additional_updated_by',
        'user_additional_updated_date'
    ];

    public $timestamps = false;
}
