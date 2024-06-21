<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceDetail;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CashAdvanceController extends Controller
{
    public function getCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = CashAdvance::orderBy('EXPENSES_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('EXPENSES_NUMBER')) {
                $data->where('EXPENSES_NUMBER', 'like', '%'.$searchQuery->EXPENSES_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getCA()
    {
        $data = $this->getCAData(10);
        return response()->json($data);
    }

    public function getCADataForJSON(Request $request)
    {
        $data = $this->getCAData(10, $request);
        return response()->json($data);
    }

    public function getCAById(string $id) 
    {
        $data = CashAdvance::findOrFail($id);
        return response()->json($data);
    }

    public function index() 
    {
        $data = [
            'users' => User::where('role_id', 2)->get()
        ];

        return Inertia::render('CA/CashAdvance', $data);
    }

    public function store(Request $request)
    {
        $total_pengajuan = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_pengajuan += $value['jumlah'];
        }
        
        $expenses_type = $request->tipe;
        $used_by = $request->nama_pemohon;
        $expenses_requested_by = $request->nama_pengguna;
        $division = $request->divisi;
        $expenses_requested_date = $request->tanggal_pengajuan;
        $first_approval_by = $request->nama_pemberi_approval;
        $first_approval_status = 0;
        $expenses_request_note = $request->catatan;
        $expenses_total_amount = $total_pengajuan;

        if ($expenses_type == 1) {
            $code = 'CA/';
            $start_char = 10;
            $start_char_2 = 3;
        } else {
            $code = 'RMBS/';
            $start_char = 12;
            $start_char_2 = 5;
        }
        
        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(EXPENSES_NUMBER) AS max_number FROM t_cash_advance WHERE EXPENSES_TYPE = ?', [$expenses_type]);

        foreach ($queries as $query) {
            $getMaxNumber = $query->max_number;
        }

        $count = (int) Str::substr($getMaxNumber, $start_char, 5);

        if ($year_month == Str::substr($getMaxNumber, $start_char_2, 7)) {
            $count++;
        } else {
            $count = 1; 
        }
        
        $counting = sprintf('%05s', $count);

        $expenses_number = $code . $year_month . $counting;
        
        // Insert CA
        CashAdvance::create([
            'EXPENSES_NUMBER' => $expenses_number,
            'EXPENSES_TYPE' => $expenses_type,
            'USED_BY' => $used_by,
            'EXPENSES_REQUESTED_BY' => $expenses_requested_by,
            'DIVISION' => $division,
            'EXPENSES_REQUESTED_DATE' => $expenses_requested_date,
            'FIRST_APPROVAL_BY' => $first_approval_by,
            'FIRST_APPROVAL_STATUS' => $first_approval_status,
            'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
            'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount
        ]);

        // Get new id data CA
        $cash_advance = CashAdvance::orderBy('EXPENSES_ID', 'desc')->limit(1)->get('expenses_id');
        
        foreach ($cash_advance as $ca) {
            $expenses_id = $ca['expenses_id'];
        }

        foreach ($request->CashAdvanceDetail as $cad) {
            $expenses_detail_date = $cad['tanggalKegiatan'];
            $expenses_detail_purpose = $cad['peruntukan'];
            $expenses_detail_location = $cad['tempat'];
            $relation_organization_id = $cad['perusahaan'];
            $expenses_detail_relation_name = $cad['nama'];
            $expenses_detail_relation_position = $cad['posisi'];
            $expenses_detail_amount = $cad['jumlah'];
            
            // Insert CA Detail
            CashAdvanceDetail::create([
                'EXPENSES_ID' => $expenses_id,
                'EXPENSES_DETAIL_DATE' => $expenses_detail_date,
                'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount
            ]);

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Cash Advance Detail).",
                    "module"      => "Cash Advance",
                    "id"          => $expenses_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            'New Cash Advance has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function approve(Request $request)
    {
        // $status = 0;
        // foreach ($request->cash_advance_detail as $cad) {
        //     $status += $cad['EXPENSES_DETAIL_STATUS'];
        // }
        
        $expenses_id = $request->EXPENSES_ID;
        $expenses_updated_date = date('Y-m-d H:i:s');
        $first_approval_change_status_date = date('Y-m-d H:i:s');
        $first_approval_status = $request->FIRST_APPROVAL_STATUS;
        // if ($status > 0) {
        //     $first_approval_status = 1;
        // } else {
        //     $first_approval_status = 0;
        // }

        CashAdvance::where('EXPENSES_ID', $expenses_id)->update([
            'EXPENSES_UPDATED_DATE' => $expenses_updated_date,
            'FIRST_APPROVAL_CHANGE_STATUS_DATE' => $first_approval_change_status_date,
            'FIRST_APPROVAL_STATUS' => $first_approval_status
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Approve (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->cash_advance_detail as $cad) {
            $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
            $expenses_detail_status = $cad['EXPENSES_DETAIL_STATUS'];
            $expenses_detail_note = $cad['EXPENSES_DETAIL_NOTE'];

            CashAdvanceDetail::where('EXPENSES_DETAIL_ID', $expenses_detail_id)->update([
                'EXPENSES_DETAIL_STATUS' => $expenses_detail_status,
                'EXPENSES_DETAIL_NOTE' => $expenses_detail_note
            ]);

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Approve (Cash Advance Detail).",
                    "module"      => "Cash Advance",
                    "id"          => $expenses_detail_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'Cash Advance has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        $expenses_id = $request->EXPENSES_ID;

        $CountRequestDataById = sizeof($request->cash_advance_detail);
        $CountCashAdvanceDetail = CashAdvanceDetail::where('EXPENSES_ID', $expenses_id)->count();

        $total_pengajuan = 0;

        foreach ($request->cash_advance_detail as $value) {
            $total_pengajuan += $value['EXPENSES_DETAIL_AMOUNT'];
        }

        $expenses_total_amount = $total_pengajuan;
        $first_approval_status = 0;
        $expenses_request_note = $request->EXPENSES_REQUEST_NOTE;

        CashAdvance::where('EXPENSES_ID', $expenses_id)->update([
            'FIRST_APPROVAL_STATUS' => $first_approval_status,
            'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
            'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountCashAdvanceDetail) {
            foreach ($request->cash_advance_detail as $cad) {
                $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
                $expenses_detail_date = $cad['EXPENSES_DETAIL_DATE'];
                $expenses_detail_purpose = $cad['EXPENSES_DETAIL_PURPOSE'];
                $expenses_detail_location = $cad['EXPENSES_DETAIL_LOCATION'];
                $relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $expenses_detail_relation_name = $cad['EXPENSES_DETAIL_RELATION_NAME'];
                $expenses_detail_relation_position = $cad['EXPENSES_DETAIL_RELATION_POSITION'];
                $expenses_detail_amount = $cad['EXPENSES_DETAIL_AMOUNT'];
                $expenses_detail_status = null;
                
                CashAdvanceDetail::where('EXPENSES_DETAIL_ID', $expenses_detail_id)->update([
                    'EXPENSES_DETAIL_DATE' => $expenses_detail_date,
                    'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                    'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                    'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                    'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                    'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                    'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount,
                    'EXPENSES_DETAIL_STATUS' => $expenses_detail_status
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $expenses_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            CashAdvanceDetail::where('EXPENSES_ID', $expenses_id)->delete();

            foreach ($request->cash_advance_detail as $cad) {
                $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
                $expenses_detail_date = $cad['EXPENSES_DETAIL_DATE'];
                $expenses_detail_purpose = $cad['EXPENSES_DETAIL_PURPOSE'];
                $expenses_detail_location = $cad['EXPENSES_DETAIL_LOCATION'];
                $relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $expenses_detail_relation_name = $cad['EXPENSES_DETAIL_RELATION_NAME'];
                $expenses_detail_relation_position = $cad['EXPENSES_DETAIL_RELATION_POSITION'];
                $expenses_detail_amount = $cad['EXPENSES_DETAIL_AMOUNT'];
                
                CashAdvanceDetail::create([
                    'EXPENSES_ID' => $expenses_id,
                    'EXPENSES_DETAIL_DATE' => $expenses_detail_date,
                    'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                    'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                    'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                    'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                    'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                    'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $expenses_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Cash Advance has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}