<?php

namespace App\Http\Controllers;

use App\Models\COA;
use App\Models\RBank;
use App\Models\RBankTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use function App\Helpers\user_log_create;

class BankTransactionController extends Controller
{
    public function getBankTransactionData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = RBankTransaction::query();
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
            foreach ($newSearch as $searchValue) {
                if ($searchValue['BANK_TRANSACTION_NAME']) {
                    $query->where('BANK_TRANSACTION_NAME', 'LIKE', '%' . $searchValue['BANK_TRANSACTION_NAME'] . '%');
                }
            }
        }

        $query->orderBy('BANK_TRANSACTION_ID', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getBankTransaction(Request $request)
    {
        $data = $this->getBankTransactionData($request);
        
        return response()->json($data);
    }

    public function getBankTransactionById(string $id) 
    {
        $data = RBankTransaction::findOrFail($id);

        return response()->json($data);
    }

    public function getBank()
    {
        $data = RBank::all();

        return response()->json($data);
    }

    public function getCOABankTransaction()
    {
        $data = COA::all();

        return response()->json($data);
    }
    
    public function index()
    {
        return Inertia::render('BankTransaction/BankTransaction');
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), 
            [
                'BANK_TRANSACTION_NAME' => 'required',
                'BANK_TRANSACTION_CURRENCY_ID' => 'required',
                'BANK_TRANSACTION_ACCOUNT_NUMBER' => 'required',
                'BANK_TRANSACTION_ACCOUNT_NAME' => 'required',
            ],
            [
                'BANK_TRANSACTION_NAME.required' => 'The title field is required.',
                'BANK_TRANSACTION_CURRENCY_ID.required' => 'The currency field is required.',
                'BANK_TRANSACTION_ACCOUNT_NUMBER.required' => 'The account number field is required.',
                'BANK_TRANSACTION_ACCOUNT_NAME.required' => 'The account name field is required.',
            ]
        );

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        
        DB::transaction(function () use ($request) {
            $bank_id = isset($request->BANK_ID) ? $request->BANK_ID['code'] : $request->BANK_ID;
            $bank_transaction_coa_code = isset($request->BANK_TRANSACTION_COA_CODE) ? $request->BANK_TRANSACTION_COA_CODE['code'] : $request->BANK_TRANSACTION_COA_CODE;
            
            // Create Bank Transaction
            $bank_transaction = RBankTransaction::create([
                'BANK_ID' => $bank_id,
                'BANK_TRANSACTION_NAME' => $request->BANK_TRANSACTION_NAME,
                'BANK_TRANSACTION_COA_CODE' => $bank_transaction_coa_code,
                'BANK_TRANSACTION_ACCOUNT_NUMBER' => $request->BANK_TRANSACTION_ACCOUNT_NUMBER,
                'BANK_TRANSACTION_ACCOUNT_NAME' => $request->BANK_TRANSACTION_ACCOUNT_NAME,
                'BANK_TRANSACTION_CURRENCY_ID' => $request->BANK_TRANSACTION_CURRENCY_ID['value'],
                'BANK_TRANSACTION_NAME_INVOICE' => $request->BANK_TRANSACTION_NAME_INVOICE,
                'BANK_TRANSACTION_FOR_INVOICE' => $request->BANK_TRANSACTION_FOR_INVOICE,
                'BANK_TRANSACTION_FOR_INVOICE_DEFAULT' => $request->BANK_TRANSACTION_FOR_INVOICE_DEFAULT,
                'BANK_TRANSACTION_ADDRESS' => $request->BANK_TRANSACTION_ADDRESS,
                'BANK_TRANSACTION_CREATED_BY' => Auth::user()->id,
                'BANK_TRANSACTION_CREATED_AT' => now(),
            ])->BANK_TRANSACTION_ID;

            // Created Log Bank Transaction
            user_log_create("Created (Bank Transaction).", "Bank Transaction", $bank_transaction);
        });

        return new JsonResponse([
            'msg' => 'New bank transaction has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), 
            [
                'BANK_TRANSACTION_NAME' => 'required',
                'BANK_TRANSACTION_CURRENCY_ID' => 'required',
                'BANK_TRANSACTION_ACCOUNT_NUMBER' => 'required',
                'BANK_TRANSACTION_ACCOUNT_NAME' => 'required',
            ],
            [
                'BANK_TRANSACTION_NAME.required' => 'The title field is required.',
                'BANK_TRANSACTION_CURRENCY_ID.required' => 'The currency field is required.',
                'BANK_TRANSACTION_ACCOUNT_NUMBER.required' => 'The account number field is required.',
                'BANK_TRANSACTION_ACCOUNT_NAME.required' => 'The account name field is required.',
            ]
        );

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        // dd($request);

        DB::transaction(function () use ($request) {
            $bank_transaction_id = $request->BANK_TRANSACTION_ID;
            
            // Update Bank Transaction
            RBankTransaction::where('BANK_TRANSACTION_ID', $bank_transaction_id)->update([
                'BANK_ID' => $request->BANK_ID,
                'BANK_TRANSACTION_NAME' => $request->BANK_TRANSACTION_NAME,
                'BANK_TRANSACTION_COA_CODE' => $request->BANK_TRANSACTION_COA_CODE,
                'BANK_TRANSACTION_ACCOUNT_NUMBER' => $request->BANK_TRANSACTION_ACCOUNT_NUMBER,
                'BANK_TRANSACTION_ACCOUNT_NAME' => $request->BANK_TRANSACTION_ACCOUNT_NAME,
                'BANK_TRANSACTION_CURRENCY_ID' => $request->BANK_TRANSACTION_CURRENCY_ID,
                'BANK_TRANSACTION_NAME_INVOICE' => $request->BANK_TRANSACTION_NAME_INVOICE,
                'BANK_TRANSACTION_FOR_INVOICE' => $request->BANK_TRANSACTION_FOR_INVOICE,
                'BANK_TRANSACTION_FOR_INVOICE_DEFAULT' => $request->BANK_TRANSACTION_FOR_INVOICE_DEFAULT,
                'BANK_TRANSACTION_ADDRESS' => $request->BANK_TRANSACTION_ADDRESS,
                'BANK_TRANSACTION_UPDATED_BY' => Auth::user()->id,
                'BANK_TRANSACTION_UPDATED_AT' => now(),
            ]);

            // Created Log Bank Transaction
            user_log_create("Edit (Bank Transaction).", "Bank Transaction", $bank_transaction_id);
        });

        return new JsonResponse([
            'msg' => 'New bank transaction has been edited.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}