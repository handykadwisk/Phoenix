import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import Button from "@/Components/Button/Button";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { FormEvent, useEffect, useState } from "react";
import dateFormat from "dateformat";
import { InertiaFormProps } from "@inertiajs/react/types/useForm";
import Dropdown from "@/Components/Dropdown";
import { TrashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import ModalToAction from "@/Components/Modal/ModalToAction";
import Relation from "../Relation/Relation";
import Table from "@/Components/Table/Table";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import Badge from "@/Components/Badge";
import Pagination from "@/Components/Pagination";
import CurrencyInput from "react-currency-input-field";
import { count } from "console";
import ModalDetailInsurer from "./ModalDetailInsurer";
// import CurrencyFormat from "react-currency-format";

export default function InsurancePanelIndex({ auth }: PageProps) {
    // useEffect(() => {
    //     getInsurancePanel();
    // }, []);
    // var CurrencyFormat = require("react-currency-format");

    // <CurrencyFormat
    //     value={2456981}
    //     displayType={"text"}
    //     thousandSeparator={true}
    //     prefix={"$"}
    // />;
    // console.log("policyData", policyData);
    const [isCalculate, setIsCalculate] = useState<number>(0);
    const [sisaShare, setSisaShare] = useState<number>(0);
    const [dataInstallment, setDataInstallment] = useState<any>([]);
    const [dataInitialPremium, setDataInitialPremium] = useState<any>([]);
    const [test, setTest] = useState<string>("");
    // const [test, setTest] = useState<string>("aaa");
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [policyPremiums, setpolicyPremiums] = useState<any>([]);
    const [currencyPremiums, setCurrencyPremiums] = useState<any>([]);
    const [endorsementPremiums, setEndorsementPremiums] = useState<any>([]);
    const [endorsements, setEndorsements] = useState<any>([]);
    const [premium, setPremium] = useState<any>([]);
    // const { flash, policy, custom_menu }: any = usePage().props;
    const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { insurance, policies }: any = usePage().props;
    const { listInitialPremium }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [searchInsurer, setSearchInsurer] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // console.log("policy: ", policyData);

    useEffect(() => {
        if (
            Object.keys(searchInsurer).length == 0 ||
            searchInsurer.POLICY_ID == "" ||
            searchInsurer.POLICY_ID == ""
        ) {
            setEndorsements([]);
        } else {
            getInsurancePanel();
        }
    }, [searchInsurer]);

    const getInsurancePanel = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getInsurancePanel?${pageNumber}`, {
                policy_id: searchInsurer.POLICY_ID,
                client_id: searchInsurer.CLIENT_ID,
            })
            .then((res) => {
                // console.log(res);
                setInsurancePanels(res.data);
                setIsLoading(false);
                if (modal.search) {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // console.log(insurancePanels);
    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
        // { id: "3", stat: "Self Insured" },
    ];

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // const formatCurrency = new Intl.NumberFormat("id", {
    //     style:"decimal",
    //     // currency:"IDR"
    //     // maximumFractionDigits:4
    // })
    // formatCurrency.format(iP.IP_PIP_AFTER_DISC);

    // const { data, setData, errors, reset } = useForm({
    const [data, setData] = useState<any>({
        policy_id: "",
        endorsement_id: "",
        policy_initial_premium_id: "",
        ip_premium_type: "",
        insurance_id: "",
        ip_policy_leader: "",
        ip_currency_id: "",
        engineering_fee: "",
        ip_policy_initial_premium: "",
        ip_policy_share: "",
        ip_disc_insurance: "",
        ip_pip_after_disc: "",
        ip_policy_bf: "",
        ip_bf_amount: "",
        ip_vat: "",
        ip_pph_23: "",
        ip_net_bf: "",
        ip_payment_method: "",
        ip_vat_amount: "",
        installment: [],
    });
    const [dataById, setDataById] = useState<any>({
        POLICY_ID: "",
        ENDORSEMENT_ID: "",
        POLICY_INITIAL_PREMIUM_ID: "",
        IP_PREMIUM_TYPE: "",
        INSURANCE_ID: "",
        IP_POLICY_LEADER: "",
        IP_CURRENCY_ID: "",
        ENGINEERING_FEE: "",
        IP_POLICY_INITIAL_PREMIUM: "",
        IP_POLICY_SHARE: "",
        IP_DISC_INSURANCE: "",
        IP_PIP_AFTER_DISC: "",
        IP_POLICY_BF: "",
        IP_BF_AMOUNT: "",
        IP_VAT: "",
        IP_PPH_23: "",
        IP_NET_BF: "",
        IP_PAYMENT_METHOD: "",
        IP_VAT_AMOUNT: "",
        installment: [],
        deletedInstallment: [
            {
                INSTALLMENT_ID: "",
            },
        ],
    });

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        // reset();
        setData({
            policy_id: "",
            endorsement_id: "",
            policy_initial_premium_id: "",
            ip_premium_type: "",
            insurance_id: "",
            engineering_fee: "",
            ip_policy_leader: "",
            ip_currency_id: "",
            ip_policy_initial_premium: "",
            ip_policy_share: "",
            ip_disc_insurance: "",
            ip_pip_after_disc: "",
            ip_policy_bf: "",
            ip_bf_amount: "",
            ip_vat: "",
            ip_pph_23: "",
            ip_net_bf: "",
            ip_payment_method: "",
            ip_vat_amount: "",
            installment: [],
        });
        setIsSuccess(message);
    };

    const deletePolicy = (e: FormEvent, id: number, name: string) => {
        e.preventDefault();
        setDataToDeactivate({
            ...dataToDeactivate,
            id: id,
            name: name,
        });
        setModal({
            add: false,
            delete: true,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    };

    const handleSuccessDelete = (message: string) => {
        setIsSuccess("");
        setDataToDeactivate({
            id: "",
            notes: "",
            status: "",
            name: "",
        });
        getInsurancePanel();
        setIsSuccess(message);
        if (message) {
            setModal({
                ...modal,
                view: false,
            });
        }
    };

    const inputInstallment = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.installment];
        changeVal[i][name] = value;
        setData({
            ...data,
            installment: changeVal,
        });
    };

    const addRowInstallment = (e: FormEvent) => {
        e.preventDefault();

        setData({
            ...data,
            installment: [
                ...data.installment,
                {
                    installment_term: "",
                    installment_percentage: "",
                    installment_due_date: "",
                    installment_ar: "",
                    installment_ap: "",
                    installment_gross_bf: "",
                    installment_vat: "",
                    installment_pph_23: "",
                    installment_net_bf: "",
                    installment_admin_cost: "",
                    installment_policy_cost: "",
                },
            ],
        });
    };

    const deleteRowInstallment = (i: number) => {
        const val = [...data.installment];
        val.splice(i, 1);
        setData({ ...data, installment: val });
    };

    // edit
    const handleEditModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getInsurancePanel/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };
    const editInstallment = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.installment];
        changeVal[i][name] = value;
        setDataById({ ...dataById, installment: changeVal });
    };

    const addRowEditInstallment = (e: FormEvent) => {
        e.preventDefault();
        setDataById({
            ...dataById,
            installment: [
                ...dataById.installment,
                {
                    INSTALLMENT_TERM: "",
                    INSTALLMENT_PERCENTAGE: "",
                    INSTALLMENT_DUE_DATE: "",
                    INSTALLMENT_AR: "",
                    INSTALLMENT_AP: "",
                    INSTALLMENT_GROSS_BF: "",
                    INSTALLMENT_VAT: "",
                    INSTALLMENT_PPH_23: "",
                    INSTALLMENT_NET_BF: "",
                    INSTALLMENT_ADMIN_COST: "",
                    INSTALLMENT_POLICY_COST: "",
                },
            ],
        });
    };

    const deleteRowEditInstallment = (i: number) => {
        const val = [...dataById.installment];
        val.splice(i, 1);
        if (dataById.installment[i].installment_id !== null) {
            if (dataById.deletedInstallment) {
                setDataById({
                    ...dataById,
                    installment: val,
                    deletedInstallment: [
                        ...dataById.deletedInstallment,
                        {
                            INSTALLMENT_ID:
                                dataById.installment[i].INSTALLMENT_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    installment: val,
                    deletedInstallment: [
                        {
                            INSTALLMENT_ID:
                                dataById.installment[i].INSTALLMENT_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                installment: val,
            });
        }
    };
    // end edit

    // const [dataForView, setDataForView] = useState<any>([]);
    // view
    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getInsurancePanel/${id}`)
            .then((res) => {
                setDataById(res.data)
                // setDataForView(res.data);
                // console.log('dataForView: ',dataForView);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
        console.log("modal: ", modal);
    };
    // console.log("dataForView: ", dataForView);
    // end view

    const getEndorsement = async (policy_id: string) => {
        await axios
            .get(`/getEndorsementByPolicyId/${policy_id}`)
            .then((res) => {
                setEndorsements(res.data);
            })
            .catch((err) => console.log(err));
    };
    // console.log("setEndorsements: ", endorsements);

    const getPremium = async (policy_id: string, endorsement_id: string) => {
        await axios
            .post(`/getPremium?`, {
                policy_id: policy_id,
                endorsement_id: endorsement_id,
            })
            .then((res) => {
                // setDataInitialPremium(res.data);
                if (endorsement_id) {
                    // alert('a')
                    setpolicyPremiums([]);
                    setEndorsementPremiums(res.data);
                } else {
                    // alert("b");
                    setEndorsementPremiums([]);
                    setpolicyPremiums(res.data);
                }
            })
            .catch((err) => console.log(err));
    };

    // Get Currency on m_policy_premium or m_endorsement_premium
    const getCurrency = async (policy_id: string, endorsement_id: string) => {
        await axios
            .post(`/getCurrency?`, {
                policy_id: policy_id,
                endorsement_id: endorsement_id,
            })
            .then((res) => {
                setCurrencyPremiums(res.data);
            })
            .catch((err) => console.log(err));
    };
    console.log("currencyPremiums: ", currencyPremiums);
    // console.log("policyPremiums: ", policyPremiums);

    // jika tidak ada additional premium set ke 0
    // useEffect(() => {
    //     if (endorsementPremiums.length == 0 && data.endorsement_id) {
    //         setData({
    //             ...data,
    //             ip_policy_share: 0,
    //             ip_disc_insurance: 0,
    //             ip_policy_bf: 0,
    //         });
    //         setIsCalculate(isCalculate + 1);
    //         // console.log("xx: isCalculate + 1 : ", isCalculate + 1);
    //     }
    // }, [endorsementPremiums]);
    useEffect(() => {
        if (currencyPremiums.length == 0) {
            setData({
                ...data,
                ip_policy_share: 0,
                ip_disc_insurance: 0,
                ip_policy_bf: 0,
            });
            setIsCalculate(isCalculate + 1);
            // console.log("xx: isCalculate + 1 : ", isCalculate + 1);
        }
    }, [currencyPremiums]);

    const getPremiumById = async (policy_iniital_premium_id: string) => {
        await axios
            .post(`/getPremiumById?`, {
                policy_iniital_premium_id: policy_iniital_premium_id,
                premium_type: data.endorsement_id ? "additional" : "initial",
            })
            .then((res) => {
                // setDataInitialPremium(res.data);
                setPremium(res.data);
            })
            .catch((err) => console.log(err));
    };

    const getPremiumByCurrency = async (currency_id: string) => {
        await axios
            .post(`/getPremiumByCurrency?`, {
                id: data.endorsement_id ? data.endorsement_id : data.policy_id,
                currency_id: currency_id,
                premium_type: data.endorsement_id ? "additional" : "initial",
            })
            .then((res) => {
                console.log(
                    "premium by currency: ",
                    res.data.reduce(
                        (a: number, v: any) =>
                            (a = a + parseFloat(v.NETT_PREMI)),
                        0
                    )
                );
                setPremium(res.data);
            })
            .catch((err) => console.log(err));
    };
    console.log("premium: ", premium);

    const setPolicyShare = async (policy_iniital_premium_id: string) => {
        // console.log("policy_iniital_premium_id: ", policy_iniital_premium_id);
        await axios
            .get(`/getInsurancePanelByPremiumId/${policy_iniital_premium_id}`)
            .then((res) => {
                setSisaShare(
                    res.data.reduce(
                        (a: number, v: any) =>
                            100 - (a = a + v.IP_POLICY_SHARE),
                        0
                    )
                );
                // const sisaShare = res.data.reduce(
                //     (a: number, v: any) => 100 - (a = a + v.IP_POLICY_SHARE),
                //     0
                // );

                // console.log("setPolicyShare: ", sisaShare);
                // console.log("DATA: ", data);
            })
            .catch((err) => console.log(err));
    };
    // console.log("setPolicyShare: ", sisaShare);

    const getPolicyInstallment = async (
        policy_id: string,
        endorsement_id: string
    ) => {
        setDataInstallment([]);
        if (endorsement_id) {
            // console.log('a')
            // Untuk Endorsement
            await axios
                .get(`/getEndorsementInstallment/${endorsement_id}`)
                .then((res) => {
                    setDataInstallment(
                        res.data.map((inst: any) => {
                            return {
                                installment_term:
                                    inst.ENDORSEMENT_INSTALLMENT_TERM,
                                installment_percentage:
                                    inst.ENDORSEMENT_INSTALLMENT_RATE,
                                installment_due_date:
                                    inst.ENDORSEMENT_INSTALLMENT_DUE_DATE,
                                installment_ar: "",
                                installment_ap: "",
                                installment_gross_bf: "",
                                installment_vat: "",
                                installment_pph_23: "",
                                installment_net_bf: "",
                                installment_admin_cost: "",
                                installment_policy_cost: "",
                            };
                        })
                    );
                })
                .catch((err) => console.log(err));
        } else {
            // Untuk Policy
            // console.log("b");
            await axios
                .get(`/getPolicyInstallment/${policy_id}`)
                .then((res) => {
                    setDataInstallment(
                        res.data.map((inst: any) => {
                            return {
                                installment_term: inst.POLICY_INSTALLMENT_TERM,
                                installment_percentage:
                                    inst.POLICY_INSTALLMENT_PERCENTAGE,
                                installment_due_date: inst.INSTALLMENT_DUE_DATE,
                                installment_ar: "",
                                installment_ap: "",
                                installment_gross_bf: "",
                                installment_vat: "",
                                installment_pph_23: "",
                                installment_net_bf: "",
                                installment_admin_cost: "",
                                installment_policy_cost: "",
                            };
                        })
                    );
                })
                .catch((err) => console.log(err));
        }
    };

    const print = (event: any) => {
        setTest(event.target.value);
    };

    useEffect(() => {
        // console.log("premium: ", premium);
        // setData({
        //     ...data,
        //     // policy_id: dataInitialPremium.POLICY_ID,
        //     ip_policy_initial_premium: premium.NETT_PREMI
        //         ? premium.NETT_PREMI
        //         : premium.ADDITIONAL_PREMIUM,
        //     ip_currency_id: premium.CURRENCY_ID,
        // });
        setData({
            ...data,
            ip_policy_initial_premium: premium.reduce(
                (a: number, v: any) => (a = a + parseFloat(v.NETT_PREMI)),
                0
            ),
        });
        // console.log("data: ", data);
        // getPolicyInstallment(premium.POLICY_ID);
    }, [premium]);

    useEffect(() => {
        setData({
            ...data,
            installment: dataInstallment,
        });
    }, [dataInstallment]);

    // Start hitung otomatis
    useEffect(() => {
        inputCalculate();
    }, [isCalculate]);

    const inputCalculate = () => {
        // console.log("isCalculate: ", isCalculate);
        const iP = data.ip_policy_initial_premium;
        const discInsurance = data.ip_disc_insurance;
        const policyShare = data.ip_policy_share;
        let shareAmount: number = 0;
        let bfAmount: number = 0;
        let vatAmount: number = 0;
        let pphAmount: number = 0;
        let netBF: number = 0;
        // console.log(iP);

        if (iP && policyShare) {
            // console.log("a");
            if (discInsurance) {
                shareAmount =
                    (iP * policyShare) / 100 -
                    (((iP * policyShare) / 100) * discInsurance) / 100;
            } else {
                shareAmount = (iP * policyShare) / 100;
            }
        }

        // BF Amount
        if (data.ip_pip_after_disc && data.ip_policy_bf) {
            if (data.ip_vat == 1) {
                bfAmount =
                    (data.ip_pip_after_disc * (data.ip_policy_bf / 1.022)) /
                    100;
            } else {
                bfAmount = (data.ip_pip_after_disc * data.ip_policy_bf) / 100;
            }
        }

        // vat
        if (bfAmount) {
            vatAmount = (bfAmount * 2.2) / 100;
            pphAmount = (bfAmount * -2) / 100;
            netBF = bfAmount + pphAmount;
        }

        setData({
            ...data,
            ip_pip_after_disc: shareAmount,
            ip_bf_amount: bfAmount.toFixed(2),
            ip_vat_amount: vatAmount.toFixed(2),
            ip_pph_23: pphAmount.toFixed(2),
            ip_net_bf: netBF.toFixed(2),
        });

        calculateInstallment();
    };
    const calculateInstallment = () => {
        // Detail Installment
        const prev: any = [...data.installment];
        prev.map((installment: any, i: number) => {
            const ar =
                (data.ip_pip_after_disc * installment.installment_percentage) /
                100;
            const grossBf =
                data.ip_vat == 1
                    ? (ar * (data.ip_policy_bf / 1.022)) / 100
                    : (ar * data.ip_policy_bf) / 100;
            const vat = (grossBf * 2.2) / 100;
            const pph23 = (grossBf * -2) / 100;
            const netBF = grossBf + pph23;
            const ap = ar - netBF + installment.installment_policy_cost;
            prev[i]["installment_admin_cost"] = 0;
            prev[i]["installment_policy_cost"] = 0;
            prev[i]["installment_ar"] = ar;
            prev[i]["installment_gross_bf"] = grossBf;
            prev[i]["installment_vat"] = vat;
            prev[i]["installment_pph_23"] = pph23;
            prev[i]["installment_net_bf"] = netBF;
            prev[i]["installment_ap"] = ap;
        });
    };

    const reCalculateInstallment = (name: string, value: any, i: number) => {
        // console.log('data: ', data.installment)
        const changeVal: any = [...data.installment];
        // console.log('value: ',value)
        // console.log("changeVal: ", changeVal);
        const ap =
            parseFloat(changeVal[i].installment_ar) -
            parseFloat(changeVal[i].installment_net_bf) +
            // parseFloat(value);
            parseFloat(changeVal[i].installment_admin_cost) +
            parseFloat(changeVal[i].installment_policy_cost);
        // console.log('ap: ',ap)
        changeVal[i]["installment_ap"] = ap;
        setData({
            ...data,
            installment: changeVal,
        });
    };
    // End hitung otomatis

    // console.log("dataNew: ", data);

    return (
        <AuthenticatedLayout user={auth.user} header={"Insurer"}>
            <Head title="Insurer" />
            <ModalToAdd
                show={modal.add}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    handleSuccess("");
                    setCurrencyPremiums([]);
                }}
                title={"Register Insurer"}
                url={`/insurancePanel`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="policy_number"
                                    value="Policy Number"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.policy_id}
                                    // onChange={(e) => {
                                    //     setData({
                                    //         ...data,
                                    //         policy_initial_premium_id:
                                    //             e.target.value,
                                    //     });
                                    //     getInitialPremium(e.target.value);
                                    // }}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            policy_id: e.target.value,
                                            ip_premium_type: data.endorsement_id
                                                ? 2
                                                : 1,
                                        }),
                                            getEndorsement(e.target.value),
                                            // getPremium(e.target.value, ""),
                                            getCurrency(e.target.value, ""),
                                            getPolicyInstallment(
                                                e.target.value,
                                                ""
                                            );
                                    }}
                                >
                                    <option value={""}>
                                        -- <i>Choose Policy Number</i> --
                                    </option>
                                    {policies.map((policy: any, i: number) => {
                                        return (
                                            <option
                                                key={i}
                                                value={policy.POLICY_ID}
                                            >
                                                {policy.POLICY_NUMBER}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="endorsement_number"
                                    value="Endorsement Number"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.endorsement_id}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            endorsement_id: e.target.value,
                                            ip_premium_type: e.target.value
                                                ? 2
                                                : 1,
                                        }),
                                            // getPremium(
                                            //     data.policy_id,
                                            //     e.target.value
                                            // ),
                                            getCurrency(
                                                data.policy_id,
                                                e.target.value
                                            ),
                                            getPolicyInstallment(
                                                data.policy_id,
                                                e.target.value
                                            ),
                                            getEndorsement(data.policy_id);
                                    }}
                                >
                                    <option value={""}>
                                        -- <i>Choose Endorsement Number</i> --
                                    </option>
                                    {endorsements.map(
                                        (endorsement: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        endorsement.ENDORSEMENT_ID
                                                    }
                                                >
                                                    {
                                                        endorsement.ENDORSEMENT_NUMBER
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="premium_type"
                                    value="Premium Type"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={data.ip_premium_type}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ip_premium_type: e.target.value,
                                        });
                                        // getPremium(
                                        //     data.policy_id,
                                        //     e.target.value
                                        // );
                                    }}
                                    disabled={true}
                                >
                                    <option value={""}>
                                        -- <i>Choose Status</i> --
                                    </option>
                                    {premiumType?.map((status: any) => {
                                        return (
                                            <option value={status.id}>
                                                {status.stat}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="insurance_id"
                                    value="Insurance"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.insurance_id}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            insurance_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose Client Name</i> --
                                    </option>
                                    {insurance.map(
                                        (insurances: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        insurances.RELATION_ORGANIZATION_ID
                                                    }
                                                >
                                                    {
                                                        insurances.RELATION_ORGANIZATION_NAME
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
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
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    ip_policy_leader:
                                                        e.target.value,
                                                })
                                            }
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radio1"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
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
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    ip_policy_leader:
                                                        e.target.value,
                                                })
                                            }
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radio2"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            no
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="currency_id"
                                    value="Currency"
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.ip_currency_id}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ip_currency_id: e.target.value,
                                        }),
                                            getPremiumByCurrency(
                                                e.target.value
                                            );
                                    }}
                                >
                                    <option value={""}>
                                        -- <i>Choose Currency</i> --
                                    </option>
                                    {currencyPremiums.length > 0
                                        ? currencyPremiums.map(
                                              (curr: any, i: number) => {
                                                  return (
                                                      <option
                                                          key={i}
                                                          value={
                                                              curr.CURRENCY_ID
                                                          }
                                                      >
                                                          {
                                                              curr.currency
                                                                  .CURRENCY_SYMBOL
                                                          }
                                                      </option>
                                                  );
                                              }
                                          )
                                        : ""}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_initial_premium"
                                    value="Premium"
                                />
                                <CurrencyInput
                                    id="ip_policy_initial_premium"
                                    name="ip_policy_initial_premium"
                                    value={data.ip_policy_initial_premium}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_policy_initial_premium: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_share"
                                    value="Policy Share (%)"
                                />
                                <CurrencyInput
                                    id="ip_policy_share"
                                    name="ip_policy_share"
                                    value={data.ip_policy_share}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_policy_share: values,
                                        });
                                        setIsCalculate(isCalculate + 1);
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_pip_after_disc"
                                    value="PIP After Disc (Share)"
                                />
                                <CurrencyInput
                                    id="ip_pip_after_disc"
                                    name="ip_pip_after_disc"
                                    value={data.ip_pip_after_disc}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_pip_after_disc: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_bf"
                                    value="Policy BF (%)"
                                />
                                <CurrencyInput
                                    id="ip_policy_bf"
                                    name="ip_policy_bf"
                                    value={data.ip_policy_bf}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_policy_bf: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="vat" value="VAT" />
                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                    <div className="flex items-center">
                                        <input
                                            required
                                            id="radioVat1"
                                            name="ip_vat"
                                            type="radio"
                                            value={1}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    ip_vat: e.target.value,
                                                }),
                                                    setIsCalculate(
                                                        isCalculate + 1
                                                    );
                                            }}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radioVat1"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Include VAT
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            required
                                            id="radioVat2"
                                            name="ip_vat"
                                            type="radio"
                                            value={2}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    ip_vat: e.target.value,
                                                }),
                                                    setIsCalculate(
                                                        isCalculate + 1
                                                    );
                                            }}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radioVat2"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Exclude VAT
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <InputLabel
                                        htmlFor="engineering_fee"
                                        value="Engineering Fee(%)"
                                    />
                                    <CurrencyInput
                                        id="engineering_fee"
                                        name="engineering_fee"
                                        value={data.engineering_fee}
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(values) => {
                                            setData({
                                                ...data,
                                                engineering_fee: values,
                                            });
                                        }}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="ip_bf_amount"
                                    value="BF Amount"
                                />
                                <CurrencyInput
                                    id="ip_bf_amount"
                                    name="ip_bf_amount"
                                    value={data.ip_bf_amount}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_bf_amount: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_vat_amount"
                                    value="VAT (2.2%)"
                                />
                                <CurrencyInput
                                    id="ip_vat_amount"
                                    name="ip_vat_amount"
                                    value={data.ip_vat_amount}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_vat_amount: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_pph_23"
                                    value="PPh 23 (2%)"
                                />
                                <CurrencyInput
                                    id="ip_pph_23"
                                    name="ip_pph_23"
                                    value={data.ip_pph_23}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_pph_23: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_net_bf"
                                    value="Net BF"
                                />
                                <CurrencyInput
                                    id="ip_net_bf"
                                    name="ip_net_bf"
                                    value={data.ip_net_bf}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setData({
                                            ...data,
                                            ip_net_bf: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                Installment
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            No.
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Term rate (%)
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Due Date
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Gross Premi/AR
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Gross BF
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            VAT
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            PPh 23
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Net BF
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Admin Cost
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Policy Cost
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Premium Nett/AP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.installment?.map(
                                        (inst: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <TextInput
                                                            id="installment_term"
                                                            name="installment_term"
                                                            value={
                                                                inst.installment_term
                                                            }
                                                            onChange={(e) =>
                                                                inputInstallment(
                                                                    "installment_term",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_percentage"
                                                            name="installment_percentage"
                                                            value={
                                                                inst.installment_percentage
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_percentage",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <TextInput
                                                            id="installment_due_date"
                                                            name="installment_due_date"
                                                            value={
                                                                inst.installment_due_date
                                                            }
                                                            type="date"
                                                            onChange={(e) =>
                                                                inputInstallment(
                                                                    "installment_due_date",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_ar"
                                                            name="installment_ar"
                                                            value={
                                                                inst.installment_ar
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_ar",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_gross_bf"
                                                            name="installment_gross_bf"
                                                            value={
                                                                inst.installment_gross_bf
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_gross_bf",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_vat"
                                                            name="installment_vat"
                                                            value={
                                                                inst.installment_vat
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_vat",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_pph_23"
                                                            name="installment_pph_23"
                                                            value={
                                                                inst.installment_pph_23
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_pph_23",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_net_bf"
                                                            name="installment_net_bf"
                                                            value={
                                                                inst.installment_net_bf
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_net_bf",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_admin_cost"
                                                            name="installment_admin_cost"
                                                            value={
                                                                inst.installment_admin_cost
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_admin_cost",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_policy_cost"
                                                            name="installment_policy_cost"
                                                            value={
                                                                inst.installment_policy_cost
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_policy_cost",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_ap"
                                                            name="installment_ap"
                                                            value={
                                                                inst.installment_ap
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputInstallment(
                                                                    "installment_ap",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
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
                    </>
                }
            />
            {/* end Modal add Policy */}

            {/* modal detail */}
            <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Detail Insurer"}
                url={""}
                data={""}
                // addOns={""}

                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                // editButtonName={"Edit"}
                // deleteButtonName={"Delete"}
                body={
                    <>
                        <ModalDetailInsurer
                            onDeleteSuccess={handleSuccessDelete}
                            insurer={dataById}
                            listPolicy={policies}
                            // endorsements={endorsements}
                            insurance={insurance}
                            currency={currency}
                        />
                    </>
                }
            />
            {/* modal end detail  */}

            {/* modal delete policy */}
            <ModalToAction
                show={modal.delete}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Delete Policy"}
                url={`/deactivatePolicy/${dataToDeactivate.id}`}
                method={"patch"}
                data={dataToDeactivate}
                onSuccess={handleSuccessDelete}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="For Policy:" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={dataToDeactivate.name}
                                className="bg-gray-200"
                                readOnly
                            />
                        </div>
                    </>
                }
            />
            {/* end modal delete policy */}

            <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="p-6 text-gray-900 mb-60">
                        <div className="rounded-md bg-white pt-6 pl-10 pr-10 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                            {/* header table */}
                            <div className="md:grid md:grid-cols-8 md:gap-4">
                                <Button
                                    className="text-sm w-full lg:w-1/2 font-semibold px-6 py-1.5 mb-4 md:col-span-2"
                                    onClick={() => {
                                        // setSwitchPage(false);
                                        setModal({
                                            add: true,
                                            delete: false,
                                            edit: false,
                                            view: false,
                                            document: false,
                                            search: false,
                                        });
                                    }}
                                >
                                    {"Register Insurer"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 xs:gap-0 lg:grid-cols-3 lg:grid-4 lg:gap-4">
                            <div className="bg-white rounded-md p-10 shdow-md mb-5 lg:mb-0">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="search_policy_number"
                                                value="Policy Number"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={searchInsurer.POLICY_ID}
                                                onChange={(e) =>
                                                    setSearchInsurer({
                                                        ...searchInsurer,
                                                        POLICY_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option value={""}>
                                                    -- <i>Choose Policy</i> --
                                                </option>
                                                {policies?.map(
                                                    (policy: any) => {
                                                        return (
                                                            <option
                                                                value={
                                                                    policy.POLICY_ID
                                                                }
                                                            >
                                                                {
                                                                    policy.POLICY_NUMBER
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="search_relation"
                                                value="Client Name"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={searchInsurer.CLIENT_ID}
                                                onChange={(e) =>
                                                    setSearchInsurer({
                                                        ...searchInsurer,
                                                        CLIENT_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option value={""}>
                                                    -- <i>Choose Client</i> --
                                                </option>
                                                {insurance?.map(
                                                    (status: any) => {
                                                        return (
                                                            <option
                                                                value={
                                                                    status.RELATION_ORGANIZATION_ID
                                                                }
                                                            >
                                                                {
                                                                    status.RELATION_ORGANIZATION_NAME
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md col-span-2 p-10">
                                <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                                    <table className="w-full table-auto divide-y divide-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                <TableTH
                                                    className={
                                                        "max-w-[0px] text-center"
                                                    }
                                                    label={"No"}
                                                />
                                                <TableTH
                                                    className={"min-w-[50px]"}
                                                    label={"Insurer"}
                                                />
                                                <TableTH
                                                    className={"min-w-[50px]"}
                                                    label={"Share"}
                                                />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {insurancePanels.data?.map(
                                                (iP: any, i: number) => {
                                                    return (
                                                        <tr
                                                            key={i}
                                                            className={
                                                                i % 2 === 0
                                                                    ? "cursor-pointer"
                                                                    : "bg-gray-100 cursor-pointer"
                                                            }
                                                            onDoubleClick={(
                                                                e
                                                            ) =>
                                                                handleViewModal(
                                                                    e,
                                                                    iP.IP_ID
                                                                )
                                                            }
                                                        >
                                                            <TableTD
                                                                value={
                                                                    insurancePanels.from +
                                                                    i
                                                                }
                                                                className={
                                                                    "text-center"
                                                                }
                                                            />
                                                            <TableTD
                                                                value={
                                                                    <>
                                                                        {/* <a
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                // handleEditModal(
                                                                                //     e,
                                                                                //     iP.IP_ID
                                                                                // )
                                                                                handleViewModal(
                                                                                    e,
                                                                                    iP.IP_ID
                                                                                )
                                                                            }
                                                                        > */}
                                                                        {
                                                                            iP
                                                                                .insurance
                                                                                .RELATION_ORGANIZATION_NAME
                                                                        }
                                                                        <br />
                                                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-small text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                            {
                                                                                iP
                                                                                    .policy
                                                                                    .POLICY_NUMBER
                                                                            }
                                                                        </span>
                                                                        {/* </a> */}
                                                                    </>
                                                                }
                                                                className={""}
                                                            />
                                                            <TableTD
                                                                value={
                                                                    <>
                                                                        {
                                                                            iP.IP_POLICY_SHARE +
                                                                                " %"
                                                                            // formatCurrency.format(
                                                                            //     iP.IP_PIP_AFTER_DISC
                                                                            // )
                                                                        }
                                                                    </>
                                                                }
                                                                className={""}
                                                            />
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    links={insurancePanels.links}
                                    fromData={insurancePanels.from}
                                    toData={insurancePanels.to}
                                    totalData={insurancePanels.total}
                                    clickHref={(url: string) =>
                                        getInsurancePanel(url.split("?").pop())
                                    }
                                />
                            </div>
                        </div>
                        {/* table page*/}
                    </div>
                </div>
            </div>

            {/* end table relaton in here */}
            {/* <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-0">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <div className="text-gray-900">
                            
                        </div>
                    </div>
                </div>
            </div> */}
        </AuthenticatedLayout>
    );
}
