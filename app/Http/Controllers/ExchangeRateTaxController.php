<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRateTax;
use App\Models\ExchangeRateTaxDetail;
use App\Models\RCurrency;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExchangeRateTaxController extends Controller
{
    public function getExchangeRateTaxData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = ExchangeRateTax::query();
        $sortModel = $request->input('sort');
        $newSearch = json_decode($request->newFilter, true);
        
        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }
        
        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('EXCHANGE_RATE_TAX_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }else{
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'EXCHANGE_RATE_TAX_DATE') {
                        $query->where('EXCHANGE_RATE_TAX_START_DATE', '<=', $searchValue)
                              ->where('EXCHANGE_RATE_TAX_END_DATE', '>=', $searchValue);
                    }
                }
            }
        }

        $query->orderBy('EXCHANGE_RATE_TAX_START_DATE', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }
    
    public function getExchangeRateTax(Request $request)
    {
        $data = $this->getExchangeRateTaxData($request);
        
        return response()->json($data);
    }

    public function getExchangeRateTaxById(string $id) 
    {
        $data = ExchangeRateTax::findOrFail($id);
        
        return response()->json($data);
    }

    public function getExchangeRateTaxByDate($date) 
    {
        $data = ExchangeRateTax::where('EXCHANGE_RATE_TAX_START_DATE', $date)->first();
        
        return response()->json($data);
    }

    public function getExchangeRateTaxDetailById(string $id) 
    {
        $data = ExchangeRateTaxDetail::findOrFail($id);
        
        return response()->json($data);
    }

    public function getCurrenciesRateTax()
    {
        $data = RCurrency::orderBy('CURRENCY_SEQ_EXCHANGE_RATE_TAX', 'asc')->get();

        return response()->json($data);
    }
    
    public function index()
    {
        return Inertia::render('ExchangeRateTax/ExchangeRateTax');
    }

    public function exchange_rate_tax_add(Request $request)
    {
        $exchange_rate_tax_id = "";

        $exchange_rate_tax_id = DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;

            $exchange_rate_tax_detail = $request->exchange_rate_tax_detail;

            // dd($exchange_rate_tax_detail);

            $exchange_rate_tax_start_date = $request->exchange_rate_tax_start_date;
            $exchange_rate_tax_end_date = $request->exchange_rate_tax_end_date;
            $exchange_rate_tax_created_by = $user_id;
            $exchange_rate_tax_created_at = now();

            $exchange_rate_tax = ExchangeRateTax::updateOrCreate(
                [
                'EXCHANGE_RATE_TAX_START_DATE' => $exchange_rate_tax_start_date,
                'EXCHANGE_RATE_TAX_END_DATE' => $exchange_rate_tax_end_date,
            ],[
                'EXCHANGE_RATE_TAX_CREATED_BY' => $exchange_rate_tax_created_by,
                'EXCHANGE_RATE_TAX_CREATED_AT' => $exchange_rate_tax_created_at
            ])->EXCHANGE_RATE_TAX_ID;

            // Created Log CA
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate Tax).",
                    "module"      => "Exchange Rate Tax",
                    "id"          => $exchange_rate_tax
                ]),
                'action_by'  => $user->user_login
            ]);

            foreach ($exchange_rate_tax_detail as $value) {
                $exchange_rate_tax_detail_currency_id = isset($value['EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID']) ? $value['EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID'] : $value['CURRENCY_ID'];

                $exchange_rate_tax_detail_exchange_rate = $value['EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE'];
                $exchange_rate_tax_detail_created_by = $user_id;
                $exchange_rate_tax_detail_created_at = now();

                ExchangeRateTaxDetail::updateOrCreate([
                    'EXCHANGE_RATE_TAX_ID' => $exchange_rate_tax,
                    'EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID' => $exchange_rate_tax_detail_currency_id,
                ],
                [
                    'EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE' => $exchange_rate_tax_detail_exchange_rate,
                    'EXCHANGE_RATE_TAX_DETAIL_CREATED_BY' => $exchange_rate_tax_detail_created_by,
                    'EXCHANGE_RATE_TAX_DETAIL_CREATED_AT' => $exchange_rate_tax_detail_created_at

                ]
            );

                // Created Log CA
                UserLog::create([
                    'created_by' => $user->id,
                    'action'     => json_encode([
                        "description" => "Created (Exchange Rate Tax Detail).",
                        "module"      => "Exchange Rate Tax Detail",
                        "id"          => $exchange_rate_tax
                    ]),
                    'action_by'  => $user->user_login
                ]);
            }
            
            return $exchange_rate_tax;
        });

        return new JsonResponse([
            'msg' => 'New Exchange Rate Tax has been added.',
            'id' => $exchange_rate_tax_id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function exchange_rate_tax_edit(Request $request)
    {
        DB::transaction(function() use ($request) {
            $user = Auth::user();
            $user_id = $user->id;

            $exchange_rate_tax_id = $request->EXCHANGE_RATE_TAX_ID;
            $exchange_rate_tax_detail_id = $request->EXCHANGE_RATE_TAX_DETAIL_ID;

            ExchangeRateTax::where('EXCHANGE_RATE_TAX_ID', $exchange_rate_tax_id)->update([
                'EXCHANGE_RATE_TAX_UPDATED_BY' => $user_id,
                'EXCHANGE_RATE_TAX_UPDATED_AT' => now()
            ]);

            // Created Log Exchange Rate Tax
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate Tax).",
                    "module"      => "Exchange Rate Tax",
                    "id"          => $exchange_rate_tax_id
                ]),
                'action_by'  => $user->user_login
            ]);

            ExchangeRateTaxDetail::where('EXCHANGE_RATE_TAX_DETAIL_ID', $exchange_rate_tax_detail_id)->update([
                'EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE' => $request->EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE,
                'EXCHANGE_RATE_TAX_DETAIL_UPDATED_BY' => $user_id,
                'EXCHANGE_RATE_TAX_DETAIL_UPDATED_AT' => now()
            ]);

            // Created Log Exchange Rate Tax Detail
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate Tax Detail).",
                    "module"      => "Exchange Rate Tax Detail",
                    "id"          => $exchange_rate_tax_detail_id
                ]),
                'action_by'  => $user->user_login
            ]);
        });

        return new JsonResponse([
            'msg' => 'Exchange Rate Tax has been edited.',
            'id' => $request->EXCHANGE_RATE_TAX_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function exchange_rate_tax_download_template()
    {
        $document_filename = "exchange_rate_tax_template.xlsx";

        $filePath = public_path('/storage/documents/ExchangeRateTax/' . $document_filename);

        $headers = [
            'filename' => $document_filename
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $document_filename, $headers);
        } else {
            abort(404, 'File not found');
        }
    }
}