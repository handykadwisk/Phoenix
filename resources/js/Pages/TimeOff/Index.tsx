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
// import DetailAttendanceSetting from "./DetailAttendanceSetting";
import axios from "axios";
import dateFormat from "dateformat";
import Input from "@/Components/Input";
import Swal from "sweetalert2";

export default function Index({ auth }: PageProps) {
    const { timeOffTipes }: any = usePage().props;
    
    const employee:any = auth.user.employee;

    useEffect(() => {
        // alert("ads");
        getSubtitute();
        getRequestTo();
        getTimeOffAvailable()
        getTimeOffUsed()
        handleRequestTimeOff();
    }, [employee]);

    const [successSearch, setSuccessSearch] = useState<string>("");
    const [searchDate, setSearchDate] = useState<any>({
        time_off_search: [
            {
                DATE: ""
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        // console.log('name: ', name, ' value: ', value)
        const changeVal: any = [...searchDate.time_off_search];
        changeVal[i][name] = value;
        setSearchDate({ ...searchDate, time_off_search: changeVal });
    };

    const clearSearch = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("DATE", "", 0);
    };

    const [selectedType, setSelectedType] = useState<any>({});
    const [dailyOff, setDailyOff] = useState<any>([]);

    const [timeOffUsed, settimeOffUsed] = useState<any>([]);
    const [dataSubtitute, setDataSubtitute] = useState<any>([]);
    const [timeOffAvailable, setTimeOffAvailable] = useState<any>([]);
    const [dataRequestTo, setDataRequestTo] = useState<any>([]);
    const [fieldTotalTimeOff, setFieldTotalTimeOff] = useState<number>(0);
    const [rowDate, setRowDate] = useState<number>(0);
    const [fieldStartDate, setFieldStartDate] = useState<any>(null);
    const [fieldEndDate, setFieldEndDate] = useState<any>(null);
    const getSubtitute = async () => {
        await axios
            .post(`/getSubtitute`, { divisionId: employee.DIVISION_ID, employeeId: employee.EMPLOYEE_ID })
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

    const getSelectedType = (id: any) => {
        const data = timeOffTipes;
        const result = data.find((value: any) => value.TIME_OFF_TYPE_ID == id);
        return result ? result : null;
    };

    
    useEffect(() => {
        if (rowDate != 0) {
            const items = { ...dataRequestTimeOff };
            let arr: any = [];

            for (let i = 0; i < rowDate; i++) {
                arr.push({
                    DATE_OF_LEAVE: "",
                });
            }
            items["detail"] = arr;
            setDataRequestTimeOff(items);

        }
    }, [rowDate]);

    const inputTimeOff = (name: string, value: any) => {
        const items = { ...dataRequestTimeOff };
        const details = [items.detail]
        if (name == "TIME_OFF_TYPE_ID") {
            
            const type = getSelectedType(value) ? getSelectedType(value) : null;
            Object.keys(type).length > 0
                ? type.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE == 0
                    ? (items["IS_REDUCE_LEAVE"] = 1)
                    : (items["IS_REDUCE_LEAVE"] = 0)
                : "";

            setRowDate(
                type.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY == null &&
                    type.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH == null
                    ? 1
                    : type.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH != null
                    ? 0
                    : type.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY
            );
            
            setSelectedType(getSelectedType(value) ? getSelectedType(value): {});
        }
        
        items[name] = value;
        setDataRequestTimeOff(items);
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

    const inputDailyOff = (value: any, i:any) => {
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
        modalRequestTimeOff: true,
        modalEditRequestTimeOff: false,
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
        ]
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
        setFieldStartDate(null)
        setFieldEndDate(null);
        setSelectedType({})
        setModal({
            modalRequestTimeOff: true,
            modalEditRequestTimeOff: false,
        });
    };


    const handleSuccessRequestTimeOff = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message);
            setDataRequestTimeOff(fieldDataRequestTimeOff);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            modalRequestTimeOff: false,
            modalEditRequestTimeOff: false,
        });
        
    };

    // End Request Time Off

    

    const [isSuccess, setIsSuccess] = useState<string>("");

   
    // Edit time Off

    const [editRequestTimeOff, setEditRequestTimeOff] = useState<any>({});
   const handleEditModal = async (data: any) => {
       await axios
           .get(`/getRequestTimeOffById/${data.REQUEST_TIME_OFF_MASTER_ID}`)
           .then((res) => setEditRequestTimeOff(res.data))
           .catch((err) => console.log(err));
       
       setSelectedTypeForEdit(
           getSelectedType(data.TIME_OFF_TYPE_ID) ? getSelectedType(data.TIME_OFF_TYPE_ID) : {}
       );

       setModal({
           modalRequestTimeOff: false,
           modalEditRequestTimeOff: !modal.modalEditRequestTimeOff,
       });
       
    };
    
    const [selectedTypeForEdit, setSelectedTypeForEdit] = useState<any>({});

    const editTimeOff = (name: string, value: any) => {
        const items = { ...editRequestTimeOff };
        const details = [items.request_time_off];
        
        if (name == "TIME_OFF_TYPE_ID") {
            if (value) {
                items["request_time_off"] = [
                    {
                        DATE_OF_LEAVE: "",
                    },
                ];
            }
            const type = getSelectedType(value) ? getSelectedType(value) : null;
            Object.keys(type).length > 0
                ? type.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE == 0
                    ? (items["IS_REDUCE_LEAVE"] = 1)
                    : (items["IS_REDUCE_LEAVE"] = 0)
                : "";

            setSelectedTypeForEdit(
                getSelectedType(value) ? getSelectedType(value) : {}
            );
        }
        
        items[name] = value;
        setEditRequestTimeOff(items);
    };


    const editDailyOff = (value: any, i: any) => {
        const items = [...editRequestTimeOff.request_time_off];

        items[i]["DATE_OF_LEAVE"] = value;

        setEditRequestTimeOff({
            ...editRequestTimeOff,
            request_time_off: items,
        });
    };

    // End Edit Time Off


    // set for 3 month
    const setForThreeMonth = (value: any) => {
        const start = new Date(value.toLocaleDateString("en-CA"));
        const end = new Date(
            new Date(
                value.setMonth(
                    value.getMonth() +
                        parseInt(
                            selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH
                        )
                )
            ).toLocaleDateString("en-CA")
        );

        const items = { ...dataRequestTimeOff };
        const daysBetween =
            (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        const arr = [];

        for (let i = 0; i <= daysBetween; i++) {
            const temp = new Date();
            temp.setDate(start.getDate() + i);
            arr.push({
                DATE_OF_LEAVE: temp.toLocaleDateString("en-CA"),
            });
            // arr.push(temp.toLocaleDateString("en-CA"));
        }
       
        items["detail"] = arr;
        setDataRequestTimeOff(items);
    };
    // end set for 3 month

    const cancelRequestTimeOff = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Cancel this Request Time Off?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // send request to server
                    const response = await axios.post(`/cancelTimeOff`, {
                        data,
                    });

                    // check status response
                    if (response.status) {

                        if (response.data.status == 1) {
                            Swal.fire(
                                "Canceled!",
                                "Request Time Off has been canceled.",
                                "success"
                            );
                        } else {
                            Swal.fire(
                                "Failed!",
                                "Failed Canceled Request Time Off."
                            );
                        }
                        
                        
                        handleSuccessRequestTimeOff(response.data.msg); // Panggil fungsi sukses untuk memperbarui UI atau state
                        
                    } else {
                        throw new Error("Unexpected response status");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        "Error!",
                        "There was an error canceled request time off.",
                        "error"
                    );
                }
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Time Off"}>
            <Head title="Time Off" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Request Time Off */}

            <ModalToAdd
                buttonAddOns={""}
                show={modal.modalRequestTimeOff}
                onClose={() =>
                    setModal({
                        modalRequestTimeOff: false,
                    })
                }
                title={"Request Time Off"}
                url={`/requestTimeOff`}
                data={dataRequestTimeOff}
                onSuccess={handleSuccessRequestTimeOff}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div>
                            <div className="relative mt-2">
                                <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={employee.EMPLOYEE_FIRST_NAME}
                                    readOnly
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="division"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Division
                                </label>
                                <input
                                    id="division"
                                    name="division"
                                    type="text"
                                    readOnly
                                    value={
                                        employee
                                            ? employee.division
                                                  .COMPANY_DIVISION_NAME
                                            : null
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="total_time_off_used"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Total Time Off Used
                                </label>
                                <input
                                    id="total_time_off_used"
                                    name="total_time_off_used"
                                    type="text"
                                    readOnly
                                    value={
                                        timeOffUsed + " / " + timeOffAvailable
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Available Time Off
                                </label>
                                <input
                                    id="available_time_off"
                                    name="available_time_off"
                                    type="text"
                                    readOnly
                                    value={timeOffAvailable - timeOffUsed}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    // htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Type of Request
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataRequestTimeOff.TIME_OFF_TYPE_ID}
                                    onChange={(e) =>
                                        inputTimeOff(
                                            "TIME_OFF_TYPE_ID",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {timeOffTipes.map(
                                        (item: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        item.TIME_OFF_TYPE_ID
                                                    }
                                                >
                                                    {item.TIME_OFF_TYPE_NAME}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            {!selectedType ? (
                                ""
                            ) : selectedType.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE ==
                              "1" ? (
                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH +
                                                " Month + " +
                                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY +
                                                " Day(s)"
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  !selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH +
                                                " Month (s) "
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : !selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY +
                                                " Day(s)"
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : !selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  !selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Total Time Off
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="number"
                                            // readOnly
                                            value={fieldTotalTimeOff}
                                            onChange={(e: any) => {
                                                setFieldTotalTimeOff(
                                                    e.target.value
                                                );
                                            }}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}

                            {!selectedType ? (
                                ""
                            ) : selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                              selectedType.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE ==
                                  1 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative mt-8">
                                        <label
                                            htmlFor="start_date"
                                            className="absolute -top-4 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Start
                                        </label>
                                        <DatePicker
                                            selected={fieldStartDate}
                                            onChange={(date: any) => {
                                                setForThreeMonth(date);
                                                setFieldStartDate(
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    )
                                                ),
                                                    selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH !=
                                                        null &&
                                                        setFieldEndDate(
                                                            new Date(
                                                                date.setMonth(
                                                                    date.getMonth() +
                                                                        parseInt(
                                                                            selectedType.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH
                                                                        )
                                                                )
                                                            ).toLocaleDateString(
                                                                "en-CA"
                                                            )
                                                        );
                                            }}
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyyy"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative mt-8">
                                        <label
                                            htmlFor="end_date"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Until
                                        </label>
                                        <input
                                            id="end_date"
                                            name="end_date"
                                            type="text"
                                            value={
                                                fieldEndDate &&
                                                dateFormat(
                                                    fieldEndDate,
                                                    "dd-mm-yyyy"
                                                )
                                            }
                                            readOnly
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}

                            {dataRequestTimeOff.detail && (
                                <div className="relative mt-4">
                                    <table className="table-fixed w-full mb-4">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    rowSpan={2}
                                                    scope="col"
                                                    className="w-4 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
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
                                                <th
                                                    rowSpan={2}
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {dataRequestTimeOff.detail.map(
                                                (dO: any, i: number) => (
                                                    <tr className="border-t border-gray-200">
                                                        <td className="border text-sm border-[#eee] dark:border-strokedark">
                                                            <div
                                                                className={
                                                                    "block w-full mx-auto text-center"
                                                                }
                                                            >
                                                                {i + 1}
                                                            </div>
                                                        </td>
                                                        <td className="border text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                            <DatePicker
                                                                required
                                                                selected={
                                                                    dO.DATE_OF_LEAVE
                                                                }
                                                                onChange={(
                                                                    date: any
                                                                ) =>
                                                                    inputDailyOff(
                                                                        date.toLocaleDateString(
                                                                            "en-CA"
                                                                        ),
                                                                        i
                                                                    )
                                                                }
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dateFormat={
                                                                    "dd-MM-yyyy"
                                                                }
                                                                placeholderText="dd-mm-yyyyy"
                                                                className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                            />
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
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
                                                                        deleteRowDailyOff(
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
                                            {selectedType.TIME_OFF_TYPE_ID ==
                                                "1" ||
                                            (selectedType.TIME_OFF_TYPE_ID !=
                                                "2" &&
                                                selectedType.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE ==
                                                    "1") ? (
                                                ""
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className=" h-10 w-40 mb-2 mt-2"
                                                    >
                                                        <a
                                                            href=""
                                                            className="text-xs mt-1 text-white ms-1 py-1.5 px-2 bg-red-500 rounded-md"
                                                            onClick={(e) =>
                                                                addRowDailyOff(
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            + Add Date
                                                        </a>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="relative mt-4">
                                <label
                                    // htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Subtitute PIC
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataRequestTimeOff.SUBSTITUTE_PIC}
                                    onChange={(e) =>
                                        inputTimeOff(
                                            "SUBSTITUTE_PIC",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {dataSubtitute
                                        ? dataSubtitute.map(
                                              (item: any, i: number) => {
                                                  return (
                                                      <option
                                                          key={i}
                                                          value={
                                                              item.EMPLOYEE_ID
                                                          }
                                                      >
                                                          {
                                                              item.EMPLOYEE_FIRST_NAME
                                                          }
                                                      </option>
                                                  );
                                              }
                                          )
                                        : ""}
                                </select>
                            </div>
                            {dataRequestTimeOff.SUBSTITUTE_PIC && (
                                <div className="relative mt-4">
                                    <label
                                        // htmlFor="available_time_off"
                                        className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                        Second Subtitute PIC
                                    </label>
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataRequestTimeOff.SECOND_SUBSTITUTE_PIC
                                        }
                                        onChange={(e) =>
                                            inputTimeOff(
                                                "SECOND_SUBSTITUTE_PIC",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value={""}>
                                            -- <i>Choose One</i> --
                                        </option>
                                        {dataSubtitute
                                            ? dataSubtitute
                                                  ?.filter(
                                                      (dataSecond: any) =>
                                                          dataSecond.EMPLOYEE_ID !=
                                                          dataRequestTimeOff.SUBSTITUTE_PIC
                                                  )
                                                  .map(
                                                      (
                                                          item: any,
                                                          i: number
                                                      ) => {
                                                          return (
                                                              <option
                                                                  key={i}
                                                                  value={
                                                                      item.EMPLOYEE_ID
                                                                  }
                                                              >
                                                                  {
                                                                      item.EMPLOYEE_FIRST_NAME
                                                                  }
                                                              </option>
                                                          );
                                                      }
                                                  )
                                            : ""}
                                    </select>
                                </div>
                            )}

                            <div className="mt-3">
                                <InputLabel
                                    value="File Upload"
                                    // required={true}
                                />
                                <Input
                                    type="file"
                                    onChange={(e: any) => {
                                        inputTimeOff(
                                            "FILE_ID",
                                            e.target.files[0]
                                        );
                                    }}
                                    className="mt-1 bg-white ring-white shadow-xl"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label
                                    htmlFor="DESCRIPTION"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="DESCRIPTION"
                                    name="DESCRIPTION"
                                    // readOnly
                                    value={dataRequestTimeOff.DESCRIPTION}
                                    onChange={(e: any) => {
                                        inputTimeOff(
                                            "DESCRIPTION",
                                            e.target.value
                                        );
                                    }}
                                    className="resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative mt-4">
                                    <label
                                        htmlFor="request_date"
                                        className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                        Request Date
                                    </label>
                                    <input
                                        id="request_date"
                                        name="request_date"
                                        type="text"
                                        readOnly
                                        value={dateFormat(
                                            new Date(),
                                            "dd-mm-yyyy"
                                        )}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div className="relative mt-4">
                                    <label
                                        // htmlFor="available_time_off"
                                        className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                        Request To
                                    </label>
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataRequestTimeOff.REQUEST_TO}
                                        onChange={(e) =>
                                            inputTimeOff(
                                                "REQUEST_TO",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value={""}>
                                            -- <i>Choose One</i> --
                                        </option>
                                        {dataRequestTo.map(
                                            (item: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={item.EMPLOYEE_ID}
                                                    >
                                                        {
                                                            item.EMPLOYEE_FIRST_NAME
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />

            <ModalToAction
                buttonAddOns={
                    editRequestTimeOff.STATUS == 0 ? "Cancel Request" : null
                }
                actionDelete={cancelRequestTimeOff}
                show={modal.modalEditRequestTimeOff}
                onClose={() =>
                    setModal({
                        modalEditRequestTimeOff: false,
                    })
                }
                headers={null}
                submitButtonName={
                    editRequestTimeOff.STATUS == 0 ? "Edit" : null
                }
                cancelButtonName={"Close"}
                title={"Edit Request Time Off"}
                url={`/editRequestTimeOff`}
                method={"post"}
                data={editRequestTimeOff}
                onSuccess={handleSuccessRequestTimeOff}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div>
                            <div className="relative mt-2">
                                <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={employee.EMPLOYEE_FIRST_NAME}
                                    readOnly
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="division"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Division
                                </label>
                                <input
                                    id="division"
                                    name="division"
                                    type="text"
                                    readOnly
                                    value={
                                        employee
                                            ? employee.division
                                                  .COMPANY_DIVISION_NAME
                                            : null
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="total_time_off_used"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Total Time Off Used
                                </label>
                                <input
                                    id="total_time_off_used"
                                    name="total_time_off_used"
                                    type="text"
                                    readOnly
                                    value={
                                        timeOffUsed + " / " + timeOffAvailable
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Available Time Off
                                </label>
                                <input
                                    id="available_time_off"
                                    name="available_time_off"
                                    type="text"
                                    readOnly
                                    value={timeOffAvailable - timeOffUsed}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    // htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Type of Request
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={editRequestTimeOff.TIME_OFF_TYPE_ID}
                                    onChange={(e) =>
                                        editTimeOff(
                                            "TIME_OFF_TYPE_ID",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {timeOffTipes.map(
                                        (item: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        item.TIME_OFF_TYPE_ID
                                                    }
                                                >
                                                    {item.TIME_OFF_TYPE_NAME}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            {!selectedTypeForEdit ? (
                                ""
                            ) : selectedTypeForEdit.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE ==
                              "1" ? (
                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH +
                                                " Month + " +
                                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY +
                                                " Day(s)"
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  !selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH +
                                                " Month (s) "
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : !selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Not Reduce Leave By
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="text"
                                            readOnly
                                            value={
                                                selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY +
                                                " Day(s)"
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : !selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                                  !selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY ? (
                                    <div className="relative mt-4">
                                        <label
                                            htmlFor="available_time_off"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Total Time Off
                                        </label>
                                        <input
                                            id="available_time_off"
                                            name="available_time_off"
                                            type="number"
                                            // readOnly
                                            value={fieldTotalTimeOff}
                                            onChange={(e: any) => {
                                                setFieldTotalTimeOff(
                                                    e.target.value
                                                );
                                            }}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}

                            {!selectedTypeForEdit ? (
                                ""
                            ) : selectedTypeForEdit.TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH &&
                              selectedTypeForEdit.TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE ==
                                  1 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative mt-8">
                                        <label
                                            htmlFor="start_date"
                                            className="absolute -top-4 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Start
                                        </label>
                                        <DatePicker
                                            selected={fieldStartDate}
                                            onChange={(date: any) =>
                                                inputDailyOff(
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                                    1
                                                )
                                            }
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyyy"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative mt-8">
                                        <label
                                            htmlFor="end_date"
                                            className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                        >
                                            Until
                                        </label>
                                        <input
                                            id="end_date"
                                            name="end_date"
                                            type="text"
                                            value={
                                                fieldEndDate &&
                                                dateFormat(
                                                    fieldEndDate,
                                                    "dd-mm-yyyy"
                                                )
                                            }
                                            readOnly
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}

                            {editRequestTimeOff.request_time_off && (
                                <div className="relative mt-4">
                                    <table className="table-fixed w-full mb-4">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    rowSpan={2}
                                                    scope="col"
                                                    className="w-4 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
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
                                                <th
                                                    rowSpan={2}
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {editRequestTimeOff.request_time_off.map(
                                                (dO: any, i: number) => (
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
                                                            <DatePicker
                                                                selected={
                                                                    dO.DATE_OF_LEAVE
                                                                }
                                                                onChange={(
                                                                    date: any
                                                                ) =>
                                                                    editDailyOff(
                                                                        date.toLocaleDateString(
                                                                            "en-CA"
                                                                        ),
                                                                        i
                                                                    )
                                                                }
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dateFormat={
                                                                    "dd-MM-yyyy"
                                                                }
                                                                placeholderText="dd-mm-yyyyy"
                                                                className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                            />
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm  sm:pr-3 border-[1px]">
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
                                                                        deleteRowDailyOff(
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
                                                    colSpan={3}
                                                    className=" h-10 w-40 mb-2 mt-2"
                                                >
                                                    <a
                                                        href=""
                                                        className="text-xs mt-1 text-white ms-1 py-1.5 px-2 bg-red-500 rounded-md"
                                                        onClick={(e) =>
                                                            addRowDailyOff(e)
                                                        }
                                                    >
                                                        + Add Date
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="relative mt-4">
                                <label className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900">
                                    Subtitute PIC
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={editRequestTimeOff.SUBSTITUTE_PIC}
                                    onChange={(e) =>
                                        editTimeOff(
                                            "SUBSTITUTE_PIC",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {dataSubtitute
                                        ? dataSubtitute.map(
                                              (item: any, i: number) => {
                                                  return (
                                                      <option
                                                          key={i}
                                                          value={
                                                              item.EMPLOYEE_ID
                                                          }
                                                      >
                                                          {
                                                              item.EMPLOYEE_FIRST_NAME
                                                          }
                                                      </option>
                                                  );
                                              }
                                          )
                                        : ""}
                                </select>
                            </div>
                            {editRequestTimeOff.SUBSTITUTE_PIC && (
                                <div className="relative mt-4">
                                    <label className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900">
                                        Second Subtitute PIC
                                    </label>
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            editRequestTimeOff.SECOND_SUBSTITUTE_PIC
                                        }
                                        onChange={(e) =>
                                            editTimeOff(
                                                "SECOND_SUBSTITUTE_PIC",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value={""}>
                                            -- <i>Choose One</i> --
                                        </option>
                                        {dataSubtitute
                                            ? dataSubtitute
                                                  ?.filter(
                                                      (dataSecond: any) =>
                                                          dataSecond.EMPLOYEE_ID !=
                                                          dataRequestTimeOff.SUBSTITUTE_PIC
                                                  )
                                                  .map(
                                                      (
                                                          item: any,
                                                          i: number
                                                      ) => {
                                                          return (
                                                              <option
                                                                  key={i}
                                                                  value={
                                                                      item.EMPLOYEE_ID
                                                                  }
                                                              >
                                                                  {
                                                                      item.EMPLOYEE_FIRST_NAME
                                                                  }
                                                              </option>
                                                          );
                                                      }
                                                  )
                                            : ""}
                                    </select>
                                </div>
                            )}

                            <div className="relative mt-4">
                                <label
                                    htmlFor="DESCRIPTION"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="DESCRIPTION"
                                    name="DESCRIPTION"
                                    // readOnly
                                    value={editRequestTimeOff.DESCRIPTION}
                                    onChange={(e: any) => {
                                        editTimeOff(
                                            "DESCRIPTION",
                                            e.target.value
                                        );
                                    }}
                                    className="resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative mt-4">
                                    <label
                                        htmlFor="request_date"
                                        className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                        Request Date
                                    </label>
                                    <input
                                        id="request_date"
                                        name="request_date"
                                        type="text"
                                        readOnly
                                        value={dateFormat(
                                            editRequestTimeOff.REQUEST_DATE,
                                            "dd-mm-yyyy"
                                        )}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div className="relative mt-4">
                                    <label
                                        // htmlFor="available_time_off"
                                        className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                        Request To
                                    </label>
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={editRequestTimeOff.REQUEST_TO}
                                        onChange={(e) =>
                                            editTimeOff(
                                                "REQUEST_TO",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value={""}>
                                            -- <i>Choose One</i> --
                                        </option>
                                        {dataRequestTo.map(
                                            (item: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={item.EMPLOYEE_ID}
                                                    >
                                                        {
                                                            item.EMPLOYEE_FIRST_NAME
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />

            {/* End Modal Request Time Off */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                handleRequestTimeOff();
                            }}
                        >
                            {"Request Time Off"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <DatePicker
                            required
                            selected={searchDate.time_off_search[0].DATE}
                            onChange={(date: any) => {
                                inputDataSearch(
                                    "DATE",
                                    date.toLocaleDateString("en-CA"),
                                    0
                                );
                                setSuccessSearch("success");
                                setTimeout(() => {
                                    setSuccessSearch("");
                                }, 1000);
                            }}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat={"dd-MM-yyyy"}
                            placeholderText="dd-mm-yyyyy"
                            className="border-0 rounded-md shadow-md ring-1 ring-inset ring-gray-300 px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchDate.time_off_search[0].DATE != ""
                                    ) {
                                        inputDataSearch(
                                            "DATE",
                                            searchDate.time_off_search[0].DATE,
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
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
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
                        </div>
                    </div>
                </div>

                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchDate.time_off_search}
                            // loading={isLoading.get_policy}
                            url={"getRequestTimeOffAgGrid"}
                            doubleClickEvent={handleEditModal}
                            triggeringRefreshData={successSearch}
                            colDefs={[
                                {
                                    headerName: "Request Date",
                                    flex: 3,
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
                                    headerName: "Description",
                                    flex: 4,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            if (params.data.DESCRIPTION ) {
                                                return params.data.DESCRIPTION;
                                            } else {
                                                return "-";
                                            }
                                        }
                                    },
                                },
                                {
                                    headerName: "Status",
                                    // field: "POLICY_STATUS_ID",
                                    flex: 3,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            if (params.data.STATUS == 0) {
                                                return "Waiting Approval";
                                            } else if (
                                                params.data.STATUS == 1
                                            ) {
                                                return "Rejected";
                                            } else {
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
