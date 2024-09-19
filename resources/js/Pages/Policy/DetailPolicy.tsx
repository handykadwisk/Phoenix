import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
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
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";
import SwitchPage from "@/Components/Switch";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import FormGeneral from "./FormGeneral";
import FormCertificate from "./FormCertificate";
import ToastMessage from "@/Components/ToastMessage";
// import ModalTest from "./ModalTest";

export default function DetailPolicy({
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
    const [policyDetail, setPolicyDetail] = useState<any>(policy);
    const [dataById, setDataById] = useState<any>(policy);
    const [flagSwitch, setFlagSwitch] = useState<boolean>(false);
    const [dataCoverageName, setDataCoverageName] = useState<any>([]);
    const [isSuccess, setIsSuccess] = useState<string>("");


    const policyType = [
        { ID: "1", NAME: "Full Policy" },
        { ID: "2", NAME: "Master Policy/Certificate" },
    ];

    useEffect(() => {
        getDataCoverageName(policy.POLICY_ID);
        getDetailPolicy(policy.POLICY_ID);
        getSummaryFinancial(policy.POLICY_ID);
        getCoa();
    }, [policy.POLICY_ID]);

    const getDetailPolicy = async (id: number) => {
        await axios
            .get(`/getPolicy/${id}`)
            .then((res) => setPolicyDetail(res.data))
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
        editPartners: false,
    });

    const getCurrencyById = (currId: any) => {
        const dataCurr = currency;
        const result = dataCurr.find((id: any) => id.CURRENCY_ID == currId);
        return result ? result.CURRENCY_SYMBOL : null;
    };


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
            editPartners: false,
        });
    };
    // end edit

    
    const [summaryFinancial, setSummaryFinancial] = useState<any>([]);

    
    const getSummaryFinancial = async (policy_id: number) => {
        await axios
            .get(`/getSummary/${policy_id}`)
            .then((res) => {
                setSummaryFinancial(res.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (summaryFinancial.length > 0) {
            summaryFinancial.map((record: any, i: number) => {
                record.detail.map((course: any, j: number) => {
                });
            });
        }
    }, [summaryFinancial]);

    const [listCoa, setListCoa] = useState<any>([]);
    const getCoa = async () => {
        await axios
            .get(`/getCoa`)
            .then((res) => {
                setListCoa(res.data);
            })
            .catch((err) => console.log(err));
    };

    

    const handleSuccess = (message: any) => {
        getDetailPolicy(policy.POLICY_ID);

       setIsSuccess("");
       if (message != "") {
           setIsSuccess(message.msg);
           setTimeout(() => {
               setIsSuccess("");
           }, 5000);
       }
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
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
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
                    });
                }}
                title={"Edit Policy"}
                url={`/editPolicy/${dataById.POLICY_ID}`}
                data={dataById}
                onSuccess={handleSuccess}
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
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="edit_policy_type"
                                    value="Policy Type"
                                />
                                <select
                                    className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.POLICY_TYPE}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_TYPE: e.target.value,
                                        })
                                    }
                                >
                                    <option value={""}>
                                        -- <i>Choose Policy Type</i> --
                                    </option>
                                    {policyType?.map((status: any) => {
                                        return (
                                            <option value={status.ID}>
                                                {status.NAME}
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
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 pointer-events-none">
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
                                        selected={
                                            dataById.POLICY_INCEPTION_DATE
                                        }
                                        onChange={(date: any) =>
                                            setDataById({
                                                ...dataById,
                                                POLICY_INCEPTION_DATE:
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                            })
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
                                    htmlFor="edit_policy_due_date"
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
                                        selected={dataById.POLICY_DUE_DATE}
                                        onChange={(date: any) =>
                                            setDataById({
                                                ...dataById,
                                                POLICY_DUE_DATE:
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                            })
                                        }
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyyy"
                                        className="border-0 rounded-md shadow-md text-sm h-9 w-full px-10 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    />
                                </div>
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
                                <InputLabel value="Self Insured" />

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
                                                    autoComplete="off"
                                                />
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
                                            {policyDetail.POLICY_NUMBER}{" "}
                                        </span>
                                    </div>
                                    <div className="rounded-md bg-green-50 px-2 py-1 content-center text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {policyDetail.POLICY_STATUS_ID == 1 ? (
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
                                                    policyDetail.relation
                                                        .RELATION_ORGANIZATION_NAME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {policyDetail.SELF_INSURED ? (
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="">
                                                <span>Self Insured</span>
                                            </div>
                                            <div className=" col-span-3">
                                                <span className="font-normal text-gray-500">
                                                    {policyDetail.SELF_INSURED}{" "}
                                                    {" %"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
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
                                                {
                                                    policyDetail.POLICY_THE_INSURED
                                                }
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
                                                {dateFormat(
                                                    policyDetail.POLICY_INCEPTION_DATE,
                                                    "dd-mm-yyyy"
                                                )}
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
                                                    policyDetail.insurance_type
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
                                                {dateFormat(
                                                    policyDetail.POLICY_DUE_DATE,
                                                    "dd-mm-yyyy"
                                                )}
                                                {/* {policyDetail.POLICY_DUE_DATE} */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policyDetail.POLICY_TYPE == 1
                                                    ? "Full Policy"
                                                    : "Master Policy/Certificate"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body Form */}

                            {policyDetail.POLICY_TYPE == 1 ? (
                                <FormGeneral
                                    policy={dataById}
                                    insurance={insurance}
                                    clients={clients}
                                    insuranceType={insuranceType}
                                    policyStatus={policyStatus}
                                    currency={currency}
                                    onDeleteSuccess={""}
                                />
                            ) : (
                                <FormCertificate />
                            )}

                            {/* End Body Form */}

                            {/* Summary */}
                            <div className="bg-white shadow-md rounded-md mt-6 p-4 max-w-full ml-4">
                                <div className="border-b-2 w-fit font-semibold text-lg">
                                    <span>Summary</span>
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                    <table className="table-auto w-full">
                                        <thead className="border-b bg-gray-50">
                                            <tr className="text-sm font-semibold text-gray-900">
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Title
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-20  border-r border-gray-300 ">
                                                    Currency
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Original Value
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    PPn
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    PPh
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Nett Value
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    IDR Conversion
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Total
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    COA
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summaryFinancial.map(
                                                (record: any, i: number) => {
                                                    // return record.map(
                                                    //     (course:any, j:number) => {
                                                    return record.detail.map(
                                                        (r: any, k: number) => {
                                                            let titleTdEl;
                                                            if (k === 0) {
                                                                titleTdEl = (
                                                                    <td
                                                                        rowSpan={
                                                                            record
                                                                                .detail
                                                                                .length
                                                                        }
                                                                        className="p-1 border"
                                                                    >
                                                                        {
                                                                            <div className="block w-40 mx-auto text-left">
                                                                                {
                                                                                    record.title
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                );
                                                            }

                                                            let totalTdEl;
                                                            if (k === 0) {
                                                                totalTdEl = (
                                                                    <td
                                                                        rowSpan={
                                                                            record
                                                                                .detail
                                                                                .length
                                                                        }
                                                                        className="p-1 border"
                                                                    >
                                                                        {
                                                                            <div className="block w-40 mx-auto text-right">
                                                                                {/* {record.detail.reduce(
                                                                                    function (
                                                                                        prev: any,
                                                                                        current: any
                                                                                    ) {
                                                                                        return (
                                                                                            prev +
                                                                                            +(
                                                                                                current.AMOUNT *
                                                                                                current.EXCHANGE_RATE
                                                                                            )
                                                                                        );
                                                                                    },
                                                                                    0
                                                                                )} */}
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    record.detail.reduce(
                                                                                        function (
                                                                                            prev: any,
                                                                                            current: any
                                                                                        ) {
                                                                                            return (
                                                                                                prev +
                                                                                                +(
                                                                                                    current.AMOUNT *
                                                                                                    current.EXCHANGE_RATE
                                                                                                )
                                                                                            );
                                                                                        },
                                                                                        0
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                );
                                                            }

                                                            return r.AMOUNT !=
                                                                0 ? (
                                                                <tr
                                                                    key={k}
                                                                    className="text-sm"
                                                                >
                                                                    {titleTdEl}
                                                                    <td className="p-1 border">
                                                                        {
                                                                            <div className="block w-20 mx-auto text-left">
                                                                                {getCurrencyById(
                                                                                    r.CURRENCY_ID
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-1 border">
                                                                        {
                                                                            <div className="block w-40 mx-auto text-right">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    parseFloat(
                                                                                        r.AMOUNT
                                                                                    ) +
                                                                                        -1 *
                                                                                            parseFloat(
                                                                                                r.PPN
                                                                                            ) +
                                                                                        -1 *
                                                                                            parseFloat(
                                                                                                r.PPH
                                                                                            )
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-1 border">
                                                                        {
                                                                            <div className="block w-40 mx-auto text-right">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    r.PPN
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-1 border">
                                                                        {
                                                                            <div className="block w-40 mx-auto text-right">
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    r.PPH
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-1 border">
                                                                        {
                                                                            <div className="block w-40 mx-auto text-right">
                                                                                {/* Nett
                                                                                Value */}
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    // r.AMOUNT
                                                                                    parseFloat(
                                                                                        r.AMOUNT
                                                                                    ) +
                                                                                        -1 *
                                                                                            parseFloat(
                                                                                                r.PPN
                                                                                            ) +
                                                                                        -1 *
                                                                                            parseFloat(
                                                                                                r.PPH
                                                                                            ) +
                                                                                        parseFloat(
                                                                                            r.PPN
                                                                                        ) +
                                                                                        parseFloat(
                                                                                            r.PPH
                                                                                        )
                                                                                )}
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-1 border">
                                                                        <div className="block w-52 mx-auto text-right">
                                                                            {new Intl.NumberFormat(
                                                                                "id",
                                                                                {
                                                                                    style: "decimal",
                                                                                }
                                                                            ).format(
                                                                                r.AMOUNT *
                                                                                    r.EXCHANGE_RATE
                                                                            )}
                                                                        </div>
                                                                        {r.EXCHANGE_RATE ==
                                                                        1 ? (
                                                                            ""
                                                                        ) : (
                                                                            <div className="block w-52 mx-auto text-xs text-right">
                                                                                Kurs:{" "}
                                                                                {new Intl.NumberFormat(
                                                                                    "id",
                                                                                    {
                                                                                        style: "decimal",
                                                                                    }
                                                                                ).format(
                                                                                    r.EXCHANGE_RATE
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    {totalTdEl}
                                                                    <td className="p-1 border">
                                                                        <select className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6">
                                                                            <option
                                                                                value={
                                                                                    ""
                                                                                }
                                                                            >
                                                                                --{" "}
                                                                                <i>
                                                                                    Choose
                                                                                    COA
                                                                                </i>{" "}
                                                                                --
                                                                            </option>
                                                                            {listCoa.map(
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
                                                                                                item.COA_ID
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                item.COA_TITLE
                                                                                            }
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                ""
                                                            );
                                                        }
                                                    );
                                                    //     }
                                                    // );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* End Report Summary */}
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}
                </dl>
            </div>
        </>
        // </AuthenticatedLayout>
    );
}
