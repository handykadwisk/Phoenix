<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Milestone;
use App\Models\UserLog;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MilestoneController extends Controller
{
    //store
    public function store(Request $request)
    {
        // Determine the sequence number
        if ($request->milestone_parent_id) {
            // If there is a parent milestone, start sequence from 1 for the children
            $lastSequence = Milestone::where('MILESTONE_PARENT_ID', $request->milestone_parent_id)
                ->max('MILESTONE_SEQUENCE');
            $newSequence = $lastSequence ? $lastSequence + 1 : 1;
        } else {
            // If there is no parent milestone, continue the sequence for the workbook
            $lastSequence = Milestone::where('WORKBOOK_ID', $request->workbook_id)
                ->whereNull('MILESTONE_PARENT_ID')
                ->max('MILESTONE_SEQUENCE');
            $newSequence = $lastSequence ? $lastSequence + 1 : 1;
        }
        // dd($request);
        $milestone = Milestone::create([
            'WORKBOOK_ID' => $request->workbook_id,
            'DURATION_TYPE_ID' => $request->duration_type_id,
            'MILESTONE_NAME' => $request->milestone_name,
            'MILESTONE_DURATION_DESCRIPTION' => $request->milestone_duration_description,
            'MILESTONE_DURATION_MIN' => $request->milestone_duration_min,
            'MILESTONE_DURATION_MAX' => $request->milestone_duration_max,
            'MILESTONE_PARENT_ID' => $request->milestone_parent_id === 0 ? null : $request->milestone_parent_id,
            'CREATED_BY' => Auth::user()->id,
            'CREATED_DATE' => now(),
            'MILESTONE_SEQUENCE' => $newSequence,
        ]);

        return new JsonResponse([
            'Milestone Created Successfully',
            'milestone_id' => $milestone->id
        ], 200);
    }

    //get id
    public function getMilestoneById($id)
    {
        $milestone = Milestone::where('MILESTONE_ID', $id)->first();
        return response()->json($milestone);
    }

    public function deleteMilestone($MILESTONE_ID)
    {
        $milestone = Milestone::find($MILESTONE_ID);

        if ($milestone) {
            // Check if the milestone is referenced in the claim table
            $isReferencedInClaim = Claim::where('MILESTONE_ID', $MILESTONE_ID)->exists();

            if ($isReferencedInClaim) {
                // Soft delete
                $previousIsDeleted = $milestone->MILESTONE_IS_DELETED;
                $milestone->MILESTONE_IS_DELETED = $previousIsDeleted == 1 ? 0 : 1;
                $milestone->UPDATED_BY = Auth::user()->id;
                $milestone->UPDATED_DATE = now();
                $milestone->save();

                // Log the action
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Deleted (Milestone).",
                        "module"      => "Milestone Management",
                        "id"          => $milestone->MILESTONE_ID,
                    ]),
                    'action_by'  => Auth::user()->user_login
                ]);

                return new JsonResponse([
                    'Milestone Update is ' . ($milestone->MILESTONE_IS_DELETED ? 'Deleted' : 'Active') . ' Successfully'
                ], 200, ['X-Inertia' => true]);
            } else {
                // Hard delete
                DB::transaction(function () use ($milestone) {
                    if ($milestone->MILESTONE_PARENT_ID === null) {
                        // If parent milestone, delete children
                        $this->deleteChildren($milestone->MILESTONE_ID);
                    }
                    $milestone->delete();

                    // Log the action
                    UserLog::create([
                        'created_by' => Auth::user()->id,
                        'action'     => json_encode([
                            "description" => "Hard Deleted (Milestone).",
                            "module"      => "Milestone Management",
                            "id"          => $milestone->MILESTONE_ID,
                        ]),
                        'action_by'  => Auth::user()->user_login
                    ]);
                });

                return new JsonResponse([
                    'Milestone Hard Deleted Successfully'
                ], 200, ['X-Inertia' => true]);
            }
        }

        return new JsonResponse([
            'Milestone not found.'
        ], 404, ['X-Inertia' => true]);
    }

    private function deleteChildren($parentId)
    {
        $children = Milestone::where('MILESTONE_PARENT_ID', $parentId)->get();
        foreach ($children as $child) {
            $this->deleteChildren($child->MILESTONE_ID); // Recursively delete children
            $child->delete();
        }
    }

    //edit
    public function edit(Request $request)
    {
        // dd($request);
        $milestone = Milestone::where('MILESTONE_ID', $request->MILESTONE_ID)
            ->update([
                'DURATION_TYPE_ID' => $request->DURATION_TYPE_ID,
                'MILESTONE_NAME' => $request->MILESTONE_NAME,
                'MILESTONE_DURATION_DESCRIPTION' => $request->MILESTONE_DURATION_DESCRIPTION,
                'MILESTONE_DURATION_MIN' => $request->MILESTONE_DURATION_MIN,
                'MILESTONE_DURATION_MAX' => $request->MILESTONE_DURATION_MAX,
                'MILESTONE_PARENT_ID' => $request->MILESTONE_PARENT_ID === 0 ? null : $request->MILESTONE_PARENT_ID,
                'UPDATED_BY' => Auth::user()->id,
                'UPDATED_DATE' => now(),
            ]);

        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Milestone).",
                "module"      => "Milestone Management",
                "id"          => $request->MILESTONE_ID,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Milestone has been updated.'
        ], 200, ['X-Inertia' => true]);
    }

    //update sequence
    // public function updateSequence(Request $request)
    // {

    //     dd($request);
    //     // $milestones = $request->milestones;
    //     foreach ($request as $milestone) {
    //         Milestone::where('MILESTONE_ID', $milestone['MILESTONE_ID'])
    //             ->update([
    //                 'MILESTONE_SEQUENCE' => $milestone['MILESTONE_SEQUENCE'],
    //                 'UPDATED_BY' => Auth::user()->id,
    //                 'UPDATED_DATE' => now(),
    //             ]);
    //     }

    //     return new JsonResponse([
    //         'Milestone sequence has been updated.'
    //     ], 200, ['X-Inertia' => true]);
    // }
    public function updateSequence(Request $request)
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
        DB::table('r_milestone')
            ->where('MILESTONE_ID', $item['MILESTONE_ID'])
            ->update(['MILESTONE_SEQUENCE' => $item['MILESTONE_SEQUENCE']]);

        // Update the menu sequence for the children
        if (isset($item['children'])) {
            foreach ($item['children'] as $child) {
                $this->updateItemSequence($child);
            }
        }
    }

    //copy milestone
    public function copyMilestone(Request $request)
    {
        $milestone = Milestone::where('MILESTONE_ID', $request->MILESTONE_ID)->first();
        $milestone->MILESTONE_NAME = $milestone->MILESTONE_NAME . ' (Copy)';
        $milestone->MILESTONE_SEQUENCE = $milestone->MILESTONE_SEQUENCE + 1;
        $milestone->CREATED_BY = Auth::user()->id;
        $milestone->CREATED_DATE = now();
        $milestone->save();

        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Copied (Milestone).",
                "module"      => "Milestone Management",
                "id"          => $milestone->MILESTONE_ID,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Milestone has been copied.'
        ], 200, ['X-Inertia' => true]);
    }
}
