<?php

namespace App\Models;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $table = 't_role';

    protected $guarded = [
        'id',
    ];

    public function menu()
    {
        return $this->belongsToMany(Menu::class, 'm_role_access_menu')->where('menu_is_deleted', 0)->orderBy('menu_sequence', 'asc');
    }

    public function permission()
    {
        return $this->belongsToMany(TPermission::class, 'm_role_permissions', 'role_id', 'permission_id');
    }

    public $timestamps = false;
}
