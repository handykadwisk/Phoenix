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

export default function PolicyIndex({ auth }: PageProps) {
    useEffect(() => {
        getInsurancePanel();
    }, []);

    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const { flash, policy, custom_menu }: any = usePage().props;
    const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { insurance }: any = usePage().props;
    const { listInitialPremium }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [searchPolicy, setSearchPolicy] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getInsurancePanel = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getInsurancePanel?${pageNumber}`, {
                policy_number: searchPolicy.policy_number,
                // policy_insurance_type_name:
                //     searchPolicy.policy_insurance_type_name,
                // policy_broker_name: searchPolicy.policy_broker_name,
                // policy_inception_date: searchPolicy.policy_inception_date,
                // policy_due_date: searchPolicy.policy_due_date,
                // policy_status_id: searchPolicy.policy_status_id,
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

    console.log(insurancePanels);
    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
        { id: "3", stat: "Self Insured" },
    ];

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const { data, setData, errors, reset } = useForm({
        policy_id: "",
        policy_initial_premium_id: "",
        ip_premium_type: "",
        insurance_id: "",
        ip_policy_leader: "",
        ip_currency_id: "",
        ip_term: "",
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
        installment: [
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
    const [dataById, setDataById] = useState<any>({
        POLICY_ID: "",
        POLICY_INITIAL_PREMIUM_ID: "",
        IP_PREMIUM_TYPE: "",
        INSURANCE_ID: "",
        IP_POLICY_LEADER: "",
        IP_CURRENCY_ID: "",
        IP_TERM: "",
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
        installment: [
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
        deletedInstallment: [
            {
                INSTALLMENT_ID: "",
            },
        ],
    });
    // console.log(dataById);
    console.log(insurancePanels.data);

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            policy_id: "",
            policy_initial_premium_id: "",
            ip_premium_type: "",
            insurance_id: "",
            ip_policy_leader: "",
            ip_currency_id: "",
            ip_term: "",
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
            installment: [
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
    };

    const inputInstallment = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.installment];
        changeVal[i][name] = value;
        setData("installment", changeVal);
    };

    const addRowInstallment = (e: FormEvent) => {
        e.preventDefault();
        setData("installment", [
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
        ]);
    };
    // console.log(insuranceType);

    const deleteRowInstallment = (i: number) => {
        const val = [...data.installment];
        val.splice(i, 1);
        setData("installment", val);
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
        // console.log(dataById);
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
        if (
            dataById.installment[i].installment_id !==
            null
        ) {
            if (dataById.deletedInstallment) {
                // alert("a");
                setDataById({
                    ...dataById,
                    installment: val,
                    deletedInstallment: [
                        ...dataById.deletedInstallment,
                        {
                            INSTALLMENT_ID:
                                dataById.installment[i]
                                    .INSTALLMENT_ID,
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

    // view
    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getInsurancePanel/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };
    // end view

    return (
        <AuthenticatedLayout user={auth.user} header={"Insurance Panel"}>
            <Head title="Insurance Panel" />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-0">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* button add Policy */}
                            {/* <Button
                                className="text-sm font-semibold px-3 py-2 mb-5"
                                onClick={() =>
                                    setModal({
                                        add: true,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                        search: false,
                                    })
                                }
                            >
                                Create Policy
                            </Button> */}
                            {/* modal add policy */}
                            <ModalToAdd
                                show={modal.add}
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
                                title={"Add Insurance Panel"}
                                url={`/insurancePanel`}
                                data={data}
                                onSuccess={handleSuccess}
                                body={
                                    <>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="policy_number"
                                                    value="Policy Number"
                                                />
                                                <select
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={data.policy_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option>
                                                        --{" "}
                                                        <i>
                                                            Choose Policy Number
                                                        </i>{" "}
                                                        --
                                                    </option>
                                                    {listInitialPremium.map(
                                                        (
                                                            initialPremium: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    value={
                                                                        initialPremium.POLICY_ID
                                                                    }
                                                                >
                                                                    {initialPremium.POLICY_NUMBER +
                                                                        " - " +
                                                                        initialPremium.CURRENCY_SYMBOL}
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
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_premium_type",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option>
                                                        -- <i>Choose Status</i>{" "}
                                                        --
                                                    </option>
                                                    {premiumType?.map(
                                                        (status: any) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        status.id
                                                                    }
                                                                >
                                                                    {
                                                                        status.stat
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="insurance_id"
                                                    value="Insurance"
                                                />
                                                <select
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={data.insurance_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "insurance_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option>
                                                        --{" "}
                                                        <i>
                                                            Choose Client Name
                                                        </i>{" "}
                                                        --
                                                    </option>
                                                    {insurance.map(
                                                        (
                                                            insurances: any,
                                                            i: number
                                                        ) => {
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
                                                            value={
                                                                // data.ip_policy_leader
                                                                1
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "ip_policy_leader",
                                                                    e.target
                                                                        .value
                                                                )
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
                                                            value={
                                                                // data.ip_policy_leader
                                                                0
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "ip_policy_leader",
                                                                    e.target
                                                                        .value
                                                                )
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
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_term"
                                                    value="Installment"
                                                />
                                                <TextInput
                                                    id="ip_term"
                                                    type="text"
                                                    name="ip_term"
                                                    value={data.ip_term}
                                                    className=""
                                                    autoComplete="ip_term"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_term",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_policy_initial_premium"
                                                    value="Policy Initial Premium"
                                                />
                                                <TextInput
                                                    id="ip_policy_initial_premium"
                                                    type="text"
                                                    name="ip_policy_initial_premium"
                                                    value={
                                                        data.ip_policy_initial_premium
                                                    }
                                                    className=""
                                                    autoComplete="ip_policy_initial_premium"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_policy_initial_premium",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_policy_share"
                                                    value="Policy Share (%)"
                                                />
                                                <TextInput
                                                    id="ip_policy_share"
                                                    type="text"
                                                    name="ip_policy_share"
                                                    value={data.ip_policy_share}
                                                    className=""
                                                    autoComplete="ip_policy_share"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_policy_share",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_disc_insurance"
                                                    value="Discount Insurance (%)"
                                                />
                                                <TextInput
                                                    id="ip_disc_insurance"
                                                    type="text"
                                                    name="ip_disc_insurance"
                                                    value={
                                                        data.ip_disc_insurance
                                                    }
                                                    className=""
                                                    autoComplete="ip_disc_insurance"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_disc_insurance",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_pip_after_disc"
                                                    value="PIP After Disc (Share)"
                                                />
                                                <TextInput
                                                    id="ip_pip_after_disc"
                                                    type="text"
                                                    name="ip_pip_after_disc"
                                                    value={
                                                        data.ip_pip_after_disc
                                                    }
                                                    className=""
                                                    autoComplete="ip_pip_after_disc"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_pip_after_disc",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_policy_bf"
                                                    value="Policy BF (%)"
                                                />
                                                <TextInput
                                                    id="ip_policy_bf"
                                                    type="text"
                                                    name="ip_policy_bf"
                                                    value={data.ip_policy_bf}
                                                    className=""
                                                    autoComplete="ip_policy_bf"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_policy_bf",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_bf_amount"
                                                    value="BF Amount"
                                                />
                                                <TextInput
                                                    id="ip_bf_amount"
                                                    type="text"
                                                    name="ip_bf_amount"
                                                    value={data.ip_bf_amount}
                                                    className=""
                                                    autoComplete="ip_bf_amount"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_bf_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_vat_amount"
                                                    value="VAT (2.2%)"
                                                />
                                                <TextInput
                                                    id="ip_vat_amount"
                                                    type="text"
                                                    name="ip_vat_amount"
                                                    value={data.ip_vat_amount}
                                                    className=""
                                                    autoComplete="ip_vat_amount"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_vat_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_pph_23"
                                                    value="PPh 23 (2%)"
                                                />
                                                <TextInput
                                                    id="ip_pph_23"
                                                    type="text"
                                                    name="ip_pph_23"
                                                    value={data.ip_pph_23}
                                                    className=""
                                                    autoComplete="ip_pph_23"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_pph_23",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="ip_net_bf"
                                                    value="Net BF"
                                                />
                                                <TextInput
                                                    id="ip_net_bf"
                                                    type="text"
                                                    name="ip_net_bf"
                                                    value={data.ip_net_bf}
                                                    className=""
                                                    autoComplete="ip_net_bf"
                                                    onChange={(e) =>
                                                        setData(
                                                            "ip_net_bf",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Installment
                                            </h3>
                                            <hr className="my-3" />
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                                            Premium Net/AP
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.installment?.map(
                                                        (
                                                            inst: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_term"
                                                                            name="installment_term"
                                                                            value={
                                                                                inst.installment_term
                                                                                // i +
                                                                                // 1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_term",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_percentage"
                                                                            name="installment_percentage"
                                                                            value={
                                                                                inst.installment_percentage
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_percentage",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_due_date"
                                                                            name="installment_due_date"
                                                                            value={
                                                                                inst.installment_due_date
                                                                            }
                                                                            type="date"
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_due_date",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_ar"
                                                                            name="installment_ar"
                                                                            value={
                                                                                inst.installment_ar
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_ar",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_gross_bf"
                                                                            name="installment_gross_bf"
                                                                            value={
                                                                                inst.installment_gross_bf
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_gross_bf",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_vat"
                                                                            name="installment_vat"
                                                                            value={
                                                                                inst.installment_vat
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_vat",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_pph_23"
                                                                            name="installment_pph_23"
                                                                            value={
                                                                                inst.installment_pph_23
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_pph_23",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_net_bf"
                                                                            name="installment_net_bf"
                                                                            value={
                                                                                inst.installment_net_bf
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_net_bf",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_admin_cost"
                                                                            name="installment_admin_cost"
                                                                            value={
                                                                                inst.installment_admin_cost
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_admin_cost",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_policy_cost"
                                                                            name="installment_policy_cost"
                                                                            value={
                                                                                inst.installment_policy_cost
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_policy_cost",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_ap"
                                                                            name="installment_ap"
                                                                            value={
                                                                                inst.installment_ap
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInstallment(
                                                                                    "installment_ap",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>

                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {data
                                                                            .installment
                                                                            .length !==
                                                                            1 && (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                                onClick={() =>
                                                                                    deleteRowInstallment(
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
                                                            className="text-xs mt-1 text-primary ms-1 w-auto"
                                                            onClick={(e) =>
                                                                addRowInstallment(
                                                                    e
                                                                )
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
                            {/* end Modal add Policy */}

                            {/* modal edit */}
                            <ModalToAction
                                show={modal.edit}
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
                                title={"Edit Insurance Panel"}
                                url={`/editInsurancePanel/${dataById.IP_ID}`}
                                data={dataById}
                                onSuccess={handleSuccess}
                                method={"patch"}
                                headers={null}
                                submitButtonName={"Submit"}
                                body={
                                    <>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="policy_number"
                                                value="Policy Number"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={dataById.POLICY_ID}
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        POLICY_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option>
                                                    --{" "}
                                                    <i>Choose Policy Number</i>{" "}
                                                    --
                                                </option>
                                                {listInitialPremium.map(
                                                    (
                                                        initialPremium: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    initialPremium.POLICY_ID
                                                                }
                                                            >
                                                                {initialPremium.POLICY_NUMBER +
                                                                    " - " +
                                                                    initialPremium.CURRENCY_SYMBOL}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="premium_type"
                                                value="Premium Type"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={dataById.IP_PREMIUM_TYPE}
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_PREMIUM_TYPE:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Status</i> --
                                                </option>
                                                {premiumType?.map(
                                                    (status: any) => {
                                                        return (
                                                            <option
                                                                value={
                                                                    status.id
                                                                }
                                                            >
                                                                {status.stat}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="insurance_id"
                                                value="Insurance"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={dataById.INSURANCE_ID}
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        INSURANCE_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Client Name</i>{" "}
                                                    --
                                                </option>
                                                {insurance.map(
                                                    (
                                                        insurances: any,
                                                        i: number
                                                    ) => {
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
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="policy_leader"
                                                value="Policy Leader"
                                            />
                                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                <div className="flex items-center">
                                                    <input
                                                        id="radio1"
                                                        name="ip_policy_leader"
                                                        type="radio"
                                                        value={
                                                            dataById.IP_POLICY_LEADER
                                                            // 1
                                                        }
                                                        onChange={(e) =>
                                                            setDataById({
                                                                ...dataById,
                                                                IP_POLICY_LEADER:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        defaultChecked={
                                                            dataById.IP_POLICY_LEADER ==
                                                            "1"
                                                                ? true
                                                                : false
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
                                                        value={
                                                            dataById.IP_POLICY_LEADER
                                                            // 0
                                                        }
                                                        onChange={(e) =>
                                                            setDataById({
                                                                ...dataById,
                                                                IP_POLICY_LEADER:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        defaultChecked={
                                                            dataById.IP_POLICY_LEADER ==
                                                            "0"
                                                                ? true
                                                                : false
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
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_term"
                                                value="Installment"
                                            />
                                            <TextInput
                                                id="ip_term"
                                                type="text"
                                                name="ip_term"
                                                value={dataById.IP_TERM}
                                                className=""
                                                autoComplete="ip_term"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_TERM: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_policy_initial_premium"
                                                value="Policy Initial Premium"
                                            />
                                            <TextInput
                                                id="ip_policy_initial_premium"
                                                type="text"
                                                name="ip_policy_initial_premium"
                                                value={
                                                    dataById.IP_POLICY_INITIAL_PREMIUM
                                                }
                                                className=""
                                                autoComplete="ip_policy_initial_premium"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_POLICY_INITIAL_PREMIUM:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_policy_share"
                                                value="Policy Share (%)"
                                            />
                                            <TextInput
                                                id="ip_policy_share"
                                                type="text"
                                                name="ip_policy_share"
                                                value={dataById.IP_POLICY_SHARE}
                                                className=""
                                                autoComplete="ip_policy_share"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_POLICY_SHARE:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_disc_insurance"
                                                value="Discount Insurance (%)"
                                            />
                                            <TextInput
                                                id="ip_disc_insurance"
                                                type="text"
                                                name="ip_disc_insurance"
                                                value={
                                                    dataById.IP_DISC_INSURANCE
                                                }
                                                className=""
                                                autoComplete="ip_disc_insurance"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_DISC_INSURANCE:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_pip_after_disc"
                                                value="PIP After Disc (Share)"
                                            />
                                            <TextInput
                                                id="ip_pip_after_disc"
                                                type="text"
                                                name="ip_pip_after_disc"
                                                value={
                                                    dataById.IP_PIP_AFTER_DISC
                                                }
                                                className=""
                                                autoComplete="ip_pip_after_disc"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_PIP_AFTER_DISC:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_policy_bf"
                                                value="Policy BF (%)"
                                            />
                                            <TextInput
                                                id="ip_policy_bf"
                                                type="text"
                                                name="ip_policy_bf"
                                                value={dataById.IP_POLICY_BF}
                                                className=""
                                                autoComplete="ip_policy_bf"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_POLICY_BF:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_bf_amount"
                                                value="BF Amount"
                                            />
                                            <TextInput
                                                id="ip_bf_amount"
                                                type="text"
                                                name="ip_bf_amount"
                                                value={dataById.IP_BF_AMOUNT}
                                                className=""
                                                autoComplete="ip_bf_amount"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_BF_AMOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_vat_amount"
                                                value="VAT (2.2%)"
                                            />
                                            <TextInput
                                                id="ip_vat_amount"
                                                type="text"
                                                name="ip_vat_amount"
                                                value={dataById.IP_VAT_AMOUNT}
                                                className=""
                                                autoComplete="ip_vat_amount"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_VAT_AMOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_pph_23"
                                                value="PPh 23 (2%)"
                                            />
                                            <TextInput
                                                id="ip_pph_23"
                                                type="text"
                                                name="ip_pph_23"
                                                value={dataById.IP_PPH_23}
                                                className=""
                                                autoComplete="ip_pph_23"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_PPH_23:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="ip_net_bf"
                                                value="Net BF"
                                            />
                                            <TextInput
                                                id="ip_net_bf"
                                                type="text"
                                                name="ip_net_bf"
                                                value={dataById.IP_NET_BF}
                                                className=""
                                                autoComplete="ip_net_bf"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        IP_NET_BF:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="mt-10">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Installment
                                            </h3>
                                            <hr className="my-3" />
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                                            Premium Net/AP
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataById.installment.map(
                                                        (
                                                            inst: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_term"
                                                                            name="installment_term"
                                                                            value={
                                                                                // inst.installment_term
                                                                                i +
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_TERM",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_percentage"
                                                                            name="installment_percentage"
                                                                            value={
                                                                                inst.INSTALLMENT_PERCENTAGE
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_PERCENTAGE",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_due_date"
                                                                            name="installment_due_date"
                                                                            value={
                                                                                inst.INSTALLMENT_DUE_DATE
                                                                            }
                                                                            type="date"
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_DUE_DATE",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_ar"
                                                                            name="installment_ar"
                                                                            value={
                                                                                inst.INSTALLMENT_AR
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_AR",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_gross_bf"
                                                                            name="installment_gross_bf"
                                                                            value={
                                                                                inst.INSTALLMENT_GROSS_BF
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_GROSS_BF",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_vat"
                                                                            name="installment_vat"
                                                                            value={
                                                                                inst.INSTALLMENT_VAT
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_VAT",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_pph_23"
                                                                            name="installment_pph_23"
                                                                            value={
                                                                                inst.INSTALLMENT_PPH_23
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_PPH_23",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_net_bf"
                                                                            name="installment_net_bf"
                                                                            value={
                                                                                inst.INSTALLMENT_NET_BF
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_NET_BF",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_admin_cost"
                                                                            name="installment_admin_cost"
                                                                            value={
                                                                                inst.INSTALLMENT_ADMIN_COST
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_ADMIN_COST",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_policy_cost"
                                                                            name="installment_policy_cost"
                                                                            value={
                                                                                inst.INSTALLMENT_POLICY_COST
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_POLICY_COST",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="installment_ap"
                                                                            name="installment_ap"
                                                                            value={
                                                                                inst.INSTALLMENT_AP
                                                                            }
                                                                            // decimalScale={
                                                                            //     2
                                                                            // }
                                                                            // decimalsLimit={
                                                                            //     2
                                                                            // }
                                                                            // decimalSeparator={','}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInstallment(
                                                                                    "INSTALLMENT_AP",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
                                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>

                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {dataById
                                                                            .installment
                                                                            .length !==
                                                                            1 && (
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
                                                            className="text-xs mt-1 text-primary ms-1 w-auto"
                                                            onClick={(e) =>
                                                                addRowEditInstallment(
                                                                    e
                                                                )
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
                                body={
                                    <>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="name"
                                                value="For Policy:"
                                            />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={dataToDeactivate.name}
                                                className="bg-gray-200"
                                                readOnly
                                            />
                                        </div>
                                        {/* <div className="mb-4">
                                            <InputLabel
                                                htmlFor="notes"
                                                value="Notes"
                                            />
                                            <TextInput
                                                id="notes"
                                                type="text"
                                                name="notes"
                                                value={dataToDeactivate.notes}
                                                className=""
                                                onChange={(e) =>
                                                    setDataToDeactivate({
                                                        ...dataToDeactivate,
                                                        [e.target.name]:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div> */}
                                    </>
                                }
                            />
                            {/* end modal delete policy */}

                            {/* table policy in here */}
                            <Table
                                addButtonLabel={"Add Insurance Panel"}
                                addButtonModalState={() =>
                                    setModal({
                                        add: true,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                        search: false,
                                    })
                                }
                                searchButtonModalState={() =>
                                    setModal({
                                        add: false,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                        search: !modal.search,
                                    })
                                }
                                clearSearchButtonAction={
                                    () => null //clearSearchPolicy()
                                }
                                tableHead={
                                    <>
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"No"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Policy Number"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Insurance"}
                                        />
                                        <TableTH
                                            className={
                                                "min-w-[50px] px-12 sm:px-4"
                                            }
                                            label={"Leader"}
                                        />
                                        <TableTH
                                            className={
                                                "min-w-[50px] px-12 sm:px-4"
                                            }
                                            label={"Currency"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Policy Initial Premium"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Policy Share"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Discount Insurance"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Share Amount"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Payment Method"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Action"}
                                        />
                                    </>
                                }
                                tableBody={insurancePanels.data?.map(
                                    (ip: any, i: number) => {
                                        return (
                                            <tr
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? ""
                                                        : "bg-gray-100"
                                                }
                                            >
                                                <TableTD
                                                    value={
                                                        insurancePanels.from + i
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>{ip.POLICY_NUMBER}</>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        ip.RELATION_ORGANIZATION_NAME
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        ip.IP_POLICY_LEADER == 0
                                                            ? "No"
                                                            : "Yes"
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={ip.CURRENCY_SYMBOL}
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        ip.IP_POLICY_INITIAL_PREMIUM
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={ip.IP_POLICY_SHARE}
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={ip.IP_DISC_INSURANCE}
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={ip.IP_PIP_AFTER_DISC}
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={ip.IP_PAYMENT_METHOD}
                                                    className={""}
                                                />
                                                {/* <TableTD
                                                    value={
                                                        <>
                                                            {dateFormat(
                                                                policy.POLICY_INCEPTION_DATE,
                                                                "mmm dd, yyyy"
                                                            )}{" "}
                                                            - <br />
                                                            {dateFormat(
                                                                policy.POLICY_DUE_DATE,
                                                                "mmm dd, yyyy"
                                                            )}
                                                        </>
                                                    }
                                                    className={""}
                                                /> */}
                                                <TableTD
                                                    value={
                                                        <Dropdown
                                                            title="Actions"
                                                            children={
                                                                <>
                                                                    <a
                                                                        href=""
                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleEditModal(
                                                                                e,
                                                                                ip.IP_ID
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                        // onClick={(
                                                                        //     e
                                                                        // ) =>
                                                                        //     handleViewModal(
                                                                        //         e,
                                                                        //         policy.POLICY_ID
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        Detail
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                                        // onClick={(
                                                                        //     e
                                                                        // ) =>
                                                                        //     deletePolicy(
                                                                        //         e,
                                                                        //         policy.POLICY_ID,
                                                                        //         policy.POLICY_NUMBER
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        <TrashIcon className="mr-1 h-5 w-5 text-red-500 group-hover:text-red-500" />{" "}
                                                                        Delete
                                                                    </a>
                                                                </>
                                                            }
                                                        />
                                                    }
                                                    className={""}
                                                />
                                            </tr>
                                        );
                                    }
                                )}
                                pagination={
                                    <Pagination
                                        links={insurancePanels.links}
                                        fromData={insurancePanels.from}
                                        toData={insurancePanels.to}
                                        totalData={insurancePanels.total}
                                        clickHref={(url: string) =>
                                            getInsurancePanel(
                                                url.split("?").pop()
                                            )
                                        }
                                    />
                                }
                            />

                            {/* end table relaton in here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
