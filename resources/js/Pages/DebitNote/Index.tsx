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

export default function DebitNoteIndex({ auth }: PageProps) {
    useEffect(() => {
        getPolicy();
    }, []);

    const [relations, setRelations] = useState<any>([]);
    const [policyInstallments, setPolicyInstallments] = useState<any>([]);
    // const [policies, setPolicies] = useState<any>([]);
    const { flash, policy, custom_menu }: any = usePage().props;
    // const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { policies, clients, agents, currency }: any = usePage().props;
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
                // setPolicies(res.data);
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
    const dnTypes = [
        { id: 1, stat: "DN Initial Premium" },
        { id: 2, stat: "DN Additional Premium" },
        { id: 3, stat: "CN Refund Premium" },
    ];

    const getPolicyInstallment = async (policy_id: string) => {
        await axios
            .get(`/getPolicyInstallment/${policy_id}`)
            .then((res) => {
                // console.log("policyInstallment: ", res.data);
                // setDataInstallment(res.data);
                setPolicyInstallments(res.data);
            })
            .catch((err) => console.log(err));
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const { data, setData, errors, reset } = useForm({
        debit_note_id: "",
        debit_note_number: "",
        policy_id: "",
        policy_installment_id: "",
        debit_note_type: "",
        term_rate: "",
        insurance_due_date: "",
        client_id: "",
        note:"",
        agent_id: "",
        agent_commission_rate: "",
        agent_commission_amount: "",
        agent_commission_pph_21: "",
        agent_commission_pph_23: "",
        agent_commission_netto: "",
        currency_id: "",
        sum_insured: "",
        premium_amount: "",
        special_premium_amount: "",
        use_value_to_client: "",
        discount: "",
        policy_cost: "",
        admin_cost: "",
        due_to_us: "",
    });
    const [dataById, setDataById] = useState<any>({
        DEBIT_NOTE_ID: "",
        DEBIT_NOTE_NUMBER: "",
        POLICY_ID: "",
        POLICY_INSTALLMENT_ID: "",
        DEBIT_NOTE_TYPE: "",
        TERM_RATE: "",
        INSURANCE_DUE_DATE: "",
        CLIENT_ID: "",
        NOTE:"",
        AGENT_ID: "",
        AGENT_COMMISSION_RATE: "",
        AGENT_COMMISSION_AMOUNT: "",
        AGENT_COMMISSION_PPH_21: "",
        AGENT_COMMISSION_PPH_23: "",
        AGENT_COMMISSION_NETTO: "",
        CURRENCY_ID: "",
        SUM_INSURED: "",
        PREMIUM_AMOUNT: "",
        SPECIAL_PREMIUM_AMOUNT: "",
        USE_VALUE_TO_CLIENT: "",
        DISCOUNT: "",
        POLICY_COST: "",
        ADMIN_COST: "",
        DUE_TO_US: "",
    });
    // console.log(dataById);
    // console.log("dataById: ", dataById);

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            debit_note_id: "",
            debit_note_number: "",
            policy_id: "",
            policy_installment_id: "",
            debit_note_type: "",
            term_rate: "",
            insurance_due_date: "",
            client_id: "",
            note:"",
            agent_id: "",
            agent_commission_rate: "",
            agent_commission_amount: "",
            agent_commission_pph_21: "",
            agent_commission_pph_23: "",
            agent_commission_netto: "",
            currency_id: "",
            sum_insured: "",
            premium_amount: "",
            special_premium_amount: "",
            use_value_to_client: "",
            discount: "",
            policy_cost: "",
            admin_cost: "",
            due_to_us: "",
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

    // const inputInitialPremium = (name: string, value: any, i: number) => {
    //     const changeVal: any = [...data.initialPremium];
    //     changeVal[i][name] = value;
    //     setData("initialPremium", changeVal);
    // };

    // const addRowInitialPremium = (e: FormEvent) => {
    //     e.preventDefault();
    //     setData("initialPremium", [
    //         ...data.initialPremium,
    //         {
    //             currency_id: "",
    //             sum_insured: "",
    //             rate: "",
    //             initial_premium: "",
    //             installment: "",
    //         },
    //     ]);
    // };
    // console.log(insuranceType);

    // const deleteRowInitialPremium = (i: number) => {
    //     const val = [...data.initialPremium];
    //     val.splice(i, 1);
    //     setData("initialPremium", val);
    // };

    // const inputPolicyInstallment = (name: string, value: any, i: number) => {
    //     const changeVal: any = [...data.policyInstallment];
    //     changeVal[i][name] = value;
    //     setData("policyInstallment", changeVal);
    // };

    // const addRowPolicyInstallment = (e: FormEvent) => {
    //     e.preventDefault();
    //     setData("policyInstallment", [
    //         ...data.policyInstallment,
    //         {
    //             policy_installment_id: "",
    //             policy_id: "",
    //             policy_installment_term: "",
    //             policy_installment_percentage: "",
    //             policy_installment_amount: "",
    //             installment_due_date: "",
    //         },
    //     ]);
    // };
    // console.log(insuranceType);

    // const deleteRowPolicyInstallment = (i: number) => {
    //     const val = [...data.policyInstallment];
    //     val.splice(i, 1);
    //     setData("policyInstallment", val);
    // };

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
                    deletedInitialPremium: [
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
                    deletedInitialPremium: [
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

    // const getRelation = async (id: string) => {
    //     console.log(id);

    //     await axios
    //         .get(`/getRelation/${id}`)
    //         .then((res) => {
    //             // setDataById(res.data))
    //             // console.log("relation: ", res.data);
    //             // setRelations(res.data)
    //             setData(
    //                 "policy_the_insured",
    //                 res.data.RELATION_ORGANIZATION_NAME
    //             );
    //         })
    //         .catch((err) => console.log(err));
    // };

    // useEffect(() => {
    //     if (data.relation_id) {
    //         // console.log("useEffect: ", data.relation_id);
    //         getRelation(data.relation_id);
    //     }
    // }, [data.relation_id]);

    // Start fungsi hitung initial premium
    // const inputCalculate = (i: number) => {
    //     const changeVal: any = [...data.initialPremium];
    //     // changeVal[i][name] = value;
    //     const si = changeVal[i]["sum_insured"];
    //     const rate = changeVal[i]["rate"];
    //     if (si && rate) {
    //         changeVal[i]["initial_premium"] = (si * rate) / 100;
    //     } else [(changeVal[i]["initial_premium"] = 0)];
    //     console.log("calculate: ", changeVal[i]["initial_premium"]);
    //     setData("initialPremium", changeVal);
    // };
    const editCalculate = (
        i: number
    ) => {
        const changeVal: any = [...dataById.policy_initial_premium];
        // changeVal[i][name] = value;
        const si = changeVal[i]["SUM_INSURED"];
        const rate = changeVal[i]["RATE"];
        if (si && rate) {
            changeVal[i]["INITIAL_PREMIUM"] = si * rate / 100;
        } else [
            changeVal[i]["INITIAL_PREMIUM"] = 0
        ]
        // console.log("calculate: ", changeVal[i]["INITIAL_PREMIUM"]);
        setDataById({ ...dataById, policy_initial_premium: changeVal });
    };
    // End fungsi hitung initial premium
    console.log("dataById: ", dataById);

    return (
        <AuthenticatedLayout user={auth.user} header={"Debit Note"}>
            <Head title="Debit Note" />

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
                                title={"Create Debit Note"}
                                url={`/debitNote`}
                                data={data}
                                onSuccess={handleSuccess}
                                classPanel={
                                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                                }
                                body={
                                    <>
                                        <div className="mb-4 ml-4 mr-4">
                                            <InputLabel
                                                htmlFor="policy_number"
                                                value="Policy Number"
                                            />
                                            <select
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={data.policy_id}
                                                onChange={(e) => {
                                                    setData(
                                                        "policy_id",
                                                        e.target.value
                                                    ),
                                                        getPolicyInstallment(
                                                            e.target.value
                                                        );
                                                }}
                                            >
                                                <option>
                                                    --{" "}
                                                    <i>Choose Policy Number</i>{" "}
                                                    --
                                                </option>
                                                {policies.map(
                                                    (
                                                        policy: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
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

                                        <div className="mb-4 ml-4 mr-4">
                                            <InputLabel
                                                htmlFor="debit_note_type"
                                                value="Debit Note Type"
                                            />
                                            <select
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={data.debit_note_type}
                                                onChange={(e) => {
                                                    setData(
                                                        "debit_note_type",
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option>
                                                    -- <i>Choose </i> --
                                                </option>
                                                {dnTypes.map(
                                                    (
                                                        dnType: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    dnType.id
                                                                }
                                                            >
                                                                {dnType.stat}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4 ml-4 mr-4">
                                            <InputLabel
                                                htmlFor="policy_installment_id"
                                                value="Term Number"
                                            />
                                            <select
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={
                                                    data.policy_installment_id
                                                }
                                                onChange={(e) => {
                                                    setData(
                                                        "policy_installment_id",
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option>
                                                    -- <i>Choose </i> --
                                                </option>
                                                {policyInstallments.map(
                                                    (pI: any, i: number) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    pI.POLICY_INSTALLMENT_ID
                                                                }
                                                            >
                                                                {
                                                                    pI.POLICY_INSTALLMENT_TERM
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="term_rate"
                                                    value="Rate %"
                                                />
                                                <TextInput
                                                    id="term_rate"
                                                    type="text"
                                                    name="term_rate"
                                                    value={data.term_rate}
                                                    className=""
                                                    autoComplete="term_rate"
                                                    onChange={(e) =>
                                                        setData(
                                                            "term_rate",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="insurance_due_date"
                                                    value="Insurance Due Date"
                                                />
                                                <TextInput
                                                    id="insurance_due_date"
                                                    type="date"
                                                    name="insurance_due_date"
                                                    value={
                                                        data.insurance_due_date
                                                    }
                                                    className=""
                                                    autoComplete="insurance_due_date"
                                                    onChange={(e) =>
                                                        setData(
                                                            "insurance_due_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4 ml-4 mr-4">
                                            <InputLabel
                                                htmlFor="client_id"
                                                value="Client Name"
                                            />
                                            <select
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={data.client_id}
                                                onChange={(e) => {
                                                    setData(
                                                        "client_id",
                                                        e.target.value
                                                    ),
                                                        getPolicyInstallment(
                                                            e.target.value
                                                        );
                                                }}
                                            >
                                                <option>
                                                    -- <i>Choose </i> --
                                                </option>
                                                {clients.map(
                                                    (
                                                        client: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    client.RELATION_ORGANIZATION_ID
                                                                }
                                                            >
                                                                {
                                                                    client.RELATION_ORGANIZATION_NAME
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="address"
                                                    value="Address"
                                                />
                                                <TextInput
                                                    id="address"
                                                    type="text"
                                                    name="address"
                                                    // value={data.address}
                                                    className=""
                                                    autoComplete="address"
                                                    onChange={
                                                        (e) => null
                                                        // setData(
                                                        //     "address",
                                                        //     e.target.value
                                                        // )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="note"
                                                    value="Note"
                                                />
                                                <TextInput
                                                    id="note"
                                                    type="text"
                                                    name="note"
                                                    value={data.note}
                                                    className=""
                                                    autoComplete="note"
                                                    onChange={(e) =>
                                                        setData(
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="address"
                                                    value="Currency"
                                                />
                                                <select
                                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={data.currency_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "currency_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option>
                                                        --{" "}
                                                        <i>Choose Currency</i>{" "}
                                                        --
                                                    </option>
                                                    {currency.map(
                                                        (
                                                            currencies: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={i}
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
                                                    htmlFor="sum_insured"
                                                    value="Sum Insured"
                                                />
                                                <TextInput
                                                    id="sum_insured"
                                                    type="text"
                                                    name="sum_insured"
                                                    value={data.sum_insured}
                                                    className=""
                                                    autoComplete="sum_insured"
                                                    onChange={(e) =>
                                                        setData(
                                                            "sum_insured",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="premium"
                                                    value="Premium"
                                                />
                                                <TextInput
                                                    id="premium"
                                                    type="text"
                                                    name="premium"
                                                    value={data.premium_amount}
                                                    className=""
                                                    autoComplete="premium"
                                                    onChange={(e) =>
                                                        setData(
                                                            "premium_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="special_premium"
                                                    value="Special Premium"
                                                />
                                                <TextInput
                                                    id="special_premium"
                                                    type="text"
                                                    name="special_premium"
                                                    value={
                                                        data.special_premium_amount
                                                    }
                                                    className=""
                                                    autoComplete="special_premium"
                                                    onChange={(e) =>
                                                        setData(
                                                            "special_premium_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="discount"
                                                    value="Discount From Fresnel"
                                                />
                                                <TextInput
                                                    id="discount"
                                                    type="text"
                                                    name="discount"
                                                    value={data.discount}
                                                    className=""
                                                    autoComplete="discount"
                                                    onChange={(e) =>
                                                        setData(
                                                            "discount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="policy_cost"
                                                    value="policy Cost"
                                                />
                                                <TextInput
                                                    id="policy_cost"
                                                    type="text"
                                                    name="policy_cost"
                                                    value={data.policy_cost}
                                                    className=""
                                                    autoComplete="policy_cost"
                                                    onChange={(e) =>
                                                        setData(
                                                            "policy_cost",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="admin_cost"
                                                    value="admin Cost"
                                                />
                                                <TextInput
                                                    id="admin_cost"
                                                    type="text"
                                                    name="admin_cost"
                                                    value={data.admin_cost}
                                                    className=""
                                                    autoComplete="admin_cost"
                                                    onChange={(e) =>
                                                        setData(
                                                            "admin_cost",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="due_to_us"
                                                    value="Due To Us"
                                                />
                                                <TextInput
                                                    id="due_to_us"
                                                    type="text"
                                                    name="due_to_us"
                                                    value={data.due_to_us}
                                                    className=""
                                                    autoComplete="due_to_us"
                                                    onChange={(e) =>
                                                        setData(
                                                            "due_to_us",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Agent */}
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_id"
                                                    value="Agent Name"
                                                />
                                                <select
                                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={data.agent_id}
                                                    onChange={(e) => {
                                                        setData(
                                                            "agent_id",
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <option>
                                                        -- <i>Choose </i> --
                                                    </option>
                                                    {agents.map(
                                                        (
                                                            agent: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    value={
                                                                        agent.RELATION_ORGANIZATION_ID
                                                                    }
                                                                >
                                                                    {
                                                                        agent.RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_type"
                                                    value="Agent Type"
                                                />
                                                <TextInput
                                                    id="agent_type"
                                                    type="text"
                                                    name="agent_type"
                                                    // value={
                                                    //     data.agent_type
                                                    // }
                                                    className=""
                                                    autoComplete="agent_type"
                                                    // onChange={(e) =>
                                                    //     setData(
                                                    //         "agent_type",
                                                    //         e.target.value
                                                    //     )
                                                    // }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_commission_rate"
                                                    value="Agent Commission Rate %"
                                                />
                                                <TextInput
                                                    id="agent_commission_rate"
                                                    type="text"
                                                    name="agent_commission_rate"
                                                    value={
                                                        data.agent_commission_rate
                                                    }
                                                    className=""
                                                    autoComplete="agent_commission_rate"
                                                    onChange={(e) =>
                                                        setData(
                                                            "agent_commission_rate",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_commission_amount"
                                                    value="Agent Commission Amount"
                                                />
                                                <TextInput
                                                    id="agent_commission_amount"
                                                    type="text"
                                                    name="agent_commission_amount"
                                                    value={
                                                        data.agent_commission_amount
                                                    }
                                                    className=""
                                                    autoComplete="agent_commission_amount"
                                                    onChange={(e) =>
                                                        setData(
                                                            "agent_commission_amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_commission_pph_21"
                                                    value="Agent Commission PPh 21"
                                                />
                                                <TextInput
                                                    id="agent_commission_pph_21"
                                                    type="text"
                                                    name="agent_commission_pph_21"
                                                    value={
                                                        data.agent_commission_pph_21
                                                    }
                                                    className=""
                                                    autoComplete="agent_commission_pph_21"
                                                    onChange={(e) =>
                                                        setData(
                                                            "agent_commission_pph_21",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_commission_pph_23"
                                                    value="Agent Commission PPh 23"
                                                />
                                                <TextInput
                                                    id="agent_commission_pph_23"
                                                    type="text"
                                                    name="agent_commission_pph_23"
                                                    value={
                                                        data.agent_commission_pph_23
                                                    }
                                                    className=""
                                                    autoComplete="agent_commission_pph_23"
                                                    onChange={(e) =>
                                                        setData(
                                                            "agent_commission_pph_23",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="agent_commission_netto"
                                                    value="Agent Commission Netto"
                                                />
                                                <TextInput
                                                    id="agent_commission_netto"
                                                    type="text"
                                                    name="agent_commission_netto"
                                                    value={
                                                        data.agent_commission_netto
                                                    }
                                                    className=""
                                                    autoComplete="agent_commission_netto"
                                                    onChange={(e) =>
                                                        setData(
                                                            "agent_commission_netto",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                            />
                            {/* end Modal add Debit Note */}

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
                                classPanel={
                                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
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
                                                        RELATION_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Status</i> --
                                                </option>
                                                {/* {insurance?.map(
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
                                                )} */}
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
                                                    value={
                                                        dataById.POLICY_NUMBER
                                                    }
                                                    className=""
                                                    autoComplete="edit_policy_number"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            POLICY_NUMBER:
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
                                                    {/* {insuranceType?.map(
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
                                                    )} */}
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

                                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            {/* <div className="mb-4">
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
                                            </div> */}
                                            {/* <div className="mb-4">
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
                                            </div> */}
                                        </div>

                                        {/* <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="edit_policy_installment"
                                                    value="Policy Installment"
                                                />
                                                <TextInput
                                                    id="edit_policy_installment"
                                                    type="text"
                                                    name="edit_policy_installment"
                                                    value={
                                                        dataById.POLICY_INSTALLMENT
                                                    }
                                                    className=""
                                                    autoComplete="edit_policy_installment"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            POLICY_INSTALLMENT:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div></div>
                                        </div> */}

                                        <div className="mt-8 ml-4 mr-4">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Initial Premium
                                            </h3>
                                            <hr className="my-3" />
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                                            {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                                            No.
                                                        </th>
                                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                                            Currency
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
                                                                    <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {i + 1}
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <select
                                                                            className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
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
                                                                        <CurrencyInput
                                                                            id="sum_insured"
                                                                            name="SUM_INSURED"
                                                                            value={
                                                                                iP.SUM_INSURED
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
                                                                                editInitialPremium(
                                                                                    "SUM_INSURED",
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
                                                                            id="rate"
                                                                            name="RATE"
                                                                            value={
                                                                                iP.RATE
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
                                                                                editInitialPremium(
                                                                                    "RATE",
                                                                                    values,
                                                                                    i
                                                                                ),
                                                                                    editCalculate(
                                                                                        i
                                                                                    );
                                                                            }}
                                                                            className="block w-16 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="initial_premium"
                                                                            name="INITIAL_PREMIUM"
                                                                            value={
                                                                                iP.INITIAL_PREMIUM
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                editInitialPremium(
                                                                                    "INITIAL_PREMIUM",
                                                                                    values,
                                                                                    i
                                                                                );
                                                                            }}
                                                                            className="block w-32 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                            readOnly
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
                                            </table> */}
                                        </div>

                                        {/* Policy Installment Edit */}
                                        <div className="mt-10 ml-4 mr-4">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                Policy Installment
                                            </h3>
                                            <hr className="my-3" />
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                                            {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                                                        (
                                                            pI: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <TextInput
                                                                            id="policy_installment_term"
                                                                            name="POLICY_INSTALLMENT_TERM"
                                                                            value={
                                                                                pI.POLICY_INSTALLMENT_TERM
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editPolicyInstallment(
                                                                                    "POLICY_INSTALLMENT_TERM",
                                                                                    e
                                                                                        .target
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
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                editInitialPremium(
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                editPolicyInstallment(
                                                                                    "INSTALLMENT_DUE_DATE",
                                                                                    e
                                                                                        .target
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
                                                            className="text-xs mt-1 text-primary-pelindo ms-1"
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
                                            </table> */}
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
                                classPanel={
                                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                                }
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
                                addButtonLabel={"Create Debit Note"}
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
                                clearSearchButtonAction={() =>
                                    // clearSearchPolicy()
                                    null
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
                                tableBody={null}
                                // tableBody={policies.data?.map(
                                //     (policy: any, i: number) => {
                                //         return (
                                //             <tr
                                //                 key={i}
                                //                 className={
                                //                     i % 2 === 0
                                //                         ? ""
                                //                         : "bg-gray-100"
                                //                 }
                                //             >
                                //                 <TableTD
                                //                     value={policies.from + i}
                                //                     className={""}
                                //                 />
                                //                 <TableTD
                                //                     value={
                                //                         <>
                                //                             {
                                //                                 // <a target='_blank' href="policy">
                                //                                 //         {policy.POLICY_NUMBER}
                                //                                 // </a>
                                //                                 policy.POLICY_NUMBER
                                //                             }
                                //                         </>
                                //                     }
                                //                     className={""}
                                //                 />
                                //                 <TableTD
                                //                     value={
                                //                         policy.relation
                                //                             .RELATION_ORGANIZATION_NAME
                                //                     }
                                //                     className={""}
                                //                 />
                                //                 <TableTD
                                //                     value={
                                //                         policy.insurance_type
                                //                             .INSURANCE_TYPE_NAME
                                //                     }
                                //                     className={""}
                                //                 />
                                //                 <TableTD
                                //                     value={
                                //                         <>
                                //                             {dateFormat(
                                //                                 policy.POLICY_INCEPTION_DATE,
                                //                                 "mmm dd, yyyy"
                                //                             )}{" "}
                                //                             - <br />
                                //                             {dateFormat(
                                //                                 policy.POLICY_DUE_DATE,
                                //                                 "mmm dd, yyyy"
                                //                             )}
                                //                         </>
                                //                     }
                                //                     className={""}
                                //                 />
                                //                 <TableTD
                                //                     value={
                                //                         <Dropdown
                                //                             title="Actions"
                                //                             children={
                                //                                 <>
                                //                                     <a
                                //                                         href=""
                                //                                         className="block px-4 py-2 text-sm hover:bg-gray-100"
                                //                                         onClick={(
                                //                                             e
                                //                                         ) =>
                                //                                             handleEditModal(
                                //                                                 e,
                                //                                                 policy.POLICY_ID
                                //                                             )
                                //                                         }
                                //                                     >
                                //                                         Edit
                                //                                     </a>
                                //                                     <a
                                //                                         href=""
                                //                                         className="block px-4 py-2 text-sm hover:bg-gray-100"
                                //                                         onClick={(
                                //                                             e
                                //                                         ) =>
                                //                                             handleViewModal(
                                //                                                 e,
                                //                                                 policy.POLICY_ID
                                //                                             )
                                //                                         }
                                //                                     >
                                //                                         Detail
                                //                                     </a>
                                //                                     <a
                                //                                         href=""
                                //                                         className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                //                                         onClick={(
                                //                                             e
                                //                                         ) =>
                                //                                             deletePolicy(
                                //                                                 e,
                                //                                                 policy.POLICY_ID,
                                //                                                 policy.POLICY_NUMBER
                                //                                             )
                                //                                         }
                                //                                     >
                                //                                         <TrashIcon className="mr-1 h-5 w-5 text-red-500 group-hover:text-red-500" />{" "}
                                //                                         Delete
                                //                                     </a>
                                //                                 </>
                                //                             }
                                //                         />
                                //                     }
                                //                     className={""}
                                //                 />
                                //             </tr>
                                //         );
                                //     }
                                // )}
                                // pagination={
                                //     <Pagination
                                //         links={policies.links}
                                //         fromData={policies.from}
                                //         toData={policies.to}
                                //         totalData={policies.total}
                                //         clickHref={(url: string) =>
                                //             getPolicy(url.split("?").pop())
                                //         }
                                //     />
                                // }
                            />

                            {/* end table relaton in here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
