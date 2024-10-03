import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToastMessage from "@/Components/ToastMessage";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Company from "../Company";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DetailAttendanceSetting({
    attendanceSettingId,
    setIsSuccess,
    isSuccess,
    setDetailCompanyNew,
    attendanceType,
    companies,
}: PropsWithChildren<{
    attendanceSettingId: any;
    setIsSuccess: any | string | null;
    isSuccess: any | string | null;
    setDetailCompanyNew: any;
    attendanceType: any;
    companies: any;
}>) {
    // load otomatis detail relation
    useEffect(() => {
        getDetailAttendanceSetting(attendanceSettingId);
    }, [attendanceSettingId]);

    const [detailAttendanceSetting, setDetailAttendanceSetting] = useState<any>(
        []
    );

   
    // get Detail Attendance Setting
    const getDetailAttendanceSetting = async (attendanceSettingId: string) => {
        await axios
            .post(`/getAttendanceSettingById`, { attendanceSettingId })
            .then((res) => {
                setDetailAttendanceSetting(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    
    const [modalEdit, setModalEdit] = useState<any>({
        modalEditWorkAttendce: false,
    });

    const [dataEditAttendanceSetting, setDataEditAttendanceSetting] =
        useState<any>({});

    const handleClickEditAttendanceSetting = async (
        e: FormEvent,
        companyId: string
    ) => {
        e.preventDefault();
        setDataEditAttendanceSetting(detailAttendanceSetting);
        setModalEdit({
            modalEditWorkAttendce: !modalEdit.modalEditWorkAttendce,
        });
    };
    const handleSuccessEditAttendanceSetting = (message: any) => {
        setIsSuccess("");
        if (message != "") {
            getDetailAttendanceSetting(message["id"]);
            
            setIsSuccess(message["msg"]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    
    return (
        <>
            {/* Modal Edit work attendance */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEdit.modalEditWorkAttendce}
                onClose={() =>
                    setModalEdit({
                        modalEditWorkAttendce: false,
                    })
                }
                title={"Edit Attendance Setting"}
                url={`/editAttendanceSetting`}
                data={dataEditAttendanceSetting}
                onSuccess={handleSuccessEditAttendanceSetting}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div className="mb-2">
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
                                        value={
                                            dataEditAttendanceSetting.COMPANY_ID
                                        }
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                            dataEditAttendanceSetting.ATTENDANCE_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                            dataEditAttendanceSetting.ATTENDANCE_TYPE
                                        }
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                                dataEditAttendanceSetting.ATTENDANCE_EFFECTIVE_FROM
                                            }
                                            onChange={(date: any) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
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
                                <div className="relative">
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
                                                dataEditAttendanceSetting.ATTENDANCE_EFFECTIVE_LAST
                                            }
                                            onChange={(date: any) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
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
                                    <div className="inputfield">
                                        <input
                                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditAttendanceSetting.ATTENDANCE_CHECK_IN_TIME
                                            }
                                            type="time"
                                            onChange={(e) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
                                                    ATTENDANCE_CHECK_IN_TIME:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Check Out Time"}
                                    />
                                    <div className="ml-[7.2rem] text-red-600">
                                        *
                                    </div>
                                    <div className="inputfield">
                                        <input
                                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditAttendanceSetting.ATTENDANCE_CHECK_OUT_TIME
                                            }
                                            type="time"
                                            onChange={(e) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
                                                    ATTENDANCE_CHECK_OUT_TIME:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
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
                                            dataEditAttendanceSetting.ATTENDANCE_LATE_COMPENSATION
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                            dataEditAttendanceSetting.ATTENDANCE_EARLY_COMPENSATION
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                    <div className="inputfield">
                                        <input
                                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditAttendanceSetting.ATTENDANCE_BREAK_START_TIME
                                            }
                                            type="time"
                                            onChange={(e) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
                                                    ATTENDANCE_BREAK_START_TIME:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className=""
                                        value={"Break Time End"}
                                    />
                                    <div className="inputfield">
                                        <input
                                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataEditAttendanceSetting.ATTENDANCE_BREAK_END_TIME
                                            }
                                            type="time"
                                            onChange={(e) =>
                                                setDataEditAttendanceSetting({
                                                    ...dataEditAttendanceSetting,
                                                    ATTENDANCE_BREAK_END_TIME:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
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
                                            dataEditAttendanceSetting.ATTENDANCE_LATITUDE_OFFICE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
                                            dataEditAttendanceSetting.ATTENDANCE_LONGITUDE_OFFICE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataEditAttendanceSetting({
                                                ...dataEditAttendanceSetting,
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
            {/* End Modal Edit work attendance */}

            <div className="bg-white rounded-md shadow-md mb-2 p-4">
                <div className="flex justify-between">
                    <div className="text-md font-semibold w-fit">
                        <span className="border-b-2 border-red-600">
                            Detail Attendance Setting
                        </span>
                    </div>
                    <div
                        className="text-red-600 cursor-pointer"
                        title="Edit Company"
                        onClick={(e) => {
                            handleClickEditAttendanceSetting(
                                e,
                                detailAttendanceSetting.ATTENDANCE_SETTING_ID
                            );
                        }}
                    >
                        <span>
                            <PencilSquareIcon className="w-6" />
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Company</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {
                                        detailAttendanceSetting?.company
                                            ?.COMPANY_NAME
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Attendance Name</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {detailAttendanceSetting.ATTENDANCE_NAME}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Attendance Type</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {detailAttendanceSetting.ATTENDANCE_TYPE ==
                                    0
                                        ? "Fix Work Attendance"
                                        : "Shift Work Attendance"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Effective Date</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {dateFormat(
                                        detailAttendanceSetting.ATTENDANCE_EFFECTIVE_FROM,
                                        "dd-mm-yyyy"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Effective Last</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {detailAttendanceSetting.ATTENDANCE_EFFECTIVE_LAST
                                        ? dateFormat(
                                              detailAttendanceSetting.ATTENDANCE_EFFECTIVE_LAST,
                                              "dd-mm-yyyy"
                                          )
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Check In</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {
                                        detailAttendanceSetting.ATTENDANCE_CHECK_IN_TIME
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Check Out</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {
                                        detailAttendanceSetting.ATTENDANCE_CHECK_OUT_TIME
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Late Compensation</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {detailAttendanceSetting.ATTENDANCE_LATE_COMPENSATION +
                                        " Minutes"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Early Compensation</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {detailAttendanceSetting.ATTENDANCE_EARLY_COMPENSATION +
                                        " Minutes"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Break Start</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {
                                        detailAttendanceSetting.ATTENDANCE_BREAK_START_TIME
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Break End</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {
                                        detailAttendanceSetting.ATTENDANCE_BREAK_END_TIME
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Latitude Office</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {parseFloat(
                                        detailAttendanceSetting.ATTENDANCE_LATITUDE_OFFICE
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="">
                                <span>Longitude Office</span>
                            </div>
                            <div className=" col-span-3">
                                <span className="font-normal text-gray-500">
                                    {parseFloat(
                                        detailAttendanceSetting.ATTENDANCE_LONGITUDE_OFFICE
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
