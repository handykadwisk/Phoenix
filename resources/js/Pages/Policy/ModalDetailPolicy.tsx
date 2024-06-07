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
    // const { insurance, insuranceType, policyStatus, currency }: any =
    //     usePage().props;

    useEffect(() => {
        getInsurancePanel(policy.POLICY_ID);
    }, [policy.POLICY_ID]);

    const getInsurancePanel = async (id: number) => {
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setInsurancePanels(res.data))
            .catch((err) => console.log(err));
    };
    console.log(insurancePanels);

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
        const id = policy.POLICY_ID;

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
    // console.log("dataById: ", dataById);
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
    const editCalculate = (i: number) => {
        const changeVal: any = [...dataById.policy_initial_premium];
        // changeVal[i][name] = value;
        const si = changeVal[i]["SUM_INSURED"];
        const rate = changeVal[i]["RATE"];
        if (si && rate) {
            changeVal[i]["INITIAL_PREMIUM"] = (si * rate) / 100;
        } else [(changeVal[i]["INITIAL_PREMIUM"] = 0)];
        // console.log("calculate: ", changeVal[i]["INITIAL_PREMIUM"]);
        setDataById({ ...dataById, policy_initial_premium: changeVal });
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

    // Parent Component
    // const callbackModal = () => {
    //     setState({ showModal: false });
    // };
    // //ChildButton
    // closeButtonClickHandler = () => {
    //     this.props.callbackModal();
    // };
    const handleDeleteModal = async () => {
        // alert("aaa");
        onDeleteSuccess(true)
    };

    // console.log("ModalDetailPolicy: ", policy);

    return (
        <>
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
                // onSuccess={""}
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
                                    <option>
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
                                    value="Expired Date"
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
                            <div></div>
                        </div>

                        <div className="mt-8 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Initial Premium
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            No.
                                        </th>
                                        <th className="w-20 py-4 px-4 text-sm text-black dark:text-white">
                                            Currency
                                        </th>
                                        {/* <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Installment
                                        </th> */}
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
                                        (iP: any, i: number) => {
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
                                                            onChange={(e) =>
                                                                editInitialPremium(
                                                                    "CURRENCY_ID",
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
                                                    {/* <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
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
                                                    </td> */}
                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="sum_insured"
                                                            name="SUM_INSURED"
                                                            value={
                                                                iP.SUM_INSURED
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
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
                                                            value={iP.RATE}
                                                            decimalScale={2}
                                                            decimalsLimit={2}
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
                                                addRowEditInitialPremium(e)
                                            }
                                        >
                                            + Add Row
                                        </a>
                                    </div>
                                </tbody>
                            </table>
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

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-1">
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="mt-2">
                                <div className="grid grid-cols-3 gap-4 mr-6">
                                    <div className="col-span-2">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Policy {policy.POLICY_NUMBER}{" "}
                                            <sup>
                                                {policy.POLICY_STATUS_ID ==
                                                1 ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        Current
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                        Lapse
                                                    </span>
                                                )}
                                            </sup>
                                        </h3>
                                    </div>
                                    {/* <div className="col-end-5">
                                        <Button
                                            className="text-sm w-full lg:w-1/2 font-semibold px-6 py-1.5 mb-4 md:col-span-2"
                                            onClick={() => {
                                                // setSwitchPage(false);
                                               alert('a')
                                            }}
                                        >
                                            {"Edit"}
                                        </Button>
                                    </div> */}
                                </div>

                                <hr className="my-3 w-auto ml-4 mr-6" />
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
                                <div className="">
                                    {/* <div className="grid grid-cols-4 gap-4">
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
                                    </div> */}
                                </div>
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
                                    {/* <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Status</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_STATUS_ID == 1
                                                    ? "Current"
                                                    : "Lapse"}
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Expired Date</span>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Initial Premium
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 ml-0">
                                        {/* <div className="mt-8 flow-root"> */}
                                        {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            No
                                                        </th>
                                                        {/* <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Currency
                                                        </th> */}
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
                                                            Initial Premium
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {policy.policy_initial_premium.map(
                                                        (
                                                            pip: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                </td> */}
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.SUM_INSURED
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        // decimalSeparator={','}
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {pip.RATE}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.INITIAL_PREMIUM
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        // decimalSeparator={','}
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Installment
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 -ml-2">
                                        {/* <div className="mt-8 flow-root"> */}
                                        {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
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
                                                    {policy.policy_installment.map(
                                                        (
                                                            pI: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {
                                                                        pI.POLICY_INSTALLMENT_TERM
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pI.POLICY_INSTALLMENT_PERCENTAGE
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pI.INSTALLMENT_DUE_DATE
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
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Insurer Information
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
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
                                                                    {insurancePanel.IP_POLICY_LEADER ==
                                                                    1
                                                                        ? insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Leader"
                                                                        : insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Member"}
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
            <div className=" mt-7 absolute">
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
