import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import dateFormat from "dateformat";
import axios from "axios";
import {
    ArrowDownTrayIcon,
    PencilSquareIcon,
    PhoneIcon,
    PlusCircleIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";

export default function ReportAttendanceDetail({
    // idEmployee,
    // taxStatus,
    setIsSuccess,
    clockInDate,
}: // handleSuccessEmployment,
PropsWithChildren<{
    // idEmployee: any;
    // taxStatus: any;
    clockInDate: any;
    setIsSuccess: any;
}>) {
    // useEffect(() => {
    //     getEmployee(idEmployee);
    // }, [idEmployee]);
    const [dataDetailEmployee, setDataDetailEmployee] = useState<any>([]);
    const getEmployee = async (id: string) => {
        await axios
            .post(`/getEmployeeDetail`, { id })
            .then((res) => {
                setDataDetailEmployee(res.data);
                console.log("asdasda", res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [tab, setTab] = useState<any>({
        nameTab: "On Time",
        currentTab: true,
    });
    const tabs = [
        { name: "On Time", href: "#", current: true, field: "ON_TIME" },
        {
            name: "Late Arrival",
            href: "#",
            current: false,
            field: "LATE_ARRIVAL",
        },
        { name: "Absent", href: "#", current: false, field: "ABSENT" },
        { name: "Time Off", href: "#", current: false, field: "TIME_OFF" },
    ];

    const [successSearch, setSuccessSearch] = useState<string>("");
    const [successSearchAbsent, setSuccessSearchAbsent] = useState<string>("");
    const [successSearchTimeOff, setSuccessSearchTimeOff] = useState<string>("");
    // const [clockInDate, setclockInDate] = useState<string>("");
    const [searchReport, setSearchReport] = useState<any>({
        report_search: [
            {
                ON_TIME: true,
                LATE_ARRIVAL: false,
                ABSENT: false,
                TIME_OFF: false,
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        // value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchReport.report_search];
        changeVal[i]["ON_TIME"] = false;
        changeVal[i]["LATE_ARRIVAL"] = false;
        changeVal[i]["ABSENT"] = false;
        changeVal[i]["TIME_OFF"] = false;
        if (name == "ON_TIME") {
            changeVal[i]["ON_TIME"] = true;
            setSuccessSearch("Refreshing");
        } else if (name == "LATE_ARRIVAL") {
            changeVal[i]["LATE_ARRIVAL"] = true;
            setSuccessSearch("Refreshing");
        } else if (name == "ABSENT") {
            changeVal[i]["ABSENT"] = true;
            setSuccessSearchTimeOff("Refresing")
        } else if (name == "TIME_OFF") {
            changeVal[i]["TIME_OFF"] = true;
            setSuccessSearchTimeOff("Refresing");
        }
        setSearchReport({ ...searchReport, report_search: changeVal });
        
    };
    console.log("searchReport: ", searchReport);
    console.log("successSearch: ", successSearch);

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <>
            <div>
                <div className="hidden sm:block">
                    <nav aria-label="Tabs" className="flex space-x-4">
                        {tabs.map((tabNew) => (
                            <a
                                key={tabNew.name}
                                onClick={(e) => {
                                    setTab({
                                        nameTab: tabNew.name,
                                        currentTab: true,
                                    });
                                    inputDataSearch(tabNew.field, 0);
                                    // setSuccessSearch("Refreshing");
                                    setTimeout(() => {
                                        setSuccessSearch("");
                                        setSuccessSearchAbsent("")
                                        setSuccessSearchTimeOff("");
                                    }, 1000);
                                }}
                                aria-current={
                                    tab.currentTab &&
                                    tabNew.name === tab.nameTab
                                        ? "page"
                                        : undefined
                                }
                                className={classNames(
                                    tab.currentTab &&
                                        tabNew.name === tab.nameTab
                                        ? "bg-white text-red-700"
                                        : "text-gray-500 hover:text-red-600",
                                    "rounded-t-md px-3 py-2 text-sm font-medium hover:cursor-pointer"
                                )}
                            >
                                {tabNew.name}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="bg-white shadow-md rounded-lg p-3">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        {searchReport.report_search[0].ABSENT ? (
                            // Untuk Absent
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={clockInDate}
                                searchParam={searchReport.report_search} //{searchReport.time_off_search}
                                // loading={isLoading.get_policy}
                                url={"detailAttendanceReportAgGrid"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={successSearch}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "Employee",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                console.log(
                                                    "data: ",
                                                    params.data
                                                        .EMPLOYEE_FIRST_NAME
                                                );
                                                
                                                return (
                                                    params.data
                                                        .EMPLOYEE_FIRST_NAME
                                                );
                                            }
                                        },
                                    },
                                ]}
                            />
                        ) : searchReport.report_search[0].TIME_OFF ? (
                            // Untuk Time Off
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={clockInDate}
                                searchParam={searchReport.report_search} //{searchReport.time_off_search}
                                // loading={isLoading.get_policy}
                                url={"detailAttendanceReportAgGrid"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={successSearch}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "Employee",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                return params.data.employee ? params.data.employee
                                                    .EMPLOYEE_FIRST_NAME : null;
                                            }
                                        },
                                    },
                                    {
                                        headerName: "Message",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                if (
                                                    params.data
                                                        .NOTE
                                                ) {
                                                    return params.data
                                                        .NOTE;
                                                }
                                            }
                                        },
                                    },
                                ]}
                            />
                            ) : (
                                // Untuk On Time dan Late Arrival
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={clockInDate}
                                searchParam={searchReport.report_search} //{searchReport.time_off_search}
                                // loading={isLoading.get_policy}
                                url={"detailAttendanceReportAgGrid"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={successSearch}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "Employee",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                return params.data.employee
                                                    ? params.data.employee
                                                          .EMPLOYEE_FIRST_NAME
                                                    : null;
                                            }
                                        },
                                    },
                                    {
                                        headerName: "Setting",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                return params.data
                                                    .ATTENDANCE_SETTING_ID;
                                            }
                                        },
                                    },
                                    {
                                        headerName: "Check In",
                                        flex: 2,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                return (
                                                    dateFormat(
                                                        params.data
                                                            .EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                                        "dd-mm-yyyy"
                                                    ) +
                                                    " " +
                                                    params.data.EMPLOYEE_ATTENDANCE_CHECK_IN_TIME.substr(
                                                        0,
                                                        5
                                                    )
                                                );
                                            }
                                        },
                                    },
                                    {
                                        headerName: "Check Out",
                                        flex: 2,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                if (
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME
                                                ) {
                                                    return (
                                                        dateFormat(
                                                            params.data
                                                                .EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE,
                                                            "dd-mm-yyyy"
                                                        ) +
                                                        " " +
                                                        params.data.EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME.substr(
                                                            0,
                                                            5
                                                        )
                                                    );
                                                } else {
                                                    return "-";
                                                }
                                            }
                                        },
                                    },

                                    {
                                        headerName: "Location",
                                        flex: 2,
                                        cellRenderer: (params: any) => {
                                            if (params.data) {
                                                if (
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE &&
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE
                                                ) {
                                                    return (
                                                        <a
                                                            href={
                                                                "https://maps.google.com/search?q=" +
                                                                params.data
                                                                    .EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE +
                                                                "," +
                                                                params.data
                                                                    .EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE
                                                            }
                                                            target="_blank"
                                                            rel="noopener"
                                                        >
                                                            {params.data
                                                                .EMPLOYEE_ATTENDANCE_LOCATION_TYPE ==
                                                            0
                                                                ? "Inside Office"
                                                                : "Outside Office"}
                                                        </a>
                                                    );
                                                } else {
                                                    return "-";
                                                }
                                            }
                                        },
                                        cellStyle: function (params: any) {
                                            if (params.data) {
                                                if (
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE &&
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE
                                                ) {
                                                    return {
                                                        color: "blue",
                                                    };
                                                } else {
                                                    return null;
                                                }
                                            }
                                        },
                                    },
                                    {
                                        headerName: "Message",
                                        flex: 3,
                                        valueGetter: function (params: any) {
                                            if (params.data) {
                                                if (
                                                    params.data
                                                        .EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN
                                                ) {
                                                    return params.data
                                                        .EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN;
                                                }
                                            }
                                        },
                                    },
                                ]}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
