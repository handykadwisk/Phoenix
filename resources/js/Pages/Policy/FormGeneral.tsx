import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import { PageProps } from "@/types";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
} from "@heroicons/react/20/solid";
import {
    FormEvent,
    Fragment,
    PropsWithChildren,
    useEffect,
    useState,
} from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import Button from "@/Components/Button/Button";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";
import SwitchPage from "@/Components/Switch";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import Collapsible from "@/Components/Collapsible/Collapsible";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import { BeatLoader } from "react-spinners";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import Checkbox from "@/Components/Checkbox";
import ToastMessage from "@/Components/ToastMessage";
// import ModalTest from "./ModalTest";

export default function FormGeneral({
    policy,
    insurance,
    clients,
    insuranceType,
    policyStatus,
    currency,
    onDeleteSuccess,
}: PropsWithChildren<{
    policy: any;
    insurance: any | null;
    clients: any | null;
    insuranceType: any | null;
    policyStatus: any | null;
    currency: any | null;
    onDeleteSuccess: any;
}>) {
    const [policyDetail, setPolicyDetail] = useState<any>(policy);
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [currencyFromCoverage, setCurrencyFromCoverage] = useState<any>([]);
    const [dataById, setDataById] = useState<any>(policy);
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [dataInsurer, setDataInsurer] = useState<any>([]);
    const [dataEditInsurer, setDataEditInsurer] = useState<any>([]);
    const [flagDelete, setFlagDelete] = useState<number>(0);
    const [triggerSumIncome, setTriggerSumIncome] = useState<number>(0);
    const [triggerEditSumIncome, setTriggerEditSumIncome] = useState<number>(0);
    const [coverageName, setCoverageName] = useState<any>([]);
    const [coverageGrouping, setCoverageGrouping] = useState<any>([]);
    const [dataCoverageName, setDataCoverageName] = useState<any>([]);
    const [dataPolicyCoverage, setDataPolicyCoverage] = useState<any>([]);
    const [listPksNumber, setListPksNumber] = useState<any>([]);
    const [relationIdForPayable, setRelationIdForPayable] = useState<any>([]);
    const [isSuccess, setIsSuccess] = useState<string>("");

    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    const [interestInsured, setInterestInsured] = useState<any>([]);
    const policyType = [
        { ID: "1", NAME: "Full Policy" },
        { ID: "2", NAME: "Master Policy/Certificate" },
    ];

    useEffect(() => {
        getFbiPks(13);
        getAgent(3);
        getBAA(12);
        getInsurancePanel(policy.POLICY_ID);
        getCoverageNameByPolicyId(policy.POLICY_ID);
        getCoverageGrouping(policy.POLICY_ID);
        getDataCoverageName(policy.POLICY_ID);
        getDataInsured(policy.POLICY_ID);
        getDetailPolicy(policy.POLICY_ID);
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);
        getDataPartner(policy.POLICY_ID);
        getPolicyExchangeRate(policy.POLICY_ID);
        getInterestInsured();
        getDataForSummary();
        getSummaryFinancial(policy.POLICY_ID);
        getCoa();
    }, [policy.POLICY_ID]);

    const getDetailPolicy = async (id: number) => {
        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setPolicyDetail(res.data))
            .catch((err) => console.log(err));
    };

    const getCurrencyOnPolicyCoverage = async (id: number) => {
        await axios
            .get(`/getCurrencyOnPolicyCoverage/${id}`)
            .then((res) => setCurrencyFromCoverage(res.data))
            .catch((err) => console.log(err));
    };

    const getInterestInsured = async () => {
        await axios
            .get(`/getInterestInsured`)
            .then((res) => setInterestInsured(res.data))
            .catch((err) => console.log(err));
    };

    const getInsurancePanel = async (id: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => {
                setInsurancePanels(res.data),
                    setIsLoading({
                        ...isLoading,
                        get_detail: false,
                    });
            })
            .catch((err) => console.log(err));
    };

   
    const getCoverageNameByPolicyId = async (policy_id: number) => {
        await axios
            .get(`/getCoverageByPolicyId/${policy_id}`)
            .then((res) => setCoverageName(res.data))
            .catch((err) => console.log(err));
    };

    const getCoverageGrouping = async (policy_id: number) => {
        await axios
            .get(`/getCoverageGroupingByPolicyId/${policy_id}`)
            .then((res) => setCoverageGrouping(res.data))
            .catch((err) => console.log(err));
    };

    const getDataCoverageName = async (policy_id: number) => {
        await axios
            .get(`/getDataCoverage/${policy_id}`)
            .then((res) => setDataCoverageName(res.data))
            .catch((err) => console.log(err));
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
        addInsurer: false,
        editInsurer: false,
        addCoverage: false,
        editCoverage: false,
        addInsured: false,
        editInsured: false,
        addPartners: false,
        editPartners: false,
    });

    const getCurrencyById = (currId: any) => {
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result.CURRENCY_SYMBOL : null;
    };

    const getInterestInsuredById = (insterestInsuredId: any) => {
        const dataInterest = interestInsured;
        const result = dataInterest.find(
            (id: any) => id.INTEREST_INSURED_ID == insterestInsuredId
        );
        return result ? result.INTEREST_INSURED_NAME : null;
    };

    const getAgentById = (agentId: any) => {
        const dataAgent = listAgent;
        const result = dataAgent.find(
            (id: any) => id.RELATION_ORGANIZATION_ID == agentId
        );
        return result ? result.RELATION_ORGANIZATION_NAME : null;
    };

    const getBaaById = (personId: any) => {
        const dataBaa = listBAA;
        const result = dataBaa.find((id: any) => id.PERSON_ID == personId);
        return result ? result.PERSON_FIRST_NAME : null;
    };

    
    // Add Co Broking
    const [modalCoBroking, setModalCoBroking] = useState({
        addCoBroking: false,
    });

    const [dataCoBroking, setDataCoBroking] = useState<any>([]);
    const fieldCoBroking: any = {
        CO_BROKING_ID: "",
        POLICY_ID: "",
        RELATION_ID: "", // yg pertama Default Fresnel
        CO_BROKING_PERCENTAGE: "",
        CO_BROKING_IS_LEADER: 0,
    };

    const [switchCoBroking, setSwitchCoBroking] = useState<boolean>(false);

    // const handleAddInsurer = async () => {
    //     setSwitchCoBroking(policy.CO_BROKING ? true : false);
    // };

    const handleSwitchCoBroking = () => {
        setSwitchCoBroking(!switchCoBroking);
    };

    const mappingCoBroking = (policy_id: number) => {
        axios
            .post(`/mappingCoBroking?`, {
                policy_id: policy_id,
            })
            .then((res) => setDataCoBroking(res.data))
            .catch((err) => console.log(err));
    };
    
    const handleAddCoBroking = async (policy_id: any) => {
        // getInterestInsured();
        getBroker(9);
        mappingCoBroking(policy_id)
        setModalCoBroking({
            addCoBroking: !modalCoBroking.addCoBroking,
        });
    };

    const inputCoBroking = (
        name: string,
        value: any,
        i: number
    ) => {
        const changeVal: any = [...dataCoBroking];
        changeVal[i][name] = value;
        
        setDataCoBroking(changeVal);
    };

    const addRowCoBroking = (e: FormEvent, policy_id:any) => {
        e.preventDefault();

        setDataCoBroking([...dataCoBroking, { ...fieldCoBroking, POLICY_ID: policy_id }]);

    };

    const deleteRowCoBroking = (i: number) => {
        const items = [...dataCoBroking];
        items.splice(i, 1);
        setDataCoBroking(items);
    };

    console.log("dataCoBroking: ", dataCoBroking);

    const handleSuccessCoBroking = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModalCoBroking({
            addCoBroking: !modalCoBroking.addCoBroking,
        });
        setDataCoBroking([]);
    };
    // End Add Co Broking

    // Add Policy Coverage
    const fieldDataCoverage: any = {
        POLICY_ID: "",
        POLICY_COVERAGE_NAME: "",
        policy_coverage_detail: [
            {
                POLICY_COVERAGE_ID: "",
                INTEREST_INSURED_ID: "",
                REMARKS: "",
                CURRENCY_ID: "",
                SUM_INSURED: 0,
                RATE: 0,
                GROSS_PREMIUM: 0,
                LOST_LIMIT_PERCENTAGE: 0,
                LOST_LIMIT_AMOUNT: 0,
                LOST_LIMIT_SCALE: 0,
                INSURANCE_DISC_PERCENTAGE: 0,
                INSURANCE_DISC_AMOUNT: 0,
                DEPOSIT_PREMIUM_PERCENTAGE: 0,
                DEPOSIT_PREMIUM_AMOUNT: 0,
                PREMIUM: 0,
            },
        ],
    };

    const handleAddCoverage = async (policy_id: any) => {
        getInterestInsured();
        setDataPolicyCoverage([{ ...fieldDataCoverage, POLICY_ID: policy_id }]);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: !modal.addCoverage,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };

    const addRowCoverage = (e: FormEvent) => {
        e.preventDefault();
        setDataPolicyCoverage([
            ...dataPolicyCoverage,
            { ...fieldDataCoverage, POLICY_ID: policy.POLICY_ID },
        ]);
    };

    const deleteRowCoverage = (i: number) => {
        const items = [...dataPolicyCoverage];
        items.splice(i, 1);
        setDataPolicyCoverage(items);
    };

    const addRowCoverageDetail = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataPolicyCoverage];
        let item = {
            ...items[i],
            policy_coverage_detail: [
                ...items[i].policy_coverage_detail,
                {
                    POLICY_COVERAGE_ID: "",
                    INTEREST_INSURED_ID: "",
                    REMARKS: "",
                    CURRENCY_ID: "",
                    SUM_INSURED: 0,
                    RATE: 0,
                    GROSS_PREMIUM: 0,
                    LOST_LIMIT_PERCENTAGE: 0,
                    LOST_LIMIT_AMOUNT: 0,
                    LOST_LIMIT_SCALE: 0,
                    INSURANCE_DISC_PERCENTAGE: 0,
                    INSURANCE_DISC_AMOUNT: 0,
                    PREMIUM: 0,
                    DEPOSIT_PREMIUM_PERCENTAGE: 0,
                    DEPOSIT_PREMIUM_AMOUNT: 0,
                },
            ],
        };
        items[i] = item;

        setDataPolicyCoverage(items);
    };

    const deleteRowCoverageDetail = (
        coverageNum: number,
        detailNum: number
    ) => {
        const items = [...dataPolicyCoverage];
        const item = { ...items[coverageNum] };
        item.policy_coverage_detail.splice(detailNum, 1);
        items[coverageNum] = item;
        setDataPolicyCoverage(items);
    };

    const inputCoverageDetail = (
        name: string,
        value: any,
        coverageNum: number,
        detailNum: number
    ) => {
        const items = [...dataPolicyCoverage];
        const item = { ...items[coverageNum] };
        const policy_coverage_details = [...item.policy_coverage_detail];
        const policy_coverage_detail = {
            ...policy_coverage_details[detailNum],
        };

        if (name == "SUM_INSURED") {
            if (value == undefined) {
                value = 0;
            } else {
                policy_coverage_detail["SUM_INSURED"] = value;
            }
        }
        if (name == "RATE") {
            if (value == undefined) {
                value = 0;
            }
        }
        if (name == "LOST_LIMIT_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
        }
        if (name == "DEPOSIT_PREMIUM_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
        }

        let sum_insured = policy_coverage_detail["SUM_INSURED"];
        // let policy_coverage_id = policy_coverage_detail["POLICY_COVERAGE_ID"];
        if (name == "RATE") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["GROSS_PREMIUM"] =
                (sum_insured * value) / 100;
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "GROSS_PREMIUM") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "LOST_LIMIT_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "LOST_LIMIT_SCALE") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["LOST_LIMIT_AMOUNT"] =
                (policy_coverage_detail["GROSS_PREMIUM"] *
                    policy_coverage_detail["LOST_LIMIT_SCALE"]) /
                100;
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "INSURANCE_DISC_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["INSURANCE_DISC_AMOUNT"] =
                ((policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) *
                    policy_coverage_detail["INSURANCE_DISC_PERCENTAGE"]) /
                100;
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "INSURANCE_DISC_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            policy_coverage_detail["PREMIUM"] =
                (policy_coverage_detail["LOST_LIMIT_AMOUNT"] == 0 ||
                policy_coverage_detail["LOST_LIMIT_AMOUNT"] == null
                    ? policy_coverage_detail["GROSS_PREMIUM"]
                    : policy_coverage_detail["LOST_LIMIT_AMOUNT"]) -
                policy_coverage_detail["INSURANCE_DISC_AMOUNT"];
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }

        if (name == "DEPOSIT_PREMIUM_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            // policy_coverage_detail["LOST_LIMIT_SCALE"] = policy_coverage_detail["LOST_LIMIT_SCALE"] + 20;
            policy_coverage_detail["DEPOSIT_PREMIUM_AMOUNT"] =
                (policy_coverage_detail["PREMIUM"] *
                    policy_coverage_detail["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }
        // if (name == "POLICY_COVERAGE_ID") {
        //     policy_coverage_id = value;
        // }

        // if (name == "CURRENCY_ID" || name == "POLICY_COVERAGE_ID") {
        // }
        policy_coverage_detail[name] = value;
        policy_coverage_details[detailNum] = policy_coverage_detail;
        item.policy_coverage_detail = policy_coverage_details;
        items[coverageNum] = item;
        setDataPolicyCoverage(items);
    };


    const inputDataCoverage = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const items = [...dataPolicyCoverage];
        const item = { ...items[i] };
        item[name] = value;
        items[i] = item;
        setDataPolicyCoverage(items);
    };
    // End Add Policy Coverage

    // Edit Policy COverage
    const [dataEditPolicyCoverage, setDataEditPolicyCoverage] = useState<any>(
        []
    );
    const handleEditCoverage = async (id: string) => {
        getInterestInsured();
        await axios
            .get(`/getCoverageById/${id}`)
            .then((res) => setDataEditPolicyCoverage(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: !modal.editCoverage,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };

    const editPolicyCoverage = (i: number, value: string) => {
        const items = [...dataEditPolicyCoverage];
        const item = { ...items[i] };
        item.POLICY_COVERAGE_NAME = value;
        items[i] = item;
        setDataEditPolicyCoverage(items);
    };

    const editCoverageDetail = (name: string, value: any, i: number) => {
        const changeVal: any = [
            ...dataEditPolicyCoverage.policy_coverage_detail,
        ];

        if (name == "SUM_INSURED") {
            if (value == undefined) {
                value = 0;
            } else {
                changeVal[i]["SUM_INSURED"] = value;
            }
        }
        if (name == "RATE") {
            if (value == undefined) {
                value = 0;
            }
        }
        if (name == "LOST_LIMIT_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
        }
        if (name == "DEPOSIT_PREMIUM_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
        }

        let sum_insured = changeVal[i]["SUM_INSURED"];
        if (name == "RATE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["GROSS_PREMIUM"] = (sum_insured * value) / 100;
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }
        if (name == "GROSS_PREMIUM") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }

        if (name == "LOST_LIMIT_SCALE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["LOST_LIMIT_AMOUNT"] =
                (changeVal[i]["GROSS_PREMIUM"] *
                    changeVal[i]["LOST_LIMIT_SCALE"]) /
                100;
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }
        if (name == "LOST_LIMIT_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }

        if (name == "INSURANCE_DISC_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["INSURANCE_DISC_AMOUNT"] =
                ((changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) *
                    changeVal[i]["INSURANCE_DISC_PERCENTAGE"]) /
                100;
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }
        if (name == "INSURANCE_DISC_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["PREMIUM"] =
                (changeVal[i]["LOST_LIMIT_AMOUNT"] == 0 ||
                changeVal[i]["LOST_LIMIT_AMOUNT"] == null
                    ? changeVal[i]["GROSS_PREMIUM"]
                    : changeVal[i]["LOST_LIMIT_AMOUNT"]) -
                changeVal[i]["INSURANCE_DISC_AMOUNT"];
        }

        if (name == "DEPOSIT_PREMIUM_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["DEPOSIT_PREMIUM_AMOUNT"] =
                (changeVal[i]["PREMIUM"] *
                    changeVal[i]["DEPOSIT_PREMIUM_PERCENTAGE"]) /
                100;
        }
        // if (name == "DEPOSIT_PREMIUM_AMOUNT") {
        changeVal[i]["DEPOSIT_PREMIUM_AMOUNT"] =
            (changeVal[i]["PREMIUM"] *
                changeVal[i]["DEPOSIT_PREMIUM_PERCENTAGE"]) /
            100;
        // }

        changeVal[i][name] = value;
        setDataEditPolicyCoverage({
            ...dataEditPolicyCoverage,
            policy_coverage_detail: changeVal,
        });
    };

    const addRowEditCoverageDetail = (e: FormEvent, coverage_id: string) => {
        e.preventDefault();
        setDataEditPolicyCoverage({
            ...dataEditPolicyCoverage,
            policy_coverage_detail: [
                ...dataEditPolicyCoverage.policy_coverage_detail,
                {
                    POLICY_COVERAGE_DETAIL_ID: null,
                    POLICY_COVERAGE_ID: coverage_id,
                    INTEREST_INSURED_ID: "",
                    REMARKS: "",
                    CURRENCY_ID: "",
                    SUM_INSURED: 0,
                    RATE: 0,
                    GROSS_PREMIUM: 0,
                    LOST_LIMIT_PERCENTAGE: 0,
                    LOST_LIMIT_AMOUNT: 0,
                    LOST_LIMIT_SCALE: 0,
                    INSURANCE_DISC_PERCENTAGE: 0,
                    INSURANCE_DISC_AMOUNT: 0,
                    PREMIUM: 0,
                    DEPOSIT_PREMIUM_PERCENTAGE: 0,
                    DEPOSIT_PREMIUM_AMOUNT: 0,
                },
            ],
        });
    };
    const deleteRowEditCoverageDetail = (i: number) => {
        const val = [...dataEditPolicyCoverage.policy_coverage_detail];
        val.splice(i, 1);
        if (
            dataEditPolicyCoverage.policy_coverage_detail[i]
                .POLICY_COVERAGE_DETAIL_ID !== null
        ) {
            if (dataEditPolicyCoverage.deletedCoverageDetail) {
                setDataEditPolicyCoverage({
                    ...dataEditPolicyCoverage,
                    policy_coverage_detail: val,
                    deletedCoverageDetail: [
                        ...dataEditPolicyCoverage.deletedCoverageDetail,
                        {
                            POLICY_COVERAGE_DETAIL_ID:
                                dataEditPolicyCoverage.policy_coverage_detail[i]
                                    .POLICY_COVERAGE_DETAIL_ID,
                        },
                    ],
                });
            } else {
                setDataEditPolicyCoverage({
                    ...dataEditPolicyCoverage,
                    policy_coverage_detail: val,
                    deletedCoverageDetail: [
                        {
                            POLICY_COVERAGE_DETAIL_ID:
                                dataEditPolicyCoverage.policy_coverage_detail[i]
                                    .POLICY_COVERAGE_DETAIL_ID,
                        },
                    ],
                });
            }
        } else {
            setDataEditPolicyCoverage({
                ...dataEditPolicyCoverage,
                policy_coverage_detail: val,
            });
        }
    };

    // End Edit Policy COverage

    // Add Insurer
    const handleAddInsurer = async () => {
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);
        getCoverageGrouping(id);
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);

        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: !modal.addInsurer,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };
    const fieldDataInsurer: any = {
        INSURANCE_ID: "",
        POLICY_ID: policy.POLICY_ID,
        IP_POLICY_SHARE: "",
        IP_POLICY_LEADER: 0,
        IP_CURRENCY_ID: 1,
        POLICY_COST: 0,
        premium: [],
    };
    const addRowDataInsurer = (jml: string) => {
        let arr: any = [];

        for (let i = 0; i < parseInt(jml); i++) {
            arr.push(fieldDataInsurer);
        }

        if (coverageName.length > 0) {
            let premium: any = [];
            for (let j = 0; j < coverageName.length; j++) {
                premium.push({
                    INTEREST_INSURED_ID: coverageName[j]["INTEREST_INSURED_ID"],
                    REMARKS: coverageName[j]["REMARKS"],
                    CURRENCY_ID: coverageName[j]["CURRENCY_ID"],
                    POLICY_COVERAGE_ID: coverageName[j]["POLICY_COVERAGE_ID"],
                    COVERAGE_NAME: coverageName[j]["POLICY_COVERAGE_NAME"],
                    GROSS_PREMI: coverageName[j]["PREMIUM"],
                    BROKERAGE_FEE_PERCENTAGE: 0,
                    BROKERAGE_FEE: 0,
                    BROKERAGE_FEE_VAT: 0,
                    BROKERAGE_FEE_PPN: 0,
                    BROKERAGE_FEE_PPH: 0,
                    BROKERAGE_FEE_NETT_AMOUNT: 0,
                    ENGINEERING_FEE_PERCENTAGE: 0,
                    ENGINEERING_FEE: 0,
                    ENGINEERING_FEE_VAT: 0,
                    ENGINEERING_FEE_PPN: 0,
                    ENGINEERING_FEE_PPH: 0,
                    ENGINEERING_FEE_NETT_AMOUNT: 0,
                    CONSULTANCY_FEE_PERCENTAGE: 0,
                    CONSULTANCY_FEE: 0,
                    CONSULTANCY_FEE_VAT: 0,
                    CONSULTANCY_FEE_PPN: 0,
                    CONSULTANCY_FEE_PPH: 0,
                    CONSULTANCY_FEE_NETT_AMOUNT: 0,
                    NETT_PREMI: 0,
                });
            }

            for (let k = 0; k < arr.length; k++) {
                arr[k]["premium"] = premium;
            }
        }

        setDataInsurer(arr);
    };


    const addRowInsurerCoverage = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataInsurer];
        let item = {
            ...items[i],
            premium: [
                ...items[i].premium,
                {
                    CURRENCY_ID: "",
                    POLICY_COVERAGE_ID: "",
                    COVERAGE_NAME: "",
                    GROSS_PREMI: 0,
                    NETT_PREMI: 0,
                    BROKERAGE_FEE: 0,
                    ENGINEERING_FEE: 0,
                },
            ],
        };
        items[i] = item;

        setDataInsurer(items);
    };

    const deleteRowInsurerCoverage = (
        insurerNum: number,
        coverageNum: number
    ) => {
        const items = [...dataInsurer];
        const item = { ...items[insurerNum] };
        item.premium.splice(coverageNum, 1);
        items[insurerNum] = item;
        setDataInsurer(items);
    };

    const inputDataInsurer = (name: string, value: any, i: number) => {
        const items = [...dataInsurer];
        const item = { ...items[i] };
        if (name == "IP_POLICY_LEADER") {
            if (value == 0) {
                item["IP_CURRENCY_ID"] = 1;
                item["POLICY_COST"] = 0;
            }
        }
        item[name] = value;
        items[i] = item;
        setDataInsurer(items);
    };

    const inputInsurerCoverage = (
        name: string,
        value: any,
        insurerNum: number,
        coverageNum: number
    ) => {
        const items = [...dataInsurer];
        const item = { ...items[insurerNum] };
        const premiums = [...item.premium];
        const premium = { ...premiums[coverageNum] };

        if (name == "GROSS_PREMI") {
            if (value == undefined) {
                value = 0;
            } else {
                premium["GROSS_PREMI"] = value;
            }
        }

        let coverage_premium = premium["GROSS_PREMI"];

        if (name == "BROKERAGE_FEE_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            premium["BROKERAGE_FEE"] =
                (coverage_premium * premium["BROKERAGE_FEE_PERCENTAGE"]) / 100;
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1,022)
            // PPh BF = 2 %
            if (premium["BROKERAGE_FEE_VAT"] == 1) {
                bf_after_ppn = parseFloat( premium["BROKERAGE_FEE"]) / 1.022;
                bf_ppn =  premium["BROKERAGE_FEE"] - bf_after_ppn;
                bf_pph = (( premium["BROKERAGE_FEE"] - bf_ppn) * 2) / 100;
            } else {
                bf_ppn = 0;
                bf_pph = ( premium["BROKERAGE_FEE"] * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] =  premium["BROKERAGE_FEE"] - bf_ppn - bf_pph;
        }
        if (name == "BROKERAGE_FEE") {
            if (value == undefined) {
                value = 0;
            }
            // paramBF = true
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1,022)
            // PPh BF = 2 %
            if (premium["BROKERAGE_FEE_VAT"] == 1) {
                bf_after_ppn = parseFloat(value) / 1.022;
                bf_ppn = value - bf_after_ppn;
                bf_pph = ((value - bf_ppn) * 2) / 100;
            } else {
                bf_ppn = 0;
                bf_pph = (value * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] = value - bf_ppn - bf_pph;
        }

        if (name == "ENGINEERING_FEE_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            premium["ENGINEERING_FEE"] =
                (coverage_premium * premium["ENGINEERING_FEE_PERCENTAGE"]) /
                100;
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            if (premium["ENGINEERING_FEE_VAT"] == 1) {
                ef_after_ppn = parseFloat(premium["ENGINEERING_FEE"]) / 1.022;
                ef_ppn = premium["ENGINEERING_FEE"] - ef_after_ppn;
                ef_pph = ((premium["ENGINEERING_FEE"] - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (premium["ENGINEERING_FEE"] * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] = premium["ENGINEERING_FEE"] - ef_ppn - ef_pph;
        }
        if (name == "ENGINEERING_FEE") {
            if (value == undefined) {
                value = 0;
            }
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            if (premium["ENGINEERING_FEE_VAT"] == 1) {
                ef_after_ppn = parseFloat(value) / 1.022;
                ef_ppn = value - ef_after_ppn;
                ef_pph = ((value - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (value * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] = value - ef_ppn - ef_pph;
        }

        if (name == "CONSULTANCY_FEE") {
            if (value == undefined) {
                value = 0;
            }
            let cf_after_ppn = 0;
            let cf_ppn = 0;
            let cf_pph = 0;
            // Include VAT
            // PPn CF = 11 %
            // PPh CF = 2 %
            if (premium["CONSULTANCY_FEE_VAT"] == 1) {
                cf_ppn = (parseFloat(value) * 11) / 100;
                cf_after_ppn = value - cf_ppn;
                cf_pph = ((value - cf_after_ppn) * 2) / 100;
            } else {
                cf_pph = (value * 2) / 100;
            }
            premium["CONSULTANCY_FEE_PPN"] = -cf_ppn;
            premium["CONSULTANCY_FEE_PPH"] = -cf_pph;
            premium["CONSULTANCY_FEE_NETT_AMOUNT"] = value - cf_ppn - cf_pph;
        }

        // VAT
        if (name == "BROKERAGE_FEE_VAT") {
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1,022)
            // PPh BF = 2 %
            // if (value == 1 || premium["BROKERAGE_FEE_VAT"] == 1) {
            if (value == 1) {
                bf_after_ppn = parseFloat(premium["BROKERAGE_FEE"]) / 1.022;
                bf_ppn = premium["BROKERAGE_FEE"] - bf_after_ppn;
                bf_pph = ((premium["BROKERAGE_FEE"] - bf_ppn) * 2) / 100;
            } else {
                bf_ppn = 0;
                bf_pph = (premium["BROKERAGE_FEE"] * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] =
                premium["BROKERAGE_FEE"] - bf_ppn - bf_pph;
        }

        if (name == "ENGINEERING_FEE_VAT") {
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            // if (value == 1 || premium["ENGINEERING_FEE_VAT"] == 1) {
            if (value == 1) {
                ef_after_ppn = parseFloat(premium["ENGINEERING_FEE"]) / 1.022;
                ef_ppn = premium["ENGINEERING_FEE"] - ef_after_ppn;
                ef_pph = ((premium["ENGINEERING_FEE"] - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (premium["ENGINEERING_FEE"] * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] =
                premium["ENGINEERING_FEE"] - ef_ppn - ef_pph;
        }
        if (name == "CONSULTANCY_FEE_VAT") {
            let cf_after_ppn = 0;
            let cf_ppn = 0;
            let cf_pph = 0;
            // Include VAT
            // PPn CF = 11 %
            // PPh CF = 2 %
            // if (value == 1 || premium["CONSULTANCY_FEE_VAT"] == 1) {
            if (value == 1) {
                cf_ppn = (parseFloat(premium["CONSULTANCY_FEE"]) * 11) / 100;
                cf_after_ppn = premium["CONSULTANCY_FEE"] - cf_ppn;
                cf_pph =
                    ((premium["CONSULTANCY_FEE"] - cf_after_ppn) * 2) / 100;
            } else {
                cf_pph = (premium["CONSULTANCY_FEE"] * 2) / 100;
            }
            premium["CONSULTANCY_FEE_PPN"] = -cf_ppn;
            premium["CONSULTANCY_FEE_PPH"] = -cf_pph;
            premium["CONSULTANCY_FEE_NETT_AMOUNT"] =
                premium["CONSULTANCY_FEE"] - cf_ppn - cf_pph;
        }

        // END VAT

        // Isi Nett Premi ambil dari BF, CF dan EF yg Nett Nya
        premium["NETT_PREMI"] =
            coverage_premium -
            premium["BROKERAGE_FEE_NETT_AMOUNT"] -
            // premium["ENGINEERING_FEE_NETT_AMOUNT"] -
            premium["CONSULTANCY_FEE_NETT_AMOUNT"];

        premium[name] = value;
        premiums[coverageNum] = premium;
        item.premium = premiums;
        items[insurerNum] = item;
        setDataInsurer(items);
    };

    // End Add Insurer

    // Edit Insurer
    const handleSuccessEditInsurer = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        getInsurancePanel(policy.POLICY_ID);
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };
    const handleEditInsurer = async () => {
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);
        getCoverageGrouping(id);

        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setDataEditInsurer(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: !modal.editInsurer,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };

    const addRowEditDataInsurer = (jml: string) => {
        let arr: any = [];

        for (let i = 0; i < parseInt(jml); i++) {
            arr.push(fieldDataInsurer);
        }

        if (coverageName.length > 0) {
            let premium: any = [];
            for (let j = 0; j < coverageName.length; j++) {
                premium.push({
                    CURRENCY_ID: "",
                    POLICY_COVERAGE_ID: coverageName[j]["POLICY_COVERAGE_ID"],
                    COVERAGE_NAME: coverageName[j]["POLICY_COVERAGE_NAME"],
                    GROSS_PREMI: 0,
                    ADMIN_COST: 0,
                    DISC_BROKER: 0,
                    DISC_CONSULTATION: 0,
                    DISC_ADMIN: 0,
                    NETT_PREMI: 0,
                    FEE_BASED_INCOME: 0,
                    AGENT_COMMISION: 0,
                    ACQUISITION_COST: 0,
                    BROKERAGE_FEE: 0,
                    CONSULTANCY_FEE: 0,
                    ENGINEERING_FEE: 0,
                });
            }

            for (let k = 0; k < arr.length; k++) {
                arr[k]["premium"] = premium;
            }
        }

        setDataEditInsurer(arr);
    };

    const addRowEditInsurerCoverage = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataEditInsurer];
        let item = {
            ...items[i],
            premium: [
                ...items[i].premium,
                {
                    CURRENCY_ID: "",
                    POLICY_COVERAGE_ID: "",
                    COVERAGE_NAME: "",
                    GROSS_PREMI: 0,
                    ADMIN_COST: 0,
                    DISC_BROKER: 0,
                    DISC_CONSULTATION: 9,
                    DISC_ADMIN: 0,
                    NETT_PREMI: 0,
                    FEE_BASED_INCOME: 0,
                    AGENT_COMMISION: 0,
                    ACQUISITION_COST: 0,
                },
            ],
        };
        items[i] = item;

        setDataEditInsurer(items);
    };


    const editDataInsurer = (name: string, value: any, i: number) => {
        const items = [...dataEditInsurer];
        const item = { ...items[i] };
        if (name == "IP_POLICY_LEADER") {
            if (value == 0) {
                item["IP_CURRENCY_ID"] = 1;
                item["POLICY_COST"] = 0;
            }
        }
        item[name] = value;
        items[i] = item;
        setDataEditInsurer(items);
    };

    const editInsurerCoverage = (
        name: string,
        value: any,
        insurerNum: number,
        coverageNum: number
    ) => {
        const items = [...dataEditInsurer];
        const item = { ...items[insurerNum] };
        const premiums = [...item.premium];
        const premium = { ...premiums[coverageNum] };

        let coverage_premium = premium["GROSS_PREMI"];

        if (name == "BROKERAGE_FEE_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            premium["BROKERAGE_FEE"] =
                (coverage_premium * premium["BROKERAGE_FEE_PERCENTAGE"]) / 100;
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1.022)
            // PPh BF = 2 %
            if (premium["BROKERAGE_FEE_VAT"] == 1) {
                bf_after_ppn = parseFloat(premium["BROKERAGE_FEE"]) / 1.022;
                bf_ppn = premium["BROKERAGE_FEE"] - bf_after_ppn;
                bf_pph = ((premium["BROKERAGE_FEE"] - bf_ppn) * 2) / 100;
            } else {
                bf_pph = (premium["BROKERAGE_FEE"] * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] =
                premium["BROKERAGE_FEE"] - bf_ppn - bf_pph;
        }
        if (name == "BROKERAGE_FEE") {
            if (value == undefined) {
                value = 0;
            }
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1.022)
            // PPh BF = 2 %
            if (premium["BROKERAGE_FEE_VAT"] == 1) {
                bf_after_ppn = parseFloat(value) / 1.022;
                bf_ppn = value - bf_after_ppn;
                bf_pph = ((value - bf_ppn) * 2) / 100;
            } else {
                bf_pph = (value * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] = value - bf_ppn - bf_pph;
        }

        if (name == "ENGINEERING_FEE_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            premium["ENGINEERING_FEE"] =
                (coverage_premium * premium["ENGINEERING_FEE_PERCENTAGE"]) /
                100;
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            // PPh EF = 2 %
            if (premium["ENGINEERING_FEE_VAT"] == 1) {
                ef_after_ppn = parseFloat(premium["ENGINEERING_FEE"]) / 1.022;
                ef_ppn = premium["ENGINEERING_FEE"] - ef_after_ppn;
                ef_pph = ((premium["ENGINEERING_FEE"] - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (premium["ENGINEERING_FEE"] * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] =
                premium["ENGINEERING_FEE"] - ef_ppn - ef_pph;
        }
        if (name == "ENGINEERING_FEE") {
            if (value == undefined) {
                value = 0;
            }
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            // PPh EF = 2 %
            if (premium["ENGINEERING_FEE_VAT"] == 1) {
                ef_after_ppn = parseFloat(value) / 1.022;
                ef_ppn = value - ef_after_ppn;
                ef_pph = ((value - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (value * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] = value - ef_ppn - ef_pph;
        }

        if (name == "CONSULTANCY_FEE") {
            if (value == undefined) {
                value = 0;
            }
            let cf_after_ppn = 0;
            let cf_ppn = 0;
            let cf_pph = 0;
            // Include VAT
            // PPn CF = 11%
            // PPh CF = 2 %
            if (premium["CONSULTANCY_FEE_VAT"] == 1) {
                // cf_after_ppn = parseFloat(premium["CONSULTANCY_FEE"]) / 1.022;
                cf_ppn = (parseFloat(value) * 11) / 100;
                cf_after_ppn = value - cf_ppn;
                cf_pph = ((value - cf_after_ppn) * 2) / 100;
            } else {
                cf_pph = (value * 2) / 100;
            }
            premium["CONSULTANCY_FEE_PPN"] = -cf_ppn;
            premium["CONSULTANCY_FEE_PPH"] = -cf_pph;
            premium["CONSULTANCY_FEE_NETT_AMOUNT"] = value - cf_ppn - cf_pph;
        }

        // VAT
        if (name == "BROKERAGE_FEE_VAT") {
            let bf_after_ppn = 0;
            let bf_ppn = 0;
            let bf_pph = 0;
            // Include VAT
            // PPn BF = 2,2 % (1.022)
            // PPh BF = 2 %
            // if (value == 1 || premium["BROKERAGE_FEE_VAT"] == 1) {
            if (value == 1) {
                bf_after_ppn = parseFloat(premium["BROKERAGE_FEE"]) / 1.022;
                bf_ppn = premium["BROKERAGE_FEE"] - bf_after_ppn;
                bf_pph = ((premium["BROKERAGE_FEE"] - bf_ppn) * 2) / 100;
            } else {
                bf_pph = (premium["BROKERAGE_FEE"] * 2) / 100;
            }
            premium["BROKERAGE_FEE_PPN"] = -bf_ppn;
            premium["BROKERAGE_FEE_PPH"] = -bf_pph;
            premium["BROKERAGE_FEE_NETT_AMOUNT"] =
                premium["BROKERAGE_FEE"] - bf_ppn - bf_pph;
        }

        if (name == "ENGINEERING_FEE_VAT") {
            let ef_after_ppn = 0;
            let ef_ppn = 0;
            let ef_pph = 0;
            // Include VAT
            // PPh EF = 2 %
            // if (value == 1 || premium["ENGINEERING_FEE_VAT"] == 1) {
            if (value == 1) {
                ef_after_ppn = parseFloat(premium["ENGINEERING_FEE"]) / 1.022;
                ef_ppn = premium["ENGINEERING_FEE"] - ef_after_ppn;
                ef_pph = ((premium["ENGINEERING_FEE"] - ef_ppn) * 2) / 100;
            } else {
                ef_pph = (premium["ENGINEERING_FEE"] * 2) / 100;
            }
            premium["ENGINEERING_FEE_PPN"] = -ef_ppn;
            premium["ENGINEERING_FEE_PPH"] = -ef_pph;
            premium["ENGINEERING_FEE_NETT_AMOUNT"] =
                premium["ENGINEERING_FEE"] - ef_ppn - ef_pph;
        }
        if (name == "CONSULTANCY_FEE_VAT") {
            let cf_after_ppn = 0;
            let cf_ppn = 0;
            let cf_pph = 0;
            // Include VAT
            // PPn CF = 11%
            // PPh CF = 2 %
            // if (value == 1 || premium["CONSULTANCY_FEE_VAT"] == 1) {
            if (value == 1) {
                // cf_after_ppn = parseFloat(premium["CONSULTANCY_FEE"]) / 1.022;
                cf_ppn = (parseFloat(premium["CONSULTANCY_FEE"]) * 11) / 100;
                cf_after_ppn = premium["CONSULTANCY_FEE"] - cf_ppn;
                cf_pph =
                    ((premium["CONSULTANCY_FEE"] - cf_after_ppn) * 2) / 100;
            } else {
                cf_pph = (premium["CONSULTANCY_FEE"] * 2) / 100;
            }
            premium["CONSULTANCY_FEE_PPN"] = -cf_ppn;
            premium["CONSULTANCY_FEE_PPH"] = -cf_pph;
            premium["CONSULTANCY_FEE_NETT_AMOUNT"] =
                premium["CONSULTANCY_FEE"] - cf_ppn - cf_pph;
        }
        // END VAT

        // Isi Nett Premi ambil dari BF, CF dan EF yg Nett Nya
        premium["NETT_PREMI"] =
            coverage_premium -
            premium["BROKERAGE_FEE_NETT_AMOUNT"] -
            // premium["ENGINEERING_FEE_NETT_AMOUNT"] -
            premium["CONSULTANCY_FEE_NETT_AMOUNT"];

        premium[name] = value;
        premiums[coverageNum] = premium;
        item.premium = premiums;
        items[insurerNum] = item;
        setDataEditInsurer(items);
    };
    // End Edit Insurer


   
    // Add Insured
    const [dataInsured, setDataInsured] = useState<any>([]);
    const [dataInsuredView, setdataInsuredView] = useState<any>([]);

    const fieldDataInsured: any = {
        POLICY_ID: "",
        POLICY_INSURED_NAME: "",
        ADMIN_COST: 0,
        DISC_ADMIN_COST_PERCENTAGE: 0,
        DISC_ADMIN_COST_AMOUNT: 0,
        ADMIN_COST_NETT_AMOUNT: 0,
        policy_insured_detail: [
            // {
            //     INTEREST_INSURED_ID: "",
            //     REMARKS: "",
            //     POLICY_COVERAGE_ID: "",
            //     CURRENCY_ID: "",
            //     PREMIUM_AMOUNT: 0,
            //     BF_FULL_AMOUNT: 0,
            //     DISC_BF_PERCENTAGE: 0,
            //     DISC_BF_AMOUNT: 0,
            //     BF_NETT_AMOUNT: 0,
            //     EF_FULL_AMOUNT: 0,
            //     DISC_EF_PERCENTAGE: 0,
            //     DISC_EF_AMOUNT: 0,
            //     EF_NETT_AMOUNT: 0,
            //     CONSULTANCY_FEE: 0,
            //     DISC_CF_PERCENTAGE: 0,
            //     DISC_CF_AMOUNT: 0,
            //     CF_NETT_AMOUNT: 0,
            //     INCOME_NETT_AMOUNT: 0,
            //     PREMIUM_TO_INSURED: 0,
            // },
        ],
    };

    const getInsurerNettPremi = (policy_id: any) => {
        return axios
            .post(`/getInsurerNettPremi?`, {
                policy_id: policy_id,
            })
            .then((res) => {
                const data = res.data;
                let policy_insured_detail: any = [];
                data.map((val: any, i: number) => {
                    policy_insured_detail.push({
                        INTEREST_INSURED_ID: val["INTEREST_INSURED_ID"],
                        REMARKS: val["REMARKS"],
                        POLICY_COVERAGE_ID: val["POLICY_COVERAGE_ID"],
                        CURRENCY_ID: val["CURRENCY_ID"],
                        PREMIUM_AMOUNT: val["INSURER_NETT_PREMIUM"],
                        BF_FULL_AMOUNT: val["BROKERAGE_FEE"],
                        DISC_BF_PERCENTAGE: 0,
                        DISC_BF_AMOUNT: 0,
                        BF_NETT_AMOUNT: val["BROKERAGE_FEE"],
                        EF_FULL_AMOUNT: val["ENGINEERING_FEE"],
                        DISC_EF_PERCENTAGE: 0,
                        DISC_EF_AMOUNT: 0,
                        EF_NETT_AMOUNT: val["ENGINEERING_FEE"],
                        CONSULTANCY_FEE: val["CONSULTANCY_FEE"],
                        DISC_CF_PERCENTAGE: 0,
                        DISC_CF_AMOUNT: 0,
                        CF_NETT_AMOUNT: val["CONSULTANCY_FEE"],
                        INCOME_NETT_AMOUNT:
                            parseFloat(val["BROKERAGE_FEE"]) +
                            parseFloat(val["ENGINEERING_FEE"]) +
                            parseFloat(val["CONSULTANCY_FEE"]),
                        PREMIUM_TO_INSURED:
                            parseFloat(val["INSURER_NETT_PREMIUM"]) +
                            parseFloat(val["BROKERAGE_FEE"]) +
                            parseFloat(val["ENGINEERING_FEE"]) +
                            parseFloat(val["CONSULTANCY_FEE"]),
                    });
                });
                fieldDataInsured["policy_insured_detail"] =
                    policy_insured_detail;
                setDataInsured([
                    { ...fieldDataInsured, POLICY_ID: policy.POLICY_ID },
                ]);

                // setDataInsurerForInsured(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAddInsured = async (policy_id: any) => {
        // setDataInsured([{ ...fieldDataInsured, POLICY_ID: policy_id }]);
        // setDataInsurerForInsured([]);
        getInsurerNettPremi(policy.POLICY_ID);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: !modal.addInsured,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };

    const addRowInsured = (e: FormEvent) => {
        e.preventDefault();
        setDataInsured([
            ...dataInsured,
            { ...fieldDataInsured, POLICY_ID: policy.POLICY_ID },
        ]);
    };

    const deleteRowInsured = (i: number) => {
        const items = [...dataInsured];
        items.splice(i, 1);
        setDataInsured(items);
    };

    const addRowInsuredDetail = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataInsured];
        let item = {
            ...items[i],
            policy_insured_detail: [
                ...items[i].policy_insured_detail,
                {
                    POLICY_COVERAGE_ID: "",
                    CURRENCY_ID: "",
                    CONSULTANCY_FEE: 0,
                    PREMIUM_AMOUNT: 0,
                    DISC_BF_PERCENTAGE: 0,
                    DISC_BF_AMOUNT: 0,
                    DISC_ADMIN_PERCENTAGE: 0,
                    DISC_ADMIN_AMOUNT: 0,
                    DISC_EF_PERCENTAGE: 0,
                    DISC_EF_AMOUNT: 0,
                    PREMIUM_TO_INSURED: 0,
                },
            ],
        };
        items[i] = item;

        setDataInsured(items);
    };

    const deleteRowInsuredDetail = (insuredNum: number, detailNum: number) => {
        const items = [...dataInsured];
        const item = { ...items[insuredNum] };
        item.policy_insured_detail.splice(detailNum, 1);
        items[insuredNum] = item;
        setDataInsured(items);
    };

    const inputInsuredDetail = (
        name: string,
        value: any,
        insuredNum: number,
        detailNum: number
    ) => {
        const items = [...dataInsured];
        const item = { ...items[insuredNum] };
        const policy_insured_details = [...item.policy_insured_detail];
        const policy_insured_detail = {
            ...policy_insured_details[detailNum],
        };

        const insurer_nett_premi = policy_insured_detail["PREMIUM_AMOUNT"];
        const bf_full_amount = policy_insured_detail["BF_FULL_AMOUNT"];
        const ef_full_amount = policy_insured_detail["EF_FULL_AMOUNT"];
        const cf_full_amount = policy_insured_detail["CONSULTANCY_FEE"];
        if (name == "DISC_BF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["DISC_BF_AMOUNT"] =
                (bf_full_amount * policy_insured_detail["DISC_BF_PERCENTAGE"]) /
                100;
            policy_insured_detail["BF_NETT_AMOUNT"] =
                bf_full_amount - policy_insured_detail["DISC_BF_AMOUNT"];
        }
        if (name == "DISC_BF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["BF_NETT_AMOUNT"] = bf_full_amount - value;
        }

        if (name == "DISC_EF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["DISC_EF_AMOUNT"] =
                (ef_full_amount * policy_insured_detail["DISC_EF_PERCENTAGE"]) /
                100;
            policy_insured_detail["EF_NETT_AMOUNT"] =
                ef_full_amount - policy_insured_detail["DISC_EF_AMOUNT"];
        }
        if (name == "DISC_EF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["EF_NETT_AMOUNT"] = ef_full_amount - value;
        }

        if (name == "DISC_CF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["DISC_CF_AMOUNT"] =
                (cf_full_amount * policy_insured_detail["DISC_CF_PERCENTAGE"]) /
                100;
            policy_insured_detail["CF_NETT_AMOUNT"] =
                cf_full_amount - policy_insured_detail["DISC_CF_AMOUNT"];
        }
        if (name == "DISC_CF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            policy_insured_detail["CF_NETT_AMOUNT"] = cf_full_amount - value;
        }

        policy_insured_detail["INCOME_NETT_AMOUNT"] =
            parseFloat(policy_insured_detail["BF_NETT_AMOUNT"]) +
            parseFloat(policy_insured_detail["EF_NETT_AMOUNT"]) +
            parseFloat(policy_insured_detail["CF_NETT_AMOUNT"]);

        policy_insured_detail["PREMIUM_TO_INSURED"] =
            parseFloat(insurer_nett_premi) +
            parseFloat(policy_insured_detail["BF_NETT_AMOUNT"]) +
            parseFloat(policy_insured_detail["EF_NETT_AMOUNT"]) +
            parseFloat(policy_insured_detail["CF_NETT_AMOUNT"]);

        policy_insured_detail[name] = value;
        policy_insured_details[detailNum] = policy_insured_detail;
        item.policy_insured_detail = policy_insured_details;
        items[insuredNum] = item;
        setDataInsured(items);
    };

    const inputDataInsured = (name: string, value: any, i: number) => {
        const items = [...dataInsured];
        const item = { ...items[i] };

        let disc_admin_cost_amount = 0;
        let admin_cost_nett_amount = 0;
        if (name == "DISC_ADMIN_COST_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            disc_admin_cost_amount = item["ADMIN_COST"] * (value / 100);
            admin_cost_nett_amount =
                item["ADMIN_COST"] - disc_admin_cost_amount;
        }
        if (name == "DISC_ADMIN_COST_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            admin_cost_nett_amount = item["ADMIN_COST"] - value;
        }

        if (name == "ADMIN_COST") {
            if (value == undefined) {
                value = 0;
            }
            admin_cost_nett_amount = value;
        }

        item["DISC_ADMIN_COST_AMOUNT"] = disc_admin_cost_amount;
        item["ADMIN_COST_NETT_AMOUNT"] = admin_cost_nett_amount;
        item[name] = value;
        items[i] = item;
        setDataInsured(items);
    };
    // End Add Insured

    // Edit Insured
    const [dataEditInsured, setDataEditInsured] = useState<any>([]);
    const handleEditInsured = async (id: string) => {
        await axios
            .get(`/getInsuredById/${id}`)
            .then((res) => setDataEditInsured(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: !modal.editInsured,
            addPartners: false,
            editPartners: false,
        });
    };

    const editDataInsured = (name: string, value: any) => {
        const item = { ...dataEditInsured };


        let disc_admin_cost_amount = 0;
        let admin_cost_nett_amount = 0;
        if (name == "DISC_ADMIN_COST_PERCENTAGE") {
            disc_admin_cost_amount = item["ADMIN_COST"] * (value / 100);
            admin_cost_nett_amount =
                item["ADMIN_COST"] - disc_admin_cost_amount;
        }
        if (name == "DISC_ADMIN_COST_AMOUNT") {
            admin_cost_nett_amount = item["ADMIN_COST"] - value;
        }

        if (name == "ADMIN_COST") {
            admin_cost_nett_amount = value;
        }

        item["DISC_ADMIN_COST_AMOUNT"] = disc_admin_cost_amount;
        item["ADMIN_COST_NETT_AMOUNT"] = admin_cost_nett_amount;
        item[name] = value;

        setDataEditInsured(item);
    };

    const editInsuredDetail = (name: string, value: any, i: number) => {
        const changeVal: any = [...dataEditInsured.policy_insured_detail];

        const insurer_nett_premi = changeVal[i]["PREMIUM_AMOUNT"];
        const bf_full_amount = changeVal[i]["BF_FULL_AMOUNT"];
        const ef_full_amount = changeVal[i]["EF_FULL_AMOUNT"];
        const cf_full_amount = changeVal[i]["CONSULTANCY_FEE"];
        if (name == "DISC_BF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["DISC_BF_AMOUNT"] =
                (bf_full_amount * changeVal[i]["DISC_BF_PERCENTAGE"]) / 100;
            changeVal[i]["BF_NETT_AMOUNT"] =
                bf_full_amount - changeVal[i]["DISC_BF_AMOUNT"];
        }
        if (name == "DISC_BF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["BF_NETT_AMOUNT"] = bf_full_amount - value;
        }

        if (name == "DISC_EF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["DISC_EF_AMOUNT"] =
                (ef_full_amount * changeVal[i]["DISC_EF_PERCENTAGE"]) / 100;
            changeVal[i]["EF_NETT_AMOUNT"] =
                ef_full_amount - changeVal[i]["DISC_EF_AMOUNT"];
        }
        if (name == "DISC_EF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["EF_NETT_AMOUNT"] = ef_full_amount - value;
        }

        if (name == "DISC_CF_PERCENTAGE") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["DISC_CF_AMOUNT"] =
                (cf_full_amount * changeVal[i]["DISC_CF_PERCENTAGE"]) / 100;
            changeVal[i]["CF_NETT_AMOUNT"] =
                cf_full_amount - changeVal[i]["DISC_CF_AMOUNT"];
        }
        if (name == "DISC_CF_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["CF_NETT_AMOUNT"] = cf_full_amount - value;
        }
        if (name == "CF_NETT_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            changeVal[i]["CF_NETT_AMOUNT"] = cf_full_amount - value;
        }

        changeVal[i]["INCOME_NETT_AMOUNT"] =
            parseFloat(changeVal[i]["BF_NETT_AMOUNT"]) +
            parseFloat(changeVal[i]["EF_NETT_AMOUNT"]) +
            parseFloat(changeVal[i]["CF_NETT_AMOUNT"]);
        // alert(changeVal[i]["CF_NETT_AMOUNT"]);
        changeVal[i]["PREMIUM_TO_INSURED"] =
            parseFloat(insurer_nett_premi) +
            parseFloat(changeVal[i]["BF_NETT_AMOUNT"]) +
            parseFloat(changeVal[i]["EF_NETT_AMOUNT"]) +
            parseFloat(changeVal[i]["CF_NETT_AMOUNT"]);

        changeVal[i][name] = value;
        setDataEditInsured({
            ...dataEditInsured,
            policy_insured_detail: changeVal,
        });
    };

    const addRowEditInsuredDetail = (e: FormEvent, insured_id: string) => {
        e.preventDefault();
        setDataEditInsured({
            ...dataEditInsured,
            policy_insured_detail: [
                ...dataEditInsured.policy_insured_detail,
                {
                    POLICY_INSURED_DETAIL_ID: null,
                    POLICY_INSURED_ID: insured_id,
                    POLICY_COVERAGE_ID: "",
                    CURRENCY_ID: "",
                    CONSULTANCY_FEE: 0,
                    PREMIUM_AMOUNT: 0,
                    DISC_BF_PERCENTAGE: 0,
                    DISC_BF_AMOUNT: 0,
                    DISC_ADMIN_PERCENTAGE: 0,
                    DISC_ADMIN_AMOUNT: 0,
                    DISC_EF_PERCENTAGE: 0,
                    DISC_EF_AMOUNT: 0,
                    PREMIUM_TO_INSURED: 0,
                },
            ],
        });
    };
    const deleteRowEditInsuredDetail = (i: number) => {
        const val = [...dataEditInsured.policy_insured_detail];
        val.splice(i, 1);
        if (
            dataEditInsured.policy_insured_detail[i]
                .POLICY_INSURED_DETAIL_ID !== null
        ) {
            if (dataEditInsured.deletedInsuredDetail) {
                setDataEditInsured({
                    ...dataEditInsured,
                    policy_insured_detail: val,
                    deletedInsuredDetail: [
                        ...dataEditInsured.deletedInsuredDetail,
                        {
                            POLICY_INSURED_DETAIL_ID:
                                dataEditInsured.policy_insured_detail[i]
                                    .POLICY_INSURED_DETAIL_ID,
                        },
                    ],
                });
            } else {
                setDataEditInsured({
                    ...dataEditInsured,
                    policy_insured_detail: val,
                    deletedInsuredDetail: [
                        {
                            POLICY_INSURED_DETAIL_ID:
                                dataEditInsured.policy_insured_detail[i]
                                    .POLICY_INSURED_DETAIL_ID,
                        },
                    ],
                });
            }
        } else {
            setDataEditInsured({
                ...dataEditInsured,
                policy_insured_detail: val,
            });
        }
    };
    // End Edit Insured

    // Add Partners

    const fieldDataPartners: any = {
        POLICY_ID: "",
        INCOME_TYPE: "",
        NAME: "",
        BROKERAGE_FEE_PERCENTAGE: 0,
        BROKERAGE_FEE_AMOUNT: 0,
        ENGINEERING_FEE_PERCENTAGE: 0,
        ENGINEERING_FEE_AMOUNT: 0,
        ADMIN_COST: 0,
        CONSULTANCY_FEE_PERCENTAGE: 0,
        CONSULTANCY_FEE_AMOUNT: 0,
    };

    const arrDataIncome = [
        {
            INCOME_CATEGORY_ID: 1,
            INCOME_NAME: "FBI by PKS",
            income_detail: [
                {
                    INCOME_TYPE: 1,
                    POLICY_ID: policy.POLICY_ID,
                    NAME: "",
                    BROKERAGE_FEE_PERCENTAGE: 0,
                    BROKERAGE_FEE_AMOUNT: 0,
                    ENGINEERING_FEE_PERCENTAGE: 0,
                    ENGINEERING_FEE_AMOUNT: 0,
                    ADMIN_COST: 0,
                    CONSULTANCY_FEE_PERCENTAGE: 0,
                    CONSULTANCY_FEE_AMOUNT: 0,
                },
            ],
        },
        {
            INCOME_CATEGORY_ID: 2,
            INCOME_NAME: "Agent Commission",
            income_detail: [
                {
                    INCOME_TYPE: 2,
                    POLICY_ID: policy.POLICY_ID,
                    NAME: "",
                    BROKERAGE_FEE_PERCENTAGE: 0,
                    BROKERAGE_FEE_AMOUNT: 0,
                    ENGINEERING_FEE_PERCENTAGE: 0,
                    ENGINEERING_FEE_AMOUNT: 0,
                    ADMIN_COST: 0,
                    CONSULTANCY_FEE_PERCENTAGE: 0,
                    CONSULTANCY_FEE_AMOUNT: 0,
                },
            ],
        },
        {
            INCOME_CATEGORY_ID: 3,
            INCOME_NAME: "Business Acquisition Assistance",
            income_detail: [
                {
                    INCOME_TYPE: 3,
                    POLICY_ID: policy.POLICY_ID,
                    NAME: "",
                    BROKERAGE_FEE_PERCENTAGE: 0,
                    BROKERAGE_FEE_AMOUNT: 0,
                    ENGINEERING_FEE_PERCENTAGE: 0,
                    ENGINEERING_FEE_AMOUNT: 0,
                    ADMIN_COST: 0,
                    CONSULTANCY_FEE_PERCENTAGE: 0,
                    CONSULTANCY_FEE_AMOUNT: 0,
                },
            ],
        },
    ];
    const arrDataPartners: any = {
        fbi_by_pks: [
            {
                INCOME_TYPE: 1,
                POLICY_ID: policy.POLICY_ID,
                NAME: "",
                BROKERAGE_FEE_PERCENTAGE: 0,
                BROKERAGE_FEE_AMOUNT: 0,
                ENGINEERING_FEE_PERCENTAGE: 0,
                ENGINEERING_FEE_AMOUNT: 0,
                ADMIN_COST: 0,
                CONSULTANCY_FEE_PERCENTAGE: 0,
                CONSULTANCY_FEE_AMOUNT: 0,
            },
        ],
        agent_commission: [
            {
                INCOME_TYPE: 2,
                POLICY_ID: policy.POLICY_ID,
                NAME: "",
                BROKERAGE_FEE_PERCENTAGE: 0,
                BROKERAGE_FEE_AMOUNT: 0,
                ENGINEERING_FEE_PERCENTAGE: 0,
                ENGINEERING_FEE_AMOUNT: 0,
                ADMIN_COST: 0,
                CONSULTANCY_FEE_PERCENTAGE: 0,
                CONSULTANCY_FEE_AMOUNT: 0,
            },
        ],
        acquisition_cost: [
            {
                INCOME_TYPE: 3,
                POLICY_ID: policy.POLICY_ID,
                NAME: "",
                BROKERAGE_FEE_PERCENTAGE: 0,
                BROKERAGE_FEE_AMOUNT: 0,
                ENGINEERING_FEE_PERCENTAGE: 0,
                ENGINEERING_FEE_AMOUNT: 0,
                ADMIN_COST: 0,
                CONSULTANCY_FEE_PERCENTAGE: 0,
                CONSULTANCY_FEE_AMOUNT: 0,
            },
        ],
    };
    
    const [dataEditNettIncome, setDataEditNettIncome] = useState<any>([]);
    const [grandTotalEditNettIncome, setGrandTotalEditNettIncome] =
        useState<number>(0);
    
    const [listDataPartners, setListDataPartners] = useState<any>([]);

   
    // End Add Partners

    const fieldPartner = [
        {
            INCOME_CATEGORY_ID: 1,
            INCOME_NAME: "FBI by PKS",
            income_detail: [],
        },
        {
            INCOME_CATEGORY_ID: 2,
            INCOME_NAME: "Agent Commission",
            income_detail: [],
        },
        {
            INCOME_CATEGORY_ID: 3,
            INCOME_NAME: "Business Acquisition Assistance",
            income_detail: [],
        },
    ];
    const getDataPartner = async (policy_id: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/getDataPartner/${policy_id}`)
            .then((res) => {
                const data = res.data;
                const items = fieldPartner;
                data.map((val: any, i: number) => {
                    if (val["INCOME_TYPE"] == 1) {
                        const item: any = {
                            ...items[0],
                            income_detail: [
                                ...items[0].income_detail,
                                {
                                    INCOME_TYPE: val["INCOME_TYPE"],
                                    POLICY_ID: val["POLICY_ID"],
                                    PARTNER_NAME: val["PARTNER_NAME"],
                                    RELATION_ID: val["RELATION_ID"],
                                    PERSON_ID: "",
                                    BROKERAGE_FEE_PERCENTAGE:
                                        val["BROKERAGE_FEE_PERCENTAGE"],
                                    BROKERAGE_FEE_AMOUNT:
                                        val["BROKERAGE_FEE_AMOUNT"],
                                    ENGINEERING_FEE_PERCENTAGE:
                                        val["ENGINEERING_FEE_PERCENTAGE"],
                                    ENGINEERING_FEE_AMOUNT:
                                        val["ENGINEERING_FEE_AMOUNT"],
                                    ADMIN_COST: val["ADMIN_COST"],
                                    CONSULTANCY_FEE_PERCENTAGE:
                                        val["CONSULTANCY_FEE_PERCENTAGE"],
                                    CONSULTANCY_FEE_AMOUNT:
                                        val["CONSULTANCY_FEE_AMOUNT"],
                                    M_PKS_RELATION_ID: val["M_PKS_RELATION_ID"],
                                    BROKERAGE_FEE_VAT: val["BROKERAGE_FEE_VAT"],
                                    BROKERAGE_FEE_PPN: val["BROKERAGE_FEE_PPN"],
                                    BROKERAGE_FEE_PPH: val["BROKERAGE_FEE_PPH"],
                                    BROKERAGE_FEE_NETT_AMOUNT: val["BROKERAGE_FEE_NETT_AMOUNT"],
                                    ENGINEERING_FEE_VAT: val["ENGINEERING_FEE_VAT"],
                                    ENGINEERING_FEE_PPN: val["ENGINEERING_FEE_PPN"],
                                    ENGINEERING_FEE_PPH: val["ENGINEERING_FEE_PPH"],
                                    ENGINEERING_FEE_NETT_AMOUNT: val["ENGINEERING_FEE_NETT_AMOUNT"],
                                    CONSULTANCY_FEE_VAT: val["CONSULTANCY_FEE_VAT"],
                                    CONSULTANCY_FEE_PPN: val["CONSULTANCY_FEE_PPN"],
                                    CONSULTANCY_FEE_PPH: val["CONSULTANCY_FEE_PPH"],
                                    CONSULTANCY_FEE_NETT_AMOUNT: val["CONSULTANCY_FEE_NETT_AMOUNT"],
                                    PAYABLE: val["PAYABLE"],
                                },
                            ],
                        };
                        items[0] = item;
                    } else if (val["INCOME_TYPE"] == 2) {
                        const item: any = {
                            ...items[1],
                            income_detail: [
                                ...items[1].income_detail,
                                {
                                    INCOME_TYPE: val["INCOME_TYPE"],
                                    POLICY_ID: val["POLICY_ID"],
                                    PARTNER_NAME: val["PARTNER_NAME"],
                                    RELATION_ID: val["RELATION_ID"],
                                    PERSON_ID: "",
                                    BROKERAGE_FEE_PERCENTAGE:
                                        val["BROKERAGE_FEE_PERCENTAGE"],
                                    BROKERAGE_FEE_AMOUNT:
                                        val["BROKERAGE_FEE_AMOUNT"],
                                    ENGINEERING_FEE_PERCENTAGE:
                                        val["ENGINEERING_FEE_PERCENTAGE"],
                                    ENGINEERING_FEE_AMOUNT:
                                        val["ENGINEERING_FEE_AMOUNT"],
                                    ADMIN_COST: val["ADMIN_COST"],
                                    CONSULTANCY_FEE_PERCENTAGE:
                                        val["CONSULTANCY_FEE_PERCENTAGE"],
                                    CONSULTANCY_FEE_AMOUNT:
                                        val["CONSULTANCY_FEE_AMOUNT"],
                                    M_PKS_RELATION_ID: val["M_PKS_RELATION_ID"],
                                    BROKERAGE_FEE_VAT: val["BROKERAGE_FEE_VAT"],
                                    BROKERAGE_FEE_PPN: val["BROKERAGE_FEE_PPN"],
                                    BROKERAGE_FEE_PPH: val["BROKERAGE_FEE_PPH"],
                                    BROKERAGE_FEE_NETT_AMOUNT: val["BROKERAGE_FEE_NETT_AMOUNT"],
                                    ENGINEERING_FEE_VAT: val["ENGINEERING_FEE_VAT"],
                                    ENGINEERING_FEE_PPN: val["ENGINEERING_FEE_PPN"],
                                    ENGINEERING_FEE_PPH: val["ENGINEERING_FEE_PPH"],
                                    ENGINEERING_FEE_NETT_AMOUNT: val["ENGINEERING_FEE_NETT_AMOUNT"],
                                    CONSULTANCY_FEE_VAT: val["CONSULTANCY_FEE_VAT"],
                                    CONSULTANCY_FEE_PPN: val["CONSULTANCY_FEE_PPN"],
                                    CONSULTANCY_FEE_PPH: val["CONSULTANCY_FEE_PPH"],
                                    CONSULTANCY_FEE_NETT_AMOUNT: val["CONSULTANCY_FEE_NETT_AMOUNT"],
                                    PAYABLE: val["PAYABLE"],
                                },
                            ],
                        };
                        items[1] = item;
                    } else if (val["INCOME_TYPE"] == 3) {
                        const item: any = {
                            ...items[2],
                            income_detail: [
                                ...items[2].income_detail,
                                {
                                    INCOME_TYPE: val["INCOME_TYPE"],
                                    POLICY_ID: val["POLICY_ID"],
                                    PARTNER_NAME: val["PARTNER_NAME"],
                                    RELATION_ID: val["RELATION_ID"],
                                    PERSON_ID: val["PERSON_ID"],
                                    BROKERAGE_FEE_PERCENTAGE:
                                        val["BROKERAGE_FEE_PERCENTAGE"],
                                    BROKERAGE_FEE_AMOUNT:
                                        val["BROKERAGE_FEE_AMOUNT"],
                                    ENGINEERING_FEE_PERCENTAGE:
                                        val["ENGINEERING_FEE_PERCENTAGE"],
                                    ENGINEERING_FEE_AMOUNT:
                                        val["ENGINEERING_FEE_AMOUNT"],
                                    ADMIN_COST: val["ADMIN_COST"],
                                    CONSULTANCY_FEE_PERCENTAGE:
                                        val["CONSULTANCY_FEE_PERCENTAGE"],
                                    CONSULTANCY_FEE_AMOUNT:
                                        val["CONSULTANCY_FEE_AMOUNT"],
                                    M_PKS_RELATION_ID: val["M_PKS_RELATION_ID"],
                                    BROKERAGE_FEE_VAT: val["BROKERAGE_FEE_VAT"],
                                    BROKERAGE_FEE_PPN: val["BROKERAGE_FEE_PPN"],
                                    BROKERAGE_FEE_PPH: val["BROKERAGE_FEE_PPH"],
                                    BROKERAGE_FEE_NETT_AMOUNT: val["BROKERAGE_FEE_NETT_AMOUNT"],
                                    ENGINEERING_FEE_VAT: val["ENGINEERING_FEE_VAT"],
                                    ENGINEERING_FEE_PPN: val["ENGINEERING_FEE_PPN"],
                                    ENGINEERING_FEE_PPH: val["ENGINEERING_FEE_PPH"],
                                    ENGINEERING_FEE_NETT_AMOUNT: val["ENGINEERING_FEE_NETT_AMOUNT"],
                                    CONSULTANCY_FEE_VAT: val["CONSULTANCY_FEE_VAT"],
                                    CONSULTANCY_FEE_PPN: val["CONSULTANCY_FEE_PPN"],
                                    CONSULTANCY_FEE_PPH: val["CONSULTANCY_FEE_PPH"],
                                    CONSULTANCY_FEE_NETT_AMOUNT: val["CONSULTANCY_FEE_NETT_AMOUNT"],
                                    PAYABLE: val["PAYABLE"],
                                },
                            ],
                        };
                        items[2] = item;
                    }
                });

                setListDataPartners(items);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => console.log(err));
    };


    const [dataSummaryInsured, setDataSummaryInsured] = useState<any>([]);
    const [tmpDataSummaryInsured, setTmpDataSummaryInsured] = useState<any>([]);
    const [policyExchangeRate, setPolicyExchangeRate] = useState<any>([]);
    const [tmpPolicyExchangeRate, setTmpPolicyExchangeRate] = useState<any>([]);

    const getSummaryInsured = async (policy_id: any) => {
        await axios
            .post(`/getSummaryInsured?`, {
                policy_id: policy_id,
            })
            .then((res) => {
                setTmpDataSummaryInsured(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (tmpDataSummaryInsured.length > 0) {
            setDataSummaryInsured(tmpDataSummaryInsured);
        }
    }, [tmpDataSummaryInsured]);

    useEffect(() => {
        if (dataSummaryInsured.length > 0) {
            getExchangeRate();
        }
    }, [dataSummaryInsured]);

    const getPolicyExchangeRate = async (id: number) => {
        await axios
            .get(`/getPolicyExchangeRate/${id}`)
            .then((res) => setPolicyExchangeRate(res.data))
            .catch((err) => console.log(err));
    };


    const getExchangeRateByCurrId = (currId: any) => {
        const dataCurr = policyExchangeRate;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result : null;
    };

    const [summaryFinancial, setSummaryFinancial] = useState<any>([]);

        
   
    const getPksNumber = async (relation_id: any) => {
        await axios
            .get(`/getPksNumber/${relation_id}`)
            .then((res) => {
                setListPksNumber(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getSummaryFinancial = async (policy_id: number) => {
        // setIsLoading({
        //     ...isLoading,
        //     get_detail: true,
        // });
        await axios
            .get(`/getSummary/${policy_id}`)
            .then((res) => {
                setSummaryFinancial(res.data);
            })
            .catch((err) => console.log(err));
    };

   
    const [listCoa, setListCoa] = useState<any>([]);
    const getCoa = async () => {
        await axios
            .get(`/getCoa`)
            .then((res) => {
                setListCoa(res.data);
            })
            .catch((err) => console.log(err));
    };

    const [listAgent, setListAgent] = useState<any>([]);
    const [listBAA, setListBAA] = useState<any>([]);
    const [listFbiPks, setListFbiPks] = useState<any>([]);
    const [listBroker, setListBroker] = useState<any>([]);

    const getBroker = async (relation_type: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/getRelationByType/${relation_type}`)
            .then((res) => {
                setListBroker(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getAgent = async (relation_type: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/getRelationByType/${relation_type}`)
            .then((res) => {
                setListAgent(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getBAA = async (relation_type: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/getRelationByType/${relation_type}`)
            .then((res) => {
                setListBAA(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getFbiPks = async (relation_type: number) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .get(`/getRelationByType/${relation_type}`)
            .then((res) => {
                setListFbiPks(res.data);
            })
            .catch((err) => console.log(err));
    };

    const [exchangeRate, setExchangeRate] = useState<any>([]);

    // const getExchangeRate = async () => {
    const getExchangeRate = () => {
        if (dataSummaryInsured.length > 0) {
            let exRate: any = [];
            for (let j = 0; j < dataSummaryInsured.length; j++) {
                const rate = getExchangeRateByCurrId(
                    dataSummaryInsured[j]["CURRENCY_ID"]
                );
                exRate.push({
                    POLICY_EXCHANGE_RATE_ID: rate
                        ? rate["POLICY_EXCHANGE_RATE_ID"]
                        : "",
                    CURRENCY_ID: dataSummaryInsured[j]["CURRENCY_ID"],
                    POLICY_ID: dataSummaryInsured[j]["POLICY_ID"],
                    POLICY_EXCHANGE_RATE_DATE: "",
                    POLICY_EXCHANGE_RATE_AMOUNT: rate
                        ? rate["POLICY_EXCHANGE_RATE_AMOUNT"]
                        : 1,
                    BF_NETT_AMOUNT: dataSummaryInsured[j]["BF_NETT_AMOUNT"],
                    EF_NETT_AMOUNT: dataSummaryInsured[j]["EF_NETT_AMOUNT"],
                    CF_NETT_AMOUNT: dataSummaryInsured[j]["CF_NETT_AMOUNT"],
                });
            }
            setExchangeRate(exRate);
        }
    };

    const [dataInitialForBP, setDataInitialForBP] = useState<any>({
        BF_NETT_AMOUNT: 0,
        CF_NETT_AMOUNT: 0,
        EF_NETT_AMOUNT: 0,
    });
    const inputExRate = (name: string, value: any, i: number) => {
        const items = [...exchangeRate];
        const item = { ...items[i] };
        item[name] = value;
        items[i] = item;
        setExchangeRate(items);

    };
    useEffect(() => {
        if (exchangeRate) {
            setDataInitialForBP({
                BF_NETT_AMOUNT: exchangeRate.reduce(function (
                    acc: any,
                    obj: any
                ) {
                    return (
                        acc +
                        parseFloat(obj.BF_NETT_AMOUNT) *
                            parseFloat(obj.POLICY_EXCHANGE_RATE_AMOUNT)
                    );
                },
                0),
                CF_NETT_AMOUNT: exchangeRate.reduce(function (
                    acc: any,
                    obj: any
                ) {
                    return (
                        acc +
                        parseFloat(obj.CF_NETT_AMOUNT) *
                            parseFloat(obj.POLICY_EXCHANGE_RATE_AMOUNT)
                    );
                },
                0),
                EF_NETT_AMOUNT: exchangeRate.reduce(function (
                    acc: any,
                    obj: any
                ) {
                    return (
                        acc +
                        parseFloat(obj.EF_NETT_AMOUNT) *
                            parseFloat(obj.POLICY_EXCHANGE_RATE_AMOUNT)
                    );
                },
                0),
            });
        }
    }, [exchangeRate]);


    // Edit Partners
    const handleEditPartners = async (policy_id: any) => {
        setRelationIdForPayable([]);
        // getFbiPks(13);
        getAgent(3);
        // getBAA(12);
        getSummaryInsured(policy_id);
        // getPolicyExchangeRate(policy_id);
        getDataPartner(policy_id);
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);
        setTimeout(function () {
            getExchangeRate();
        }, 1000);
        setTriggerEditSumIncome(triggerEditSumIncome + 1);
        // getExchangeRate();

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: !modal.editPartners,
        });
    };
    const addRowEditPartners = (
        e: FormEvent,
        income_type: number,
        i: number
    ) => {
        e.preventDefault();

        const items = [...listDataPartners];
        const item = {
            ...items[i],
            income_detail: [
                ...items[i].income_detail,
                {
                    INCOME_TYPE: income_type,
                    POLICY_ID: policy.POLICY_ID,
                    RELATION_ID: "",
                    PERSON_ID: "",
                    PARTNER_NAME: "",
                    BROKERAGE_FEE_PERCENTAGE: 0,
                    BROKERAGE_FEE_AMOUNT: 0,
                    ENGINEERING_FEE_PERCENTAGE: 0,
                    ENGINEERING_FEE_AMOUNT: 0,
                    ADMIN_COST: 0,
                    CONSULTANCY_FEE_PERCENTAGE: 0,
                    CONSULTANCY_FEE_AMOUNT: 0,

                    M_PKS_RELATION_ID: "",
                    BROKERAGE_FEE_VAT: "",
                    BROKERAGE_FEE_PPN: 0,
                    BROKERAGE_FEE_PPH: 0,
                    BROKERAGE_FEE_NETT_AMOUNT: 0,
                    ENGINEERING_FEE_VAT: "",
                    ENGINEERING_FEE_PPN: 0,
                    ENGINEERING_FEE_PPH: 0,
                    ENGINEERING_FEE_NETT_AMOUNT: 0,
                    CONSULTANCY_FEE_VAT: "",
                    CONSULTANCY_FEE_PPN: 0,
                    CONSULTANCY_FEE_PPH: 0,
                    CONSULTANCY_FEE_NETT_AMOUNT: 0,
                    PAYABLE: "",
                },
            ],
        };
        items[i] = item;
        setListDataPartners(items);
    };

    const getDefaultPayable = async (name: any, relation_id: any, incomeNum:any, detailNum:any) => {
        await axios
            .get(`/getDefaultPayable/${relation_id}`)
            .then((res) => {
                setRelationIdForPayable({
                    name: "RELATION_ID",
                    value: res.data,
                    incomeNum: incomeNum,
                    detailNum: detailNum,
                    // defaultPayable: defaultPayable
                });
                return res.data
            })
            .catch((err) => console.log(err));
    };

    const inputDataEditIncome = (
        name: string,
        value: any,
        incomeNum: number,
        detailNum: number
    ) => {
        const items = [...listDataPartners];
        const item = { ...items[incomeNum] };
        const detail = [...item.income_detail];
        const detailItem = { ...detail[detailNum] };

        const initBF = dataInitialForBP.BF_NETT_AMOUNT;
        const initCF = dataInitialForBP.CF_NETT_AMOUNT;
        const initEF = dataInitialForBP.EF_NETT_AMOUNT;
        
        let bf_ppn = 0;
        let bf_pph = 0;

        if (name == "BROKERAGE_FEE_PERCENTAGE") {
            
            detailItem["BROKERAGE_FEE_AMOUNT"] =
                (initBF * detailItem["BROKERAGE_FEE_PERCENTAGE"]) / 100;
            if (value == undefined) {
                value = 0;
            }
            let bf_after_ppn = 0;
            
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["BROKERAGE_FEE_VAT"] == 1) {                    
                    bf_ppn = -((detailItem["BROKERAGE_FEE_AMOUNT"] * 11) / 100);
                    detailItem["BROKERAGE_FEE_PPN"] = bf_ppn;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        detailItem["BROKERAGE_FEE_AMOUNT"] + bf_ppn;
                } else {
                    detailItem["BROKERAGE_FEE_PPN"] = 0;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        detailItem["BROKERAGE_FEE_AMOUNT"] + bf_ppn;
                }
                
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                
                if (detailItem["BROKERAGE_FEE_VAT"] == 1) {                    
                    // untuk perusahaan 2%
                    // bf_pph = -((detailItem["BROKERAGE_FEE_AMOUNT"] * 2) / 100);
                    // untuk perorangan 5%
                    bf_pph = -((detailItem["BROKERAGE_FEE_AMOUNT"] * 5) / 100);
                    detailItem["BROKERAGE_FEE_PPH"] = bf_pph;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        detailItem["BROKERAGE_FEE_AMOUNT"] + bf_pph;
                } else {
                    detailItem["BROKERAGE_FEE_PPH"] = 0;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        detailItem["BROKERAGE_FEE_AMOUNT"] + bf_pph;
                }
                
            }
        }

        if (name == "BROKERAGE_FEE_VAT") {
            if (value == 1) {
                if (detailItem["INCOME_TYPE"] == 1) {
                    bf_ppn = -((detailItem["BROKERAGE_FEE_AMOUNT"] * 11) / 100);
                }
                detailItem["BROKERAGE_FEE_PPN"] = bf_ppn;
                detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                    parseFloat(detailItem["BROKERAGE_FEE_AMOUNT"]) + parseFloat(detailItem["BROKERAGE_FEE_PPN"]);
            } else {
                detailItem["BROKERAGE_FEE_PPN"] = 0;
                detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                    detailItem["BROKERAGE_FEE_AMOUNT"] + bf_ppn;
            }
        }

        let ef_ppn = 0;
        let ef_pph = 0;
        if (name == "ENGINEERING_FEE_PERCENTAGE") {
            detailItem["ENGINEERING_FEE_AMOUNT"] =
                (initEF * detailItem["ENGINEERING_FEE_PERCENTAGE"]) / 100;
            if (value == undefined) {
                value = 0;
            }
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["ENGINEERING_FEE_VAT"] == 1) {
                    ef_ppn = -((detailItem["ENGINEERING_FEE_AMOUNT"] * 11) / 100);
                    detailItem["ENGINEERING_FEE_PPN"] = ef_ppn;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                        detailItem["ENGINEERING_FEE_AMOUNT"] + ef_ppn;
                } else {
                    detailItem["ENGINEERING_FEE_PPN"] = 0;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                        detailItem["ENGINEERING_FEE_AMOUNT"] + ef_ppn;
                }
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                if (detailItem["ENGINEERING_FEE_VAT"] == 1) {
                    // untuk perusahaan 2%
                    // ef_pph = -((detailItem["ENGINEERING_FEE_AMOUNT"] * 2) / 100);
                    // untuk perorangan 5%
                    ef_pph = -((detailItem["ENGINEERING_FEE_AMOUNT"] * 5) / 100);
                    detailItem["ENGINEERING_FEE_PPH"] = ef_pph;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                        detailItem["ENGINEERING_FEE_AMOUNT"] + ef_pph;
                } else {
                    detailItem["ENGINEERING_FEE_PPH"] = 0;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                        detailItem["ENGINEERING_FEE_AMOUNT"] + ef_pph;
                }
            }
        }

        if (name == "ENGINEERING_FEE_VAT") {
            if (value == 1) {
                if (detailItem["INCOME_TYPE"] == 1) {
                    ef_ppn = -(
                        (detailItem["ENGINEERING_FEE_AMOUNT"] * 11) /
                        100
                    );
                }
                detailItem["ENGINEERING_FEE_PPN"] = ef_ppn;
                detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                    parseFloat(detailItem["ENGINEERING_FEE_AMOUNT"]) +
                    parseFloat(detailItem["ENGINEERING_FEE_PPN"]);
            } else {
                detailItem["ENGINEERING_FEE_PPN"] = 0;
                detailItem["ENGINEERING_FEE_NETT_AMOUNT"] =
                    detailItem["ENGINEERING_FEE_AMOUNT"] + ef_ppn;
            }
        }

        let cf_ppn = 0;
        let cf_pph = 0;
        if (name == "CONSULTANCY_FEE_PERCENTAGE") {
            detailItem["CONSULTANCY_FEE_AMOUNT"] =
                (initCF * detailItem["CONSULTANCY_FEE_PERCENTAGE"]) / 100;
            if (value == undefined) {
                value = 0;
            }
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["CONSULTANCY_FEE_VAT"] == 1) {
                    cf_ppn = -(
                        (detailItem["CONSULTANCY_FEE_AMOUNT"] * 11) /
                        100
                    );
                    detailItem["CONSULTANCY_FEE_PPN"] = cf_ppn;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                        parseFloat(detailItem["CONSULTANCY_FEE_AMOUNT"]) + parseFloat(detailItem["CONSULTANCY_FEE_PPN"]);
                } else {
                    detailItem["CONSULTANCY_FEE_PPN"] = 0;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                        detailItem["CONSULTANCY_FEE_AMOUNT"] + cf_ppn;
                }
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                if (detailItem["CONSULTANCY_FEE_VAT"] == 1) {
                    // untuk perusahaan 2%
                    // cf_pph = -((detailItem["CONSULTANCY_FEE_AMOUNT"] * 2) / 100);
                    // untuk perorangan 5%
                    cf_pph = -(
                        (detailItem["CONSULTANCY_FEE_AMOUNT"] * 5) /
                        100
                    );
                    detailItem["CONSULTANCY_FEE_PPH"] = cf_pph;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                        detailItem["CONSULTANCY_FEE_AMOUNT"] + cf_pph;
                } else {
                    detailItem["CONSULTANCY_FEE_PPH"] = 0;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                        detailItem["CONSULTANCY_FEE_AMOUNT"] + cf_pph;
                }
            }
        }

        if (name == "CONSULTANCY_FEE_VAT") {
            if (value == 1) {
                if (detailItem["INCOME_TYPE"] == 1) {
                    cf_ppn = -(
                        (detailItem["CONSULTANCY_FEE_AMOUNT"] * 11) /
                        100
                    );
                }
                detailItem["CONSULTANCY_FEE_PPN"] = cf_ppn;
                detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                    parseFloat(detailItem["CONSULTANCY_FEE_AMOUNT"]) + parseFloat(detailItem["CONSULTANCY_FEE_PPN"]);
            } else {
                detailItem["CONSULTANCY_FEE_PPN"] = 0;
                detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] =
                    detailItem["CONSULTANCY_FEE_AMOUNT"] + cf_ppn;
            }
        }

        if (name == "BROKERAGE_FEE_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["BROKERAGE_FEE_VAT"] == 1) {
                    bf_ppn = -((value * 11) / 100);
                    detailItem["BROKERAGE_FEE_PPN"] = bf_ppn;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        parseFloat(value) + parseFloat(detailItem["BROKERAGE_FEE_PPN"]);
                } else {
                    detailItem["BROKERAGE_FEE_PPN"] = 0;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        value + bf_ppn;
                }
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                if (detailItem["BROKERAGE_FEE_VAT"] == 1) {
                    // untuk perusahaan 2%
                    // bf_pph = -((value * 2) / 100);
                    // untuk perorangan 5%
                    bf_pph = -((value * 5) / 100);
                    detailItem["BROKERAGE_FEE_PPH"] = bf_pph;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        value + bf_pph;
                } else {
                    detailItem["BROKERAGE_FEE_PPH"] = 0;
                    detailItem["BROKERAGE_FEE_NETT_AMOUNT"] =
                        value + bf_pph;
                }
            }
        }

        if (name == "ENGINEERING_FEE_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["ENGINEERING_FEE_VAT"] == 1) {
                    ef_ppn = -((value * 11) / 100);
                    detailItem["ENGINEERING_FEE_PPN"] = ef_ppn;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] = parseFloat(value) + ef_ppn;
                } else {
                    detailItem["ENGINEERING_FEE_PPN"] = 0;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] = parseFloat(value) + ef_ppn;
                }
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                if (detailItem["ENGINEERING_FEE_VAT"] == 1) {
                    // untuk perusahaan 2%
                    // ef_pph = -((value * 2) / 100);
                    // untuk perorangan 5%
                    ef_pph = -((value * 5) / 100);
                    detailItem["ENGINEERING_FEE_PPH"] = ef_pph;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] = parseFloat(value) + ef_pph;
                } else {
                    detailItem["ENGINEERING_FEE_PPH"] = 0;
                    detailItem["ENGINEERING_FEE_NETT_AMOUNT"] = parseFloat(value) + ef_pph;
                }
            }
        }

        if (name == "CONSULTANCY_FEE_AMOUNT") {
            if (value == undefined) {
                value = 0;
            }
            if (detailItem["INCOME_TYPE"] == 1) {
                if (detailItem["CONSULTANCY_FEE_VAT"] == 1) {
                    cf_ppn = -((value * 11) / 100);
                    detailItem["CONSULTANCY_FEE_PPN"] = cf_ppn;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] = parseFloat(value) + cf_ppn;
                } else {
                    detailItem["CONSULTANCY_FEE_PPN"] = 0;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] = parseFloat(value) + cf_ppn;
                }
            }

            if (detailItem["INCOME_TYPE"] == 2) {
                if (detailItem["CONSULTANCY_FEE_VAT"] == 1) {
                    // untuk perusahaan 2%
                    // cf_pph = -((value * 2) / 100);
                    // untuk perorangan 5%
                    cf_pph = -((value * 5) / 100);
                    detailItem["CONSULTANCY_FEE_PPH"] = cf_pph;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] = parseFloat(value) + cf_pph;
                } else {
                    detailItem["CONSULTANCY_FEE_PPH"] = 0;
                    detailItem["CONSULTANCY_FEE_NETT_AMOUNT"] = parseFloat(value) + cf_pph;
                }
            }
        }

        detailItem[name] = value;
        detail[detailNum] = detailItem;
        item.income_detail = detail;
        items[incomeNum] = item;
        setListDataPartners(items);

        if (name == "RELATION_ID") {
            
            const defaultPayable = getDefaultPayable(
                name,
                value,
                incomeNum,
                detailNum
            );
        }

        setTimeout(function () {
            setTriggerEditSumIncome(triggerEditSumIncome + 1);
        }, 1000);
    };

    // Untuk mengisi payable
    useEffect(() => {
        // alert(Object.keys(relationIdForPayable).length);
        if (Object.keys(relationIdForPayable).length > 0) {
            
            const items = [...listDataPartners];
            const item = { ...items[relationIdForPayable["incomeNum"]] };
            const detail = [...item.income_detail];
            const detailItem = { ...detail[relationIdForPayable["detailNum"]] };

            detailItem["PAYABLE"] = relationIdForPayable["value"];
            detail[relationIdForPayable["detailNum"]] = detailItem;
            item.income_detail = detail;
            items[relationIdForPayable["incomeNum"]] = item;
            setListDataPartners(items);
        }
    }, [relationIdForPayable]);

    useEffect(() => {
        if (triggerEditSumIncome != 0) {
            // alert(triggerEditSumIncome)
            getEditSumNettIncome();
        }
    }, [triggerEditSumIncome]);

    const getEditSumNettIncome = () => {
        const items = [...listDataPartners];
        const fbi_by_pks = { ...items[0] };
        const agent_commission = { ...items[1] };
        const acquisition_cost = { ...items[2] };

        // Nett Brokerage Fee
        const nettBF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.BROKERAGE_FEE_NETT_AMOUNT;
        },
        0);
        const nettBF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.BROKERAGE_FEE_NETT_AMOUNT;
        },
        0);

        const nettBF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.BROKERAGE_FEE_NETT_AMOUNT;
            },
            0
        );

        // Nett Engineering Fee
        const nettEF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_NETT_AMOUNT;
        },
        0);
        const nettEF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_NETT_AMOUNT;
        },
        0);
        const nettEF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.ENGINEERING_FEE_NETT_AMOUNT;
            },
            0
        );

        // Nett Consultancy Fee
        const nettCF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_NETT_AMOUNT;
        },
        0);
        const nettCF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_NETT_AMOUNT;
        },
        0);
        const nettCF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.CONSULTANCY_FEE_NETT_AMOUNT;
            },
            0
        );

        const initBF = parseFloat(dataInitialForBP.BF_NETT_AMOUNT);
        const initEF = parseFloat(dataInitialForBP.EF_NETT_AMOUNT);
        const initCF = parseFloat(dataInitialForBP.CF_NETT_AMOUNT);

        const nettBF =
            parseFloat(nettBF_fbi) +
            parseFloat(nettBF_agent) +
            parseFloat(nettBF_acquisition);
        
        const nettEF =
            parseFloat(nettEF_fbi) +
            parseFloat(nettEF_agent) +
            parseFloat(nettEF_acquisition);
        const nettCF =
            parseFloat(nettCF_fbi) +
            parseFloat(nettCF_agent) +
            parseFloat(nettCF_acquisition);
        setDataEditNettIncome([
            {
                nettBf: initBF - nettBF,
                nettEf: initEF - nettEF,
                nettCf: initCF - nettCF,
            },
        ]);
        setGrandTotalEditNettIncome(
            initBF - nettBF + (initEF - nettEF) + (initCF - nettCF)
        );
    };

    const deleteRowEditIncome = (incomeNum: number, detailNum: number) => {
        const items = [...listDataPartners];
        const item = { ...items[incomeNum] };
        const detail = [...item.income_detail];
        detail.splice(detailNum, 1);
        item.income_detail = detail;
        items[incomeNum] = item;

        setListDataPartners(items);
    };
    const handleSuccessEditPartners = (message: any) => {
        setRelationIdForPayable([])
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
        getDataPartner(policy.POLICY_ID);
        setTriggerEditSumIncome(0);
    };
    // End Edit Partners

    const getDataInsured = async (policy_id: number) => {
        await axios
            .get(`/getDataInsured/${policy_id}`)
            .then((res) => setdataInsuredView(res.data))
            .catch((err) => console.log(err));
    };

    const handleSuccessInsured = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        getDataInsured(policy.POLICY_ID);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
        setDataInsured([]);
    };

    const handleSuccess = (message: string) => {
        getDetailPolicy(policy.POLICY_ID);

        Swal.fire({
            title: "Success",
            text: "Success Edit Policy",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                // getDetailPolicy(policy.POLICY_ID);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: false,
                    document: false,
                    search: false,
                    addInsurer: false,
                    editInsurer: false,
                    addCoverage: false,
                    editCoverage: false,
                    addInsured: false,
                    editInsured: false,
                    addPartners: false,
                    editPartners: false,
                });
            }
        });
    };

    const handleSuccessCoverageName = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        getDataCoverageName(policy.POLICY_ID);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
        setDataPolicyCoverage([]);
    };

    const handleSuccessInsurer = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        getInsurancePanel(policy.POLICY_ID);
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: false,
            editInsured: false,
            addPartners: false,
            editPartners: false,
        });
    };

    const handleDeleteModal = async () => {
        const id = policy.POLICY_ID;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            width: 400,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .patch(`/deactivatePolicy/${id}`, { id: id })
                    .then((res) => {
                        if (res.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Policy has been deleted.",
                                icon: "success",
                            });
                            onDeleteSuccess(true);
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete.",
                                icon: "error",
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });
    };

    const handleSwitch = () => {
        setFlagSwitch(!flagSwitch);
    };

    useEffect(() => {
        if (flagSwitch == false) {
            setDataById({
                ...dataById,
                SELF_INSURED: 0,
            });
        }
    }, [flagSwitch]);

    const [dataSummary, setDataSummary] = useState<any>({
        GROSS_AR: 0,
        DISC_AR: 0,
        NETT_AR: 0,
        GROSS_PREMIUM: 0,
        GROSS_BF: 0,
        PPH23: 0,
        NETT_BF: 0,
        NETT_AP: 0,
        COMMISSION: 0,
        TAX_COMMISSION: 0,
        NETT_COMMISSION: 0,
        MARGIN: 0,
    });
    
    const getDataForSummary = () => {
        // alert('aa')
        // setFlagSwitch(!flagSwitch);
        let gross_premium = dataCoverageName?.map((coverage: any) => {
            return coverage;
        });
        
    };

    return (
        <>
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* modal edit */}
            <ModalToAction
                show={modal.edit}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                }}
                title={"Edit Policy"}
                url={`/editPolicy/${dataById.POLICY_ID}`}
                data={dataById}
                onSuccess={handleSuccess}
                method={"patch"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="mb-4 ml-4 mr-4">
                            <InputLabel
                                htmlFor="edit_relation"
                                value="Client Name"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_ID}
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_ID: e.target.value,
                                    })
                                }
                            >
                                <option>
                                    -- <i>Choose Client</i> --
                                </option>
                                {clients?.map((status: any) => {
                                    return (
                                        <option
                                            value={
                                                status.RELATION_ORGANIZATION_ID
                                            }
                                        >
                                            {status.RELATION_ORGANIZATION_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 ml-4 mr-4">
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_policy_number"
                                    value="Policy Number"
                                />
                                <TextInput
                                    id="edit_policy_number"
                                    type="text"
                                    name="edit_policy_number"
                                    value={dataById.POLICY_NUMBER}
                                    className=""
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_NUMBER: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_insurance_type"
                                    value="Insurance Type"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.INSURANCE_TYPE_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            INSURANCE_TYPE_ID: e.target.value,
                                        })
                                    }
                                >
                                    <option value={""}>
                                        -- <i>Choose Insurance Type</i> --
                                    </option>
                                    {insuranceType?.map((status: any) => {
                                        return (
                                            <option
                                                value={status.INSURANCE_TYPE_ID}
                                            >
                                                {status.INSURANCE_TYPE_NAME}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_policy_type"
                                    value="Policy Type"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.POLICY_TYPE}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_TYPE: e.target.value,
                                        })
                                    }
                                >
                                    <option value={""}>
                                        -- <i>Choose Policy Type</i> --
                                    </option>
                                    {policyType?.map((status: any) => {
                                        return (
                                            <option value={status.ID}>
                                                {status.NAME}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 ml-4 mr-4">
                            <InputLabel
                                htmlFor="edit_the_insured"
                                value="Policy The Insured"
                            />
                            <TextInput
                                id="edit_the_insured"
                                type="text"
                                name="edit_the_insured"
                                value={dataById.POLICY_THE_INSURED}
                                className=""
                                autoComplete="off"
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        POLICY_THE_INSURED: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_policy_inception_date"
                                    value="Inception Date"
                                />
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 pointer-events-none">
                                        <svg
                                            className="w-3 h-3 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <DatePicker
                                        selected={
                                            dataById.POLICY_INCEPTION_DATE
                                        }
                                        onChange={(date: any) =>
                                            setDataById({
                                                ...dataById,
                                                POLICY_INCEPTION_DATE:
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                            })
                                        }
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyyy"
                                        className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="edit_policy_due_date"
                                    value="Expiry Date"
                                />
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3  pointer-events-none">
                                        <svg
                                            className="w-3 h-3 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <DatePicker
                                        selected={dataById.POLICY_DUE_DATE}
                                        onChange={(date: any) =>
                                            setDataById({
                                                ...dataById,
                                                POLICY_DUE_DATE:
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                            })
                                        }
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyyy"
                                        className="border-0 rounded-md shadow-md text-sm h-9 w-full px-10 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_policy_status_id"
                                    value="Policy Status"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.POLICY_STATUS_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_STATUS_ID: e.target.value,
                                        })
                                    }
                                >
                                    <option>
                                        -- <i>Choose</i> --
                                    </option>
                                    {policyStatus.map((ps: any, i: number) => {
                                        return (
                                            <option key={i} value={ps.id}>
                                                {ps.stat}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="w-60">
                                <InputLabel value="Self Insured" />

                                <div className="grid grid-cols-5">
                                    <div className="">
                                        <SwitchPage
                                            enabled={flagSwitch}
                                            onChangeButton={handleSwitch}
                                        />
                                    </div>
                                    {flagSwitch ? (
                                        <>
                                            <div className="col-span-3 ">
                                                <CurrencyInput
                                                    id="self_insured"
                                                    name="self_insured"
                                                    value={
                                                        dataById.SELF_INSURED
                                                    }
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    onValueChange={(values) =>
                                                        setDataById({
                                                            ...dataById,
                                                            SELF_INSURED:
                                                                values,
                                                        })
                                                    }
                                                    className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    required
                                                    placeholder="Percentage (%)"
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="mt-2">{"%"}</div>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal edit */}

            {/* Modal Add Co Broking */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalCoBroking.addCoBroking}
                onClose={() => {
                    setModalCoBroking({
                        addCoBroking: false,
                    });
                    setDataCoBroking([]);
                }}
                title={"Update Co Broking"}
                url={`/insertCoBroking`}
                data={dataCoBroking}
                onSuccess={handleSuccessCoBroking}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="mt-4 mb-4 ml-4 mr-4">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                <table className="table-auto w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr className="text-sm font-semibold text-gray-900">
                                            <th className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300">
                                                No.
                                            </th>
                                            <th className="text-center md:p-4 p-0 md:w-38  border-r border-gray-300">
                                                Participant
                                            </th>
                                            <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300">
                                                Proporsional Co Broking %
                                            </th>
                                            <th className="text-center md:p-4 p-0 md:w-28  border-r border-gray-300">
                                                Is Leader
                                            </th>
                                            <th className="text-center md:p-4 p-0 md:w-20  border-r border-gray-300">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCoBroking?.map(
                                            (detail: any, m: number) => {
                                                return (
                                                    <tr key={m}>
                                                        <td className="p-2 border text-center">
                                                            {m + 1}
                                                        </td>
                                                        <td className="p-2 border">
                                                            <select
                                                                className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                value={
                                                                    detail.RELATION_ID
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    inputCoBroking(
                                                                        "RELATION_ID",
                                                                        e.target
                                                                            .value,
                                                                        m
                                                                    );
                                                                }}
                                                            >
                                                                <option
                                                                    value={""}
                                                                >
                                                                    --{" "}
                                                                    <i>
                                                                        Choose
                                                                    </i>{" "}
                                                                    --
                                                                </option>
                                                                {listBroker.map(
                                                                    (
                                                                        item: any,
                                                                        i: number
                                                                    ) => {
                                                                        return (
                                                                            <option
                                                                                key={
                                                                                    i
                                                                                }
                                                                                value={
                                                                                    item.RELATION_ORGANIZATION_ID
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.RELATION_ORGANIZATION_NAME
                                                                                }
                                                                            </option>
                                                                        );
                                                                    }
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td className="p-2 border">
                                                            <div className="block w-full mx-auto text-left">
                                                                <CurrencyInput
                                                                    id="co_broking_percentage"
                                                                    name="CO_BROKING_PERCENTAGE"
                                                                    value={
                                                                        detail.CO_BROKING_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputCoBroking(
                                                                            "CO_BROKING_PERCENTAGE",
                                                                            values,
                                                                            m
                                                                        );
                                                                    }}
                                                                    className="block w-56 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-2 border">
                                                            <div className="text-center ">
                                                                <Checkbox
                                                                    defaultChecked={
                                                                        detail.CO_BROKING_IS_LEADER
                                                                    }
                                                                    name={
                                                                        "co_broking_is_leader-" +
                                                                        m
                                                                    }
                                                                    id={
                                                                        detail.CO_BROKING_IS_LEADER
                                                                    }
                                                                    value={
                                                                        detail.CO_BROKING_IS_LEADER
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputCoBroking(
                                                                            "CO_BROKING_IS_LEADER",
                                                                            e
                                                                                .target
                                                                                .checked ==
                                                                                true
                                                                                ? 1
                                                                                : 0,
                                                                            m
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {m > 0 ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        deleteRowCoBroking(
                                                                            m
                                                                        );
                                                                    }}
                                                                >
                                                                    <path
                                                                        fill="#AB7C94"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M6 18 18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className=" h-10 w-40 mb-2 mt-2"
                                            >
                                                <a
                                                    href=""
                                                    className="pl-2 text-xs mt-1 text-primary-pelindo ms-1"
                                                    onClick={(e) =>
                                                        addRowCoBroking(
                                                            e,
                                                            policy.POLICY_ID
                                                        )
                                                    }
                                                >
                                                    + Add Participant
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Co Broking  */}

            {/* Modal Add Coverage */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.addCoverage}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                }}
                title={"Add Coverage"}
                url={`/insertManyCoverage`}
                data={dataPolicyCoverage}
                onSuccess={handleSuccessCoverageName}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        {dataPolicyCoverage.map((coverage: any, l: number) => (
                            <div className="mt-4 mb-4 ml-4 mr-4">
                                <div className="shadow-md border-2 mt-3">
                                    <div className=" ml-4 mr-4 mb-4 mt-3">
                                        <div className="grid grid-cols-5 mb-4">
                                            <div className="">
                                                <InputLabel
                                                    htmlFor="coverage_name"
                                                    value="Coverage Name"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    id="coverage_name"
                                                    type="text"
                                                    name="coverage_name"
                                                    value={
                                                        coverage.POLICY_COVERAGE_NAME
                                                    }
                                                    className=""
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        inputDataCoverage(
                                                            "POLICY_COVERAGE_NAME",
                                                            e.target.value,
                                                            l
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            {l > 0 ? (
                                                <div>
                                                    <div className="">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mx-auto h-6 text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                deleteRowCoverage(
                                                                    l
                                                                );
                                                            }}
                                                        >
                                                            <path
                                                                fill="#AB7C94"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18 18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>

                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                            <table className="table-auto w-full">
                                                <thead className="border-b bg-gray-50">
                                                    <tr className="text-sm font-semibold text-gray-900">
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                        >
                                                            No.
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Interest Insured
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Remarks
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Currency
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Sum Insured
                                                        </th>
                                                        <th
                                                            colSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Gross Premium
                                                        </th>

                                                        <th
                                                            colSpan={3}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Loss Limit Premium
                                                        </th>

                                                        <th
                                                            colSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Insurance Discount
                                                        </th>

                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Coverage Premium
                                                        </th>
                                                        <th
                                                            colSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Deposit Premium
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                        >
                                                            Delete
                                                        </th>
                                                    </tr>
                                                    <tr className="text-sm font-semibold text-gray-900">
                                                        <th className="text-center p-4 border">
                                                            Rate %
                                                        </th>
                                                        <th className="text-center p-4 border">
                                                            Amount
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center p-4 border"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center p-4 border"
                                                        >
                                                            Scale %
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center p-4 border"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center p-4 border"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center p-4 border"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {coverage?.policy_coverage_detail?.map(
                                                        (
                                                            detail: any,
                                                            m: number
                                                        ) => {
                                                            return (
                                                                <tr key={m}>
                                                                    <td className="p-4 border text-center">
                                                                        {m + 1}
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <select
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            value={
                                                                                detail.INTEREST_INSURED_ID
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "INTEREST_INSURED_ID",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    ""
                                                                                }
                                                                            >
                                                                                --{" "}
                                                                                <i>
                                                                                    Choose
                                                                                </i>{" "}
                                                                                --
                                                                            </option>
                                                                            {interestInsured.map(
                                                                                (
                                                                                    interest: any,
                                                                                    s: number
                                                                                ) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={
                                                                                                s
                                                                                            }
                                                                                            value={
                                                                                                interest.INTEREST_INSURED_ID
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                interest.INTEREST_INSURED_NAME
                                                                                            }
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <div className="block w-40 mx-auto text-left">
                                                                            <TextInput
                                                                                id="remarks"
                                                                                type="text"
                                                                                name="remarks"
                                                                                value={
                                                                                    detail.REMARKS
                                                                                }
                                                                                className=""
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    inputCoverageDetail(
                                                                                        "REMARKS",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        l,
                                                                                        m
                                                                                    )
                                                                                }
                                                                                // required
                                                                                autoComplete="off"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <select
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            value={
                                                                                detail.CURRENCY_ID
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "CURRENCY_ID",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    ""
                                                                                }
                                                                            >
                                                                                --{" "}
                                                                                <i>
                                                                                    Choose
                                                                                    Currency
                                                                                </i>{" "}
                                                                                --
                                                                            </option>
                                                                            {currency.map(
                                                                                (
                                                                                    currencies: any,
                                                                                    k: number
                                                                                ) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={
                                                                                                k
                                                                                            }
                                                                                            value={
                                                                                                currencies.CURRENCY_ID
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                currencies.CURRENCY_SYMBOL
                                                                                            }
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="sum_insured"
                                                                            name="SUM_INSURED"
                                                                            value={
                                                                                detail.SUM_INSURED
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "SUM_INSURED",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-56 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="rate"
                                                                            name="RATE"
                                                                            value={
                                                                                detail.RATE
                                                                            }
                                                                            decimalScale={
                                                                                6
                                                                            }
                                                                            decimalsLimit={
                                                                                6
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "RATE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="sum_insured"
                                                                            name="GROSS_PREMIUM"
                                                                            value={
                                                                                detail.GROSS_PREMIUM
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "GROSS_PREMIUM",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="lost_limit_percentage"
                                                                            name="LOST_LIMIT_PERCENTAGE"
                                                                            value={
                                                                                detail.LOST_LIMIT_PERCENTAGE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "LOST_LIMIT_PERCENTAGE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="lost_limit_scale"
                                                                            name="LOST_LIMIT_SCALE"
                                                                            value={
                                                                                detail.LOST_LIMIT_SCALE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "LOST_LIMIT_SCALE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="lost_limit_amount"
                                                                            name="LOST_LIMIT_AMOUNT"
                                                                            value={
                                                                                detail.LOST_LIMIT_AMOUNT
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "LOST_LIMIT_AMOUNT",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>

                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="insurance_disc_percentage"
                                                                            name="INSURANCE_DISC_PERCENTAGE"
                                                                            value={
                                                                                detail.INSURANCE_DISC_PERCENTAGE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "INSURANCE_DISC_PERCENTAGE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="insurance_disc_amount"
                                                                            name="INSURANCE_DISC_AMOUNT"
                                                                            value={
                                                                                detail.INSURANCE_DISC_AMOUNT
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "INSURANCE_DISC_AMOUNT",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="premium"
                                                                            name="PREMIUM"
                                                                            value={
                                                                                detail.PREMIUM
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "PREMIUM",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="deposit_premium_percentage"
                                                                            name="DEPOSIT_PREMIUM_PERCENTAGE"
                                                                            value={
                                                                                detail.DEPOSIT_PREMIUM_PERCENTAGE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "DEPOSIT_PREMIUM_PERCENTAGE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 border">
                                                                        <CurrencyInput
                                                                            id="deposit_premium_amount"
                                                                            name="DEPOSIT_PREMIUM_AMOUNT"
                                                                            value={
                                                                                detail.DEPOSIT_PREMIUM_AMOUNT
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputCoverageDetail(
                                                                                    "DEPOSIT_PREMIUM_AMOUNT",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        {m >
                                                                        0 ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    deleteRowCoverageDetail(
                                                                                        l,
                                                                                        m
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <path
                                                                                    fill="#AB7C94"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M6 18 18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className=" h-10 w-40 mb-2 mt-2"
                                            >
                                                <a
                                                    href=""
                                                    className="pl-2 text-xs mt-1 text-primary-pelindo ms-1"
                                                    onClick={(e) =>
                                                        addRowCoverageDetail(
                                                            e,
                                                            l
                                                        )
                                                    }
                                                >
                                                    + Add Row
                                                </a>
                                            </td>
                                        </tr>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="ml-4 w-40 mb-2 mt-2">
                            <a
                                href=""
                                className="text-xs mt-1 text-primary-pelindo ms-1"
                                onClick={(e) => addRowCoverage(e)}
                            >
                                + Add Coverage
                            </a>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Coverage */}

            {/* modal edit Coverage  */}
            <ModalToAction
                show={modal.editCoverage}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                    setDataInsurer([]);
                }}
                title={"Edit Coverage"}
                url={`/editCoverage`}
                data={dataEditPolicyCoverage}
                onSuccess={handleSuccessCoverageName}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="mt-4 mb-4 ml-4 mr-4">
                            <div className="shadow-md border-2 mt-3">
                                <div className=" ml-4 mr-4 mb-4 mt-3">
                                    <div className="grid grid-cols-5 mb-4">
                                        <div className="">
                                            <InputLabel
                                                htmlFor="coverage_name"
                                                value="Coverage Name"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <TextInput
                                                id="coverage_name"
                                                type="text"
                                                name="coverage_name"
                                                value={
                                                    dataEditPolicyCoverage.POLICY_COVERAGE_NAME
                                                }
                                                className=""
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    setDataEditPolicyCoverage({
                                                        ...dataEditPolicyCoverage,
                                                        POLICY_COVERAGE_NAME:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                        <table className="table-auto w-full">
                                            <thead className="border-b bg-gray-50">
                                                <tr className="text-sm font-semibold text-gray-900">
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                    >
                                                        No.
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Interest Insured
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Remarks
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Currency
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Sum Insured
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Gross Premium
                                                    </th>
                                                    <th
                                                        colSpan={3}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Loss Limit Premium
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Insurance Discount
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Coverage Premium
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Deposit Premium
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                    >
                                                        Delete
                                                    </th>
                                                </tr>
                                                <tr className="text-sm font-semibold text-gray-900">
                                                    <th className="text-center p-4 border">
                                                        Rate %
                                                    </th>
                                                    <th className="text-center p-4 border">
                                                        Amount
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center p-4 border"
                                                    >
                                                        %
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center p-4 border"
                                                    >
                                                        Scale %
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center p-4 border"
                                                    >
                                                        Amount
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center p-4 border"
                                                    >
                                                        %
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center p-4 border"
                                                    >
                                                        Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataEditPolicyCoverage?.policy_coverage_detail?.map(
                                                    (
                                                        editDetail: any,
                                                        j: number
                                                    ) => {
                                                        return (
                                                            <tr key={j}>
                                                                <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                    {j + 1}
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            editDetail.INTEREST_INSURED_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "INTEREST_INSURED_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                j
                                                                            );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {interestInsured.map(
                                                                            (
                                                                                interest: any,
                                                                                s: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            s
                                                                                        }
                                                                                        value={
                                                                                            interest.INTEREST_INSURED_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            interest.INTEREST_INSURED_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <div className="block w-40 mx-auto text-left">
                                                                        <TextInput
                                                                            id="remarks"
                                                                            type="text"
                                                                            name="remarks"
                                                                            value={
                                                                                editDetail.REMARKS
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                editCoverageDetail(
                                                                                    "REMARKS",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    j
                                                                                );
                                                                            }}
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <select
                                                                        className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            editDetail.CURRENCY_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "CURRENCY_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                j
                                                                            );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                Currency
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {currency.map(
                                                                            (
                                                                                currencies: any,
                                                                                k: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            k
                                                                                        }
                                                                                        value={
                                                                                            currencies.CURRENCY_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            currencies.CURRENCY_SYMBOL
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="sum_insured"
                                                                        name="SUM_INSURED"
                                                                        value={
                                                                            editDetail.SUM_INSURED
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "SUM_INSURED",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-56 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="rate"
                                                                        name="RATE"
                                                                        value={
                                                                            editDetail.RATE
                                                                        }
                                                                        decimalScale={
                                                                            6
                                                                        }
                                                                        decimalsLimit={
                                                                            6
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "RATE",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="sum_insured"
                                                                        name="GROSS_PREMIUM"
                                                                        value={
                                                                            editDetail.GROSS_PREMIUM
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "GROSS_PREMIUM",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="lost_limit_percentage"
                                                                        name="LOST_LIMIT_PERCENTAGE"
                                                                        value={
                                                                            editDetail.LOST_LIMIT_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "LOST_LIMIT_PERCENTAGE",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="lost_limit_scale"
                                                                        name="LOST_LIMIT_SCALE"
                                                                        value={
                                                                            editDetail.LOST_LIMIT_SCALE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "LOST_LIMIT_SCALE",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="lost_limit_amount"
                                                                        name="LOST_LIMIT_AMOUNT"
                                                                        value={
                                                                            editDetail.LOST_LIMIT_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "LOST_LIMIT_AMOUNT",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>

                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="insurance_disc_percentage"
                                                                        name="INSURANCE_DISC_PERCENTAGE"
                                                                        value={
                                                                            editDetail.INSURANCE_DISC_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "INSURANCE_DISC_PERCENTAGE",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-36 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm  py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="insurance_disc_amount"
                                                                        name="INSURANCE_DISC_AMOUNT"
                                                                        value={
                                                                            editDetail.INSURANCE_DISC_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "INSURANCE_DISC_AMOUNT",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border text-sm py-3 px-4 dark:border-strokedark">
                                                                    <CurrencyInput
                                                                        id="premium"
                                                                        name="PREMIUM"
                                                                        value={
                                                                            editDetail.PREMIUM
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "PREMIUM",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-48 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="deposit_premium_percentage"
                                                                        name="DEPOSIT_PREMIUM_PERCENTAGE"
                                                                        value={
                                                                            editDetail.DEPOSIT_PREMIUM_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "DEPOSIT_PREMIUM_PERCENTAGE",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="deposit_premium_amount"
                                                                        name="DEPOSIT_PREMIUM_AMOUNT"
                                                                        value={
                                                                            editDetail.DEPOSIT_PREMIUM_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            editCoverageDetail(
                                                                                "DEPOSIT_PREMIUM_AMOUNT",
                                                                                values,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {j > 0 ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            stroke="currentColor"
                                                                            className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                            onClick={() => {
                                                                                deleteRowEditCoverageDetail(
                                                                                    j
                                                                                );
                                                                            }}
                                                                        >
                                                                            <path
                                                                                fill="#AB7C94"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M6 18 18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                                <tr>
                                                    <td
                                                        colSpan={2}
                                                        className=" h-10 w-40 mb-2 mt-2"
                                                    >
                                                        <a
                                                            href=""
                                                            className="pl-2 text-xs mt-1 text-primary-pelindo ms-1"
                                                            onClick={(e) =>
                                                                addRowEditCoverageDetail(
                                                                    e,
                                                                    dataEditPolicyCoverage.POLICY_COVERAGE_ID
                                                                )
                                                            }
                                                        >
                                                            + Add Row
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal edit Coverage */}

            {/* Modal Add Insurer */}
            <ModalToAction
                show={modal.addInsurer}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                    setDataInsurer([]);
                }}
                title={"Add Insurer"}
                url={`/insertManyInsurer`}
                data={dataInsurer}
                onSuccess={handleSuccessInsurer}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="grid grid-cols-2 gap-4 ml-4 mb-3 mt-4">
                            <div className="">
                                <div className="grid grid-cols-4">
                                    <div className="">
                                        <span>Policy Number :</span>
                                    </div>
                                    <div className=" col-span-3">
                                        <span className="font-normal text-gray-500">
                                            {policy.POLICY_NUMBER}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="grid grid-cols-4">
                                    <div className="">
                                        <span>Client Name :</span>
                                    </div>
                                    <div className=" col-span-3">
                                        <span className="font-normal text-gray-500">
                                            {
                                                policy.relation
                                                    .RELATION_ORGANIZATION_NAME
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 ml-4 mb-3 mt-4">
                            <div className="">
                                <div className="grid grid-cols-5 ">
                                    <div className="col-span-2">
                                        <span>How many Insurer? :</span>
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            id="insurer_number"
                                            type="number"
                                            name="insurer_number"
                                            value={
                                                dataById.POLICY_INSURANCE_PANEL
                                            }
                                            className=""
                                            autoComplete="off"
                                            onChange={(e) => {
                                                setDataById({
                                                    ...dataById,
                                                    POLICY_INSURANCE_PANEL:
                                                        e.target.value,
                                                }),
                                                    addRowDataInsurer(
                                                        e.target.value
                                                    );
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>

                        {/* List Insurer */}
                        {dataInsurer?.map((dataIns: any, i: number) => {
                            return (
                                <>
                                    <div className="mt-6 mb-4 ml-4 mr-4">
                                        {/* <h3 className="text-xl font-semibold leading-6 text-gray-900 border-b-2 w-fit">
                                            List Insurer
                                        </h3> */}
                                        <div className="shadow-md border-2 mt-3">
                                            <div className=" ml-4 mr-4 mb-4 mt-4">
                                                <div className="grid grid-cols-5 gap-4">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="edit_relation"
                                                            value="Insurer"
                                                        />
                                                        <select
                                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                dataIns.INSURANCE_ID
                                                            }
                                                            onChange={(e) =>
                                                                inputDataInsurer(
                                                                    "INSURANCE_ID",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <option>
                                                                --{" "}
                                                                <i>
                                                                    Choose
                                                                    Insurer
                                                                </i>{" "}
                                                                --
                                                            </option>
                                                            {insurance?.map(
                                                                (
                                                                    insurer: any
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            value={
                                                                                insurer.RELATION_ORGANIZATION_ID
                                                                            }
                                                                        >
                                                                            {
                                                                                insurer.RELATION_ORGANIZATION_NAME
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ip_policy_share"
                                                            value="Share (%)"
                                                        />
                                                        <CurrencyInput
                                                            id="ip_policy_share"
                                                            name="ip_policy_share"
                                                            value={
                                                                dataIns.IP_POLICY_SHARE
                                                            }
                                                            autoComplete="off"
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputDataInsurer(
                                                                    "IP_POLICY_SHARE",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="policy_leader"
                                                            value="Policy Leader"
                                                        />
                                                        <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={
                                                                        "radio-" +
                                                                        i
                                                                    }
                                                                    name={
                                                                        "ip_policy_leader-" +
                                                                        i
                                                                    }
                                                                    type="radio"
                                                                    value={1}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataInsurer(
                                                                            "IP_POLICY_LEADER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    checked={
                                                                        dataIns.IP_POLICY_LEADER ==
                                                                        1
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                />
                                                                <label
                                                                    htmlFor="radio1"
                                                                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                >
                                                                    Yes
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={
                                                                        "radio-" +
                                                                        i
                                                                    }
                                                                    name={
                                                                        "ip_policy_leader-" +
                                                                        i
                                                                    }
                                                                    type="radio"
                                                                    value={0}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataInsurer(
                                                                            "IP_POLICY_LEADER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    checked={
                                                                        dataIns.IP_POLICY_LEADER ==
                                                                        0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                />
                                                                <label
                                                                    htmlFor="radio2"
                                                                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                >
                                                                    No
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {dataIns.IP_POLICY_LEADER ==
                                                    1 ? (
                                                        <>
                                                            <div>
                                                                <InputLabel
                                                                    htmlFor="currency_id"
                                                                    value="Currency"
                                                                />
                                                                <select
                                                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        dataIns.IP_CURRENCY_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        inputDataInsurer(
                                                                            "IP_CURRENCY_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        );
                                                                    }}
                                                                >
                                                                    <option>
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                            Currency
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {currencyFromCoverage.map(
                                                                        (
                                                                            currencies: any,
                                                                            k: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        k
                                                                                    }
                                                                                    value={
                                                                                        currencies.CURRENCY_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currencies.CURRENCY_SYMBOL
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <InputLabel
                                                                    htmlFor="policy_cost"
                                                                    value="Policy Cost"
                                                                />
                                                                <CurrencyInput
                                                                    id="policy_cost"
                                                                    name="policy_cost"
                                                                    value={
                                                                        dataIns.POLICY_COST
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataInsurer(
                                                                            "POLICY_COST",
                                                                            values,
                                                                            i
                                                                        );
                                                                    }}
                                                                    autoComplete="off"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    required
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mb-4 mt-4 ">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                        <tr className="bg-gray-2 dark:bg-meta-4">
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                No.
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Interest Insured
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Remarks
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Coverage Name
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Currency
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Coverage Premium
                                                            </th>
                                                            <th
                                                                colSpan={6}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Brokerage Fee
                                                            </th>
                                                            <th
                                                                colSpan={6}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Engineering Fee
                                                            </th>
                                                            <th
                                                                colSpan={5}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Consultancy Fee
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Nett Premium
                                                            </th>
                                                        </tr>
                                                        <tr className="text-sm font-semibold text-gray-900">
                                                            <th className="text-center p-4 border ">
                                                                %
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                %
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataIns.premium?.map(
                                                            (
                                                                dIP: any,
                                                                j: number
                                                            ) => {
                                                                return (
                                                                    <tr key={j}>
                                                                        <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            {j +
                                                                                1}
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <select
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.INTEREST_INSURED_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "INTEREST_INSURED_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        ""
                                                                                    }
                                                                                >
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {interestInsured.map(
                                                                                    (
                                                                                        interest: any,
                                                                                        s: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    s
                                                                                                }
                                                                                                value={
                                                                                                    interest.INTEREST_INSURED_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    interest.INTEREST_INSURED_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                <TextInput
                                                                                    id="remarks"
                                                                                    type="text"
                                                                                    name="remarks"
                                                                                    value={
                                                                                        dIP.REMARKS
                                                                                    }
                                                                                    className=""
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        inputInsurerCoverage(
                                                                                            "REMARKS",
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                            i,
                                                                                            j
                                                                                        )
                                                                                    }
                                                                                    readOnly
                                                                                    autoComplete="off"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <select
                                                                                className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.POLICY_COVERAGE_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "POLICY_COVERAGE_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Coverage
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {coverageGrouping.map(
                                                                                    (
                                                                                        item: any,
                                                                                        i: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                value={
                                                                                                    item.POLICY_COVERAGE_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.POLICY_COVERAGE_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <select
                                                                                className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.CURRENCY_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "CURRENCY_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Currency
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {currencyFromCoverage.map(
                                                                                    (
                                                                                        currencies: any,
                                                                                        k: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    k
                                                                                                }
                                                                                                value={
                                                                                                    currencies.CURRENCY_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    currencies.CURRENCY_SYMBOL
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="gross_premi"
                                                                                name="GROSS_PREMI"
                                                                                value={
                                                                                    dIP.GROSS_PREMI
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "GROSS_PREMI",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_percentage"
                                                                                name="BROKERAGE_FEE_PERCENTAGE"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PERCENTAGE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee"
                                                                                name="BROKERAGE_FEE"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "BROKERAGE_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "brokerage_fee_vat-" +
                                                                                            +i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "BROKERAGE_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.BROKERAGE_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "BROKERAGE_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.BROKERAGE_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_ppn"
                                                                                name="BROKERAGE_FEE_PPN"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_pph"
                                                                                name="BROKERAGE_FEE_PPH"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_pph_nett_amount"
                                                                                name="BROKERAGE_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "BROKERAGE_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_percentage"
                                                                                name="ENGINEERING_FEE_PERCENTAGE"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PERCENTAGE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee"
                                                                                name="ENGINEERING_FEE"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "ENGINEERING_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "ENGINEERING_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.ENGINEERING_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "ENGINEERING_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.ENGINEERING_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_ppn"
                                                                                name="ENGINEERING_FEE_PPN"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_pph"
                                                                                name="ENGINEERING_FEE_PPH"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_nett_amount"
                                                                                name="ENGINEERING_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "ENGINEERING_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_amount"
                                                                                name="CONSULTANCY_FEE"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "CONSULTANCY_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "CONSULTANCY_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.CONSULTANCY_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            inputInsurerCoverage(
                                                                                                "CONSULTANCY_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.CONSULTANCY_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_ppn"
                                                                                name="CONSULTANCY_FEE_PPN"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_pph"
                                                                                name="CONSULTANCY_FEE_PPH"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_nett_amount"
                                                                                name="CONSULTANCY_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="nett_premi"
                                                                                name="NETT_PREMI"
                                                                                value={
                                                                                    dIP.NETT_PREMI
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    inputInsurerCoverage(
                                                                                        "NETT_PREMI",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                        {/* End List Insurer */}
                    </>
                }
            />
            {/* End Modal Add Insurer */}

            {/* modal edit Insurer */}
            <ModalToAction
                show={modal.editInsurer}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                    setDataInsurer([]);
                }}
                title={"Edit Insurer"}
                url={`/editManyInsurer`}
                data={dataEditInsurer}
                onSuccess={handleSuccessEditInsurer}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="grid grid-cols-2 gap-4 ml-4 mb-3 mt-4">
                            <div className="">
                                <div className="grid grid-cols-4">
                                    <div className="">
                                        <span>Policy Number :</span>
                                    </div>
                                    <div className=" col-span-3">
                                        <span className="font-normal text-gray-500">
                                            {policy.POLICY_NUMBER}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="grid grid-cols-4">
                                    <div className="">
                                        <span>Client Name :</span>
                                    </div>
                                    <div className=" col-span-3">
                                        <span className="font-normal text-gray-500">
                                            {
                                                policy.relation
                                                    .RELATION_ORGANIZATION_NAME
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 ml-4 mb-3 mt-4">
                            <div className="">
                                <div className="grid grid-cols-5 ">
                                    <div className="col-span-3">
                                        <span>
                                            How many Insurer? :{" "}
                                            {dataEditInsurer.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>

                        {/* List Insurer */}
                        {dataEditInsurer?.map((dataIns: any, i: number) => {
                            return (
                                <>
                                    <div className="mt-6 mb-4 ml-4 mr-4">
                                        {/* <h3 className="text-xl font-semibold leading-6 text-gray-900 border-b-2 w-fit">
                                            List Insurer
                                        </h3> */}
                                        <div className="shadow-md border-2 mt-3">
                                            <div className=" ml-4 mr-4 mb-4 mt-4">
                                                <div className="grid grid-cols-5 gap-4">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="edit_relation"
                                                            value="Insurer"
                                                        />
                                                        <select
                                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                dataIns.INSURANCE_ID
                                                            }
                                                            onChange={(e) =>
                                                                editDataInsurer(
                                                                    "INSURANCE_ID",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <option>
                                                                --{" "}
                                                                <i>
                                                                    Choose
                                                                    Insurer
                                                                </i>{" "}
                                                                --
                                                            </option>
                                                            {insurance?.map(
                                                                (
                                                                    insurer: any
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            value={
                                                                                insurer.RELATION_ORGANIZATION_ID
                                                                            }
                                                                        >
                                                                            {
                                                                                insurer.RELATION_ORGANIZATION_NAME
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ip_policy_share"
                                                            value="Share (%)"
                                                        />
                                                        <CurrencyInput
                                                            id="ip_policy_share"
                                                            name="ip_policy_share"
                                                            value={
                                                                dataIns.IP_POLICY_SHARE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editDataInsurer(
                                                                    "IP_POLICY_SHARE",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="policy_leader"
                                                            value="Policy Leader"
                                                        />
                                                        <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={
                                                                        "radio-" +
                                                                        i
                                                                    }
                                                                    name={
                                                                        "ip_policy_leader-" +
                                                                        i
                                                                    }
                                                                    type="radio"
                                                                    value={1}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editDataInsurer(
                                                                            "IP_POLICY_LEADER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    checked={
                                                                        dataIns.IP_POLICY_LEADER ==
                                                                        1
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                />
                                                                <label
                                                                    htmlFor="radio1"
                                                                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                >
                                                                    Yes
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={
                                                                        "radio-" +
                                                                        i
                                                                    }
                                                                    name={
                                                                        "ip_policy_leader-" +
                                                                        i
                                                                    }
                                                                    type="radio"
                                                                    value={0}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editDataInsurer(
                                                                            "IP_POLICY_LEADER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    checked={
                                                                        dataIns.IP_POLICY_LEADER ==
                                                                        0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                />
                                                                <label
                                                                    htmlFor="radio2"
                                                                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                >
                                                                    No
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {dataIns.IP_POLICY_LEADER ==
                                                    1 ? (
                                                        <>
                                                            <div>
                                                                <InputLabel
                                                                    htmlFor="currency_id"
                                                                    value="Currency"
                                                                />
                                                                <select
                                                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        dataIns.IP_CURRENCY_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        editDataInsurer(
                                                                            "IP_CURRENCY_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        );
                                                                    }}
                                                                >
                                                                    <option>
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                            Currency
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {currencyFromCoverage.map(
                                                                        (
                                                                            currencies: any,
                                                                            k: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        k
                                                                                    }
                                                                                    value={
                                                                                        currencies.CURRENCY_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currencies.CURRENCY_SYMBOL
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <InputLabel
                                                                    htmlFor="policy_cost"
                                                                    value="Policy Cost"
                                                                />
                                                                <CurrencyInput
                                                                    id="policy_cost"
                                                                    name="policy_cost"
                                                                    value={
                                                                        dataIns.POLICY_COST
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editDataInsurer(
                                                                            "POLICY_COST",
                                                                            values,
                                                                            i
                                                                        );
                                                                    }}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    required
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mb-4 mt-4 ">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                        <tr className="bg-gray-2 dark:bg-meta-4">
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                No.
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Interest Insured
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Remarks
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Coverage Name
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Currency
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Coverage Premium
                                                            </th>
                                                            <th
                                                                colSpan={6}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Brokerage Fee
                                                            </th>
                                                            <th
                                                                colSpan={6}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Engineering Fee
                                                            </th>
                                                            <th
                                                                colSpan={5}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Consultancy Fee
                                                            </th>
                                                            <th
                                                                rowSpan={2}
                                                                className="text-center md:p-4 p-0 md:w-52 text-black border-r border-gray-300"
                                                            >
                                                                Nett Premium
                                                            </th>
                                                        </tr>
                                                        <tr className="text-sm font-semibold text-gray-900">
                                                            <th className="text-center p-4 border ">
                                                                %
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                %
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Amount
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                VAT
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPn
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                PPh 23
                                                            </th>
                                                            <th className="text-center p-4 border ">
                                                                Nett Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataIns.premium?.map(
                                                            (
                                                                dIP: any,
                                                                j: number
                                                            ) => {
                                                                return (
                                                                    <tr key={j}>
                                                                        <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            {j +
                                                                                1}
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <select
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.INTEREST_INSURED_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "INTEREST_INSURED_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        ""
                                                                                    }
                                                                                >
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {interestInsured.map(
                                                                                    (
                                                                                        interest: any,
                                                                                        s: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    s
                                                                                                }
                                                                                                value={
                                                                                                    interest.INTEREST_INSURED_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    interest.INTEREST_INSURED_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                <TextInput
                                                                                    id="remarks"
                                                                                    type="text"
                                                                                    name="remarks"
                                                                                    value={
                                                                                        dIP.REMARKS
                                                                                    }
                                                                                    className=""
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        editInsurerCoverage(
                                                                                            "REMARKS",
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                            i,
                                                                                            j
                                                                                        )
                                                                                    }
                                                                                    readOnly
                                                                                    autoComplete="off"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <select
                                                                                className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.POLICY_COVERAGE_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "POLICY_COVERAGE_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Coverage
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {coverageName.map(
                                                                                    (
                                                                                        item: any,
                                                                                        i: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                value={
                                                                                                    item.POLICY_COVERAGE_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.POLICY_COVERAGE_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <select
                                                                                className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    dIP.CURRENCY_ID
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "CURRENCY_ID",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Currency
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {currencyFromCoverage.map(
                                                                                    (
                                                                                        currencies: any,
                                                                                        k: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    k
                                                                                                }
                                                                                                value={
                                                                                                    currencies.CURRENCY_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    currencies.CURRENCY_SYMBOL
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="gross_premi"
                                                                                name="GROSS_PREMI"
                                                                                value={
                                                                                    dIP.GROSS_PREMI
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "GROSS_PREMI",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_percentage"
                                                                                name="BROKERAGE_FEE_PERCENTAGE"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PERCENTAGE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee"
                                                                                name="BROKERAGE_FEE"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "BROKERAGE_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "BROKERAGE_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.BROKERAGE_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "brokerage_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "BROKERAGE_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.BROKERAGE_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_ppn"
                                                                                name="BROKERAGE_FEE_PPN"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_pph"
                                                                                name="BROKERAGE_FEE_PPH"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "BROKERAGE_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="brokerage_fee_nett_amount"
                                                                                name="BROKERAGE_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.BROKERAGE_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "BROKERAGE_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_percentage"
                                                                                name="ENGINEERING_FEE_PERCENTAGE"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PERCENTAGE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee"
                                                                                name="ENGINEERING_FEE"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "ENGINEERING_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "ENGINEERING_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.ENGINEERING_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "engineering_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "ENGINEERING_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.ENGINEERING_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_ppn"
                                                                                name="ENGINEERING_FEE_PPN"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_pph"
                                                                                name="ENGINEERING_FEE_PPH"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "ENGINEERING_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="engineering_fee_nett_amount"
                                                                                name="ENGINEERING_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.ENGINEERING_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "ENGINEERING_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_amount"
                                                                                name="CONSULTANCY_FEE"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "CONSULTANCY_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "CONSULTANCY_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.CONSULTANCY_FEE_VAT ==
                                                                                            1
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio1"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Include
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    <input
                                                                                        id={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        name={
                                                                                            "consultancy_fee_vat-" +
                                                                                            i +
                                                                                            "-" +
                                                                                            j
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            editInsurerCoverage(
                                                                                                "CONSULTANCY_FEE_VAT",
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                j
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            dIP.CONSULTANCY_FEE_VAT ==
                                                                                            0
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="radio2"
                                                                                        className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Exclude
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_ppn"
                                                                                name="CONSULTANCY_FEE_PPN"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_PPN
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_PPN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_pph"
                                                                                name="CONSULTANCY_FEE_PPH"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_PPH
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_PPH",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee_nett_amount"
                                                                                name="CONSULTANCY_FEE_NETT_AMOUNT"
                                                                                value={
                                                                                    dIP.CONSULTANCY_FEE_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "CONSULTANCY_FEE_NETT_AMOUNT",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                readOnly
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="nett_premi"
                                                                                name="NETT_PREMI"
                                                                                value={
                                                                                    dIP.NETT_PREMI
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    editInsurerCoverage(
                                                                                        "NETT_PREMI",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                        {/* End List Insurer */}
                    </>
                }
            />
            {/* end modal edit Insurer */}

            {/* modal Add Insured */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.addInsured}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    });
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                    // setDataInsurerForInsured([]);
                }}
                title={"Add Insured Nett Premium & Broker Nett Income"}
                url={`/insertManyInsured`}
                data={dataInsured}
                onSuccess={handleSuccessInsured}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        {dataInsured.map((insured: any, i: number) => (
                            <div className="mt-4 mb-4 ml-4 mr-4">
                                <div className="shadow-md border-2 mt-3">
                                    <div className=" ml-4 mr-4 mb-4 mt-3">
                                        <div className="grid grid-cols-5 mb-4">
                                            <div className="grid grid-cols-2">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="insured_name"
                                                        value="Interest Name"
                                                    />
                                                </div>
                                                <div className=" text-red-600">
                                                    *
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    id="insured_name"
                                                    type="text"
                                                    name="insured_name"
                                                    value={
                                                        insured.POLICY_INSURED_NAME
                                                    }
                                                    className=""
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        inputDataInsured(
                                                            "POLICY_INSURED_NAME",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <table className="table-auto w-full">
                                                <thead className="border-b bg-gray-50">
                                                    <tr className="text-sm font-semibold text-gray-900">
                                                        <th
                                                            colSpan={4}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Admin Cost
                                                        </th>
                                                    </tr>
                                                    <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                        <th className="text-center p-4 border ">
                                                            Full Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Nett Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="p-4 border">
                                                            <CurrencyInput
                                                                id="admin_cost"
                                                                name="ADMIN_COST"
                                                                value={
                                                                    insured.ADMIN_COST
                                                                }
                                                                decimalScale={2}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    values
                                                                ) => {
                                                                    inputDataInsured(
                                                                        "ADMIN_COST",
                                                                        values,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="p-4 border">
                                                            <CurrencyInput
                                                                id="disc_admin_cost_percentage"
                                                                name="DISC_ADMIN_COST_PERCENTAGE"
                                                                value={
                                                                    insured.DISC_ADMIN_COST_PERCENTAGE
                                                                }
                                                                decimalScale={2}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    values
                                                                ) => {
                                                                    inputDataInsured(
                                                                        "DISC_ADMIN_COST_PERCENTAGE",
                                                                        values,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="p-4 border">
                                                            <CurrencyInput
                                                                id="disc_admin_cost_amount"
                                                                name="DISC_ADMIN_COST_AMOUNT"
                                                                value={
                                                                    insured.DISC_ADMIN_COST_AMOUNT
                                                                }
                                                                decimalScale={2}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    values
                                                                ) => {
                                                                    inputDataInsured(
                                                                        "DISC_ADMIN_COST_AMOUNT",
                                                                        values,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="p-4 border">
                                                            <CurrencyInput
                                                                id="admin_cost_nett_amount"
                                                                name="ADMIN_COST_NETT_AMOUNT"
                                                                value={
                                                                    insured.ADMIN_COST_NETT_AMOUNT
                                                                }
                                                                decimalScale={2}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    values
                                                                ) => {
                                                                    inputDataInsured(
                                                                        "ADMIN_COST_NETT_AMOUNT",
                                                                        values,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                            <table className="table-auto w-full">
                                                <thead className="border-b bg-gray-50">
                                                    <tr className="text-sm font-semibold text-gray-900">
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                        >
                                                            No
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Interest Insured
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Remarks
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Coverage
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Currency
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Insurer Nett Premium
                                                        </th>
                                                        <th
                                                            colSpan={4}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Brokerage Fee
                                                        </th>
                                                        <th
                                                            colSpan={4}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Engineering Fee
                                                        </th>
                                                        <th
                                                            colSpan={4}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Consultancy Fee
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                        >
                                                            Fresnel Nett Income
                                                            Amount
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                        >
                                                            Nett Premium To
                                                            Insured
                                                        </th>
                                                    </tr>
                                                    <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                        <th className="text-center p-4 border ">
                                                            Full Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Nett Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Full Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Nett Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Full Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Disc Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Nett Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {insured.policy_insured_detail.map(
                                                        (
                                                            detail: any,
                                                            j: number
                                                        ) => (
                                                            <tr key={j}>
                                                                <td className="p-4 border">
                                                                    {j + 1}
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.INTEREST_INSURED_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "INTEREST_INSURED_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        disabled
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {interestInsured.map(
                                                                            (
                                                                                interest: any,
                                                                                s: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            s
                                                                                        }
                                                                                        value={
                                                                                            interest.INTEREST_INSURED_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            interest.INTEREST_INSURED_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <div className="block w-40 mx-auto text-left">
                                                                        <TextInput
                                                                            id="remarks"
                                                                            type="text"
                                                                            name="remarks"
                                                                            value={
                                                                                detail.REMARKS
                                                                            }
                                                                            className=""
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInsuredDetail(
                                                                                    "REMARKS",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    j
                                                                                )
                                                                            }
                                                                            readOnly
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.POLICY_COVERAGE_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "POLICY_COVERAGE_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        disabled
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                Coverage
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {dataCoverageName.map(
                                                                            (
                                                                                item: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            item.POLICY_COVERAGE_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.POLICY_COVERAGE_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.CURRENCY_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "CURRENCY_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        disabled
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                Currency
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {currencyFromCoverage.map(
                                                                            (
                                                                                currencies: any,
                                                                                k: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            k
                                                                                        }
                                                                                        value={
                                                                                            currencies.CURRENCY_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            currencies.CURRENCY_SYMBOL
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="premium_amount"
                                                                        name="PREMIUM_AMOUNT"
                                                                        value={
                                                                            detail.PREMIUM_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "PREMIUM_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="bf_full_amount"
                                                                        name="BF_FULL_AMOUNT"
                                                                        value={
                                                                            detail.BF_FULL_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "BF_FULL_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_bf_percentage"
                                                                        name="DISC_BF_PERCENTAGE"
                                                                        value={
                                                                            detail.DISC_BF_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_BF_PERCENTAGE",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_bf_amount"
                                                                        name="DISC_BF_AMOUNT"
                                                                        value={
                                                                            detail.DISC_BF_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_BF_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="bf_nett_amount"
                                                                        name="BF_NETT_AMOUNT"
                                                                        value={
                                                                            detail.BF_NETT_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "BF_NETT_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="ef_full_amount"
                                                                        name="EF_FULL_AMOUNT"
                                                                        value={
                                                                            detail.EF_FULL_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "EF_FULL_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_ef_percentage"
                                                                        name="DISC_EF_PERCENTAGE"
                                                                        value={
                                                                            detail.DISC_EF_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_EF_PERCENTAGE",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_ef_amount"
                                                                        name="DISC_EF_AMOUNT"
                                                                        value={
                                                                            detail.DISC_EF_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_EF_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="ef_nett_amount"
                                                                        name="EF_NETT_AMOUNT"
                                                                        value={
                                                                            detail.EF_NETT_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "EF_NETT_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="consultancy_fee"
                                                                        name="CONSULTANCY_FEE"
                                                                        value={
                                                                            detail.CONSULTANCY_FEE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "CONSULTANCY_FEE",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_cf_percentage"
                                                                        name="DISC_CF_PERCENTAGE"
                                                                        value={
                                                                            detail.DISC_CF_PERCENTAGE
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_CF_PERCENTAGE",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="disc_cf_amount"
                                                                        name="DISC_CF_AMOUNT"
                                                                        value={
                                                                            detail.DISC_CF_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "DISC_CF_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="cf_nett_amount"
                                                                        name="CF_NETT_AMOUNT"
                                                                        value={
                                                                            detail.CF_NETT_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "CF_NETT_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="income_nett_amount"
                                                                        name="INCOME_NETT_AMOUNT"
                                                                        value={
                                                                            detail.INCOME_NETT_AMOUNT
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "INCOME_NETT_AMOUNT",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="p-4 border">
                                                                    <CurrencyInput
                                                                        id="premium_to_insured"
                                                                        name="PREMIUM_TO_INSURED"
                                                                        value={
                                                                            detail.PREMIUM_TO_INSURED
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        onValueChange={(
                                                                            values
                                                                        ) => {
                                                                            inputInsuredDetail(
                                                                                "PREMIUM_TO_INSURED",
                                                                                values,
                                                                                i,
                                                                                j
                                                                            );
                                                                        }}
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 "></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                }
            />
            {/* end modal Add Insured  */}

            {/* Modal Edit Insured */}
            <ModalToAction
                show={modal.editInsured}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    }),
                        setDataInsurer([]);
                }}
                title={"Edit Insured Nett Premium & Broker Nett Income"}
                url={`/editInsured`}
                data={dataEditInsured}
                onSuccess={handleSuccessInsured}
                // onSuccess={""}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="mt-4 mb-4 ml-4 mr-4">
                            <div className="shadow-md border-2 mt-3">
                                <div className=" ml-4 mr-4 mb-4 mt-3">
                                    <div className="grid grid-cols-5 mb-4">
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <InputLabel
                                                    htmlFor="insured_name"
                                                    value="Insured Name"
                                                />
                                            </div>
                                            <div className=" text-red-600">
                                                *
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <TextInput
                                                id="insured_name"
                                                type="text"
                                                name="insured_name"
                                                value={
                                                    dataEditInsured.POLICY_INSURED_NAME
                                                }
                                                className=""
                                                autoComplete="off"
                                                onChange={(e) => {
                                                    setDataEditInsured({
                                                        ...dataEditInsured,
                                                        POLICY_INSURED_NAME:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <table className="table-auto w-full">
                                            <thead className="border-b bg-gray-50">
                                                <tr className="text-sm font-semibold text-gray-900">
                                                    <th
                                                        colSpan={4}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Admin Cost
                                                    </th>
                                                </tr>
                                                <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                    <th className="text-center p-4 border ">
                                                        Full Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Nett Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="p-4 border">
                                                        <CurrencyInput
                                                            id="admin_cost"
                                                            name="ADMIN_COST"
                                                            value={
                                                                dataEditInsured.ADMIN_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editDataInsured(
                                                                    "ADMIN_COST",
                                                                    values
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="p-4 border">
                                                        <CurrencyInput
                                                            id="disc_admin_cost_percentage"
                                                            name="DISC_ADMIN_COST_PERCENTAGE"
                                                            value={
                                                                dataEditInsured.DISC_ADMIN_COST_PERCENTAGE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editDataInsured(
                                                                    "DISC_ADMIN_COST_PERCENTAGE",
                                                                    values
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="p-4 border">
                                                        <CurrencyInput
                                                            id="disc_admin_cost_amount"
                                                            name="DISC_ADMIN_COST_AMOUNT"
                                                            value={
                                                                dataEditInsured.DISC_ADMIN_COST_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editDataInsured(
                                                                    "DISC_ADMIN_COST_AMOUNT",
                                                                    values
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="p-4 border">
                                                        <CurrencyInput
                                                            id="admin_cost_nett_amount"
                                                            name="ADMIN_COST_NETT_AMOUNT"
                                                            value={
                                                                dataEditInsured.ADMIN_COST_NETT_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                setDataEditInsured(
                                                                    {
                                                                        ...dataEditInsured,
                                                                        ADMIN_COST_NETT_AMOUNT:
                                                                            values,
                                                                    }
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                        <table className="table-auto w-full">
                                            <thead className="border-b bg-gray-50">
                                                <tr className="text-sm font-semibold text-gray-900">
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                    >
                                                        No
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Interest Insured
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Remarks
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Coverage
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Currency
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Insurer Nett Premium
                                                    </th>
                                                    <th
                                                        colSpan={4}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Brokerage Fee
                                                    </th>
                                                    <th
                                                        colSpan={4}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Engineering Fee
                                                    </th>
                                                    <th
                                                        colSpan={4}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Consultancy Fee
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                    >
                                                        Fresnel Nett Income
                                                        Amount
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                    >
                                                        Nett Premium To Insured
                                                    </th>
                                                </tr>
                                                <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                    <th className="text-center p-4 border ">
                                                        Full Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Nett Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Full Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Nett Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Full Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Disc Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Nett Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataEditInsured.policy_insured_detail?.map(
                                                    (
                                                        detail: any,
                                                        j: number
                                                    ) => (
                                                        <tr key={j}>
                                                            <td className="p-4 border">
                                                                {j + 1}
                                                            </td>
                                                            <td className="p-4 border">
                                                                <select
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        detail.INTEREST_INSURED_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "INTEREST_INSURED_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            j
                                                                        );
                                                                    }}
                                                                    disabled
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {interestInsured.map(
                                                                        (
                                                                            interest: any,
                                                                            s: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        s
                                                                                    }
                                                                                    value={
                                                                                        interest.INTEREST_INSURED_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        interest.INTEREST_INSURED_NAME
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="p-4 border">
                                                                <div className="block w-40 mx-auto text-left">
                                                                    <TextInput
                                                                        id="remarks"
                                                                        type="text"
                                                                        name="remarks"
                                                                        value={
                                                                            detail.REMARKS
                                                                        }
                                                                        className=""
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            editInsuredDetail(
                                                                                "REMARKS",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                j
                                                                            )
                                                                        }
                                                                        readOnly
                                                                        autoComplete="off"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-4 border">
                                                                <select
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        detail.POLICY_COVERAGE_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "POLICY_COVERAGE_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            j
                                                                        );
                                                                    }}
                                                                    disabled
                                                                >
                                                                    <option>
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                            Coverage
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {dataCoverageName.map(
                                                                        (
                                                                            item: any,
                                                                            i: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        item.POLICY_COVERAGE_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item.POLICY_COVERAGE_NAME
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="p-4 border">
                                                                <select
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        detail.CURRENCY_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "CURRENCY_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            j
                                                                        );
                                                                    }}
                                                                    disabled
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                            Currency
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {currencyFromCoverage.map(
                                                                        (
                                                                            currencies: any,
                                                                            k: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        k
                                                                                    }
                                                                                    value={
                                                                                        currencies.CURRENCY_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currencies.CURRENCY_SYMBOL
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="premium_amount"
                                                                    name="PREMIUM_AMOUNT"
                                                                    value={
                                                                        detail.PREMIUM_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "PREMIUM_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="bf_full_amount"
                                                                    name="BF_FULL_AMOUNT"
                                                                    value={
                                                                        detail.BF_FULL_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "BF_FULL_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>

                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_bf_percentage"
                                                                    name="DISC_BF_PERCENTAGE"
                                                                    value={
                                                                        detail.DISC_BF_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_BF_PERCENTAGE",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_bf_amount"
                                                                    name="DISC_BF_AMOUNT"
                                                                    value={
                                                                        detail.DISC_BF_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_BF_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="bf_nett_amount"
                                                                    name="BF_NETT_AMOUNT"
                                                                    value={
                                                                        detail.BF_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "BF_NETT_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="ef_full_amount"
                                                                    name="EF_FULL_AMOUNT"
                                                                    value={
                                                                        detail.EF_FULL_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "EF_FULL_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_ef_percentage"
                                                                    name="DISC_EF_PERCENTAGE"
                                                                    value={
                                                                        detail.DISC_EF_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_EF_PERCENTAGE",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_ef_amount"
                                                                    name="DISC_EF_AMOUNT"
                                                                    value={
                                                                        detail.DISC_EF_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_EF_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="ef_nett_amount"
                                                                    name="EF_NETT_AMOUNT"
                                                                    value={
                                                                        detail.EF_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "EF_NETT_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>

                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="consultancy_fee"
                                                                    name="CONSULTANCY_FEE"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "CONSULTANCY_FEE",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_cf_percentage"
                                                                    name="DISC_CF_PERCENTAGE"
                                                                    value={
                                                                        detail.DISC_CF_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_CF_PERCENTAGE",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="disc_cf_amount"
                                                                    name="DISC_CF_AMOUNT"
                                                                    value={
                                                                        detail.DISC_CF_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "DISC_CF_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="cf_nett_amount"
                                                                    name="CF_NETT_AMOUNT"
                                                                    value={
                                                                        detail.CF_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "CF_NETT_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="income_nett_amount"
                                                                    name="INCOME_NETT_AMOUNT"
                                                                    value={
                                                                        detail.INCOME_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "INCOME_NETT_AMOUNT",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                <CurrencyInput
                                                                    id="premium_to_insured"
                                                                    name="PREMIUM_TO_INSURED"
                                                                    value={
                                                                        detail.PREMIUM_TO_INSURED
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        editInsuredDetail(
                                                                            "PREMIUM_TO_INSURED",
                                                                            values,
                                                                            j
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="p-4 border">
                                                                {j > 0 ? (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        stroke="currentColor"
                                                                        className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                        onClick={() => {
                                                                            deleteRowEditInsuredDetail(
                                                                                j
                                                                            );
                                                                        }}
                                                                    >
                                                                        <path
                                                                            fill="#AB7C94"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M6 18 18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 "></div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Edit Insured */}

            {/* modal Edit Partners */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.editPartners}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                        editInsured: false,
                        addPartners: false,
                        editPartners: false,
                    }),
                        setDataInsurer([]);
                    setDataPolicyCoverage([]);
                    setTriggerSumIncome(0);
                    setTriggerEditSumIncome(0);
                    setDataEditNettIncome([]);
                    setGrandTotalEditNettIncome(0);
                    setRelationIdForPayable([]);
                }}
                title={"Edit Business Partners"}
                url={`/editPartners`}
                data={[
                    { listDataPartners: listDataPartners },
                    { exchangeRate: exchangeRate },
                ]}
                onSuccess={handleSuccessEditPartners}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-7xl"
                }
                body={
                    <>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                            <div className="">
                                <table className="table-auto w-full mb-4">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="w-4 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                No.
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Currency
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Exchange Rate
                                            </th>
                                            <th
                                                colSpan={2}
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Brokerage Fee
                                            </th>
                                            <th
                                                colSpan={2}
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Engineering Fee
                                            </th>
                                            <th
                                                colSpan={2}
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Consultancy Fee
                                            </th>
                                        </tr>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Init Currency
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                IDR Currency
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Init Currency
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                IDR Currency
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Init Currency
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                IDR Currency
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {exchangeRate.map(
                                            (exRate: any, i: number) => (
                                                <tr className="border-t border-gray-200">
                                                    <td className="border text-sm border-[#eee] dark:border-strokedark">
                                                        <div
                                                            className={
                                                                "block w-full mx-auto text-center"
                                                            }
                                                        >
                                                            {i + 1}
                                                        </div>
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <select
                                                            className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                exRate.CURRENCY_ID
                                                            }
                                                            disabled
                                                        >
                                                            <option>
                                                                --{" "}
                                                                <i>
                                                                    Choose
                                                                    Currency
                                                                </i>{" "}
                                                                --
                                                            </option>
                                                            {currencyFromCoverage.map(
                                                                (
                                                                    currencies: any,
                                                                    k: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                k
                                                                            }
                                                                            value={
                                                                                currencies.CURRENCY_ID
                                                                            }
                                                                        >
                                                                            {
                                                                                currencies.CURRENCY_SYMBOL
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="exchange_rate_amount"
                                                            name="EXCHANGE_RATE_AMOUNT"
                                                            value={
                                                                exRate.POLICY_EXCHANGE_RATE_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputExRate(
                                                                    "POLICY_EXCHANGE_RATE_AMOUNT",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.BF_NETT_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.BF_NETT_AMOUNT *
                                                                exRate.POLICY_EXCHANGE_RATE_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.EF_NETT_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.EF_NETT_AMOUNT *
                                                                exRate.POLICY_EXCHANGE_RATE_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.CF_NETT_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            value={
                                                                exRate.CF_NETT_AMOUNT *
                                                                exRate.POLICY_EXCHANGE_RATE_AMOUNT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            readOnly
                                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <table className="table-auto w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {/* {dataInitialForBP.map(
                                            (init: any, i: number) => (
                                                <> */}
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Type of Income{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </th>
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Payable{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </th>
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            PKS Number{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </th>
                                        <th
                                            scope="col"
                                            colSpan={6}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            <div>Brokerage Fee</div>
                                            <div>
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    dataInitialForBP.BF_NETT_AMOUNT
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            colSpan={6}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            <div>Engineering Fee</div>
                                            <div>
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    dataInitialForBP.EF_NETT_AMOUNT
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            colSpan={6}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            <div>Consultancy Fee</div>
                                            <div>
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    dataInitialForBP.CF_NETT_AMOUNT
                                                )}
                                            </div>
                                        </th>

                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Action
                                        </th>
                                        {/* </>
                                            )
                                        )} */}
                                    </tr>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            VAT
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPn
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPh
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Nett Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            VAT
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPn
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPh
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Nett Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            VAT
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPn
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            PPh
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Nett Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {listDataPartners.map(
                                        (editPartner: any, i: number) => (
                                            <Fragment
                                                key={
                                                    editPartner.INCOME_CATEGORY_ID
                                                }
                                            >
                                                <tr className="border-t border-gray-200">
                                                    <th
                                                        scope="colgroup"
                                                        colSpan={9}
                                                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                    >
                                                        <td className="text-left w-40">
                                                            {
                                                                editPartner.INCOME_NAME
                                                            }{" "}
                                                            <span className="text-red-600">
                                                                *
                                                            </span>
                                                        </td>
                                                        <td className="text-left w-32">
                                                            <a
                                                                href=""
                                                                className="text-xs mt-1 text-primary ms-1"
                                                                onClick={(e) =>
                                                                    addRowEditPartners(
                                                                        e,
                                                                        editPartner.INCOME_CATEGORY_ID,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                + Add Row
                                                            </a>
                                                        </td>
                                                    </th>
                                                </tr>
                                                {editPartner.income_detail.map(
                                                    (
                                                        detail: any,
                                                        detailIdx: number
                                                    ) => (
                                                        <tr
                                                            key={detailIdx}
                                                            className={
                                                                detailIdx === 0
                                                                    ? "border-gray-300"
                                                                    : "border-gray-200"
                                                            }
                                                        >
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-3 border-[1px]">
                                                                {editPartner.INCOME_CATEGORY_ID ==
                                                                2 ? (
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.RELATION_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputDataEditIncome(
                                                                                "RELATION_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                detailIdx
                                                                            ),
                                                                                getPksNumber(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                Agent
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {listAgent.map(
                                                                            (
                                                                                item: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            item.RELATION_ORGANIZATION_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.RELATION_ORGANIZATION_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                ) : editPartner.INCOME_CATEGORY_ID ==
                                                                  3 ? (
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.RELATION_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputDataEditIncome(
                                                                                "RELATION_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                detailIdx
                                                                            );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                BAA
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {listBAA.map(
                                                                            (
                                                                                item: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            item.RELATION_ORGANIZATION_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.RELATION_ORGANIZATION_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                ) : (
                                                                    <select
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            detail.RELATION_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            inputDataEditIncome(
                                                                                "RELATION_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                detailIdx
                                                                            ),
                                                                                getPksNumber(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --{" "}
                                                                            <i>
                                                                                Choose
                                                                                FBI
                                                                                PKS
                                                                            </i>{" "}
                                                                            --
                                                                        </option>
                                                                        {listFbiPks.map(
                                                                            (
                                                                                item: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            item.RELATION_ORGANIZATION_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.RELATION_ORGANIZATION_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-3 border-[1px]">
                                                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "payable-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "payable-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "PAYABLE",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.PAYABLE ==
                                                                                1
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio1"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            By
                                                                            Fresnel
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "payable-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "payable-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "PAYABLE",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.PAYABLE ==
                                                                                0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio2"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            By
                                                                            Agent
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-3 border-[1px]">
                                                                <select
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                    value={
                                                                        detail.M_PKS_RELATION_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "M_PKS_RELATION_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        --{" "}
                                                                        <i>
                                                                            Choose
                                                                            PKS
                                                                            Numbers
                                                                        </i>{" "}
                                                                        --
                                                                    </option>
                                                                    {listAgent
                                                                        ?.filter(
                                                                            (
                                                                                list: any
                                                                            ) =>
                                                                                list.RELATION_ORGANIZATION_ID ==
                                                                                detail.RELATION_ID
                                                                        )
                                                                        .map(
                                                                            (
                                                                                result: any,
                                                                                i: number
                                                                            ) => {
                                                                                return result.pks_number?.map(
                                                                                    (
                                                                                        hasil: any,
                                                                                        a: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    a
                                                                                                }
                                                                                                value={
                                                                                                    hasil?.M_PKS_RELATION_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    hasil?.NO_PKS
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        )}
                                                                </select>
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                <CurrencyInput
                                                                    id="brokerage_fee_percentage"
                                                                    name="BROKERAGE_FEE_PERCENTAGE"
                                                                    value={
                                                                        detail.BROKERAGE_FEE_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "BROKERAGE_FEE_PERCENTAGE",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                <CurrencyInput
                                                                    id="brokerage_fee_amount"
                                                                    name="BROKERAGE_FEE_AMOUNT"
                                                                    value={
                                                                        detail.BROKERAGE_FEE_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "BROKERAGE_FEE_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "brokerage_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "brokerage_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "BROKERAGE_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.BROKERAGE_FEE_VAT ==
                                                                                1
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio1"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Include
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "radio_vat_bf_partner-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "brokerage_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "BROKERAGE_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.BROKERAGE_FEE_VAT ==
                                                                                0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio2"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Exclude
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="brokerage_fee_ppn"
                                                                    name="BROKERAGE_FEE_PPN"
                                                                    value={
                                                                        detail.BROKERAGE_FEE_PPN
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "BROKERAGE_FEE_PPN",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="brokerage_fee_pph"
                                                                    name="BROKERAGE_FEE_PPH"
                                                                    value={
                                                                        detail.BROKERAGE_FEE_PPH
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "BROKERAGE_FEE_PPH",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="brokerage_fee_pph_nett_amount"
                                                                    name="BROKERAGE_FEE_NETT_AMOUNT"
                                                                    value={
                                                                        detail.BROKERAGE_FEE_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "BROKERAGE_FEE_NETT_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-[1px]">
                                                                <CurrencyInput
                                                                    id="engineering_fee_percentage"
                                                                    name="ENGINEERING_FEE_PERCENTAGE"
                                                                    value={
                                                                        detail.ENGINEERING_FEE_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "ENGINEERING_FEE_PERCENTAGE",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                <CurrencyInput
                                                                    id="engineering_fee_amount"
                                                                    name="ENGINEERING_FEE_AMOUNT"
                                                                    value={
                                                                        detail.ENGINEERING_FEE_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "ENGINEERING_FEE_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "engineering_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "engineering_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "ENGINEERING_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.ENGINEERING_FEE_VAT ==
                                                                                1
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio1"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Include
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "engineering_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "engineering_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "ENGINEERING_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.ENGINEERING_FEE_VAT ==
                                                                                0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio2"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Exclude
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="engineering_fee_ppn"
                                                                    name="ENGINEERING_FEE_PPN"
                                                                    value={
                                                                        detail.ENGINEERING_FEE_PPN
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "ENGINEERING_FEE_PPN",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="engineering_fee_pph"
                                                                    name="ENGINEERING_FEE_PPH"
                                                                    value={
                                                                        detail.ENGINEERING_FEE_PPH
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "ENGINEERING_FEE_PPH",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="engineering_fee_nett_amount"
                                                                    name="ENGINEERING_FEE_NETT_AMOUNT"
                                                                    value={
                                                                        detail.ENGINEERING_FEE_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "ENGINEERING_FEE_NETT_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-[1px]">
                                                                <CurrencyInput
                                                                    id="consultancy_fee_percentage"
                                                                    name="CONSULTANCY_FEE_PERCENTAGE"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE_PERCENTAGE
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "CONSULTANCY_FEE_PERCENTAGE",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                <CurrencyInput
                                                                    id="consultancy_fee_amount"
                                                                    name="CONSULTANCY_FEE_AMOUNT"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "CONSULTANCY_FEE_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "consultancy_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "consultancy_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "CONSULTANCY_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.CONSULTANCY_FEE_VAT ==
                                                                                1
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio1"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Include
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={
                                                                                "consultancy_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            name={
                                                                                "consultancy_fee_vat-" +
                                                                                i +
                                                                                "-" +
                                                                                detailIdx
                                                                            }
                                                                            type="radio"
                                                                            value={
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDataEditIncome(
                                                                                    "CONSULTANCY_FEE_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i,
                                                                                    detailIdx
                                                                                )
                                                                            }
                                                                            checked={
                                                                                detail.CONSULTANCY_FEE_VAT ==
                                                                                0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                        />
                                                                        <label
                                                                            htmlFor="radio2"
                                                                            className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Exclude
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="consultancy_fee_ppn"
                                                                    name="CONSULTANCY_FEE_PPN"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE_PPN
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "CONSULTANCY_FEE_PPN",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="consultancy_fee_pph"
                                                                    name="CONSULTANCY_FEE_PPH"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE_PPH
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "CONSULTANCY_FEE_PPH",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                <CurrencyInput
                                                                    id="consultancy_fee_nett_amount"
                                                                    name="CONSULTANCY_FEE_NETT_AMOUNT"
                                                                    value={
                                                                        detail.CONSULTANCY_FEE_NETT_AMOUNT
                                                                    }
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    decimalsLimit={
                                                                        2
                                                                    }
                                                                    onValueChange={(
                                                                        values
                                                                    ) => {
                                                                        inputDataEditIncome(
                                                                            "CONSULTANCY_FEE_NETT_AMOUNT",
                                                                            values,
                                                                            i,
                                                                            detailIdx
                                                                        );
                                                                    }}
                                                                    className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                {detailIdx >
                                                                0 ? (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        stroke="currentColor"
                                                                        className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                        onClick={() => {
                                                                            deleteRowEditIncome(
                                                                                i,
                                                                                detailIdx
                                                                            );
                                                                            setTriggerEditSumIncome(
                                                                                triggerEditSumIncome +
                                                                                    1
                                                                            );
                                                                        }}
                                                                    >
                                                                        <path
                                                                            fill="#AB7C94"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M6 18 18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </Fragment>
                                        )
                                    )}
                                    {dataEditNettIncome?.map(
                                        (nett: any, x: number) => (
                                            <tr
                                                key={x}
                                                className={
                                                    "border-gray-200 bg-teal-500 text-white"
                                                }
                                            >
                                                <th
                                                    colSpan={3}
                                                    scope="colgroup"
                                                    className=" py-2 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3"
                                                >
                                                    Nett Margin
                                                </th>

                                                <td
                                                    colSpan={6}
                                                    className=" relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettBf)}
                                                </td>

                                                <td
                                                    colSpan={6}
                                                    className=" relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettEf)}
                                                </td>

                                                <td
                                                    colSpan={6}
                                                    className=" relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettCf)}
                                                </td>
                                                <td className=" relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"></td>
                                            </tr>
                                        )
                                    )}

                                    {/* Gran Total */}
                                    {grandTotalEditNettIncome != 0 ? (
                                        <tr
                                            key={1}
                                            className={
                                                "border-gray-200 bg-teal-500"
                                            }
                                        >
                                            <th
                                                colSpan={3}
                                                scope="colgroup"
                                                className=" border-[1px] py-2 pl-4 pr-3 text-left text-sm text-white font-semibold  sm:pl-3"
                                            >
                                                Grand Total Nett Margin
                                            </th>
                                            <td
                                                colSpan={18}
                                                className=" relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-white text-sm font-medium sm:pr-3"
                                            >
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    grandTotalEditNettIncome
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        ""
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* end modal Edit Partners  */}

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-1">
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="w-60">
                                <InputLabel value="Self Insured" />

                                <div className="grid grid-cols-5">
                                    <div className="">
                                        <SwitchPage
                                            enabled={switchCoBroking}
                                            onChangeButton={handleSwitchCoBroking}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4 mb-8">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>Co Broking Participant</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleAddCoBroking(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Update Co Broking
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full mt-4 align-middle"></div>
                            </div>

                            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>Coverage</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleAddCoverage(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Add Coverage
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full mt-4 align-middle">
                                    {dataCoverageName.map(
                                        (name: any, i: number) => (
                                            <Collapsible
                                                label={
                                                    name.POLICY_COVERAGE_NAME
                                                }
                                            >
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                                        onClick={() => {
                                                            handleEditCoverage(
                                                                name.POLICY_COVERAGE_ID
                                                            );
                                                        }}
                                                    >
                                                        Edit Coverage
                                                    </button>
                                                </div>
                                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                                    <table className="table-auto w-full">
                                                        <thead className="border-b bg-gray-50">
                                                            <tr className="text-sm font-semibold text-gray-900">
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                                >
                                                                    No.
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Interest
                                                                    Insured
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Remarks
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Currency
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Sum Insured
                                                                </th>
                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Gross
                                                                    Premium
                                                                </th>

                                                                <th
                                                                    colSpan={3}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Loss Limit
                                                                    Premium
                                                                </th>

                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Insurance
                                                                    Discount
                                                                </th>

                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Coverage
                                                                    Premium
                                                                </th>
                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Deposit
                                                                    Premium
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300"
                                                                >
                                                                    Delete
                                                                </th>
                                                            </tr>
                                                            <tr className="text-sm font-semibold text-gray-900">
                                                                <th className="text-center p-4 border">
                                                                    Rate %
                                                                </th>
                                                                <th className="text-center p-4 border">
                                                                    Amount
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center p-4 border"
                                                                >
                                                                    %
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center p-4 border"
                                                                >
                                                                    Scale %
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center p-4 border"
                                                                >
                                                                    Amount
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center p-4 border"
                                                                >
                                                                    %
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center p-4 border"
                                                                >
                                                                    Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Amount
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                            {name.policy_coverage_detail.map(
                                                                (
                                                                    detail: any,
                                                                    j: number
                                                                ) => (
                                                                    <tr key={j}>
                                                                        <td className="p-4 border text-center">
                                                                            {j +
                                                                                1}
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600">
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                {getInterestInsuredById(
                                                                                    detail.INTEREST_INSURED_ID
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600">
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                {
                                                                                    detail.REMARKS
                                                                                }
                                                                            </div>
                                                                        </td>

                                                                        <td className="p-4 border text-sm font-medium text-gray-600">
                                                                            {getCurrencyById(
                                                                                detail.CURRENCY_ID
                                                                            )}
                                                                        </td>

                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.SUM_INSURED
                                                                            )}
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-center">
                                                                            <div className="block w-20 mx-auto">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                        maximumFractionDigits: 6,
                                                                                    }
                                                                                ).format(
                                                                                    detail.RATE
                                                                                ) +
                                                                                    " %"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.GROSS_PREMIUM
                                                                            )}
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-center">
                                                                            <div className="block w-20 mx-auto">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.LOST_LIMIT_PERCENTAGE
                                                                                ) +
                                                                                    " %"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            <div className="block w-20 mx-auto">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.LOST_LIMIT_SCALE
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.LOST_LIMIT_AMOUNT
                                                                            )}
                                                                        </td>

                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-center">
                                                                            <div className="block w-20 mx-auto">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.INSURANCE_DISC_PERCENTAGE
                                                                                ) +
                                                                                    " %"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.INSURANCE_DISC_AMOUNT
                                                                            )}
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.PREMIUM
                                                                            )}
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-center">
                                                                            <div className="block w-20 mx-auto">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.DEPOSIT_PREMIUM_PERCENTAGE
                                                                                ) +
                                                                                    " %"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border text-sm font-medium text-gray-600 text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                detail.DEPOSIT_PREMIUM_AMOUNT
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Collapsible>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4 mt-8">
                                <div className="">
                                    <h3 className="text-xl font-semibold leading-6 text-gray-900  mr-4 mb-3 w-fit border-b-2">
                                        Insurer
                                    </h3>
                                </div>
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        className="mt-3 mr-4 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            handleAddInsurer();
                                        }}
                                    >
                                        Add Insurer
                                    </button>
                                    {insurancePanels.length > 0 ? (
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                handleEditInsurer();
                                            }}
                                        >
                                            Edit Insurer
                                        </button>
                                    ) : (
                                        ""
                                    )}

                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        {isLoading.get_detail ? (
                                            <div className="flex justify-center items-center sweet-loading h-[199px]">
                                                <BeatLoader
                                                    // cssOverride={override}
                                                    size={10}
                                                    color={"#ff4242"}
                                                    loading={true}
                                                    speedMultiplier={1.5}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                />
                                            </div>
                                        ) : (
                                            <table className="min-w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0 border border-gray-30 text-center"
                                                        >
                                                            No.
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border border-gray-30"
                                                        >
                                                            Insurer
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border border-gray-30"
                                                        >
                                                            Share
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border border-gray-30"
                                                        >
                                                            Is Leader
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border border-gray-30"
                                                        >
                                                            Policy Cost
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {insurancePanels.map(
                                                        (
                                                            val: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 border border-gray-30 text-center">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
                                                                    {
                                                                        val
                                                                            .insurance
                                                                            .RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30 text-right">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        val.IP_POLICY_SHARE
                                                                    ) + " %"}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
                                                                    {val.IP_POLICY_LEADER ==
                                                                    1
                                                                        ? "Co Leader"
                                                                        : "Co Member"}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30 text-right">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        val.POLICY_COST
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4 mt-8">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>
                                        Insured Nett Premium & Broker Nett
                                        Income
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleAddInsured(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Add Interest Insured
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full mt-4 align-middle">
                                    {dataInsuredView.map(
                                        (insuredView: any, i: number) => (
                                            <Collapsible
                                                label={
                                                    insuredView.POLICY_INSURED_NAME
                                                }
                                            >
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                                        onClick={() => {
                                                            handleEditInsured(
                                                                insuredView.POLICY_INSURED_ID
                                                            );
                                                        }}
                                                    >
                                                        Edit Interest Insured
                                                    </button>
                                                </div>
                                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                                    <table className="table-auto w-full">
                                                        <thead className="border-b bg-gray-50">
                                                            <tr className="text-sm font-semibold text-gray-900">
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                                >
                                                                    No
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Interest
                                                                    Insured
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Remarks
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Coverage
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Currency
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Insurer Nett
                                                                    Premium
                                                                </th>
                                                                <th
                                                                    colSpan={4}
                                                                    className="text-center p-4 border border-t-0 border-gray-300"
                                                                >
                                                                    Brokerage
                                                                    Fee
                                                                </th>
                                                                <th
                                                                    colSpan={4}
                                                                    className="text-center p-4 border border-t-0 border-gray-300"
                                                                >
                                                                    Engineering
                                                                    Fee
                                                                </th>
                                                                <th
                                                                    colSpan={4}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Consultancy
                                                                    Fee
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                                >
                                                                    Income
                                                                    Amount
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                                >
                                                                    Nett Premium
                                                                    To Insured
                                                                </th>
                                                            </tr>
                                                            <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                                <th className="text-center p-4 border ">
                                                                    Full Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Nett Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Full Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Nett Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Full Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Disc Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Nett Amount
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {insuredView.policy_insured_detail.map(
                                                                (
                                                                    detail: any,
                                                                    j: number
                                                                ) => (
                                                                    <tr key={j}>
                                                                        <td className="p-4 border text-center">
                                                                            {j +
                                                                                1}
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <select
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    detail.INTEREST_INSURED_ID
                                                                                }
                                                                                disabled
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        ""
                                                                                    }
                                                                                >
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {interestInsured.map(
                                                                                    (
                                                                                        interest: any,
                                                                                        s: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    s
                                                                                                }
                                                                                                value={
                                                                                                    interest.INTEREST_INSURED_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    interest.INTEREST_INSURED_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                <TextInput
                                                                                    id="remarks"
                                                                                    type="text"
                                                                                    name="remarks"
                                                                                    value={
                                                                                        detail.REMARKS
                                                                                    }
                                                                                    className=""
                                                                                    readOnly
                                                                                    autoComplete="off"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <select
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    detail.POLICY_COVERAGE_ID
                                                                                }
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Coverage
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {coverageName.map(
                                                                                    (
                                                                                        item: any,
                                                                                        i: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                value={
                                                                                                    item.POLICY_COVERAGE_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.POLICY_COVERAGE_NAME
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <select
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                value={
                                                                                    detail.CURRENCY_ID
                                                                                }
                                                                                disabled
                                                                            >
                                                                                <option>
                                                                                    --{" "}
                                                                                    <i>
                                                                                        Choose
                                                                                        Currency
                                                                                    </i>{" "}
                                                                                    --
                                                                                </option>
                                                                                {currency.map(
                                                                                    (
                                                                                        item: any,
                                                                                        i: number
                                                                                    ) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                value={
                                                                                                    item.CURRENCY_ID
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.CURRENCY_SYMBOL
                                                                                                }
                                                                                            </option>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="premium_amount"
                                                                                name="PREMIUM_AMOUNT"
                                                                                value={
                                                                                    detail.PREMIUM_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="bf_full_amount"
                                                                                name="BF_FULL_AMOUNT"
                                                                                value={
                                                                                    detail.BF_FULL_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_bf_percentage"
                                                                                name="DISC_BF_PERCENTAGE"
                                                                                value={
                                                                                    detail.DISC_BF_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_bf_amount"
                                                                                name="DISC_BF_AMOUNT"
                                                                                value={
                                                                                    detail.DISC_BF_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="bf_nett_amount"
                                                                                name="BF_NETT_AMOUNT"
                                                                                value={
                                                                                    detail.BF_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="ef_full_amount"
                                                                                name="EF_FULL_AMOUNT"
                                                                                value={
                                                                                    detail.EF_FULL_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_ef_percentage"
                                                                                name="DISC_EF_PERCENTAGE"
                                                                                value={
                                                                                    detail.DISC_EF_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_ef_amount"
                                                                                name="DISC_EF_AMOUNT"
                                                                                value={
                                                                                    detail.DISC_EF_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="ef_nett_amount"
                                                                                name="EF_NETT_AMOUNT"
                                                                                value={
                                                                                    detail.EF_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee"
                                                                                name="CONSULTANCY_FEE"
                                                                                value={
                                                                                    detail.CONSULTANCY_FEE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_cf_percentage"
                                                                                name="DISC_CF_PERCENTAGE"
                                                                                value={
                                                                                    detail.DISC_CF_PERCENTAGE
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="disc_cf_amount"
                                                                                name="DISC_CF_AMOUNT"
                                                                                value={
                                                                                    detail.DISC_CF_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="cf_nett_amount"
                                                                                name="CF_NETT_AMOUNT"
                                                                                value={
                                                                                    detail.CF_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="income_nett_amount"
                                                                                name="INCOME_NETT_AMOUNT"
                                                                                value={
                                                                                    detail.INCOME_NETT_AMOUNT
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 border">
                                                                            <CurrencyInput
                                                                                id="premium_to_insured"
                                                                                name="PREMIUM_TO_INSURED"
                                                                                value={
                                                                                    detail.PREMIUM_TO_INSURED
                                                                                }
                                                                                decimalScale={
                                                                                    2
                                                                                }
                                                                                decimalsLimit={
                                                                                    2
                                                                                }
                                                                                readOnly
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Collapsible>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Partners */}
                            <div className="bg-white shadow-md rounded-md mt-6 p-4 max-w-full ml-4">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>Business Partners</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleEditPartners(
                                                    policy.POLICY_ID
                                                );
                                                // setTriggerEditSumIncome(
                                                //     triggerEditSumIncome + 1
                                                // );
                                            }}
                                        >
                                            Edit Business Partners
                                        </button>
                                    </div>
                                </div>
                                {listDataPartners.length > 0 ? (
                                    <div className="w-full mt-4 align-middle">
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                            <table className="table-auto w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            rowSpan={2}
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                        >
                                                            Type of Income
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Brokerage Fee
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Engineering Fee
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Consultancy Fee
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                        >
                                                            Admin Cost
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white">
                                                    {listDataPartners.map(
                                                        (
                                                            dataPartner: any,
                                                            i: number
                                                        ) => (
                                                            <Fragment
                                                                key={
                                                                    dataPartner.INCOME_CATEGORY_ID
                                                                }
                                                            >
                                                                <tr className="border-t border-gray-200">
                                                                    <th
                                                                        scope="colgroup"
                                                                        colSpan={
                                                                            9
                                                                        }
                                                                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                                    >
                                                                        <td className="text-left w-40">
                                                                            {
                                                                                dataPartner.INCOME_NAME
                                                                            }
                                                                        </td>
                                                                        <td className="text-left w-32"></td>
                                                                    </th>
                                                                </tr>
                                                                {dataPartner.income_detail.map(
                                                                    (
                                                                        detail: any,
                                                                        detailIdx: number
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                detailIdx
                                                                            }
                                                                            className={
                                                                                detailIdx ===
                                                                                0
                                                                                    ? "border-gray-300"
                                                                                    : "border-gray-200"
                                                                            }
                                                                        >
                                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-3 border-[1px]">
                                                                                <div className="block w-40 mx-auto text-left">
                                                                                    {dataPartner.INCOME_CATEGORY_ID ==
                                                                                    2 ? (
                                                                                        <select
                                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                            value={
                                                                                                detail.RELATION_ID
                                                                                            }
                                                                                            disabled
                                                                                        >
                                                                                            <option
                                                                                                value={
                                                                                                    ""
                                                                                                }
                                                                                            >
                                                                                                --{" "}
                                                                                                <i>
                                                                                                    Choose
                                                                                                    Agent
                                                                                                </i>{" "}
                                                                                                --
                                                                                            </option>
                                                                                            {listAgent.map(
                                                                                                (
                                                                                                    item: any,
                                                                                                    i: number
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <option
                                                                                                            key={
                                                                                                                i
                                                                                                            }
                                                                                                            value={
                                                                                                                item.RELATION_ORGANIZATION_ID
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                item.RELATION_ORGANIZATION_NAME
                                                                                                            }
                                                                                                        </option>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </select>
                                                                                    ) : dataPartner.INCOME_CATEGORY_ID ==
                                                                                      3 ? (
                                                                                        <select
                                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                            value={
                                                                                                detail.PERSON_ID
                                                                                            }
                                                                                            disabled
                                                                                        >
                                                                                            <option
                                                                                                value={
                                                                                                    ""
                                                                                                }
                                                                                            >
                                                                                                --{" "}
                                                                                                <i>
                                                                                                    Choose
                                                                                                    BAA
                                                                                                </i>{" "}
                                                                                                --
                                                                                            </option>
                                                                                            {listBAA.map(
                                                                                                (
                                                                                                    item: any,
                                                                                                    i: number
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <option
                                                                                                            key={
                                                                                                                i
                                                                                                            }
                                                                                                            value={
                                                                                                                item.PERSON_ID
                                                                                                            }
                                                                                                        >
                                                                                                            {item.PERSON_FIRST_NAME +
                                                                                                                (item.PERSON_MIDDLE_NAME ==
                                                                                                                null
                                                                                                                    ? ""
                                                                                                                    : " " +
                                                                                                                      item.PERSON_MIDDLE_NAME) +
                                                                                                                (item.PERSON_LAST_NAME ==
                                                                                                                null
                                                                                                                    ? ""
                                                                                                                    : " " +
                                                                                                                      item.PERSON_LAST_NAME)}
                                                                                                        </option>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </select>
                                                                                    ) : (
                                                                                        <select
                                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                            value={
                                                                                                detail.RELATION_ID
                                                                                            }
                                                                                            disabled
                                                                                        >
                                                                                            <option
                                                                                                value={
                                                                                                    ""
                                                                                                }
                                                                                            >
                                                                                                --{" "}
                                                                                                <i>
                                                                                                    Choose
                                                                                                    FBI
                                                                                                    PKS
                                                                                                </i>{" "}
                                                                                                --
                                                                                            </option>
                                                                                            {listFbiPks.map(
                                                                                                (
                                                                                                    item: any,
                                                                                                    i: number
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <option
                                                                                                            key={
                                                                                                                i
                                                                                                            }
                                                                                                            value={
                                                                                                                item.RELATION_ORGANIZATION_ID
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                item.RELATION_ORGANIZATION_NAME
                                                                                                            }
                                                                                                        </option>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </select>
                                                                                        // <div className="block w-40 mx-auto text-left">
                                                                                        //     <TextInput
                                                                                        //         id="name"
                                                                                        //         type="text"
                                                                                        //         name="name"
                                                                                        //         value={
                                                                                        //             detail.PARTNER_NAME
                                                                                        //         }
                                                                                        //         readOnly
                                                                                        //     />
                                                                                        // </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.BROKERAGE_FEE_PERCENTAGE
                                                                                )}
                                                                            </td>
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.BROKERAGE_FEE_AMOUNT
                                                                                )}
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.ENGINEERING_FEE_PERCENTAGE
                                                                                )}
                                                                            </td>
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.ENGINEERING_FEE_AMOUNT
                                                                                )}
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.CONSULTANCY_FEE_PERCENTAGE
                                                                                )}
                                                                            </td>
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    detail.CONSULTANCY_FEE_AMOUNT
                                                                                )}
                                                                            </td>
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]"></td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </Fragment>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            {/* End Partners */}
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}
                </dl>
            </div>
        </>
        // </AuthenticatedLayout>
    );
}
