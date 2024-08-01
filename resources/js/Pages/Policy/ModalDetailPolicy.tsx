import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
// import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
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
import ModalInsured from "./ModalInsured";
// import Collapsible from "react-collapsible";

export default function ModalDetailPolicy({
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
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [currencyFromCoverage, setCurrencyFromCoverage] = useState<any>([]);
    const [dataById, setDataById] = useState<any>(policy);
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [sumByCurrency, setSumByCurrency] = useState<any>([]);
    const [dataInsurer, setDataInsurer] = useState<any>([]);
    const [dataEditInsurer, setDataEditInsurer] = useState<any>([]);
    const [flagDelete, setFlagDelete] = useState<number>(0);
    const [triggerSumIncome, setTriggerSumIncome] = useState<number>(0);
    const [triggerEditSumIncome, setTriggerEditSumIncome] = useState<number>(0);
    const [coverageName, setCoverageName] = useState<any>([]);
    const [dataCoverageName, setDataCoverageName] = useState<any>([]);
    const [dataPolicyCoverage, setDataPolicyCoverage] = useState<any>([]);
    // const { insurance, insuranceType, policyStatus, currency }: any =
    //     usePage().props;

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
    ];

    const locations = [
        {
            name: "FBI by PKS",
            people: [
                {
                    name: "Lindsay Walton",
                    title: "Front-end Developer",
                    email: "lindsay.walton@example.com",
                    role: "Member",
                },
                {
                    name: "Courtney Henry",
                    title: "Designer",
                    email: "courtney.henry@example.com",
                    role: "Admin",
                },
            ],
        },
        {
            name: "Agent Commission",
            people: [
                {
                    name: "Lindsay Walton",
                    title: "Front-end Developer",
                    email: "lindsay.walton@example.com",
                    role: "Member",
                },
                {
                    name: "Courtney Henry",
                    title: "Designer",
                    email: "courtney.henry@example.com",
                    role: "Admin",
                },
            ],
        },
        {
            name: "Acquisition Cost",
            people: [
                {
                    name: "Lindsay Walton",
                    title: "Front-end Developer",
                    email: "lindsay.walton@example.com",
                    role: "Member",
                },
                {
                    name: "Courtney Henry",
                    title: "Designer",
                    email: "courtney.henry@example.com",
                    role: "Admin",
                },
                {
                    name: "Courtney Henry",
                    title: "Designer",
                    email: "courtney.henry@example.com",
                    role: "Admin",
                },
            ],
        },
        // More people...
    ];

    const [collapse, setCollapse] = useState<any>({
        policy: false,
        claim_detail: false,
    });
    const [open, setOPen] = useState(false);

    useEffect(() => {
        getInsurancePanel(policy.POLICY_ID);
        getCoverageNameByPolicyId(policy.POLICY_ID);
        getDataCoverageName(policy.POLICY_ID);
        getDataInsured(policy.POLICY_ID);
        getSummaryPremi();
        getCurrencyOnPolicyCoverage(policy.POLICY_ID);
        getDataPartner(policy.POLICY_ID);
        // setFlagSwitch(policy.SELF_INSURED? true:false)
    }, [policy.POLICY_ID]);

    const getCurrencyOnPolicyCoverage = async (id: number) => {
        await axios
            .get(`/getCurrencyOnPolicyCoverage/${id}`)
            .then((res) => setCurrencyFromCoverage(res.data))
            .catch((err) => console.log(err));
    };

    const getInsurancePanel = async (id: number) => {
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setInsurancePanels(res.data))
            .catch((err) => console.log(err));
    };

    const getSummaryPremi = () => {
        // const dataToGroup = dataById.policy_premium;
        const dataToGroup: any = [...dataById.policy_premium];

        const groupBy = (data: any, keys: any) => {
            return Object.values(
                data.reduce((acc: any, val: any) => {
                    const currency_id = keys.reduce(
                        (finalName: any, key: any) => finalName + val[key],
                        ""
                    );
                    if (acc[currency_id]) {
                        acc[currency_id].values.push(
                            val.NETT_PREMI ? val.NETT_PREMI : 0
                        );
                        acc[currency_id].sum += val.NETT_PREMI
                            ? val.NETT_PREMI
                            : 0;
                        acc[currency_id].sum_gross_premi += val.GROSS_PREMI
                            ? val.GROSS_PREMI
                            : 0;
                        acc[currency_id].sum_admin_cost += val.ADMIN_COST
                            ? val.ADMIN_COST
                            : 0;
                        acc[currency_id].sum_disc_broker += val.DISC_BROKER
                            ? val.DISC_BROKER
                            : 0;
                        acc[currency_id].sum_disc_consultation +=
                            val.DISC_CONSULTATION ? val.DISC_CONSULTATION : 0;
                        acc[currency_id].sum_disc_admin += val.DISC_ADMIN
                            ? val.DISC_ADMIN
                            : 0;
                        acc[currency_id].sum_fee_based_income +=
                            val.FEE_BASE_INCOME ? val.FEE_BASE_INCOME : 0;
                        acc[currency_id].sum_agent_commision +=
                            val.AGENT_COMMISION ? val.AGENT_COMMISION : 0;
                        acc[currency_id].sum_acquisition_cost +=
                            val.ACQUISITION_COST ? val.ACQUISITION_COST : 0;
                    } else {
                        acc[currency_id] = {
                            currency_id,
                            sum: val.NETT_PREMI ? val.NETT_PREMI : 0,
                            sum_gross_premi: val.GROSS_PREMI
                                ? val.GROSS_PREMI
                                : 0,
                            sum_admin_cost: val.ADMIN_COST ? val.ADMIN_COST : 0,
                            sum_disc_broker: val.DISC_BROKER
                                ? val.DISC_BROKER
                                : 0,
                            sum_disc_consultation: val.DISC_CONSULTATION
                                ? val.DISC_CONSULTATION
                                : 0,
                            sum_disc_admin: val.DISC_ADMIN ? val.DISC_ADMIN : 0,
                            sum_fee_based_income: val.FEE_BASE_INCOME
                                ? val.FEE_BASE_INCOME
                                : 0,
                            sum_agent_commision: val.AGENT_COMMISION
                                ? val.AGENT_COMMISION
                                : 0,
                            sum_acquisition_cost: val.ACQUISITION_COST
                                ? val.ACQUISITION_COST
                                : 0,
                            values: [val.NETT_PREMI ? val.NETT_PREMI : 0],
                        };
                    }
                    return acc;
                }, {})
            );
        };
        setSumByCurrency(groupBy(dataToGroup, ["CURRENCY_ID"]));
    };

    const getCoverageNameByPolicyId = async (policy_id: number) => {
        await axios
            .get(`/getCoverageByPolicyId/${policy_id}`)
            .then((res) => setCoverageName(res.data))
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
        editPartners: false
    });

    const getCurrencyById = (currId: any) => {
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result.CURRENCY_SYMBOL : null;
    };

    // Add Policy Coverage

    const fieldDataCoverage: any = {
        POLICY_ID: "",
        POLICY_COVERAGE_NAME: "",
        policy_coverage_detail: [
            {
                POLICY_COVERAGE_ID: "",
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
            },
        ],
    };

    const handleAddCoverage = async (policy_id: any) => {
        // const items = { ...fieldDataCoverage, POLICY_ID: policy_id };
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
            editPartners: false
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
        // e.preventDefault();
        // const id = policy.id;
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
            editPartners: false
        });
    };

    const editPolicyCoverage = (i: number, value: string) => {
        const items = [...dataEditPolicyCoverage];
        const item = { ...items[i] };
        item.POLICY_COVERAGE_NAME = value;
        items[i] = item;
        setDataEditPolicyCoverage(items);
    };

    const editCoverageDetail = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [
            ...dataEditPolicyCoverage.policy_coverage_detail,
        ];
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
                // alert("a");
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
                // alert("b");
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
        // e.preventDefault();
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);
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
            editPartners: false
        });
    };
    const fieldDataInsurer: any = {
        INSURANCE_ID: "",
        POLICY_ID: policy.POLICY_ID,
        IP_POLICY_SHARE: "",
        IP_POLICY_LEADER: 0,
        POLICY_COST: 0,
        premium: [
            // {
            //     CURRENCY_ID: "",
            //     COVERAGE_NAME: "",
            //     GROSS_PREMI: 0,
            //     ADMIN_COST: 0,
            //     DISC_BROKER: 0,
            //     DISC_CONSULTATION: 0,
            //     DISC_ADMIN: 0,
            //     NETT_PREMI: 0,
            //     FEE_BASED_INCOME: 0,
            //     AGENT_COMMISION: 0,
            //     ACQUISITION_COST: 0,
            //     BROKERAGE_FEE: 0,
            //     CONSULTANCY_FEE: 0,
            //     ENGINEERING_FEE: 0
            // },
        ],
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
                    CURRENCY_ID: coverageName[j]["CURRENCY_ID"],
                    POLICY_COVERAGE_ID: coverageName[j]["POLICY_COVERAGE_ID"],
                    COVERAGE_NAME: coverageName[j]["POLICY_COVERAGE_NAME"],
                    GROSS_PREMI: coverageName[j]["PREMIUM"],
                    // ADMIN_COST: 0,
                    // DISC_BROKER: 0,
                    // DISC_CONSULTATION: 0,
                    // DISC_ADMIN: 0,
                    NETT_PREMI: 0,
                    // FEE_BASED_INCOME: 0,
                    // AGENT_COMMISION: 0,
                    // ACQUISITION_COST: 0,
                    BROKERAGE_FEE: 0,
                    // CONSULTANCY_FEE: 0,
                    ENGINEERING_FEE: 0,
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
                    // ADMIN_COST: 0,
                    // DISC_BROKER: 0,
                    // DISC_CONSULTATION: 9,
                    // DISC_ADMIN: 0,
                    NETT_PREMI: 0,
                    BROKERAGE_FEE: 0,
                    // CONSULTANCY_FEE: 0,
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

    const inputDataInsurer = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const items = [...dataInsurer];
        const item = { ...items[i] };
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
        premium[name] = value;
        premiums[coverageNum] = premium;
        item.premium = premiums;
        items[insurerNum] = item;
        setDataInsurer(items);
    };

    // End Add Insurer

    // Edit Insurer
    const handleSuccessEditInsurer = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Success Edit Insurer",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
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
            }
        });
    };
    const handleEditInsurer = async () => {
        // e.preventDefault();
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);

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
            editPartners: false
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

    const deleteRowEditInsurerCoverage = (
        insurerNum: number,
        coverageNum: number
    ) => {
        const items = [...dataEditInsurer];

        const item = { ...items[insurerNum] };

        const premium = [...item.premium];

        premium.splice(coverageNum, 1);

        item.premium = premium;

        // item[name] = value;
        items[insurerNum] = item;
        // setDataEditInsurer(items);

        if (
            dataEditInsurer[insurerNum].premium[coverageNum]
                .POLICY_COVERAGE_ID !== null
        ) {
            if (dataEditInsurer.deletedInsurerCoverage) {
                alert("a");
                // setDataEditInsurer({
                //     ...dataEditInsurer,
                //     premium: premium,
                //     deletedInsurerCoverage: [
                //         ...dataEditInsurer.deletedInsurerCoverage,
                //         {
                //             policy_coverage_id:
                //                 dataEditInsurer.premium[coverageNum]
                //                     .POLICY_COVERAGE_ID,
                //         },
                //     ],
                // });
            } else {
                alert("b");
                setDataEditInsurer({
                    // ...dataEditInsurer,
                    ...[dataEditInsurer][insurerNum].premium,
                    premium: premium,
                    // deletedInsurerCoverage: [
                    //     {
                    //         policy_coverage_id:
                    //             dataEditInsurer[insurerNum].premium[coverageNum]
                    //                 .POLICY_COVERAGE_ID,
                    //     },
                    // ],
                });
            }
            console.log("ada POLICY_COVERAGE_ID");
        } else {
            alert("c");
            // setDataEditInsurer({
            //     ...dataEditInsurer,
            //     premium: premium,
            // });
            console.log("Tidak ada POLICY_COVERAGE_ID");
        }

        // arr[k]["premium"];

        // items[insurerNum] = item;
        // setDataEditInsurer(items);
    };

    const deleteRowEditEndorsementPremium = (i: number) => {
        const val = [...dataById.endorsement_premium];
        val.splice(i, 1);
        if (dataById.endorsement_premium[i].endorsement_premium_id !== null) {
            if (dataById.deletedEndorsementPremium) {
                // alert("a");
                setDataById({
                    ...dataById,
                    endorsement_premium: val,
                    deletedEndorsementPremium: [
                        ...dataById.deletedEndorsementPremium,
                        {
                            endorsement_premium_id:
                                dataById.endorsement_premium[i]
                                    .ENDORSEMENT_PREMIUM_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    endorsement_premium: val,
                    deletedEndorsementPremium: [
                        {
                            endorsement_premium_id:
                                dataById.endorsement_premium[i]
                                    .ENDORSEMENT_PREMIUM_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                endorsement_premium: val,
            });
        }
    };

    const editDataInsurer = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const items = [...dataEditInsurer];
        const item = { ...items[i] };
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
        premium[name] = value;
        premiums[coverageNum] = premium;
        item.premium = premiums;
        items[insurerNum] = item;
        setDataEditInsurer(items);
    };
    // End Edit Insurer

    // edit
    const handleEditModal = async () => {
        // e.preventDefault();
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
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
            editPartners: false
        });
    };
    const editPolicyPremium = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.policy_premium];
        changeVal[i][name] = value;
        setDataById({ ...dataById, policy_premium: changeVal });
    };
    const addRowEditPolicyPremium = (e: FormEvent) => {
        e.preventDefault();
        setDataById({
            ...dataById,
            policy_premium: [
                ...dataById.policy_premium,
                {
                    POLICY_INITIAL_PREMIUM_ID: null,
                    POLICY_ID: dataById.POLICY_ID,
                    CURRENCY_ID: "",
                    COVERAGE_NAME: "",
                    GROSS_PREMI: 0,
                    ADMIN_COST: 0,
                    DISC_BROKER: 0,
                    DISC_CONSULTATION: 0,
                    DISC_ADMIN: 0,
                    NETT_PREMI: 0,
                    FEE_BASED_INCOME: 0,
                    AGENT_COMMISION: 0,
                    ACQUISITION_COST: 0,
                },
            ],
        });
        getSummaryPremi();
    };

    const deleteRowEditPolicyPremium = (i: number) => {
        const val = [...dataById.policy_premium];
        val.splice(i, 1);
        if (dataById.policy_premium[i].policy_initial_premium_id !== null) {
            if (dataById.deletedPolicyPremium) {
                // alert("a");
                setDataById({
                    ...dataById,
                    policy_premium: val,
                    deletedPolicyPremium: [
                        ...dataById.deletedPolicyPremium,
                        {
                            policy_initial_premium_id:
                                dataById.policy_premium[i]
                                    .POLICY_INITIAL_PREMIUM_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    policy_premium: val,
                    deletedPolicyPremium: [
                        {
                            policy_initial_premium_id:
                                dataById.policy_premium[i]
                                    .POLICY_INITIAL_PREMIUM_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                policy_premium: val,
            });
        }
    };

    useEffect(() => {
        getSummaryPremi();
    }, [flagDelete]);

    const editPolicyInstallment = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.policy_installment];
        changeVal[i][name] = value;
        setDataById({ ...dataById, policy_installment: changeVal });
    };

    const addRowEditInstallment = (e: FormEvent) => {
        e.preventDefault();
        setDataById({
            ...dataById,
            policy_installment: [
                ...dataById.policy_installment,
                {
                    POLICY_INSTALLMENT_ID: null,
                    POLICY_ID: dataById.POLICY_ID,
                    POLICY_INSTALLMENT_TERM: "",
                    POLICY_INSTALLMENT_PERCENTAGE: "",
                    INSTALLMENT_DUE_DATE: "",
                    POLICY_INSTALLMENT_AMOUNT: "",
                },
            ],
        });
    };

    const deleteRowEditInstallment = (i: number) => {
        const val = [...dataById.policy_installment];
        val.splice(i, 1);
        if (dataById.policy_installment[i].policy_installment_id !== null) {
            if (dataById.deletedInstallment) {
                // alert("a");
                setDataById({
                    ...dataById,
                    policy_installment: val,
                    deletedPolicyPremium: [
                        ...dataById.deletedInstallment,
                        {
                            policy_installment_id:
                                dataById.policy_installment[i]
                                    .POLICY_INISTALLMENT_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    policy_installment: val,
                    deletedPolicyPremium: [
                        {
                            policy_installment_id:
                                dataById.policy_installment[i]
                                    .POLICY_INSTALLMENT_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                policy_installment: val,
            });
        }
    };
    const editCalculate = (i: number) => {
        const changeVal: any = [...dataById.policy_premium];
        // const si = changeVal[i]["SUM_INSURED"];
        // const rate = changeVal[i]["RATE"];
        // if (si && rate) {
        //     changeVal[i]["INITIAL_PREMIUM"] = (si * rate) / 100;
        // } else [(changeVal[i]["INITIAL_PREMIUM"] = 0)];

        const gross_premi = changeVal[i]["GROSS_PREMI"];
        const admin_cost = changeVal[i]["ADMIN_COST"];
        const disc_broker = changeVal[i]["DISC_BROKER"];
        const disc_consultation = changeVal[i]["DISC_CONSULTATION"];
        const disc_admin = changeVal[i]["DISC_ADMIN"];
        changeVal[i]["NETT_PREMI"] =
            parseFloat(gross_premi) +
            parseFloat(admin_cost) -
            parseFloat(disc_broker) -
            parseFloat(disc_admin) -
            parseFloat(disc_consultation);
        setDataById({ ...dataById, policy_premium: changeVal });

        getSummaryPremi();
    };
    // end edit

    // Add Insured
    const [dataInsured, setDataInsured] = useState<any>([]);
    const [dataInsuredView, setdataInsuredView] = useState<any>([]);

    const fieldDataInsured: any = {
        POLICY_ID: "",
        POLICY_INSURED_NAME: "",
        policy_insured_detail: [
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

    const handleAddInsured = async (policy_id: any) => {
        setDataInsured([{ ...fieldDataInsured, POLICY_ID: policy_id }]);
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
            editPartners: false
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
        policy_insured_detail[name] = value;
        policy_insured_details[detailNum] = policy_insured_detail;
        item.policy_insured_detail = policy_insured_details;
        items[insuredNum] = item;
        setDataInsured(items);
    };

    const inputDataInsured = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const items = [...dataInsured];
        const item = { ...items[i] };
        item[name] = value;
        items[i] = item;
        setDataInsured(items);
    };
    console.log("dataInsured: ", dataInsured);

    // End Add Insured

    // Edit Insured
    const [dataEditInsured, setDataEditInsured] = useState<any>([]);
    const handleEditInsured = async (id: string) => {
        // e.preventDefault();
        // const id = policy.id;
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
            editPartners: false
        });
    };

    const editInsuredDetail = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditInsured.policy_insured_detail];
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
                // alert("a");
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
                // alert("b");
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
    console.log("dataEditInsured: ", dataEditInsured);
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
            INCOME_NAME: "Acquisition Cost",
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
    const [dataIncome, setDataIncome] = useState<any>([]);
    const [dataNettIncome, setDataNettIncome] = useState<any>([]);
    const [grandTotalNettIncome, setGrandTotalNettIncome] = useState<number>(0);
    const [dataEditNettIncome, setDataEditNettIncome] = useState<any>([]);
    const [grandTotalEditNettIncome, setGrandTotalEditNettIncome] = useState<number>(0);
    const [dataPartners, setDataPartners] = useState<any>([]);
    const [listDataPartners, setListDataPartners] = useState<any>([]);

    
    const handleAddPartners = async (policy_id: any) => {
        setDataPartners(arrDataPartners);
        setDataIncome(arrDataIncome);
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
            addPartners: !modal.addPartners,
            editPartners: false
        });
    };

    const addRowPartners = (e: FormEvent, income_type: number, i: number) => {
        e.preventDefault();

        const items = [...dataIncome];
        //  console.log("items: ", items);
        const item = {
            ...items[i],
            income_detail: [
                ...items[i].income_detail,
                {
                    INCOME_TYPE: income_type,
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
        items[i] = item;
        setDataIncome(items);
    };
    console.log("dataIncome: ", dataIncome);
    const inputDataIncome = (
        name: string,
        value: string | undefined,
        incomeNum: number,
        detailNum: number
    ) => {
        const items = [...dataIncome];
        const item = { ...items[incomeNum] };
        const detail = [...item.income_detail];
        const detailItem = { ...detail[detailNum] };
        detailItem[name] = value;
        detail[detailNum] = detailItem;
        item.income_detail = detail;
        items[incomeNum] = item;
        //  console.log("incomeNum: ", incomeNum);
        //  console.log("detailNum: ", detailNum);
        //  console.log("items: ", items);
        //  console.log("item: ", item);
        //  console.log("detail: ", detail);
        //  console.log("detailItem: ", detailItem);
        //  items[i] = item;
        setDataIncome(items);

        setTimeout(function () {
            setTriggerSumIncome(triggerSumIncome + 1);
        }, 1000);
    };

    const deleteRowIncome = (incomeNum: number, detailNum: number) => {
        const items = [...dataIncome];
        const item = { ...items[incomeNum] };
        const detail = [...item.income_detail];
        detail.splice(detailNum, 1);
        item.income_detail = detail;
        items[incomeNum] = item;

        setDataIncome(items);

        console.log("items: ", items);
        console.log("item: ", item);
        console.log("detail :", detail);

        //  const items = [...dataInsurer];
        //  const item = { ...items[insurerNum] };
        //  item.premium.splice(coverageNum, 1);
        //  items[insurerNum] = item;
        //  setDataInsurer(items);
    };

    useEffect(() => {
        if (triggerSumIncome != 0) {
            // alert("a: " + triggerSumIncome);
            getSumNettIncome();
        }
        //  getSumNettIncome();
    }, [triggerSumIncome]);

    const getSumNettIncome = () => {
        const items = [...dataIncome];
        const fbi_by_pks = { ...items[0] };
        const agent_commission = { ...items[1] };
        const acquisition_cost = { ...items[2] };
        //  console.log("items: ", items);
        //  console.log("fbi_by_pks: ", fbi_by_pks.income_detail);
        //  console.log("agent_commission: ", agent_commission.income_detail);
        //  console.log("acquisition_cost: ", acquisition_cost.income_detail);

        // Nett Brokerage Fee
        const nettBF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.BROKERAGE_FEE_AMOUNT;
        },
        0);
        const nettBF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.BROKERAGE_FEE_AMOUNT;
        },
        0);

        const nettBF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.BROKERAGE_FEE_AMOUNT;
            },
            0
        );

        // Nett Engineering Fee
        const nettEF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_AMOUNT;
        },
        0);
        const nettEF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_AMOUNT;
        },
        0);
        const nettEF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.ENGINEERING_FEE_AMOUNT;
            },
            0
        );

        // Nett Consultancy Fee
        const nettCF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_AMOUNT;
        },
        0);
        const nettCF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_AMOUNT;
        },
        0);
        const nettCF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.CONSULTANCY_FEE_AMOUNT;
            },
            0
        );

        console.log("nettCF_fbi: ", nettCF_fbi);
        console.log("nettCF_agent: ", nettCF_agent);
        console.log("nettCF_acquisition: ", nettCF_acquisition);

        const nettBF = nettBF_fbi + nettBF_agent + nettBF_acquisition;
        const nettEF = nettEF_fbi + nettEF_agent + nettEF_acquisition;
        const nettCF = nettCF_fbi + nettCF_agent + nettCF_acquisition;
        setDataNettIncome([
            {
                nettBf: nettBF,
                nettEf: nettEF,
                nettCf: nettCF,
            },
        ]);
        setGrandTotalNettIncome(nettBF + nettEF + nettCF);
    };
    console.log("triggerSumIncome: ", triggerSumIncome);
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
            INCOME_NAME: "Acquisition Cost",
            income_detail: [],
        },
    ];
    const getDataPartner = async (policy_id: number) => {
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
                                },
                            ],
                        };
                        items[0] = item;
                        // console.log("item: ", item);
                        // console.log("items: ", items);
                    } else if (val["INCOME_TYPE"] == 2) {
                        const item: any = {
                            ...items[1],
                            income_detail: [
                                ...items[1].income_detail,
                                {
                                    INCOME_TYPE: val["INCOME_TYPE"],
                                    POLICY_ID: val["POLICY_ID"],
                                    PARTNER_NAME: val["PARTNER_NAME"],
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
                                },
                            ],
                        };
                        items[2] = item;
                    }
                    // console.log('tmp: ', tmp);
                });
                // console.log("item: ", item);
                console.log("items: ", items);
                // console.log(data)
                setListDataPartners(items);
            })
            .catch((err) => console.log(err));
    };

    // Edit Partners
    const handleEditPartners = async (policy_id: any) => {
        // setDataPartners(arrDataPartners);
        // setDataIncome(arrDataIncome);
        getDataPartner(policy_id);
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
    const addRowEditPartners = (e: FormEvent, income_type: number, i: number) => {
        e.preventDefault();

        const items = [...listDataPartners];
        //  console.log("items: ", items);
        const item = {
            ...items[i],
            income_detail: [
                ...items[i].income_detail,
                {
                    INCOME_TYPE: income_type,
                    POLICY_ID: policy.POLICY_ID,
                    PARTNER_NAME: "",
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
        items[i] = item;
        setListDataPartners(items);
    };
    
    const inputDataEditIncome = (
        name: string,
        value: string | undefined,
        incomeNum: number,
        detailNum: number
    ) => {
        const items = [...listDataPartners];
        const item = { ...items[incomeNum] };
        const detail = [...item.income_detail];
        const detailItem = { ...detail[detailNum] };
        detailItem[name] = value;
        detail[detailNum] = detailItem;
        item.income_detail = detail;
        items[incomeNum] = item;
        setListDataPartners(items);

        setTimeout(function () {
            setTriggerEditSumIncome(triggerEditSumIncome + 1);
        }, 1000);
    };

    useEffect(() => {
        if (triggerEditSumIncome != 0) {
            // alert("a: " + triggerEditSumIncome);
            getEditSumNettIncome();
        }
        //  getSumNettIncome();
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
            return prev + +current.BROKERAGE_FEE_AMOUNT;
        },
        0);
        const nettBF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.BROKERAGE_FEE_AMOUNT;
        },
        0);

        const nettBF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.BROKERAGE_FEE_AMOUNT;
            },
            0
        );

        // Nett Engineering Fee
        const nettEF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_AMOUNT;
        },
        0);
        const nettEF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.ENGINEERING_FEE_AMOUNT;
        },
        0);
        const nettEF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.ENGINEERING_FEE_AMOUNT;
            },
            0
        );

        // Nett Consultancy Fee
        const nettCF_fbi = fbi_by_pks.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_AMOUNT;
        },
        0);
        const nettCF_agent = agent_commission.income_detail.reduce(function (
            prev: any,
            current: any
        ) {
            return prev + +current.CONSULTANCY_FEE_AMOUNT;
        },
        0);
        const nettCF_acquisition = acquisition_cost.income_detail.reduce(
            function (prev: any, current: any) {
                return prev + +current.CONSULTANCY_FEE_AMOUNT;
            },
            0
        );

        console.log("nettCF_fbi: ", nettCF_fbi);
        console.log("nettCF_agent: ", nettCF_agent);
        console.log("nettCF_acquisition: ", nettCF_acquisition);

        const nettBF = nettBF_fbi + nettBF_agent + nettBF_acquisition;
        const nettEF = nettEF_fbi + nettEF_agent + nettEF_acquisition;
        const nettCF = nettCF_fbi + nettCF_agent + nettCF_acquisition;
        setDataEditNettIncome([
            {
                nettBf: nettBF,
                nettEf: nettEF,
                nettCf: nettCF,
            },
        ]);
        setGrandTotalEditNettIncome(nettBF + nettEF + nettCF);
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
    const handleSuccessEditPartners = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Succeed Edit Business Partners",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                //  getDataInsured(policy.POLICY_ID);
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
        getDataPartner(policy.POLICY_ID);
        // setDataIncome([]);
        // setTriggerSumIncome(0);
        // setDataNettIncome([]);
        // setGrandTotalNettIncome(0);
    };
    // End Edit Partners

    const getDataInsured = async (policy_id: number) => {
        await axios
            .get(`/getDataInsured/${policy_id}`)
            .then((res) => setdataInsuredView(res.data))
            .catch((err) => console.log(err));
    };

    const handleSuccessInsured = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Succeed Register Insured",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
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
                    editPartners: false
                });
            }
        });
        setDataInsured([]);
    };

    const handleSuccessPartners = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Succeed Register Business Partners",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                //  getDataInsured(policy.POLICY_ID);
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
                    editPartners: false
                });
            }
        });
        getDataPartner(policy.POLICY_ID);
        setDataIncome([]);
        setTriggerSumIncome(0);
        setDataNettIncome([]);
        setGrandTotalNettIncome(0);
    };

    const handleSuccess = (message: string) => {
        // setIsSuccess("");

        Swal.fire({
            title: "Success",
            text: "Success Edit Policy",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                // setPolicyId(message);
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
                    editPartners: false
                });
            }
        });
        // setIsSuccess(message);
        // getPolicy();
    };

    const handleSuccessCoverageName = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Succeed Register Coverage",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
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
                    editPartners: false
                });
            }
        });
        setDataPolicyCoverage([]);
    };

    const handleSuccessInsurer = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Success Add Insurer",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
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
                    editPartners: false
                });
            }
        });
    };

    // Parent Component
    // const callbackModal = () => {
    //     setState({ showModal: false });
    // };
    // //ChildButton
    // closeButtonClickHandler = () => {
    //     this.props.callbackModal();
    // };
    const handleDeleteModal = async () => {
        const id = policy.POLICY_ID;
        // alert("aaa");
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
                        // setDataById(res.data)
                    })
                    .catch((err) => console.log(err));
            }
        });
        // onDeleteSuccess(true)
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

    return (
        <>
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
                    }),
                        setSumByCurrency([]);
                }}
                title={"Edit Policy"}
                url={`/editPolicy/${dataById.POLICY_ID}`}
                data={dataById}
                onSuccess={handleSuccess}
                // onSuccess={""}
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
                                <TextInput
                                    id="edit_policy_inception_date"
                                    type="date"
                                    name="edit_policy_inception_date"
                                    value={dataById.POLICY_INCEPTION_DATE}
                                    className=""
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_INCEPTION_DATE:
                                                e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="edit_policy_due_date"
                                    value="Expiry Date"
                                />
                                <TextInput
                                    id="edit_policy_due_date"
                                    type="date"
                                    name="edit_policy_due_date"
                                    value={dataById.POLICY_DUE_DATE}
                                    className=""
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_DUE_DATE: e.target.value,
                                        })
                                    }
                                    required
                                />
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
                                <InputLabel
                                    // htmlFor="self_insured"
                                    value="Self Insured"
                                />

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
                                                />
                                                {/* {"%"} */}
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                }}
                title={"Add Coverage"}
                url={`/insertManyCoverage`}
                data={dataPolicyCoverage}
                onSuccess={handleSuccessCoverageName}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-4xl"
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
                                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                                        <th className="min-w-[10px] py-2 px-2 text-sm text-black dark:text-white">
                                                            No.
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Currency
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Sum Insured
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Rate %
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Gross Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit %
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit Amount
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit Scale
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Insurance Discount %
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Insurance Discount
                                                            Amount
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Coverage Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Delete
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
                                                                    <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {m + 1}
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <select
                                                                            className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                    <div className="ml-4 w-40 mb-2 mt-2">
                                                        <a
                                                            href=""
                                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                                            onClick={(e) =>
                                                                addRowCoverageDetail(
                                                                    e,
                                                                    l
                                                                )
                                                            }
                                                        >
                                                            + Add Row
                                                        </a>
                                                    </div>
                                                </tbody>
                                            </table>
                                        </div>
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Edit Coverage Name"}
                url={`/editCoverage`}
                data={dataEditPolicyCoverage}
                onSuccess={handleSuccessCoverageName}
                // onSuccess={""}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-4xl"
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
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                <tr className="bg-gray-2 dark:bg-meta-4">
                                                    <th className="min-w-[10px] py-2 px-2 text-sm text-black dark:text-white">
                                                        No.
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Currency
                                                    </th>
                                                    <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Sum Insured
                                                    </th>
                                                    <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Rate %
                                                    </th>
                                                    <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Gross Premium
                                                    </th>
                                                    <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Lost Limit %
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Lost Limit Amount
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Lost Limit Scale
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Insurance Discount %
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Insurance Discount
                                                        Amount
                                                    </th>
                                                    <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Coverage Premium
                                                    </th>
                                                    <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                        Delete
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
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                                        className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                <div className="ml-4 w-40 mb-2 mt-2">
                                                    <a
                                                        href=""
                                                        className="text-xs mt-1 text-primary-pelindo ms-1"
                                                        onClick={(e) =>
                                                            addRowEditCoverageDetail(
                                                                e,
                                                                dataEditPolicyCoverage.POLICY_COVERAGE_ID
                                                            )
                                                        }
                                                    >
                                                        + Add Row
                                                    </a>
                                                </div>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="inline-block min-w-full py-2 align-middle ">
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
                                            Coverage Name
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dataEditPolicyCoverage.map(
                                        (policyCover: any, i: number) => (
                                            <tr key={i}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 border border-gray-30 text-center">
                                                    {i + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
                                                    <TextInput
                                                        id="coverage_name"
                                                        type="text"
                                                        name="coverage_name"
                                                        value={
                                                            policyCover.POLICY_COVERAGE_NAME
                                                        }
                                                        className=""
                                                        autoComplete="coverage_name"
                                                        onChange={(e) =>
                                                            editPolicyCoverage(
                                                                i,
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div> */}
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Add Insurer"}
                url={`/insertManyInsurer`}
                data={dataInsurer}
                onSuccess={handleSuccessInsurer}
                // onSuccess={""}
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
                                            // onBlur={
                                            //     addRowDataInsurer()
                                            // }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>
                        {/* <hr className="my-3" /> */}
                        {/* List Insurer */}
                        {dataInsurer?.map((dataIns: any, i: number) => {
                            return (
                                <>
                                    <div className="mt-6 mb-4 ml-4 mr-4">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 border-b-2 w-fit">
                                            List Insurer
                                        </h3>
                                        <div className="shadow-md border-2 mt-3">
                                            <div className=" ml-4 mr-4 mb-4 mt-4">
                                                <div className="grid grid-cols-4 gap-4">
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
                                                                decimalScale={2}
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
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mb-4 mt-4 ">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                        <tr className="bg-gray-2 dark:bg-meta-4">
                                                            <th className="min-w-[10px] py-4 px-4 text-sm text-black dark:text-white">
                                                                No.
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Coverage Name
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Currency
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Coverage Premium
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Brokerage Fee
                                                            </th>
                                                            {/* <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Consultancy Fee
                                                            </th> */}
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Engineering Fee
                                                            </th>
                                                            {/* <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Admin Cost
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Brokerage
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Consultancy
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Admin
                                                            </th> */}
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Nett Premium
                                                            </th>
                                                            {/* <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Fee Based Income
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Agen Commission
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Acquisition
                                                                Costs
                                                            </th> */}
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Delete
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
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <TextInput
                                                                                type="text"
                                                                                id="coverage_name"
                                                                                name="COVERAGE_NAME"
                                                                                value={
                                                                                    dIP.COVERAGE_NAME
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    inputInsurerCoverage(
                                                                                        "COVERAGE_NAME",
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        i,
                                                                                        j
                                                                                    )
                                                                                }
                                                                                className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
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
                                                                                    // getSummaryPremi();
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}

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

                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="admin_cost"
                                                                                name="ADMIN_COST"
                                                                                value={
                                                                                    dIP.ADMIN_COST
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
                                                                                        "ADMIN_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    )
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_broker"
                                                                                name="DISC_BROKER"
                                                                                value={
                                                                                    dIP.DISC_BROKER
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
                                                                                        "DISC_BROKER",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    )
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_consultation"
                                                                                name="DISC_CONSULTATION"
                                                                                value={
                                                                                    dIP.DISC_CONSULTATION
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
                                                                                        "DISC_CONSULTATION",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    )
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_admin"
                                                                                name="DISC_ADMIN"
                                                                                value={
                                                                                    dIP.DISC_ADMIN
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
                                                                                        "DISC_ADMIN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    )
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
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
                                                                                required
                                                                            />
                                                                        </td>
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="fee_based_income"
                                                                                name="FEE_BASED_INCOME"
                                                                                value={
                                                                                    dIP.FEE_BASED_INCOME
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
                                                                                        "FEE_BASED_INCOME",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="agent_commision"
                                                                                name="AGENT_COMMISION"
                                                                                value={
                                                                                    dIP.AGENT_COMMISION
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
                                                                                        "AGENT_COMMISION",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="aqcuisition_cost"
                                                                                name="ACQUISITION_COST"
                                                                                value={
                                                                                    dIP.ACQUISITION_COST
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
                                                                                        "ACQUISITION_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                                required
                                                                            />
                                                                        </td> */}
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    deleteRowInsurerCoverage(
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // setFlagDelete(
                                                                                    //     flagDelete +
                                                                                    //         1
                                                                                    // );
                                                                                }}
                                                                            >
                                                                                <path
                                                                                    fill="#AB7C94"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M6 18 18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                        <div className="w-40 mb-2 mt-2">
                                                            <a
                                                                href=""
                                                                className="text-xs mt-1 text-primary-pelindo ms-1"
                                                                onClick={(e) =>
                                                                    // addRowEditPolicyPremium(
                                                                    //     e
                                                                    // )
                                                                    addRowInsurerCoverage(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                + Add Row
                                                            </a>
                                                        </div>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                        {/* End List Insurer */}

                        {/* <div className="mt-10 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Debit Note Installment
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                            Installment
                                        </th>
                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                            Term Rate
                                        </th>
                                        <th className="w-24 py-4 px-4 text-sm text-black dark:text-white">
                                            Due Date
                                        </th>

                                        <th className="w-24 py-4 px-4 text-sm text-black dark:text-white">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.policy_installment?.map(
                                        (pI: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            id="policy_installment_term"
                                                            name="POLICY_INSTALLMENT_TERM"
                                                            value={
                                                                pI.POLICY_INSTALLMENT_TERM
                                                            }
                                                            onChange={(e) =>
                                                                editPolicyInstallment(
                                                                    "POLICY_INSTALLMENT_TERM",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="policy_installment_percentage"
                                                            name="POLICY_INSTALLMENT_PERCENTAGE"
                                                            value={
                                                                pI.POLICY_INSTALLMENT_PERCENTAGE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyInstallment(
                                                                    "POLICY_INSTALLMENT_PERCENTAGE",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            type="date"
                                                            id="installment_due_date"
                                                            name="INSTALLMENT_DUE_DATE"
                                                            value={
                                                                pI.INSTALLMENT_DUE_DATE
                                                            }
                                                            onChange={(e) =>
                                                                editPolicyInstallment(
                                                                    "INSTALLMENT_DUE_DATE",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        {dataById
                                                            .policy_installment
                                                            .length !== 1 && (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                onClick={() =>
                                                                    deleteRowEditInstallment(
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                <path
                                                                    fill="#AB7C94"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    <div className="w-40 mb-2 mt-2">
                                        <a
                                            href=""
                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                            onClick={(e) =>
                                                addRowEditInstallment(e)
                                            }
                                        >
                                            + Add Row
                                        </a>
                                    </div>
                                </tbody>
                            </table>
                        </div> */}
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Edit Insurer"}
                url={`/editManyInsurer`}
                data={dataEditInsurer}
                onSuccess={handleSuccessEditInsurer}
                // onSuccess={""}
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
                                        <span>How many Insurer? :</span>
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            id="insurer_number"
                                            type="number"
                                            name="insurer_number"
                                            value={dataEditInsurer.length}
                                            className=""
                                            autoComplete="off"
                                            // onChange={(e) => {
                                            //     setDataById({
                                            //         ...dataById,
                                            //         POLICY_INSURANCE_PANEL:
                                            //             e.target.value,
                                            //     }),
                                            //         addRowDataInsurer(
                                            //             e.target.value
                                            //         );
                                            // }}
                                            // // onBlur={
                                            // //     addRowDataInsurer()
                                            // // }
                                            // required
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>
                        {/* <hr className="my-3" /> */}
                        {/* List Insurer */}
                        {dataEditInsurer?.map((dataIns: any, i: number) => {
                            return (
                                <>
                                    <div className="mt-6 mb-4 ml-4 mr-4">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 border-b-2 w-fit">
                                            List Insurer
                                        </h3>
                                        <div className="shadow-md border-2 mt-3">
                                            <div className=" ml-4 mr-4 mb-4 mt-4">
                                                <div className="grid grid-cols-4 gap-4">
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
                                                                    id="radio1"
                                                                    name="ip_policy_leader"
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
                                                                    id="radio2"
                                                                    name="ip_policy_leader"
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
                                                                decimalScale={2}
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
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mb-4 mt-4 ">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                        <tr className="bg-gray-2 dark:bg-meta-4">
                                                            <th className="min-w-[10px] py-4 px-4 text-sm text-black dark:text-white">
                                                                No.
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Coverage Name
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Currency
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Gross Premium
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Brokerage Fee
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Consultancy Fee
                                                            </th>
                                                            <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Engineering Fee
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Admin Cost
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Brokerage
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Consultancy
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Disc Admin
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Nett Premium
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Fee Based Income
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Agen Commission
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Acquisition
                                                                Costs
                                                            </th>
                                                            {/* <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                                Delete
                                                            </th> */}
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
                                                                                    // getSummaryPremi();
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="consultancy_fee"
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>

                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="admin_cost"
                                                                                name="ADMIN_COST"
                                                                                value={
                                                                                    dIP.ADMIN_COST
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
                                                                                        "ADMIN_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_broker"
                                                                                name="DISC_BROKER"
                                                                                value={
                                                                                    dIP.DISC_BROKER
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
                                                                                        "DISC_BROKER",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_consultation"
                                                                                name="DISC_CONSULTATION"
                                                                                value={
                                                                                    dIP.DISC_CONSULTATION
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
                                                                                        "DISC_CONSULTATION",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="disc_admin"
                                                                                name="DISC_ADMIN"
                                                                                value={
                                                                                    dIP.DISC_ADMIN
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
                                                                                        "DISC_ADMIN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <CurrencyInput
                                                                                id="fee_based_income"
                                                                                name="FEE_BASED_INCOME"
                                                                                value={
                                                                                    dIP.FEE_BASED_INCOME
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
                                                                                        "FEE_BASED_INCOME",
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
                                                                                id="agent_commision"
                                                                                name="AGENT_COMMISION"
                                                                                value={
                                                                                    dIP.AGENT_COMMISION
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
                                                                                        "AGENT_COMMISION",
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
                                                                                id="aqcuisition_cost"
                                                                                name="ACQUISITION_COST"
                                                                                value={
                                                                                    dIP.ACQUISITION_COST
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
                                                                                        "ACQUISITION_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    deleteRowEditInsurerCoverage(
                                                                                        i,
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
                                                                        </td> */}
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                        {/* <div className="w-40 mb-2 mt-2">
                                                            <a
                                                                href=""
                                                                className="text-xs mt-1 text-primary-pelindo ms-1"
                                                                onClick={(e) =>
                                                                    addRowEditInsurerCoverage(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                + Add Row
                                                            </a>
                                                        </div> */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                        {/* End List Insurer */}

                        {/* <div className="mt-10 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Debit Note Installment
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                            Installment
                                        </th>
                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                            Term Rate
                                        </th>
                                        <th className="w-24 py-4 px-4 text-sm text-black dark:text-white">
                                            Due Date
                                        </th>

                                        <th className="w-24 py-4 px-4 text-sm text-black dark:text-white">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.policy_installment?.map(
                                        (pI: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            id="policy_installment_term"
                                                            name="POLICY_INSTALLMENT_TERM"
                                                            value={
                                                                pI.POLICY_INSTALLMENT_TERM
                                                            }
                                                            onChange={(e) =>
                                                                editPolicyInstallment(
                                                                    "POLICY_INSTALLMENT_TERM",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="policy_installment_percentage"
                                                            name="POLICY_INSTALLMENT_PERCENTAGE"
                                                            value={
                                                                pI.POLICY_INSTALLMENT_PERCENTAGE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyInstallment(
                                                                    "POLICY_INSTALLMENT_PERCENTAGE",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            type="date"
                                                            id="installment_due_date"
                                                            name="INSTALLMENT_DUE_DATE"
                                                            value={
                                                                pI.INSTALLMENT_DUE_DATE
                                                            }
                                                            onChange={(e) =>
                                                                editPolicyInstallment(
                                                                    "INSTALLMENT_DUE_DATE",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        {dataById
                                                            .policy_installment
                                                            .length !== 1 && (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                onClick={() =>
                                                                    deleteRowEditInstallment(
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                <path
                                                                    fill="#AB7C94"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    <div className="w-40 mb-2 mt-2">
                                        <a
                                            href=""
                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                            onClick={(e) =>
                                                addRowEditInstallment(e)
                                            }
                                        >
                                            + Add Row
                                        </a>
                                    </div>
                                </tbody>
                            </table>
                        </div> */}
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                }}
                title={"Add Insured"}
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
                                            {i > 0 ? (
                                                <div>
                                                    <div className="">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mx-auto h-6 text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                deleteRowInsured(
                                                                    i
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
                                        {/* <div className="container mx-auto overflow-x-auto border-x border-t my-10"> */}
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
                                                            Consultancy Fee
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                        >
                                                            Insurer Nett Premium
                                                        </th>
                                                        <th
                                                            colSpan={2}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Discount Brokerage
                                                        </th>
                                                        <th
                                                            colSpan={2}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Discount Admin
                                                        </th>
                                                        <th
                                                            colSpan={2}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Discount Engineering
                                                            Fee
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
                                                        {/* <th className="text-center p-4 border-r text-base"></th> */}
                                                        {/* <th className="text-center p-4 border-r"></th> */}
                                                        {/* <th className="text-center p-4 border-r"></th>
                                                        <th className="text-center p-4 border-r"></th>
                                                        <th className="text-center p-4 border-r"></th> */}
                                                        <th className="text-center p-4 border ">
                                                            %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Amount
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            %
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Amount
                                                        </th>
                                                        {/* <th className="text-center p-4"></th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* dataInsured.map((insured: any, i: number) => ( */}
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
                                                                            inputInsuredDetail(
                                                                                "CURRENCY_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
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
                                                                        required
                                                                    />
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
                                                                        id="disc_admin_percentage"
                                                                        name="DISC_ADMIN_PERCENTAGE"
                                                                        value={
                                                                            detail.DISC_ADMIN_PERCENTAGE
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
                                                                                "DISC_ADMIN_PERCENTAGE",
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
                                                                        id="disc_admin_amount"
                                                                        name="DISC_ADMIN_AMOUNT"
                                                                        value={
                                                                            detail.DISC_ADMIN_AMOUNT
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
                                                                                "DISC_ADMIN_AMOUNT",
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
                                                                        required
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                    <div className="ml-4 w-40 mb-2 mt-2">
                                                        <a
                                                            href=""
                                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                                            onClick={(e) =>
                                                                addRowInsuredDetail(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            + Add Row
                                                        </a>
                                                    </div>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 "></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="ml-4 w-40 mb-2 mt-2">
                            <a
                                href=""
                                className="text-xs mt-1 text-primary-pelindo ms-1"
                                onClick={(e) => addRowInsured(e)}
                            >
                                + Add Insured
                            </a>
                        </div>
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
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Edit Insured"}
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
                                    {/* <div className="container mx-auto overflow-x-auto border-x border-t my-10"> */}

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
                                                        Consultancy Fee
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                    >
                                                        Insurer Nett Premium
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Discount Brokerage
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Discount Admin
                                                    </th>
                                                    <th
                                                        colSpan={2}
                                                        className="text-center p-4 border border-t-0 border-gray-300"
                                                    >
                                                        Discount Engineering Fee
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                    >
                                                        Nett Premium To Insured
                                                    </th>
                                                    <th
                                                        rowSpan={2}
                                                        className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                                <tr className="border-b border-gray-400 text-sm font-semibold text-gray-900">
                                                    {/* <th className="text-center p-4 border-r text-base"></th>
                                                    <th className="text-center p-4 border-r"></th>
                                                    <th className="text-center p-4 border-r"></th>
                                                    <th className="text-center p-4 border-r"></th>
                                                    <th className="text-center p-4 border-r"></th> */}
                                                    <th className="text-center p-4 border ">
                                                        %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Amount
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        %
                                                    </th>
                                                    <th className="text-center p-4 border ">
                                                        Amount
                                                    </th>
                                                    {/* <th className="text-center border-r p-4"></th> */}
                                                    {/* <th className="text-center p-4"></th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* dataInsured.map((insured: any, i: number) => ( */}
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
                                                                    required
                                                                />
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
                                                                    id="disc_admin_percentage"
                                                                    name="DISC_ADMIN_PERCENTAGE"
                                                                    value={
                                                                        detail.DISC_ADMIN_PERCENTAGE
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
                                                                            "DISC_ADMIN_PERCENTAGE",
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
                                                                    id="disc_admin_amount"
                                                                    name="DISC_ADMIN_AMOUNT"
                                                                    value={
                                                                        detail.DISC_ADMIN_AMOUNT
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
                                                                            "DISC_ADMIN_AMOUNT",
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
                                                                    required
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
                                                <div className="ml-4 w-40 mb-2 mt-2">
                                                    <a
                                                        href=""
                                                        className="text-xs mt-1 text-primary-pelindo ms-1"
                                                        onClick={(e) => {
                                                            addRowEditInsuredDetail(
                                                                e,
                                                                dataEditInsured.POLICY_INSURED_ID
                                                            );
                                                        }}
                                                    >
                                                        + Add Row
                                                    </a>
                                                </div>
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

            {/* modal Add Partners */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.addPartners}
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
                        setSumByCurrency([]);
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                    setTriggerSumIncome(0);
                    setDataNettIncome([]);
                    setGrandTotalNettIncome(0);
                }}
                title={"Add Business Partners"}
                url={`/insertPartners`}
                data={dataIncome}
                onSuccess={handleSuccessPartners}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                            <table className="table-auto w-full">
                                {/* <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full"> */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Name
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
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                    <tr>
                                        {/* <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                        ></th> */}
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        {/* <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {dataIncome.map(
                                        (income: any, i: number) => (
                                            <Fragment
                                                key={income.INCOME_CATEGORY_ID}
                                            >
                                                <tr className="border-t border-gray-200">
                                                    <th
                                                        scope="colgroup"
                                                        colSpan={9}
                                                        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                    >
                                                        <td className="text-left w-32">
                                                            <sup className="text-red-600">
                                                                *
                                                            </sup>{" "}
                                                            Type of Income:
                                                        </td>
                                                        <td className="text-left w-40">
                                                            {income.INCOME_NAME}
                                                        </td>
                                                        <td className="text-left w-32">
                                                            <a
                                                                href=""
                                                                className="text-xs mt-1 text-primary ms-1"
                                                                onClick={(e) =>
                                                                    addRowPartners(
                                                                        e,
                                                                        income.INCOME_CATEGORY_ID,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                + Add Row
                                                            </a>
                                                        </td>
                                                    </th>
                                                </tr>
                                                {income.income_detail.map(
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
                                                                <div className="block w-40 mx-auto text-left">
                                                                    <TextInput
                                                                        id="name"
                                                                        type="text"
                                                                        name="name"
                                                                        value={
                                                                            detail.NAME
                                                                        }
                                                                        className=""
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputDataIncome(
                                                                                "NAME",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                detailIdx
                                                                            )
                                                                        }
                                                                        required
                                                                        autoComplete="off"
                                                                    />
                                                                </div>
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
                                                                        inputDataIncome(
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
                                                                        inputDataIncome(
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
                                                                        inputDataIncome(
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
                                                                        inputDataIncome(
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
                                                                        inputDataIncome(
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
                                                                        inputDataIncome(
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
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]"></td>
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
                                                                            deleteRowIncome(
                                                                                i,
                                                                                detailIdx
                                                                            );
                                                                            setTriggerSumIncome(
                                                                                triggerSumIncome +
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
                                    {dataNettIncome?.map(
                                        (nett: any, x: number) => (
                                            <tr
                                                key={x}
                                                className={"border-gray-200"}
                                            >
                                                <th
                                                    scope="colgroup"
                                                    // colSpan={8}
                                                    className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                >
                                                    Nett Margin
                                                </th>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettBf)}
                                                </td>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettEf)}
                                                </td>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettCf)}
                                                </td>
                                                <td className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]">
                                                    Admin Cost
                                                </td>
                                                <td className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"></td>
                                            </tr>
                                        )
                                    )}

                                    {/* Gran Total */}
                                    {grandTotalNettIncome != 0 ? (
                                        <tr
                                            key={1}
                                            className={"border-gray-200"}
                                        >
                                            <th
                                                scope="colgroup"
                                                // colSpan={8}
                                                className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                            >
                                                Grand Total Nett Margin
                                            </th>
                                            <td
                                                colSpan={2}
                                                className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                            >
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(grandTotalNettIncome)}
                                            </td>

                                            <td
                                                colSpan={7}
                                                className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                            ></td>
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
            {/* end modal Add Partners  */}

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
                        setSumByCurrency([]);
                    setDataInsurer([]);
                    setDataPolicyCoverage([]);
                    setTriggerSumIncome(0);
                    setDataNettIncome([]);
                    setGrandTotalNettIncome(0);
                    setDataEditNettIncome([]);
                    setGrandTotalEditNettIncome(0);
                }}
                title={"Edit Business Partners"}
                url={`/editPartners`}
                data={listDataPartners}
                onSuccess={handleSuccessEditPartners}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                            <table className="table-auto w-full">
                                {/* <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full"> */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Name
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
                                        <th
                                            rowSpan={2}
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                    <tr>
                                        {/* <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                        ></th> */}
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            %
                                        </th>
                                        <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            Amount
                                        </th>
                                        {/* <th
                                            scope="col"
                                            // colSpan={2}
                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                        >
                                            
                                        </th> */}
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
                                                        <td className="text-left w-32">
                                                            <sup className="text-red-600">
                                                                *
                                                            </sup>{" "}
                                                            Type of Income:
                                                        </td>
                                                        <td className="text-left w-40">
                                                            {
                                                                editPartner.INCOME_NAME
                                                            }
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
                                                                <div className="block w-40 mx-auto text-left">
                                                                    <TextInput
                                                                        id="name"
                                                                        type="text"
                                                                        name="name"
                                                                        value={
                                                                            detail.PARTNER_NAME
                                                                        }
                                                                        className=""
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputDataEditIncome(
                                                                                "PARTNER_NAME",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i,
                                                                                detailIdx
                                                                            )
                                                                        }
                                                                        required
                                                                        autoComplete="off"
                                                                    />
                                                                </div>
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
                                                                        inputDataIncome(
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
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]"></td>
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
                                                className={"border-gray-200"}
                                            >
                                                <th
                                                    scope="colgroup"
                                                    // colSpan={8}
                                                    className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                >
                                                    Nett Margin
                                                </th>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettBf)}
                                                </td>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettEf)}
                                                </td>

                                                <td
                                                    colSpan={2}
                                                    className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                                >
                                                    {new Intl.NumberFormat(
                                                        "id",
                                                        {
                                                            style: "decimal",
                                                        }
                                                    ).format(nett.nettCf)}
                                                </td>
                                                <td className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]">
                                                    Admin Cost
                                                </td>
                                                <td className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"></td>
                                            </tr>
                                        )
                                    )}

                                    {/* Gran Total */}
                                    {grandTotalEditNettIncome != 0 ? (
                                        <tr
                                            key={1}
                                            className={"border-gray-200"}
                                        >
                                            <th
                                                scope="colgroup"
                                                // colSpan={8}
                                                className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                            >
                                                Grand Total Nett Margin
                                            </th>
                                            <td
                                                colSpan={2}
                                                className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                            >
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    grandTotalEditNettIncome
                                                )}
                                            </td>

                                            <td
                                                colSpan={7}
                                                className="bg-gray-50 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 border-[1px]"
                                            ></td>
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
                            <div className="mb-2">
                                <div className="flex">
                                    <div className="text-xl font-semibold leading-6 items-center text-gray-900 ml-4 mr-4 border-b-2 w-fit">
                                        <span className="">
                                            Policy Number:{" "}
                                            {policy.POLICY_NUMBER}{" "}
                                        </span>
                                    </div>
                                    <div className="rounded-md bg-green-50 px-2 py-1 content-center text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {policy.POLICY_STATUS_ID == 1 ? (
                                            <span>Current</span>
                                        ) : (
                                            <span>Lapse</span>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                handleEditModal();
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-3 gap-4 mr-6">
                                    <div className="col-span-2 w-fit">
                                        <h3 className="text-xl font-semibold leading-6 items-center text-gray-900 ml-4 mr-4 border-b-2 ">
                                            Policy Number:{" "}
                                            {policy.POLICY_NUMBER}{" "}
                                            {policy.POLICY_STATUS_ID == 1 ? (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Current
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    Lapse
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                </div> */}

                                {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Client Name</span>
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
                                <div className=""></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>The Insured</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_THE_INSURED}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Inception Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_INCEPTION_DATE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Insurance Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    policy.insurance_type
                                                        .INSURANCE_TYPE_NAME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Expiry Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_DUE_DATE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <hr className="mt-5" /> */}

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
                                                {/* <h1>introduction</h1> */}
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
                                                <table className="table-auto overflow-x-auto divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                Currency
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Sum Insured
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Rate %
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Gross Premium
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Lost Limit %
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Lost Limit
                                                                Amount
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Lost Limit Scale
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Insurance
                                                                Discount %
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Insurance
                                                                Discount Amount
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                            >
                                                                Coverage Premium
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
                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        {getCurrencyById(
                                                                            detail.CURRENCY_ID
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.SUM_INSURED
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                                maximumFractionDigits:6
                                                                            }
                                                                        ).format(
                                                                            detail.RATE
                                                                        ) +
                                                                            " %"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.GROSS_PREMIUM
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.LOST_LIMIT_PERCENTAGE
                                                                        ) +
                                                                            " %"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.LOST_LIMIT_AMOUNT
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.LOST_LIMIT_SCALE
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.INSURANCE_DISC_PERCENTAGE
                                                                        ) +
                                                                            " %"}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.INSURANCE_DISC_AMOUNT
                                                                        )}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text right">
                                                                        {new Intl.NumberFormat(
                                                                            "id",
                                                                            {
                                                                                style: "decimal",
                                                                            }
                                                                        ).format(
                                                                            detail.PREMIUM
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </Collapsible>
                                        )
                                    )}
                                    {/* <hr /> */}
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
                                                    (val: any, i: number) => (
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
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
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
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
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
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4 mt-8">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>Insured</span>
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
                                            Add Insured
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
                                                {/* <h1>introduction</h1> */}
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
                                                        Edit Insured
                                                    </button>
                                                </div>
                                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                                    <table className="table-auto w-full">
                                                        <thead className="border-b bg-gray-50">
                                                            <tr className="text-sm font-semibold text-gray-900">
                                                                <th
                                                                    rowSpan={2}
                                                                    // scope="col"
                                                                    className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300"
                                                                >
                                                                    No
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
                                                                    Consultancy
                                                                    Fee
                                                                </th>
                                                                <th
                                                                    rowSpan={2}
                                                                    className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 "
                                                                >
                                                                    Insurer Nett
                                                                    Premium
                                                                </th>
                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center p-4 border border-t-0 border-gray-300"
                                                                >
                                                                    Discount
                                                                    Brokerage
                                                                </th>
                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center p-4 border border-t-0 border-gray-300"
                                                                >
                                                                    Discount
                                                                    Admin
                                                                </th>
                                                                <th
                                                                    colSpan={2}
                                                                    className="text-center p-4 border border-t-0 border-gray-300"
                                                                >
                                                                    Discount
                                                                    Engineering
                                                                    Fee
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
                                                                {/* <th className="text-center p-4 border-r text-base"></th>
                                                                <th className="text-center p-4 border-r"></th>
                                                                <th className="text-center p-4 border-r"></th>
                                                                <th className="text-center p-4 border-r"></th> */}
                                                                <th className="text-center p-4 border ">
                                                                    %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Amount
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    %
                                                                </th>
                                                                <th className="text-center p-4 border ">
                                                                    Amount
                                                                </th>
                                                                {/* <th className="text-center p-4"></th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* dataInsured.map((insured: any, i: number) => ( */}
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
                                                                                required
                                                                            />
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
                                                                                id="disc_admin_percentage"
                                                                                name="DISC_ADMIN_PERCENTAGE"
                                                                                value={
                                                                                    detail.DISC_ADMIN_PERCENTAGE
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
                                                                                        "DISC_ADMIN_PERCENTAGE",
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
                                                                                id="disc_admin_amount"
                                                                                name="DISC_ADMIN_AMOUNT"
                                                                                value={
                                                                                    detail.DISC_ADMIN_AMOUNT
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
                                                                                        "DISC_ADMIN_AMOUNT",
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
                                    {/* <hr /> */}
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
                                                handleAddPartners(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Add Business Partners
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleEditPartners(
                                                    policy.POLICY_ID
                                                );
                                                setTriggerEditSumIncome(
                                                    triggerEditSumIncome + 1
                                                );
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
                                                            Name
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
                                                            // colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            // colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            // colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            // colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            // colSpan={2}
                                                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  border-[1px]"
                                                        >
                                                            %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            // colSpan={2}
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
                                                                        <td className="text-left w-32">
                                                                            Type
                                                                            of
                                                                            Income:
                                                                        </td>
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
                                                                                    {
                                                                                        detail.PARTNER_NAME
                                                                                    }
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
            {/* <div className="absolute bottom-3 left-4">
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                    onClick={() => {
                        handleDeleteModal();
                    }}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                    onClick={() => {
                        handleEditModal();
                    }}
                >
                    Edit
                </button>
            </div> */}
        </>
        // </AuthenticatedLayout>
    );
}
