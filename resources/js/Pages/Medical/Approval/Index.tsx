import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { FormEvent, useEffect, useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dateFormat from "dateformat";
import Input from "@/Components/Input";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
import { ArrowDownTrayIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { rm } from "fs";

export default function Index({ auth }: PageProps) {
    const { selectYear, listEmployee, listDivision, companies }: any =
        usePage().props;

    const employee: any = auth.user.employee;
    
    const getEmployeeById = (id: any) => {
        const datas = listEmployee;
        const result = datas.find((value: any) => value.EMPLOYEE_ID == id);
        return result ? result : null;
    };

    const getDivisionById = (id: any) => {
        const datas = listDivision;
        const result = datas.find((value: any) => value.COMPANY_DIVISION_ID == id);
        return result ? result : null;
    };

    const medicalType = [
        {
            id: 1,
            name: "General",
        },
        {
            id: 2,
            name: "Maternity",
        },
    ];

    const selectMonth: any = [
        { id: 1, name: "January" },
        { id: 2, name: "February" },
        { id: 3, name: "March" },
        { id: 4, name: "April" },
        { id: 5, name: "May" },
        { id: 6, name: "June" },
        { id: 7, name: "July" },
        { id: 8, name: "August" },
        { id: 9, name: "September" },
        { id: 10, name: "October" },
        { id: 11, name: "November" },
        { id: 12, name: "December" }
    ];

    const [successSearch, setSuccessSearch] = useState<string>("");
    const [searchDate, setSearchDate] = useState<any>({
        medical_search: [
            {
                COMPANY_ID: "",
                YEAR: dateFormat(new Date(), "yyyy"),
                MONTH: dateFormat(new Date(), "mm"),
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchDate.medical_search];
        changeVal[i][name] = value;
        setSearchDate({ ...searchDate, medical_search: changeVal });
    };
    console.log("searchDate: ", searchDate);
    
    
    const clearSearch = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("YEAR", "", 0);
    };
    
    const inputMedical = (name: string, value: any) => {
        const items = { ...dataRequestMedical };
        const details = [items.detail];

        items[name] = value;
        setDataRequestMedical(items);
    };

    const inputDetailMedical = (name: string, value: any, i: any) => {
        const items = { ...dataRequestMedical };
        const details = [...dataRequestMedical.detail];

        details[i][name] = value;
        setDataRequestMedical({
            ...dataRequestMedical,
            detail: details,
        });
    };

    const addRowDetail = (e: FormEvent) => {
        e.preventDefault();
        setDataRequestMedical({
            ...dataRequestMedical,
            detail: [
                ...dataRequestMedical.detail,
                {
                    MEDICAL_DETAIL_ID: "",
                    MEDICAL_ID: "",
                    AMOUNT: 0,
                    DESCRIPTION: "",
                },
            ],
        });
    };

    const deleteRow = (i: number) => {
        const val = [...dataRequestMedical.detail];
        val.splice(i, 1);
        setDataRequestMedical({
            ...dataRequestMedical,
            detail: val,
        });
    };

    // Request Medical
    const [modal, setModal] = useState<any>({
        modalRequestMedical: false,
        modalReviewMedical: false,
    });

    const fieldDataRequestMedical = {
        MEDICAL_ID: "",
        EMPLOYEE_ID: "",
        COMPANY_ID: "",
        DIVISION_ID: "",
        STRUCTURE_ID: "",
        MEDICAL_TYPE: "",
        MEDICAL_AMOUNT: "",
        MEDICAL_LIMIT: "",
        REQUEST_DATE: "",
        detail: [
            {
                MEDICAL_DETAIL_ID: "",
                MEDICAL_ID: "",
                AMOUNT: 0,
                DESCRIPTION: "",
            },
        ],
        document: [],
    };

    const [dataRequestMedical, setDataRequestMedical] = useState<any>(
        fieldDataRequestMedical
    );

    const handleRequestMedical = () => {
        const items = { ...fieldDataRequestMedical };
        items["EMPLOYEE_ID"] = employee.EMPLOYEE_ID;
        items["COMPANY_ID"] = employee.COMPANY_ID;
        items["DIVISION_ID"] = employee.DIVISION_ID;
        items["STRUCTURE_ID"] = employee.STRUCTURE_ID;
        items["REQUEST_DATE"] = dateFormat(new Date(), "dd-mm-yyyy");
        setDataRequestMedical(items);
        setModal({
            modalRequestMedical: true,
            modalReviewMedical: false,
        });
    };

    const handleSuccessReviewMedical = (message: any) => {
        setIsSuccess("");
        if (message.msg != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setSuccessSearch("Refreshing");
        setTimeout(() => {
            setSuccessSearch("");
        }, 1000);
        setModal({
            modalRequestMedical: false,
            modalReviewMedical: false,
        });
    };

    // End Request Medical

    const [isSuccess, setIsSuccess] = useState<string>("");

    // Edit Medical

    const [employeeSalary, setEmployeeSalary] = useState<number>(0);
    const [totalMedical, setTotalMedical] = useState<number>(0);
    // const employeeSalary
    const getSalaryByEmployee = async (employeeId: any) => {
        await axios
            .get(`/getSalaryByEmployee/${employeeId}`)
            .then((res) =>
                setEmployeeSalary(res.data ? res.data.salaryNominal : 0)
            )
            .catch((err) => console.log(err));
    };

    const getMedicalByEmployee = async (employeeId: any) => {
        await axios
            .get(`/getMedicalByEmployee/${employeeId}`)
            .then((res) =>
                
                setTotalMedical(
                    Object.keys(res.data).length > 0 ? res.data.AMOUNT : 0
                )
            )
            .catch((err) => console.log(err));
    };
    
    const [validation, setValidation] = useState<boolean>(false);
    const cekValidasiRequest = (data:any) => {
        const items = { ...reviewMedical };
        const details = data;

        const currentMedical = details.reduce(
            (total: any, currentValue: any) =>
                (total = parseInt(total) + parseInt(currentValue.AMOUNT)),
            0
        );

        const buttonSubmit = document.getElementById(
            "buttonSubmitModalToAction"
        ) as HTMLButtonElement;
        if (parseInt(totalMedical + currentMedical) > employeeSalary) {
            setValidation(true);
            buttonSubmit.disabled = true;
        } else {
            setValidation(false);
            buttonSubmit.disabled = false;
        }

    };

    const [reviewMedical, setReviewMedical] = useState<any>({});
    const getMedical =  (medicalId: any) => {
        axios
            .get(`/getRequestMedicalById/${medicalId}`)
            .then((res) => setReviewMedical(res.data))
            .catch((err) => console.log(err));
    };

    const handleReviewModal = async (data: any) => {
        getMedical(data.MEDICAL_ID);
        getSalaryByEmployee(data.EMPLOYEE_ID);
        getMedicalByEmployee(data.EMPLOYEE_ID);
        setModal({
            modalRequestMedical: false,
            modalReviewMedical: !modal.modalReviewMedical,
        });
        setValidation(false)
    };

    const editMedical = (name: string, value: any) => {
        const items = { ...reviewMedical };
        const details = [items.request_time_off];

        items[name] = value;
        setReviewMedical(items);
    };

    const editDetailMedical = (name: string, value: any, i: any) => {
        const items = { ...reviewMedical };
        const details = [...reviewMedical.detail];

        details[i][name] = value;
        setReviewMedical({
            ...reviewMedical,
            detail: details,
        });
        cekValidasiRequest(details);
    };

    const deleteRowEditDetailMedical = (i: number) => {
        const val = [...reviewMedical.detail];
        val.splice(i, 1);
        setReviewMedical({
            ...reviewMedical,
            detail: val,
        });
        cekValidasiRequest(val);
    };

    const addRowEditDetailMedical = (e: FormEvent) => {
        e.preventDefault();
        setReviewMedical({
            ...reviewMedical,
            detail: [
                ...reviewMedical.detail,
                {
                    MEDICAL_DETAIL_ID: "",
                    MEDICAL_ID: "",
                    AMOUNT: 0,
                    DESCRIPTION: "",
                },
            ],
        });
    };

    const handleFileDownload = async (id: number) => {
        await axios({
            url: `/downloadMedicalDocument/${id}`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                
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
                
                if (err.response.status === 404) {
                    alert("File not Found");
                }
            });
    };

    const alertDelete = async (idDocument: string, medicalId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDocument(idDocument, medicalId);
            }
        });
    };

    const deleteDocument = async (idDocument: string, medicalId: string) => {
        await axios
            .post(`/deleteMedicalDocument`, { idDocument, medicalId })
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    text: "Images Delete",
                    icon: "success",
                }).then((result: any) => {
                    if (result.value) {
                        getMedical(medicalId);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // End Edit Medical
    const rejectRequestMedical = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Reject this Request Medical?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setModal({
                    modalRequestMedical: false,
                    modalReviewMedical: false,
                });
                try {
                    // send request to server
                    const response = await axios.post(`/rejectMedical`, {
                        data,
                    });

                    // check status response
                    if (response.status) {
                        if (response.data.status == 1) {
                            Swal.fire(
                                "Rejected!",
                                "Request Medical has been rejected.",
                                "success"
                            );
                        } else {
                            Swal.fire(
                                "Failed!",
                                "Failed Rejected Request Medical."
                            );
                        }

                        setSuccessSearch("Refreshing");
                        setTimeout(() => {
                            setSuccessSearch("");
                        }, 1000);
                        // handleSuccessRequestTimeOff(response.data.msg); // Panggil fungsi sukses untuk memperbarui UI atau state
                    } else {
                        throw new Error("Unexpected response status");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        "Error!",
                        "There was an error rejected request Medical.",
                        "error"
                    );
                }
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Review Medical Benefit"}>
            <Head title="Review Medical Benefit" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Review Medical */}

            <ModalToAction
                buttonAddOns={reviewMedical.STATUS == null ? "Reject" : null}
                actionDelete={rejectRequestMedical}
                show={modal.modalReviewMedical}
                onClose={() =>
                    setModal({
                        modalReviewMedical: false,
                    })
                }
                headers={null}
                submitButtonName={
                    reviewMedical.STATUS == null ? "Approve" : null
                }
                cancelButtonName={"Close"}
                title={"Review Request Medical"}
                url={`/approveMedical`}
                method={"post"}
                data={reviewMedical}
                onSuccess={handleSuccessReviewMedical}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        {Object.keys(reviewMedical).length > 0 && (
                            <div className=" overflow-hidden rounded-lg bg-white shadow">
                                <div className=" p-4 rounded-lg mb-4 border">
                                    <div className="bg-blue-50 rounded-lg flex justify-between items-center mb-2 pb-1">
                                        <h2 className="text-lg font-semibold ">
                                            Employee Information
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p>
                                                <span className="font-bold">
                                                    {"Name : "}
                                                </span>
                                                {
                                                    reviewMedical.employee
                                                        .EMPLOYEE_FIRST_NAME
                                                }
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    {"Division : "}
                                                </span>
                                                {
                                                    reviewMedical.employee
                                                        .division
                                                        .COMPANY_DIVISION_NAME
                                                }
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    {"Jabatan : "}
                                                </span>
                                                {
                                                    reviewMedical.employee
                                                        .structure
                                                        .COMPANY_STRUCTURE_NAME
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <span className="font-bold">
                                                    {"Request Date : "}
                                                </span>
                                                {dateFormat(
                                                    reviewMedical.REQUEST_DATE,
                                                    "dd mmm yyyy"
                                                )}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    Medical Type {" : "}
                                                </span>
                                                {reviewMedical.MEDICAL_TYPE == 1
                                                    ? "General"
                                                    : "Maternity"}
                                            </p>
                                            {/* <p>
                                                <span className="font-bold">
                                                    Sisa Medical{" : "}
                                                </span>
                                                {(
                                                    employeeSalary -
                                                    totalMedical
                                                ).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg mb-4 border ">
                                    <div className="bg-blue-50 rounded-lg flex justify-between items-center mb-2 pb-1">
                                        <h2 className="text-lg font-semibold ">
                                            Detail(s)
                                        </h2>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="border-b p-2">
                                                    No
                                                </th>
                                                <th className="border-b p-2">
                                                    Description
                                                </th>
                                                <th className="border-b p-2">
                                                    Amount
                                                </th>
                                                <th className="border-b p-2">
                                                    Note Approval
                                                </th>
                                                <th className="border-b p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviewMedical.detail.map(
                                                (rM: any, i: number) => (
                                                    <tr>
                                                        <td className="border-b p-2">
                                                            {i + 1}
                                                        </td>
                                                        <td className="border-b p-2">
                                                            <input
                                                                id="description"
                                                                name="DESCRIPTION"
                                                                type="text"
                                                                value={
                                                                    rM.DESCRIPTION
                                                                }
                                                                onChange={(
                                                                    e: any
                                                                ) => {
                                                                    editDetailMedical(
                                                                        "DESCRIPTION",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </td>
                                                        <td className="border-b p-2">
                                                            <CurrencyInput
                                                                id="amount"
                                                                name="AMOUNT"
                                                                value={
                                                                    rM.AMOUNT
                                                                }
                                                                decimalScale={2}
                                                                decimalsLimit={
                                                                    2
                                                                }
                                                                onValueChange={(
                                                                    values
                                                                ) => {
                                                                    editDetailMedical(
                                                                        "AMOUNT",
                                                                        values,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="border-b p-2">
                                                            <input
                                                                id="note_approval"
                                                                name="NOTE_APPROVAL"
                                                                type="text"
                                                                value={
                                                                    rM.NOTE_APPROVAL
                                                                }
                                                                onChange={(
                                                                    e: any
                                                                ) => {
                                                                    editDetailMedical(
                                                                        "NOTE_APPROVAL",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    );
                                                                }}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </td>
                                                        <td className="border-b p-2">
                                                            {i > 0 ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        deleteRowEditDetailMedical(
                                                                            i
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
                                                            ) : (
                                                                ""
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            <tr>
                                                <td
                                                    className="border-b p-2 font-bold text-right pr-5"
                                                    colSpan={2}
                                                >
                                                    TOTAL
                                                </td>
                                                <td className="border-b p-2 font-bold text-right pr-5">
                                                    {reviewMedical.detail
                                                        .reduce(
                                                            (
                                                                total: any,
                                                                currentValue: any
                                                            ) =>
                                                                (total =
                                                                    parseInt(
                                                                        total
                                                                    ) +
                                                                    parseInt(
                                                                        currentValue.AMOUNT
                                                                    )),
                                                            0
                                                        )
                                                        .toLocaleString(
                                                            "en-US",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                </td>
                                                <td className="border-b p-2"></td>
                                                <td className="border-b p-2"></td>
                                                <td className="border-b p-2"></td>
                                            </tr>
                                            {validation && (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <div className="bg-red-100 text-red-700 p-1 border border-red-500">
                                                            {"Medical Reimburst                                                        melebihi sisa medical. Sisa : " +
                                                                (
                                                                    employeeSalary -
                                                                    totalMedical -
                                                                    reviewMedical.detail.reduce(
                                                                        (
                                                                            total: any,
                                                                            currentValue: any
                                                                        ) =>
                                                                            (total =
                                                                                parseInt(
                                                                                    total
                                                                                ) +
                                                                                parseInt(
                                                                                    currentValue.AMOUNT
                                                                                )),
                                                                        0
                                                                    )
                                                                ).toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="mt-2">
                                        <a
                                            href=""
                                            className="mt-2 text-xs text-white ms-1 py-1 px-2 bg-red-500 rounded-md"
                                            onClick={(e) =>
                                                addRowEditDetailMedical(e)
                                            }
                                        >
                                            + Add Row
                                        </a>
                                    </div>
                                </div>
                                <div className=" p-4 rounded-lg mb-2 border">
                                    <div className="bg-blue-50 rounded-lg flex justify-between items-center mb-2 pb-1">
                                        <h2 className="text-lg font-semibold ">
                                            Bukti Pembayaran
                                        </h2>
                                    </div>
                                    {reviewMedical?.document &&
                                        reviewMedical.document?.map(
                                            (doc: any, i: number) => (
                                                <div className="grid-cols-2 grid gap-4 ml-1 mt-4 mb-1">
                                                    <div
                                                        className="text-sm text-gray-900 cursor-pointer hover:text-red-600 w-fit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.open(
                                                                window.location
                                                                    .origin +
                                                                    "/storage/" +
                                                                    doc.document
                                                                        ?.DOCUMENT_DIRNAME +
                                                                    doc.document
                                                                        ?.DOCUMENT_FILENAME,
                                                                "_blank"
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {
                                                                doc.document
                                                                    .DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex">
                                                        <span>
                                                            <ArrowDownTrayIcon
                                                                className="w-6 text-blue-600 hover:cursor-pointer"
                                                                title="Download Images"
                                                                onClick={(e) =>
                                                                    handleFileDownload(
                                                                        doc.DOCUMENT_ID
                                                                    )
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        )}
                    </>
                }
            />

            {/* End Modal Request Medical */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    {/* <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                handleRequestMedical();
                            }}
                        >
                            {"Request Medical"}
                        </Button>
                    </div> */}
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <div className="mb-2">
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={searchDate.medical_search[0].COMPANY_ID}
                                onChange={(e) => {
                                    inputDataSearch(
                                        "COMPANY_ID",
                                        e.target.value,
                                        0
                                    );
                                    setSuccessSearch("success");
                                    setTimeout(() => {
                                        setSuccessSearch("");
                                    }, 1000);
                                }}
                                required
                            >
                                <option value={""}>
                                    -- <i>Select Company</i> --
                                </option>
                                {companies.map((item: any, i: number) => {
                                    return (
                                        <option key={i} value={item.COMPANY_ID}>
                                            {item.COMPANY_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-2">
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={searchDate.medical_search[0].YEAR}
                                    onChange={(e) => {
                                        inputDataSearch(
                                            "YEAR",
                                            e.target.value,
                                            0
                                        );
                                        setSuccessSearch("success");
                                        setTimeout(() => {
                                            setSuccessSearch("");
                                        }, 1000);
                                    }}
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Search Year</i> --
                                    </option>
                                    {selectYear.map((item: any, i: number) => {
                                        return (
                                            <option key={i} value={item.YEAR}>
                                                {item.YEAR}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="col-span-3">
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={searchDate.medical_search[0].MONTH}
                                    onChange={(e) => {
                                        inputDataSearch(
                                            "MONTH",
                                            e.target.value,
                                            0
                                        );
                                        setSuccessSearch("success");
                                        setTimeout(() => {
                                            setSuccessSearch("");
                                        }, 1000);
                                    }}
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Search Month</i> --
                                    </option>
                                    {selectMonth.map((item: any, i: number) => {
                                        return (
                                            <option key={i} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-5 gap-2 mt-4 ">
                            <div
                                className="bg-red-600 col-span-2 text-white p-2 rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => {
                                    clearSearch(e);
                                    setSuccessSearch("success");
                                    setTimeout(() => {
                                        setSuccessSearch("");
                                    }, 1000);
                                }}
                            >
                                Clear Search
                            </div>
                            <div
                                className="bg-red-600 col-span-3 text-white p-2 rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchDate.medical_search[0].YEAR != ""
                                    ) {
                                        inputDataSearch(
                                            "YEAR",
                                            searchDate.medical_search[0].YEAR,
                                            0
                                        ),
                                            setSuccessSearch("success");
                                        setTimeout(() => {
                                            setSuccessSearch("");
                                        }, 1000);
                                    }
                                }}
                            >
                                Search
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchDate.medical_search}
                            // loading={isLoading.get_policy}
                            url={"getMedicalAgGridForHR"}
                            doubleClickEvent={handleReviewModal}
                            triggeringRefreshData={successSearch}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.2,
                                },
                                {
                                    headerName: "Employee",
                                    flex: 4,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return getEmployeeById(
                                                params.data.EMPLOYEE_ID
                                            ).EMPLOYEE_FIRST_NAME;
                                        }
                                    },
                                },
                                {
                                    headerName: "Division",
                                    flex: 4,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return getDivisionById(
                                                params.data.DIVISION_ID
                                            ).COMPANY_DIVISION_NAME;
                                        }
                                    },
                                },
                                {
                                    headerName: "Request Date",
                                    flex: 2.5,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return dateFormat(
                                                params.data.REQUEST_DATE,
                                                "dd mmm yyyy"
                                            );
                                        }
                                    },
                                },
                                {
                                    headerName: "Medical Amount",
                                    flex: 3,
                                    // field: "AMOUNT",
                                    type: "rightAligned",
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return params.data.AMOUNT.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            );
                                        }
                                    },
                                },
                                {
                                    headerName: "Status",
                                    flex: 2,
                                    // field: "STATUS",
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            if (params.data.STATUS == null) {
                                                return "Waiting Approval";
                                            } else if (
                                                params.data.STATUS == 0
                                            ) {
                                                return "Rejected";
                                            } else if (
                                                params.data.STATUS == 1
                                            ) {
                                                return "Approved";
                                            }
                                        }
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
