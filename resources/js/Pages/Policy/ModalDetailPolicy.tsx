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
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import Button from "@/Components/Button/Button";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";
import SwitchPage from "@/Components/Switch";
import ModalToAdd from "@/Components/Modal/ModalToAdd";

export default function ModalDetailPolicy({
    policy,
    insurance,
    insuranceType,
    policyStatus,
    currency,
    onDeleteSuccess,
}: PropsWithChildren<{
    policy: any;
    insurance: any | null;
    insuranceType: any | null;
    policyStatus: any | null;
    currency: any | null;
    onDeleteSuccess: any;
}>) {
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [dataById, setDataById] = useState<any>(policy);
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [sumByCurrency, setSumByCurrency] = useState<any>([]);
    const [dataInsurer, setDataInsurer] = useState<any>([]);
    const [dataEditInsurer, setDataEditInsurer] = useState<any>([]);
    const [flagDelete, setFlagDelete] = useState<number>(0);
    const [coverageName, setCoverageName] = useState<any>([]);
    // const { insurance, insuranceType, policyStatus, currency }: any =
    //     usePage().props;

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
    ];

    useEffect(() => {
        getInsurancePanel(policy.POLICY_ID);
        getCoverageNameByPolicyId(policy.POLICY_ID);
        getSummaryPremi();
        // setFlagSwitch(policy.SELF_INSURED? true:false)
    }, [policy.POLICY_ID]);

    const getInsurancePanel = async (id: number) => {
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setInsurancePanels(res.data))
            .catch((err) => console.log(err));
    };
    console.log("insurancePanels: ", insurancePanels);

    const getSummaryPremi = () => {
        // const dataToGroup = dataById.policy_premium;
        const dataToGroup: any = [...dataById.policy_premium];
        console.log("dataToGroup: ", dataToGroup);
        const groupBy = (data: any, keys: any) => {
            // console.log('data: ',data)
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

    console.log("sumByCurrency: ", sumByCurrency);

    const getCoverageNameByPolicyId = async (policy_id: number) => {
        await axios
            .get(`/getCoverageNameByPolicyId/${policy_id}`)
            .then((res) => setCoverageName(res.data))
            .catch((err) => console.log(err));
    };

    console.log("coverageName: ", coverageName);

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
    });

    const getCurrencyById = (currId: any) => {
        console.log("currId: ", currId);
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result.CURRENCY_SYMBOL : null;
    };

    // Add Policy Coverage
    const [dataPolicyCoverage, setDataPolicyCoverage] = useState<any>({
        POLICY_ID: "",
        POLICY_COVERAGE_NAME: "",
    });

    const handleAddCoverage = async (policy_id: any) => {
        setDataPolicyCoverage({
            ...dataPolicyCoverage,
            POLICY_ID: policy_id,
        });

        // getCoverageNameByPolicyId(policy_id)

        // await axios
        //     .get(`/getPolicyCoverageByPolicyId/${policy_id}`)
        //     .then((res) => setCoverage(res.data))
        //     .catch((err) => console.log(err));

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
        });
    };
    console.log("dataPolicyCoverage: ", dataPolicyCoverage);
    // End Add Policy Coverage

    // Edit Policy COverage
    const [dataEditPolicyCoverage, setDataEditPolicyCoverage] = useState<any>([]);
    const handleEditCoverage = async (policy_id:string) => {
        // e.preventDefault();
        // const id = policy.POLICY_ID;
        await axios
            .get(`/getCoverageNameByPolicyId/${policy_id}`)
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
        });
    };
    const editPolicyCoverage = (i:number, value:string) => {

        const items = [...dataEditPolicyCoverage];
        const item = { ...items[i] };
        item.POLICY_COVERAGE_NAME = value;
        items[i] = item;
        setDataEditPolicyCoverage(items);
    }
    // End Edit Policy COverage


    // Add Insurer
    const handleAddInsurer = async () => {
        // e.preventDefault();
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);

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
        });
    };
    const fieldDataInsurer: any = {
        INSURANCE_ID: "",
        POLICY_ID: policy.POLICY_ID,
        IP_POLICY_SHARE: "",
        IP_POLICY_LEADER: "",
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
            // console.log('coverageName.length: ', coverageName.length)
            arr.push(fieldDataInsurer);
        }

        console.log("arr; ", arr);
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
            console.log("arr: ", arr);
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

        setDataInsurer(items);
    };

    const deleteRowInsurerCoverage = (
        insurerNum: number,
        coverageNum: number
    ) => {
        // console.log("insurerNum: " + insurerNum + ' | coverageNum: ' + coverageNum);
        const items = [...dataInsurer];
        const item = { ...items[insurerNum] };
        item.premium.splice(coverageNum, 1);
        items[insurerNum] = item;
        setDataInsurer(items);
        console.log("items: ", items);
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
    const handleEditInsurer = async () => {
        // e.preventDefault();
        const id = policy.POLICY_ID;
        setFlagSwitch(policy.SELF_INSURED ? true : false);

        getCoverageNameByPolicyId(id);

        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setDataEditInsurer(res.data))
            .catch((err) => console.log(err));
        // console.log('xxx: ', dataEditInsurer)

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
        });
    };

    const addRowEditDataInsurer = (jml: string) => {
        let arr: any = [];

        for (let i = 0; i < parseInt(jml); i++) {
            // console.log('coverageName.length: ', coverageName.length)
            arr.push(fieldDataInsurer);
        }

        console.log("arr; ", arr);
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
            console.log("arr: ", arr);
        }

        setDataEditInsurer(arr);
    };

    const addRowEditInsurerCoverage = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataEditInsurer];
        // console.log('aaaa')
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
        // console.log("insurerNum: " + insurerNum + ' | coverageNum: ' + coverageNum);
        const items = [...dataEditInsurer];
        const item = { ...items[insurerNum] };
        // const premium = [...item]
        item.premium.splice(coverageNum, 1);
        console.log("dataEditInsurer: ", dataEditInsurer);
        console.log(
            "dataEditInsurer[insurerNum].premium[coverageNum]: ",
            dataEditInsurer[insurerNum].premium[coverageNum]
        );

        if (
            dataEditInsurer[insurerNum].premium[coverageNum]
                .POLICY_COVERAGE_ID !== null
        ) {
            if (dataEditInsurer.deletedInsurerCoverage) {
                alert("a");
                // setDataEditInsurer({
                //     ...dataEditInsurer,
                //     premium: item,
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
                // setDataEditInsurer({
                //     ...dataEditInsurer,
                //     premium: item,
                //     deletedInsurerCoverage: [
                //         {
                //             policy_coverage_id:
                //                 dataEditInsurer.premium[coverageNum]
                //                     .POLICY_COVERAGE_ID,
                //         },
                //     ],
                // });
            }
            console.log("ada POLICY_COVERAGE_ID");
        } else {
            alert("c");
            // setDataEditInsurer({
            //     ...dataEditInsurer,
            //     premium: item,
            // });
            console.log("Tidak ada POLICY_COVERAGE_ID");
        }

        // arr[k]["premium"];

        // items[insurerNum] = item;
        // setDataEditInsurer(items);
        console.log("items: ", items);
        console.log(
            "dataEditInsurer[insurerNum].premium[coverageNum]: ",
            dataEditInsurer[insurerNum].premium[coverageNum]
        );
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
    console.log("dataEditInsurer: ", dataEditInsurer);

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
    // console.log("dataById: ", dataById);
    const addRowEditPolicyPremium = (e: FormEvent) => {
        e.preventDefault();
        // console.log(dataById);
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
        // console.log(dataById);
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
        console.log("edit calculate");
    };
    // end edit

    const handleSuccess = (message: string) => {
        // setIsSuccess("");

        Swal.fire({
            title: "Success",
            text: "New Group Added",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
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
                });
            }
        });
        // setIsSuccess(message);
        // getPolicy();
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
                        console.log(res.data.status);
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
            // console.log("SELF_INSURED: 0");
            setDataById({
                ...dataById,
                SELF_INSURED: 0,
            });
        }
        // !flagSwitch ? console.log("SELF_INSURED: 0") : console.log("True");
        // setDataById({
        //     ...dataById,
        //     SELF_INSURED: values,
        // });
        // console.log('x: ', flagSwitch);
    }, [flagSwitch]);
    // const setSelfInsured = () => {
    //     console.log('x: ', flagSwitch);
    // }

    console.log("dataInsurer: ", dataInsurer);

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
                                    -- <i>Choose Status</i> --
                                </option>
                                {insurance?.map((status: any) => {
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
                                    autoComplete="edit_policy_number"
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
                                autoComplete="edit_the_insured"
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
                                    autoComplete="edit_policy_inception_date"
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
                                    autoComplete="edit_policy_due_date"
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
                                        <div className="col-span-4 ">
                                            <CurrencyInput
                                                id="self_insured"
                                                name="self_insured"
                                                value={dataById.SELF_INSURED}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                onValueChange={(values) =>
                                                    setDataById({
                                                        ...dataById,
                                                        SELF_INSURED: values,
                                                    })
                                                }
                                                className="block w-15  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                required
                                            />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Policy Premium
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
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
                                            Gross Premi
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Admin Cost
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Disc Broker
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Disc Consultation
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Disc Admin
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Nett Premi
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Fee Based Income
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Agen Commission
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Acquisition Costs
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.policy_premium?.map(
                                        (iP: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        {i + 1}
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            type="text"
                                                            id="coverage_name"
                                                            name="COVERAGE_NAME"
                                                            value={
                                                                iP.COVERAGE_NAME
                                                            }
                                                            onChange={(e) =>
                                                                editPolicyPremium(
                                                                    "COVERAGE_NAME",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <select
                                                            className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                iP.CURRENCY_ID
                                                            }
                                                            onChange={(e) => {
                                                                editPolicyPremium(
                                                                    "CURRENCY_ID",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                ),
                                                                    getSummaryPremi();
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
                                                                    currencies: any,
                                                                    i: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                i
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
                                                                iP.GROSS_PREMI
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "GROSS_PREMI",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="admin_cost"
                                                            name="ADMIN_COST"
                                                            value={
                                                                iP.ADMIN_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "ADMIN_COST",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_broker"
                                                            name="DISC_BROKER"
                                                            value={
                                                                iP.DISC_BROKER
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "DISC_BROKER",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_consultation"
                                                            name="DISC_CONSULTATION"
                                                            value={
                                                                iP.DISC_CONSULTATION
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "DISC_CONSULTATION",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_admin"
                                                            name="DISC_ADMIN"
                                                            value={
                                                                iP.DISC_ADMIN
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "DISC_ADMIN",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="nett_premi"
                                                            name="NETT_PREMI"
                                                            value={
                                                                iP.NETT_PREMI
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "NETT_PREMI",
                                                                    values,
                                                                    i
                                                                ),
                                                                    editCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="fee_based_income"
                                                            name="FEE_BASED_INCOME"
                                                            value={
                                                                iP.FEE_BASED_INCOME
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "FEE_BASED_INCOME",
                                                                    values,
                                                                    i
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
                                                                iP.AGENT_COMMISION
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "AGENT_COMMISION",
                                                                    values,
                                                                    i
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
                                                                iP.ACQUISITION_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editPolicyPremium(
                                                                    "ACQUISITION_COST",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        {dataById.policy_premium
                                                            .length !== 1 && (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                onClick={() => {
                                                                    deleteRowEditPolicyPremium(
                                                                        i
                                                                    );
                                                                    setFlagDelete(
                                                                        flagDelete +
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
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    {sumByCurrency?.map(
                                        (sum: any, i: number) => {
                                            if (sum.currency_id) {
                                                const curr = getCurrencyById(
                                                    sum.currency_id
                                                );
                                                return (
                                                    <>
                                                        <div className="w-40 mb-2 mt-1">
                                                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-sm">
                                                                            <div className="block w-80 mx-auto rounded-md border-0 py-1.5 text-gray-900  sm:text-sm sm:leading-6">
                                                                                Total
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                                            <div className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {
                                                                                    curr
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_gross_premi
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_admin_cost
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_disc_broker
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_disc_consultation
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_disc_admin
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_fee_based_income
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_agent_commision
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                                            <div className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    sum.sum_acquisition_cost
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                );
                                            }
                                        }
                                    )}
                                    <div className="w-40 mb-2 mt-2">
                                        <a
                                            href=""
                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                            onClick={(e) =>
                                                addRowEditPolicyPremium(e)
                                            }
                                        >
                                            + Add Row
                                        </a>
                                    </div>
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-3">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mt-4">
                                <div className="ml-6 mb-4">
                                    <h2 className=" text-lg font-semibold text-gray-900 dark:text-white">
                                        Summary Premium:
                                    </h2>
                                    <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
                                        {sumByCurrency?.map(
                                            (sum: any, i: number) => {
                                                if (
                                                    sum.currency_id &&
                                                    sum.currency_id != "null"
                                                ) {
                                                    const curr =
                                                        getCurrencyById(
                                                            sum.currency_id
                                                        );
                                                    return (
                                                        <li key={i}>
                                                            {curr +
                                                                " = " +
                                                                new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    sum.sum
                                                                )}
                                                        </li>
                                                    );
                                                }
                                            }
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Policy Installment Edit */}
                        <div className="mt-10 ml-4 mr-4">
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
                        </div>
                    </>
                }
            />
            {/* end modal edit */}

            {/* Modal Add Coverage */}
            <ModalToAdd
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Add Coverage"}
                url={`/policyCoverage`}
                data={dataPolicyCoverage}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="coverage_name"
                                    value="Coverage Name"
                                />
                                <TextInput
                                    id="coverage_name"
                                    type="text"
                                    name="coverage_name"
                                    value={
                                        dataPolicyCoverage.POLICY_COVERAGE_NAME
                                    }
                                    className=""
                                    autoComplete="coverage_name"
                                    onChange={(e) =>
                                        setDataPolicyCoverage({
                                            ...dataPolicyCoverage,
                                            POLICY_COVERAGE_NAME:
                                                e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Edit Coverage Name"}
                url={`/editManyCoverage`}
                data={dataEditPolicyCoverage}
                onSuccess={handleSuccess}
                // onSuccess={""}
                method={"post"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="inline-block min-w-full py-2 align-middle ">
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
                                                            editPolicyCoverage(i, e.target.value)
                                                        }
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Add Insurer"}
                url={`/insertManyInsurer`}
                data={dataInsurer}
                onSuccess={handleSuccess}
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
                                            autoComplete="insurer_number"
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
                                                                    id="radio1"
                                                                    name="ip_policy_leader"
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
                                                                        inputDataInsurer(
                                                                            "IP_POLICY_LEADER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "CONSULTANCY_FEE",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "ADMIN_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "DISC_BROKER",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "DISC_CONSULTATION",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "DISC_ADMIN",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    inputInsurerCoverage(
                                                                                        "NETT_PREMI",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                    // editCalculate(
                                                                                    //     j
                                                                                    // );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                        </td>
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
                    }),
                        setSumByCurrency([]);
                    setDataInsurer([]);
                }}
                title={"Edit Insurer"}
                url={`/editManyInsurer`}
                data={dataEditInsurer}
                onSuccess={handleSuccess}
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
                                            autoComplete="insurer_number"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                                    editInsurerCoverage(
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
                                                                                    editInsurerCoverage(
                                                                                        "ACQUISITION_COST",
                                                                                        values,
                                                                                        i,
                                                                                        j
                                                                                    );
                                                                                }}
                                                                                className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                    <div className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {policy.POLICY_STATUS_ID == 1 ? (
                                            <span>Current</span>
                                        ) : (
                                            <span>Lapse</span>
                                        )}
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

                            <div className="grid gap-4 mt-10">
                                <div>
                                    <div className="">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4 mb-3 w-fit border-b-2">
                                            Coverage
                                        </h3>
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleAddCoverage(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Add Coverage
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                                            onClick={() => {
                                                handleEditCoverage(
                                                    policy.POLICY_ID
                                                );
                                            }}
                                        >
                                            Edit Coverage
                                        </button>
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="w-56 border-collapse border border-gray-300">
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
                                                    {coverageName.map(
                                                        (
                                                            name: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 border border-gray-30 text-center">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border border-gray-30">
                                                                    {
                                                                        name.POLICY_COVERAGE_NAME
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 mt-10">
                                <div>
                                    <div className="">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4 mb-3 w-fit border-b-2">
                                            Insurer
                                        </h3>
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                handleAddInsurer();
                                            }}
                                        >
                                            Add Insurer
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                handleEditInsurer();
                                            }}
                                        >
                                            Edit Insurer
                                        </button>
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
                                                                    {
                                                                        val.POLICY_COST
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}
                </dl>
            </div>
            <div className="absolute bottom-3 left-4">
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
            </div>
        </>
        // </AuthenticatedLayout>
    );
}
