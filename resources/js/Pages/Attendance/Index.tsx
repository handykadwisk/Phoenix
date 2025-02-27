import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import Swal from "sweetalert2";
import SelectTailwind from "react-tailwindcss-select";
import dateFormat from "dateformat";
import AGGrid from "@/Components/AgGrid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Index({ auth }: PageProps) {
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [dataEmployeeAttendance, setDataEmployeeAttendance] = useState<any>({});
    const [dataMEmployeeAttendance, setDataMEmployeeAttendance] = useState<any>({});
    const [dataAttendanceSetting, setDataAttendanceSetting] = useState<any>({});
    const [successSearch, setSuccessSearch] = useState<string>("");

    const today = new Date();
    const yesterday = dateFormat(
        today.setDate(today.getDate() - 1),
        "yyyy-mm-dd"
    );
    console.log(
        "today: ",
        today,
        " yesterday: ",
        dateFormat(yesterday, "yyyy-mm-dd")
    );

    const [validation, setvalidation] = useState<boolean>(false);  

    const checkClockOut = (employeeId: string, date: any) => {
        axios
            .post(`/getAttendanceByEmployeeIdAndDate`, {
                employeeId,
                date,
            })
            .then((res) => {
                console.log("ada: ", res.data);
                const result = res.data;
                if (Object.keys(result).length > 0) {
                    if (result.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME) {
                        setvalidation(false);
                    } else {
                        setvalidation(true);
                    }
                    // console.log("ada: ", Object.keys(res.data).length);

                    
                } else {
                    console.log("tidak");
                    setvalidation(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getOffSiteReason()
        getUserLocation();
        getDataEmployeeAttendance(
            auth.user.employee.EMPLOYEE_ID,
            dateFormat(new Date(), "yyyy-mm-dd")
        );
        getDataMEmployeeAttendance(auth.user.employee.EMPLOYEE_ID);
        checkClockOut(auth.user.employee.EMPLOYEE_ID, yesterday);
    }, []);

    useEffect(() => {
        getDataAttendanceSetting(dataMEmployeeAttendance.ATTENDANCE_SETTING_ID);
        getAttendanceType(
            dataMEmployeeAttendance.ATTENDANCE_TYPE,
            auth.user.employee.COMPANY_ID
        );
    }, [dataMEmployeeAttendance]);

    const [isSuccess, setIsSuccess] = useState<string>("");
    const [dataClockOut, setDataClockOut] = useState<any>({
        EMPLOYEE_ATTENDANCE_ID: "",
        ATTENDANCE_SETTING_ID: "",
        EMPLOYEE_ID: "",
        EMPLOYEE_ATTENDANCE_CHECK_IN_DATE: "",
        EMPLOYEE_ATTENDANCE_CHECK_IN_TIME: "",
        EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE: "",
        EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME: "",
        EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE: "",
        EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE: "",
        EMPLOYEE_ATTENDANCE_LOCATION_TYPE: "",
        EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN: "",
        EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT: "",
        EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE: "",
        LOCATION_DISTANCE: "",
    });

    const locationType = [
        { ID: "0", NAME: "On Site" },
        { ID: "1", NAME: "Off Site" },
    ];


    const [offSiteReason, setOffSiteReason] = useState<any>([]);
    const getOffSiteReason = async () => {
        await axios
            .get(`/getOffSiteReason`)
            .then((res) => setOffSiteReason(res.data))
            .catch((err) => console.log(err));
    };
    console.log("OFF_SITE_REASON_ID: ", offSiteReason);

    function toRad(value: any) {
        /** Converts numeric degrees to radians */
        return (value * Math.PI) / 180;
    }

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },

                (error) => {
                    setUserLocation(null);
                    console.error("Error get user location: ", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setUserLocation(null);
            console.log("Geolocation is not supported by this browser");
        }
    };

    const haversine = (lat1: any, lon1: any, lat2: any, lon2: any) => {
        // const r = 6371; // Earth's radius in kilometers
        const r = 6371000; // Earth's radius in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = r * c; // Distance in kilometers
        return d;
    };

    const { data, setData, errors, reset } = useForm<any>({
        ATTENDANCE_SETTING_ID: "",
        EMPLOYEE_ID: "",
        EMPLOYEE_ATTENDANCE_CHECK_IN_DATE: "",
        EMPLOYEE_ATTENDANCE_CHECK_IN_TIME: "",
        EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE: "",
        EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME: "",
        EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE: "",
        EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE: "",
        EMPLOYEE_ATTENDANCE_LOCATION_TYPE: "",
        OFF_SITE_REASON_ID: "",
        EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN: "",
        EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT: "",
        EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE: "",
        LOCATION_DISTANCE:"",
    });
    
    // Clock In
    const inputClockIn = (name: string, value: any) => {
        const items = { ...data };
        getUserLocation();
        const distance = haversine(
            dataAttendanceSetting.ATTENDANCE_LATITUDE_OFFICE,
            dataAttendanceSetting.ATTENDANCE_LONGITUDE_OFFICE,
            userLocation?.latitude,
            userLocation?.longitude
        );
        
        items[name] = value;
        items["EMPLOYEE_ATTENDANCE_CHECK_IN_TIME"] = dateFormat(new Date(), "HH:MM:ss");
        items["EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE"] = userLocation?.latitude;
        items["EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE"] = userLocation?.longitude;
        items["LOCATION_DISTANCE"] = distance;
        setData(items);
    }

    const handleClockIn = () => {
        getDataAttendanceSetting(dataMEmployeeAttendance.ATTENDANCE_SETTING_ID);
         getAttendanceType(
             dataMEmployeeAttendance.ATTENDANCE_TYPE,
             auth.user.employee.COMPANY_ID
         );
        getUserLocation();
        if (auth.user.employee) {
            const employee = auth.user.employee;
            setData({
                ...data,
                ATTENDANCE_SETTING_ID: dataMEmployeeAttendance.ATTENDANCE_SETTING_ID,
                EMPLOYEE_ID: employee.EMPLOYEE_ID,
                EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE: userLocation?.latitude,
                EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE: userLocation?.longitude,
                EMPLOYEE_ATTENDANCE_CHECK_IN_DATE: dateFormat(new Date(), "yyyy-mm-dd"),
                EMPLOYEE_ATTENDANCE_CHECK_IN_TIME: dateFormat(new Date(), "HH:MM:ss"),
            });
        }
        
        setModal({
            clockIn: true,
            clockOut: false,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    }

    console.log('data: ', data)
    
    // End Clock In


    const getDataEmployeeAttendance = (employeeId: string, date:string) => {
         axios
            .post(`/getAttendanceByEmployeeIdAndDate`, {
                employeeId,
                date,
            })
            .then((res) => {
                setDataEmployeeAttendance(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDataMEmployeeAttendance = (employeeId: string) => {
         axios
            .post(`/getMEmployeeAttendanceByEmployeeId`, {
                employeeId
            })
            .then((res) => {
                setDataMEmployeeAttendance(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDataAttendanceSetting = (attendanceSettingId: string) => {
        axios
            .post(`/getAttendanceSettingByIdForClockIn`, {
                attendanceSettingId,
            })
            .then((res) => {
                console.log("asdfsad: ", res.data);
                setDataAttendanceSetting(res.data[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [dataAttendanceType, setdataAttendanceType] = useState<any>([]);
    const getAttendanceType = (attendanceType: string, companyId:string) => {
        axios
            .post(`/getAttendanceType`, {
                attendanceType,
                companyId,
            })
            .then((res) => {
                setdataAttendanceType(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    
    // Clock Out

    const getDataClockOut = () => {
        setDataClockOut({
            ...dataClockOut,
            EMPLOYEE_ATTENDANCE_ID: dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_ID,
            EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE: dateFormat(
                new Date(),
                "yyyy-mm-dd"
            ),
            EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME: dateFormat(
                new Date(),
                "HH:MM:ss"
            ),
        });
    }


    const handleClockOut = () => {
        getDataEmployeeAttendance(
            auth.user.employee.EMPLOYEE_ID,
            dateFormat(new Date(), "yyyy-mm-dd")
        );
        checkClockOut(auth.user.employee.EMPLOYEE_ID, yesterday);
        getDataClockOut();
        if (auth.user.employee) {
            const employee = auth.user.employee;
            setData({
                ...data,
                EMPLOYEE_ID: employee.EMPLOYEE_ID,
                EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE: dateFormat(new Date(), "yyyy-mm-dd"),
                EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME: dateFormat(new Date(), "HH:MM:ss"),
            });
        }
        
        setModal({
            clockIn: false,
            clockOut: true,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    }
    
    // End Clock Out

    const handleSuccessClockIn = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            reset();
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        reset();
        getDataEmployeeAttendance(
            auth.user.employee.EMPLOYEE_ID,
            dateFormat(new Date(), "yyyy-mm-dd")
        );        
        checkClockOut(auth.user.employee.EMPLOYEE_ID, yesterday);
    };
    const handleSuccessClockOut = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        resetDataClockOut();
        getDataEmployeeAttendance(
            auth.user.employee.EMPLOYEE_ID,
            dateFormat(new Date(), "yyyy-mm-dd")
        );
        checkClockOut(auth.user.employee.EMPLOYEE_ID, yesterday);
        // setData({
        //     RELATION_GROUP_NAME: "",
        //     RELATION_GROUP_DESCRIPTION: "",
        // });
    };

    const resetDataClockOut = () => {
        setDataClockOut({
            EMPLOYEE_ATTENDANCE_ID: "",
            ATTENDANCE_SETTING_ID: "",
            EMPLOYEE_ID: "",
            EMPLOYEE_ATTENDANCE_CHECK_IN_DATE: "",
            EMPLOYEE_ATTENDANCE_CHECK_IN_TIME: "",
            EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE: "",
            EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME: "",
            EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE: "",
            EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE: "",
            EMPLOYEE_ATTENDANCE_LOCATION_TYPE: "",
            EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN: "",
            EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT: "",
            EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE: "",
            LOCATION_DISTANCE: "",
        });
    }

    // Modal Button Handle
    const [modal, setModal] = useState({
        clockIn: false,
        clockOut: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const [dataEditCheckOut, setDataEditCheckOut] = useState<any>(null);
     const getAttendaceById = (attendanceId:string) => {
         axios
             .post(`/getAttendaceById`, {
                 attendanceId,
             })
             .then((res) => {
                 setDataEditCheckOut(res.data);
             })
             .catch((err) => {
                 console.log(err);
             });
     };
    
    const handleEditModal = (data: any) => {
        if (!data.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME ) {
            getAttendaceById(data.EMPLOYEE_ATTENDANCE_ID);

            setModal({
                clockIn: false,
                clockOut: false,
                edit: true,
                view: false,
                document: false,
                search: false,
            });
        }        
    };
    const [hourCheckOutTime, setHourCheckOutTime] = useState("00");
    const [minuteCheckOutTime, setMinuteCheckOutTime] = useState("00");

    // Generate the options for hours and minutes
    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
    ); // 00 to 23
    const minutes = Array.from({ length: 60 }, (_, i) =>
        String(i).padStart(2, "0")
    ); // 00 to 59

    const handleTimeChange = (val: string, name: string, field: string) => {
        const data = { ...dataEditCheckOut };
        
        let time = "";
        if (name == "hourCheckOutTime") {
            time = val + ":" + minuteCheckOutTime;
            setHourCheckOutTime(val);
        } else if (name == "minuteCheckOutTime") {
            time = hourCheckOutTime + ":" + val;
            setMinuteCheckOutTime(val);
        }
        
        data[field] = time;
        setDataEditCheckOut(data);
    };

    console.log("dataEditCheckOut: ", dataEditCheckOut);
    

    return (
        <AuthenticatedLayout user={auth.user} header={"Clock In"}>
            <Head title="Attendance" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Clock In */}
            <ModalToAdd
                show={modal.clockIn}
                buttonAddOns={""}
                onClose={() => {
                    setModal({
                        clockIn: false,
                        clockOut: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    }),
                        reset();
                }}
                title={"Clock In"}
                disableSubmit={
                    Object.keys(dataEmployeeAttendance).length <= 0
                        ? Object.keys(dataAttendanceSetting).length > 0
                            ? false
                            : true
                        : true
                }
                url={`/saveClockIn`}
                data={data}
                onSuccess={handleSuccessClockIn}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        {Object.keys(dataEmployeeAttendance).length <= 0 ? (
                            Object.keys(dataAttendanceSetting).length > 0 ? (
                                <div>
                                    <div className="mt-4 grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {/* {dateFormat(new Date(), "dd-mm-yyyy")} */}
                                                {dateFormat(
                                                    data.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                                    "dd-mm-yyyy"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Time</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {/* {dateFormat(new Date(), "HH:MM")} */}
                                                {
                                                    data.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {dataMEmployeeAttendance ? (
                                        dataMEmployeeAttendance.ATTENDANCE_SETTING_ID ==
                                            null ||
                                        dataMEmployeeAttendance.ATTENDANCE_SETTING_ID ==
                                            "" ? (
                                            <div className="mt-4 grid grid-cols-4 gap-4">
                                                <div className="">
                                                    <span>Attendance Type</span>
                                                </div>
                                                <div className="">
                                                    <select
                                                        className="block w-52 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            data.ATTENDANCE_SETTING_ID
                                                        }
                                                        onChange={(e) =>
                                                            inputClockIn(
                                                                "ATTENDANCE_SETTING_ID",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value={""}>
                                                            --{" "}
                                                            <i>
                                                                Choose
                                                                Attendance Type
                                                            </i>{" "}
                                                            --
                                                        </option>
                                                        {dataAttendanceType.map(
                                                            (
                                                                item: any,
                                                                i: number
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            item.ATTENDANCE_SETTING_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            item.ATTENDANCE_NAME
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        ""
                                    )}
                                    <div className="mt-4 grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Location Type</span>
                                        </div>
                                        <div className="">
                                            <select
                                                className="block w-52 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={
                                                    data.EMPLOYEE_ATTENDANCE_LOCATION_TYPE
                                                }
                                                onChange={(e) =>
                                                    inputClockIn(
                                                        "EMPLOYEE_ATTENDANCE_LOCATION_TYPE",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value={""}>
                                                    -- <i>Choose Location</i> --
                                                </option>
                                                {locationType.map(
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
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {data.EMPLOYEE_ATTENDANCE_LOCATION_TYPE ==
                                    1 ? (
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            <div className="">
                                                <span>Reason</span>
                                            </div>
                                            <div className="">
                                                <select
                                                    className="block w-52 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={
                                                        data.OFF_SITE_REASON_ID
                                                    }
                                                    onChange={(e) =>
                                                        inputClockIn(
                                                            "OFF_SITE_REASON_ID",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value={""}>
                                                        -- <i>Choose Reason</i>{" "}
                                                        --
                                                    </option>
                                                    {offSiteReason.map(
                                                        (
                                                            item: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    value={
                                                                        item.OFF_SITE_REASON_ID
                                                                    }
                                                                >
                                                                    {
                                                                        item.OFF_SITE_REASON_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN"
                                            value="Description"
                                        />
                                        <textarea
                                            rows={4}
                                            id="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN"
                                            name="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN"
                                            defaultValue={
                                                data.EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN
                                            }
                                            className={
                                                "resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 mt-2"
                                            }
                                            required={
                                                data.EMPLOYEE_ATTENDANCE_LOCATION_TYPE ==
                                                1
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e: any) =>
                                                setData({
                                                    ...data,
                                                    EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>No Attedance Setting</div>
                            )
                        ) : (
                            <div>Clock in already confirm.</div>
                        )}
                    </>
                }
            />
            {/* End Modal Clock In */}

            {/* Modal Clock Out */}

            <ModalToAdd
                show={modal.clockOut}
                buttonAddOns={""}
                onClose={() => {
                    setModal({
                        clockIn: false,
                        clockOut: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    resetDataClockOut();
                }}
                title={"Clock Out"}
                url={`/saveClockOut`}
                data={dataClockOut}
                // disableSubmit={false}
                onSuccess={handleSuccessClockOut}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                <div className="">
                                    <span>Date</span>
                                </div>
                                <div className=" col-span-3">
                                    <span className="font-normal text-gray-500">
                                        {dateFormat(
                                            dataClockOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE,
                                            "dd-mm-yyyy"
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                <div className="">
                                    <span>Time</span>
                                </div>
                                <div className=" col-span-3">
                                    <span className="font-normal text-gray-500">
                                        {
                                            dataClockOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT"
                                    value="Description"
                                />
                                <textarea
                                    rows={4}
                                    id="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT"
                                    name="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT"
                                    defaultValue={
                                        dataClockOut.EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT
                                    }
                                    className={
                                        "resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 mt-2"
                                    }
                                    onChange={(e: any) =>
                                        setDataClockOut({
                                            ...dataClockOut,
                                            EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />

            {/* End Modal Clock Out */}

            {/* Modal Clock Out */}

            <ModalToAdd
                show={modal.edit}
                buttonAddOns={""}
                onClose={() => {
                    setModal({
                        clockIn: false,
                        clockOut: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    setDataEditCheckOut(null);
                }}
                title={"Set Clock Out"}
                url={`/editCheckOut`}
                data={dataEditCheckOut}
                // disableSubmit={
                //     dataEditCheckOut
                //         ? data.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                //             ? true
                //             : false
                //         : false
                // }
                onSuccess={handleSuccessClockOut}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        {dataEditCheckOut ? (
                            <div>
                                <div className="mt-2 grid grid-cols-4 gap-4">
                                    <label className="block text-sm mt-1 font-bold text-gray-700">
                                        Clock In{" "}
                                    </label>
                                    <div className="relative ml-1">
                                        <span className="text-sm">
                                            {dateFormat(
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                                "dd-mm-yyyy"
                                            )}
                                        </span>
                                        {/* <DatePicker
                                            selected={
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE
                                            }
                                            onChange={(date: any) =>
                                                setDataEditCheckOut({
                                                    ...dataEditCheckOut,
                                                    EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE:
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
                                            className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        /> */}
                                    </div>
                                    <div className="col-span-2 ml-1">
                                        <span className="text-sm">
                                            {dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME.substr(
                                                0,
                                                5
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2 grid grid-cols-4 gap-4">
                                    <label className="block text-sm mt-2 font-bold text-gray-700">
                                        Clock Out{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative ">
                                        <DatePicker
                                            selected={
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE
                                            }
                                            onChange={(date: any) =>
                                                setDataEditCheckOut({
                                                    ...dataEditCheckOut,
                                                    EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE:
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
                                            className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            id="hourCheckOutTime"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME &&
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME.split(
                                                    ":"
                                                )[0]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "hourCheckOutTime",
                                                    "EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME"
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
                                            id="minuteCheckOutTime"
                                            className=" w-20 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME &&
                                                dataEditCheckOut.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME.split(
                                                    ":"
                                                )[1]
                                            }
                                            onChange={(e) => {
                                                handleTimeChange(
                                                    e.target.value,
                                                    "minuteCheckOutTime",
                                                    "EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME"
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
                                </div>

                                <div className="mt-3">
                                    <label className="block text-sm mt-2 font-bold text-gray-700">
                                        Description{" "}
                                    </label>
                                    <textarea
                                        rows={4}
                                        id="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT"
                                        name="EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT"
                                        defaultValue={
                                            dataEditCheckOut.EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT
                                        }
                                        className={
                                            "resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 mt-2"
                                        }
                                        onChange={(e: any) =>
                                            setDataEditCheckOut({
                                                ...dataEditCheckOut,
                                                EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </>
                }
            />

            {/* End Modal Clock Out */}

            <div className="">
                {/* <div className="col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem]"> */}
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 grid grid-cols-2 gap-4">
                        <div className="col-start-1 col-end-3 text-left ml-2">
                            Attendance
                        </div>
                        <div className="col-end-7 col-span-2 text-right mr-2">
                            {dateFormat(new Date(), "dd-mm-yyyy")}
                        </div>
                    </div>
                    {Object.keys(dataAttendanceSetting).length > 0 ? (
                        <>
                            <div>
                                <div className="px-4 py-5 sm:p-6">
                                    {/* Content goes here */}
                                    <div className="text-center mt-2">
                                        Working Hours
                                    </div>
                                    <div className="text-center mt-2">
                                        {dataAttendanceSetting.ATTENDANCE_CHECK_IN_TIME +
                                            " - " +
                                            dataAttendanceSetting.ATTENDANCE_CHECK_OUT_TIME}
                                    </div>
                                    <div className="grid grid-cols-2 text-center mt-2">
                                        <div>Clock In Time</div>
                                        <div>Clock Out Time</div>
                                    </div>
                                    <div className="grid grid-cols-2 text-center">
                                        <div>
                                            {
                                                dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME
                                            }
                                        </div>
                                        <div>
                                            {
                                                dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-4 sm:px-6">
                                    {dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME &&
                                    dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME ? (
                                        <div className="text-center">
                                            Complete
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 text-center">
                                            <div>
                                                {dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME ? (
                                                    ""
                                                ) : (
                                                    <Button
                                                        className="p-2"
                                                        onClick={() => {
                                                            handleClockIn();
                                                        }}
                                                    >
                                                        {"Clock In"}
                                                    </Button>
                                                )}
                                            </div>
                                            {Object.keys(dataEmployeeAttendance)
                                                .length > 0 ? (
                                                <div>
                                                    {dataEmployeeAttendance.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME ? (
                                                        ""
                                                    ) : (
                                                        <Button
                                                            className="p-2"
                                                            onClick={() => {
                                                                handleClockOut();
                                                            }}
                                                        >
                                                            {"Clock Out"}
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {validation ? (
                                <div className="bg-red-100 text-red-700 p-1 border text-center text-sm border-red-500">
                                    {"Anda belum melakukan Clock Out pada hari sebelumnya. Silahkan hubungi HRD dan lakukan Clock Out"+validation}
                                </div>
                            ) : (
                                ""
                            )}
                        </>
                    ) : (
                        <div className="text-center p-4">
                            No Attedance Setting
                        </div>
                    )}
                </div>
                {/* </div> */}
            </div>
            <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-4">
                {/* {isLoading.get_all ? (
                    <div className="flex justify-center items-center sweet-loading h-[199px]">
                        <BeatLoader
                            // cssOverride={override}
                            size={10}
                            color={"#ff4242"}
                            loading={true}
                            speedMultiplier={1.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : ( */}
                <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                    <AGGrid
                        addButtonLabel={undefined}
                        addButtonModalState={undefined}
                        withParam={""}
                        searchParam={null} //{searchDate.time_off_search}
                        // loading={isLoading.get_policy}
                        url={"getAttendanceForEmployeeAgGrid"}
                        doubleClickEvent={handleEditModal}
                        triggeringRefreshData={isSuccess}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1,
                            },
                            {
                                headerName: "Date",
                                flex: 3,
                                valueGetter: function (params: any) {
                                    if (params.data) {
                                        return dateFormat(
                                            params.data
                                                .EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                            "dd mmm yyyy"
                                        );
                                    }
                                },
                            },
                            {
                                headerName: "Check In - Check Out",
                                flex: 4,
                                valueGetter: function (params: any) {
                                    if (params.data) {
                                        const checkIn =
                                            params.data
                                                .EMPLOYEE_ATTENDANCE_CHECK_IN_TIME;
                                        const checkOut = params.data
                                            .EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                                            ? params.data
                                                  .EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                                            : "No Data";
                                        return checkIn + " - " + checkOut;
                                    }
                                },
                            },
                        ]}
                    />
                </div>
                {/* )} */}
            </div>
        </AuthenticatedLayout>
    );
}
