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
import { FormEvent, useEffect, useState } from "react";
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
import AGGrid from "@/Components/AgGrid";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";
import { generateReceiptPDF } from "@/Pages/Receipt/Print";
import TH from "@/Components/TH";
import Checkbox from "@/Components/Checkbox";

export default function Receipt({ auth }: PageProps) {
    useEffect(() => {
        getClient();
        getCurrency();
        getBankAccount();
    }, []);

    const [modalAdd, setModalAdd] = useState<any>({
        add: false,
    });

    const [modalEdit, setModalEdit] = useState<any>({
        edit: false,
    });

    const [modalDraft, setModalDraft] = useState<any>({
        draft: false,
    });

    const [modalMatch, setModalMatch] = useState<any>({
        match: false,
    });

    const [dataById, setDataById] = useState<any>({});

    const [data, setData] = useState<any>({
        RECEIPT_DATE: new Date().toLocaleDateString("en-CA"),
        RECEIPT_RELATION_ORGANIZATION_ID: "",
        RECEIPT_NAME: "",
        RECEIPT_CURRENCY_ID: "",
        RECEIPT_BANK_ID: "",
        RECEIPT_VALUE: "",
        RECEIPT_MEMO: "",
        RECEIPT_STATUS: "",
    });

    useEffect(() => {
        if (data.RECEIPT_RELATION_ORGANIZATION_ID !== "") {
            setData({
                ...data,
                RECEIPT_NAME: data.RECEIPT_RELATION_ORGANIZATION_ID["label"],
            });
        }
    }, [data.RECEIPT_RELATION_ORGANIZATION_ID]);

    useEffect(() => {
        if (dataById.RECEIPT_RELATION_ORGANIZATION_ID !== "") {
            setDataById({
                ...dataById,
                RECEIPT_NAME: getClientSelect(
                    dataById.RECEIPT_RELATION_ORGANIZATION_ID
                ),
            });
        }
    }, [dataById.RECEIPT_RELATION_ORGANIZATION_ID]);

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: any) => {
        setIsSuccess("");

        setData({
            RECEIPT_DATE: new Date().toLocaleDateString("en-CA"),
            RECEIPT_RELATION_ORGANIZATION_ID: "",
            RECEIPT_NAME: "",
            RECEIPT_CURRENCY_ID: "",
            RECEIPT_BANK_ID: "",
            RECEIPT_VALUE: "",
            RECEIPT_MEMO: "",
            RECEIPT_STATUS: "",
        });

        if (message.alert === "exchange_rate") {
            Swal.fire({
                title: "Warning",
                text: message.msg,
                icon: "warning",
            });
        } else {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);

            setRefreshSuccess("success");
            setTimeout(() => {
                setRefreshSuccess("");
            }, 1000);
        }
    };
    // Handle Success End

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
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalEdit({
            edit: true,
        });
    };

    const handleDraftModal = async (data: any) => {
        await axios
            .get(`/getReceiptById/${data.RECEIPT_ID}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        if (data.RECEIPT_STATUS === 1) {
            setModalDraft({
                draft: true,
            });
        }
    };

    const handleDelete = async (e: any, id: number) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete the data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios
                    .delete(`/receiptDelete/${id}`)
                    .then((res) => {
                        setDataById(res.data);
                        // console.log(res.data);

                        setIsSuccess("Receipt has been deleted.");
                        setTimeout(() => {
                            setIsSuccess("");
                        }, 5000);

                        setRefreshSuccess("success");
                        setTimeout(() => {
                            setRefreshSuccess("");
                        }, 1000);
                    })
                    .catch((err) => console.log(err));
            }
        });
    };

    const handlePrint = (receipt_id: number, e: FormEvent) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "You want to print this data",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                generateReceiptPDF(receipt_id);
            }
        });
    };

    const handleMatchModal = async (e: any, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReceiptById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalMatch({
            match: true,
        });
    };

    // For refresh AG Grid data
    const [refreshSuccess, setRefreshSuccess] = useState<string>("");

    // Search Start
    const [searchReceipt, setSearchReceipt] = useState<any>({
        receipt_search: [
            {
                RECEIPT_ID: "",
                RECEIPT_NAME: "",
                CLIENT_NAME: "",
                flag: "flag",
            },
        ],
    });

    // console.log("Search", searchReceipt);
    // Search End

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchReceipt.receipt_search];
        changeVal[i][name] = value;
        setSearchReceipt({
            ...searchReceipt,
            receipt_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchReceipt = () => {
        inputDataSearch("RECEIPT_ID", "", 0);
        inputDataSearch("RECEIPT_NAME", "", 0);
        inputDataSearch("CLIENT_NAME", "", 0);
        inputDataSearch("flag", "flag", 0);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Clear Search End

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

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        // style: "currency",
        // currency: "IDR",
    });
    // End Function Format Currency

    const handleSelectChange = (e: any, id: number) => {
        const selectedValue = e.target.value;

        if (selectedValue === "match") {
            handleMatchModal(e, id);
        } else if (selectedValue === "edit") {
            handleEditModal(e, id);
        } else if (selectedValue === "delete") {
            handleDelete(e, id);
        } else if (selectedValue === "print") {
            handlePrint(id, e);
        }
    };

    // console.log("Data", data);
    // console.log("Receipt by id : ", dataById);

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
                submitButtonName=""
                body={
                    <div className="mt-4">
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_DATE"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Date
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                htmlFor="RECEIPT_NAME"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Payment From
                                <span className="text-red-600">*</span>
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_NAME"
                                name="RECEIPT_NAME"
                                type="text"
                                autoComplete="off"
                                value={data.RECEIPT_NAME}
                                onChange={(val: any) =>
                                    setData({
                                        ...data,
                                        RECEIPT_NAME: val.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                        RECEIPT_STATUS: 1,
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
                                        RECEIPT_STATUS: 2,
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
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                htmlFor="RECEIPT_NAME"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Payment From
                                <span className="text-red-600">*</span>
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_NAME"
                                name="RECEIPT_NAME"
                                type="text"
                                autoComplete="off"
                                value={dataById.RECEIPT_NAME}
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_NAME: val.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                        RECEIPT_STATUS: 1,
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
                                        RECEIPT_STATUS: 2,
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
                url={`/receiptEdit`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
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
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                htmlFor="RECEIPT_NAME"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Payment From
                                <span className="text-red-600">*</span>
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_NAME"
                                name="RECEIPT_NAME"
                                type="text"
                                autoComplete="off"
                                value={dataById.RECEIPT_NAME}
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RECEIPT_NAME: val.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_CURRENCY_ID"
                                className="w-full md:w-1/4 mb-2"
                            >
                                Currency
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                                <span className="text-red-600">*</span>
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
                    </div>
                }
            />
            {/* Modal Edit End */}

            {/* Modal Match Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[60%]`}
                show={modalMatch.match}
                onClose={() =>
                    setModalMatch({
                        match: false,
                    })
                }
                title="Receipt Match"
                url={`/receiptMatch`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName="Save"
                body={
                    <div className="mt-4">
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_NAME"
                                className="w-full md:w-2/12 mb-2"
                            >
                                Receipt Number
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_NAME"
                                name="RECEIPT_NAME"
                                type="text"
                                className="bg-gray-100"
                                autoComplete="off"
                                value={dataById.RECEIPT_NUMBER}
                                readOnly
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_VALUE"
                                className="w-full md:w-2/12 mb-2"
                            >
                                Value
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_VALUE"
                                name="RECEIPT_VALUE"
                                type="text"
                                className="bg-gray-100"
                                autoComplete="off"
                                value={`${
                                    dataById.currency?.CURRENCY_SYMBOL
                                } ${formatCurrency.format(
                                    dataById.RECEIPT_VALUE
                                )}`}
                                readOnly
                            />
                        </div>
                        <div className="block md:flex md:items-center md:space-x-4 w-full mb-6">
                            <InputLabel
                                htmlFor="RECEIPT_RELATION_ORGANIZATION_ID"
                                className="w-full md:w-2/12 mb-2"
                            >
                                Client Name
                            </InputLabel>
                            <TextInput
                                id="RECEIPT_RELATION_ORGANIZATION_ID"
                                name="RECEIPT_RELATION_ORGANIZATION_ID"
                                type="text"
                                className="bg-gray-100"
                                autoComplete="off"
                                value={
                                    dataById.relation_organization
                                        ?.RELATION_ORGANIZATION_NAME
                                }
                                readOnly
                            />
                        </div>

                        {/* Table */}
                        <div className="max-w-full overflow-x-auto overflow-visible mt-12">
                            <div className="flex gap-x-4 mb-6">
                                <InputLabel htmlFor="search" className="my-2">
                                    Search
                                </InputLabel>
                                <TextInput
                                    id="search"
                                    name="search"
                                    type="text"
                                    className="w-full md:w-4/12"
                                    autoComplete="off"
                                    value=""
                                />
                            </div>
                            <table className="w-full divide-y divide-gray-300">
                                <thead>
                                    <tr className="text-center">
                                        <TH className="border py-2 px-3">
                                            No.
                                        </TH>
                                        <TH
                                            className="border py-2 px-3"
                                            colSpan={2}
                                        >
                                            DN Number
                                        </TH>
                                        <TH className="border py-2 px-3">
                                            DN Date
                                        </TH>
                                        <TH className="border py-2 px-3">
                                            Client Name
                                        </TH>
                                        <TH className="border py-2 px-3">
                                            Currency
                                        </TH>
                                        <TH className="border py-2 px-3">
                                            Value
                                        </TH>
                                        <TH className="border py-2 px-3">
                                            Plan
                                        </TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <TD className="border py-2 px-3">1</TD>
                                        <TD className="border py-2 px-3">
                                            <Checkbox />
                                        </TD>
                                        <TD className="border py-2 px-3">
                                            {dataById?.RECEIPT_NUMBER}
                                        </TD>
                                        <TD className="border py-2 px-3">
                                            {dateFormat(
                                                dataById?.RECEIPT_DATE,
                                                "dd-mm-yyyy"
                                            )}
                                        </TD>
                                        <TD className="border py-2 px-3">
                                            {
                                                dataById?.relation_organization
                                                    ?.RELATION_ORGANIZATION_NAME
                                            }
                                        </TD>
                                        <TD className="border py-2 px-3">
                                            {
                                                dataById?.currency
                                                    ?.CURRENCY_SYMBOL
                                            }
                                        </TD>
                                        <TD className="border py-2 px-3">
                                            {formatCurrency.format(
                                                dataById?.RECEIPT_VALUE
                                            )}
                                        </TD>
                                        <TD className="border py-2 px-3"></TD>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* End Table */}
                    </div>
                }
            />
            {/* Modal Match End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-xs sm:text-sm font-semibold px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Add Receipt"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <div className="grid grid-cols-1 relative">
                            <InputSearch
                                id="client_name"
                                name="client_name"
                                type="text"
                                placeholder="Client Name"
                                autoComplete="off"
                                value={
                                    searchReceipt.receipt_search[0].CLIENT_NAME
                                }
                                onChange={(val: any) => {
                                    inputDataSearch(
                                        "CLIENT_NAME",
                                        val.target.value,
                                        0
                                    );
                                    if (
                                        searchReceipt.receipt_search[0]
                                            .CLIENT_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "flag", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const title =
                                            searchReceipt.receipt_search[0]
                                                .CLIENT_NAME;
                                        const id =
                                            searchReceipt.receipt_search[0]
                                                .RECEIPT_ID;
                                        if (title || id) {
                                            inputDataSearch("flag", "", 0);
                                            setRefreshSuccess("success");
                                            setTimeout(() => {
                                                setRefreshSuccess("");
                                            });
                                        } else {
                                            inputDataSearch("flag", "flag", 0);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-end gap-2">
                            <Button
                                className="w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => {
                                    if (
                                        searchReceipt.receipt_search[0]
                                            .RECEIPT_ID === "" &&
                                        searchReceipt.receipt_search[0]
                                            .RECEIPT_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }

                                    setRefreshSuccess("success");
                                    setTimeout(() => {
                                        setRefreshSuccess("");
                                    }, 1000);
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                className="w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => clearSearchReceipt()}
                            >
                                Clear Search
                            </Button>
                        </div>
                    </>
                }
                dataList={
                    <>
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchReceipt.receipt_search}
                            url={"getReceipt"}
                            doubleClickEvent={handleDraftModal}
                            triggeringRefreshData={refreshSuccess}
                            cellHeight={undefined}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                    cellStyle: { textAlign: "center" },
                                },
                                {
                                    headerName: "Receipt Number",
                                    field: "RECEIPT_NUMBER",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                },
                                {
                                    headerName: "Receipt Date",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        return dateFormat(
                                            params.RECEIPT_DATE,
                                            "dd-mm-yyyy"
                                        );
                                    },
                                },
                                {
                                    headerName: "Client Name",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        return params.data.relation_organization
                                            .RELATION_ORGANIZATION_NAME
                                            ? params.data.relation_organization
                                                  .RELATION_ORGANIZATION_NAME
                                            : "-";
                                    },
                                },
                                {
                                    headerName: "Currency",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        return params.data.currency
                                            .CURRENCY_SYMBOL
                                            ? params.data.currency
                                                  .CURRENCY_SYMBOL
                                            : "-";
                                    },
                                },
                                {
                                    headerName: "Value",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "right" },
                                    cellRenderer: (params: any) => {
                                        return formatCurrency.format(
                                            params.data.RECEIPT_VALUE
                                        );
                                    },
                                },
                                {
                                    headerName: "Bank Name",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        return params.data.bank_account
                                            .BANK_TRANSACTION_NAME
                                            ? params.data.bank_account
                                                  .BANK_TRANSACTION_NAME
                                            : "-";
                                    },
                                },
                                {
                                    headerName: "Description",
                                    field: "",
                                    flex: 2,
                                    cellRenderer: (params: any) => {
                                        return params.data.RECEIPT_MEMO
                                            ? params.data.RECEIPT_MEMO
                                            : "-";
                                    },
                                },
                                {
                                    headerName: "Status",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        // console.log("Paraamss", params.data);
                                        return params.data.RECEIPT_STATUS ===
                                            1 ? (
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
                                        );
                                    },
                                },
                                {
                                    headerName: "Action",
                                    field: "",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    autoHeight: true,
                                    cellRenderer: (params: any) => {
                                        return (
                                            <>
                                                <select
                                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            e,
                                                            params.data
                                                                .RECEIPT_ID
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Actions
                                                    </option>
                                                    {params.data
                                                        .RECEIPT_STATUS ===
                                                        2 && (
                                                        <>
                                                            <option value="match">
                                                                Match
                                                            </option>
                                                            <option value="edit">
                                                                Edit
                                                            </option>
                                                            <option value="print">
                                                                Print
                                                            </option>
                                                        </>
                                                    )}
                                                    <option value="delete">
                                                        Delete
                                                    </option>
                                                </select>
                                            </>
                                        );
                                    },
                                },
                            ]}
                        />
                    </>
                }
            />
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
