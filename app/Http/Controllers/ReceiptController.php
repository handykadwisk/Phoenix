<?php

namespace App\Http\Controllers;

use App\Models\COA;
use App\Models\Journal;
use App\Models\JournalDeleted;
use App\Models\JournalDetail;
use App\Models\JournalDetailDeleted;
use App\Models\RBankTransaction;
use App\Models\RCurrency;
use App\Models\Receipt;
use App\Models\Relation;
use App\Models\RJournalSetting;
use App\Models\RSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Number;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function App\Helpers\user_log_create;

class ReceiptController extends Controller
{
    public function getReceiptData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Receipt::query();
        $sortModel = $request->input('sort');
        $newSearch = json_decode($request->newFilter, true);
        $filterModel = json_decode($request->input('filter'), true);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('RECEIPT_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }

            foreach ($newSearch as $searchValue) {
                if ($searchValue['CLIENT_NAME']) {
                    $query->where('RECEIPT_NUMBER', 'LIKE', '%'. $searchValue['CLIENT_NAME'] .'%')
                    ->orWhereHas('relation_organization', function($client) use ($searchValue) {
                        $client->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%'. $searchValue['CLIENT_NAME'] .'%');
                    })
                    ->orWhereHas('bank_account', function($bank_account) use ($searchValue) {
                        $bank_account->whereHas('bank', function($bank) use ($searchValue) {
                            $bank->where('BANK_NAME', 'LIKE', '%' . $searchValue['CLIENT_NAME'] . '%')
                                 ->orWhere('BANK_ABBREVIATION', 'LIKE', '%' . $searchValue['CLIENT_NAME'] . '%');
                        });
                    })
                    ;
                }
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $filterModelKey) {
                foreach ($filterModelKey as $filterValue) {
                    if ($filterValue === "Open") {
                        $query->where('RECEIPT_STATUS', 2);
                    } else if ($filterValue === "Draft") {
                        $query->where('RECEIPT_STATUS', 1);
                    }
                }
            }
        }

        $query->whereNull('deleted_at')
              ->orderBy('RECEIPT_STATUS', 'asc')
              ->orderBy('RECEIPT_NUMBER', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getReceipt(Request $request)
    {
        $data = $this->getReceiptData($request);
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
        // Ambil data dengan kondisi
        $premi = RBankTransaction::where('BANK_TRANSACTION_NAME', 'like', '%premi%')->get();
        $nonPremi = RBankTransaction::where('BANK_TRANSACTION_NAME', 'not like', '%premi%')->get();

        // Strukturkan data untuk frontend
        $data = [
            [
                'label' => 'Premi',
                'options' => $premi->map(function ($item) {
                    return [
                        'value' => $item->BANK_TRANSACTION_ID,
                        'label' => $item->BANK_TRANSACTION_NAME,
                    ];
                }),
            ],
            [
                'label' => 'Operasional',
                'options' => $nonPremi->map(function ($item) {
                    return [
                        'value' => $item->BANK_TRANSACTION_ID,
                        'label' => $item->BANK_TRANSACTION_NAME,
                    ];
                }),
            ],
        ];

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

        $receipt_number = $y . '.' . $m . '.' . $five_digit_number . '/RCP';

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

    public function check_existing_exchange_rate($receiptDate, $currencyId)
    {
        $rate = DB::select("SELECT f_check_existing_ex_rate(?, ?) AS result", [$receiptDate, $currencyId]);

        return $rate[0]->result;
    }

    public function getExchangeRate($receiptDate, $currencyId)
    {
        $rate = DB::select("SELECT f_get_ex_rate(?, ?) AS exchange_rate", [$receiptDate, $currencyId]);

        return $rate[0]->exchange_rate;
    }

    public function switch_currency($currency, $receipt_counted_as)
    {
        $currencies = [
            1 => 'Rupiah',
            2 => 'Dollar',
            3 => 'Dollar',
            4 => 'Dollar',
            5 => 'Franc',
            6 => 'Yuan',
            7 => 'Yuan',
            8 => 'Krona',
            9 => 'Euro',
            10 => 'Pound',
            11 => 'Dollar',
            12 => 'Yen',
            13 => 'Won',
            14 => 'Dinar',
            15 => 'Kips',
            16 => 'Ringgit',
            17 => 'Krona',
            18 => 'Dollar',
            19 => 'Kina',
            20 => 'Peso',
            21 => 'Riyal',
            22 => 'Krona',
            23 => 'Dollar',
            24 => 'Baht',
            25 => 'Dollar',
            26 => 'Dong',
            27 => 'Kyat',
            28 => 'Rupee',
            29 => 'Rupee',
            30 => 'Rupee'
        ];

        if (isset($currencies[$currency])) {
            $receipt_counted_as .= ' ' . $currencies[$currency];
        }

        return $receipt_counted_as;
    }
    
    public function auto_journal_add_receipt($receiptId)
    {
        $userId = Auth::user()->id;
        $dateTime = now();

        $journal_setting = RJournalSetting::where('JOURNAL_SETTING_CODE', 'add_receipt')->first();

        $getReceipt= $this->getReceiptAll($receiptId);

        $journalTypeCode = $journal_setting->JOURNAL_SETTING_TYPE;
        $journalNumber = $this->generateJournalNumber($journalTypeCode);
        $journalDate = $getReceipt->RECEIPT_DATE;
        $journalMemo = "Receipt No. " . $getReceipt->RECEIPT_NUMBER;

        // dd($this->getExchangeRate($getReceipt->RECEIPT_DATE, $getReceipt->RECEIPT_CURRENCY_ID));

        $journalData = [
            'JOURNAL_NUMBER' => $journalNumber,
            'JOURNAL_TYPE_CODE' => $journalTypeCode,
            'JOURNAL_DATE' => $journalDate,
            'JOURNAL_MEMO' => $journalMemo,
            'JOURNAL_IS_POSTED' => 1,
            'JOURNAL_POSTED_BY' => $userId,
            'JOURNAL_POSTED_DATE' => $dateTime,
            'JOURNAL_CREATED_BY' => $userId,
            'JOURNAL_CREATED_DATE' => $dateTime
        ];

        $checkJournalAddReceipt = $this->check_journal_add_receipt($receiptId);

        if ($checkJournalAddReceipt) {
           Journal::where('JOURNAL_ID', $checkJournalAddReceipt)->update($journalData);
            $journalId = $checkJournalAddReceipt;
        } else {
            $journal = Journal::create($journalData)->JOURNAL_ID;
            $journalId = $journal;
        }

        // Create log Journal
        user_log_create("Created (Journal).", "Journal", $journalId);

        foreach ($journal_setting->journal_setting_detail as $value) {
            // PRJ Bank
            if ($value['JOURNAL_SETTING_DETAIL_TITLE'] === 'PRJ Bank') {
                $journalDetailCoaCode = $this->getCoaBank($getReceipt->RECEIPT_BANK_ID);
                $journalDetailDesc = $this->getCoaTitle($journalDetailCoaCode);
                $journalDetailCurrencyId = $getReceipt->RECEIPT_CURRENCY_ID;
                $journalDetailOrig = $getReceipt->RECEIPT_VALUE;
                $journalDetailExchangeRate = $this->getExchangeRate($getReceipt->RECEIPT_DATE, $getReceipt->RECEIPT_CURRENCY_ID);
                $journalDetailSum = abs($journalDetailOrig) * $journalDetailExchangeRate;
                $journalDetailSide = 1;

                $journalDetailPrjBankData = [
                    'JOURNAL_ID' => $journalId,
                    'JOURNAL_DETAIL_COA_CODE' => $journalDetailCoaCode,
                    'JOURNAL_DETAIL_DESC' => $journalDetailDesc,
                    'JOURNAL_DETAIL_CURRENCY_ID' => $journalDetailCurrencyId,
                    'JOURNAL_DETAIL_ORIG' => $journalDetailOrig,
                    'JOURNAL_DETAIL_EX_RATE' => $journalDetailExchangeRate,
                    'JOURNAL_DETAIL_SUM' => $journalDetailSum,
                    'JOURNAL_DETAIL_SIDE' => $journalDetailSide,
                    'JOURNAL_DETAIL_CREATED_BY' => $userId,
                    'JOURNAL_DETAIL_CREATED_DATE' => $dateTime
                ];

                if ($checkJournalAddReceipt) {
                    JournalDetail::where('JOURNAL_ID', $journalId)
                            ->where('JOURNAL_DETAIL_COA_CODE', $journalDetailCoaCode)
                            ->update($journalDetailPrjBankData);
                } else {
                    JournalDetail::create($journalDetailPrjBankData);
                }
                
                // Create log Journal Detail
                user_log_create("Created (Journal Detail).", "Journal", $journalId);
            }

            // Bukan PRJ Bank
            if ($value['JOURNAL_SETTING_DETAIL_TITLE'] !== 'PRJ Bank') {
                $journalDetailCoaCode = $value['JOURNAL_SETTING_DETAIL_COA'];
                $journalDetailDesc = $this->getCoaTitle($journalDetailCoaCode);
                $journalDetailCurrencyId = $getReceipt->RECEIPT_CURRENCY_ID;
                $journalDetailOrig = $getReceipt->RECEIPT_VALUE;
                $journalDetailExchangeRate = $this->getExchangeRate($getReceipt->RECEIPT_DATE, $getReceipt->RECEIPT_CURRENCY_ID);
                $journalDetailSum = abs($journalDetailOrig * $journalDetailExchangeRate);
                $journalDetailSide = $value['JOURNAL_SETTING_DETAIL_SIDE'];

                $journalDetailNotPrjBank = [
                    'JOURNAL_ID' => $journalId,
                    'JOURNAL_DETAIL_COA_CODE' => $journalDetailCoaCode,
                    'JOURNAL_DETAIL_DESC' => $journalDetailDesc,
                    'JOURNAL_DETAIL_CURRENCY_ID' => $journalDetailCurrencyId,
                    'JOURNAL_DETAIL_ORIG' => $journalDetailOrig,
                    'JOURNAL_DETAIL_EX_RATE' => $journalDetailExchangeRate,
                    'JOURNAL_DETAIL_SUM' => $journalDetailSum,
                    'JOURNAL_DETAIL_SIDE' => $journalDetailSide,
                    'JOURNAL_DETAIL_CREATED_BY' => $userId,
                    'JOURNAL_DETAIL_CREATED_DATE' => $dateTime
                ];

                if ($checkJournalAddReceipt) {
                    JournalDetail::where('JOURNAL_ID', $journalId)
                            ->where('JOURNAL_DETAIL_COA_CODE', $journalDetailCoaCode)
                            ->update($journalDetailNotPrjBank);
                } else {
                    JournalDetail::create($journalDetailNotPrjBank);
                }

                // Create log Journal Detail
                user_log_create("Created (Journal Detail).", "Journal", $journalId);
            }
        }

        // Update receipt journal id add receipt
        $this->set_journal_receipt($journalId, $receiptId);
    }

    public function set_journal_receipt($journalId, $receiptId)
    {
        Receipt::where('RECEIPT_ID', $receiptId)->update([
            'RECEIPT_JOURNAL_ID_ADD_RECEIPT' => $journalId
        ]);
        
        // Create log Receipt
        user_log_create("Update (Receipt).", "Receipt", $receiptId);
    }

    public function check_journal_add_receipt($receiptId)
    {
        $row = DB::table('t_receipt')
                ->select('RECEIPT_JOURNAL_ID_ADD_RECEIPT')
                ->where('RECEIPT_ID', $receiptId)
                ->first();

        if ($row && !empty($row->RECEIPT_JOURNAL_ID_ADD_RECEIPT)) {
            return $row->RECEIPT_JOURNAL_ID_ADD_RECEIPT;
        }

        return false;
    }

    public function index()
    {
        return Inertia::render('Receipt/Receipt');
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'RECEIPT_DATE' => 'required',
            'RECEIPT_CURRENCY_ID' => 'required',
            'RECEIPT_BANK_ID' => 'required',
            'RECEIPT_VALUE' => 'required',
        ], [
            'RECEIPT_DATE.required' => 'The date field is required',
            'RECEIPT_CURRENCY_ID.required' => 'The currency field is required',
            'RECEIPT_BANK_ID.required' => 'The bank name field is required',
            'RECEIPT_VALUE.required' => 'The value field is required'
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $dataReceipt = DB::transaction(function () use ($request) {
            $setting = RSetting::where('SETTING_VARIABLE', 'auto_journal_add_receipt')->first();
            
            $userId = Auth::user()->id;
            $receiptStatus = $request->RECEIPT_STATUS;
            $dateTime = now();

            $year = date('y', strtotime($request->RECEIPT_DATE));
            $month = date('m', strtotime($request->RECEIPT_DATE));
                
            $receiptNumber = $this->generateReceiptNumber($year, $month);
            $receipt_relation_organization_id = isset($request->RECEIPT_RELATION_ORGANIZATION_ID) ? $request->RECEIPT_RELATION_ORGANIZATION_ID['value'] : null;
            $currency = $request->RECEIPT_CURRENCY_ID['value'];
            $receiptCountedAs = Str::title(Number::spell($request->RECEIPT_VALUE, locale: 'id'));
            $receiptCountedAs = $this->switch_currency($currency, $receiptCountedAs);
            $receiptExchangeRate = $this->getExchangeRate($request->RECEIPT_DATE, $currency);

            if ($currency === 1) {
                $check_existing_exchange_rate = "Yes";
            } else {
                $check_existing_exchange_rate = $this->check_existing_exchange_rate($request->RECEIPT_DATE, $currency);
            }

            if ($check_existing_exchange_rate === "Yes") {
                // Create Receipt
                $receipt = Receipt::create([
                    'RECEIPT_CURRENCY_ID' => $currency,
                    'RECEIPT_BANK_ID' => $request->RECEIPT_BANK_ID['value'],
                    'RECEIPT_RELATION_ORGANIZATION_ID' => $receipt_relation_organization_id,
                    'RECEIPT_NUMBER' => $receiptNumber,
                    'RECEIPT_NAME' => $request->RECEIPT_NAME,
                    'RECEIPT_DATE' => $request->RECEIPT_DATE,
                    'RECEIPT_VALUE' => $request->RECEIPT_VALUE,
                    'RECEIPT_COUNTED_AS' => $receiptCountedAs,
                    'RECEIPT_EXCHANGE_RATE' => $receiptExchangeRate,
                    'RECEIPT_MEMO' => $request->RECEIPT_MEMO,
                    'RECEIPT_STATUS' => $receiptStatus,
                    'RECEIPT_CREATED_BY' => $userId,
                    'RECEIPT_CREATED_DATE' => $dateTime
                ])->RECEIPT_ID;
                
                // Create log Receipt
                user_log_create("Created (Receipt).", "Receipt", $receipt);
    
                // Create Journal
                if ($receiptStatus === 2 && $setting->SETTING_VALUE == 1) {
                    $this->auto_journal_add_receipt($receipt);
                }
            }

            return $check_existing_exchange_rate;
        });
        
        if ($dataReceipt === "No") {
            return new JsonResponse([
                'alert' => 'exchange_rate',
                'msg' => 'Please create exchange rate tax'
            ], 201, [
                'X-Inertia' => true
            ]);
        }

        return new JsonResponse([
            'msg' => 'New receipt has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function draft(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'RECEIPT_DATE' => 'required',
            'RECEIPT_CURRENCY_ID' => 'required',
            'RECEIPT_BANK_ID' => 'required',
            'RECEIPT_VALUE' => 'required',
        ], [
            'RECEIPT_DATE.required' => 'The date field is required',
            'RECEIPT_CURRENCY_ID.required' => 'The currency field is required',
            'RECEIPT_BANK_ID.required' => 'The bank name field is required',
            'RECEIPT_VALUE.required' => 'The value field is required'
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        
        $dataReceipt = DB::transaction(function () use ($request) {
            $setting = RSetting::where('SETTING_VARIABLE', 'auto_journal_add_receipt')->first();

            $receipt_id = $request->RECEIPT_ID;
            $receipt_status = $request->RECEIPT_STATUS;

            $receipt_relation_organization_id = isset($request->RECEIPT_RELATION_ORGANIZATION_ID) ? $request->RECEIPT_RELATION_ORGANIZATION_ID : null;
            $currency = $request->RECEIPT_CURRENCY_ID;
            $receipt_counted_as = Str::title(Number::spell($request->RECEIPT_VALUE, locale: 'id'));
            $receipt_counted_as = $this->switch_currency($currency, $receipt_counted_as);

            if ($currency === 1) {
                $check_existing_exchange_rate = "Yes";
            } else {
                $check_existing_exchange_rate = $this->check_existing_exchange_rate($request->RECEIPT_DATE, $currency);
            }

            if ($check_existing_exchange_rate === "Yes") {
                // Create Receipt
                Receipt::where('RECEIPT_ID', $receipt_id)->update([
                    'RECEIPT_CURRENCY_ID' => $currency,
                    'RECEIPT_BANK_ID' => $request->RECEIPT_BANK_ID,
                    'RECEIPT_RELATION_ORGANIZATION_ID' => $receipt_relation_organization_id,
                    'RECEIPT_NAME' => $request->RECEIPT_NAME,
                    'RECEIPT_DATE' => $request->RECEIPT_DATE,
                    'RECEIPT_VALUE' => $request->RECEIPT_VALUE,
                    'RECEIPT_COUNTED_AS' => $receipt_counted_as,
                    'RECEIPT_MEMO' => $request->RECEIPT_MEMO,
                    'RECEIPT_STATUS' => $receipt_status,
                    'RECEIPT_UPDATED_BY' => Auth::user()->id,
                    'RECEIPT_UPDATED_DATE' => now()
                ]);
                
                // Create log Receipt
                user_log_create("Created (Receipt).", "Receipt", $receipt_id);
    
                // Create Journal
                if ($receipt_status === 2 && $setting->SETTING_VALUE == 1) {
                    $this->auto_journal_add_receipt($receipt_id);
                }
            }

            return $check_existing_exchange_rate;
        });

        if ($dataReceipt === "No") {
            return new JsonResponse([
                'alert' => 'exchange_rate',
                'msg' => 'Please create exchange rate tax'
            ], 201, [
                'X-Inertia' => true
            ]);
        }

        return new JsonResponse([
            'msg' => 'New receipt has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'RECEIPT_DATE' => 'required',
            'RECEIPT_CURRENCY_ID' => 'required',
            'RECEIPT_BANK_ID' => 'required',
            'RECEIPT_VALUE' => 'required',
        ], [
            'RECEIPT_DATE.required' => 'The date field is required',
            'RECEIPT_CURRENCY_ID.required' => 'The currency field is required',
            'RECEIPT_BANK_ID.required' => 'The bank name field is required',
            'RECEIPT_VALUE.required' => 'The value field is required'
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $dataReceipt = DB::transaction(function () use ($request) {
            $setting = RSetting::where('SETTING_VARIABLE', 'auto_journal_add_receipt')->first();

            $receipt_id = $request->RECEIPT_ID;
            $receipt_relation_organization_id = isset($request->RECEIPT_RELATION_ORGANIZATION_ID) ? $request->RECEIPT_RELATION_ORGANIZATION_ID : null;
            $currency = $request->RECEIPT_CURRENCY_ID;
            $receipt_counted_as = Str::title(Number::spell($request->RECEIPT_VALUE, locale: 'id'));
            $receipt_counted_as = $this->switch_currency($currency, $receipt_counted_as);
            $receipt_status = $request->RECEIPT_STATUS;

            if ($currency === 1) {
                $check_existing_exchange_rate = "Yes";
            } else {
                $check_existing_exchange_rate = $this->check_existing_exchange_rate($request->RECEIPT_DATE, $currency);
            }

            if ($check_existing_exchange_rate === "Yes") {
                // Create Receipt
                Receipt::where('RECEIPT_ID', $receipt_id)->update([
                    'RECEIPT_CURRENCY_ID' => $currency,
                    'RECEIPT_BANK_ID' => $request->RECEIPT_BANK_ID,
                    'RECEIPT_RELATION_ORGANIZATION_ID' => $receipt_relation_organization_id,
                    'RECEIPT_NAME' => $request->RECEIPT_NAME,
                    'RECEIPT_DATE' => $request->RECEIPT_DATE,
                    'RECEIPT_VALUE' => $request->RECEIPT_VALUE,
                    'RECEIPT_COUNTED_AS' => $receipt_counted_as,
                    'RECEIPT_MEMO' => $request->RECEIPT_MEMO,
                    'RECEIPT_STATUS' => $receipt_status,
                    'RECEIPT_UPDATED_BY' => Auth::user()->id,
                    'RECEIPT_UPDATED_DATE' => now()
                ]);
                
                // Create log Receipt
                user_log_create("Created (Receipt).", "Receipt", $receipt_id);
    
                // Create Journal
                if ($setting->SETTING_VALUE == 1) {
                    $this->auto_journal_add_receipt($receipt_id);
                }
            }

            return $check_existing_exchange_rate;
        });

        if ($dataReceipt === "No") {
            return new JsonResponse([
                'alert' => 'exchange_rate',
                'msg' => 'Please create exchange rate tax'
            ], 201, [
                'X-Inertia' => true
            ]);
        }

        return new JsonResponse([
            'msg' => 'New receipt has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function delete($receipt_id)
    {
        DB::transaction(function() use($receipt_id) {
            $userId = Auth::user()->id;
            $dateTime = now();

            $receipt = Receipt::find($receipt_id);

            $journal_id = $receipt->RECEIPT_JOURNAL_ID_ADD_RECEIPT;

            $journal = Journal::find($journal_id);

            $journal_detail = JournalDetail::where('JOURNAL_ID', $journal_id)->get();

            // Start Delete Receipt
            $data = Receipt::find($receipt_id);

            $data->update([
                'RECEIPT_STATUS' => 4
            ]);
    
            $data->delete();

            user_log_create("Delete (Receipt).", "Receipt", $receipt_id);
            // End Delete Receipt

            // Start Delete Journal
            if ($journal_id) {
                JournalDeleted::create([
                    'JOURNAL_ID' => $journal->JOURNAL_ID,
                    'JOURNAL_NUMBER' => $journal->JOURNAL_NUMBER,
                    'JOURNAL_TYPE_CODE' => $journal->JOURNAL_TYPE_CODE,
                    'JOURNAL_DATE' => $journal->JOURNAL_DATE,
                    'JOURNAL_MEMO' => $journal->JOURNAL_MEMO,
                    'JOURNAL_IS_POSTED' => $journal->JOURNAL_IS_POSTED,
                    'JOURNAL_POSTED_BY' => $journal->JOURNAL_POSTED_BY,
                    'JOURNAL_POSTED_DATE' => $journal->JOURNAL_POSTED_DATE,
                    'JOURNAL_CREATED_BY' => $journal->JOURNAL_CREATED_BY,
                    'JOURNAL_CREATED_DATE' => $journal->JOURNAL_CREATED_DATE,
                    'JOURNAL_UPDATED_BY' => $journal->JOURNAL_UPDATED_BY,
                    'JOURNAL_UPDATED_DATE' => $journal->JOURNAL_UPDATED_DATE,
                    'TEMP' => $journal->TEMP,
                    'JOURNAL_NOTES' => $journal->JOURNAL_NOTES,
                    'JOURNAL_DELETED_BY' => $userId,
                    'JOURNAL_DELETED_DATE' => $dateTime
                ]);
    
                Journal::find($journal_id)->delete();
    
                user_log_create("Delete (Journal).", "Journal", $journal_id);
            }
            // End Delete Journal

            // Start Delete Journal Detail
            if ($journal_id) {
                foreach ($journal_detail as $value) {
                    JournalDetailDeleted::create([
                        'JOURNAL_DETAIL_ID' => $value->JOURNAL_DETAIL_ID,
                        'JOURNAL_ID' => $value->JOURNAL_ID,
                        'JOURNAL_DETAIL_COA_CODE' => $value->JOURNAL_DETAIL_COA_CODE,
                        'JOURNAL_DETAIL_DESC' => $value->JOURNAL_DETAIL_DESC,
                        'JOURNAL_DETAIL_CURRENCY_ID' => $value->JOURNAL_DETAIL_CURRENCY_ID,
                        'JOURNAL_DETAIL_ORIG' => $value->JOURNAL_DETAIL_ORIG,
                        'JOURNAL_DETAIL_EX_RATE' => $value->JOURNAL_DETAIL_EX_RATE,
                        'JOURNAL_DETAIL_SUM' => $value->JOURNAL_DETAIL_SUM,
                        'JOURNAL_DETAIL_SIDE' => $value->JOURNAL_DETAIL_SIDE,
                        'JOURNAL_DETAIL_CREATED_BY' => $value->JOURNAL_DETAIL_CREATED_BY,
                        'JOURNAL_DETAIL_CREATED_DATE' => $value->JOURNAL_DETAIL_CREATED_DATE,
                        'JOURNAL_DETAIL_UPDATED_BY' => $value->JOURNAL_DETAIL_UPDATED_BY,
                        'JOURNAL_DETAIL_UPDATED_DATE' => $value->JOURNAL_DETAIL_UPDATED_DATE,
                        'JOURNAL_DETAIL_DELETED_BY' => $userId,
                        'JOURNAL_DETAIL_DELETED_DATE' => $dateTime
                    ]);
                }
    
                JournalDetail::where('JOURNAL_ID', $journal_id)->delete();
    
                user_log_create("Delete (Journal Detail).", "Journal", $journal_id);
            }
            // End Delete Journal Detail
        });

        return new JsonResponse([
            'msg' => 'Receipt has been deleted.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}