<?php

namespace App\Http\Controllers;

use App\Models\MPolicyCoverageDetail;
use App\Models\MPolicyExchangeRate;
use App\Models\MPolicyPartners;
use App\Models\Relation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class PolicyPartnerController extends Controller
{

    public function index()
    {
       
    }

    function getCoa(){
        $data = DB::table('r_coa')
                ->get();

        return response()->json($data);
    }

    function getPksNumber($id="") {
        $data = DB::table('m_pks_relation')
                ->where('RELATION_ORGANIZATION_ID', $id)
                ->get();

        return response()->json($data);
    }

    function getDefaultPayable($id="") {
        $data = DB::table('t_relation')
                ->where('RELATION_ORGANIZATION_ID', $id)
                ->value('DEFAULT_PAYABLE');
                // dd($data);

        return response()->json($data);
    }

    function getSummary($id="") {
        $dataGabung = [];
        $coveragePremium = DB::table('m_policy_coverage_detail AS pcd')
            ->leftJoin('m_policy_coverage AS pc', 'pcd.POLICY_COVERAGE_ID', '=', 'pc.POLICY_COVERAGE_ID')
            ->select(DB::raw('1 AS URUTAN'), DB::raw('"Premium" AS TITLE'), 'pcd.CURRENCY_ID', DB::raw('SUM(pcd.PREMIUM) AS AMOUNT'), DB::raw('0 AS PPN'), DB::raw('0 AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pc.POLICY_ID AND per.CURRENCY_ID = pcd.CURRENCY_ID), 1 ) AS EXCHANGE_RATE'))
            ->where('pc.POLICY_ID', $id)
            ->groupBy('pcd.CURRENCY_ID')->get();
        if ($coveragePremium) {
            $arrCoverage = [
                "urut" => 1,
                "title" => "Premium",
            ];
            $arrCoverage['detail'] = $coveragePremium;
            array_push($dataGabung, $arrCoverage);
            
        }
        
        $insurerNettPremi = DB::table('m_insurer_coverage AS ipc')
                ->leftJoin('t_insurance_panel AS ip', 'ipc.IP_ID', '=', 'ip.IP_ID')
                ->select(DB::raw('2 AS URUTAN'), DB::raw('"Insurer Nett Premium" AS TITLE'), 'ipc.CURRENCY_ID', DB::raw('SUM(ipc.NETT_PREMI) AS AMOUNT'), DB::raw('SUM(ipc.BROKERAGE_FEE_PPN) AS PPN'), DB::raw('SUM(ipc.BROKERAGE_FEE_PPH) AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = ip.POLICY_ID AND per.CURRENCY_ID = ipc.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('ip.POLICY_ID', $id)
                ->groupBy('ipc.CURRENCY_ID')->get();
        if ($insurerNettPremi) {
            $arrInsurer = [
                "urut" => 2,
                "title" => "Insurer Nett Premium",
            ];
            $arrInsurer['detail'] = $insurerNettPremi;
            array_push($dataGabung, $arrInsurer);
        }

        $adminCost = DB::table('m_policy_insured AS pi')
                ->select(DB::raw('3 AS URUTAN'), DB::raw('"Admin Cost" AS TITLE'), DB::raw('"1" AS CURRENCY_ID'), 'pi.ADMIN_COST AS AMOUNT', DB::raw('0 AS PPN'), DB::raw('0 AS PPH'), DB::raw('1 AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)->get();
        if ($adminCost) {
            $arrInsurer = [
                "urut" => 3,
                "title" => "Admin Cost",
            ];
            $arrInsurer['detail'] = $adminCost;
            array_push($dataGabung, $arrInsurer);
        }

        $brokerageFee = DB::table('m_policy_insured_detail AS pid')
                ->leftJoin('m_policy_insured AS pi', 'pid.POLICY_INSURED_ID', '=', 'pi.POLICY_INSURED_ID')
                ->select(DB::raw('4 AS URUTAN'), DB::raw('"Brokerage Fee" AS TITLE'), 'pid.CURRENCY_ID', DB::raw('SUM(pid.BF_NETT_AMOUNT) AS AMOUNT'), DB::raw('(SELECT SUM(a.BROKERAGE_FEE_PPN) AS PPN FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPN'), DB::raw('(SELECT SUM(a.BROKERAGE_FEE_PPH) AS PPH FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pi.POLICY_ID AND per.CURRENCY_ID = pid.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)
                ->groupBy('pid.CURRENCY_ID')->get();
        if ($brokerageFee) {
            $arrInsurer = [
                "urut" => 4,
                "title" => "Brokerage Fee",
            ];
            $arrInsurer['detail'] = $brokerageFee;
            array_push($dataGabung, $arrInsurer);
            
        }

        $engineeringFee = DB::table('m_policy_insured_detail AS pid')
                ->leftJoin('m_policy_insured AS pi', 'pid.POLICY_INSURED_ID', '=', 'pi.POLICY_INSURED_ID')
                ->select(DB::raw('5 AS URUTAN'), DB::raw('"Engineering Fee" AS TITLE'), 'pid.CURRENCY_ID', DB::raw('SUM(pid.EF_NETT_AMOUNT) AS AMOUNT'), DB::raw('(SELECT SUM(a.ENGINEERING_FEE_PPN) AS PPN FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPN'), DB::raw('(SELECT SUM(a.ENGINEERING_FEE_PPH) AS PPH FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pi.POLICY_ID AND per.CURRENCY_ID = pid.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)
                ->groupBy('pid.CURRENCY_ID')->get();
        if ($engineeringFee) {
            $arrInsurer = [
                "urut" => 5,
                "title" => "Engineering Fee",
            ];
            $arrInsurer['detail'] = $engineeringFee;
            array_push($dataGabung, $arrInsurer);
        }
        
        $consultancyFee = DB::table('m_policy_insured_detail AS pid')
                ->leftJoin('m_policy_insured AS pi', 'pid.POLICY_INSURED_ID', '=', 'pi.POLICY_INSURED_ID')
                ->select(DB::raw('6 AS URUTAN'), DB::raw('"Consultancy Fee" AS TITLE'), 'pid.CURRENCY_ID', DB::raw('SUM(pid.CF_NETT_AMOUNT) AS AMOUNT'),DB::raw('(SELECT SUM(a.CONSULTANCY_FEE_PPN) AS PPN FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPN'), DB::raw('(SELECT SUM(a.CONSULTANCY_FEE_PPH) AS PPH FROM m_insurer_coverage AS a WHERE a.POLICY_COVERAGE_ID = pid.POLICY_COVERAGE_ID AND a.CURRENCY_ID = pid.CURRENCY_ID GROUP BY a.CURRENCY_ID) AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pi.POLICY_ID AND per.CURRENCY_ID = pid.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)
                ->groupBy('pid.CURRENCY_ID')->get();
        if ($consultancyFee) {
            $arrInsurer = [
                "urut" => 6,
                "title" => "Consultancy Fee",
            ];
            $arrInsurer['detail'] = $consultancyFee;
            array_push($dataGabung, $arrInsurer);
        }
        
        $fresnelNettIncome = DB::table('m_policy_insured_detail AS pid')
                ->leftJoin('m_policy_insured AS pi', 'pid.POLICY_INSURED_ID', '=', 'pi.POLICY_INSURED_ID')
                ->select(DB::raw('7 AS URUTAN'), DB::raw('"Fresnel Income Amount" AS TITLE'), 'pid.CURRENCY_ID', DB::raw('SUM(pid.INCOME_NETT_AMOUNT) AS AMOUNT'), DB::raw('0 AS PPN'), DB::raw('0 AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pi.POLICY_ID AND per.CURRENCY_ID = pid.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)
                ->groupBy('pid.CURRENCY_ID')->get();
        if ($fresnelNettIncome) {
            $arrInsurer = [
                "urut" => 7,
                "title" => "Fresnel Income Amount",
            ];
            $arrInsurer['detail'] = $fresnelNettIncome;
            array_push($dataGabung, $arrInsurer);
        }
        
        $nettPremiumToInsured = DB::table('m_policy_insured_detail AS pid')
                ->leftJoin('m_policy_insured AS pi', 'pid.POLICY_INSURED_ID', '=', 'pi.POLICY_INSURED_ID')
                ->select(DB::raw('8 AS URUTAN'), DB::raw('"Premium To Insured" AS TITLE'), 'pid.CURRENCY_ID', DB::raw('SUM(pid.PREMIUM_TO_INSURED) AS AMOUNT'), DB::raw('0 AS PPN'), DB::raw('0 AS PPH'), DB::raw('IFNULL( (SELECT POLICY_EXCHANGE_RATE_AMOUNT FROM m_policy_exchange_rate AS per WHERE per.POLICY_ID = pi.POLICY_ID AND per.CURRENCY_ID = pid.CURRENCY_ID), 1 ) AS EXCHANGE_RATE') )
                ->where('pi.POLICY_ID', $id)
                ->groupBy('pid.CURRENCY_ID')->get();
        if ($nettPremiumToInsured) {
            $arrInsurer = [
                "urut" => 8,
                "title" => "Premium To Insured",
            ];
            $arrInsurer['detail'] = $nettPremiumToInsured;
            array_push($dataGabung, $arrInsurer);
            
        }

        $fbiPks = DB::table('m_policy_partner AS pp')
                ->select(DB::raw('9 AS URUTAN'), DB::raw('"FBI PKS" AS TITLE'), DB::raw('"1" AS CURRENCY_ID'), DB::raw('SUM(pp.BROKERAGE_FEE_AMOUNT) + SUM(pp.ENGINEERING_FEE_AMOUNT) +SUM(pp.CONSULTANCY_FEE_AMOUNT) AS AMOUNT'), DB::raw('IF( pp.PAYABLE = 1, SUM(pp.BROKERAGE_FEE_PPN) + SUM(pp.ENGINEERING_FEE_PPN) + SUM(pp.CONSULTANCY_FEE_PPN), 0 ) AS PPN'), DB::raw('0 AS PPH'), DB::raw(' 1 AS EXCHANGE_RATE') )
                ->where('pp.POLICY_ID', $id)
                ->where('pp.INCOME_TYPE', 1)
                ->groupBy('pp.INCOME_TYPE')->get();
        if ($fbiPks) {
            $arrInsurer = [
                "urut" => 9,
                "title" => "FBI PKS",
            ];
            $arrInsurer['detail'] = $fbiPks;
            array_push($dataGabung, $arrInsurer);
            
        }
        
        $agent = DB::table('m_policy_partner AS pp')
                ->select(DB::raw('10 AS URUTAN'), DB::raw('"Agent" AS TITLE'), DB::raw('"1" AS CURRENCY_ID'), DB::raw('SUM(pp.BROKERAGE_FEE_AMOUNT) + SUM(pp.ENGINEERING_FEE_AMOUNT) + SUM(pp.CONSULTANCY_FEE_AMOUNT) AS AMOUNT'), DB::raw('IF(    pp.PAYABLE = 1, SUM(pp.BROKERAGE_FEE_PPH) + SUM(pp.ENGINEERING_FEE_PPH) + SUM(pp.CONSULTANCY_FEE_PPH), 0 ) AS PPN'), DB::raw('0 AS PPH'), DB::raw(' 1 AS EXCHANGE_RATE') )
                ->where('pp.POLICY_ID', $id)
                ->where('pp.INCOME_TYPE', 2)
                ->groupBy('pp.INCOME_TYPE')->get();
        if ($agent) {
            $arrInsurer = [
                "urut" => 10,
                "title" => "Agent",
            ];
            $arrInsurer['detail'] = $agent;
            array_push($dataGabung, $arrInsurer);
            
        }

        $baa = DB::table('m_policy_partner AS pp')
                ->select(DB::raw('11 AS URUTAN'), DB::raw('"BAA" AS TITLE'), DB::raw('"1" AS CURRENCY_ID'), DB::raw('SUM(pp.BROKERAGE_FEE_AMOUNT) + SUM(pp.ENGINEERING_FEE_AMOUNT) + SUM(pp.CONSULTANCY_FEE_AMOUNT) AS AMOUNT'), DB::raw('0 AS PPN'), DB::raw('0 AS PPH'), DB::raw(' 1 AS EXCHANGE_RATE') )
                ->where('pp.POLICY_ID', $id)
                ->where('pp.INCOME_TYPE', 3)
                ->groupBy('pp.INCOME_TYPE')
                ->orderBy('URUTAN')
                ->get();
        if ($baa) {
            $arrInsurer = [
                "urut" => 11,
                "title" => "BAA",
            ];
            $arrInsurer['detail'] = $baa;
            array_push($dataGabung, $arrInsurer);
           
        }
        return response()->json($dataGabung);
        
    }


    public function store(Request $request) {
        // dd($request);
        DB::transaction(function () use ($request) {
            $data = $request->input();
            $data_fbi_pks = $data[0]['income_detail'];
            $data_agent_comm = $data[1]['income_detail'];
            $data_acquisition =$data[2]['income_detail'];
            // print_r($data_fbi_pks);
            $arrData = [];
            foreach ($data_fbi_pks as $details1 => $detail1) {
                // print_r($detail1);
                $tmpArr = [
                        'INCOME_TYPE' => $detail1['INCOME_TYPE'],
                        'POLICY_ID' => $detail1['POLICY_ID'],
                        'PARTNER_NAME' => $detail1['NAME'],
                        'RELATION_ID' => $detail1['RELATION_ID'],
                        'BROKERAGE_FEE_PERCENTAGE' => $detail1['BROKERAGE_FEE_PERCENTAGE'],
                        'BROKERAGE_FEE_AMOUNT' => $detail1['BROKERAGE_FEE_AMOUNT'],
                        'ENGINEERING_FEE_PERCENTAGE' => $detail1['ENGINEERING_FEE_PERCENTAGE'],
                        'ENGINEERING_FEE_AMOUNT' => $detail1['ENGINEERING_FEE_AMOUNT'],
                        'ADMIN_COST' => $detail1['ADMIN_COST'],
                        'CONSULTANCY_FEE_PERCENTAGE' => $detail1['CONSULTANCY_FEE_PERCENTAGE'],
                        'CONSULTANCY_FEE_AMOUNT' => $detail1['CONSULTANCY_FEE_AMOUNT'],

                        // tambahan field 29-08-2024
                        'M_PKS_RELATION_ID' => $detail1['M_PKS_RELATION_ID'],
                        'BROKERAGE_FEE_VAT' => $detail1['BROKERAGE_FEE_VAT'],
                        'BROKERAGE_FEE_PPN' => $detail1['BROKERAGE_FEE_PPN'],
                        'BROKERAGE_FEE_PPH' => $detail1['BROKERAGE_FEE_PPH'],
                        'BROKERAGE_FEE_NETT_AMOUNT' => $detail1['BROKERAGE_FEE_NETT_AMOUNT'],
                        'ENGINEERING_FEE_VAT' => $detail1['ENGINEERING_FEE_VAT'],
                        'ENGINEERING_FEE_PPN' => $detail1['ENGINEERING_FEE_PPN'],
                        'ENGINEERING_FEE_PPH' => $detail1['ENGINEERING_FEE_PPH'],
                        'ENGINEERING_FEE_NETT_AMOUNT' => $detail1['ENGINEERING_FEE_NETT_AMOUNT'],
                        'CONSULTANCY_FEE_VAT' => $detail1['CONSULTANCY_FEE_VAT'],
                        'CONSULTANCY_FEE_PPN' => $detail1['CONSULTANCY_FEE_PPN'],
                        'CONSULTANCY_FEE_PPH' => $detail1['CONSULTANCY_FEE_PPH'],
                        'CONSULTANCY_FEE_NETT_AMOUNT' => $detail1['CONSULTANCY_FEE_NETT_AMOUNT'],
                        'PAYABLE' => $detail1['PAYABLE'],
                    ];
                    array_push($arrData, $tmpArr);
            }

            foreach ($data_agent_comm as $details2 => $detail2) {
                // print_r($detail2);
                $tmpArr2 = [
                        'INCOME_TYPE' => $detail2['INCOME_TYPE'],
                        'POLICY_ID' => $detail2['POLICY_ID'],
                        'PARTNER_NAME' => $detail2['NAME'],
                        'RELATION_ID' => $detail1['RELATION_ID'],
                        'BROKERAGE_FEE_PERCENTAGE' => $detail2['BROKERAGE_FEE_PERCENTAGE'],
                        'BROKERAGE_FEE_AMOUNT' => $detail2['BROKERAGE_FEE_AMOUNT'],
                        'ENGINEERING_FEE_PERCENTAGE' => $detail2['ENGINEERING_FEE_PERCENTAGE'],
                        'ENGINEERING_FEE_AMOUNT' => $detail2['ENGINEERING_FEE_AMOUNT'],
                        'ADMIN_COST' => $detail2['ADMIN_COST'],
                        'CONSULTANCY_FEE_PERCENTAGE' => $detail2['CONSULTANCY_FEE_PERCENTAGE'],
                        'CONSULTANCY_FEE_AMOUNT' => $detail2['CONSULTANCY_FEE_AMOUNT'],
                        
                        // tambahan field 29-08-2024
                        'M_PKS_RELATION_ID' => $detail1['M_PKS_RELATION_ID'],
                        'BROKERAGE_FEE_VAT' => $detail1['BROKERAGE_FEE_VAT'],
                        'BROKERAGE_FEE_PPN' => $detail1['BROKERAGE_FEE_PPN'],
                        'BROKERAGE_FEE_PPH' => $detail1['BROKERAGE_FEE_PPH'],
                        'BROKERAGE_FEE_NETT_AMOUNT' => $detail1['BROKERAGE_FEE_NETT_AMOUNT'],
                        'ENGINEERING_FEE_VAT' => $detail1['ENGINEERING_FEE_VAT'],
                        'ENGINEERING_FEE_PPN' => $detail1['ENGINEERING_FEE_PPN'],
                        'ENGINEERING_FEE_PPH' => $detail1['ENGINEERING_FEE_PPH'],
                        'ENGINEERING_FEE_NETT_AMOUNT' => $detail1['ENGINEERING_FEE_NETT_AMOUNT'],
                        'CONSULTANCY_FEE_VAT' => $detail1['CONSULTANCY_FEE_VAT'],
                        'CONSULTANCY_FEE_PPN' => $detail1['CONSULTANCY_FEE_PPN'],
                        'CONSULTANCY_FEE_PPH' => $detail1['CONSULTANCY_FEE_PPH'],
                        'CONSULTANCY_FEE_NETT_AMOUNT' => $detail1['CONSULTANCY_FEE_NETT_AMOUNT'],
                        'PAYABLE' => $detail1['PAYABLE'],
                    ];
                    array_push($arrData, $tmpArr2);
            }

            foreach ($data_acquisition as $details3 => $detail3) {
                // print_r($detail3);
                $tmpArr3 = [
                        'INCOME_TYPE' => $detail3['INCOME_TYPE'],
                        'POLICY_ID' => $detail3['POLICY_ID'],
                        'PARTNER_NAME' => $detail3['NAME'],
                        'RELATION_ID' => $detail1['RELATION_ID'],
                        'BROKERAGE_FEE_PERCENTAGE' => $detail3['BROKERAGE_FEE_PERCENTAGE'],
                        'BROKERAGE_FEE_AMOUNT' => $detail3['BROKERAGE_FEE_AMOUNT'],
                        'ENGINEERING_FEE_PERCENTAGE' => $detail3['ENGINEERING_FEE_PERCENTAGE'],
                        'ENGINEERING_FEE_AMOUNT' => $detail3['ENGINEERING_FEE_AMOUNT'],
                        'ADMIN_COST' => $detail3['ADMIN_COST'],
                        'CONSULTANCY_FEE_PERCENTAGE' => $detail3['CONSULTANCY_FEE_PERCENTAGE'],
                        'CONSULTANCY_FEE_AMOUNT' => $detail3['CONSULTANCY_FEE_AMOUNT'],

                        // tambahan field 29-08-2024
                        'M_PKS_RELATION_ID' => $detail1['M_PKS_RELATION_ID'],
                        'BROKERAGE_FEE_VAT' => $detail1['BROKERAGE_FEE_VAT'],
                        'BROKERAGE_FEE_PPN' => $detail1['BROKERAGE_FEE_PPN'],
                        'BROKERAGE_FEE_PPH' => $detail1['BROKERAGE_FEE_PPH'],
                        'BROKERAGE_FEE_NETT_AMOUNT' => $detail1['BROKERAGE_FEE_NETT_AMOUNT'],
                        'ENGINEERING_FEE_VAT' => $detail1['ENGINEERING_FEE_VAT'],
                        'ENGINEERING_FEE_PPN' => $detail1['ENGINEERING_FEE_PPN'],
                        'ENGINEERING_FEE_PPH' => $detail1['ENGINEERING_FEE_PPH'],
                        'ENGINEERING_FEE_NETT_AMOUNT' => $detail1['ENGINEERING_FEE_NETT_AMOUNT'],
                        'CONSULTANCY_FEE_VAT' => $detail1['CONSULTANCY_FEE_VAT'],
                        'CONSULTANCY_FEE_PPN' => $detail1['CONSULTANCY_FEE_PPN'],
                        'CONSULTANCY_FEE_PPH' => $detail1['CONSULTANCY_FEE_PPH'],
                        'CONSULTANCY_FEE_NETT_AMOUNT' => $detail1['CONSULTANCY_FEE_NETT_AMOUNT'],
                        'PAYABLE' => $detail1['PAYABLE'],
                    ];
                    array_push($arrData, $tmpArr3);
            }
            
            MPolicyPartners::insert($arrData);
        });    
        return new JsonResponse([
            'Success Registered Partners.'
            // $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

     public function getDataPartner($id) {       
        $query = MPolicyPartners::where('POLICY_ID', $id)->get();
        return response()->json($query);
    }

     public function getPolicyExchangeRate($id) {       
        $query = MPolicyExchangeRate::where('POLICY_ID', $id)->get();
        return response()->json($query);
    }

    public function getRelationByType($id) {  
        $data = Relation::leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
            ->with('pksNumber')
            ->where('RELATION_TYPE_ID', '=', $id)
            ->get();
        return response()->json($data);
    }

    public function getPersonBaa($id) {
        $data = DB::table('t_person')
                ->where('PERSON_IS_BAA', '=', 1)
                ->where('RELATION_ORGANIZATION_ID', $id)
                ->get();
        return response()->json($data);
    }

    public function editPartners(Request $request) {
        // dd($request);
        DB::transaction(function () use ($request) {
            $data = $request[0]['listDataPartners'];//$request->input("listDataPartners");
            // dd($data);
            $dataExchangeRate = array_key_exists("1", $request->input()) ? $request[1]["exchangeRate"] : null;
            // dd($dataExchangeRate);

            // save or edit exchange rate
            if ($dataExchangeRate) {
                foreach ($dataExchangeRate as $key => $value) {
                    // print_r($value);
                    if ($value["POLICY_EXCHANGE_RATE_ID"]) {
                        // echo "update";
                        // Update
                        MPolicyExchangeRate::where('POLICY_EXCHANGE_RATE_ID', $value["POLICY_EXCHANGE_RATE_ID"])
                            ->update([
                                "POLICY_ID"   =>  $value["POLICY_ID"],
                                "CURRENCY_ID"   =>  $value["CURRENCY_ID"],
                                "POLICY_EXCHANGE_RATE_DATE" =>  $value["POLICY_EXCHANGE_RATE_DATE"],
                                "POLICY_EXCHANGE_RATE_AMOUNT" =>  $value["POLICY_EXCHANGE_RATE_AMOUNT"]
                            ]);
                    } else {
                        // echo "insert";
                        // Insert
                        MPolicyExchangeRate::create([
                            "POLICY_ID"   =>  $value["POLICY_ID"],
                            "CURRENCY_ID"   =>  $value["CURRENCY_ID"],
                            "POLICY_EXCHANGE_RATE_DATE" =>  $value["POLICY_EXCHANGE_RATE_DATE"],
                            "POLICY_EXCHANGE_RATE_AMOUNT" =>  $value["POLICY_EXCHANGE_RATE_AMOUNT"]
                    ]);
                    }
                }
            }
            // $data_fbi_pks = $data[0]['income_detail'];
            // $data_agent_comm = $data[1]['income_detail'];
            // $data_acquisition =$data[2]['income_detail'];
            $policy_id = "";
            $arrData = [];

            if (array_key_exists("income_detail", $data[0])) {
                $data_fbi_pks = $data[0]['income_detail'];
                foreach ($data_fbi_pks as $details1 => $detail1) {
                    $tmpArr = [
                            'INCOME_TYPE' => $detail1['INCOME_TYPE'],
                            'POLICY_ID' => $detail1['POLICY_ID'],
                            // 'PARTNER_NAME' => $detail1['PARTNER_NAME'],
                            'RELATION_ID' => array_key_exists("RELATION_ID",$detail1) ? $detail1['RELATION_ID'] : null,
                            'PERSON_ID' => null,
                            'BROKERAGE_FEE_PERCENTAGE' => $detail1['BROKERAGE_FEE_PERCENTAGE'],
                            'BROKERAGE_FEE_AMOUNT' => $detail1['BROKERAGE_FEE_AMOUNT'],
                            'ENGINEERING_FEE_PERCENTAGE' => $detail1['ENGINEERING_FEE_PERCENTAGE'],
                            'ENGINEERING_FEE_AMOUNT' => $detail1['ENGINEERING_FEE_AMOUNT'],
                            'ADMIN_COST' => $detail1['ADMIN_COST'],
                            'CONSULTANCY_FEE_PERCENTAGE' => $detail1['CONSULTANCY_FEE_PERCENTAGE'],
                            'CONSULTANCY_FEE_AMOUNT' => $detail1['CONSULTANCY_FEE_AMOUNT'],

                            // tambahan field 29-08-2024
                            'M_PKS_RELATION_ID' => array_key_exists("M_PKS_RELATION_ID",$detail1) ? $detail1['M_PKS_RELATION_ID'] : null,
                            'BROKERAGE_FEE_VAT' => array_key_exists("BROKERAGE_FEE_VAT",$detail1) ? $detail1['BROKERAGE_FEE_VAT'] : null,
                            'BROKERAGE_FEE_PPN' => $detail1['BROKERAGE_FEE_PPN'],
                            'BROKERAGE_FEE_PPH' => $detail1['BROKERAGE_FEE_PPH'],
                            'BROKERAGE_FEE_NETT_AMOUNT' => $detail1['BROKERAGE_FEE_NETT_AMOUNT'],
                            'ENGINEERING_FEE_VAT' => array_key_exists("ENGINEERING_FEE_VAT",$detail1) ? $detail1['ENGINEERING_FEE_VAT'] : null,
                            'ENGINEERING_FEE_PPN' => $detail1['ENGINEERING_FEE_PPN'],
                            'ENGINEERING_FEE_PPH' => $detail1['ENGINEERING_FEE_PPH'],
                            'ENGINEERING_FEE_NETT_AMOUNT' => $detail1['ENGINEERING_FEE_NETT_AMOUNT'],
                            'CONSULTANCY_FEE_VAT' => array_key_exists("CONSULTANCY_FEE_VAT",$detail1) ? $detail1['CONSULTANCY_FEE_VAT'] : null,
                            'CONSULTANCY_FEE_PPN' => $detail1['CONSULTANCY_FEE_PPN'],
                            'CONSULTANCY_FEE_PPH' => $detail1['CONSULTANCY_FEE_PPH'],
                            'CONSULTANCY_FEE_NETT_AMOUNT' => $detail1['CONSULTANCY_FEE_NETT_AMOUNT'],
                        ];
                        array_push($arrData, $tmpArr);
                        $policy_id = $detail1['POLICY_ID'];
                }
            }

            if (array_key_exists("income_detail", $data[1])) {
                $data_agent_comm = $data[1]['income_detail'];
                foreach ($data_agent_comm as $details2 => $detail2) {
                    $tmpArr2 = [
                            'INCOME_TYPE' => $detail2['INCOME_TYPE'],
                            'POLICY_ID' => $detail2['POLICY_ID'],
                            // 'PARTNER_NAME' => $detail2['PARTNER_NAME'],
                            'RELATION_ID' => array_key_exists("RELATION_ID",$detail2) ? $detail2['RELATION_ID'] : null,
                            'PERSON_ID' => array_key_exists("PERSON_ID",$detail2) ? $detail2['PERSON_ID'] : null,
                            'BROKERAGE_FEE_PERCENTAGE' => $detail2['BROKERAGE_FEE_PERCENTAGE'],
                            'BROKERAGE_FEE_AMOUNT' => $detail2['BROKERAGE_FEE_AMOUNT'],
                            'ENGINEERING_FEE_PERCENTAGE' => $detail2['ENGINEERING_FEE_PERCENTAGE'],
                            'ENGINEERING_FEE_AMOUNT' => $detail2['ENGINEERING_FEE_AMOUNT'],
                            'ADMIN_COST' => $detail2['ADMIN_COST'],
                            'CONSULTANCY_FEE_PERCENTAGE' => $detail2['CONSULTANCY_FEE_PERCENTAGE'],
                            'CONSULTANCY_FEE_AMOUNT' => $detail2['CONSULTANCY_FEE_AMOUNT'],

                            // tambahan field 29-08-2024
                            'M_PKS_RELATION_ID' => array_key_exists("M_PKS_RELATION_ID",$detail2) ? $detail2['M_PKS_RELATION_ID'] : null,
                            'BROKERAGE_FEE_VAT' => array_key_exists("BROKERAGE_FEE_VAT",$detail2) ? $detail2['BROKERAGE_FEE_VAT'] : null,
                            'BROKERAGE_FEE_PPN' => $detail2['BROKERAGE_FEE_PPN'],
                            'BROKERAGE_FEE_PPH' => $detail2['BROKERAGE_FEE_PPH'],
                            'BROKERAGE_FEE_NETT_AMOUNT' => $detail2['BROKERAGE_FEE_NETT_AMOUNT'],
                            'ENGINEERING_FEE_VAT' => array_key_exists("ENGINEERING_FEE_VAT",$detail2) ? $detail2['ENGINEERING_FEE_VAT'] : null,
                            'ENGINEERING_FEE_PPN' => $detail2['ENGINEERING_FEE_PPN'],
                            'ENGINEERING_FEE_PPH' => $detail2['ENGINEERING_FEE_PPH'],
                            'ENGINEERING_FEE_NETT_AMOUNT' => $detail2['ENGINEERING_FEE_NETT_AMOUNT'],
                            'CONSULTANCY_FEE_VAT' => array_key_exists("CONSULTANCY_FEE_VAT",$detail2) ? $detail2['CONSULTANCY_FEE_VAT'] : null,
                            'CONSULTANCY_FEE_PPN' => $detail2['CONSULTANCY_FEE_PPN'],
                            'CONSULTANCY_FEE_PPH' => $detail2['CONSULTANCY_FEE_PPH'],
                            'CONSULTANCY_FEE_NETT_AMOUNT' => $detail2['CONSULTANCY_FEE_NETT_AMOUNT'],
                        ];
                        array_push($arrData, $tmpArr2);
                        $policy_id = $detail2['POLICY_ID'];
                }
            }

            if (array_key_exists("income_detail", $data[2])) {
                $data_acquisition =$data[2]['income_detail'];
                foreach ($data_acquisition as $details3 => $detail3) {
                    $tmpArr3 = [
                            'INCOME_TYPE' => $detail3['INCOME_TYPE'],
                            'POLICY_ID' => $detail3['POLICY_ID'],
                            // 'PARTNER_NAME' => $detail3['PARTNER_NAME'],
                            'RELATION_ID' => array_key_exists("RELATION_ID",$detail3) ? $detail3['RELATION_ID'] : null,
                            'PERSON_ID' => array_key_exists("PERSON_ID",$detail3) ? $detail3['PERSON_ID'] : null,
                            'BROKERAGE_FEE_PERCENTAGE' => $detail3['BROKERAGE_FEE_PERCENTAGE'],
                            'BROKERAGE_FEE_AMOUNT' => $detail3['BROKERAGE_FEE_AMOUNT'],
                            'ENGINEERING_FEE_PERCENTAGE' => $detail3['ENGINEERING_FEE_PERCENTAGE'],
                            'ENGINEERING_FEE_AMOUNT' => $detail3['ENGINEERING_FEE_AMOUNT'],
                            'ADMIN_COST' => $detail3['ADMIN_COST'],
                            'CONSULTANCY_FEE_PERCENTAGE' => $detail3['CONSULTANCY_FEE_PERCENTAGE'],
                            'CONSULTANCY_FEE_AMOUNT' => $detail3['CONSULTANCY_FEE_AMOUNT'],

                            // tambahan field 29-08-2024
                            'M_PKS_RELATION_ID' => array_key_exists("M_PKS_RELATION_ID",$detail3) ? $detail3['M_PKS_RELATION_ID'] : null,
                            'BROKERAGE_FEE_VAT' => array_key_exists("BROKERAGE_FEE_VAT",$detail3) ? $detail3['BROKERAGE_FEE_VAT'] : null,
                            'BROKERAGE_FEE_PPN' => $detail3['BROKERAGE_FEE_PPN'],
                            'BROKERAGE_FEE_PPH' => $detail3['BROKERAGE_FEE_PPH'],
                            'BROKERAGE_FEE_NETT_AMOUNT' => $detail3['BROKERAGE_FEE_NETT_AMOUNT'],
                            'ENGINEERING_FEE_VAT' => array_key_exists("ENGINEERING_FEE_VAT",$detail3) ? $detail3['ENGINEERING_FEE_VAT'] : null,
                            'ENGINEERING_FEE_PPN' => $detail3['ENGINEERING_FEE_PPN'],
                            'ENGINEERING_FEE_PPH' => $detail3['ENGINEERING_FEE_PPH'],
                            'ENGINEERING_FEE_NETT_AMOUNT' => $detail3['ENGINEERING_FEE_NETT_AMOUNT'],
                            'CONSULTANCY_FEE_VAT' => array_key_exists("CONSULTANCY_FEE_VAT",$detail3) ? $detail3['CONSULTANCY_FEE_VAT'] : null,
                            'CONSULTANCY_FEE_PPN' => $detail3['CONSULTANCY_FEE_PPN'],
                            'CONSULTANCY_FEE_PPH' => $detail3['CONSULTANCY_FEE_PPH'],
                            'CONSULTANCY_FEE_NETT_AMOUNT' => $detail3['CONSULTANCY_FEE_NETT_AMOUNT'],
                        ];
                        array_push($arrData, $tmpArr3);
                        $policy_id = $detail3['POLICY_ID'];
                }
            }

            if (array_key_exists("income_detail", $data[3])) {
                $data_acquisition =$data[3]['income_detail'];
                foreach ($data_acquisition as $details4 => $detail4) {
                    $tmpArr4 = [
                            'INCOME_TYPE' => $detail4['INCOME_TYPE'],
                            'POLICY_ID' => $detail4['POLICY_ID'],
                            // 'PARTNER_NAME' => $detail4['PARTNER_NAME'],
                            'RELATION_ID' => array_key_exists("RELATION_ID",$detail4) ? $detail4['RELATION_ID'] : null,
                            'PERSON_ID' => array_key_exists("PERSON_ID",$detail4) ? $detail4['PERSON_ID'] : null,
                            'BROKERAGE_FEE_PERCENTAGE' => $detail4['BROKERAGE_FEE_PERCENTAGE'],
                            'BROKERAGE_FEE_AMOUNT' => $detail4['BROKERAGE_FEE_AMOUNT'],
                            'ENGINEERING_FEE_PERCENTAGE' => $detail4['ENGINEERING_FEE_PERCENTAGE'],
                            'ENGINEERING_FEE_AMOUNT' => $detail4['ENGINEERING_FEE_AMOUNT'],
                            'ADMIN_COST' => $detail4['ADMIN_COST'],
                            'CONSULTANCY_FEE_PERCENTAGE' => $detail4['CONSULTANCY_FEE_PERCENTAGE'],
                            'CONSULTANCY_FEE_AMOUNT' => $detail4['CONSULTANCY_FEE_AMOUNT'],

                            // tambahan field 29-08-2024
                            'M_PKS_RELATION_ID' => array_key_exists("M_PKS_RELATION_ID",$detail4) ? $detail4['M_PKS_RELATION_ID'] : null,
                            'BROKERAGE_FEE_VAT' => array_key_exists("BROKERAGE_FEE_VAT",$detail4) ? $detail4['BROKERAGE_FEE_VAT'] : null,
                            'BROKERAGE_FEE_PPN' => $detail4['BROKERAGE_FEE_PPN'],
                            'BROKERAGE_FEE_PPH' => $detail4['BROKERAGE_FEE_PPH'],
                            'BROKERAGE_FEE_NETT_AMOUNT' => $detail4['BROKERAGE_FEE_NETT_AMOUNT'],
                            'ENGINEERING_FEE_VAT' => array_key_exists("ENGINEERING_FEE_VAT",$detail4) ? $detail4['ENGINEERING_FEE_VAT'] : null,
                            'ENGINEERING_FEE_PPN' => $detail4['ENGINEERING_FEE_PPN'],
                            'ENGINEERING_FEE_PPH' => $detail4['ENGINEERING_FEE_PPH'],
                            'ENGINEERING_FEE_NETT_AMOUNT' => $detail4['ENGINEERING_FEE_NETT_AMOUNT'],
                            'CONSULTANCY_FEE_VAT' => array_key_exists("CONSULTANCY_FEE_VAT",$detail4) ? $detail4['CONSULTANCY_FEE_VAT'] : null,
                            'CONSULTANCY_FEE_PPN' => $detail4['CONSULTANCY_FEE_PPN'],
                            'CONSULTANCY_FEE_PPH' => $detail4['CONSULTANCY_FEE_PPH'],
                            'CONSULTANCY_FEE_NETT_AMOUNT' => $detail4['CONSULTANCY_FEE_NETT_AMOUNT'],
                        ];
                        array_push($arrData, $tmpArr4);
                        $policy_id = $detail4['POLICY_ID'];
                }
            }
            
            MPolicyPartners::where('POLICY_ID', $policy_id)->delete();
            MPolicyPartners::insert($arrData);
        });
        
        return new JsonResponse([
            "msg" => "Succeed Update Partners",
            "id" => $request->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    
}
