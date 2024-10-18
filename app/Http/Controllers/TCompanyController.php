<?php

namespace App\Http\Controllers;

use App\Models\TCompany;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TCompanyController extends Controller
{
    // show interface relation when click menu relation
    public function index(Request $request)
    {
        return Inertia::render('Company/Company');
    }

    public function getCompanyData($request)
    {
        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = TCompany::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);


        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        // if ($request->newFilter !== "") {
        //     if ($newSearch[0]["flag"] !== "") {
        //         $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
        //     }else{
        //         foreach ($newSearch[0] as $keyId => $searchValue) {
        //             if ($keyId === 'RELATION_ORGANIZATION_NAME') {
        //                 $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
        //             }elseif ($keyId === 'RELATION_TYPE_ID'){
        //                 if (!isset($searchValue['value'])) {
        //                     $valueTypeId = $searchValue;
        //                 }else{
        //                     $valueTypeId = $searchValue['value'];
        //                 }
        //                 // dd($searchValue);
        //                 $query->whereHas('mRelationType', function($q) use($valueTypeId) {
        //                     // Query the name field in status table
        //                     $q->where('RELATION_TYPE_ID', 'like', '%'.$valueTypeId.'%');
        //                 });
        //             }
        //         }
        //     }
        // }

        // if ($filterModel) {
        //     foreach ($filterModel as $colId => $filterValue) {
        //         if ($colId === 'policy_number') {
        //             $query->where('policy_number', 'LIKE', '%' . $filterValue . '%')
        //                   ->orWhereRelation('insuranceType', 'insurance_type_name', 'LIKE', '%' . $filterValue . '%');
        //         } elseif ($colId === 'policy_inception_date') {
        //             $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
        //                   ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
        //         }
        //     }
        // }
        // dd($query->toSql());
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }


    // get data company from database
    public function getCompanyJson(Request $request)
    {
        $data = $this->getCompanyData($request);
        return response()->json($data);
    }

    // get company new
    public function getCompany(Request $request)
    {
        $data = TCompany::get();
        return response()->json($data);
    }

    // add company to database
    public function store(Request $request)
    {

        $company = TCompany::create([
            "COMPANY_NAME"                  => $request->COMPANY_NAME,
            "COMPANY_ABBREVIATION"          => $request->COMPANY_ABBREVIATION,
            "COMPANY_AKA"                   => $request->COMPANY_AKA,
            "COMPANY_EMAIL"                 => $request->COMPANY_EMAIL,
            "COMPANY_WEBSITE"               => $request->COMPANY_WEBSITE,
            "COMPANY_DESCRIPTION"           => $request->COMPANY_DESCRIPTION,
            "COMPANY_SIGNATURE_NAME"        => $request->COMPANY_SIGNATURE_NAME,
            "COMPANY_SIGNATURE_TITLE"       => $request->COMPANY_SIGNATURE_TITLE,
            "COMPANY_BANK_ACCOUNT_NUMBER"   => $request->COMPANY_BANK_ACCOUNT_NUMBER,
            "COMPANY_BANK_ACCOUNT_NAME"     => $request->COMPANY_BANK_ACCOUNT_NAME,
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Company).",
                "module"      => "Company",
                "id"          => $company->COMPANY_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "Company Created Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }


    public function get_company_detail(Request $request)
    {
        $dataCompany = TCompany::where('COMPANY_ID', $request->idCompany)->first();

        return response()->json($dataCompany);
    }

    public function editStore(Request $request)
    {
        TCompany::where('COMPANY_ID', $request->COMPANY_ID)->update([
            "COMPANY_NAME"                  => $request->COMPANY_NAME,
            "COMPANY_ABBREVIATION"          => $request->COMPANY_ABBREVIATION,
            "COMPANY_AKA"                   => $request->COMPANY_AKA,
            "COMPANY_EMAIL"                 => $request->COMPANY_EMAIL,
            "COMPANY_WEBSITE"               => $request->COMPANY_WEBSITE,
            "COMPANY_DESCRIPTION"           => $request->COMPANY_DESCRIPTION,
            "COMPANY_SIGNATURE_NAME"        => $request->COMPANY_SIGNATURE_NAME,
            "COMPANY_SIGNATURE_TITLE"       => $request->COMPANY_SIGNATURE_TITLE,
            "COMPANY_BANK_ACCOUNT_NUMBER"   => $request->COMPANY_BANK_ACCOUNT_NUMBER,
            "COMPANY_BANK_ACCOUNT_NAME"     => $request->COMPANY_BANK_ACCOUNT_NAME,
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edited (Company).",
                "module"      => "Company",
                "id"          => $request->COMPANY_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->COMPANY_ID,
            $request->COMPANY_NAME,
            "Company Edited Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function reminder(Request $request)
    {
        return Inertia::render('Reminder/Reminder');
    }
}
