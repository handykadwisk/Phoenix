import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Content from "@/Components/Content";
import Button from "@/Components/Button/Button";
import InputSearch from "@/Components/InputSearch";
import InputLabel from "@/Components/InputLabel";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { useEffect, useState } from "react";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import Select from "react-tailwindcss-select";
import TextArea from "@/Components/TextArea";
import ToggleWithIcon from "@/Components/ToggleWithIcon";
import axios from "axios";
import AGGrid from "@/Components/AgGrid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import Swal from "sweetalert2";
import BadgeFlat from "@/Components/BadgeFlat";
import dateFormat from "dateformat";

export default function BankTransaction({ auth }: PageProps) {
    useEffect(() => {
        getBank();
        getCurrency();
        getCOA();
    }, []);

    const [data, setData] = useState<any>({
        BANK_TRANSACTION_ACCOUNT_NAME: "",
        BANK_TRANSACTION_ACCOUNT_NUMBER: "",
        BANK_TRANSACTION_ADDRESS: "",
        BANK_TRANSACTION_COA_CODE: "",
        BANK_TRANSACTION_CURRENCY_ID: "",
        BANK_TRANSACTION_FOR_INVOICE: false,
        BANK_TRANSACTION_FOR_INVOICE_DEFAULT: false,
        BANK_ID: "",
        BANK_TRANSACTION_NAME: "",
        BANK_TRANSACTION_NAME_INVOICE: "",
    });

    // console.log("Data", data);

    const handleChangeAdd = (val: any, name: any) => {
        const onChange = { ...data };

        onChange[name] = val;

        setData(onChange);
    };

    useEffect(() => {
        if (data.BANK_ID !== "" && data.BANK_ID !== null) {
            setData({
                ...data,
                BANK_TRANSACTION_NAME_INVOICE: data.BANK_ID.label,
            });
        }
    }, [data.BANK_ID]);

    const handleSwitchToggle = (val: boolean, name: any) => {
        const onChange = { ...data };

        if (val === true) {
            onChange[name] = 1;
        } else {
            onChange[name] = "";
            onChange["BANK_TRANSACTION_FOR_INVOICE_DEFAULT"] = "";
        }

        setData(onChange);
    };

    const handleChangeEdit = (val: any, name: any) => {
        const onChange = { ...dataById };

        onChange[name] = val;

        setDataById(onChange);
    };

    const handleSwitchToggleEdit = (val: any, name: any) => {
        const onChange = { ...dataById };

        if (val === true) {
            onChange[name] = 1;
        } else {
            onChange[name] = "";
            onChange["BANK_TRANSACTION_FOR_INVOICE_DEFAULT"] = "";
        }

        setDataById(onChange);
    };

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: any) => {
        setIsSuccess("");
        setData({
            BANK_TRANSACTION_ACCOUNT_NAME: "",
            BANK_TRANSACTION_ACCOUNT_NUMBER: "",
            BANK_TRANSACTION_ADDRESS: "",
            BANK_TRANSACTION_COA_CODE: "",
            BANK_TRANSACTION_CURRENCY_ID: "",
            BANK_TRANSACTION_FOR_INVOICE: false,
            BANK_TRANSACTION_FOR_INVOICE_DEFAULT: false,
            BANK_ID: "",
            BANK_TRANSACTION_NAME: "",
            BANK_TRANSACTION_NAME_INVOICE: "",
        });

        setIsSuccess(message.msg);

        setTimeout(() => {
            setIsSuccess("");
        }, 5000);

        setRefreshSuccess("");
        setTimeout(() => {
            setRefreshSuccess("success");
        }, 1000);
    };
    // Handle Success End

    const [modalAdd, setModalAdd] = useState<any>({
        add: false,
    });

    const handleAddModal = () => {
        setModalAdd({
            add: true,
        });
    };

    const [dataById, setDataById] = useState<any>({});

    // console.log("Data by id", dataById);

    useEffect(() => {
        if (dataById?.BANK_ID !== "" && dataById?.BANK_ID !== null) {
            setDataById({
                ...dataById,
                BANK_TRANSACTION_NAME_INVOICE: getBankSelect(dataById?.BANK_ID),
            });
        }
    }, [dataById?.BANK_ID]);

    const [modalEdit, setModalEdit] = useState<any>({
        edit: false,
    });

    const handleEditModal = async (data: any) => {
        await axios
            .get(`/getBankTransactionById/${data.BANK_TRANSACTION_ID}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalEdit({
            edit: true,
        });
    };

    const [bank, setBank] = useState<any>([]);
    const getBank = async () => {
        await axios
            .get(`/getBank`)
            .then((res) => {
                setBank(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectBank = bank?.map((val: any) => {
        return {
            value: val.BANK_ID,
            label: val.BANK_NAME,
        };
    });

    const getBankSelect = (value: any) => {
        if (value) {
            const selected = selectBank.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [coa, setCOA] = useState<any>([]);
    const getCOA = async () => {
        await axios
            .get(`/getCOABankTransaction`)
            .then((res) => {
                setCOA(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectCOA = coa?.map((val: any) => {
        return {
            value: val.COA_ID,
            code: val.COA_CODE,
            label: val.COA_CODE + " - " + val.COA_TITLE,
        };
    });

    const getCoaSelect = (code: number) => {
        // console.log("Value COA : ", code);
        if (code) {
            const selected = selectCOA.filter(
                (option: any) => option.code == code
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
        // console.log("Value : ", value);
        if (value) {
            const selected = selectCurrency.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    // For refresh AG Grid data
    const [refreshSuccess, setRefreshSuccess] = useState<string>("");

    // Search Start
    const [searchBankTransaction, setSearchBankTransaction] = useState<any>({
        bank_transaction_search: [
            {
                BANK_TRANSACTION_ID: "",
                BANK_TRANSACTION_NAME: "",
                flag: "flag",
            },
        ],
    });

    // console.log("Search", searchBankTransaction);
    // Search End

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [
            ...searchBankTransaction.bank_transaction_search,
        ];
        changeVal[i][name] = value;
        setSearchBankTransaction({
            ...searchBankTransaction,
            bank_transaction_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchBankTransaction = () => {
        inputDataSearch("BANK_TRANSACTION_ID", "", 0);
        inputDataSearch("BANK_TRANSACTION_NAME", "", 0);
        inputDataSearch("flag", "flag", 0);

        setRefreshSuccess("");
        setTimeout(() => {
            setRefreshSuccess("success");
        }, 1000);
    };
    // Clear Search End

    const [rowSelectedData, setRowSelectedData] = useState<any>([]);

    const onSelectionChanged = (dataSelected: any) => {
        setRowSelectedData(dataSelected);
    };

    const handleDisableBank = async (dataSelected: any) => {
        console.log("Data Selected", dataSelected);
        Swal.fire({
            title: "Are you sure?",
            text: "You want to disable the bank",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios
                    .patch("/bankTransactionDisableBank", { rowSelectedData })
                    .then(function (response) {
                        // console.log(response);
                        setIsSuccess("Bank transaction has been disabled.");
                        setTimeout(() => {
                            setIsSuccess("");
                        }, 5000);

                        setRefreshSuccess("");
                        setTimeout(() => {
                            setRefreshSuccess("success");
                        }, 1000);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    };

    const handleRowStatus = (
        bankTransactionStatus: number,
        textAlign: string = ""
    ) => {
        if (bankTransactionStatus === 1) {
            return {
                backgroundColor: "#fcd9d9",
                textAlign: textAlign,
            };
        }

        return {
            textAlign: textAlign,
        };
    };

    // console.log("Data", data);
    // console.log("Bank Transaction", bankTransaction.data);

    return (
        <AuthenticatedLayout user={auth.user} header={"Bank Transaction"}>
            <Head title="Bank Transaction" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Add Start */}
            <ModalToAdd
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[50%]`}
                show={modalAdd.add}
                onClose={() =>
                    setModalAdd({
                        add: false,
                    })
                }
                title={"Add Bank Transaction"}
                url={`/bankTransactionAdd`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <div className="md:grid md:grid-cols-2 md:gap-4 mt-4">
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_NAME"
                                    className="mb-2"
                                >
                                    Title
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_NAME"
                                    name="BANK_TRANSACTION_NAME"
                                    type="text"
                                    autoComplete="off"
                                    value={data.BANK_TRANSACTION_NAME}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val.target.value,
                                            "BANK_TRANSACTION_NAME"
                                        )
                                    }
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_COA_CODE"
                                    className="mb-2"
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
                                    options={selectBank}
                                    isSearchable={true}
                                    placeholder={"Choose Bank"}
                                    value={data.BANK_ID}
                                    onChange={(val: any) =>
                                        handleChangeAdd(val, "BANK_ID")
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_COA_CODE"
                                    className="mb-2"
                                >
                                    Coa Code
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
                                    options={selectCOA}
                                    isSearchable={true}
                                    placeholder={"Choose COA Code"}
                                    value={data.BANK_TRANSACTION_COA_CODE}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val,
                                            "BANK_TRANSACTION_COA_CODE"
                                        )
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_CURRENCY_ID"
                                    className="mb-2"
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
                                    value={data.BANK_TRANSACTION_CURRENCY_ID}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val,
                                            "BANK_TRANSACTION_CURRENCY_ID"
                                        )
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    className="mb-2"
                                >
                                    Account Number
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    name="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    type="number"
                                    autoComplete="off"
                                    value={data.BANK_TRANSACTION_ACCOUNT_NUMBER}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val.target.value,
                                            "BANK_TRANSACTION_ACCOUNT_NUMBER"
                                        )
                                    }
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_ACCOUNT_NAME"
                                    className="mb-2"
                                >
                                    Account Name
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_ACCOUNT_NAME"
                                    name="BANK_TRANSACTION_ACCOUNT_NAME"
                                    type="text"
                                    autoComplete="off"
                                    value={data.BANK_TRANSACTION_ACCOUNT_NAME}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val.target.value,
                                            "BANK_TRANSACTION_ACCOUNT_NAME"
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="w-full my-4 md:mb-0">
                            <InputLabel
                                htmlFor="BANK_TRANSACTION_ADDRESS"
                                className="w-full lg:w-1/4 mb-2"
                            >
                                Bank Address
                            </InputLabel>
                            <TextArea
                                rows="5"
                                autoComplete="off"
                                value={data.BANK_TRANSACTION_ADDRESS}
                                onChange={(val: any) =>
                                    handleChangeAdd(
                                        val.target.value,
                                        "BANK_TRANSACTION_ADDRESS"
                                    )
                                }
                            />
                        </div>
                        <fieldset className="mt-5 px-3 py-5 rounded-lg border-2">
                            <legend className="ml-3 px-3 font-medium">
                                Information For Debit Note
                            </legend>
                            <div className="block lg:flex w-full mb-7">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_NAME_INVOICE"
                                    className="w-full lg:w-1/4 mb-2"
                                >
                                    Bank Name Invoice
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_NAME_INVOICE"
                                    name="BANK_TRANSACTION_NAME_INVOICE"
                                    type="text"
                                    autoComplete="off"
                                    value={data.BANK_TRANSACTION_NAME_INVOICE}
                                    onChange={(val: any) =>
                                        handleChangeAdd(
                                            val.target.value,
                                            "BANK_TRANSACTION_NAME_INVOICE"
                                        )
                                    }
                                />
                            </div>
                            <div className="block lg:flex w-full mb-7">
                                <div className="block lg:flex lg:space-x-4 w-1/2">
                                    <InputLabel
                                        htmlFor="BANK_TRANSACTION_FOR_INVOICE"
                                        className="mb-2"
                                    >
                                        Show at DN Document
                                    </InputLabel>
                                    <ToggleWithIcon
                                        checked={
                                            data.BANK_TRANSACTION_FOR_INVOICE
                                        }
                                        onChange={(val: any) =>
                                            handleSwitchToggle(
                                                val,
                                                "BANK_TRANSACTION_FOR_INVOICE"
                                            )
                                        }
                                    />
                                </div>
                                {data.BANK_TRANSACTION_FOR_INVOICE === 1 && (
                                    <div className="block lg:flex lg:space-x-4 w-1/2 mt-5 lg:mt-0">
                                        <InputLabel
                                            htmlFor="BANK_TRANSACTION_FOR_INVOICE_DEFAULT"
                                            className="mb-2"
                                        >
                                            As Default
                                        </InputLabel>
                                        <ToggleWithIcon
                                            checked={
                                                data.BANK_TRANSACTION_FOR_INVOICE_DEFAULT
                                            }
                                            onChange={(val: any) =>
                                                handleSwitchToggle(
                                                    val,
                                                    "BANK_TRANSACTION_FOR_INVOICE_DEFAULT"
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </fieldset>
                    </>
                }
            />
            {/* Modal Add End */}

            {/* Modal Edit Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[50%]`}
                show={modalEdit.edit}
                closeable={true}
                onClose={() =>
                    setModalEdit({
                        edit: false,
                    })
                }
                title="Bank Transaction Edit"
                url="/bankTransactionEdit"
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName="Save"
                body={
                    <>
                        <div className="md:grid md:grid-cols-2 md:gap-4 mt-4">
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_NAME"
                                    className="mb-2"
                                >
                                    Title
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_NAME"
                                    name="BANK_TRANSACTION_NAME"
                                    type="text"
                                    autoComplete="off"
                                    value={dataById?.BANK_TRANSACTION_NAME}
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.target.value,
                                            "BANK_TRANSACTION_NAME"
                                        )
                                    }
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_COA_CODE"
                                    className="mb-2"
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
                                    options={selectBank}
                                    isSearchable={true}
                                    placeholder={"Choose Bank"}
                                    value={{
                                        label: getBankSelect(dataById?.BANK_ID),
                                        value: dataById?.BANK_ID,
                                    }}
                                    onChange={(val: any) =>
                                        handleChangeEdit(val.value, "BANK_ID")
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_COA_CODE"
                                    className="mb-2"
                                >
                                    Coa Code
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
                                    options={selectCOA}
                                    isSearchable={true}
                                    placeholder={"Choose COA Code"}
                                    value={{
                                        label: getCoaSelect(
                                            dataById?.BANK_TRANSACTION_COA_CODE
                                        ),
                                        value: dataById?.BANK_TRANSACTION_COA_CODE,
                                    }}
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.code,
                                            "BANK_TRANSACTION_COA_CODE"
                                        )
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_CURRENCY_ID"
                                    className="mb-2"
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
                                            dataById?.BANK_TRANSACTION_CURRENCY_ID
                                        ),
                                        value: dataById?.BANK_TRANSACTION_CURRENCY_ID,
                                    }}
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.value,
                                            "BANK_TRANSACTION_CURRENCY_ID"
                                        )
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    className="mb-2"
                                >
                                    Account Number
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    name="BANK_TRANSACTION_ACCOUNT_NUMBER"
                                    type="number"
                                    autoComplete="off"
                                    value={
                                        dataById?.BANK_TRANSACTION_ACCOUNT_NUMBER ||
                                        ""
                                    }
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.target.value,
                                            "BANK_TRANSACTION_ACCOUNT_NUMBER"
                                        )
                                    }
                                />
                            </div>
                            <div className="w-full mb-3 md:mb-0">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_ACCOUNT_NAME"
                                    className="mb-2"
                                >
                                    Account Name
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_ACCOUNT_NAME"
                                    name="BANK_TRANSACTION_ACCOUNT_NAME"
                                    type="text"
                                    autoComplete="off"
                                    value={
                                        dataById?.BANK_TRANSACTION_ACCOUNT_NAME ||
                                        ""
                                    }
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.target.value,
                                            "BANK_TRANSACTION_ACCOUNT_NAME"
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="w-full my-4 md:mb-0">
                            <InputLabel
                                htmlFor="BANK_TRANSACTION_ADDRESS"
                                className="w-full lg:w-1/4 mb-2"
                            >
                                Bank Address
                            </InputLabel>
                            <TextArea
                                rows="5"
                                autoComplete="off"
                                value={dataById?.BANK_TRANSACTION_ADDRESS || ""}
                                onChange={(val: any) =>
                                    handleChangeEdit(
                                        val.target.value,
                                        "BANK_TRANSACTION_ADDRESS"
                                    )
                                }
                            />
                        </div>
                        <fieldset className="mt-5 px-3 py-5 rounded-lg border-2">
                            <legend className="ml-3 px-3 font-medium">
                                Information For Debit Note
                            </legend>
                            <div className="block lg:flex w-full mb-7">
                                <InputLabel
                                    htmlFor="BANK_TRANSACTION_NAME_INVOICE"
                                    className="w-full lg:w-1/4 mb-2"
                                >
                                    Bank Name Invoice
                                </InputLabel>
                                <TextInput
                                    id="BANK_TRANSACTION_NAME_INVOICE"
                                    name="BANK_TRANSACTION_NAME_INVOICE"
                                    type="text"
                                    autoComplete="off"
                                    value={
                                        dataById?.BANK_TRANSACTION_NAME_INVOICE ||
                                        ""
                                    }
                                    onChange={(val: any) =>
                                        handleChangeEdit(
                                            val.target.value,
                                            "BANK_TRANSACTION_NAME_INVOICE"
                                        )
                                    }
                                />
                            </div>
                            <div className="block lg:flex w-full mb-7">
                                <div className="block lg:flex lg:space-x-4 w-1/2">
                                    <InputLabel
                                        htmlFor="BANK_TRANSACTION_FOR_INVOICE"
                                        className="mb-2"
                                    >
                                        Show at DN Document
                                    </InputLabel>
                                    <ToggleWithIcon
                                        checked={
                                            dataById?.BANK_TRANSACTION_FOR_INVOICE
                                        }
                                        onChange={(val: any) =>
                                            handleSwitchToggleEdit(
                                                val,
                                                "BANK_TRANSACTION_FOR_INVOICE"
                                            )
                                        }
                                    />
                                </div>
                                {dataById?.BANK_TRANSACTION_FOR_INVOICE ===
                                    1 && (
                                    <div className="block lg:flex lg:space-x-4 w-1/2 mt-5 lg:mt-0">
                                        <InputLabel
                                            htmlFor="BANK_TRANSACTION_FOR_INVOICE_DEFAULT"
                                            className="mb-2"
                                        >
                                            As Default
                                        </InputLabel>
                                        <ToggleWithIcon
                                            checked={
                                                dataById?.BANK_TRANSACTION_FOR_INVOICE_DEFAULT
                                            }
                                            onChange={(val: any) =>
                                                handleSwitchToggleEdit(
                                                    val,
                                                    "BANK_TRANSACTION_FOR_INVOICE_DEFAULT"
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </fieldset>
                    </>
                }
            />
            {/* Modal Edit End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-xs sm:text-sm font-semibold px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Add Bank Transaction"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <InputSearch
                            id="BANK_TRANSACTION_NAME"
                            name="BANK_TRANSACTION_NAME"
                            type="text"
                            placeholder="Bank Name - Currency - Account Number"
                            autoComplete="off"
                            value={
                                searchBankTransaction.bank_transaction_search[0]
                                    .BANK_TRANSACTION_NAME
                            }
                            onChange={(val: any) => {
                                inputDataSearch(
                                    "BANK_TRANSACTION_NAME",
                                    val.target.value,
                                    0
                                );
                                if (
                                    searchBankTransaction
                                        .bank_transaction_search[0]
                                        .BANK_TRANSACTION_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const title =
                                        searchBankTransaction
                                            .bank_transaction_search[0]
                                            .BANK_TRANSACTION_NAME;
                                    const id =
                                        searchBankTransaction
                                            .bank_transaction_search[0]
                                            .BANK_TRANSACTION_ID;
                                    if (title || id) {
                                        inputDataSearch("flag", "", 0);
                                        setRefreshSuccess("");
                                        setTimeout(() => {
                                            setRefreshSuccess("success");
                                        });
                                    } else {
                                        inputDataSearch("flag", "flag", 0);
                                    }
                                }
                            }}
                        />
                        <div className="flex flex-col md:flex-row justify-end gap-2">
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => {
                                    if (
                                        searchBankTransaction
                                            .bank_transaction_search[0]
                                            .BANK_TRANSACTION_ID === "" &&
                                        searchBankTransaction
                                            .bank_transaction_search[0]
                                            .BANK_TRANSACTION_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }

                                    setRefreshSuccess("");
                                    setTimeout(() => {
                                        setRefreshSuccess("success");
                                    }, 1000);
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={clearSearchBankTransaction}
                            >
                                Clear Search
                            </Button>
                        </div>
                    </>
                }
                dataList={
                    <>
                        {rowSelectedData.length > 0 && (
                            <button
                                onClick={handleDisableBank}
                                className="px-5 py-1 mb-5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-md"
                            >
                                Disable Bank
                            </button>
                        )}

                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={
                                searchBankTransaction.bank_transaction_search
                            }
                            url={"getBankTransaction"}
                            doubleClickEvent={handleEditModal}
                            triggeringRefreshData={refreshSuccess}
                            rowHeight={80}
                            rowSelection={"multiple"}
                            onSelectionChanged={onSelectionChanged}
                            suppressRowClickSelection={true}
                            noRowsOverlayComponent={true}
                            colDefs={[
                                {
                                    checkboxSelection: (params: any) => {
                                        return params.data
                                            ?.BANK_TRANSACTION_STATUS === 1
                                            ? false
                                            : true;
                                    },
                                    width: 50,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data?.BANK_TRANSACTION_STATUS
                                        );
                                    },
                                },
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    width: 80,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data?.BANK_TRANSACTION_STATUS
                                        );
                                    },
                                },
                                {
                                    headerName: "Title",
                                    field: "BANK_TRANSACTION_NAME",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data?.BANK_TRANSACTION_STATUS
                                        );
                                    },
                                },
                                {
                                    headerName: "Bank",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data?.BANK_TRANSACTION_STATUS
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const bank_name =
                                            params.data.bank?.BANK_NAME;

                                        return bank_name ? bank_name : "-";
                                    },
                                },
                                {
                                    headerName: "Currency",
                                    flex: 1,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data
                                                ?.BANK_TRANSACTION_STATUS,
                                            "center"
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const currency =
                                            params.data.currency
                                                ?.CURRENCY_SYMBOL;

                                        return currency;
                                    },
                                },
                                {
                                    headerName: "COA",
                                    flex: 1,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data
                                                ?.BANK_TRANSACTION_STATUS,
                                            "center"
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const coa =
                                            params.data
                                                .BANK_TRANSACTION_COA_CODE;

                                        return coa ? coa : "-";
                                    },
                                },
                                {
                                    headerName: "Account",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data?.BANK_TRANSACTION_STATUS
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        return (
                                            <div className="flex flex-col">
                                                <div>
                                                    {
                                                        params.data
                                                            .BANK_TRANSACTION_ACCOUNT_NUMBER
                                                    }
                                                </div>
                                                <div className="-mt-4">
                                                    {
                                                        params.data
                                                            .BANK_TRANSACTION_ACCOUNT_NAME
                                                    }
                                                </div>
                                            </div>
                                        );
                                    },
                                },
                                {
                                    headerName: "Show at Document",
                                    flex: 1,
                                    filter: "agSetColumnFilter",
                                    filterParams: {
                                        values: ["Yes", "No"],
                                    },
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data
                                                ?.BANK_TRANSACTION_STATUS,
                                            "center"
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const status =
                                            params.data
                                                .BANK_TRANSACTION_FOR_INVOICE;

                                        return status === 1 ? (
                                            <BadgeFlat
                                                className={
                                                    "bg-green-500 text-white"
                                                }
                                                title={"Yes"}
                                                body={"Yes"}
                                            />
                                        ) : (
                                            <BadgeFlat
                                                className={
                                                    "bg-red-500 text-white"
                                                }
                                                title={"No"}
                                                body={"No"}
                                            />
                                        );
                                    },
                                },
                                {
                                    headerName: "Status",
                                    flex: 1,
                                    filter: "agSetColumnFilter",
                                    filterParams: {
                                        values: ["Active", "Not Active"],
                                    },
                                    cellStyle: (params: any) => {
                                        return handleRowStatus(
                                            params.data
                                                ?.BANK_TRANSACTION_STATUS,
                                            "center"
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const status =
                                            params.data.BANK_TRANSACTION_STATUS;

                                        return status === 1 ? (
                                            <BadgeFlat
                                                className={
                                                    "bg-red-500 text-white"
                                                }
                                                title={"Not Active"}
                                                body={
                                                    <div className="flex flex-col">
                                                        <div className="">
                                                            Not Active
                                                        </div>
                                                        <div className="">
                                                            {dateFormat(
                                                                params.data
                                                                    .BANK_TRANSACTION_DISABLE_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        ) : (
                                            <BadgeFlat
                                                className={
                                                    "bg-green-500 text-white"
                                                }
                                                title={"Active"}
                                                body={"Active"}
                                            />
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
