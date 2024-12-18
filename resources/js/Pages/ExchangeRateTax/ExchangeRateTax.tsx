import Button from "@/Components/Button/Button";
import Content from "@/Components/Content";
import Dropdown from "@/Components/Dropdown";
import Pagination from "@/Components/Pagination";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import ToastMessage from "@/Components/ToastMessage";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { useEffect, useState } from "react";
import Input from "@/Components/Input";
import ModalToDocument from "@/Components/Modal/ModalToDocument";
import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import CurrencyInput from "react-currency-input-field";
import TD from "@/Components/TD";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import dateFormat from "dateformat";
import TH from "@/Components/TH";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";

export default function ExchangeRateController({ auth }: PageProps) {
    const [modalAdd, setModalAdd] = useState<any>({
        add: false,
    });

    const [modalShow, setModalShow] = useState<any>({
        show: false,
    });

    const [modalEdit, setModalEdit] = useState<any>({
        edit: false,
    });

    const [modalUpload, setModalUpload] = useState<any>({
        upload: false,
    });

    const handleUploadModal = () => {
        setModalUpload({
            upload: true,
        });
    };

    const [data, setData] = useState<any>({
        exchange_rate_tax_start_date: "",
        exchange_rate_tax_end_date: "",
        exchange_rate_tax_detail: [],
    });

    const cleanDataRecursively = (data: any): any => {
        if (typeof data === "string") {
            return data.replace(/\r\n/g, "").replace(/\n/g, "");
        } else if (Array.isArray(data)) {
            return data.map((item) => cleanDataRecursively(item));
        } else if (typeof data === "object" && data !== null) {
            const cleanedObject: any = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    cleanedObject[key] = cleanDataRecursively(data[key]);
                }
            }
            return cleanedObject;
        }
        return data;
    };

    const isWednesday = (data: any) => {
        return data.getDay() === 3;
    };

    const getCurrencies = (date: any) => {
        let selectedDate: any = "";

        if (date instanceof Date && !isNaN(date.getTime())) {
            selectedDate = date;
        } else {
            const parsedDate = new Date(date);
            selectedDate = isNaN(parsedDate.getTime()) ? "" : parsedDate;
        }

        axios
            .get(`/getCurrenciesRateTax`)
            .then((res) => {
                let parseData = cleanDataRecursively(res.data);

                parseData = parseData.map((currency: any) => ({
                    ...currency,
                    EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE:
                        currency.CURRENCY_SYMBOL === "IDR" ? 1 : 0,
                }));

                if (selectedDate !== "") {
                    const next7Days = new Date(selectedDate);
                    next7Days.setDate(selectedDate.getDate() + 6);

                    const currentDate =
                        selectedDate.toLocaleDateString("en-CA");
                    const futureDate = next7Days.toLocaleDateString("en-CA");

                    setData({
                        exchange_rate_tax_start_date: currentDate,
                        exchange_rate_tax_end_date: futureDate,
                        exchange_rate_tax_detail: parseData,
                    });

                    // console.log("Currency", parseData);
                } else {
                    setData({
                        exchange_rate_tax_start_date: "",
                        exchange_rate_tax_end_date: "",
                        exchange_rate_tax_detail: parseData,
                    });

                    // console.log("Currency (no date)", parseData);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleAddModal = () => {
        getCurrencies("");

        setModalAdd({
            add: true,
        });
    };

    const handleChangeDate = async (date: any, name: any) => {
        const selectedDate = date.toLocaleDateString("en-CA");

        try {
            const res = await axios.get(
                `/getExchangeRateTaxByDate/${selectedDate}`
            );

            const exchangeRateTaxDetail = res.data.exchange_rate_tax_detail;

            if (!exchangeRateTaxDetail || exchangeRateTaxDetail == undefined) {
                // console.log("Pake Currency", data);
                getCurrencies(selectedDate);
            } else {
                // console.log("Pake By Date", exchangeRateTaxDetail);
                Swal.fire({
                    title: "Data already exist",
                    text: "Do you want to change this data?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, I want to change the data",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setData((prevData: any) => {
                            const updatedData = { ...prevData };

                            updatedData.exchange_rate_tax_detail =
                                exchangeRateTaxDetail;

                            updatedData[name] = selectedDate;

                            const futureDate = new Date(date);
                            futureDate.setDate(futureDate.getDate() + 6);
                            updatedData["exchange_rate_tax_end_date"] =
                                futureDate.toLocaleDateString("en-CA");

                            return updatedData;
                        });
                    }
                });
            }
        } catch (err) {
            console.log("Error", err);
        }
    };

    const handleChangeUpload = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            const excel = new Uint8Array(e.target.result);
            const workbook = XLSX.read(excel, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            jsonData = jsonData.map((currency: any) => {
                if (currency.CURRENCY_SYMBOL === "IDR") {
                    return {
                        ...currency,
                        EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE: 1,
                    };
                }
                return currency;
            });

            // console.log("Data Upload", jsonData);
            setData({
                exchange_rate_tax_start_date: data.exchange_rate_tax_start_date,
                exchange_rate_tax_end_date: data.exchange_rate_tax_end_date,
                exchange_rate_tax_detail: jsonData,
            });
        };

        reader.readAsArrayBuffer(file);

        setModalUpload({
            upload: false,
        });
    };

    const handleChangeUploadFile = (val: any, name: any, i: any) => {
        const onChange: any = [...data.exchange_rate_tax_detail];
        onChange[i][name] = val;

        setData({ ...data, exchange_rate_tax_detail: onChange });
    };

    const handleDownloadTemplate = async () => {
        await axios({
            url: `/exchangeRateTaxDownloadTemplate`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                // console.log(response);
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", response.headers.filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "File not found!",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                }
            });
    };

    const [dataById, setDataById] = useState<any>({});

    const handleShowModalAfterCreate = async (id: number) => {
        await axios
            .get(`/getExchangeRateTaxById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalShow({
            show: true,
        });
    };

    const handleShowModal = async (data: any) => {
        await axios
            .get(`/getExchangeRateTaxById/${data.EXCHANGE_RATE_TAX_ID}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalShow({
            show: true,
        });
    };

    const [dataEdit, setDataEdit] = useState<any>({});
    const handleEditModal = async (id: number) => {
        await axios
            .get(`/getExchangeRateTaxDetailById/${id}`)
            .then((res) => {
                setDataEdit(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalEdit({
            edit: true,
        });
    };

    const handleChangeExchangeRateEdit = (val: any, name: any) => {
        const onChange: any = { ...dataEdit };

        onChange[name] = val;

        setDataEdit(onChange);
    };

    const [isSuccess, setIsSuccess] = useState<any>("");

    const handleSuccess = (message: any) => {
        setIsSuccess("");

        setIsSuccess(message.msg);
        handleShowModalAfterCreate(message.id);

        setTimeout(() => {
            setIsSuccess("");
        }, 5000);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Handle Success End

    // For refresh AG Grid data
    const [refreshSuccess, setRefreshSuccess] = useState<string>("");

    // Search Start
    const [searchExchangeRateTax, setSearchExchangeRateTax] = useState<any>({
        exchange_rate_tax_search: [
            {
                EXCHANGE_RATE_TAX_ID: "",
                EXCHANGE_RATE_TAX_DATE: "",
                flag: "flag",
            },
        ],
    });
    // Search End

    // console.log("adsadadd", searchExchangeRateTax);

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        // console.log(value);
        const changeVal: any = [
            ...searchExchangeRateTax.exchange_rate_tax_search,
        ];
        changeVal[i][name] = value;
        setSearchExchangeRateTax({
            ...searchExchangeRateTax,
            exchange_rate_tax_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchExchangeRateTax = () => {
        inputDataSearch("EXCHANGE_RATE_TAX_ID", "", 0);
        inputDataSearch("EXCHANGE_RATE_TAX_DATE", "", 0);
        inputDataSearch("flag", "flag", 0);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Clear Search End

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    // End Function Format Currency

    // console.log("Data", data);
    // console.log("Exchange Rate Tax By Date", exchangeRateTaxByDate);
    // console.log("Currencies", currencies);
    // console.log("Data Exchange Rate Tax", exchangeRateTax);
    // console.log("Data Exchange Rate Tax By Id", dataById);
    // console.log("Data Edit", dataEdit);

    return (
        <AuthenticatedLayout user={auth.user} header={"Exchange Rate Tax"}>
            <Head title="Exchange Rate Tax" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Upload Start */}
            <ModalToAdd
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[40%]`}
                show={modalAdd.add}
                onClose={() =>
                    setModalAdd({
                        add: false,
                    })
                }
                title={"Add Exchange Rate Tax"}
                url={`/exchangeRateTaxAdd`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToDocument
                            classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]`}
                            show={modalUpload.upload}
                            closeable={true}
                            onClose={() =>
                                setModalUpload({
                                    upload: false,
                                })
                            }
                            title="Add Files"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="">
                                        <InputLabel className="mb-2">
                                            File
                                        </InputLabel>
                                        <Input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={handleChangeUpload}
                                        />
                                    </div>
                                </>
                            }
                        />
                        <div className="mt-3 mb-5">
                            <InputLabel htmlFor="dateRange" className="mb-2">
                                Download Template
                            </InputLabel>
                            <a
                                href=""
                                className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                                onClick={handleDownloadTemplate}
                            >
                                <div className="flex">
                                    <ArrowDownTrayIcon className="w-5" />
                                    <span className="ml-1">
                                        exchange_rate_tax_template.xlsx
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div className="mt-4">
                            <div className="w-full mb-5">
                                <InputLabel
                                    htmlFor="dateRange"
                                    className="mb-2"
                                >
                                    Date Range
                                </InputLabel>
                                <div className="flex space-x-4">
                                    <div className="grid grid-cols-1 w-full relative">
                                        <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                        <DatePicker
                                            name="exchange_rate_tax_start_date"
                                            selected={
                                                data.exchange_rate_tax_start_date
                                            }
                                            onChange={(date: any) =>
                                                handleChangeDate(
                                                    date,
                                                    "exchange_rate_tax_start_date"
                                                )
                                            }
                                            filterDate={isWednesday}
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyy (Start Date)"
                                            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 w-full relative">
                                        <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                        <DatePicker
                                            name="exchange_rate_tax_end_date"
                                            selected={
                                                data.exchange_rate_tax_end_date
                                            }
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyy (End Date)"
                                            className="block w-full rounded-md border-0 py-2.5 bg-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2 mb-5">
                                <InputLabel className="mb-2">File</InputLabel>
                                <div className="flex pt-1 space-x-4">
                                    <Button
                                        type="button"
                                        className="bg-red-600 hover:bg-red-500 text-sm text-white py-1.5 w-1/2"
                                        onClick={handleUploadModal}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7">
                            <table>
                                <tbody>
                                    {data?.exchange_rate_tax_detail.map(
                                        (currency: any, i: number) => (
                                            <tr key={i}>
                                                <TD className="text-sm pr-5">
                                                    {(currency.currency
                                                        ?.CURRENCY_NAME ||
                                                        currency.CURRENCY_NAME) +
                                                        " (" +
                                                        (currency.currency
                                                            ?.CURRENCY_SYMBOL ||
                                                            currency.CURRENCY_SYMBOL) +
                                                        ")"}
                                                </TD>
                                                <TD className="w-full">
                                                    <div className="w-56 sm:w-full">
                                                        <CurrencyInput
                                                            id="EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE"
                                                            name="EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE"
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            value={
                                                                currency.EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE
                                                            }
                                                            onValueChange={(
                                                                val
                                                            ) =>
                                                                handleChangeUploadFile(
                                                                    val,
                                                                    "EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE",
                                                                    i
                                                                )
                                                            }
                                                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-2 md:leading-6 text-right ${
                                                                (currency.CURRENCY_SYMBOL ===
                                                                    "IDR" ||
                                                                    currency
                                                                        .currency
                                                                        ?.CURRENCY_SYMBOL ===
                                                                        "IDR") &&
                                                                "bg-gray-100"
                                                            }`}
                                                            placeholder="0.00"
                                                            autoComplete="off"
                                                            readOnly={
                                                                (currency.CURRENCY_SYMBOL ===
                                                                    "IDR" ||
                                                                    currency
                                                                        .currency
                                                                        ?.CURRENCY_SYMBOL ===
                                                                        "IDR") &&
                                                                true
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* Modal Upload End */}

            {/* Modal Show Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[50%]`}
                show={modalShow.show}
                closeable={true}
                onClose={() =>
                    setModalShow({
                        show: false,
                    })
                }
                title="Exchange Rate Tax Show"
                url=""
                data=""
                method=""
                onSuccess=""
                headers={null}
                submitButtonName=""
                body={
                    <>
                        <ModalToAction
                            classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[50%]`}
                            show={modalEdit.edit}
                            closeable={true}
                            onClose={() =>
                                setModalEdit({
                                    edit: false,
                                })
                            }
                            title="Exchange Rate Tax Edit"
                            url="/exchangeRateTaxEdit"
                            data={dataEdit}
                            method="patch"
                            onSuccess={handleSuccess}
                            headers={null}
                            submitButtonName="Save"
                            body={
                                <>
                                    <div className="mt-2">
                                        <div className="mb-5 mt-5">
                                            <InputLabel className="mb-2">
                                                Currency
                                            </InputLabel>
                                            <TextInput
                                                type="text"
                                                value={
                                                    dataEdit.currency
                                                        ?.CURRENCY_NAME
                                                }
                                                className="bg-gray-100"
                                                readOnly
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <InputLabel className="mb-2">
                                                Currency Code
                                            </InputLabel>
                                            <TextInput
                                                type="text"
                                                value={
                                                    dataEdit.currency
                                                        ?.CURRENCY_SYMBOL
                                                }
                                                className="bg-gray-100"
                                                readOnly
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="namaPemohon"
                                                className="mb-2"
                                            >
                                                Exchange Rate
                                            </InputLabel>
                                            <CurrencyInput
                                                id="EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE"
                                                name="EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE"
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                value={
                                                    dataEdit?.EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE ||
                                                    ""
                                                }
                                                onValueChange={(val: any) =>
                                                    handleChangeExchangeRateEdit(
                                                        val,
                                                        "EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE"
                                                    )
                                                }
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                placeholder="0.00"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        />
                        <div className="mt-2">
                            <p>
                                Validity Period :{" "}
                                {dateFormat(
                                    dataById.EXCHANGE_RATE_TAX_START_DATE,
                                    "dd mmmm yyyy"
                                )}{" "}
                                -{" "}
                                {dateFormat(
                                    dataById.EXCHANGE_RATE_TAX_END_DATE,
                                    "dd mmmm yyyy"
                                )}
                            </p>
                            <div className="max-w-full overflow-x-auto overflow-visible mt-4">
                                <table className="w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr className="text-center bg-gray-200">
                                            <TH
                                                label="No."
                                                className="border p-2 w-16"
                                                rowSpan="2"
                                            />
                                            <TH
                                                label="Currency Name"
                                                className="border p-2"
                                                rowSpan="2"
                                            />
                                            <TH
                                                label="Currency Code"
                                                className="border p-2"
                                                rowSpan="2"
                                            />
                                            <TH
                                                label="Exchange Rate"
                                                className="border p-2"
                                                rowSpan="2"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataById.exchange_rate_tax_detail?.map(
                                            (data: any, i: number) => (
                                                <tr
                                                    key={i}
                                                    className={`
                                                    hover:bg-gray-200 cursor-pointer`}
                                                    onDoubleClick={() =>
                                                        handleEditModal(
                                                            data.EXCHANGE_RATE_TAX_DETAIL_ID
                                                        )
                                                    }
                                                >
                                                    <TD className="border text-center p-2">
                                                        {i + 1}
                                                    </TD>
                                                    <TD className="border p-2">
                                                        {
                                                            data.currency
                                                                ?.CURRENCY_NAME
                                                        }
                                                    </TD>
                                                    <TD className="border text-center p-2">
                                                        <span className="bg-orange-500 text-white px-2 py-1 rounded-md inline-block text-center w-14">
                                                            {data.currency
                                                                ?.CURRENCY_SYMBOL ||
                                                                "No Currency"}
                                                        </span>
                                                    </TD>
                                                    <TD className="border text-right p-2">
                                                        {formatCurrency.format(
                                                            data.EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE
                                                        )}
                                                    </TD>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Show End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-sm font-semibold px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Add Exchange Rate Tax"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <div className="grid grid-cols-1 mb-5 relative">
                            <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                            <DatePicker
                                name="EXCHANGE_RATE_TAX_DATE"
                                selected={
                                    searchExchangeRateTax
                                        .exchange_rate_tax_search[0]
                                        .EXCHANGE_RATE_TAX_DATE
                                }
                                onChange={(date: any) => {
                                    inputDataSearch(
                                        "EXCHANGE_RATE_TAX_DATE",
                                        date.toLocaleDateString("en-CA"),
                                        0
                                    );
                                    if (
                                        searchExchangeRateTax
                                            .exchange_rate_tax_search[0]
                                            .EXCHANGE_RATE_TAX_DATE === ""
                                    ) {
                                        inputDataSearch("flag", "flag", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const title =
                                            searchExchangeRateTax
                                                .exchange_rate_tax_search[0]
                                                .EXCHANGE_RATE_TAX_DATE;
                                        const id =
                                            searchExchangeRateTax
                                                .exchange_rate_tax_search[0]
                                                .EXCHANGE_RATE_TAX_ID;
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
                                dateFormat={"dd-MM-yyyy"}
                                placeholderText="dd-mm-yyyyy (Start Date)"
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm focus:ring-red-600 placeholder:text-sm pl-10"
                                autoComplete="off"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-end gap-2">
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => {
                                    if (
                                        searchExchangeRateTax
                                            .exchange_rate_tax_search[0]
                                            .EXCHANGE_RATE_TAX_ID === "" &&
                                        searchExchangeRateTax
                                            .exchange_rate_tax_search[0]
                                            .EXCHANGE_RATE_TAX_DATE === ""
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
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={clearSearchExchangeRateTax}
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
                            searchParam={
                                searchExchangeRateTax.exchange_rate_tax_search
                            }
                            url={"getExchangeRateTax"}
                            doubleClickEvent={handleShowModal}
                            triggeringRefreshData={refreshSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Start Date",
                                    flex: 7,
                                    cellRenderer: (params: any) => {
                                        return dateFormat(
                                            params.data
                                                .EXCHANGE_RATE_TAX_START_DATE,
                                            "dd-mm-yyyy"
                                        );
                                    },
                                },
                                {
                                    headerName: "End Date",
                                    flex: 7,
                                    cellRenderer: (params: any) => {
                                        return dateFormat(
                                            params.data
                                                .EXCHANGE_RATE_TAX_END_DATE,
                                            "dd-mm-yyyy"
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
