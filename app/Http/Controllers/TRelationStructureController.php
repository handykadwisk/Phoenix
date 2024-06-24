<?php

namespace App\Http\Controllers;

use App\Models\TRelationStructure;
use Illuminate\Http\Request;

class TRelationStructureController extends Controller
{
    public function getStructureData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = TRelationStructure::where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('RELATION_STRUCTURE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_STRUCTURE_ALIAS')) {
                    $data->where('RELATION_STRUCTURE_ALIAS', 'like', '%'.$searchQuery->RELATION_STRUCTURE_ALIAS.'%');
            }
        } 
            // dd($data->toSql());

            return $data->paginate($dataPerPage);
    }

    public function getStructureJson(Request $request)
    {
        $data = $this->getStructureData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }
}
