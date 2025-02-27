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

use function App\Helpers\user_log_create;

class ExchangeRateBIController extends Controller
{
    public function getExchangeRateBIData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = ExchangeRateBI::query();
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
                $query->where('EXCHANGE_RATE_BI_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }else{
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'EXCHANGE_RATE_BI_DATE') {
                        $query->where('EXCHANGE_RATE_BI_DATE', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $query->orderBy('EXCHANGE_RATE_BI_DATE', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }
    
    public function getExchangeRateBI(Request $request)
    {
        $data = $this->getExchangeRateBIData($request);
        
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
        $exchange_rate_bi_id = "";
        
        $exchange_rate_bi_id = DB::transaction(function () use ($request) {
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

            // Created Log Exchange Rate BI
            user_log_create("Created (Exchange Rate BI).", "Exchange Rate BI", $exchange_rate_bi);

            foreach ($exchange_rate_bi_detail as $value) {
                $exchange_rate_bi_detail_currency_id = isset($value['EXCHANGE_RATE_BI_DETAIL_CURRENCY_ID']) ? $value['EXCHANGE_RATE_BI_DETAIL_CURRENCY_ID'] : $value['CURRENCY_ID'];

                $exchange_rate_bi_detail_exchange_rate = $value['EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE'];
                $exchange_rate_bi_detail_created_by = $user_id;
                $exchange_rate_bi_detail_created_at = now();

                ExchangeRateBIDetail::updateOrCreate([
                    'EXCHANGE_RATE_BI_ID' => $exchange_rate_bi,
                    'EXCHANGE_RATE_BI_DETAIL_CURRENCY_ID' => $exchange_rate_bi_detail_currency_id,
                ],
                [
                    'EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE' => $exchange_rate_bi_detail_exchange_rate,
                    'EXCHANGE_RATE_BI_DETAIL_CREATED_BY' => $exchange_rate_bi_detail_created_by,
                    'EXCHANGE_RATE_BI_DETAIL_CREATED_AT' => $exchange_rate_bi_detail_created_at

                ]);
            
                // Created Log Exchange Rate BI Detail
                user_log_create("Created (Exchange Rate BI Detail).", "Exchange Rate BI", $exchange_rate_bi);
            }
            return $exchange_rate_bi;
        });
        
        return new JsonResponse([
            'msg' => 'New Exchange Rate BI has been added.',
            'id' => $exchange_rate_bi_id
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
            user_log_create("Edit (Exchange Rate BI).", "Exchange Rate BI", $exchange_rate_bi_id);

            ExchangeRateBIDetail::where('EXCHANGE_RATE_BI_DETAIL_ID', $exchange_rate_bi_detail_id)->update([
                'EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE' => $request->EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE,
                'EXCHANGE_RATE_BI_DETAIL_UPDATED_BY' => $user_id,
                'EXCHANGE_RATE_BI_DETAIL_UPDATED_AT' => now()
            ]);

            // Created Log Exchange Rate BI Detail
            user_log_create("Edit (Exchange Rate BI Detail).", "Exchange Rate BI", $exchange_rate_bi_detail_id);
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