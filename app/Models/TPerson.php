<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPerson extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_ID';

    protected $table = 't_person';

    protected $guarded = [
        'PERSON_ID',
    ];

    public $timestamps = false;

    public function users(){
        return $this->hasMany(User::class, 'id', 'PERSON_ID');
    }

    public function ContactEmergency(){
        return $this->hasMany(TPersonEmergencyContact::class, 'PERSON_ID');
    }

    public function Relation(){
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function taxStatus(){
        return $this->hasOne(RTaxStatus::class, 'TAX_STATUS_ID', 'TAX_STATUS_ID');
    }

    public function Office(){
        return $this->hasOne(TRelationOffice::class, 'RELATION_OFFICE_ID', 'OFFICE_ID');
    }

    public function Structure(){
        return $this->hasOne(TRelationStructure::class, 'RELATION_STRUCTURE_ID', 'STRUCTURE_ID');
    }

    public function Division(){
        return $this->hasOne(TRelationDivision::class, 'RELATION_DIVISION_ID', 'DIVISION_ID');
    }

    public function Document(){
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'PERSON_IMAGE_ID');
    }

    public function mPersonContact(){
        return $this->hasMany(MPersonContact::class, 'PERSON_ID', 'PERSON_ID');
    }

    public function mAddressPerson(){
        return $this->hasMany(MPersonAddress::class, 'PERSON_ID', 'PERSON_ID');
    }

    public function PersonEducation(){
        return $this->hasMany(TPersonEducation::class, 'PERSON_ID', 'PERSON_ID');
    }

    public function PersonCertificate(){
        return $this->hasMany(TPersonCertificate::class, 'PERSON_ID', 'PERSON_ID');
    }

    public function MPersonDocument(){
        return $this->hasMany(MPersonDocument::class, 'PERSON_ID', 'PERSON_ID');
    }

}
