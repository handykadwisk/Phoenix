<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;

    protected $table = 'm_role_permissions';

    public $timestamps = false;

    public $fillable = [
        'role_id',
        'permission_id'
    ];

    public function role() {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function rolesUser() {
        return $this->belongsTo(MRoleUser::class, 'role_id', 'role_id');
    }

    public function permission() {
        return $this->belongsTo(TPermission::class, 'permission_id', 'PERMISSION_ID');
    }
}
