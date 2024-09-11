<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRoleUser extends Model
{
    use HasFactory;
    protected $table = 'm_role_users';

    public $timestamps = false;

    public $fillable = [
        'role_id',
        'user_id'
    ];

    // public $with = ['permission', 'menu'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relasi belongsTo dengan TRole
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    // public function permission()
    // {
    //     return $this->belongsToMany(TPermission::class, 'm_role_permissions', 'role_id', 'permission_id');
    // }
    // public function menu()
    // {
    //     return $this->belongsToMany(Menu::class, 'm_role_access_menu', 'role_id', 'menu_id');
    // }
}
