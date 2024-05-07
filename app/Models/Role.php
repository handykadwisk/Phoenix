<?php

namespace App\Models;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 't_role';

    protected $fillable = [
        'role_name'
    ];

    public function menu()
    {
        return $this->belongsToMany(Menu::class, 'm_role_access_menu')->where('menu_is_deleted', 0);
    }

    public $timestamps = false;
}
