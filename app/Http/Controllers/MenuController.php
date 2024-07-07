<?php

namespace App\Http\Controllers;

use App\Models\MRelationType;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationProfession;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Salutation;
use App\Models\Menu;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuController extends Controller
{
     // Get All Relation Type 
     public function getAllRelationType()
     {
         $relationType = RelationType::get();
 
         return $relationType;
     }

    // show interface acl menu when click menu setting->acl menu
    public function index(Request $request)
    {
        // call data relation group
        $relationGroup = RelationGroup::get();
        // call data relation lob
        $relationLob = RelationLob::get();
        // call data relation type
        $relationTypeAll = $this->getAllRelationType();
        // call data salutation
        $salutation = Salutation::get();
        // call data relation status
        $relationStatus = RelationStatus::get();
        // call mapping relation Type
        $mRelationType = MRelationType::get();

        // cal profession
        $profession = RelationProfession::get();

        return Inertia::render('ACLMenu/ACLMenu', [
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob,
            'salutation' => $salutation,
            'relationStatus' => $relationStatus,
            'relationGroup' => $relationGroup,
            'mRelationType' => $mRelationType,
            'profession'   => $profession
        ]);
    }

    public function getMenuData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = Menu::orderBy('menu_sequence', 'asc')->with('parent')->where('menu_is_deleted', 0);
        if ($searchQuery) {
            if ($searchQuery->input('menu_name')) {
                    $data->where('menu_name', 'like', '%'.$searchQuery->menu_name.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    public function getMenusJson(Request $request){
        $data = $this->getMenuData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // get menu for combo
    public function getMenuCombo(Request $request){
        $data = Menu::orderBy('menu_sequence', 'asc')->with('parent')->where('menu_is_deleted', 0)->get();

        return response()->json($data);
    }

    // save to store r_menu
    public function store(Request $request){
        // dd($request);

        $Menu = Menu::create([
            "menu_parent_id"        => $request->menu_parent,
            "menu_name"             => $request->menu_name,
            "menu_url"              => $request->menu_url,
            "menu_sequence"         => $request->menu_sequence,
            "menu_is_deleted"       => 0,
            "menu_created_by"       => Auth::user()->id,
            "menu_created_date"     => now()
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Menu).",
                "module"      => "Menu",
                "id"          => $Menu->id
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $Menu->id,
            $Menu->menu_name
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get menu for combo
    public function getMenuById(Request $request){
        $data = Menu::find($request->idMenu);

        return response()->json($data);
    }

    // edit store r_menu
    public function edit(Request $request){
        // dd($request);
        $Menu = Menu::where('id', $request->id)->update([
            "menu_parent_id"        => $request->menu_parent_id,
            "menu_name"             => $request->menu_name,
            "menu_url"              => $request->menu_url,
            "menu_sequence"         => $request->menu_sequence,
            "menu_is_deleted"       => 0,
            "menu_updated_by"       => Auth::user()->id,
            "menu_updated_date"     => now()
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Menu).",
                "module"      => "Menu",
                "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->id,
            $request->menu_name
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
