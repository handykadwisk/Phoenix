import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { useEffect, useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DetailAttendanceSetting from "./DetailAttendanceSetting";
import axios from "axios";
import dateFormat from "dateformat";

export default function Index({ auth }: PageProps) {
    const { timeOffTipes }: any = usePage().props;
    
    const employee:any = auth.user.employee;
    // console.log("auth.user: ", auth.user);

    console.log("employee: ", employee);

    useEffect(() => {
        // alert("ads");
        getSubtitute();
        getRequestTo()
    }, [employee]);



    const [dataSubtitute, setDataSubtitute] = useState<any>([]);
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
                setDataSubtitute(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log("dataSubtitute: ", dataSubtitute);




    // Request Time Off
    const [modal, setModal] = useState<any>({
        modalRequestTimeOff: false,
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
    };

    const [dataRequestTimeOff, setDataRequestTimeOff] = useState<any>({});

    const handleRequestTimeOff = () => {
        const items = { ...fieldDataRequestTimeOff };
        items["EMPLOYEE_ID"] = employee.EMPLOYEE_ID;
        setDataRequestTimeOff(items);
        setModal({
            modalRequestTimeOff: !modal.modalRequestTimeOff,
        });
    };

    console.log("dataRequestTimeOff: ", dataRequestTimeOff);

    const handleSuccessRequestTimeOff = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[0]);
            setDataRequestTimeOff(fieldDataRequestTimeOff);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    // End Request Time Off

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

    const inputDataPersonAttendance = (name: string, value: any, i: number) => {
        const changeVal: any = [...dataPersonAttendance];

        changeVal[i][name] = value;
        setDataPersonAttendance(changeVal);
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
            modalRequestTimeOff: false,
            modalViewWorkAttendce: !modal.modalViewWorkAttendce,
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
                                    value={
                                        employee
                                            ? employee.EMPLOYEE_MIDDLE_NAME !=
                                              null
                                                ? employee.EMPLOYEE_FIRST_NAME +
                                                  " " +
                                                  employee.EMPLOYEE_MIDDLE_NAME +
                                                  " " +
                                                  employee.EMPLOYEE_LAST_NAME
                                                : employee.EMPLOYEE_LAST_NAME !=
                                                  null
                                                ? employee.EMPLOYEE_FIRST_NAME +
                                                  " " +
                                                  employee.EMPLOYEE_LAST_NAME
                                                : employee.EMPLOYEE_FIRST_NAME
                                            : null
                                    }
                                    readOnly
                                    // placeholder="Jane Smith"
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
                                    // placeholder="Jane Smith"
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
                                    value={"4/12"}
                                    // placeholder="Jane Smith"
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
                                    value={"8"}
                                    // placeholder="Jane Smith"
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
                                    // onChange={(e) =>
                                    //     inputClockIn(
                                    //         "EMPLOYEE_ATTENDANCE_LOCATION_TYPE",
                                    //         e.target.value
                                    //     )
                                    // }
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
                            <div className="relative mt-4">
                                <label
                                    // htmlFor="available_time_off"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Subtitute PIC
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    // value={
                                    //     data.EMPLOYEE_ATTENDANCE_LOCATION_TYPE
                                    // }
                                    // onChange={(e) =>
                                    //     inputClockIn(
                                    //         "EMPLOYEE_ATTENDANCE_LOCATION_TYPE",
                                    //         e.target.value
                                    //     )
                                    // }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {dataSubtitute ? dataSubtitute.map(
                                        (item: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={item.EMPLOYEE_ID}
                                                >
                                                    {item
                                                        ? item.EMPLOYEE_MIDDLE_NAME !=
                                                          null
                                                            ? item.EMPLOYEE_FIRST_NAME +
                                                              " " +
                                                              item.EMPLOYEE_MIDDLE_NAME +
                                                              " " +
                                                              item.EMPLOYEE_LAST_NAME
                                                            : item.EMPLOYEE_LAST_NAME !=
                                                              null
                                                            ? item.EMPLOYEE_FIRST_NAME +
                                                              " " +
                                                              item.EMPLOYEE_LAST_NAME
                                                            : item.EMPLOYEE_FIRST_NAME
                                                        : null}
                                                </option>
                                            );
                                        }
                                    ) : ""}
                                </select>
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="file_upload"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    File Upload
                                </label>
                                <input
                                    id="file_upload"
                                    name="file_upload"
                                    type="file"
                                    // readOnly
                                    // value={"8"}
                                    // placeholder="Jane Smith"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="description"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-medium text-gray-900"
                                >
                                    Description
                                </label>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    // readOnly
                                    // value={"8"}
                                    // placeholder="Jane Smith"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                                    value={"8"}
                                    // placeholder="Jane Smith"
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
                                    // value={
                                    //     data.EMPLOYEE_ATTENDANCE_LOCATION_TYPE
                                    // }
                                    // onChange={(e) =>
                                    //     inputClockIn(
                                    //         "EMPLOYEE_ATTENDANCE_LOCATION_TYPE",
                                    //         e.target.value
                                    //     )
                                    // }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {/* {locationType.map(
                                            (item: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={item.ID}
                                                    >
                                                        {item.NAME}
                                                    </option>
                                                );
                                            }
                                        )} */}
                                </select>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
