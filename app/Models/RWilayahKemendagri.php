<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RWilayahKemendagri extends Model
{
    use HasFactory;

    protected $primaryKey = 'kode';

    protected $table = 'r_wilayah_kemendagri';

    protected $guarded = [
        'kode',
    ];

    public $timestamps = false;
}
