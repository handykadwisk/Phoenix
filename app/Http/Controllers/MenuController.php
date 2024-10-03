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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    // get menu data
    public function showMenu()
    {
        $menu = DB::select('CALL sp_combo_menu()');
        return $menu;
    }

    public function getMenuData($request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Menu::query()->with('parent')->orderBy('menu_sequence', 'asc');
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newFilter = $request->input('newFilter', '');
        $newSearch = json_decode($request->newFilter, true);


        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                $query->where($colId, 'LIKE', '%' . $filterValue . '%');
            }
        }

        // Jika ada filter 'newFilter' dan tidak kosong
        if ($newFilter !== "") {
            foreach ($newSearch as $search) {
                foreach ($search as $keyId => $searchValue) {
                    // Pencarian berdasarkan nama menu
                    if ($keyId === 'menu_name') {
                        $query->where('menu_name', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }


    public function getMenusJson(Request $request)
    {
        $data = $this->getMenuData($request);
        return response()->json($data);
    }

    // get menu for combo
    public function getMenuCombo(Request $request)
    {
        $data = Menu::orderBy('menu_sequence', 'asc')->with('parent')->where('menu_is_deleted', 0)->get();
        $res = Menu::where(['menu_is_deleted' => 0, 'menu_parent_id' => null])->orderBy('menu_sequence', 'asc')->get();

        return response()->json($res);
    }

    // save to store r_menu
    public function store(Request $request)
    {
        // Log::info($request);
        $lastSequence = Menu::max('menu_sequence');

        // Assign the next sequence or 1 if no previous records exist
        $nextSequence = $lastSequence ? $lastSequence + 1 : 1;

        $Menu = Menu::create([
            "menu_parent_id"        => $request->menu_parent,
            "menu_name"             => $request->menu_name,
            "menu_url"              => $request->menu_url,
            "menu_sequence"         => $nextSequence,
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
            'action_by'  => Auth::user()->user_login
        ]);

        // $name = NULL;
        DB::select('call sp_set_mapping_menu');


        return new JsonResponse([
            'New menu added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get menu for combo
    public function getMenuById(Request $request)
    {
        $data = Menu::find($request->idMenu);

        return response()->json($data);
    }

    // edit store r_menu
    public function edit(Request $request)
    // {

    //     // dd($request);
    //     $Menu = Menu::where('id', $request->id)->update([
    //         "menu_parent_id"        => $request->menu_parent_id,
    //         "menu_name"             => $request->menu_name,
    //         "menu_url"              => $request->menu_url,
    //         "menu_sequence"         => $request->menu_sequence,
    //         "menu_is_deleted"       => $request->menu_is_deleted,
    //         "menu_updated_by"       => Auth::user()->id,
    //         "menu_updated_date"     => now()
    //     ]);

    //     // Created Log
    //     UserLog::create([
    //         'created_by' => Auth::user()->id,
    //         'action'     => json_encode([
    //             "description" => "Updated (Menu).",
    //             "module"      => "Menu",
    //             "id"          => $request->id
    //         ]),
    //         'action_by'  => Auth::user()->user_login
    //     ]);


    //     // set message then return
    //     return new JsonResponse([
    //         $request->menu_is_deleted === 1 ? 'Menu has been deactivated' : 'Menu has been reactivated.'
    //     ], 200, [
    //         'X-Inertia' => true
    //     ]);
    // }
    {
        // Cek parent menu di menu_mapping
        $relationParent = Menu::find($request->menu_parent_id);
        $concatID = "." . $request->id . '.';

        // Cek apakah parent menu sudah ada dalam menu_mapping
        $cekExisting = Menu::where('id', $request->menu_parent_id)
            ->where('menu_mapping', 'like', '%' . $concatID . '%')->get();

        if ($cekExisting->count() > 0) {
            // Jika parent sudah ada dalam mapping, update parent dan detail menu
            $updateParent = Menu::where('id', $request->menu_parent_id)
                ->update(['menu_parent_id' => $relationParent->menu_parent_id]);

            // Update menu
            $Menu = Menu::where('id', $request->id)->update([
                "menu_parent_id" => $request->menu_parent_id,
                "menu_name" => $request->menu_name,
                "menu_url" => $request->menu_url,
                "menu_sequence" => $request->menu_sequence,
                "menu_is_deleted" => $request->menu_is_deleted,
                "menu_updated_by" => Auth::user()->id,
                "menu_updated_date" => now()
            ]);
        DB::select('call sp_set_mapping_menu');

        } else {
            // Update langsung jika tidak ada relasi
            $Menu = Menu::where('id', $request->id)->update([
                "menu_parent_id" => $request->menu_parent_id,
                "menu_name" => $request->menu_name,
                "menu_url" => $request->menu_url,
                "menu_sequence" => $request->menu_sequence,
                "menu_is_deleted" => $request->menu_is_deleted,
                "menu_updated_by" => Auth::user()->id,
                "menu_updated_date" => now()
            ]);
        DB::select('call sp_set_mapping_menu');

        }

        // Logging
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action' => json_encode([
                "description" => "Updated (Menu).",
                "module" => "Menu",
                "id" => $request->id
            ]),
            'action_by' => Auth::user()->user_login
        ]);



        // Set message then return
        if ($request->menu_is_deleted !== null) {
            return new JsonResponse([
            $request->menu_is_deleted === 1 ? 'Menu has been deactivated' : 'Menu has been reactivated.'
            ], 200, ['X-Inertia' => true]);
        } else {
            return new JsonResponse([
            'Success editing menu.'
            ], 200, ['X-Inertia' => true]);
        }
    }
    // get menu from role_id
    public function getMenuByRoleId(Request $request)
    {
        $data = Menu::where('role_id', $request->id);
        // Log::info($data);

    }
    public function updateMenuSequence(Request $request)
    {
        // Log::info($request);
        $items = $request->all();
        foreach ($items as $item) {
            $this->updateItemSequence($item);
            // Log::info($item);

        }

        return new JsonResponse([
            'Menu sequence updated successfully'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    private function updateItemSequence($item)
    {
        // Update the menu sequence for the item
        DB::table('r_menu')
            ->where('id', $item['id'])
            ->update(['menu_sequence' => $item['menu_sequence']]);

        // Update the menu sequence for the children
        if (isset($item['children'])) {
            foreach ($item['children'] as $child) {
                $this->updateItemSequence($child);
            }
        }
    }
}
