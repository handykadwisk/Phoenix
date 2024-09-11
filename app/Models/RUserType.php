<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RUserType extends Model
{
    use HasFactory;

    protected $table = 'r_user_type';

    protected $primaryKey = 'user_type_id';

    protected $guarded = [
        'user_type_id',
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->hasOne(User::class, 'user_type_id');
    }
}
