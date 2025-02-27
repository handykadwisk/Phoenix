<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MMedicalDocument extends Model
{
    use HasFactory;
    protected $primaryKey = 'MEDICAL_DOCUMENT_ID';

    protected $table = 'm_medical_document';

    protected $guarded = [
        'MEDICAL_DOCUMENT_ID',
    ];

    public $timestamps = false;

    protected $with = [
        'document'
    ];

    
    public function document() {
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'DOCUMENT_ID');
    }
}
