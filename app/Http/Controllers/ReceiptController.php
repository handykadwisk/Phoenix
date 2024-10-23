<?php

namespace App\Http\Controllers;

use App\Models\COA;
use App\Models\Journal;
use App\Models\JournalDetail;
use App\Models\RBankTransaction;
use App\Models\RCurrency;
use App\Models\Receipt;
use App\Models\Relation;
use App\Models\TCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Number;
use Inertia\Inertia;

use function App\Helpers\user_log_create;

class ReceiptController extends Controller
{
    public function getReceiptData($dataPerPage = 2, $searchQuery = null)
    {
        $data = Receipt::orderBy('RECEIPT_ID', 'desc');

        if ($searchQuery) {
            # code...
        }

        return $data->paginate($dataPerPage);
    }

    public function getReceipt(Request $request)
    {
        $data = $this->getReceiptData(10, $request);
        return response()->json($data);
    }

    public function getReceiptById(string $id) 
    {
        $data = Receipt::findOrFail($id);
        
        return response()->json($data);
    }

    public function getClient()
    { 
        $data = Relation::all();

        return response()->json($data);
    }

    public function getCurrency()
    { 
        $data = RCurrency::all();

        return response()->json($data);
    }

    public function getBankAccount()
    { 
        $data = RBankTransaction::all();

        return response()->json($data);
    }

    public function generateReceiptNumber($year, $month)
    {
        $y = $year;
        $m = $month;

        $result = DB::table('t_receipt')
                ->select(DB::raw('MAX(SUBSTRING(RECEIPT_NUMBER, 7, 5)) as MAX_RECEIPT'))
                ->whereRaw("RECEIPT_NUMBER REGEXP '{$y}.[0-9]{2}.[0-9]{5}/RCP'")
                ->first();

        if ($result && $result->MAX_RECEIPT) {
            $max_number = $result->MAX_RECEIPT + 1;
            $five_digit_number = sprintf("%05d", $max_number);
        } else {
            $five_digit_number = '00001';
        }

        $receipt_number = $y . '.' . $m . '.' .$five_digit_number . '/RCP';

        return $receipt_number;
    }

    public function generateJournalNumber($type)
    {
        $typeleng = strlen($type);
        $maxJournalQuery = DB::table('t_journal')
            ->select(DB::raw('MAX(SUBSTRING(JOURNAL_NUMBER, 5, 6)) AS MAX_JOURNAL'))
            ->whereRaw("JOURNAL_NUMBER REGEXP '[A-Z]{{$typeleng}}.[0-9]{6}'")
            ->first();

        if ($maxJournalQuery && $maxJournalQuery->MAX_JOURNAL) {
            $max_number = $maxJournalQuery->MAX_JOURNAL + 1;
            $five_digit_number = sprintf("%06d", $max_number);
        } else {
            $five_digit_number = '000001';
        }

        $journal_number = $type . '.' . $five_digit_number;
		
		return $journal_number;
    }

    public function getReceiptAll(string $id)
    {
        return Receipt::where('RECEIPT_ID', $id)->first();
    }

    public function getCoaTitle($coa_code)
    {
        return COA::where('COA_CODE', $coa_code)->value('COA_TITLE') ?? '';
    }

    public function getCoaBank($bank_id)
    {
        return RBankTransaction::where('BANK_TRANSACTION_ID', $bank_id)->value('BANK_TRANSACTION_COA_CODE') ?? '';
    }

    public function index()
    {
        return Inertia::render('Receipt/Receipt');
    }

    public function receipt_add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'RECEIPT_RELATION_ORGANIZATION_ID' => 'required',
            'RECEIPT_CURRENCY_ID' => 'required',
            'RECEIPT_BANK_ID' => 'required',
            'RECEIPT_DATE' => 'required',
            'RECEIPT_VALUE' => 'required',
        ], [
            'RECEIPT_RELATION_ORGANIZATION_ID.required' => 'The client name field is required',
            'RECEIPT_CURRENCY_ID.required' => 'The currency field is required',
            'RECEIPT_BANK_ID.required' => 'The bank name field is required',
            'RECEIPT_VALUE.required' => 'The receipt value field is required'
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        DB::transaction(function () use ($request) {
            $user_id = Auth::user()->id;
            $is_draft = $request->RECEIPT_IS_DRAFT;
            $dateTime = now();

            if ($is_draft === 0) {
                $year = date('y', strtotime($request->RECEIPT_DATE));
                $month = date('m', strtotime($request->RECEIPT_DATE));
                
                $receipt_number = $this->generateReceiptNumber($year, $month);
            } else {
                $receipt_number = null;
            }

            // Create Receipt
            $receipt = Receipt::create([
                'RECEIPT_CURRENCY_ID' => $request->RECEIPT_CURRENCY_ID['value'],
                'RECEIPT_BANK_ID' => $request->RECEIPT_BANK_ID['value'],
                'RECEIPT_RELATION_ORGANIZATION_ID' => $request->RECEIPT_RELATION_ORGANIZATION_ID['value'],
                'RECEIPT_NUMBER' => $receipt_number,
                'RECEIPT_NAME' => $request->RECEIPT_RELATION_ORGANIZATION_ID['label'],
                'RECEIPT_DATE' => $request->RECEIPT_DATE,
                'RECEIPT_VALUE' => $request->RECEIPT_VALUE,
                'RECEIPT_COUNTED_AS' => Number::spell($request->RECEIPT_VALUE, locale: 'id'),
                'RECEIPT_MEMO' => $request->RECEIPT_MEMO,
                'RECEIPT_IS_DRAFT' => $is_draft,
                'RECEIPT_CREATED_BY' => $user_id,
                'RECEIPT_CREATED_AT' => $dateTime
            ])->RECEIPT_ID;
            
            // Create log Receipt
            user_log_create("Created (Receipt).", "Receipt", $receipt);
            
            // Create Journal
            if ($is_draft === 0) {
                $getReceipt= $this->getReceiptAll($receipt);

                $journal_type_code = 'PRJ';
                $journal_number = $this->generateJournalNumber($journal_type_code);
                $journal_date = $getReceipt->RECEIPT_DATE;
                $journal_memo = "Receipt No. " . $getReceipt->RECEIPT_NUMBER;

                $journal = Journal::create([
                    'JOURNAL_NUMBER' => $journal_number,
                    'JOURNAL_TYPE_CODE' => $journal_type_code,
                    'JOURNAL_DATE' => $journal_date,
                    'JOURNAL_MEMO' => $journal_memo,
                    'JOURNAL_IS_POSTED' => 1,
                    'JOURNAL_POSTED_BY' => $user_id,
                    'JOURNAL_POSTED_AT' => $dateTime,
                    'JOURNAL_CREATED_BY' => $user_id,
                    'JOURNAL_CREATED_AT' => $dateTime
                ])->JOURNAL_ID;

                // Create log Journal
                user_log_create("Created (Journal).", "Journal", $journal);

                // PRJ Bank
                $journal_detail_coa_code = $this->getCoaBank($getReceipt->RECEIPT_BANK_ID);
                $journal_detail_desc = $this->getCoaTitle($journal_detail_coa_code);
                $journal_detail_currency_id = $getReceipt->RECEIPT_CURRENCY_ID;
                $journal_detail_orig = $getReceipt->RECEIPT_VALUE;
                $journal_detail_ex_rate = 1;
                $journal_detail_sum = $journal_detail_orig * $journal_detail_ex_rate;
                $journal_detail_type = 1;

                $journal_detail_prj_bank = JournalDetail::create([
                    'JOURNAL_ID' => $journal,
                    'JOURNAL_DETAIL_COA_CODE' => $journal_detail_coa_code,
                    'JOURNAL_DETAIL_DESC' => $journal_detail_desc,
                    'JOURNAL_DETAIL_CURRENCY_ID' => $journal_detail_currency_id,
                    'JOURNAL_DETAIL_ORIG' => $journal_detail_orig,
                    'JOURNAL_DETAIL_EX_RATE' => $journal_detail_ex_rate,
                    'JOURNAL_DETAIL_SUM' => $journal_detail_sum,
                    'JOURNAL_DETAIL_TYPE' => $journal_detail_type,
                    'JOURNAL_DETAIL_CREATED_BY' => $user_id,
                    'JOURNAL_DETAIL_CREATED_AT' => $dateTime
                ])->JOURNAL_DETAIL_ID;
                
                // Create log Journal Detail
                user_log_create("Created (Journal Detail).", "Journal", $journal_detail_prj_bank);

                // Bukan PRJ Bank
                $journal_detail_coa_code = '21370';
                $journal_detail_desc = $this->getCoaTitle($journal_detail_coa_code);
                $journal_detail_currency_id = $getReceipt->RECEIPT_CURRENCY_ID;
                $journal_detail_orig = $getReceipt->RECEIPT_VALUE;
                $journal_detail_ex_rate = 1;
                $journal_detail_sum = $journal_detail_orig * $journal_detail_ex_rate;
                $journal_detail_type = 2;

                $journal_detail_not_prj_bank = JournalDetail::create([
                    'JOURNAL_ID' => $journal,
                    'JOURNAL_DETAIL_COA_CODE' => $journal_detail_coa_code,
                    'JOURNAL_DETAIL_DESC' => $journal_detail_desc,
                    'JOURNAL_DETAIL_CURRENCY_ID' => $journal_detail_currency_id,
                    'JOURNAL_DETAIL_ORIG' => $journal_detail_orig,
                    'JOURNAL_DETAIL_EX_RATE' => $journal_detail_ex_rate,
                    'JOURNAL_DETAIL_SUM' => $journal_detail_sum,
                    'JOURNAL_DETAIL_TYPE' => $journal_detail_type,
                    'JOURNAL_DETAIL_CREATED_BY' => $user_id,
                    'JOURNAL_DETAIL_CREATED_AT' => $dateTime
                ])->JOURNAL_DETAIL_ID;

                // Create log Journal Detail
                user_log_create("Created (Journal Detail).", "Journal", $journal_detail_not_prj_bank);
            }
        });

        return new JsonResponse([
            'New receipt has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function receipt_draft(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'RECEIPT_RELATION_ORGANIZATION_ID' => 'required',
        //     'RECEIPT_CURRENCY_ID' => 'required',
        //     'RECEIPT_BANK_ID' => 'required',
        //     'RECEIPT_DATE' => 'required',
        //     'RECEIPT_VALUE' => 'required',
        // ], [
        //     'RECEIPT_RELATION_ORGANIZATION_ID.required' => 'The client name field is required',
        //     'RECEIPT_CURRENCY_ID.required' => 'The currency field is required',
        //     'RECEIPT_BANK_ID.required' => 'The bank name field is required',
        //     'RECEIPT_VALUE.required' => 'The receipt value field is required'
        // ]);

        // if ($validator->fails()) {
        //     return new JsonResponse([
        //         $validator->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }
        
        // DB::transaction(function () use ($request) {
        //     $user_id = Auth::user()->id;
        //     $dateTime = now();

        //     $receipt_id = $request->RECEIPT_ID;
        //     $is_draft = $request->RECEIPT_IS_DRAFT;
        //     if ($is_draft === 0) {
        //         $year = date('y', strtotime($request->RECEIPT_DATE));
        //         $month = date('m', strtotime($request->RECEIPT_DATE));
                
        //         $receipt_number = $this->generateReceiptNumber($year, $month);
        //     } else {
        //         $receipt_number = null;
        //     }

        //     // Create Receipt
        //     Receipt::where('RECEIPT_ID', $receipt_id)->update([
        //         'RECEIPT_CURRENCY_ID' => $request->RECEIPT_CURRENCY_ID,
        //         'RECEIPT_BANK_ID' => $request->RECEIPT_BANK_ID,
        //         'RECEIPT_RELATION_ORGANIZATION_ID' => $request->RECEIPT_RELATION_ORGANIZATION_ID,
        //         'RECEIPT_NUMBER' => $receipt_number,
        //         'RECEIPT_NAME' => $request->RECEIPT_RELATION_ORGANIZATION_ID,
        //         'RECEIPT_DATE' => $request->RECEIPT_DATE,
        //         'RECEIPT_VALUE' => $request->RECEIPT_VALUE,
        //         'RECEIPT_COUNTED_AS' => Number::spell($request->RECEIPT_VALUE, locale: 'id'),
        //         'RECEIPT_MEMO' => $request->RECEIPT_MEMO,
        //         'RECEIPT_IS_DRAFT' => $is_draft
        //     ]);
            
        //     // Create log Receipt
        //     user_log_create("Created (Receipt).", "Receipt", $receipt_id);

        //     // Create Journal
        //     if ($is_draft === 0) {
        //         $getReceipt= $this->getReceiptAll($receipt_id);

        //         $journal_type_code = 'PRJ';
        //         $journal_number = $this->generateJournalNumber($journal_type_code);
        //         $journal_date = $getReceipt->RECEIPT_DATE;
        //         $journal_memo = "Receipt No. " . $getReceipt->RECEIPT_NUMBER;

        //         $journal = Journal::create([
        //             'JOURNAL_NUMBER' => $journal_number,
        //             'JOURNAL_TYPE_CODE' => $journal_type_code,
        //             'JOURNAL_DATE' => $journal_date,
        //             'JOURNAL_MEMO' => $journal_memo,
        //             'JOURNAL_IS_POSTED' => 1,
        //             'JOURNAL_POSTED_BY' => $user_id,
        //             'JOURNAL_POSTED_AT' => $dateTime,
        //             'JOURNAL_CREATED_BY' => $user_id,
        //             'JOURNAL_CREATED_AT' => $dateTime
        //         ])->JOURNAL_ID;

        //         // Create log Journal
        //         user_log_create("Created (Journal).", "Journal", $journal);

        //         // PRJ Bank
        //         $journal_detail_coa_code = $this->getCoaBank($getReceipt->RECEIPT_BANK_ID);
        //         $journal_detail_desc = $this->getCoaTitle($journal_detail_coa_code);
        //         $journal_detail_currency_id = $getReceipt->RECEIPT_CURRENCY_ID;
        //         $journal_detail_orig = $getReceipt->RECEIPT_VALUE;
        //         $journal_detail_ex_rate = 1;
        //         $journal_detail_sum = $journal_detail_orig * $journal_detail_ex_rate;
        //         $journal_detail_type = 1;

        //         $journal_detail_prj_bank = JournalDetail::create([
        //             'JOURNAL_ID' => $journal,
        //             'JOURNAL_DETAIL_COA_CODE' => $journal_detail_coa_code,
        //             'JOURNAL_DETAIL_DESC' => $journal_detail_desc,
        //             'JOURNAL_DETAIL_CURRENCY_ID' => $journal_detail_currency_id,
        //             'JOURNAL_DETAIL_ORIG' => $journal_detail_orig,
        //             'JOURNAL_DETAIL_EX_RATE' => $journal_detail_ex_rate,
        //             'JOURNAL_DETAIL_SUM' => $journal_detail_sum,
        //             'JOURNAL_DETAIL_TYPE' => $journal_detail_type,
        //             'JOURNAL_DETAIL_CREATED_BY' => $user_id,
        //             'JOURNAL_DETAIL_CREATED_AT' => $dateTime
        //         ])->JOURNAL_DETAIL_ID;
                
        //         // Create log Journal Detail
        //         user_log_create("Created (Journal Detail).", "Journal", $journal_detail_prj_bank);

        //         // Bukan PRJ Bank
        //         $journal_detail_coa_code = '21370';
        //         $journal_detail_desc = $this->getCoaTitle($journal_detail_coa_code);
        //         $journal_detail_currency_id = $getReceipt->RECEIPT_CURRENCY_ID;
        //         $journal_detail_orig = $getReceipt->RECEIPT_VALUE;
        //         $journal_detail_ex_rate = 1;
        //         $journal_detail_sum = $journal_detail_orig * $journal_detail_ex_rate;
        //         $journal_detail_type = 2;

        //         $journal_detail_not_prj_bank = JournalDetail::create([
        //             'JOURNAL_ID' => $journal,
        //             'JOURNAL_DETAIL_COA_CODE' => $journal_detail_coa_code,
        //             'JOURNAL_DETAIL_DESC' => $journal_detail_desc,
        //             'JOURNAL_DETAIL_CURRENCY_ID' => $journal_detail_currency_id,
        //             'JOURNAL_DETAIL_ORIG' => $journal_detail_orig,
        //             'JOURNAL_DETAIL_EX_RATE' => $journal_detail_ex_rate,
        //             'JOURNAL_DETAIL_SUM' => $journal_detail_sum,
        //             'JOURNAL_DETAIL_TYPE' => $journal_detail_type,
        //             'JOURNAL_DETAIL_CREATED_BY' => $user_id,
        //             'JOURNAL_DETAIL_CREATED_AT' => $dateTime
        //         ])->JOURNAL_DETAIL_ID;

        //         // Create log Journal Detail
        //         user_log_create("Created (Journal Detail).", "Journal", $journal_detail_not_prj_bank);
        //     }
        // });

        // return new JsonResponse([
        //     'New receipt has been added.'
        // ], 201, [
        //     'X-Inertia' => true
        // ]);
    }
}