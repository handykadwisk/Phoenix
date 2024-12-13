import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailAttendanceSetting from "./DetailAttendanceSetting";
import axios from "axios";

export default function Index({ auth }: PageProps) {
    const { companies, employees, arrTime }: any = usePage().props;
    const attendanceType = [
        { ID: "0", NAME: "Fix Work Schedule" },
        { ID: "1", NAME: "Shift Work Schedule" },
    ];

    const getEmployeeById = (employeeId: any) => {
        // const dataCurr = currency;
        const result = employees.find(
            (id: any) => id.EMPLOYEE_ID == employeeId
        );
        return result
            ? result.EMPLOYEE_FIRST_NAME
            : // result.EMPLOYEE_MIDDLE_NAME != null
              //     ? result.EMPLOYEE_FIRST_NAME +
              //       " " +
              //       result.EMPLOYEE_MIDDLE_NAME +
              //       " " +
              //       result.EMPLOYEE_LAST_NAME
              //     : result.EMPLOYEE_LAST_NAME != null
              //     ? result.EMPLOYEE_FIRST_NAME + " " + result.EMPLOYEE_LAST_NAME
              //     : result.EMPLOYEE_FIRST_NAME
              null;
    };

    // State to store selected hour and minute
    const [hourTimeIn, setHourTimeIn] = useState("00");
    const [hourTimeOut, setHourTimeOut] = useState("00");
    const [hourBreakStart, setHourBreakStart] = useState("00");
    const [hourBreakEnd, setHourBreakEnd] = useState("00");
    const [minuteTimeIn, setMinuteTimeIn] = useState("00");
    const [minuteTimeOut, setMinuteTimeOut] = useState("00");
    const [minuteBreakStart, setMinuteBreakStart] = useState("00");
    const [minuteBreakEnd, setMinuteBreakEnd] = useState("00");

    // Generate the options for hours and minutes
    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
    ); // 00 to 23
    const minutes = Array.from({ length: 60 }, (_, i) =>
        String(i).padStart(2, "0")
    ); // 00 to 59

    const handleTimeChange = (val: string, name:string, field:string) => {
        // setHour(val);
        const data = { ...dataWorkAttendance };
        console.log("name: ", name, " value: ", val, " field: ", field);
        let time = "";
        if (name == "hourTimeIn") {
            time = val + ":" + minuteTimeIn;
            setHourTimeIn(val);
        } else if (name == "minuteTimeIn") {
            time = hourTimeIn + ":" + val;
            setMinuteTimeIn(val);
        } else if (name == "hourTimeOut") {
            time = val + ":" + minuteTimeOut;
            setHourTimeOut(val);
        } else if (name == "minuteTimeOut") {
            time = hourTimeOut + ":" + val;
            setMinuteTimeOut(val);
        } else if (name == "hourBreakStart") {
            time = val + ":" + minuteBreakStart;
            setHourBreakStart(val);
        } else if (name == "minuteBreakStart") {
            time = hourBreakStart + ":" + val;
            setMinuteBreakStart(val);
        } else if (name == "hourBreakEnd") {
            time = val + ":" + minuteBreakEnd;
            setHourBreakEnd(val);
        } else if (name == "minuteBreakEnd") {
            time = hourBreakEnd + ":" + val;
            setMinuteBreakEnd(val);
        }
        console.log("time: ", time);

        data[field] = time
        setDataWorkAttendance(data);
        
    };

    // const handleHourChange = (event:any) => {
    //     setHour(event.target.value);
    // };

    // const handleMinuteChange = (event:any) => {
    //     setMinute(event.target.value);
    // };

    const handleSelectCompany = (idCompany: string) => {
        mappingEmployeeToSettingAttendance(idCompany);
    };

    const getDivisionByEmployeeId = (employeeId: any) => {
        // const dataCurr = currency;
        const result = employees.find(
            (id: any) => id.EMPLOYEE_ID == employeeId
        );
        return result ? result.division.COMPANY_DIVISION_NAME : null;
    };

    const [dataAttendanceSetting, setDataAttendanceSetting] = useState<any>([]);

    const getDataAttendanceSetting = () => {
        axios
            .get(`/getAttendanceSetting`)
            .then((res) => {
                setDataAttendanceSetting(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Add Attendance Setting
    const [modal, setModal] = useState<any>({
        modalCreateWorkAttendce: false,
        modalViewWorkAttendce: false,
        modalSetPersonAttendce: false,
    });

    const fieldDataWorkAttendance = {
        ATTENDANCE_SETTING_ID: "",
        COMPANY_ID: "",
        ATTENDANCE_NAME: "",
        ATTENDANCE_EFFECTIVE_FROM: "",
        ATTENDANCE_EFFECTIVE_LAST: "",
        ATTENDANCE_TYPE: "",
        ATTENDANCE_WORKING_HOURS: "",
        ATTENDANCE_CHECK_IN_TIME: "",
        ATTENDANCE_CHECK_OUT_TIME: "",
        ATTENDANCE_BREAK_HOURS: "",
        ATTENDANCE_BREAK_START_TIME: "",
        ATTENDANCE_BREAK_END_TIME: "",
        ATTENDANCE_LATE_COMPENSATION: "",
        ATTENDANCE_EARLY_COMPENSATION: "",
        ATTENDANCE_MARKING: "",
        ATTENDANCE_DISTANCE_THRESHOLD: "",
        ATTENDANCE_LATITUDE_OFFICE: "",
        ATTENDANCE_LONGITUDE_OFFICE: "",
        ATTENDANCE_CREATED_DATE: "",
        ATTENDANCE_CREATED_BY: "",
        ATTENDANCE_STATUS: 0,
    };

    const [dataWorkAttendance, setDataWorkAttendance] = useState<any>({});

    const handleCreateWorkAttendance = () => {
        setDataWorkAttendance(fieldDataWorkAttendance);
        setModal({
            modalCreateWorkAttendce: !modal.modalCreateWorkAttendce,
        });
    };

    console.log("dataWorkAttendance: ", dataWorkAttendance);

    const handleSuccessAddWorkAttendance = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[0]);
            setDataWorkAttendance(fieldDataWorkAttendance);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    // End Attendance Setting

    // Set Person Attendance
    const [dataPersonAttendance, setDataPersonAttendance] = useState<any>([]);
    // get M Employee Attendance
    const mappingEmployeeToSettingAttendance = (idCompany: string) => {
        axios
            //  .get(`/mappingEmployeeToSettingAttendance`)
            .post(`/mappingEmployeeToSettingAttendance`, { idCompany })
            .then((res) => {
                setDataPersonAttendance(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log("dataPersonAttendance: ", dataPersonAttendance);

    const inputDataPersonAttendance = (name: string, value: any, i: number) => {
        const changeVal: any = [...dataPersonAttendance];

        changeVal[i][name] = value;
        setDataPersonAttendance(changeVal);
    };

    const handleSetPersonAttendance = () => {
        // mappingEmployeeToSettingAttendance();
        getDataAttendanceSetting();
        setModal({
            modalSetPersonAttendce: !modal.modalSetPersonAttendce,
        });
    };

    // End Set Person Attendance

    const [isSuccess, setIsSuccess] = useState<string>("");

    const [detailAttendanceSetting, setDetailAttendanceSetting] = useState<any>(
        {
            ATTENDANCE_SETTING_ID: "",
            COMPANY_ID: "",
        }
    );

    const handleDetailAttendanceSetting = async (data: any) => {
        setDetailAttendanceSetting({
            ATTENDANCE_SETTING_ID: data.ATTENDANCE_SETTING_ID,
            COMPANY_ID: data.COMPANY_ID,
        });

        setModal({
            modalCreateWorkAttendce: false,
            modalViewWorkAttendce: !modal.modalViewWorkAttendce,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Attendance Setting"}>
            <Head title="Attendance Setting" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Add Work Attendance */}

            <ModalToAdd
                buttonAddOns={""}
                show={modal.modalCreateWorkAttendce}
                onClose={() =>
                    setModal({
                        modalCreateWorkAttendce: false,
                    })
                }
                title={"Create Work Attendance"}
                url={`/addWorkAttendance`}
                data={dataWorkAttendance}
                onSuccess={handleSuccessAddWorkAttendance}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div className="mb-2">
                            {/* <div>
                                <label htmlFor="hour">Hour </label>
                                <select
                                    id="hour"
                                    className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={hour}
                                    onChange={handleHourChange}
                                >
                                    {hours.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="minute">Minute </label>
                                <select
                                    id="minute"
                                    className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={minute}
                                    onChange={handleMinuteChange}
                                >
                                    {minutes.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>

                                <div>
                                    Selected Time: {hour}:{minute}
                                </div>
                            </div> */}
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Company Name"}
                                    />
                                    <div className="ml-[7.5rem] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataWorkAttendance.COMPANY_ID}
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                COMPANY_ID: e.target.value,
                                            });
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- <i>Choose Company Name</i> --
                                        </option>
                                        {companies.map(
                                            (company: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            company.COMPANY_ID
                                                        }
                                                    >
                                                        {company.COMPANY_NAME}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Attendance Name"}
                                    />
                                    <div className="ml-[8.3rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_NAME: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Attendance Name"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Attendance Type"}
                                    />
                                    <div className="ml-[9rem] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_TYPE
                                        }
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_TYPE: e.target.value,
                                            });
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- <i>Choose Attendance Type</i> --
                                        </option>
                                        {attendanceType.map(
                                            (type: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={type.ID}
                                                    >
                                                        {type.NAME}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Effective Date"}
                                    />
                                    <div className="ml-[6.2rem] text-red-600">
                                        *
                                    </div>
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
                                            selected={
                                                dataWorkAttendance.ATTENDANCE_EFFECTIVE_FROM
                                            }
                                            onChange={(date: any) =>
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_EFFECTIVE_FROM:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyyy"
                                            className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                        />
                                    </div>
                                </div>
                                <div className="relative hidden">
                                    <InputLabel
                                        className="absolute"
                                        value={"Effective Last"}
                                    />
                                    <div className="relative max-w-sm mt-6">
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
                                            selected={
                                                dataWorkAttendance.ATTENDANCE_EFFECTIVE_LAST
                                            }
                                            onChange={(date: any) =>
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_EFFECTIVE_LAST:
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
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Check In Time"}
                                    />
                                    <div className="ml-[6.4rem] text-red-600">
                                        *
                                    </div>
                                    <div>
                                        {/* <label
                                            htmlFor="hour"
                                            className="text-sm"
                                        >
                                            Hour{" "}
                                        </label> */}
                                        <select
                                            id="hourTimeIn"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            // value={hour}
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_IN_TIME &&
                                                dataWorkAttendance.ATTENDANCE_CHECK_IN_TIME.split(
                                                    ":"
                                                )[0]
                                            }
                                            // .split("/")[1]
                                            // onChange={handleHourChange}
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "hourTimeIn",
                                                    "ATTENDANCE_CHECK_IN_TIME"
                                                );
                                            }}
                                        >
                                            {hours.map((h) => (
                                                <option key={h} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>

                                        {/* <label
                                            htmlFor="minute"
                                            className="ml-4 text-sm"
                                        >
                                            Minute{" "}
                                        </label> */}
                                        <select
                                            id="minuteTimeIn"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            // value={minute}
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_IN_TIME &&
                                                dataWorkAttendance.ATTENDANCE_CHECK_IN_TIME.split(
                                                    ":"
                                                )[1]
                                            }
                                            // onChange={handleMinuteChange}
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "minuteTimeIn",
                                                    "ATTENDANCE_CHECK_IN_TIME"
                                                );
                                            }}
                                        >
                                            {minutes.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="relative w-24">
                                        <select
                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_IN_TIME
                                            }
                                            onChange={(e) => {
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_CHECK_IN_TIME:
                                                        e.target.value,
                                                });
                                            }}
                                        >
                                            <option value={""}>--:--</option>
                                            {arrTime.map(
                                                (time: any, i: number) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={time.id}
                                                        >
                                                            {time.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div> */}
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Check Out Time"}
                                    />
                                    <div className="ml-[7.2rem] text-red-600">
                                        *
                                    </div>
                                    <div>
                                        <select
                                            id="hourTimeOut"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_OUT_TIME &&
                                                dataWorkAttendance.ATTENDANCE_CHECK_OUT_TIME.split(
                                                    ":"
                                                )[0]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "hourTimeOut",
                                                    "ATTENDANCE_CHECK_OUT_TIME"
                                                );
                                            }}
                                        >
                                            {hours.map((h) => (
                                                <option key={h} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            id="minuteTimeOut"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_OUT_TIME &&
                                                dataWorkAttendance.ATTENDANCE_CHECK_OUT_TIME.split(
                                                    ":"
                                                )[1]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "minuteTimeOut",
                                                    "ATTENDANCE_CHECK_OUT_TIME"
                                                );
                                            }}
                                        >
                                            {minutes.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="relative w-24">
                                        <select
                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_CHECK_OUT_TIME
                                            }
                                            onChange={(e) => {
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_CHECK_OUT_TIME:
                                                        e.target.value,
                                                });
                                            }}
                                        >
                                            <option value={""}>--:--</option>
                                            {arrTime.map(
                                                (time: any, i: number) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={time.id}
                                                        >
                                                            {time.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Late Compensation"}
                                    />
                                    <div className="ml-[9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="number"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_LATE_COMPENSATION
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_LATE_COMPENSATION:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Minute"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Early Compensation"}
                                    />
                                    <div className="ml-[9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="number"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_EARLY_COMPENSATION
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_EARLY_COMPENSATION:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Minute"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className=""
                                        value={"Break Time Start"}
                                    />
                                    <div>
                                        <select
                                            id="hourBreakStart"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_START_TIME &&
                                                dataWorkAttendance.ATTENDANCE_BREAK_START_TIME.split(
                                                    ":"
                                                )[0]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "hourBreakStart",
                                                    "ATTENDANCE_BREAK_START_TIME"
                                                );
                                            }}
                                        >
                                            {hours.map((h) => (
                                                <option key={h} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            id="minuteBreakStart"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_START_TIME &&
                                                dataWorkAttendance.ATTENDANCE_BREAK_START_TIME.split(
                                                    ":"
                                                )[1]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "minuteBreakStart",
                                                    "ATTENDANCE_BREAK_START_TIME"
                                                );
                                            }}
                                        >
                                            {minutes.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="relative w-24">
                                        <select
                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_START_TIME
                                            }
                                            onChange={(e) => {
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_BREAK_START_TIME:
                                                        e.target.value,
                                                });
                                            }}
                                        >
                                            <option value={""}>--:--</option>
                                            {arrTime.map(
                                                (time: any, i: number) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={time.id}
                                                        >
                                                            {time.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div> */}
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className=""
                                        value={"Break Time End"}
                                    />
                                    <div>
                                        <select
                                            id="hourBreakEnd"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_END_TIME &&
                                                dataWorkAttendance.ATTENDANCE_BREAK_END_TIME.split(
                                                    ":"
                                                )[0]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "hourBreakEnd",
                                                    "ATTENDANCE_BREAK_END_TIME"
                                                );
                                            }}
                                        >
                                            {hours.map((h) => (
                                                <option key={h} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            id="minuteBreakEnd"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_END_TIME &&
                                                dataWorkAttendance.ATTENDANCE_BREAK_END_TIME.split(
                                                    ":"
                                                )[1]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "minuteBreakEnd",
                                                    "ATTENDANCE_BREAK_END_TIME"
                                                );
                                            }}
                                        >
                                            {minutes.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="relative w-24">
                                        <select
                                            className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataWorkAttendance.ATTENDANCE_BREAK_END_TIME
                                            }
                                            onChange={(e) => {
                                                setDataWorkAttendance({
                                                    ...dataWorkAttendance,
                                                    ATTENDANCE_BREAK_END_TIME:
                                                        e.target.value,
                                                });
                                            }}
                                        >
                                            <option value={""}>--:--</option>
                                            {arrTime.map(
                                                (time: any, i: number) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={time.id}
                                                        >
                                                            {time.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Latitude Office"}
                                    />
                                    <div className="ml-[7rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_LATITUDE_OFFICE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_LATITUDE_OFFICE:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Latitude Office"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Longitude Office"}
                                    />
                                    <div className="ml-[7.4rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            dataWorkAttendance.ATTENDANCE_LONGITUDE_OFFICE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataWorkAttendance({
                                                ...dataWorkAttendance,
                                                ATTENDANCE_LONGITUDE_OFFICE:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Longitude Office"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                }
            />

            {/* End Modal Add Work Attendance */}

            {/* Detail Attendance Setting */}
            <ModalToAction
                show={modal.modalViewWorkAttendce}
                onClose={() =>
                    setModal({
                        modalCreateWorkAttendce: false,
                        modalViewWorkAttendce: false,
                    })
                }
                title={detailAttendanceSetting.COMPANY_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailAttendanceSetting
                            isSuccess={isSuccess}
                            attendanceSettingId={
                                detailAttendanceSetting.ATTENDANCE_SETTING_ID
                            }
                            setIsSuccess={setIsSuccess}
                            setDetailCompanyNew={setDetailAttendanceSetting}
                            attendanceType={attendanceType}
                            companies={companies}
                            // arrTime={arrTime}
                        />
                    </>
                }
            />

            {/* End Detail Attendance setting */}

            {/* Modal Set Person Attendance */}

            <ModalToAdd
                buttonAddOns={""}
                show={modal.modalSetPersonAttendce}
                onClose={() => {
                    setModal({
                        modalSetPersonAttendce: false,
                    }),
                        setDataPersonAttendance([]);
                }}
                title={"Set Person Attendance"}
                url={`/addPersonAttendance`}
                data={dataPersonAttendance}
                onSuccess={handleSetPersonAttendance}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div className="grid grid-cols-6 gap-4 ml-4 mb-3 mt-3 mr-4">
                            <div className="">
                                <span>Company Name : </span>
                            </div>
                            <div className=" col-span-5">
                                <span className="font-normal text-gray-500">
                                    <select
                                        className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        // value={data.ATTENDANCE_TYPE}
                                        onChange={(e) => {
                                            handleSelectCompany(e.target.value);
                                        }}
                                    >
                                        <option value={""}>
                                            -- <i>Choose</i> --
                                        </option>
                                        {companies.map(
                                            (company: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            company.COMPANY_ID
                                                        }
                                                    >
                                                        {company.COMPANY_NAME}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 mb-4">
                            {/* <div className="shadow-md border-2 mt-3"> */}
                            <div className=" ml-4 mr-4 mb-4 mt-3">
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                    <table className="table-auto w-full">
                                        <thead className="border-b bg-gray-50">
                                            <tr className="text-sm font-semibold text-gray-900">
                                                <th className="text-center md:p-4 p-0 md:w-20 w-10 border-r border-gray-300">
                                                    No
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Employee
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Division
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Attendance Type
                                                </th>
                                                <th className="text-center md:p-4 p-0 md:w-52  border-r border-gray-300 ">
                                                    Auto Set To
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataPersonAttendance.map(
                                                (data: any, j: number) => (
                                                    <tr key={j}>
                                                        <td className="p-4 border">
                                                            <div className="block w-full mx-auto text-center">
                                                                {j + 1}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 border">
                                                            <div className="block w-full mx-auto text-left">
                                                                {getEmployeeById(
                                                                    data.EMPLOYEE_ID
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 border">
                                                            <div className="block w-full mx-auto text-left">
                                                                {getDivisionByEmployeeId(
                                                                    data.EMPLOYEE_ID
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 border">
                                                            <select
                                                                className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                value={
                                                                    data.ATTENDANCE_TYPE
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    inputDataPersonAttendance(
                                                                        "ATTENDANCE_TYPE",
                                                                        e.target
                                                                            .value,
                                                                        j
                                                                    );
                                                                }}
                                                            >
                                                                <option
                                                                    value={""}
                                                                >
                                                                    --{" "}
                                                                    <i>
                                                                        Choose
                                                                    </i>{" "}
                                                                    --
                                                                </option>
                                                                {attendanceType.map(
                                                                    (
                                                                        type: any,
                                                                        i: number
                                                                    ) => {
                                                                        return (
                                                                            <option
                                                                                key={
                                                                                    i
                                                                                }
                                                                                value={
                                                                                    type.ID
                                                                                }
                                                                            >
                                                                                {
                                                                                    type.NAME
                                                                                }
                                                                            </option>
                                                                        );
                                                                    }
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td className="p-4 border">
                                                            <select
                                                                className="block w-full mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                value={
                                                                    data.ATTENDANCE_SETTING_ID
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    inputDataPersonAttendance(
                                                                        "ATTENDANCE_SETTING_ID",
                                                                        e.target
                                                                            .value,
                                                                        j
                                                                    );
                                                                }}
                                                            >
                                                                <option
                                                                    value={""}
                                                                >
                                                                    --{" "}
                                                                    <i>
                                                                        Choose
                                                                    </i>{" "}
                                                                    --
                                                                </option>
                                                                {data.ATTENDANCE_TYPE ==
                                                                    0 ||
                                                                data.ATTENDANCE_TYPE ==
                                                                    1
                                                                    ? dataAttendanceSetting
                                                                          ?.filter(
                                                                              (
                                                                                  list: any
                                                                              ) =>
                                                                                  list.ATTENDANCE_TYPE ==
                                                                                  data.ATTENDANCE_TYPE
                                                                          )
                                                                          .map(
                                                                              (
                                                                                  result: any,
                                                                                  i: number
                                                                              ) => {
                                                                                  return (
                                                                                      <option
                                                                                          key={
                                                                                              i
                                                                                          }
                                                                                          value={
                                                                                              result?.ATTENDANCE_SETTING_ID
                                                                                          }
                                                                                      >
                                                                                          {
                                                                                              result?.ATTENDANCE_NAME
                                                                                          }
                                                                                      </option>
                                                                                  );
                                                                              }
                                                                          )
                                                                    : ""}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 "></div>
                            </div>
                            {/* </div> */}
                        </div>
                    </>
                }
            />

            {/* End Modal Set Person Attendance */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                handleCreateWorkAttendance();
                            }}
                        >
                            {"Register Work Attendance"}
                        </Button>
                        <Button
                            className="p-2 mt-4"
                            onClick={() => {
                                handleSetPersonAttendance();
                            }}
                        >
                            {"Set Person Attendance"}
                        </Button>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={null}
                            // loading={isLoading.get_policy}
                            url={"getAttendanceSetting"}
                            doubleClickEvent={handleDetailAttendanceSetting}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 2,
                                },
                                {
                                    headerName: "Company",
                                    field: "COMPANY_NAME",
                                    flex: 7,
                                },
                                {
                                    headerName: "Attendance Name",
                                    field: "ATTENDANCE_NAME",
                                    flex: 7,
                                },
                                {
                                    headerName: "Work Type",
                                    field: "ATTENDANCE_TYPE_NAME",
                                    flex: 4,
                                },
                                {
                                    headerName: "Check In",
                                    field: "ATTENDANCE_CHECK_IN_TIME",
                                    flex: 4,
                                },
                                {
                                    headerName: "Check Out",
                                    field: "ATTENDANCE_CHECK_OUT_TIME",
                                    flex: 4,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
