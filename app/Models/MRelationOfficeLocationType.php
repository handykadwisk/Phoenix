<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationOfficeLocationType extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_RELATION_OFFICE_LOCATION_TYPE_ID';

    protected $table = 'm_relation_office_location_type';

    protected $with = ['locationType'];

    protected $guarded = [
        'M_RELATION_OFFICE_LOCATION_TYPE_ID',
    ];

    public $timestamps = false;

    public function locationType(){
        return $this->hasOne(RRelationLocationType::class, 'RELATION_LOCATION_TYPE_ID', 'LOCATION_TYPE_ID');
    }
}
