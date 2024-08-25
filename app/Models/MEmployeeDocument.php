<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MEmployeeDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_EMPLOYEE_DOCUMENT_ID';

    protected $table = 'm_employee_document';

    public $timestamps = false;

    public $with = ['DocumentPerson'];

    public $guarded = [
        'M_EMPLOYEE_DOCUMENT_ID'
    ];

    public function DocumentPerson(){
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'DOCUMENT_ID');
    }
}
