<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class Menu extends Model
{
    protected $primaryKey = 'id';

    protected $table = 'r_menu';

    protected $with = ['children', 'access'];

    protected $guarded = [
        'id',
    ];

    public $timestamps = false;

    public function access()
    {
        return $this->hasMany(RoleAccessMenu::class, 'menu_id')->where('role_id', Auth::user()->role_id);
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'menu_parent_id')->where('menu_is_deleted', 0)->orderBy('menu_sequence', 'asc');
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'menu_parent_id')->where('menu_is_deleted', 0)->orderBy('menu_sequence', 'asc');
    }
}