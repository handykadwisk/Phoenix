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

export default function ModalDetailEndorsement({
    endorsement,
    listPolicy,
    endorsementTypes,
    endorsementStatus,
    currency,
    onDeleteSuccess,
}: PropsWithChildren<{
    endorsement: any;
    listPolicy: any | null;
    endorsementTypes: any | null;
    endorsementStatus: any | null;
    currency: any | null;
    onDeleteSuccess: any;
}>) {
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [dataById, setDataById] = useState<any>(endorsement);
    const [sumByCurrency, setSumByCurrency] = useState<any>([]);
    const [flagDelete, setFlagDelete] = useState<number>(0);
    // const { insurance, endorsementTypes, endorsementStatus, currency }: any =
    //     usePage().props;

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
    ];

    useEffect(() => {
        getInsurancePanel(endorsement.ENDORSEMENT_ID);
        getSummaryPremi()
    }, [endorsement.ENDORSEMENT_ID]);

    const getInsurancePanel = async (id: number) => {
        // harusnya insurancePanelByEndorsementId
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setInsurancePanels(res.data))
            .catch((err) => console.log(err));
    };
    console.log("dataById: ", dataById);

    const editClick = () => {
        alert("a");
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // edit
    const handleEditModal = async () => {
        // e.preventDefault();
        const id = endorsement.ENDORSEMENT_ID;
        await axios
            .get(`/getEndorsement/${id}`)
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
    const editEndorsementPremium = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.endorsement_premium];
        changeVal[i][name] = value;
        console.log(name)
        setDataById({ ...dataById, endorsement_premium: changeVal });
    };
    // console.log("dataById: ", dataById);
    const addRowEditEndorsementPremium = (e: FormEvent) => {
        e.preventDefault();
        // console.log(dataById);
        setDataById({
            ...dataById,
            endorsement_premium: [
                ...dataById.endorsement_premium,
                {
                    ENDORSEMENT_PREMIUM_ID: null,
                    ENDORSEMENT_ID: dataById.ENDORSEMENT_ID,
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
                    // ADDITIONAL_PREMIUM: "",
                },
            ],
        });
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

        // getSummaryPremi();
    useEffect(() => {
        getSummaryPremi();
    }, [flagDelete]);

    const editEndorsementInstallment = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.endorsement_installment];
        changeVal[i][name] = value;
        setDataById({ ...dataById, endorsement_installment: changeVal });
    };

    const addRowEditInstallment = (e: FormEvent) => {
        e.preventDefault();
        // console.log(dataById);
        setDataById({
            ...dataById,
            endorsement_installment: [
                ...dataById.endorsement_installment,
                {
                    ENDORSEMENT_INSTALLMENT_ID: null,
                    ENDORSEMENT_ID: dataById.ENDORSEMENT_ID,
                    ENDORSEMENT_INSTALLMENT_TERM: "",
                    ENDORSEMENT_INSTALLMENT_RATE: "",
                    ENDORSEMENT_INSTALLMENT_DUE_DATE: "",
                    ENDORSEMENT_INSTALLMENT_AMOUNT: "",
                },
            ],
        });
    };

    const deleteRowEditInstallment = (i: number) => {
        const val = [...dataById.endorsement_installment];
        val.splice(i, 1);
        if (dataById.endorsement_installment[i].endorsement_installment_id !== null) {
            if (dataById.deletedInstallment) {
                setDataById({
                    ...dataById,
                    endorsement_installment: val,
                    deletedEndorsementPremium: [
                        ...dataById.deletedInstallment,
                        {
                            endorsement_installment_id:
                                dataById.endorsement_installment[i]
                                    .ENDORSEMENT_INSTALLMENT_ID,
                        },
                    ],
                });
            } else {
                setDataById({
                    ...dataById,
                    endorsement_installment: val,
                    deletedEndorsementPremium: [
                        {
                            endorsement_installment_id:
                                dataById.endorsement_installment[i]
                                    .ENDORSEMENT_INSTALLMENT_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                endorsement_installment: val,
            });
        }
    };
    const editCalculate = (i: number) => {
        const changeVal: any = [...dataById.endorsement_premium];
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
        setDataById({ ...dataById, endorsement_premium: changeVal });

        getSummaryPremi();
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
                });
            }
        });
        // setIsSuccess(message);
        // getPolicy();
    };

    const handleDeleteModal = async () => {
        const id = endorsement.ENDORSEMENT_ID;
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
                    .patch(`/deactivateEndorsement/${id}`, { id: id })
                    .then((res) => {
                        console.log(res.data.status);
                        if (res.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Endorsement has been deleted.",
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

    const getCurrencyById = (currId: any) => {
        console.log("currId: ", currId);
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result.CURRENCY_SYMBOL : null;
    };

    const getSummaryPremi = () => {
        // const dataToGroup = dataById.endorsement_premium;
        const dataToGroup: any = [...dataById.endorsement_premium];
        // alert('aa')
        const groupBy = (data: any, keys: any) => {
            return Object.values(
                data.reduce((acc: any, val: any) => {
                    const currency_id = keys.reduce(
                        (finalName: any, key: any) => finalName + val[key],
                        ""
                    );
                    if (acc[currency_id]) {
                        acc[currency_id].values.push(val.NETT_PREMI);
                        acc[currency_id].sum += val.NETT_PREMI;
                    } else {
                        acc[currency_id] = {
                            currency_id,
                            sum: val.NETT_PREMI,
                            values: [val.NETT_PREMI],
                        };
                    }
                    return acc;
                }, {})
            );
        };
       
        setSumByCurrency(groupBy(dataToGroup, ["CURRENCY_ID"]));
    };

    
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
                    });
                    setSumByCurrency([]);
                }}
                title={"Edit Endorsement"}
                url={`/editEndorsement/${dataById.ENDORSEMENT_ID}`}
                data={dataById}
                onSuccess={handleSuccess}
                // onSuccess={""}
                method={"patch"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                body={
                    <>
                        <div className="grid grid-rows grid-flow-col gap-4 ml-4 mr-4">
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_policy_number"
                                    value="Policy Number"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.POLICY_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_ID: e.target.value,
                                        })
                                    }
                                    disabled
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
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_policy_the_insured"
                                    value="Policy The Insured"
                                />
                                <TextInput
                                    id="edit_policy_the_insured"
                                    type="text"
                                    name="edit_policy_the_insured"
                                    value={dataById.policy.POLICY_THE_INSURED}
                                    className=""
                                    autoComplete="edit_policy_the_insured"
                                    readOnly
                                />
                            </div>
                            {dataById.SELF_INSURED ? (
                                <div className="mb-4 w-24 ">
                                    <InputLabel
                                        htmlFor="self_insured"
                                        value="Self Insured %"
                                    />
                                    <TextInput
                                        id="self_insured"
                                        type="text"
                                        name="self_insured"
                                        value={dataById.SELF_INSURED}
                                        className=""
                                        autoComplete="SELF_INSURED"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                SELF_INSURED: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 ml-4 mr-4">
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_endorsement_number"
                                    value="Endorsement Number"
                                />
                                <TextInput
                                    id="edit_endorsement_number"
                                    type="text"
                                    name="edit_endorsement_number"
                                    value={dataById.ENDORSEMENT_NUMBER}
                                    className=""
                                    autoComplete="edit_endorsement_number"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_NUMBER: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_endorsement_type"
                                    value="Endorsement Type"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.ENDORSEMENT_TYPE_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_TYPE_ID: e.target.value,
                                        })
                                    }
                                    required
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
                                                    {eT.ENDORSEMENT_TYPE_NAME}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_endorsement_effective_date"
                                    value="Inception Date"
                                />
                                <TextInput
                                    id="edit_endorsement_effective_date"
                                    type="date"
                                    name="edit_endorsement_effective_date"
                                    value={dataById.ENDORSEMENT_EFFECTIVE_DATE}
                                    className=""
                                    autoComplete="edit_endorsement_effective_date"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_EFFECTIVE_DATE:
                                                e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_endorsement_status"
                                    value="Endorsement Status"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.ENDORSEMENT_STATUS}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_STATUS: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value={""}>
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

                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_endorsement_note"
                                    value="Endorsement Note"
                                />
                                <TextInput
                                    id="edit_endorsement_note"
                                    type="text"
                                    name="edit_endorsement_note"
                                    value={dataById.ENDORSEMENT_NOTE}
                                    className=""
                                    autoComplete="edit_endorsement_note"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_NOTE: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-8 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Endorsement Premium
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
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
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
                                    {dataById.endorsement_premium?.map(
                                        (eP: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b w-10 text-sm border-[#eee]  dark:border-strokedark">
                                                        {i + 1}
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <TextInput
                                                            type="text"
                                                            id="coverage_name"
                                                            name="COVERAGE_NAME"
                                                            value={
                                                                eP.COVERAGE_NAME
                                                            }
                                                            onChange={(e) =>
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <select
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            value={
                                                                eP.CURRENCY_ID
                                                            }
                                                            onChange={(e) => {
                                                                editEndorsementPremium(
                                                                    "CURRENCY_ID",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="gross_premi"
                                                            name="GROSS_PREMI"
                                                            value={
                                                                eP.GROSS_PREMI
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="admin_cost"
                                                            name="ADMIN_COST"
                                                            value={
                                                                eP.ADMIN_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_broker"
                                                            name="DISC_BROKER"
                                                            value={
                                                                eP.DISC_BROKER
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_consultation"
                                                            name="DISC_CONSULTATION"
                                                            value={
                                                                eP.DISC_CONSULTATION
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="disc_admin"
                                                            name="DISC_ADMIN"
                                                            value={
                                                                eP.DISC_ADMIN
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="nett_premi"
                                                            name="NETT_PREMI"
                                                            value={
                                                                eP.NETT_PREMI
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="fee_based_income"
                                                            name="FEE_BASED_INCOME"
                                                            value={
                                                                eP.FEE_BASED_INCOME
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
                                                                    "FEE_BASED_INCOME",
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="agent_commision"
                                                            name="AGENT_COMMISION"
                                                            value={
                                                                eP.AGENT_COMMISION
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
                                                                    "AGENT_COMMISION",
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
                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="acquisition_cost"
                                                            name="ACQUISITION_COST"
                                                            value={
                                                                eP.ACQUISITION_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementPremium(
                                                                    "ACQUISITION_COST",
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

                                                    <td className="border-b text-sm border-[#eee]  dark:border-strokedark">
                                                        {dataById
                                                            .endorsement_premium
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
                                                                    deleteRowEditEndorsementPremium(
                                                                        i
                                                                    ),
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
                                    <div className="w-40 mb-2 mt-2">
                                        <a
                                            href=""
                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                            onClick={(e) =>
                                                addRowEditEndorsementPremium(e)
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
                                Endorsement Installment
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
                                    {dataById.endorsement_installment?.map(
                                        (eI: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <TextInput
                                                            id="endorsement_installment_term"
                                                            name="ENDORSEMENT_INSTALLMENT_TERM"
                                                            value={
                                                                eI.ENDORSEMENT_INSTALLMENT_TERM
                                                            }
                                                            onChange={(e) =>
                                                                editEndorsementInstallment(
                                                                    "ENDORSEMENT_INSTALLMENT_TERM",
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
                                                            id="endorsement_installment_rate"
                                                            name="ENDORSEMENT_INSTALLMENT_RATE"
                                                            value={
                                                                eI.ENDORSEMENT_INSTALLMENT_RATE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editEndorsementInstallment(
                                                                    "ENDORSEMENT_INSTALLMENT_RATE",
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
                                                            id="endorsement_installment_due_date"
                                                            name="ENDORSEMENT_INSTALLMENT_DUE_DATE"
                                                            value={
                                                                eI.ENDORSEMENT_INSTALLMENT_DUE_DATE
                                                            }
                                                            onChange={(e) =>
                                                                editEndorsementInstallment(
                                                                    "ENDORSEMENT_INSTALLMENT_DUE_DATE",
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
                                                            .endorsement_installment
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

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-1">
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className=" mb-4">
                                <div className="flex">
                                    <div className="text-xl font-semibold leading-6 items-center text-gray-900 ml-4 mr-4 border-b-2 w-fit">
                                        <span className="">
                                            Endorsement Number:{" "}
                                            {endorsement.ENDORSEMENT_NUMBER}
                                        </span>
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-3 gap-4 mr-6">
                                    <div className="col-span-2">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Endorsement:{" "}
                                            {endorsement.ENDORSEMENT_NUMBER}
                                        </h3>
                                    </div>
                                </div> */}

                                {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Number</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    endorsement.policy
                                                        .POLICY_NUMBER
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>The Insured</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    endorsement.policy
                                                        .POLICY_THE_INSURED
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Effective Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    endorsement.ENDORSEMENT_EFFECTIVE_DATE
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Endorsement Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    endorsement.endorsement_type
                                                        .ENDORSEMENT_TYPE_NAME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Note</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {endorsement.ENDORSEMENT_NOTE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Status</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {" "}
                                                {endorsement.ENDORSEMENT_STATUS ==
                                                0
                                                    ? "Ongoing"
                                                    : endorsement.ENDORSEMENT_STATUS ==
                                                      1
                                                    ? "Finalized"
                                                    : "Canceled"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <hr className="mt-5" /> */}

                            <div className="grid  gap-4">
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-2 mr-2 mb-3 border-b-2 w-fit">
                                            Endorsement Premium
                                        </h3>
                                        {/* <hr className="my-3 w-auto ml-2 mr-2" /> */}
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 ml-0">
                                        <div className="overflow-x-auto inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full ">
                                                <thead>
                                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                                        <th className="min-w-[10px] py-2 px-2 text-sm text-black dark:text-white">
                                                            No.
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Coverage Name
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Currency
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Gross Premi
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Admin Cost
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Disc Broker
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Disc Consultation
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Disc Admin
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Nett Premi
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Fee Based Income
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Agen Commision
                                                        </th>
                                                        <th className="min-w-[150px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Acquisition Costs
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {endorsement.endorsement_premium.map(
                                                        (
                                                            eP: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        eP.COVERAGE_NAME
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {eP.currency
                                                                        ? eP
                                                                              .currency
                                                                              .CURRENCY_SYMBOL
                                                                        : ""}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.GROSS_PREMI
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.ADMIN_COST
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.DISC_BROKER
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.DISC_CONSULTATION
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.DISC_ADMIN
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.NETT_PREMI
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.FEE_BASED_INCOME
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.AGENT_COMMISION
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        eP.ACQUISITION_COST
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
                            </div>
                            <div>
                                <div className="relative w-1/4 overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4 mt-4">
                                    <div className="ml-6 mb-4">
                                        <h2 className=" text-lg font-semibold text-gray-900 dark:text-white">
                                            Summary Premium:
                                        </h2>
                                        <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
                                            {sumByCurrency?.map(
                                                (sum: any, i: number) => {
                                                    if (
                                                        sum.currency_id &&
                                                        sum.currency_id !=
                                                            "null"
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
                            <div>
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4 mb-3 border-b-2 w-fit">
                                            Installment
                                        </h3>
                                        {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 -ml-2">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full ">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            Installment
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Term Rate %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Due Date
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Payment
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {endorsement.endorsement_installment.map(
                                                        (
                                                            eI: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {
                                                                        eI.ENDORSEMENT_INSTALLMENT_TERM
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        eI.ENDORSEMENT_INSTALLMENT_RATE
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        eI.ENDORSEMENT_INSTALLMENT_DUE_DATE
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {/* Cek Ke DN. Jika sudah ada DN maka Paid tampilkan tanggal, jika belum Unpaid, tampilkan selisihnya */}
                                                                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                                        Unpaid
                                                                    </span>
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

                            {/* Insurance Panel */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4 mb-3 border-b-2 w-fit">
                                            Insurer Information
                                        </h3>
                                        {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 -ml-2">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            No.
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Insurance
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Share
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {insurancePanels.map(
                                                        (
                                                            insurancePanel: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {/* {insurancePanel.IP_POLICY_LEADER ==
                                                                    1
                                                                        ? insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Leader"
                                                                        : insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Member"} */}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {insurancePanel.IP_POLICY_SHARE +
                                                                        " %"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                            {/* End Insurance Panel */}
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
