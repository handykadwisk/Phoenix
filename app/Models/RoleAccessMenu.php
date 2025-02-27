<?php

namespace App\Models;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleAccessMenu extends Model
{
    use HasFactory;

    protected $table = 'm_role_access_menu';

    public $timestamps = false;

    public $fillable = [
        'role_id',
        'menu_id'
    ];

    public function menu()
    {
        return $this->hasMany(Menu::class, 'id', 'menu_id');
        // dd($aaa->toSql());
    }
}
