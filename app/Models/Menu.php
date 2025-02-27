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
        $user = Auth::user();

        // Jika user adalah admin, ambil semua akses menu
        if ($user->type_user_id === 1) {
            return $this->hasMany(RoleAccessMenu::class, 'menu_id'); // Ambil semua akses menu tanpa filter
        }

        // Jika bukan admin, filter berdasarkan role user
        return $this->hasMany(RoleAccessMenu::class, 'menu_id')
            ->whereIn('role_id', function ($query) use ($user) {
                $query->select('role_id')
                    ->from('m_role_users')
                    ->where('user_id', $user->id);
            });
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
