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
// import ModalDetailPolicy from "./ModalDetailPolicy";
import Switch from "@/Components/Switch";
import ModalDetailEndorsement from "./ModalDetailEndorsement";

export default function PolicyIndex({ auth }: PageProps) {
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [relations, setRelations] = useState<any>([]);
    const [endorsements, setEndorsements] = useState<any>([]);
    const [dataPolicy, setDataPolicy] = useState<any>([]);
    const { currency, listPolicy, endorsementTypes }: any = usePage().props;
    // const { currency }: any = usePage().props;
    const { insuranceType }: any = usePage().props;
    const { insurance }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [searchEndorsement, setSearchEndorsement] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [policyId, setPolicyId] = useState<string>("");
    const [sumByCurrency, setSumByCurrency] = useState<any>([]);

    useEffect(() => {
        if (
            Object.keys(searchEndorsement).length == 0 ||
            (searchEndorsement.POLICY_ID == "" ||
            searchEndorsement.ENDORSEMENT_NUMBER == "")
        ) {
            // console.log('a')
            setEndorsements([]);
        } else {
            // console.log("b");
            getEndorsement();
        }
    }, [searchEndorsement]);
//     console.log("xx: ", Object.keys(searchEndorsement).length);
// console.log("endorsementS: ", endorsements);
    const getEndorsement = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getEndorsement?${pageNumber}`, {
                policy_id: searchEndorsement.POLICY_ID,
                endorsement_number: searchEndorsement.ENDORSEMENT_NUMBER,
            })
            .then((res) => {
                setEndorsements(res.data);
                // console.log('masuk')
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

    // console.log("searchEndorsement: ", searchEndorsement);
    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];
    const endorsementStatus = [
        { id: "0", stat: "Ongoing" },
        { id: "1", stat: "Finalize" },
        { id: "2", stat: "Canceled" },
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

    const { data, setData, errors, reset } = useForm<any>({
        policy_id: "",
        endorsement_number: "",
        endorsement_status: "",
        endorsement_effective_date: "",
        endorsement_expiry_date: "",
        endorsement_occupation: "",
        endorsement_conveyance: "",
        endorsement_from: "",
        endorsement_to: "",
        endorsement_transhipment: "",
        endorsement_note: "",
        endorsement_type_id:"",
        self_insured:"",
        endorsementPremium: [
            // {
            //     currency_id: "",
            //     sum_insured: "",
            //     rate: "",
            //     additional_premium: "",
            // },
        ],
        endorsementInstallment: [
            {
                endorsement_installment_term: "",
                endorsement_installment_rate: "",
                endorsement_installment_amount: "",
                endorsement_installment_due_date: "",
            },
        ],
    });
    // console.log('data: ', data)
    const [dataById, setDataById] = useState<any>({
        POLICY_ID: "",
        ENDORSEMENT_NUMBER: "",
        ENDORSEMENT_STATUS: "",
        ENDORSEMENT_EFFECTIVE_DATE: "",
        ENDORSEMENT_EXPIRY_DATE: "",
        ENDORSEMENT_OCCUPATION: "",
        ENDORSEMENT_CONVEYANCE: "",
        ENDORSEMENT_FROM: "",
        ENDORSEMENT_TO: "",
        ENDORSEMENT_TRANSHIPMENT: "",
        ENDORSEMENT_NOTE: "",
        ENDORSEMENT_TYPE_ID: "",
        SELF_INSURED: "",
        endorsement_premium: [
            // {
            //     CURRENCY_ID: "",
            //     SUM_INSURED: "",
            //     RATE: "",
            //     ADDITIONAL_PREMIUM: "",
            // },
        ],
        endorsement_installment: [
            {
                ENDORSEMENT_INSTALLMENT_ID: "",
                ENDORSEMENT_ID: "",
                ENDORSEMENT_INSTALLMENT_TERM: "",
                ENDORSEMENT_INSTALLMENT_RATE: "",
                ENDORSEMENT_INSTALLMENT_AMOUNT: "",
                ENDORSEMENT_INSTALLMENT_DUE_DATE: "",
            },
        ],
        deletedEndorsementPremium: [
            {
                endorsement_premium_id: "",
            },
        ],
        deletedInstallment: [
            {
                endorsement_installment_id: "",
            },
        ],
    });

    const [dataToDeactivate, setDataToDeactivate] = useState<any>({
        id: "",
        notes: "",
        name: "",
    });

    const handleSuccess = (message: number) => {
        setIsSuccess("");
        reset();
        setData({
            policy_id: "",
            endorsement_number: "",
            endorsement_status: "",
            endorsement_effective_date: "",
            endorsement_expiry_date: "",
            endorsement_occupation: "",
            endorsement_conveyance: "",
            endorsement_from: "",
            endorsement_to: "",
            endorsement_transhipment: "",
            endorsement_note: "",
            endorsement_type_id: "",
            self_insured:"",
            endorsementPremium: [
                // {
                //     currency_id: "",
                //     sum_insured: "",
                //     rate: "",
                //     additional_premium: "",
                // },
            ],
            endorsementInstallment: [
                {
                    endorsement_installment_term: "",
                    endorsement_installment_rate: "",
                    endorsement_installment_amount: "",
                    endorsement_installment_due_date: "",
                },
            ],
        });

        Swal.fire({
            title: "Success",
            text: "New Group Added",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getData(message);
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
        getEndorsement();
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
        getEndorsement();
        setIsSuccess(message);
        if (message) {
            setModal({
                ...modal,
                view: false,
            });
        }
    };

    const inputEndorsementPremium = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.endorsementPremium];
        changeVal[i][name] = value;
        setData("endorsementPremium", changeVal);
    };

    const addRowEndorsementPremium = (e: FormEvent) => {
        e.preventDefault();
        setData("endorsementPremium", [
            ...data.endorsementPremium,
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
                // sum_insured: "",
                // rate: "",
                // additional_premium: "",
            },
        ]);
    };

    const deleteRowEndorsementPremium = (i: number) => {
        const val = [...data.endorsementPremium];
        val.splice(i, 1);
        setData("endorsementPremium", val);
        getSummaryPremi();
    };

    const inputEndorsementInstallment = (name: string, value: any, i: number) => {
        const changeVal: any = [...data.endorsementInstallment];
        changeVal[i][name] = value;
        setData("endorsementInstallment", changeVal);
    };

    const addRowEndorsementInstallment = (e: FormEvent) => {
        e.preventDefault();
        setData("endorsementInstallment", [
            ...data.endorsementInstallment,
            {
                endorsement_installment_term: "",
                endorsement_installment_rate: "",
                endorsement_installment_amount: "",
                endorsement_installment_due_date: "",
            },
        ]);
    };

    const deleteRowEndorsementInstallment = (i: number) => {
        const val = [...data.endorsementInstallment];
        val.splice(i, 1);
        setData("endorsementInstallment", val);
    };

    const getPolicy = async (id: string) => {
        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => {
                    setDataPolicy(res.data)
                }
            )
            .catch((err) => console.log(err));
    };

    // console.log('dataPolicy: ', dataPolicy)

    const getData = async (id: number) => {
        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));
    };

    
    // view
    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getEndorsement/${id}`)
            .then((res) => setDataById(res.data))
            .catch((err) => console.log(err));
        // console.log('xx: ', dataById)
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
    console.log("data: ", data);
    

    // Start fungsi hitung Additional premium
    const inputCalculate = (i: number) => {
        const changeVal: any = [...data.endorsementPremium];
        // const si = changeVal[i]["sum_insured"];
        // const rate = changeVal[i]["rate"];
        // if (si && rate) {
        //     changeVal[i]["additional_premium"] = (si * rate) / 100;
        // } else [(changeVal[i]["additional_premium"] = 0)];
        const gross_premi = changeVal[i]["gross_premi"];
        const admin_cost = changeVal[i]["admin_cost"];
        const disc_broker = changeVal[i]["disc_broker"];
        const disc_consultation = changeVal[i]["disc_consultation"];
        const disc_admin = changeVal[i]["disc_admin"];
        changeVal[i]["nett_premi"] =
            parseFloat(gross_premi) +
            parseFloat(admin_cost) -
            parseFloat(disc_broker) -
            parseFloat(disc_admin) -
            parseFloat(disc_consultation);

        setData("endorsementPremium", changeVal);
    };
    const editCalculate = (i: number) => {
        const changeVal: any = [...dataById.policy_premium];
        // changeVal[i][name] = value;
        const si = changeVal[i]["SUM_INSURED"];
        const rate = changeVal[i]["RATE"];
        if (si && rate) {
            changeVal[i]["ADDITIONAL_PREMIUM"] = (si * rate) / 100;
        } else [(changeVal[i]["ADDITIONAL_PREMIUM"] = 0)];
        setDataById({ ...dataById, policy_premium: changeVal });
    };
    // End fungsi hitung initial premium

    const getCurrencyById = (currId: any) => {
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);

        return result.CURRENCY_SYMBOL;
    };

    const getSummaryPremi = () => {
        const dataToGroup = data.endorsementPremium;
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
                    } else {
                        acc[currency_id] = {
                            currency_id,
                            sum: val.nett_premi,
                            values: [val.nett_premi],
                        };
                    }
                    return acc;
                }, {})
            );
        };
        setSumByCurrency(groupBy(dataToGroup, ["currency_id"]));
    };
    useEffect(() => {
        if (data.endorsementPremium) {
            getSummaryPremi();
        }
    }, [data.endorsementPremium]);
    console.log("sumByCurrency: ", sumByCurrency);

    const handleSwitch = () => {
        setFlagSwitch(!flagSwitch);
    };

    const resetData = () => {
        setData({
            policy_id: "",
            endorsement_number: "",
            endorsement_status: "",
            endorsement_effective_date: "",
            endorsement_expiry_date: "",
            endorsement_occupation: "",
            endorsement_conveyance: "",
            endorsement_from: "",
            endorsement_to: "",
            endorsement_transhipment: "",
            endorsement_note: "",
            endorsement_type_id: "",
            endorsementPremium: [
            ],
            endorsementInstallment: [
                {
                    endorsement_installment_term: "",
                    endorsement_installment_rate: "",
                    endorsement_installment_amount: "",
                    endorsement_installment_due_date: "",
                },
            ],
        });
        setSumByCurrency([]);
        // getEndorsement();
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Endorsement"}>
            <Head title="Endorsement" />

            {/* modal add Endorsement */}
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
                    }),
                        resetData();
                }}
                title={"Register Endorsement"}
                url={`/endorsement`}
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
                                    htmlFor="policy_id"
                                    value="Policy Number"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.policy_id}
                                    onChange={(e) => {
                                        setData("policy_id", e.target.value),
                                            getPolicy(e.target.value);
                                    }}
                                >
                                    <option>
                                        -- <i>Choose Policy Number</i> --
                                    </option>
                                    {listPolicy.map(
                                        (policy: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={policy.POLICY_ID}
                                                >
                                                    {policy.POLICY_NUMBER}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="mb-4 ">
                                <InputLabel
                                    htmlFor="the_insured"
                                    value="The Insured"
                                />
                                <TextInput
                                    id="the_insured"
                                    type="text"
                                    name="the_insured"
                                    value={dataPolicy.POLICY_THE_INSURED}
                                    className=""
                                    autoComplete="the_insured"
                                    // onChange={(e) =>
                                    //     setData(
                                    //         "policy_the_insured",
                                    //         e.target.value
                                    //     )
                                    // }
                                    readOnly
                                />
                            </div>
                            {dataPolicy.SELF_INSURED ? (
                                <div className="mb-4 w-24 ">
                                    <InputLabel
                                        htmlFor="self_insured"
                                        value="Self Insured %"
                                    />
                                    <TextInput
                                        id="self_insured"
                                        type="text"
                                        name="self_insured"
                                        value={dataPolicy.SELF_INSURED}
                                        className=""
                                        autoComplete="self_insured"
                                        onChange={(e) =>
                                            setData(
                                                "self_insured",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="endorsement_number"
                                    value="Endorsement Number"
                                />
                                <TextInput
                                    id="endorsement_number"
                                    type="text"
                                    name="endorsement_number"
                                    value={data.endorsement_number}
                                    className=""
                                    autoComplete="endorsement_number"
                                    onChange={(e) =>
                                        setData(
                                            "endorsement_number",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <div>
                                    <InputLabel
                                        htmlFor="endorsement_type_id"
                                        value="Endorsement Type"
                                    />
                                    <select
                                        className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.endorsement_type_id}
                                        onChange={(e) =>
                                            setData(
                                                "endorsement_type_id",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option>
                                            -- <i>Choose</i> --
                                        </option>
                                        {endorsementTypes.map(
                                            (eT: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            eT.ENDORSEMENT_TYPE_ID
                                                        }
                                                    >
                                                        {
                                                            eT.ENDORSEMENT_TYPE_NAME
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="effective_date"
                                    value="Effective Date"
                                />
                                <TextInput
                                    id="effective_date"
                                    type="date"
                                    name="effective_date"
                                    value={data.endorsement_effective_date}
                                    className=""
                                    autoComplete="effective_date"
                                    onChange={(e) =>
                                        setData(
                                            "endorsement_effective_date",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            {/* <div>
                                <InputLabel
                                    htmlFor="expiry_date"
                                    value="Expired Date"
                                />
                                <TextInput
                                    id="expiry_date"
                                    type="date"
                                    name="expiry_date"
                                    value={data.endorsement_expiry_date}
                                    className=""
                                    autoComplete="expiry_date"
                                    onChange={(e) =>
                                        setData(
                                            "endorsement_expiry_date",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div> */}
                            <div>
                                <InputLabel
                                    htmlFor="endorsement_status"
                                    value="Endorsement Status"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.endorsement_status}
                                    onChange={(e) =>
                                        setData(
                                            "endorsement_status",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option>
                                        -- <i>Choose</i> --
                                    </option>
                                    {endorsementStatus.map(
                                        (eS: any, i: number) => {
                                            return (
                                                <option key={i} value={eS.id}>
                                                    {eS.stat}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="endorsement_note"
                                    value="Endorsement Note"
                                />
                                <TextInput
                                    id="endorsement_note"
                                    type="text"
                                    name="endorsement_note"
                                    value={dataToDeactivate.endorsement_note}
                                    className=""
                                    onChange={(e) =>
                                        setData(
                                            "endorsement_note",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-10 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Endorsement Premium
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                            Fee Income (PKS)
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Agen Commision
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
                                    {data.endorsementPremium.map(
                                        (eP: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        {i + 1}
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <TextInput
                                                            type="text"
                                                            id="coverage_name"
                                                            name="coverage_name"
                                                            value={
                                                                eP.coverage_name
                                                            }
                                                            onChange={(e) =>
                                                                inputEndorsementPremium(
                                                                    "coverage_name",
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
                                                        <select
                                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                eP.currency_id
                                                            }
                                                            onChange={(e) =>
                                                                inputEndorsementPremium(
                                                                    "currency_id",
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="gross_premi"
                                                            name="gross_premi"
                                                            value={
                                                                eP.gross_premi
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "gross_premi",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="admin_cost"
                                                            name="admin_cost"
                                                            value={
                                                                eP.admin_cost
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "admin_cost",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_broker"
                                                            name="disc_broker"
                                                            value={
                                                                eP.disc_broker
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "disc_broker",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_consultation"
                                                            name="disc_consultation"
                                                            value={
                                                                eP.disc_consultation
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "disc_consultation",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_admin"
                                                            name="disc_admin"
                                                            value={
                                                                eP.disc_admin
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "disc_admin",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="nett_premi"
                                                            name="nett_premi"
                                                            value={
                                                                eP.nett_premi
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "nett_premi",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="fee_based_income"
                                                            name="fee_based_income"
                                                            value={
                                                                eP.fee_based_income
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "fee_based_income",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="agent_commision"
                                                            name="agent_commision"
                                                            value={
                                                                eP.agent_commision
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "agent_commision",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="acquisition_cost"
                                                            name="acquisition_cost"
                                                            value={
                                                                eP.acquisition_cost
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementPremium(
                                                                    "acquisition_cost",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputCalculate(
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>

                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        {/* {data.endorsementPremium
                                                            .length !== 1 && ( */}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mx-auto h-6 text-red-500 cursor-pointer"
                                                            onClick={() =>
                                                                deleteRowEndorsementPremium(
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
                                                        {/* )} */}
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
                                                addRowEndorsementPremium(e)
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
                                                if (sum.currency_id) {
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
                        {/* Policy Installment add */}
                        <div className="mt-10">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                Endorsement Installment
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Installment
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 text-sm text-black dark:text-white">
                                            Term Rate
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Due Date
                                        </th>

                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.endorsementInstallment.map(
                                        (eI: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            id="endorsement_installment_term"
                                                            name="endorsement_installment_term"
                                                            value={
                                                                // eI.endorsement_installment_term
                                                                i + 1
                                                            }
                                                            onChange={(e) =>
                                                                inputEndorsementInstallment(
                                                                    "endorsement_installment_term",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            // className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="endorsement_installment_rate"
                                                            name="endorsement_installment_rate"
                                                            value={
                                                                eI.endorsement_installment_rate
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputEndorsementInstallment(
                                                                    "endorsement_installment_rate",
                                                                    values,
                                                                    i
                                                                ),
                                                                    inputEndorsementInstallment(
                                                                        "endorsement_installment_term",
                                                                        i + 1,
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            type="date"
                                                            id="endorsement_installment_due_date"
                                                            name="endorsement_installment_due_date"
                                                            value={
                                                                eI.endorsement_installment_due_date
                                                            }
                                                            onChange={(e) => {
                                                                inputEndorsementInstallment(
                                                                    "endorsement_installment_due_date",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                ),
                                                                    inputEndorsementInstallment(
                                                                        "endorsement_installment_term",
                                                                        i + 1,
                                                                        i
                                                                    );
                                                            }}
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>

                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        {data
                                                            .endorsementInstallment
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
                                                                    deleteRowEndorsementInstallment(
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
                                                addRowEndorsementInstallment(e)
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
                title={"Detail Endorsement"}
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
                        <ModalDetailEndorsement
                            onDeleteSuccess={handleSuccessDelete}
                            endorsement={dataById}
                            listPolicy={listPolicy}
                            endorsementTypes={endorsementTypes}
                            endorsementStatus={endorsementStatus}
                            currency={currency}
                        />
                    </>
                }
            />
            {/* modal end detail  */}

            {/* Mekanisme Search */}
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
                                    <span className="items-center justify-center text-center flex">
                                        {"Register Endorsement"}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 xs:gap-0 lg:grid-cols-3 lg:grid-4 lg:gap-4">
                            <div className="bg-white rounded-md p-10 shdow-md mb-5 lg:mb-0">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="search_policy"
                                                value="Policy Number"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={
                                                    searchEndorsement.POLICY_ID
                                                }
                                                onChange={(e) =>
                                                    setSearchEndorsement({
                                                        ...searchEndorsement,
                                                        POLICY_ID:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option value={""}>
                                                    -- <i>Choose Policy</i> --
                                                </option>
                                                {listPolicy?.map(
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
                                                htmlFor="search_endorsement_number"
                                                value="Endorsement Number"
                                            />
                                            <TextInput
                                                id="search_endorsement_number"
                                                type="text"
                                                name="search_endorsement_number"
                                                value={
                                                    searchEndorsement.ENDORSEMENT_NUMBER
                                                }
                                                className=""
                                                autoComplete="search_endorsement_number"
                                                onChange={(e) => {
                                                    setSearchEndorsement({
                                                        ...searchEndorsement,
                                                        ENDORSEMENT_NUMBER:
                                                            e.target.value,
                                                    });
                                                }}
                                                required
                                            />
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
                                                colSpan={""}
                                                    rowSpan={""}
                                                    className={
                                                        "max-w-[0px] text-center"
                                                    }
                                                    label={"No"}
                                                />
                                                <TableTH
                                                colSpan={""}
                                                    rowSpan={""}
                                                    className={"min-w-[50px]"}
                                                    label={"Policy Number"}
                                                />
                                                <TableTH
                                                colSpan={""}
                                                    rowSpan={""}
                                                    className={"min-w-[50px]"}
                                                    label={"Endorsement Number"}
                                                />
                                                {/* <TableTH
                                                    className={
                                                        "min-w-[50px] text-center"
                                                    }
                                                    label={"Action"}
                                                /> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {endorsements.data?.map(
                                                (
                                                    endorsement: any,
                                                    i: number
                                                ) => {
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
                                                                    endorsements.from +
                                                                    i
                                                                }
                                                                className={
                                                                    "text-center"
                                                                }
                                                            />
                                                            <TableTD
                                                                value={
                                                                    <>
                                                                        <a
                                                                            href=""
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                handleViewModal(
                                                                                    e,
                                                                                    endorsement.ENDORSEMENT_ID
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                endorsement
                                                                                    .policy
                                                                                    .POLICY_NUMBER
                                                                            }
                                                                            <br />
                                                                            <span className="text-sm">
                                                                                {
                                                                                    endorsement
                                                                                        .policy
                                                                                        .relation
                                                                                        .RELATION_ORGANIZATION_NAME
                                                                                }
                                                                            </span>
                                                                        </a>
                                                                    </>
                                                                }
                                                                className={""}
                                                            />
                                                            <TableTD
                                                                value={
                                                                    <>
                                                                        {
                                                                            endorsement.ENDORSEMENT_NUMBER
                                                                        }
                                                                    </>
                                                                }
                                                                className={""}
                                                            />
                                                            {/* <TableTD
                                                                value={
                                                                    <>
                                                                        <a
                                                                            href={
                                                                                "detailPolicy/" +
                                                                                endorsement.ENDORSEMENT_ID
                                                                            }
                                                                            // rel="noopener"
                                                                            target="_blank"
                                                                        >
                                                                            <div
                                                                                className="flex justify-center items-center"
                                                                                title="Detail"
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth={
                                                                                        1.5
                                                                                    }
                                                                                    stroke="currentColor"
                                                                                    className="size-6 text-red-700 cursor-pointer"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                                    />
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                        </a>
                                                                    </>
                                                                }
                                                                className={""}
                                                            /> */}
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    links={endorsements.links}
                                    fromData={endorsements.from}
                                    toData={endorsements.to}
                                    totalData={endorsements.total}
                                    clickHref={(url: string) =>
                                        getEndorsement(url.split("?").pop())
                                    }
                                />
                            </div>
                        </div>
                        {/* table page*/}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
