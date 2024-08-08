<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPersonDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_DOCUMENT_ID';

    protected $table = 'm_person_document';

    public $timestamps = false;

    public $with = ['DocumentPerson'];

    public $guarded = [
        'PERSON_DOCUMENT_ID'
    ];

    public function DocumentPerson(){
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'DOCUMENT_ID');
    }
}
