<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPic extends Model
{
    use HasFactory;

    protected $primaryKey = 'PIC_ID';

    protected $table = 't_pic';

    protected $guarded = [
        'PIC_ID',
    ];

    public $with = ['tRelationCorporate'];

    public $timestamps = false;

    public function tRelationCorporate()
    {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function tPerson()
    {
        return $this->hasOne(TPerson::class, 'PERSON_ID', 'PERSON_ID');
    }

    public function Office()
    {
        return $this->hasOne(TRelationOffice::class, 'RELATION_OFFICE_ID', 'OFFICE_ID');
    }

    public function Structure()
    {
        return $this->hasOne(TRelationStructure::class, 'RELATION_STRUCTURE_ID', 'STRUCTURE_ID');
    }

    public function Division()
    {
        return $this->hasOne(TRelationDivision::class, 'RELATION_DIVISION_ID', 'DIVISION_ID');
    }
}
