<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRateBI;
use App\Models\ExchangeRateBIDetail;
use App\Models\RCurrency;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ExchangeRateBIController extends Controller
{
    public function getExchangeRateBIData($dataPerPage = 2, $searchQuery = null)
    {
        $exchange_rate_bi_date = $searchQuery->exchange_rate_bi_date;

        $data = ExchangeRateBI::orderBy('EXCHANGE_RATE_BI_ID', 'desc');
        
        if ($searchQuery) {
            if ($searchQuery->input('exchange_rate_bi_date')) {
                $data->where('EXCHANGE_RATE_BI_DATE', 'like', '%'. $exchange_rate_bi_date .'%');;
            }
        }

        return $data->paginate($dataPerPage);
    }
    
    public function getExchangeRateBI(Request $request)
    {
        $data = $this->getExchangeRateBIData(10, $request);
        
        return response()->json($data);
    }

    public function getExchangeRateBIByDate($date) 
    {
        $data = ExchangeRateBI::where('EXCHANGE_RATE_BI_DATE', $date)->first();
        
        return response()->json($data);
    }

    public function getExchangeRateBIById(string $id) 
    {
        $data = ExchangeRateBI::findOrFail($id);
        
        return response()->json($data);
    }

    public function getExchangeRateBIDetailById(string $id) 
    {
        $data = ExchangeRateBIDetail::findOrFail($id);
        
        return response()->json($data);
    }

    public function getCurrencies()
    {
        $data = RCurrency::all();

        return response()->json($data);
    }
    
    public function index()
    {
        return Inertia::render('ExchangeRateBI/ExchangeRateBI');
    }

    public function exchange_rate_bi_add(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;

            $exchange_rate_bi_detail = $request->exchange_rate_bi_detail;

            $exchange_rate_bi_date = $request->exchange_rate_bi_date;
            $exchange_rate_bi_created_by = $user_id;
            $exchange_rate_bi_created_at = now();

            $exchange_rate_bi = ExchangeRateBI::updateOrCreate(
                [
                'EXCHANGE_RATE_BI_DATE' => $exchange_rate_bi_date,
            ],[
                'EXCHANGE_RATE_BI_CREATED_BY' => $exchange_rate_bi_created_by,
                'EXCHANGE_RATE_BI_CREATED_AT' => $exchange_rate_bi_created_at
            ])->EXCHANGE_RATE_BI_ID;

            // Created Log CA
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate BI).",
                    "module"      => "Exchange Rate BI",
                    "id"          => $exchange_rate_bi
                ]),
                'action_by'  => $user->email
            ]);

            foreach ($exchange_rate_bi_detail as $value) {
                // $exchange_rate_bi_detail_id = $value['EXCHANGE_RATE_BI_DETAIL_ID'];
                $exchange_rate_bi_detail_currency_id = $value['CURRENCY_ID'];
                $exchange_rate_bi_detail_exchange_rate = $value['EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE'];
                $exchange_rate_bi_detail_created_by = $user_id;
                $exchange_rate_bi_detail_created_at = now();

                ExchangeRateBIDetail::create(
                // [
                //     'EXCHANGE_RATE_BI_DETAIL_ID' => $exchange_rate_bi_detail_id,
                // ],
                [
                    'EXCHANGE_RATE_BI_ID' => $exchange_rate_bi,
                    'EXCHANGE_RATE_BI_DETAIL_CURRENCY_ID' => $exchange_rate_bi_detail_currency_id,
                    'EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE' => $exchange_rate_bi_detail_exchange_rate,
                    'EXCHANGE_RATE_BI_DETAIL_CREATED_BY' => $exchange_rate_bi_detail_created_by,
                    'EXCHANGE_RATE_BI_DETAIL_CREATED_AT' => $exchange_rate_bi_detail_created_at

                ]
            );

                // Created Log CA
                UserLog::create([
                    'created_by' => $user->id,
                    'action'     => json_encode([
                        "description" => "Created (Exchange Rate BI Detail).",
                        "module"      => "Exchange Rate BI Detail",
                        "id"          => $exchange_rate_bi
                    ]),
                    'action_by'  => $user->email
                ]);
            }
        });

        return new JsonResponse([
            'New Exchange Rate BI has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function exchange_rate_bi_edit(Request $request)
    {
        DB::transaction(function() use ($request) {
            $user = Auth::user();
            $user_id = $user->id;

            $exchange_rate_bi_id = $request->EXCHANGE_RATE_BI_ID;
            $exchange_rate_bi_detail_id = $request->EXCHANGE_RATE_BI_DETAIL_ID;

            ExchangeRateBI::where('EXCHANGE_RATE_BI_ID', $exchange_rate_bi_id)->update([
                'EXCHANGE_RATE_BI_UPDATED_BY' => $user_id,
                'EXCHANGE_RATE_BI_UPDATED_AT' => now()
            ]);

            // Created Log Exchange Rate BI
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate BI).",
                    "module"      => "Exchange Rate BI",
                    "id"          => $exchange_rate_bi_id
                ]),
                'action_by'  => $user->email
            ]);

            ExchangeRateBIDetail::where('EXCHANGE_RATE_BI_DETAIL_ID', $exchange_rate_bi_detail_id)->update([
                'EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE' => $request->EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE,
                'EXCHANGE_RATE_BI_DETAIL_UPDATED_BY' => $user_id,
                'EXCHANGE_RATE_BI_DETAIL_UPDATED_AT' => now()
            ]);

            // Created Log Exchange Rate BI Detail
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Created (Exchange Rate BI Detail).",
                    "module"      => "Exchange Rate BI Detail",
                    "id"          => $exchange_rate_bi_detail_id
                ]),
                'action_by'  => $user->email
            ]);
        });

        return new JsonResponse([
            'msg' => 'Exchange Rate BI has been edited.',
            'id' => $request->EXCHANGE_RATE_BI_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function exchange_rate_bi_download_template()
    {
        $document_filename = "exchange_rate_bi_template.xlsx";

        $filePath = public_path('/storage/documents/ExchangeRateBI/' . $document_filename);

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