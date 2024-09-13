import Button from "@/Components/Button/Button";
import Content from "@/Components/Content";
import Pagination from "@/Components/Pagination";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import ToastMessage from "@/Components/ToastMessage";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import Input from "@/Components/Input";
import ModalToDocument from "@/Components/Modal/ModalToDocument";
import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import TD from "@/Components/TD";
import * as XLSX from "xlsx";
import dateFormat from "dateformat";
import TH from "@/Components/TH";
import Swal from "sweetalert2";

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
        exchange_rate_bi_date: "",
        exchange_rate_bi_detail: [],
    });

    const cleanDataRecursively = (data: any): any => {
        if (typeof data === "string") {
            // Jika data adalah string, hapus karakter \r\n
            return data.replace(/\r\n/g, "").replace(/\n/g, "");
        } else if (Array.isArray(data)) {
            // Jika data adalah array, lakukan pembersihan pada setiap elemen array
            return data.map((item) => cleanDataRecursively(item));
        } else if (typeof data === "object" && data !== null) {
            // Jika data adalah object, lakukan pembersihan pada setiap value dalam object
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

    const getCurrencies = (date: any) => {
        axios
            .get(`/getCurrencies`)
            .then((res) => {
                const parseData = cleanDataRecursively(res.data);

                setData({
                    exchange_rate_bi_date: date,
                    exchange_rate_bi_detail: parseData,
                });
                console.log("Currency", parseData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAddModal = async () => {
        getCurrencies("");

        setModalAdd({
            add: true,
        });
    };

    const handleChangeDate = async (date: any, name: any) => {
        const selectedDate = date.toLocaleDateString("en-CA");

        try {
            const resDate = await axios.get(
                `/getExchangeRateBIByDate/${selectedDate}`
            );

            const exchangeRateDetail = resDate.data.exchange_rate_bi_detail;

            if (!exchangeRateDetail || exchangeRateDetail === undefined) {
                getCurrencies(selectedDate);

                console.log("Using Currency", data);
            } else {
                console.log("Using By Date", exchangeRateDetail);

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

                            // Simpan hasil request berdasarkan tanggal
                            updatedData.exchange_rate_bi_detail =
                                exchangeRateDetail;

                            // Simpan nilai yang dipilih pada field
                            updatedData[name] = selectedDate;

                            return updatedData;
                        });
                    }
                });
            }
        } catch (err) {
            console.log("Error", err);
        }
    };

    const handleDownloadTemplate = async () => {
        await axios({
            url: `/exchangeRateBIDownloadTemplate`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                console.log(response);
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

    const handleChangeUpload = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const excel = new Uint8Array(e.target.result);
            const workbook = XLSX.read(excel, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setData({
                exchange_rate_bi_date: data.exchange_rate_bi_date,
                exchange_rate_bi_detail: jsonData,
            });
        };

        reader.readAsArrayBuffer(file);

        setModalUpload({
            upload: false,
        });
    };

    const handleChangeUploadFile = (val: any, field: any, i: any) => {
        const onChange: any = [...data.exchange_rate_bi_detail];
        onChange[i][field] = val;

        setData({ ...data, exchange_rate_bi_detail: onChange });
    };

    const [dataById, setDataById] = useState<any>({});
    const handleShowModal = async (id: number) => {
        await axios
            .get(`/getExchangeRateBIById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModalShow({
            show: true,
        });
    };

    const [dataEdit, setDataEdit] = useState<any>({});
    const handleEditModal = async (id: number) => {
        await axios
            .get(`/getExchangeRateBIDetailById/${id}`)
            .then((res) => {
                setDataEdit(res.data);
                console.log(res.data);
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

    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: any) => {
        setIsSuccess("");

        setIsSuccess(message.msg);
        getExchangeRateBI();
        handleShowModal(message.id);
    };
    // Handle Success End

    // Search Start
    const [exchangeRateBI, setExchangeRateBI] = useState<any>([]);

    const [searchExchangeRateBI, setSearchExchangeRateBI] = useState<any>({
        exchange_rate_bi_date: "",
    });

    const getExchangeRateBI = async (pageNumber = "page=1") => {
        await axios
            .post(`/getExchangeRateBI?${pageNumber}`, {
                exchange_rate_bi_date:
                    searchExchangeRateBI.exchange_rate_bi_date,
            })
            .then((res) => {
                setExchangeRateBI(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Search End

    // Clear Search Start
    const clearSearchExchangeRateBI = async (pageNumber = "page=1") => {
        await axios
            .post(`/getExchangeRateBI?${pageNumber}`)
            .then((res) => {
                setExchangeRateBI(res.data);
                setSearchExchangeRateBI({
                    exchange_rate_bi_date: "",
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
    });
    // End Function Format Currency

    // console.log("Data", data);
    // console.log("Data Exchange Rate BI", exchangeRateBI);
    // console.log("Data Exchange Rate BI By Id", dataById);
    // console.log("Data Edit", dataEdit);

    return (
        <AuthenticatedLayout user={auth.user} header={"Exchange Rate BI"}>
            <Head title="Exchange Rate BI" />

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
                title={"Add Exchange Rate BI"}
                url={`/exchangeRateBIAdd`}
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

                        <div className="block md:flex md:space-x-4 mt-4">
                            <div className="w-full mb-5">
                                <InputLabel
                                    htmlFor="dateRange"
                                    className="mb-2"
                                >
                                    Date
                                </InputLabel>
                                <div className="grid grid-cols-1 w-full relative">
                                    <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                    <DatePicker
                                        name="exchange_rate_bi_date"
                                        selected={data.exchange_rate_bi_date}
                                        onChange={(date: any) =>
                                            handleChangeDate(
                                                date,
                                                "exchange_rate_bi_date"
                                            )
                                        }
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyy"
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full mb-5">
                                <InputLabel className="mb-2">File</InputLabel>
                                <div className="flex pt-1 space-x-4">
                                    <Button
                                        type="button"
                                        className="bg-green-600 hover:bg-green-500 text-sm text-white py-1.5 w-1/2"
                                        title="Download Template"
                                        onClick={handleDownloadTemplate}
                                    >
                                        Template
                                    </Button>
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
                                    <>
                                        {data?.exchange_rate_bi_detail.map(
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
                                                        <CurrencyInput
                                                            id="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                                            name="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            value={
                                                                currency.EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE ||
                                                                ""
                                                            }
                                                            onValueChange={(
                                                                val
                                                            ) =>
                                                                handleChangeUploadFile(
                                                                    val,
                                                                    "EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE",
                                                                    i
                                                                )
                                                            }
                                                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-2 md:leading-6 text-right`}
                                                            placeholder="0.00"
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </TD>
                                                </tr>
                                            )
                                        )}
                                    </>
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
                title="Exchange Rate BI Show"
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
                            title="Exchange Rate BI Edit"
                            url="/exchangeRateBIEdit"
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
                                                id="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                                name="EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                value={
                                                    dataEdit?.EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE ||
                                                    ""
                                                }
                                                onValueChange={(val: any) =>
                                                    handleChangeExchangeRateEdit(
                                                        val,
                                                        "EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE"
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
                                    dataById.EXCHANGE_RATE_BI_DATE,
                                    "dd-mm-yyyy"
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
                                        {dataById.exchange_rate_bi_detail?.map(
                                            (data: any, i: number) => (
                                                <tr
                                                    key={i}
                                                    className={`
                                                    hover:bg-gray-200 text-center cursor-pointer`}
                                                    onDoubleClick={() =>
                                                        handleEditModal(
                                                            data.EXCHANGE_RATE_BI_DETAIL_ID
                                                        )
                                                    }
                                                >
                                                    <TD className="border p-2">
                                                        {i + 1}
                                                    </TD>
                                                    <TD className="border p-2">
                                                        {
                                                            data.currency
                                                                ?.CURRENCY_NAME
                                                        }
                                                    </TD>
                                                    <TD className="border p-2">
                                                        <span className="bg-orange-500 text-white px-2 py-1 rounded-md inline-block text-center w-14">
                                                            {data.currency
                                                                ?.CURRENCY_SYMBOL ||
                                                                "No Currency"}
                                                        </span>
                                                    </TD>
                                                    <TD className="border p-2">
                                                        {formatCurrency.format(
                                                            data.EXCHANGE_RATE_BI_DETAIL_EXCHANGE_RATE
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
                            className="text-xs sm:text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Upload"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <div className="grid grid-cols-1 mb-5 relative">
                            <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                            <DatePicker
                                name="exchange_rate_bi_date"
                                selected={
                                    searchExchangeRateBI.exchange_rate_bi_date
                                }
                                onChange={(date: any) =>
                                    setSearchExchangeRateBI({
                                        ...searchExchangeRateBI,
                                        exchange_rate_bi_date:
                                            date.toLocaleDateString("en-CA"),
                                    })
                                }
                                dateFormat={"dd-MM-yyyy"}
                                placeholderText="dd-mm-yyyyy (Start Date)"
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                autoComplete="off"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-end gap-2">
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => getExchangeRateBI()}
                            >
                                Search
                            </Button>
                            <Button
                                className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                onClick={() => clearSearchExchangeRateBI()}
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
                            label={"Date"}
                            colSpan=""
                            rowSpan=""
                        />
                    </tr>
                }
                td={
                    <>
                        {exchangeRateBI.data === undefined && (
                            <tr className="text-center">
                                <TD
                                    className="leading-10 font-medium text-gray-500"
                                    colSpan="2"
                                >
                                    Please Search Exchange Rate BI
                                </TD>
                            </tr>
                        )}
                        {exchangeRateBI.data?.length === 0 ? (
                            <tr className="text-center">
                                <TD
                                    className="leading-10 font-medium text-gray-500"
                                    colSpan="2"
                                >
                                    Data not available
                                </TD>
                            </tr>
                        ) : (
                            <>
                                {exchangeRateBI.data?.map(
                                    (data: any, i: number) => (
                                        <tr
                                            key={i}
                                            className="text-center cursor-pointer"
                                            onDoubleClick={() =>
                                                handleShowModal(
                                                    data.EXCHANGE_RATE_BI_ID
                                                )
                                            }
                                        >
                                            <TableTD
                                                value={i + 1}
                                                className="w-px"
                                            />
                                            <TableTD
                                                value={dateFormat(
                                                    data.EXCHANGE_RATE_BI_DATE,
                                                    "dd-mm-yyyy"
                                                )}
                                                className=""
                                            />
                                        </tr>
                                    )
                                )}
                            </>
                        )}
                    </>
                }
                pagination={
                    <>
                        <Pagination
                            links={exchangeRateBI.links}
                            fromData={exchangeRateBI.from}
                            toData={exchangeRateBI.to}
                            totalData={exchangeRateBI.totalAmount}
                            clickHref={(url: string) =>
                                getExchangeRateBI(url.split("?").pop())
                            }
                        />
                    </>
                }
            />
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
