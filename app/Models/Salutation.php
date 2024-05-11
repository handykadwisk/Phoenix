<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salutation extends Model
{
    use HasFactory;

    protected $primaryKey = 'salutation_id';

    protected $table = 'r_salutation';

    protected $fillable = [
        'salutation_name',
        'salutation_desc',
        'relation_status_id'
    ];

    public $timestamps = false;
}
