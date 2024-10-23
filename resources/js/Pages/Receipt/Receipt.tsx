import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import Button from "@/Components/Button/Button";
import Content from "@/Components/Content";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TableTH from "@/Components/Table/TableTH";
import { PageProps } from "@/types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import ToastMessage from "@/Components/ToastMessage";
import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TD from "@/Components/TD";
import TableTD from "@/Components/Table/TableTD";
import Pagination from "@/Components/Pagination";
import CurrencyInput from "react-currency-input-field";
import TextArea from "@/Components/TextArea";
import Select from "react-tailwindcss-select";
import InputSearch from "@/Components/InputSearch";
import dateFormat from "dateformat";
import Dropdown from "@/Components/Dropdown";
import BadgeFlat from "@/Components/BadgeFlat";

export default function Receipt({ auth }: PageProps) {
    useEffect(() => {
        getClient();
        getCurrency();
        getBankAccount();
    }, []);

    const [data, setData] = useState<any>({
        RECEIPT_DATE: new Date().toLocaleDateString("en-CA"),
        RECEIPT_RELATION_ORGANIZATION_ID: "",
        RECEIPT_CURRENCY_ID: "",
        RECEIPT_BANK_ID: "",
        RECEIPT_VALUE: "",
        RECEIPT_MEMO: "",
        RECEIPT_IS_DRAFT: "",
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: any) => {
        setIsSuccess("");

        setData({
            RECEIPT_DATE: new Date().toLocaleDateString("en-CA"),
            RECEIPT_RELATION_ORGANIZATION_ID: "",
            RECEIPT_CURRENCY_ID: "",
            RECEIPT_BANK_ID: "",
            RECEIPT_VALUE: "",
            RECEIPT_MEMO: "",
            RECEIPT_IS_DRAFT: "",
        });

        setIsSuccess(message);
        getReceipt();
    };
    // Handle Success End

    const [clients, setClient] = useState<any>([]);
    const getClient = async () => {
        await axios
            .get(`/getClient`)
            .then((res) => {
                setClient(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectClient = clients.map((client: any) => {
        return {
            value: client.RELATION_ORGANIZATION_ID,
            label: client.RELATION_ORGANIZATION_NAME,
        };
    });

    const getClientSelect = (value: any) => {
        if (value) {
            const selected = selectClient.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [currencies, setCurrency] = useState<any>([]);
    const getCurrency = async () => {
        await axios
            .get(`/getCurrency`)
            .then((res) => {
                setCurrency(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectCurrency = currencies.map((currency: any) => {
        return {
            value: currency.CURRENCY_ID,
            label: currency.CURRENCY_SYMBOL + " - " + currency.CURRENCY_NAME,
        };
    });

    const getCurrencySelect = (value: any) => {
        if (value) {
            const selected = selectCurrency.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [BankAccount, setBankAccount] = useState<any>([]);
    const getBankAccount = async () => {
        await axios
            .get(`/getBankAccount`)
            .then((res) => {
                setBankAccount(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectBankAccount = BankAccount.map((account: any) => {
        return {
            value: account.BANK_TRANSACTION_ID,
            label: account.BANK_TRANSACTION_NAME,
        };
    });

    const getBankAccountSelect = (value: any) => {
        if (value) {
            const selected = selectBankAccount.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [modalAdd, setModalAdd] = useState<any>({
        add: false,
    });

    const [modalEdit, setModalEdit] = useState<any>({
        edit: false,
    });

    const [modalDraft, setModalDraft] = useState<any>({
        draft: false,
    });

    const [dataById, setDataById] = useState<any>({});

    const handleAddModal = () => {
        setModalAdd({
            add: true,
        });
    };

    const handleEditModal = async (e: any, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReceiptById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalEdit({
            edit: true,
        });
    };

    const handleDraftModal = async (id: number) => {
        await axios
            .get(`/getReceiptById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalDraft({
            draft: true,
        });
    };

    // Search Start
    const [receipt, setReceipt] = useState<any>([]);

    const [searchReceipt, setSearchReceipt] = useState<any>({
        client_name: "",
    });

    const getReceipt = async (pageNumber = "page=1") => {
        await axios
            .post(`/getReceipt?${pageNumber}`, {
                client_name: searchReceipt.client_name,
            })
            .then((res) => {
                setReceipt(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Search End

    // Clear Search Start
    const clearSearchReceipt = async (pageNumber = "page=1") => {
        await axios
            .post(`/getReceipt?${pageNumber}`)
            .then((res) => {
                setReceipt(res.data);
                setSearchReceipt({
                    client_name: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Clear Search End

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: "IDR",
    });
    // End Function Format Currency

    // console.log("Data", data);
    // console.log("Receipt", receipt.data);
    console.log("Receipt by id : ", dataById);

    return (
        <AuthenticatedLayout user={auth.user} header={"Receipt"}>
            <Head title="Receipt" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Add Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full lg:min-w-[40%]`}
                show={modalAdd.add}
                onClose={() =>
                    setModalAdd({
                        add: false,
                    })
                }
                title="Add Receipt"
                url={`/receiptAdd`}
                data={data}
                method="post"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                body={
                    <div className="mt-4">
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_DATE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Date
                            </InputLabel>
                            <div className="grid grid-cols-1 w-full relative">
                                <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                <DatePicker
                                    name="RECEIPT_DATE"
                                    selected={data.RECEIPT_DATE}
                                    onChange={(date: any) =>
                                        setData({
                                            ...data,
                                            RECEIPT_DATE:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyy"
                                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm focus:ring-red-600 pl-10"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_RELATION_ORGANIZATION_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Client Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectClient}
                                isSearchable={true}
                                placeholder={"Choose Client Name"}
                                value={data.RECEIPT_RELATION_ORGANIZATION_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_RELATION_ORGANIZATION_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectCurrency}
                                isSearchable={true}
                                placeholder={"Choose Currency"}
                                value={data.RECEIPT_CURRENCY_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_CURRENCY_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_BANK_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Bank Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectBankAccount}
                                isSearchable={true}
                                placeholder={"Choose Bank Name"}
                                value={data.RECEIPT_BANK_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_BANK_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_VALUE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Value
                            </InputLabel>
                            <CurrencyInput
                                id="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                name="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                decimalScale={2}
                                decimalsLimit={2}
                                value={data.RECEIPT_VALUE}
                                onValueChange={(val: any) =>
                                    setData({ ...data, RECEIPT_VALUE: val })
                                }
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-7 text-right`}
                                placeholder="0.00"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_MEMO"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Description
                            </InputLabel>
                            <TextArea
                                rows="5"
                                className="shadow-none ring-1 ring-inset ring-gray-300"
                                value={data.RECEIPT_MEMO}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_MEMO: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="sm:absolute sm:bottom-3 sm:right-28">
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                    setData({
                                        ...data,
                                        RECEIPT_IS_DRAFT: 1,
                                    })
                                }
                            >
                                Save as Draft
                            </button>
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                    setData({
                                        ...data,
                                        RECEIPT_IS_DRAFT: 0,
                                    })
                                }
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                }
            />
            {/* Modal Add End */}

            {/* Modal Draft Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full lg:min-w-[40%]`}
                show={modalDraft.draft}
                onClose={() =>
                    setModalDraft({
                        draft: false,
                    })
                }
                title="Receipt Draft"
                url={`/receiptDraft`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName=""
                body={
                    <div className="mt-4">
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_DATE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Date
                            </InputLabel>
                            <div className="grid grid-cols-1 w-full relative">
                                <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                <DatePicker
                                    name="RECEIPT_DATE"
                                    selected={dataById.RECEIPT_DATE}
                                    onChange={(date: any) =>
                                        setDataById({
                                            ...dataById,
                                            RECEIPT_DATE:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyy"
                                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm focus:ring-red-600 pl-10"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_RELATION_ORGANIZATION_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Client Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectClient}
                                isSearchable={true}
                                placeholder={"Choose Client Name"}
                                value={{
                                    label: getClientSelect(
                                        dataById.RECEIPT_RELATION_ORGANIZATION_ID
                                    ),
                                    value: dataById.RECEIPT_RELATION_ORGANIZATION_ID,
                                }}
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_RELATION_ORGANIZATION_ID:
                                            val.value,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectCurrency}
                                isSearchable={true}
                                placeholder={"Choose Currency"}
                                value={{
                                    label: getCurrencySelect(
                                        dataById.RECEIPT_CURRENCY_ID
                                    ),
                                    value: dataById.RECEIPT_CURRENCY_ID,
                                }}
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_CURRENCY_ID: val.value,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_BANK_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Bank Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectBankAccount}
                                isSearchable={true}
                                placeholder={"Choose Bank Name"}
                                value={{
                                    label: getBankAccountSelect(
                                        dataById.RECEIPT_BANK_ID
                                    ),
                                    value: dataById.RECEIPT_BANK_ID,
                                }}
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_BANK_ID: val.value,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_VALUE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Value
                            </InputLabel>
                            <CurrencyInput
                                id="RECEIPT_VALUE"
                                name="RECEIPT_VALUE"
                                decimalScale={2}
                                decimalsLimit={2}
                                value={dataById.RECEIPT_VALUE}
                                onValueChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_VALUE: val,
                                    })
                                }
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-7 text-right`}
                                placeholder="0.00"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_MEMO"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Description
                            </InputLabel>
                            <TextArea
                                rows="5"
                                className="shadow-none ring-1 ring-inset ring-gray-300"
                                value={dataById.RECEIPT_MEMO || ""}
                                onChange={(e: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_MEMO: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="sm:absolute sm:bottom-3 sm:right-28">
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_IS_DRAFT: 1,
                                    })
                                }
                            >
                                Save as Draft
                            </button>
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_IS_DRAFT: 0,
                                    })
                                }
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                }
            />
            {/* Modal Draft End */}

            {/* Modal Edit Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[50%]`}
                show={modalEdit.edit}
                onClose={() =>
                    setModalEdit({
                        edit: false,
                    })
                }
                title="Receipt Edit"
                url=""
                data=""
                method=""
                onSuccess=""
                headers={null}
                submitButtonName="Save"
                body={
                    <div className="mt-4">
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_DATE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Date
                            </InputLabel>
                            <div className="grid grid-cols-1 w-full relative">
                                <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                <DatePicker
                                    name="RECEIPT_DATE"
                                    selected={data.RECEIPT_DATE}
                                    onChange={(date: any) =>
                                        setData({
                                            ...data,
                                            RECEIPT_DATE:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyy"
                                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm focus:ring-red-600 pl-10"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_RELATION_ORGANIZATION_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Client Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectClient}
                                isSearchable={true}
                                placeholder={"Choose Client Name"}
                                value={data.RECEIPT_RELATION_ORGANIZATION_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_RELATION_ORGANIZATION_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectCurrency}
                                isSearchable={true}
                                placeholder={"Choose Currency"}
                                value={data.RECEIPT_CURRENCY_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_CURRENCY_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_BANK_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Bank Name
                            </InputLabel>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-600`
                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                        }`,
                                }}
                                options={selectBankAccount}
                                isSearchable={true}
                                placeholder={"Choose Bank Name"}
                                value={data.RECEIPT_BANK_ID}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_BANK_ID: val,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_VALUE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Value
                            </InputLabel>
                            <CurrencyInput
                                id="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                name="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                decimalScale={2}
                                decimalsLimit={2}
                                value={data.RECEIPT_VALUE}
                                onValueChange={(val: any) =>
                                    setData({ ...data, RECEIPT_VALUE: val })
                                }
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-7 text-right`}
                                placeholder="0.00"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_MEMO"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Description
                            </InputLabel>
                            <TextArea
                                rows="5"
                                className="shadow-none ring-1 ring-inset ring-gray-300"
                                value={data.RECEIPT_MEMO}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_MEMO: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                }
            />
            {/* Modal Edit End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-xs sm:text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Add Receipt"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <div className="grid grid-cols-1 mb-5 relative">
                            <InputSearch
                                id="client_name"
                                name="client_name"
                                type="text"
                                value={searchReceipt.client_name}
                                placeholder="Client Name"
                                autoComplete="off"
                                onChange={(e: any) =>
                                    setSearchReceipt({
                                        ...searchReceipt,
                                        client_name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-end gap-2">
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => getReceipt()}
                            >
                                Search
                            </Button>
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => clearSearchReceipt()}
                            >
                                Clear Search
                            </Button>
                        </div>
                    </>
                }
                th={
                    <tr className="text-center">
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"No"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Receipt Number"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Receipt Date"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Client Name"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Currency"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Value"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Bank Name"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Description"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Status"}
                            colSpan=""
                            rowSpan=""
                        />
                        <TableTH
                            className="border whitespace-nowrap"
                            label={"Action"}
                            colSpan=""
                            rowSpan=""
                        />
                    </tr>
                }
                td={
                    <>
                        {receipt.data === undefined && (
                            <tr className="text-center">
                                <TD
                                    className="leading-10 font-medium text-gray-500"
                                    colSpan="10"
                                >
                                    Please Search Receipt
                                </TD>
                            </tr>
                        )}
                        {receipt.data?.length === 0 ? (
                            <tr className="text-center">
                                <TD
                                    className="leading-10 font-medium text-gray-500"
                                    colSpan="10"
                                >
                                    Data not available
                                </TD>
                            </tr>
                        ) : (
                            <>
                                {receipt.data?.map((data: any, i: number) => (
                                    <tr
                                        key={i}
                                        className="text-center cursor-pointer"
                                        onDoubleClick={
                                            data.RECEIPT_NUMBER === null
                                                ? () =>
                                                      handleDraftModal(
                                                          data.RECEIPT_ID
                                                      )
                                                : undefined
                                        }
                                    >
                                        <TableTD
                                            value={i + 1}
                                            className="whitespace-nowrap w-px"
                                        />
                                        <TableTD
                                            value={data.RECEIPT_NUMBER}
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={dateFormat(
                                                data.RECEIPT_DATE,
                                                "dd-mm-yyyy"
                                            )}
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={
                                                data.relation_organization
                                                    .RELATION_ORGANIZATION_NAME
                                            }
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={
                                                data.currency.CURRENCY_SYMBOL
                                            }
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={formatCurrency.format(
                                                data.RECEIPT_VALUE
                                            )}
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={
                                                data.bank_account
                                                    .BANK_TRANSACTION_NAME
                                            }
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={
                                                data.RECEIPT_MEMO
                                                    ? data.RECEIPT_MEMO
                                                    : "-"
                                            }
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            value={
                                                data.RECEIPT_IS_DRAFT === 1 ? (
                                                    <BadgeFlat
                                                        className=" bg-red-600 text-white"
                                                        title="Draft"
                                                        body="Draft"
                                                    />
                                                ) : (
                                                    <BadgeFlat
                                                        className=" bg-green-500 text-white"
                                                        title="Open"
                                                        body="Open"
                                                    />
                                                )
                                            }
                                            className="whitespace-nowrap"
                                        />
                                        <TableTD
                                            className=""
                                            value={
                                                <Dropdown
                                                    title="Actions"
                                                    className=""
                                                    children={
                                                        <>
                                                            <a
                                                                href=""
                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                // onClick={(e) =>
                                                                //     handleMatchModal(
                                                                //         e,
                                                                //         data.RECEIPT_ID
                                                                //     )
                                                                // }
                                                            >
                                                                Match
                                                            </a>
                                                            <a
                                                                href=""
                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                onClick={(e) =>
                                                                    handleEditModal(
                                                                        e,
                                                                        data.RECEIPT_ID
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </a>
                                                            <a
                                                                href=""
                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                // onClick={(e) =>
                                                                //     handleDeleteModal(
                                                                //         e,
                                                                //         data.RECEIPT_ID
                                                                //     )
                                                                // }
                                                            >
                                                                Delete
                                                            </a>
                                                            <a
                                                                href=""
                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                // onClick={(e) =>
                                                                //     handlePrintModal(
                                                                //         e,
                                                                //         data.RECEIPT_ID
                                                                //     )
                                                                // }
                                                            >
                                                                Print
                                                            </a>
                                                        </>
                                                    }
                                                />
                                            }
                                        />
                                    </tr>
                                ))}
                            </>
                        )}
                    </>
                }
                pagination={
                    <>
                        <Pagination
                            links={receipt.links}
                            fromData={receipt.from}
                            toData={receipt.to}
                            totalData={receipt.totalAmount}
                            clickHref={(url: string) =>
                                getReceipt(url.split("?").pop())
                            }
                        />
                    </>
                }
            />
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
