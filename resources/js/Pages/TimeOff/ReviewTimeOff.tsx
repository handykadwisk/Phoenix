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
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function Index({ auth }: PageProps) {
    const { data, employees, timeOffTipes }: any = usePage().props;
    
    const [dataReviewTimeOff, setDataReviewTimeOff] = useState<any>(data);

    const employee: any = auth.user.employee;

    const [searchDefault, setSearchDefault] = useState<any>({
        COMPANY_ID: employee.COMPANY_ID,
        DIVISION_ID: employee.division.COMPANY_DIVISION_ID            
    });
    
    useEffect(() => {
        getSubtitute();
        getRequestTo();
        getTimeOffAvailable();
        getTimeOffUsed();
    }, [employee]);

    const [selectedType, setSelectedType] = useState<any>({});
    const [dailyOff, setDailyOff] = useState<any>([]);

    const [timeOffUsed, settimeOffUsed] = useState<any>([]);
    const [dataSubtitute, setDataSubtitute] = useState<any>([]);
    const [timeOffAvailable, setTimeOffAvailable] = useState<any>([]);
    const [dataRequestTo, setDataRequestTo] = useState<any>([]);
    const [fieldTotalTimeOff, setFieldTotalTimeOff] = useState<number>(0);
    const [fieldStartDate, setFieldStartDate] = useState<number>(0);
    const [fieldEndDate, setFieldEndDate] = useState<number>(0);
    const getSubtitute = async () => {
        await axios
            .post(`/getSubtitute`, {
                divisionId: employee.DIVISION_ID,
                employeeId: employee.EMPLOYEE_ID,
            })
            .then((res) => {
                setDataSubtitute(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getRequestTo = async () => {
        await axios
            .post(`/getRequestTo`)
            .then((res) => {
                setDataRequestTo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getTimeOffAvailable = async () => {
        await axios
            .post(`/getTimeOffAvailable`)
            .then((res) => {
                setTimeOffAvailable(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getTimeOffUsed = async () => {
        await axios
            .post(`/getTimeOffUsed`)
            .then((res) => {
                settimeOffUsed(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getEmployeeById = (id: any) => {
        const datas = employees;
        const result = datas.find((value: any) => value.EMPLOYEE_ID == id);
        return result ? result : null;
    };

    const getTimeOffById = (id: any) => {
        const datas = timeOffTipes;
        const result = datas.find((value: any) => value.TIME_OFF_TYPE_ID == id);
        return result ? result : null;
    };

    const inputReviewTimeOff = (name: string, value: any) => {
        const items = { ...dataReviewTimeOff };
        items[name] = value;
        setDataReviewTimeOff(items);
    };

    const addRowDailyOff = (e: FormEvent) => {
        e.preventDefault();
        setDataRequestTimeOff({
            ...dataRequestTimeOff,
            detail: [
                ...dataRequestTimeOff.detail,
                {
                    DATE_OF_LEAVE: "",
                },
            ],
        });

        setDailyOff([...dailyOff, { DATE: null }]);
    };

    const inputDailyOff = (value: any, i: any) => {
        const items = [...dataRequestTimeOff.detail];

        items[i]["DATE_OF_LEAVE"] = value;
        setDataRequestTimeOff({
            ...dataRequestTimeOff,
            detail: items,
        });

    };

    const deleteRowDailyOff = (i: number) => {
        const val = [...dataRequestTimeOff.detail];
        val.splice(i, 1);
        setDataRequestTimeOff({
            ...dataRequestTimeOff,
            detail: val,
        });
    };

    // Request Time Off
    const [modal, setModal] = useState<any>({
        modalReviewTimeOff: true,
    });

    const fieldDataRequestTimeOff = {
        REQUEST_TIME_OFF_ID: "",
        EMPLOYEE_ID: "",
        IS_REDUCE_LEAVE: "",
        TIME_OFF_TYPE_ID: "",
        DATE_OF_LEAVE: "",
        SUBSTITUTE_PIC: "",
        SECOND_SUBSTITUTE_PIC: "",
        FILE_ID: "",
        DESCRIPTION: "",
        REQUEST_DATE: "",
        REQUEST_TO: "",
        APPROVED_DATE: "",
        APPROVED_BY: "",
        STATUS: "",
        NOTE: "",
        detail: [
            // {DATE_OF_LEAVE: ""}
        ],
    };

    const [dataRequestTimeOff, setDataRequestTimeOff] = useState<any>({});

    const handleRequestTimeOff = () => {
        getSubtitute();
        getRequestTo();
        getTimeOffAvailable();
        getTimeOffUsed();
        const items = { ...fieldDataRequestTimeOff };
        items["EMPLOYEE_ID"] = employee.EMPLOYEE_ID;
        setDataRequestTimeOff(items);
        setModal({
            modalReviewTimeOff: !modal.modalReviewTimeOff,
        });
    };

    const handleSuccessApproveTimeOff = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            modalReviewTimeOff: false,
        });
    };

    // End Request Time Off

    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleEditModal = async (data: any) => {
        await axios
            .get(`/getRequestTimeOffById/${data.REQUEST_TIME_OFF_MASTER_ID}`)
            .then((res) => setDataReviewTimeOff(res.data))
            .catch((err) => console.log(err));

        setModal({
            // modalRequestTimeOff: false,
            // modalReviewTimeOff: !modal.modalReviewTimeOff,
            modalReviewTimeOff: true,
        });
    };


    const actionDelete = async (e: any, data: any, flag: any) => {
        e.preventDefault();
        
        Swal.fire({
            // title: '',
            text: "Are you sure to Reject this Time Off?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // send request to server
                    const response = await axios.post(`/rejectTimeOff`, {
                        data
                    });
                    
                    // check status response
                    if (response.status) {
                        Swal.fire(
                            "Rejected!",
                            "Request Time Off has been rejected.",
                            "success"
                        );
                        handleSuccessApproveTimeOff(response.data.msg); // Panggil fungsi sukses untuk memperbarui UI atau state
                    } else {
                        throw new Error('Unexpected response status');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        "Error!",
                        "There was an error rejected request time off.",
                        "error"
                    );
                }
            }
        });
    };

    const handleFileDownload = async (id: number) => {
        await axios({
            url: `/downloadTimeOffDocument/${id}`,
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

    
    return (
        <AuthenticatedLayout user={auth.user} header={"Review Time Off"}>
            <Head title="Review Time Off" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Request Time Off */}
            {dataReviewTimeOff && (
                <ModalToAction
                    show={modal.modalReviewTimeOff}
                    onClose={() =>
                        setModal({
                            modalReviewTimeOff: false,
                        })
                    }
                    title={"Review & Approve Time Off"}
                    url={`/approveTimeOff`}
                    method={"post"}
                    data={dataReviewTimeOff}
                    onSuccess={handleSuccessApproveTimeOff}
                    headers={null}
                    submitButtonName={
                        dataReviewTimeOff.STATUS == 0 ? "Approve" : null
                    }
                    cancelButtonName={"Close"}
                    classPanel={
                        "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                    }
                    actionDelete={actionDelete}
                    buttonAddOns={
                        dataReviewTimeOff.STATUS == 0 ? "Reject" : null
                    }
                    body={
                        <>
                            {dataReviewTimeOff.STATUS != 0 && (
                                <div
                                    className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
                                    role="alert"
                                >
                                    <p>
                                        This Request Time Off Has Been
                                        {dataReviewTimeOff.STATUS == 1
                                            ? " Rejected."
                                            : " Approved."}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Name
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {getEmployeeById(
                                            dataReviewTimeOff.EMPLOYEE_ID
                                        ) &&
                                            getEmployeeById(
                                                dataReviewTimeOff.EMPLOYEE_ID
                                            ).EMPLOYEE_FIRST_NAME}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Division
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {getEmployeeById(
                                            dataReviewTimeOff.EMPLOYEE_ID
                                        ) &&
                                            getEmployeeById(
                                                dataReviewTimeOff.EMPLOYEE_ID
                                            ).division.COMPANY_DIVISION_NAME}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Time Off Available This Year
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {timeOffAvailable}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Total Time Off Used
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {timeOffUsed}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Type of Request
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {getTimeOffById(
                                            dataReviewTimeOff.TIME_OFF_TYPE_ID
                                        ) &&
                                            getTimeOffById(
                                                dataReviewTimeOff.TIME_OFF_TYPE_ID
                                            ).TIME_OFF_TYPE_NAME}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        File Uploaded
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {dataReviewTimeOff.document && (
                                            <div className="grid-cols-4 grid gap-4 mb-2">
                                                <div
                                                    className="text-sm text-gray-500 font-semibold cursor-pointer hover:text-red-600 w-fit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.open(
                                                            window.location
                                                                .origin +
                                                                "/storage/" +
                                                                dataReviewTimeOff
                                                                    .document
                                                                    ?.DOCUMENT_DIRNAME +
                                                                dataReviewTimeOff
                                                                    .document
                                                                    ?.DOCUMENT_FILENAME,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        {
                                                            dataReviewTimeOff
                                                                .document
                                                                .DOCUMENT_ORIGINAL_NAME
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <span>
                                                        <ArrowDownTrayIcon
                                                            className="w-5 text-blue-600 hover:cursor-pointer"
                                                            title="Download Images"
                                                            onClick={(e) =>
                                                                handleFileDownload(
                                                                    dataReviewTimeOff.FILE_ID
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Time Off Date
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        <div className="relative ">
                                            <table className="table-fixed w-full mb-2">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            rowSpan={2}
                                                            scope="col"
                                                            className="w-10 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                        >
                                                            No.
                                                        </th>
                                                        <th
                                                            rowSpan={2}
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                        >
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white">
                                                    {dataReviewTimeOff.request_time_off.map(
                                                        (
                                                            dO: any,
                                                            i: number
                                                        ) => (
                                                            <tr className="border-t border-gray-200">
                                                                <td className="border text-sm border-[#eee] dark:border-strokedark">
                                                                    <div
                                                                        className={
                                                                            "block w-full mx-auto text-center"
                                                                        }
                                                                    >
                                                                        {1}
                                                                    </div>
                                                                </td>
                                                                <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                    {dateFormat(
                                                                        dO.DATE_OF_LEAVE,
                                                                        "dd-mm-yyyy"
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

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Subtitute PIC
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {getEmployeeById(
                                            dataReviewTimeOff.SUBSTITUTE_PIC
                                        ) &&
                                            getEmployeeById(
                                                dataReviewTimeOff.SUBSTITUTE_PIC
                                            ).EMPLOYEE_FIRST_NAME}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Description
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {dataReviewTimeOff.DESCRIPTION}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Request Date
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {dateFormat(
                                            dataReviewTimeOff.REQUEST_DATE,
                                            "dd-mm-yyyy"
                                        )}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Request To
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        {getEmployeeById(
                                            dataReviewTimeOff.REQUEST_TO
                                        ) &&
                                            getEmployeeById(
                                                dataReviewTimeOff.REQUEST_TO
                                            ).EMPLOYEE_FIRST_NAME}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols gap-2 mt-3">
                                <div className="">
                                    <div className="text-sm font-semibold">
                                        Note
                                    </div>
                                    <div className="text-sm  text-gray-500">
                                        <textarea
                                            id="NOTE"
                                            name="NOTE"
                                            value={dataReviewTimeOff.NOTE}
                                            onChange={(e: any) => {
                                                inputReviewTimeOff(
                                                    "NOTE",
                                                    e.target.value
                                                );
                                            }}
                                            className="resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                />
            )}

            <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                    <AGGrid
                        addButtonLabel={undefined}
                        addButtonModalState={undefined}
                        withParam={""}
                        searchParam={searchDefault}
                        // loading={isLoading.get_policy}
                        url={"getRequestTimeOffForApprove"}
                        doubleClickEvent={handleEditModal}
                        triggeringRefreshData={isSuccess}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1.2,
                            },
                            {
                                headerName: "Request Number",
                                field: "REQUEST_NUMBER",
                                flex: 3,
                            },
                            {
                                headerName: "Name",
                                // field: "REQUEST_TO",
                                flex: 4,
                                valueGetter: function (params: any) {
                                    // console.log("xsd : ", params);
                                    if (params.data) {
                                        return (
                                            getEmployeeById(
                                                params.data.EMPLOYEE_ID
                                            ) &&
                                            getEmployeeById(
                                                params.data.EMPLOYEE_ID
                                            ).EMPLOYEE_FIRST_NAME
                                        );
                                    }
                                },
                            },
                            {
                                headerName: "Time Off Tipe",
                                // field: "REQUEST_TO",
                                flex: 4,
                                valueGetter: function (params: any) {
                                    // console.log("xsd : ", params);
                                    if (params.data) {
                                        return (
                                            getTimeOffById(
                                                params.data.TIME_OFF_TYPE_ID
                                            ) &&
                                            getTimeOffById(
                                                params.data.TIME_OFF_TYPE_ID
                                            ).TIME_OFF_TYPE_NAME
                                        );
                                    }
                                },
                            },
                            {
                                headerName: "Request Date",
                                flex: 2.2,
                                valueGetter: function (params: any) {
                                    // console.log("xsd : ", params);
                                    if (params.data) {
                                        return dateFormat(
                                            params.data.REQUEST_DATE,
                                            "dd mmm yyyy"
                                        );
                                    }
                                },
                            },
                            {
                                headerName: "Description",
                                field: "DESCRIPTION",
                                flex: 5,
                            },
                        ]}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
