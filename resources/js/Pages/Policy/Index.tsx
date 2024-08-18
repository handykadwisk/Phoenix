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
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import ModalToAction from "@/Components/Modal/ModalToAction";
import Relation from "../Relation/Relation";
import Table from "@/Components/Table/Table";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import Badge from "@/Components/Badge";
import Pagination from "@/Components/Pagination";
import CurrencyInput from "react-currency-input-field";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Swal from "sweetalert2";
import ModalDetailPolicy from "./ModalDetailPolicy";
import Switch from "@/Components/Switch";
import { group } from "console";
import Alert from "@/Components/Alert";
import Select from "react-tailwindcss-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-date-picker";
// import { Datepicker } from "flowbite-react";

export default function PolicyIndex({ auth }: PageProps) {
    
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [relations, setRelations] = useState<any>([]);
    const [policies, setPolicies] = useState<any>([]);
    const { flash, policy, custom_menu }: any = usePage().props;
    const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { insurance, clients }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [searchPolicy, setSearchPolicy] = useState<any>({
        POLICY_NUMBER: "",
        CLIENT_ID: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [policyId, setPolicyId] = useState<string>("");
    const [arrCurrency, setarrCurrency] = useState<any>([]);
    const [sumByCurrency, setSumByCurrency] = useState<any>([]);

    // useEffect(() => {
    //     if (
    //         Object.keys(searchPolicy).length == 0 ||
    //         (searchPolicy.POLICY_NUMBER == "" &&
    //         searchPolicy.CLIENT_ID == "")
    //     ) {
    //         setPolicies([]);
    //     } else {
    //         getPolicy();
    //     }
    // }, [searchPolicy]);

    const getPolicy = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getPolicy?${pageNumber}`, {
                policy_number: searchPolicy.POLICY_NUMBER,
                client_id:searchPolicy.CLIENT_ID.value,
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

    const clearSearchPolicy = async (pageNumber = "page=1") => {
        await axios
            .post(`/getPolicy?${pageNumber}`)
            .then((res) => {
                setPolicies([]);
                setSearchPolicy({
                    ...searchPolicy,
                    POLICY_NUMBER: "",
                    CLIENT_ID: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

     const policyType = [
         { ID: "1", NAME: "Full Policy" },
         { ID: "2", NAME: "Master Policy/Certificate" }
     ];

    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];
    const policyStatus = [
        { id: "1", stat: "Current" },
        { id: "0", stat: "Lapse" },
    ];
    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
    ];

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });
    
    const selectInsurance = insurance?.map((query: any) => {
        return {
            value: query.RELATION_ORGANIZATION_ID,
            label: query.RELATION_ORGANIZATION_NAME,
        };
    });

    const { data, setData, errors, reset } = useForm<any>({
        relation_id: "",
        policy_number: "",
        insurance_type_id: "",
        policy_the_insured: "",
        policy_inception_date: "",
        policy_due_date: "",
        policy_status_id: 1,
        policy_type:"",
        self_insured: "",
        policyPremium: [
            {
                currency_id: "",
                coverage_name: "",
                gross_premi: 0,
                admin_cost: 0,
                disc_broker: 0,
                disc_consultation: 0,
                disc_admin: 0,
                nett_premi: 0,
                fee_based_income: 0,
                agent_commision: 0,
                acquisition_cost: 0
            },
        ],
        policyInstallment: [
            {
                policy_installment_id: "",
                policy_id: "",
                policy_installment_term: "",
                policy_installment_percentage: "",
                policy_installment_amount: "",
                installment_due_date: "",
            },
        ],
    });
    const [dataById, setDataById] = useState<any>({
        RELATION_ID: "",
        POLICY_NUMBER: "",
        INSURANCE_TYPE_ID: "",
        POLICY_THE_INSURED: "",
        POLICY_INCEPTION_DATE: "",
        POLICY_DUE_DATE: "",
        POLICY_STATUS_ID: "",
        POLICY_TYPE: "",
        SELF_INSURED: "",
        policy_premium: [
            {
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
                // SUM_INSURED: "",
                // RATE: "",
                // INITIAL_PREMIUM: "",
                // INSTALLMENT: "",
            },
        ],
        policy_installment: [
            {
                POLICY_INSTALLMENT_ID: "",
                POLICY_ID: "",
                POLICY_INSTALLMENT_TERM: "",
                POLICY_INSTALLMENT_PERCENTAGE: "",
                INSTALLMENT_DUE_DATE: "",
                POLICY_INSTALLMENT_AMOUNT: "",
            },
        ],
        deletedPolicyPremium: [
            {
                policy_initial_premium_id: "",
            },
        ],
        deletedInstallment: [
            {
                policy_installment_id: "",
            },
        ],
    });

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const resetData = () => {
        setData({
            relation_id: "",
            policy_number: "",
            insurance_type_id: "",
            policy_the_insured: "",
            policy_inception_date: "",
            policy_due_date: "",
            policy_status_id: 1,
            policy_type: "",
            self_insured: "",
            policyPremium: [
                {
                    currency_id: "",
                    coverage_name: "",
                    gross_premi: 0,
                    admin_cost: 0,
                    disc_broker: 0,
                    disc_consultation: 0,
                    disc_admin: 0,
                    nett_premi: 0,
                    fee_based_income: 0,
                    agent_commision: 0,
                    acquisition_cost: 0,
                },
            ],
            policyInstallment: [
                {
                    policy_installment_id: "",
                    policy_id: "",
                    policy_installment_term: "",
                    policy_installment_percentage: "",
                    policy_installment_amount: "",
                    installment_due_date: "",
                },
            ],
        });

        setSumByCurrency([])
        

    } 
console.log('searchPolicy: ', searchPolicy)
    const handleSuccess = (message: number) => {
        // console.log("message: ", message);
        setIsSuccess("");
        reset();
        setData({
            relation_id: "",
            policy_number: "",
            insurance_type_id: "",
            policy_the_insured: "",
            policy_inception_date: "",
            policy_due_date: "",
            policy_status_id: 1,
            policy_type: "",
            self_insured: "",
            policyPremium: [
                {
                    currency_id: "",
                    coverage_name: "",
                    gross_premi: 0,
                    admin_cost: 0,
                    disc_broker: 0,
                    disc_consultation: 0,
                    disc_admin: 0,
                    nett_premi: 0,
                    fee_based_income: 0,
                    agent_commision: 0,
                    acquisition_cost: 0,
                },
            ],
            policyInstallment: [
                {
                    policy_installment_id: "",
                    policy_id: "",
                    policy_installment_term: "",
                    policy_installment_percentage: "",
                    policy_installment_amount: "",
                    installment_due_date: "",
                },
            ],
        });
        getData(message);

        Swal.fire({
            title: "Success",
            text: "Success Registered Policy",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                // setPolicyId(message);
                // getData(message);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: true,
                    document: false,
                    search: false,
                });
            }
        });
        // setIsSuccess(message);
        // getPolicy();
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
        if (message) {
            setModal({
                ...modal,
                view: false
            })
            // setModal({
            //     add: false,
            //     delete: true,
            //     edit: false,
            //     view: false,
            //     document: false,
            //     search: false,
            // });
        }
    };

    const inputPolicyPremium = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.policyPremium];
        changeVal[i][name] = value;
        setData("policyPremium", changeVal);

        if (name == 'currency_id') {
            setarrCurrency([...arrCurrency, value]);
        }
        
        
    };

    const addRowPolicyPremium = (e: FormEvent) => {
        e.preventDefault();
        setData("policyPremium", [
            ...data.policyPremium,
            {
                currency_id: "",
                coverage_name: "",
                gross_premi: 0,
                admin_cost: 0,
                disc_broker: 0,
                disc_consultation: 0,
                disc_admin: 0,
                nett_premi: 0,
                fee_based_income: 0,
                agent_commision: 0,
                acquisition_cost: 0,
            },
        ]);
    };

    const deleteRowPolicyPremium = (i: number) => {
        const val = [...data.policyPremium];
        val.splice(i, 1);
        setData("policyPremium", val);
        getSummaryPremi()
    };

    const inputPolicyInstallment = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.policyInstallment];
        changeVal[i][name] = value;
        setData("policyInstallment", changeVal);
    };

    const addRowPolicyInstallment = (e: FormEvent) => {
        e.preventDefault();
        setData("policyInstallment", [
            ...data.policyInstallment,
            {
                policy_installment_id: "",
                policy_id: "",
                policy_installment_term: "",
                policy_installment_percentage: "",
                policy_installment_amount: "",
                installment_due_date: "",
            },
        ]);
    };

    const deleteRowPolicyInstallment = (i: number) => {
        const val = [...data.policyInstallment];
        val.splice(i, 1);
        setData("policyInstallment", val);
    };

    const getData = async (id: number) => {
        
        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));

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
                    // SUM_INSURED: "",
                    // RATE: "",
                    // INITIAL_PREMIUM: "",
                    // INSTALLMENT: "",
                },
            ],
        });
    };

    const deleteRowEditPolicyPremium = (i: number) => {
        const val = [...dataById.policy_premium];
        val.splice(i, 1);
        if (
            dataById.policy_premium[i].policy_initial_premium_id !==
            null
        ) {
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

    const getRelation = async (id: string) => {
        
        await axios
            .get(`/getRelation/${id}`)
            .then((res) => {
                
                setData(
                    "policy_the_insured",
                    res.data.RELATION_ORGANIZATION_NAME
                );
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (data.relation_id) {
            getRelation(data.relation_id);
        }
    }, [data.relation_id]);

    const getCurrencyById = (currId:any) => {
        const dataCurr = currency
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);

        return result.CURRENCY_SYMBOL;
    }


    const getSummaryPremi = () => {
        const dataToGroup = data.policyPremium;
        const groupBy = (data: any, keys: any) => {
            return Object.values(
                data.reduce((acc: any, val: any) => {
                    const currency_id = keys.reduce(
                        (finalName: any, key: any) => finalName + val[key],
                        ""
                    );
                    if (acc[currency_id]) {
                        acc[currency_id].values.push(val.nett_premi);
                        acc[currency_id].sum += val.nett_premi;
                        acc[currency_id].sum_gross_premi += val.gross_premi;
                        acc[currency_id].sum_admin_cost += val.admin_cost;
                        acc[currency_id].sum_disc_broker += val.disc_broker;
                        acc[currency_id].sum_disc_consultation += val.disc_consultation;
                        acc[currency_id].sum_disc_admin += val.disc_admin;
                        acc[currency_id].sum_fee_based_income += val.fee_based_income;
                        acc[currency_id].sum_agent_commision += val.agent_commision;
                        acc[currency_id].sum_acquisition_cost += val.acquisition_cost;
                    } else {
                        acc[currency_id] = {
                            currency_id,
                            sum: val.nett_premi,
                            sum_gross_premi: val.gross_premi,
                            sum_admin_cost: val.admin_cost,
                            sum_disc_broker: val.disc_broker,
                            sum_disc_consultation: val.disc_consultation,
                            sum_disc_admin: val.disc_admin,
                            sum_fee_based_income: val.fee_based_income,
                            sum_agent_commision: val.agent_commision,
                            sum_acquisition_cost: val.acquisition_cost,
                            // values: [val.nett_premi],
                        };
                    }
                    return acc;
                }, {})
            );
        };
        setSumByCurrency(groupBy(dataToGroup, ["currency_id"]));

    }
    useEffect(() => {
        if (data.policyPremium) {
            getSummaryPremi()            
        }
    }, [data.policyPremium]);

// console.log("sumByCurrency: ", sumByCurrency);
    // Start fungsi hitung initial premium
    const inputCalculate = (i: number) => {
        const changeVal: any = [...data.policyPremium];
        // const si = changeVal[i]["sum_insured"];
        // const rate = changeVal[i]["rate"];
        // if (si && rate) {
        //     changeVal[i]["initial_premium"] = (si * rate) / 100;
        // } else [(changeVal[i]["initial_premium"] = 0)];
        const gross_premi = changeVal[i]["gross_premi"];
        const admin_cost = changeVal[i]["admin_cost"];
        const disc_broker = changeVal[i]["disc_broker"];
        const disc_consultation = changeVal[i]["disc_consultation"];
        const disc_admin = changeVal[i]["disc_admin"];
        changeVal[i]["nett_premi"] = parseFloat(gross_premi) + parseFloat(admin_cost) - parseFloat(disc_broker) - parseFloat(disc_admin) - parseFloat(disc_consultation)

        setData("policyPremium", changeVal);
    };
    const editCalculate = (i: number) => {
        const changeVal: any = [...dataById.policy_premium];
        // changeVal[i][name] = value;
        const si = changeVal[i]["SUM_INSURED"];
        const rate = changeVal[i]["RATE"];
        if (si && rate) {
            changeVal[i]["INITIAL_PREMIUM"] = (si * rate) / 100;
        } else [(changeVal[i]["INITIAL_PREMIUM"] = 0)];
        
        setDataById({ ...dataById, policy_premium: changeVal });
    };
    // End fungsi hitung initial premium
    

    const handleSwitch = () => {
        setFlagSwitch(!flagSwitch)
    }

    return (
        <AuthenticatedLayout user={auth.user} header={"Policy"}>
            <Head title="Policy" />

            {/* modal add policy */}
            <ModalToAdd
                buttonAddOns={""}
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
                    resetData();
                }}
                title={"Register Policy"}
                url={`/policy`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="mb-4 ml-4 mr-4">
                            <InputLabel
                                htmlFor="client_name"
                                value="Client Name"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.relation_id}
                                onChange={(e) => {
                                    setData("relation_id", e.target.value);
                                    // getRelation(
                                    //     e.target.value
                                    // );
                                }}
                            >
                                <option value={""}>
                                    -- <i>Choose Client Name</i> --
                                </option>
                                {clients.map((client: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={
                                                client.RELATION_ORGANIZATION_ID
                                            }
                                        >
                                            {client.RELATION_ORGANIZATION_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
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
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setData("policy_number", e.target.value)
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
                                    value={data.insurance_type_id}
                                    onChange={(e) =>
                                        setData(
                                            "insurance_type_id",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value={""}>
                                        -- <i>Choose Insurance Type</i> --
                                    </option>
                                    {insuranceType.map(
                                        (insuranceTypes: any, i: number) => {
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
                            <div>
                                <InputLabel
                                    htmlFor="policy_type"
                                    value="Policy Type"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.policy_type}
                                    onChange={(e) =>
                                        setData("policy_type", e.target.value)
                                    }
                                >
                                    <option value={""}>
                                        -- <i>Choose Policy Type</i> --
                                    </option>
                                    {policyType.map((type: any, i: number) => {
                                        return (
                                            <option key={i} value={type.ID}>
                                                {type.NAME}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 ml-4 mr-4">
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
                                autoComplete="off"
                                onChange={(e) =>
                                    setData(
                                        "policy_the_insured",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="inception_date"
                                    value="Inception Date"
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
                                        selected={data.policy_inception_date}
                                        onChange={(date: any) =>
                                            setData(
                                                "policy_inception_date",
                                                date.toLocaleDateString("en-CA")
                                            )
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
                                    htmlFor="due_date"
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
                                        selected={data.policy_due_date}
                                        onChange={(date: any) =>
                                            setData(
                                                "policy_due_date",
                                                date.toLocaleDateString("en-CA")
                                            )
                                        }
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyyy"
                                        className="border-0 rounded-md shadow-md text-sm h-9 w-full px-10 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    />
                                </div>
                                {/* <TextInput
                                    id="due_date"
                                    type="date"
                                    name="due_date"
                                    value={data.policy_due_date}
                                    className=""
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setData(
                                            "policy_due_date",
                                            e.target.value
                                        )
                                    }
                                    required
                                /> */}
                            </div>
                            <div className="w-60">
                                <InputLabel
                                    // htmlFor="self_insured"
                                    value="Self Insured"
                                />

                                <div className="grid grid-cols-5">
                                    <div className="">
                                        <Switch
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
                                                    value={data.self_insured}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    onValueChange={(
                                                        values: any
                                                    ) =>
                                                        setData(
                                                            "self_insured",
                                                            values
                                                        )
                                                    }
                                                    className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    required
                                                    placeholder="Percentage (%)"
                                                    autoComplete="off"
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
            {/* end Modal add Policy */}

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

            {/* modal search */}
            <ModalSearch
                show={modal.search}
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
                title={"Search Relation"}
                submitButtonName={"Search"}
                onAction={() => {
                    getPolicy();
                }}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="POLICY_NUMBER"
                                value="Policy Number"
                            />
                            <TextInput
                                id="POLICY_NUMBER"
                                type="text"
                                name="POLICY_NUMBER"
                                value={searchPolicy.POLICY_NUMBER}
                                className="mt-2"
                                onChange={(e) =>
                                    setSearchPolicy({
                                        ...searchPolicy,
                                        POLICY_NUMBER: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        getPolicy();
                                    }
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal search */}

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
                title={"Detail Policy - " + dataById.POLICY_NUMBER}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <ModalDetailPolicy
                            onDeleteSuccess={handleSuccessDelete}
                            policy={dataById}
                            insurance={insurance}
                            clients={clients}
                            insuranceType={insuranceType}
                            policyStatus={policyStatus}
                            currency={currency}
                        />
                    </>
                }
            />
            {/* modal end detail  */}

            {/* Mekanisme Search */}
            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
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
                            {"Register Policy"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-96">
                        <TextInput
                            id="search_policy_number"
                            type="text"
                            name="search_policy_number"
                            value={searchPolicy.POLICY_NUMBER}
                            className="mt-2 ring-1 ring-red-600"
                            autoComplete="off"
                            onChange={(e) => {
                                setSearchPolicy({
                                    ...searchPolicy,
                                    POLICY_NUMBER: e.target.value,
                                });
                            }}
                            placeholder="Search Policy Number"
                        />
                        <Select
                            classNames={{
                                menuButton: () =>
                                    `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-red-600`,
                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                listItem: ({ isSelected }: any) =>
                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                            ? `text-white bg-primary-pelindo`
                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                    }`,
                            }}
                            options={selectInsurance}
                            isSearchable={true}
                            placeholder={"Search Client"}
                            value={searchPolicy.CLIENT_ID}
                            onChange={(val: any) =>
                                setSearchPolicy({
                                    ...searchPolicy,
                                    CLIENT_ID: val,
                                })
                            }
                            primaryColor={"bg-red-500"}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    getPolicy();
                                }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchPolicy()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
                        <table className="w-full table-auto divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        className={"max-w-[20px] text-center"}
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
                                </tr>
                            </thead>
                            <tbody>
                                {policies.data?.map(
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
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            <a
                                                                href=""
                                                                onClick={(e) =>
                                                                    handleViewModal(
                                                                        e,
                                                                        policy.POLICY_ID
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    policy.POLICY_NUMBER
                                                                }
                                                                <br />
                                                                {policy.POLICY_STATUS_ID ==
                                                                1 ? (
                                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-small text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                        Current
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-small text-red-700 ring-1 ring-inset ring-red-600/20">
                                                                        Lapse
                                                                    </span>
                                                                )}
                                                            </a>
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                policy.relation
                                                                    .RELATION_ORGANIZATION_NAME
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
                        <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                            <Pagination
                                links={relations.links}
                                fromData={relations.from}
                                toData={relations.to}
                                totalData={relations.total}
                                clickHref={(url: string) =>
                                    getPolicy(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
