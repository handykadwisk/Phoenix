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
       
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 5);
        // dd($page);
        // $query = Menu::query()->with('parent')->orderBy('id', 'asc');
        $query = Menu::query()->with('parent');
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
            // foreach ($newSearch as $search) {
            foreach ($newSearch[0] as $keyId => $searchValue) {
                // Pencarian berdasarkan nama menu
                if ($keyId === 'menu_name') {
                    $query->where('menu_name', 'LIKE', '%' . $searchValue . '%');
                }
            }
            // }
        }
        // dd($query->toSql());
        if (!$sortModel && !$filterModel) {
            $query->orderBy('menu_created_date', 'desc');
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        // dd($data);
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

    // edit r_menu
    public function edit(Request $request)
    {   
        // dd($request);
        // get data menu
        $menuParent = Menu::find($request->id);
        // dd($request->menu_parent_id,$menuParent->menu_parent_id); 
        // dd($menuParent);

        if ($menuParent->menu_parent_id == $request->menu_parent_id) {
            // dd('edit');
            // save data menu
            Menu::where('id', $request->id)
                ->update([
                    'menu_name' => $request->menu_name,
                    'menu_url' => $request->menu_url,
                    'menu_updated_by' => Auth::user()->id,
                    'menu_updated_date' => now()
                ]);
                return new JsonResponse([
                    'Success editing menu.'
                ], 200, ['X-Inertia' => true]);

        } else {

            // dd('edit parent');

            // If the parent menu is different, process the change parent
            $newParent =  $request->menu_parent_id;
            $relationParent = Menu::find($request->menu_parent_id);
         
            $relationParent = Menu::find($newParent);

            if ($relationParent) {

                // $concatID = "." . $relationParent->id . '.';

                // Cek apakah parent dan child berada dalam satu grup
                $cekExisting = DB::select("
                    SELECT 
                        CONCAT('.', menu_mapping) AS new_mapping,
                        IF(
                            LOCATE(CONCAT('.', ?, '.'), CONCAT('.', menu_mapping)) > 0,
                            'satu group',
                            'beda group'
                        ) AS group_status 
                    FROM
                        r_menu 
                    WHERE id = ?
                ", [ $request->id,$newParent ]);
                // dd('masuk', $cekExisting);
                // if existing group status is 'satu group
                if ($cekExisting[0]->group_status === 'satu group') {

                    // dd('masuk');

                    // get  the original parent and the new parent
                    $originalParent = Menu::find($newParent);
                    $oldParent = Menu::find($request->id);

                    // update the parent of the new parent to original parent
                    Menu::where('id', $newParent)
                        ->update([
                            'menu_parent_id' => $oldParent->parent_menu_id,
                            'menu_updated_by' => Auth::user()->id,
                            'menu_updated_date' => now()
                        ]);

                    // update the parent of the child to the new parent
                    Menu::where('id', $request->id)
                        ->update([
                            "menu_parent_id" => $newParent,
                            'menu_updated_by' => Auth::user()->id,
                            'menu_updated_date' => now()
                        ]);

                } else {

                    Menu::where('id', $request->id)
                    ->update([
                        "menu_parent_id" => $newParent,
                        'menu_updated_by' => Auth::user()->id,
                        'menu_updated_date' => now()
                    ]);

                    // // if parent and child are in different groups, update as usual

                    // $oldParent = Menu::find($request->id);
                    // // Jika parent `menu_parent_id` null dan child adalah id parent

                    // // If the parent 'menu_parent_id' is null and the child is the parent id
                    // if ($oldParent->menu_parent_id === null) {

                    //     // change the new parent to old parent

                    //     Menu::where('id', $newParent)
                    //         ->update([
                    //             'menu_parent_id' => $oldParent->menu_parent_id, 
                    //             'menu_updated_by' => Auth::user()->id,
                    //             'menu_updated_date' => now()
                    //         ]);

                    //     Menu::where('id', $request->id)
                    //         ->update([
                    //             "menu_parent_id" => $newParent,
                    //             'menu_updated_by' => Auth::user()->id,
                    //             'menu_updated_date' => now()
                    //         ]);

                    // } else {

                    //     // Jika tidak berada dalam satu grup, lakukan update biasa
                    //     Menu::where('id', $request->id)
                    //         ->update([
                    //             "menu_parent_id" => $newParent,
                    //             'menu_updated_by' => Auth::user()->id,
                    //             'menu_updated_date' => now()
                    //         ]);
                    // }
                }
            }
            else{
                Menu::where('id', $request->id)
                ->update([
                    "menu_parent_id" => null,
                    'menu_updated_by' => Auth::user()->id,
                    'menu_updated_date' => now()
                ]);
            }
            //call store prosedure set mapping menu
            DB::select('call sp_set_mapping_menu');

            // updated userlog
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action' => json_encode([
                    "description" => "Updated (Menu).",
                    "module" => "Menu",
                    "id" => $request->id
                ]),
                'action_by' => Auth::user()->user_login
            ]);

            // response success
            return new JsonResponse([
                'Success editing menu.'
            ], 200, ['X-Inertia' => true]);
        }
    }

    //update menu_is_deleted
    public function changeMenuStatus(Request $request)
    {
        // Find the menu by ID
        $menu = Menu::find($request->idMenu);

        // if menu found
        if ($menu) {
            // save the previous status of the menu (0 = active, 1 = inactive)
            $previousStatus = $menu->menu_is_deleted;

            // if the menu is active(0), change to inactive (1) and vice versa
            $menu->menu_is_deleted = $previousStatus == 0 ? 1 : 0;

            // save the user who updated the menu
            $menu->menu_updated_by = Auth::user()->id;

            // save the time when the change was made
            $menu->menu_updated_date = now();

            // save the changes to the database
            $menu->save();

            // save user activity log to userlog table
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action' => json_encode([
                    "description" => $menu->menu_is_deleted ? "Deactivated (Menu)." : "Reactivated (Menu).",
                    "module" => "Menu",
                    "id" => $menu->id
                ]),
                'action_by' => Auth::user()->user_login
            ]);

            // Return success response with message according to status (deactivated or reactivated)
            return new JsonResponse([
                $menu->menu_is_deleted ? 'Menu has been deactivated.' : 'Menu has been reactivated.'
            ], 200, ['X-Inertia' => true]);
        }

        // if menu not found, return not found response (404)
        return new JsonResponse([
            'Menu not found.'
        ], 404, ['X-Inertia' => true]);
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
         // updated userlog
         UserLog::create([
            'created_by' => Auth::user()->id,
            'action' => json_encode([
                "description" => "Menu sequence updated.",
                "module" => "Menu",
                "id" => $request->id
            ]),
            'action_by' => Auth::user()->user_login
        ]);

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
