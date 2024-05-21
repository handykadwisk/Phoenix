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
        getPolicy();
    }, []);

    const [policies, setPolicies] = useState<any>([]);
    const { flash, policy, custom_menu }: any = usePage().props;
    const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { insurance }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [searchPolicy, setSearchPolicy] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getPolicy = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getPolicy?${pageNumber}`, {
                policy_number: searchPolicy.policy_number,
                policy_insurance_type_name:
                    searchPolicy.policy_insurance_type_name,
                policy_broker_name: searchPolicy.policy_broker_name,
                policy_inception_date: searchPolicy.policy_inception_date,
                policy_due_date: searchPolicy.policy_due_date,
                policy_status_id: searchPolicy.policy_status_id,
            })
            .then((res) => {
                setPolicies(res.data);
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
        // setPolicies(policy)
    };

    // console.log(insurance);
    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
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
        relation_id: "",
        policy_number: "",
        insurance_type_id: "",
        policy_the_insured: "",
        policy_inception_date: "",
        policy_due_date: "",
        policy_status_id: "",
        policy_insurance_panel: "",
        policy_share: "",
        initialPremium: [
            {
                currency_id: "",
                sum_insured: "",
                rate: "",
                initial_premium: "",
                installment: "",
            },
        ],
    });
    const [dataById, setDataById] = useState<any>({
        relation_id: "",
        policy_number: "",
        insurance_type_id: "",
        policy_the_insured: "",
        policy_inception_date: "",
        policy_due_date: "",
        policy_status_id: "",
        policy_insurance_panel: "",
        policy_share: "",
        policy_initial_premium: [
            {
                // currency_id: "",
                // sum_insured: "",
                // rate: "",
                // initial_premium: "",
                // installment: "",
                CURRENCY_ID: "",
                SUM_INSURED: "",
                RATE: "",
                INITIAL_PREMIUM: "",
                INSTALLMENT: "",
            },
        ],
        deletedInitialPremium: [
            {
                policy_initial_premium_id: "",
            },
        ],
    });
    // console.log(dataById);
    console.log(policies.data);

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            relation_id: "",
            policy_number: "",
            insurance_type_id: "",
            policy_the_insured: "",
            policy_inception_date: "",
            policy_due_date: "",
            policy_status_id: "",
            policy_insurance_panel: "",
            policy_share: "",
            initialPremium: [
                {
                    currency_id: "",
                    sum_insured: "",
                    rate: "",
                    initial_premium: "",
                    installment: "",
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
        getPolicy();
        setIsSuccess(message);
    };

    const inputInitialPremium = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.initialPremium];
        changeVal[i][name] = value;
        setData("initialPremium", changeVal);
    };

    const addRowInitialPremium = (e: FormEvent) => {
        e.preventDefault();
        setData("initialPremium", [
            ...data.initialPremium,
            {
                currency_id: "",
                sum_insured: "",
                rate: "",
                initial_premium: "",
                installment: "",
            },
        ]);
    };
    // console.log(insuranceType);

    const deleteRowInitialPremium = (i: number) => {
        const val = [...data.initialPremium];
        val.splice(i, 1);
        setData("initialPremium", val);
    };

    // edit
    const handleEditModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

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
        });
    };
    const editInitialPremium = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.policy_initial_premium];
        changeVal[i][name] = value;
        setDataById({ ...dataById, policy_initial_premium: changeVal });
    };

    const addRowEditInitialPremium = (e: FormEvent) => {
        e.preventDefault();
        // console.log(dataById);
        setDataById({
            ...dataById,
            policy_initial_premium: [
                ...dataById.policy_initial_premium,
                {
                    POLICY_INITIAL_PREMIUM_ID: null,
                    POLICY_ID: dataById.POLICY_ID,
                    CURRENCY_ID: "",
                    SUM_INSURED: "",
                    RATE: "",
                    INITIAL_PREMIUM: "",
                    INSTALLMENT: "",
                },
            ],
        });
    };

    const deleteRowEditInitialPremium = (i: number) => {
        const val = [...dataById.policy_initial_premium];
        val.splice(i, 1);
        if (
            dataById.policy_initial_premium[i].policy_initial_premium_id !==
            null
        ) {
            if (dataById.deletedInitialPremium) {
                // alert("a");
                setDataById({
                    ...dataById,
                    policy_initial_premium: val,
                    deletedInitialPremium: [
                        ...dataById.deletedInitialPremium,
                        {
                            policy_initial_premium_id:
                                dataById.policy_initial_premium[i]
                                    .POLICY_INITIAL_PREMIUM_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    policy_initial_premium: val,
                    deletedInitialPremium: [
                        {
                            policy_initial_premium_id:
                                dataById.policy_initial_premium[i]
                                    .POLICY_INITIAL_PREMIUM_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                policy_initial_premium: val,
            });
        }
    };
    // end edit

    // view
    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getPolicy/${id}`)
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
        <AuthenticatedLayout user={auth.user} header={"Policy"}>
            <Head title="Policy" />

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
                                title={"Create Policy"}
                                url={`/policy`}
                                data={data}
                                onSuccess={handleSuccess}
                                body={
                                    <>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="client_name"
                                                value="Client Name"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={data.relation_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "relation_id",
                                                        e.target.value
                                                    )
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
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="policy_number"
                                                    value="Policy Number"
                                                />
                                                <TextInput
                                                    id="policy_number"
                                                    type="text"
                                                    name="policy_number"
                                                    value={data.policy_number}
                                                    className=""
                                                    autoComplete="policy_number"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="insurance_type_id"
                                                    value="Insurance Type"
                                                />
                                                <select
                                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={
                                                        data.insurance_type_id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "insurance_type_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option>
                                                        --{" "}
                                                        <i>
                                                            Choose Insurance
                                                            Type
                                                        </i>{" "}
                                                        --
                                                    </option>
                                                    {insuranceType.map(
                                                        (
                                                            insuranceTypes: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    value={
                                                                        insuranceTypes.INSURANCE_TYPE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        insuranceTypes.INSURANCE_TYPE_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="the_insured"
                                                value="The Insured"
                                            />
                                            <TextInput
                                                id="the_insured"
                                                type="text"
                                                name="the_insured"
                                                value={data.policy_the_insured}
                                                className=""
                                                autoComplete="the_insured"
                                                onChange={(e) =>
                                                    setData(
                                                        "policy_the_insured",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="inception_date"
                                                    value="Inception Date"
                                                />
                                                <TextInput
                                                    id="inception_date"
                                                    type="date"
                                                    name="inception_date"
                                                    value={
                                                        data.policy_inception_date
                                                    }
                                                    className=""
                                                    autoComplete="inception_date"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_inception_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="due_date"
                                                    value="Due Date"
                                                />
                                                <TextInput
                                                    id="due_date"
                                                    type="date"
                                                    name="due_date"
                                                    value={data.policy_due_date}
                                                    className=""
                                                    autoComplete="due_date"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_due_date",
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
                                                    htmlFor="insurance_panel"
                                                    value="Insurance Panel"
                                                />
                                                <TextInput
                                                    id="insurance_panel"
                                                    type="text"
                                                    name="insurance_panel"
                                                    value={
                                                        data.policy_insurance_panel
                                                    }
                                                    className=""
                                                    autoComplete="insurance_panel"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_insurance_panel",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="share"
                                                    value="Share %"
                                                />
                                                <TextInput
                                                    id="share"
                                                    type="text"
                                                    name="share"
                                                    value={data.policy_share}
                                                    className=""
                                                    autoComplete="share"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_share",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-10">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Policy Initial Premium
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
                                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Currency
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Installment
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Sum Insured
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Rate %
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Initial Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.initialPremium.map(
                                                        (
                                                            iP: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {i + 1}
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <select
                                                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            value={
                                                                                iP.currency_id
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputInitialPremium(
                                                                                    "currency_id",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
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
                                                                        <TextInput
                                                                            id="installment"
                                                                            name="installment"
                                                                            value={
                                                                                iP.installment
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
                                                                                inputInitialPremium(
                                                                                    "installment",
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
                                                                            id="sum_insured"
                                                                            name="sum_insured"
                                                                            value={
                                                                                iP.sum_insured
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
                                                                                inputInitialPremium(
                                                                                    "sum_insured",
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
                                                                            id="rate"
                                                                            name="rate"
                                                                            value={
                                                                                iP.rate
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
                                                                                inputInitialPremium(
                                                                                    "rate",
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
                                                                            id="initial_premium"
                                                                            name="initial_premium"
                                                                            value={
                                                                                iP.initial_premium
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
                                                                                inputInitialPremium(
                                                                                    "initial_premium",
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
                                                                            .initialPremium
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
                                                                                    deleteRowInitialPremium(
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
                                                                addRowInitialPremium(
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
                                title={"Edit Policy"}
                                url={`/editPolicy/${dataById.POLICY_ID}`}
                                data={dataById}
                                onSuccess={handleSuccess}
                                method={"patch"}
                                headers={null}
                                submitButtonName={"Submit"}
                                body={
                                    <>
                                        <div className="mb-4">
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
                                                        RELATION_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Status</i> --
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
                                        <div className="grid grid-rows grid-flow-col gap-4">
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="edit_policy_number"
                                                    value="Policy Number"
                                                />
                                                <TextInput
                                                    id="edit_policy_number"
                                                    type="text"
                                                    name="edit_policy_number"
                                                    value={
                                                        dataById.POLICY_NUMBER
                                                    }
                                                    className=""
                                                    autoComplete="edit_policy_number"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            policy_number:
                                                                e.target.value,
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
                                                    value={
                                                        dataById.INSURANCE_TYPE_ID
                                                    }
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            INSURANCE_TYPE_ID:
                                                                e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option>
                                                        --{" "}
                                                        <i>
                                                            Choose Insurance
                                                            Type
                                                        </i>{" "}
                                                        --
                                                    </option>
                                                    {insuranceType?.map(
                                                        (status: any) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        status.INSURANCE_TYPE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        status.INSURANCE_TYPE_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="edit_the_insured"
                                                value="Policy The Insured"
                                            />
                                            <TextInput
                                                id="edit_the_insured"
                                                type="text"
                                                name="edit_the_insured"
                                                value={
                                                    dataById.POLICY_THE_INSURED
                                                }
                                                className=""
                                                autoComplete="edit_the_insured"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        POLICY_THE_INSURED:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="edit_policy_inception_date"
                                                    value="Inception Date"
                                                />
                                                <TextInput
                                                    id="edit_policy_inception_date"
                                                    type="date"
                                                    name="edit_policy_inception_date"
                                                    value={
                                                        dataById.POLICY_INCEPTION_DATE
                                                    }
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
                                                    value="Due Date"
                                                />
                                                <TextInput
                                                    id="edit_policy_due_date"
                                                    type="date"
                                                    name="edit_policy_due_date"
                                                    value={
                                                        dataById.POLICY_DUE_DATE
                                                    }
                                                    className=""
                                                    autoComplete="edit_policy_due_date"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            POLICY_DUE_DATE:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="edit_insurance_panel"
                                                    value="Insurance Panel"
                                                />
                                                <TextInput
                                                    id="edit_insurance_panel"
                                                    type="text"
                                                    name="edit_insurance_panel"
                                                    value={
                                                        dataById.POLICY_INSURANCE_PANEL
                                                    }
                                                    className=""
                                                    autoComplete="edit_insurance_panel"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            POLICY_INSURANCE_PANEL:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="edit_share"
                                                    value="Share %"
                                                />
                                                <TextInput
                                                    id="edit_share"
                                                    type="text"
                                                    name="edit_share"
                                                    value={
                                                        dataById.POLICY_SHARE
                                                    }
                                                    className=""
                                                    autoComplete="edit_share"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            POLICY_SHARE:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Initial Premium
                                            </h3>
                                            <hr className="my-3" />
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            No.
                                                        </th>
                                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Currency
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Installment
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Sum Insured
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Rate
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Initial Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataById.policy_initial_premium?.map(
                                                        (
                                                            iP: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {i + 1}
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <select
                                                                            className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            value={
                                                                                iP.CURRENCY_ID
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInitialPremium(
                                                                                    "CURRENCY_ID",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    i
                                                                                )
                                                                            }
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
                                                                        <TextInput
                                                                            id="installment"
                                                                            name="INSTALLMENT"
                                                                            value={
                                                                                iP.INSTALLMENT
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInitialPremium(
                                                                                    "INSTALLMENT",
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
                                                                            id="sum_insured"
                                                                            name="SUM_INSURED"
                                                                            value={
                                                                                iP.SUM_INSURED
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInitialPremium(
                                                                                    "SUM_INSURED",
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
                                                                            id="rate"
                                                                            name="RATE"
                                                                            value={
                                                                                iP.RATE
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInitialPremium(
                                                                                    "RATE",
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
                                                                            id="initial_premium"
                                                                            name="INITIAL_PREMIUM"
                                                                            value={
                                                                                iP.INITIAL_PREMIUM
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editInitialPremium(
                                                                                    "INITIAL_PREMIUM",
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
                                                                            .policy_initial_premium
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
                                                                                    deleteRowEditInitialPremium(
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
                                                                addRowEditInitialPremium(
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
                                addButtonLabel={"Add New Policy"}
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
                                // clearSearchButtonAction={() =>
                                //     clearSearchPolicy()
                                // }
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
                                            label={"Client Name"}
                                        />
                                        <TableTH
                                            className={
                                                "min-w-[50px] px-12 sm:px-4"
                                            }
                                            label={"Insurance Type"}
                                        />
                                        <TableTH
                                            className={
                                                "min-w-[50px] px-12 sm:px-4"
                                            }
                                            label={"Period"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Action"}
                                        />
                                    </>
                                }
                                tableBody={policies.data?.map(
                                    (policy: any, i: number) => {
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
                                                    value={policies.from + i}
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                policy.POLICY_NUMBER
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        policy.relation
                                                            .RELATION_ORGANIZATION_NAME
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        policy.insurance_type
                                                            .INSURANCE_TYPE_NAME
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
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
                                                />
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
                                                                                policy.POLICY_ID
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleViewModal(
                                                                                e,
                                                                                policy.POLICY_ID
                                                                            )
                                                                        }
                                                                    >
                                                                        Detail
                                                                    </a>
                                                                    <a
                                                                        href=""
                                                                        className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            deletePolicy(
                                                                                e,
                                                                                policy.POLICY_ID,
                                                                                policy.POLICY_NUMBER
                                                                            )
                                                                        }
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
                                        links={policies.links}
                                        fromData={policies.from}
                                        toData={policies.to}
                                        totalData={policies.total}
                                        clickHref={(url: string) =>
                                            getPolicy(url.split("?").pop())
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
