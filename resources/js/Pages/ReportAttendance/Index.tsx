import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { FormEvent, HtmlHTMLAttributes, useEffect, useState } from "react";
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
import {
    ArrowDownTrayIcon,
    CheckCircleIcon,
    PlusCircleIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import Checkbox from "@/Components/Checkbox";
import { RadioGroup } from "@headlessui/react";
import ReportAttendanceDetail from "./ReportAttendanceDetail";

export default function Index({ auth }: PageProps) {
    const {
        selectYear,
        companies,
        // kodeLembur,
        // additionalAllowance,
        // shiftFromAttendanceSetting,
    }: // shift
        any = usePage().props;
    
    const CustomButtonComponent = (data:any) => {
        return (
            <a href="https://www.google.com" target="_blank" rel="noopener">
                xxx
            </a>
            // <button onClick={() => window.alert("clicked")}>Push Me!</button>
        );
    };

    // const employee: any = auth.user.employee;
    const uangMakan: number = 25000;
    const [isLoading, setIsLoading] = useState<any>({
        get_all: false,
    });

    const [listOffice, setlistOffice] = useState<any>(null);
    const getOfficeByCompanyId = async (id: string) => {
        await axios
            .get(`/getOfficeByCompanyId/${id}`)
            .then((res) => {
                setlistOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDifferentMinute = (time: any, untukMasuk: boolean) => {
        // jika menit lebih dari 30, maka jam +1
        const arrTime = time.split(":");
        if (untukMasuk) {
            if (parseInt(arrTime[1]) > 30) {
                return parseInt(arrTime[0]) + 1;
            } else {
                return parseInt(arrTime[0]);
            }
        } else {
            if (parseInt(arrTime[1]) >= 30) {
                return parseInt(arrTime[0]) + 1;
            } else {
                return parseInt(arrTime[0]);
            }
        }
    };

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
        { id: 12, name: "December" },
    ];

    // useEffect(() => {
    //     getSalaryByEmployee(employee.EMPLOYEE_ID);
    //     getMedicalByEmployee(employee.EMPLOYEE_ID);
    // }, []);

    const [successSearch, setSuccessSearch] = useState<string>("");
    const [searchReport, setSearchReport] = useState<any>({
        report_search: [
            {
                COMPANY_ID: "",
                OFFICE_ID: "",
                YEAR: "", //dateFormat(new Date(), "yyyy"),
                MONTH: "",//dateFormat(new Date(), "mm"),
            },
        ],
    });    

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchReport.report_search];
        changeVal[i][name] = value;
        setSearchReport({ ...searchReport, report_search: changeVal });
    };

    const setDetailLembur = () => {
        const items = { ...dataRegisterLembur };
        const data = items;

        let detail: any = [];
        if (
            items["TANGGAL_PERIODE"] != "" &&
            items["TANGGAL_PERIODE_2"] != ""
        ) {
            axios
                .post(`/setDetailLembur`, { data })
                .then((res: any) => {
                    detail = res.data;
                    items["detail"] = detail;
                    setDataRegisterLembur(items);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const inputLembur = (name: string, value: any) => {
        const items = { ...dataRegisterLembur };

        if (name == "TANGGAL_PERIODE_2") {
            items["PERIODE_PENGGAJIAN"] = dateFormat(value, "mmmm yyyy");
        }

        // if (name == "EMPLOYEE_ID") {
        //     const lemburEmployee = getEmployeeById(value);
        //     items["COMPANY_ID"] == lemburEmployee.COMPANY_ID;
        // }

        items[name] = value;
        setDataRegisterLembur(items);
    };

    const inputDetailLembur = (name: string, value: any, i: any) => {
        const items = { ...dataRegisterLembur };
        const details = [...dataRegisterLembur.detail];

        if (name == "ADDITIONAL_ALLOWANCE_ID") {
            if (value == "") {
                details[i]["TOTAL_UANG_LEMBUR"] = "";
                details[i]["LEMBUR_UANG_MAKAN"] = "";
                details[i]["KODE_LEMBUR"] = "";
                details[i]["JUMLAH_JAM_LEMBUR"] = "";
                details[i]["UANG_MAKAN"] = "";
            } else {
                // const uangLembur = getAdditionalAllowanceById(value)
                //     ? getAdditionalAllowanceById(value)
                //           .ADDITIONAL_ALLOWANCE_AMOUNT
                //     : 0;

                // details[i]["TOTAL_UANG_LEMBUR"] = uangLembur;
                // details[i]["LEMBUR_UANG_MAKAN"] = uangLembur;
            }
        }

        // if (name == "KODE_LEMBUR") {
        //     if (
        //         details[i]["LEMBUR_IN"] == "" ||
        //         details[i]["LEMBUR_OUT"] == ""
        //     ) {
        //         // jika masuk dan pulang kosong, maka jumlah jam lembur 0
        //         details[i]["JUMLAH_JAM_LEMBUR"] = 0;
        //     } else if (details[i]["SHIFT_ID"] == "") {
        //         // jika tidak ada shift id (untuk luar kota)
        //         details[i]["JUMLAH_JAM_LEMBUR"] = 0;
        //     } else {
        //         const shiftDiMaster = getAttendanceSettingById(
        //             details[i]["SHIFT_ID"]
        //         );
        //         const differentMinuteOut = getDifferentMinute(
        //             details[i]["LEMBUR_OUT"],
        //             false
        //         );
        //         const differentMinuteIn = getDifferentMinute(
        //             details[i]["LEMBUR_IN"],
        //             true
        //         );
        //         if (value != 2) {
        //             /*Untuk hari biasa*/
        //             let lemburAwal = 0;
        //             /*jika jammasuk di inputan > jammasuk di master, maka set 0*/
        //             if (
        //                 details[i]["LEMBUR_IN"] <
        //                 shiftDiMaster.ATTENDANCE_CHECK_IN_TIME
        //             ) {
        //                 // lembur awal = jammasuk di master - jammasuk di inputan
        //                 const splitJamMasukMaster =
        //                     shiftDiMaster.ATTENDANCE_CHECK_IN_TIME.split(":");
        //                 lemburAwal =
        //                     parseInt(splitJamMasukMaster[0]) -
        //                     differentMinuteIn;
        //             }

        //             const splitJamKeluarMaster =
        //                 shiftDiMaster.ATTENDANCE_CHECK_OUT_TIME.split(":");
        //             let lemburAkhir = 0;
        //             if (
        //                 differentMinuteOut < parseInt(splitJamKeluarMaster[0])
        //             ) {
        //                 if (differentMinuteOut < 6) {
        //                     /*untuk jam pulang diatas jam 00:00*/
        //                     lemburAkhir =
        //                         differentMinuteOut +
        //                         24 -
        //                         parseInt(splitJamKeluarMaster[0]);
        //                 }
        //             } else {
        //                 lemburAkhir =
        //                     differentMinuteOut -
        //                     parseInt(splitJamKeluarMaster[0]);
        //             }

        //             details[i]["JUMLAH_JAM_LEMBUR"] = lemburAwal + lemburAkhir;
        //         } else {
        //             /*Untuk hari libur*/
        //             if (differentMinuteOut < 6) {
        //                 /*untuk jam pulang diatas jam 00:00*/
        //                 details[i]["JUMLAH_JAM_LEMBUR"] =
        //                     differentMinuteOut + 24 - differentMinuteIn;
        //             } else {
        //                 details[i]["JUMLAH_JAM_LEMBUR"] =
        //                     differentMinuteOut - differentMinuteIn;
        //             }
        //         }
        //     }

        //     const detailKodeLembur = getKodeLemburById(value);
        //     details[i]["TOTAL_UANG_LEMBUR"] =
        //         parseInt(details[i]["JUMLAH_JAM_LEMBUR"]) *
        //         detailKodeLembur.PENGALI_LEMBUR *
        //         parseInt(
        //             getAdditionalAllowanceById(
        //                 details[i]["ADDITIONAL_ALLOWANCE_ID"]
        //             ).ADDITIONAL_ALLOWANCE_AMOUNT
        //         );

        //     if (details[i]["UANG_MAKAN"] == "") {
        //         details[i]["LEMBUR_UANG_MAKAN"] =
        //             details[i]["TOTAL_UANG_LEMBUR"];
        //     } else {
        //         details[i]["LEMBUR_UANG_MAKAN"] =
        //             parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
        //             parseInt(details[i]["UANG_MAKAN"]);
        //     }
        // }

        if (name == "UANG_MAKAN") {
            if (value) {
                value = uangMakan;
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] =
                    parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
                    parseInt(details[i]["UANG_MAKAN"]);
            } else {
                value = 0;
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] = parseInt(
                    details[i]["TOTAL_UANG_LEMBUR"]
                );
            }
        }

        details[i][name] = value;
        setDataRegisterLembur({
            ...dataRegisterLembur,
            detail: details,
        });
    };

    // Register Lembur
    const [modal, setModal] = useState<any>({
        modalDetailReport: false,
        modalEditLembur: false,
    });

    const fieldLembur = {
        LEMBUR_ID: "",
        EMPLOYEE_ID: "",
        COMPANY_ID: "",
        TANGGAL: "",
        TANGGAL_PERIODE: "",
        TANGGAL_PERIODE_2: "",
        PERIODE_PENGGAJIAN: "",
        DESCRIPTION: "",
        CREATED_DATE: "",
        CREATED_BY: "",
        UPDATED_DATE: "",
        UPDATED_BY: "",
        detail: [],
    };

    const [dataRegisterLembur, setDataRegisterLembur] = useState<any>();

    const handleRegisterLembur = () => {
        const items = { ...fieldLembur };
        items["TANGGAL"] = dateFormat(new Date(), "yyyy-mm-dd");
        setDataRegisterLembur(items);
        setModal({
            modalDetailReport: true,
            modalEditLembur: false,
        });
    };

    const handleSuccessLembur = (message: any) => {
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
            modalDetailReport: false,
            modalEditLembur: false,
        });
    };

    // End Register lembur

    const [isSuccess, setIsSuccess] = useState<string>("");

    // Edit Lembur

    const [dataEditLembur, setDataEditLembur] = useState<any>({});
    const getLemburById = (lemburId: any) => {
        axios
            .get(`/getLemburById/${lemburId}`)
            .then((res) => setDataEditLembur(res.data))
            .catch((err) => console.log(err));
    };

    const [clockInDate, setclockInDate] = useState<string>("");
    const handleDetailReport = (data: any) => {
        // console.log("data: ", data);
        setclockInDate(data.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE);
        getLemburById(data.LEMBUR_ID);
        setModal({
            modalDetailReport: !modal.modalDetailReport,
            // modalEditLembur: !modal.modalEditLembur,
        });
        // setValidationEdit(false);
    };

    const editLembur = (name: string, value: any) => {
        const items = { ...dataEditLembur };

        if (name == "TANGGAL_PERIODE_2") {
            items["PERIODE_PENGGAJIAN"] = dateFormat(value, "mmmm yyyy");
        }

        items[name] = value;
        setDataEditLembur(items);
    };

    const editDetailLembur = (name: string, value: any, i: any) => {
        const items = { ...dataEditLembur };
        const details = [...dataEditLembur.detail];

        if (name == "ADDITIONAL_ALLOWANCE_ID") {
            if (
                value == "" ||
                details[i]["LEMBUR_IN"] == null ||
                details[i]["LEMBUR_OUT"] == null
            ) {
                details[i]["TOTAL_UANG_LEMBUR"] = "";
                details[i]["LEMBUR_UANG_MAKAN"] = "";
                details[i]["KODE_LEMBUR"] = "";
                details[i]["JUMLAH_JAM_LEMBUR"] = "";
                details[i]["UANG_MAKAN"] = "";
            } else {
                // const uangLembur = getAdditionalAllowanceById(value)
                //     ? getAdditionalAllowanceById(value)
                //           .ADDITIONAL_ALLOWANCE_AMOUNT
                //     : 0;

                // details[i]["TOTAL_UANG_LEMBUR"] = uangLembur;
                // details[i]["LEMBUR_UANG_MAKAN"] = uangLembur;
            }
        }

        // if (name == "KODE_LEMBUR") {
        //     if (value != "") {
        //         if (
        //             details[i]["LEMBUR_IN"] == null ||
        //             details[i]["LEMBUR_OUT"] == null
        //         ) {
        //             // jika masuk dan pulang kosong, maka jumlah jam lembur 0
        //             details[i]["JUMLAH_JAM_LEMBUR"] = 0;
        //         } else if (details[i]["SHIFT_ID"] == null) {
        //             // jika tidak ada shift id (untuk luar kota)
        //             details[i]["JUMLAH_JAM_LEMBUR"] = 0;
        //         } else {
        //             const shiftDiMaster = getAttendanceSettingById(
        //                 details[i]["SHIFT_ID"]
        //             );

        //             let differentMinuteOut = 0;
        //             let differentMinuteIn = 0;
        //             if (details[i]["LEMBUR_OUT"]) {
        //                 differentMinuteOut = getDifferentMinute(
        //                     details[i]["LEMBUR_OUT"],
        //                     false
        //                 );
        //             }

        //             if (details[i]["LEMBUR_IN"]) {
        //                 differentMinuteIn = getDifferentMinute(
        //                     details[i]["LEMBUR_IN"],
        //                     true
        //                 );
        //             }

        //             if (value != 2) {
        //                 /*Untuk hari biasa*/
        //                 let lemburAwal = 0;
        //                 /*jika jammasuk di inputan > jammasuk di master, maka set 0*/
        //                 if (
        //                     details[i]["LEMBUR_IN"] <
        //                     shiftDiMaster.ATTENDANCE_CHECK_IN_TIME
        //                 ) {
        //                     // lembur awal = jammasuk di master - jammasuk di inputan
        //                     const splitJamMasukMaster =
        //                         shiftDiMaster.ATTENDANCE_CHECK_IN_TIME.split(
        //                             ":"
        //                         );
        //                     lemburAwal =
        //                         parseInt(splitJamMasukMaster[0]) -
        //                         differentMinuteIn;
        //                 }

        //                 const splitJamKeluarMaster =
        //                     shiftDiMaster.ATTENDANCE_CHECK_OUT_TIME.split(":");
        //                 let lemburAkhir = 0;
        //                 if (
        //                     differentMinuteOut <
        //                     parseInt(splitJamKeluarMaster[0])
        //                 ) {
        //                     if (differentMinuteOut < 6) {
        //                         /*untuk jam pulang diatas jam 00:00*/
        //                         lemburAkhir =
        //                             differentMinuteOut +
        //                             24 -
        //                             parseInt(splitJamKeluarMaster[0]);
        //                     }
        //                 } else {
        //                     lemburAkhir =
        //                         differentMinuteOut -
        //                         parseInt(splitJamKeluarMaster[0]);
        //                 }

        //                 details[i]["JUMLAH_JAM_LEMBUR"] =
        //                     lemburAwal + lemburAkhir;
        //             } else {
        //                 /*Untuk hari libur*/
        //                 if (differentMinuteOut < 6) {
        //                     /*untuk jam pulang diatas jam 00:00*/
        //                     details[i]["JUMLAH_JAM_LEMBUR"] =
        //                         differentMinuteOut + 24 - differentMinuteIn;
        //                 } else {
        //                     details[i]["JUMLAH_JAM_LEMBUR"] =
        //                         differentMinuteOut - differentMinuteIn;
        //                 }
        //             }
        //         }

        //         const detailKodeLembur = getKodeLemburById(value);
        //         details[i]["TOTAL_UANG_LEMBUR"] =
        //             parseInt(details[i]["JUMLAH_JAM_LEMBUR"]) *
        //             detailKodeLembur.PENGALI_LEMBUR *
        //             parseInt(
        //                 getAdditionalAllowanceById(
        //                     details[i]["ADDITIONAL_ALLOWANCE_ID"]
        //                 ).ADDITIONAL_ALLOWANCE_AMOUNT
        //             );

        //         if (details[i]["UANG_MAKAN"] == "") {
        //             details[i]["LEMBUR_UANG_MAKAN"] =
        //                 details[i]["TOTAL_UANG_LEMBUR"];
        //         } else {
        //             details[i]["LEMBUR_UANG_MAKAN"] =
        //                 parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
        //                 parseInt(details[i]["UANG_MAKAN"]);
        //         }
        //     }
        // }

        if (name == "UANG_MAKAN") {
            if (value) {
                value = uangMakan;
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] =
                    parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
                    parseInt(details[i]["UANG_MAKAN"]);
            } else {
                value = 0;
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] = parseInt(
                    details[i]["TOTAL_UANG_LEMBUR"]
                );
            }
        }

        details[i][name] = value;
        setDataEditLembur({
            ...dataEditLembur,
            detail: details,
        });
    };

    // End Edit Lembur

    const deleteLembur = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Delete this Lembur?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading({
                    ...isLoading,
                    get_all: true,
                });
                setModal({
                    modalRequestTimeOff: false,
                    modalEditRequestTimeOff: false,
                });
                try {
                    // send request to server
                    const response = await axios.post(`/deleteLembur`, {
                        data,
                    });

                    // check status response
                    if (response.status) {
                        if (response.data.status == 1) {
                            Swal.fire(
                                "Deleted!",
                                "Lembur has been deleted.",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    setIsLoading({
                                        ...isLoading,
                                        get_all: false,
                                    });
                                }
                            });
                        } else {
                            Swal.fire("Failed!", "Failed Deleted Lembur.");
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
                        "There was an error deleted Lembur",
                        "error"
                    );
                }
            }
        });
    };

    const mailingLists = [
        {
            id: 1,
            title: "Date",
            description: "Last message sent an hour ago",
            users: "621 users",
        },
        {
            id: 2,
            title: "Person",
            description: "Last message sent 2 weeks ago",
            users: "1200 users",
        }
    ];


    const [selectedMailingLists, setSelectedMailingLists] = useState(mailingLists[0])

    // console.log("dataRegisterLembur: ", dataRegisterLembur);
    // console.log("dataEditLembur: ", dataEditLembur);

    return (
        <AuthenticatedLayout user={auth.user} header={"Attendance Report"}>
            <Head title="Attendance Report" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            <ModalToAction
                // buttonAddOns={}
                actionDelete={null}
                show={modal.modalDetailReport}
                onClose={() => {
                    setModal({
                        modalDetailReport: false,
                    }),
                        setDataEditLembur({});
                }}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={""}
                cancelButtonName={"Close"}
                title={"Report Attendance"}
                url={`/editLembur`}
                method={"post"}
                data={dataEditLembur}
                onSuccess={handleSuccessLembur}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                body={
                    <>
                        <ReportAttendanceDetail
                            // idEmployee={idEmployee}
                            clockInDate={clockInDate}
                            setIsSuccess={setIsSuccess}
                            // handleSuccessEmployment={handleSuccessEmployment}
                        />
                    </>
                }
            />

            <div className="">
                {/* <div className="col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem]"> */}
                <div className=" overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 grid grid-cols-2 gap-4">
                        <div className="col-start-1 col-end-3 text-left">
                            <fieldset>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Report By
                                </label>
                                <RadioGroup
                                    value={selectedMailingLists}
                                    onChange={setSelectedMailingLists}
                                    className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                                >
                                    {mailingLists.map((mailingList) => (
                                        <RadioGroup
                                            key={mailingList.id}
                                            value={mailingList}
                                            aria-label={mailingList.title}
                                            aria-description={`${mailingList.description} to ${mailingList.users}`}
                                            className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[focus]:border-indigo-600 data-[focus]:ring-2 data-[focus]:ring-indigo-600"
                                        >
                                            <span className="flex flex-1">
                                                <span className="flex flex-col">
                                                    <span className="block text-sm font-medium text-gray-900">
                                                        {mailingList.title}
                                                    </span>
                                                </span>
                                            </span>
                                            <CheckCircleIcon
                                                aria-hidden="true"
                                                className="size-5 text-indigo-600 group-[&:not([data-checked])]:invisible"
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-600"
                                            />
                                        </RadioGroup>
                                    ))}
                                </RadioGroup>
                            </fieldset>
                        </div>
                        {/* <div className="col-end-7 col-span-2 text-right mr-2">
                            <Button
                                className="p-2"
                                onClick={() => {
                                    // handleRegisterLembur();
                                }}
                            >
                                {"Set Collective Leave"}
                            </Button>
                        </div> */}
                    </div>
                    <div className="px-4 grid grid-cols-4 gap-4">
                        <div className="">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Company
                            </label>
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={searchReport.report_search[0].COMPANY_ID}
                                onChange={(e) => {
                                    inputDataSearch(
                                        "COMPANY_ID",
                                        e.target.value,
                                        0
                                    );
                                    getOfficeByCompanyId(e.target.value);
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
                        <div className="">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Year
                            </label>
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={searchReport.report_search[0].YEAR}
                                onChange={(e) => {
                                    inputDataSearch("YEAR", e.target.value, 0);
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

                        <div className="">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Month
                            </label>
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={searchReport.report_search[0].MONTH}
                                onChange={(e) => {
                                    inputDataSearch("MONTH", e.target.value, 0);
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
                        <div className="">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Office
                            </label>
                            <select
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={searchReport.report_search[0].OFFICE_ID}
                                onChange={(e) => {
                                    inputDataSearch(
                                        "OFFICE_ID",
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
                                    -- <i>Search Office</i> --
                                </option>
                                {listOffice
                                    ? listOffice.map((item: any, i: number) => {
                                          return (
                                              <option
                                                  key={i}
                                                  value={item.COMPANY_OFFICE_ID}
                                              >
                                                  {item.COMPANY_OFFICE_ALIAS}
                                              </option>
                                          );
                                      })
                                    : null}
                            </select>
                        </div>
                    </div>
                    <div className="px-4 grid grid-cols-1 gap-4 mt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-2">
                            Organization Attendance Report
                        </h2>
                    </div>

                    <div className="px-4 grid grid-cols-2 gap-4 mb-4">
                        <div className="border rounded p-4 flex items-center">
                            <div className="bg-blue-700 text-white rounded-full p-4 mr-4">
                                <i className="fas fa-stopwatch fa-2x"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Total Person Time Off
                                </h3>
                                <p className="text-2xl font-bold">16</p>
                                <a href="#" className="text-blue-700">
                                    View
                                </a>
                            </div>
                        </div>
                        <div className="border rounded p-4 flex items-center">
                            <div className="bg-blue-700 text-white rounded-full p-4 mr-4">
                                <i className="fas fa-trophy fa-2x"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Total Person Late 5 Time(s)
                                </h3>
                                <p className="text-2xl font-bold">1</p>
                                <a href="#" className="text-blue-700">
                                    View
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
            <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-4">
                <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                    <AGGrid
                        addButtonLabel={undefined}
                        addButtonModalState={undefined}
                        withParam={""}
                        searchParam={searchReport.report_search} //{searchReport.time_off_search}
                        // loading={isLoading.get_policy}
                        url={"getAttendanceAgGrid"}
                        doubleClickEvent={handleDetailReport}
                        triggeringRefreshData={successSearch}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1,
                                cellStyle: function (params: any) {
                                    if (params.data) {
                                        const isWeekEnd = new Date(
                                            params.data.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE
                                        ).getDay();
                                        if (isWeekEnd == 0 || isWeekEnd == 6) {
                                            return {
                                                color: "red",
                                            };
                                        } else {
                                            return null;
                                        }
                                    }
                                },
                            },
                            {
                                headerName: "Date",
                                flex: 3,
                                valueGetter: function (params: any) {
                                    if (params.data) {
                                        return (
                                            dateFormat(
                                                params.data
                                                    .EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                                "dddd"
                                            ) +
                                            ", " +
                                            dateFormat(
                                                params.data
                                                    .EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
                                                "dd mmmm yyyy"
                                            )
                                        );
                                    }
                                },
                                cellStyle: function (params: any) {
                                    if (params.data) {
                                        const isWeekEnd = new Date(
                                            params.data.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE
                                        ).getDay();
                                        if (isWeekEnd == 0 || isWeekEnd == 6) {
                                            return {
                                                color: "red",
                                            };
                                        } else {
                                            return null;
                                        }
                                    }
                                },
                            },
                            {
                                headerName: "Total Attendance",
                                flex: 3,
                                valueGetter: function (params: any) {
                                    if (params.data) {
                                        return (
                                            params.data.JUMLAH_ATTENDANCE +
                                            " Employee"
                                        );
                                    }
                                },
                                cellStyle: function (params: any) {
                                    if (params.data) {
                                        const isWeekEnd = new Date(
                                            params.data.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE
                                        ).getDay();
                                        if (isWeekEnd == 0 || isWeekEnd == 6) {
                                            return {
                                                color: "red",
                                            };
                                        } else {
                                            return null;
                                        }
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
