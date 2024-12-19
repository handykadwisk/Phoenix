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
    PlusCircleIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import Checkbox from "@/Components/Checkbox";

export default function Index({ auth }: PageProps) {
    const {
        selectYear,
        listEmployee,
        kodeLembur,
        additionalAllowance,
        shiftFromAttendanceSetting,
        // shift
    }: any = usePage().props;

    // const employee: any = auth.user.employee;
    const uangMakan: number = 25000
    const [isLoading, setIsLoading] = useState<any>({
        get_all: false,
    });

   const getEmployeeById = (id: any) => {
       const data = listEmployee;
       const result = data.find((value: any) => value.EMPLOYEE_ID == id);
       return result ? result : null;
    };

    const isWeekEnd = (date: string) => {
        return new Date(date).getDay();
    }
    
    const getAdditionalAllowanceById = (id: any) => {
        const data = additionalAllowance;
        const result = data.find(
            (value: any) => value.ADDITIONAL_ALLOWANCE_ID == id
        );
        return result ? result : null;
    };

    // const getShiftById = (id: any) => {
    //     const data = shift;
    //     const result = data.find((value: any) => value.SHIFT_ID == id);
    //     return result ? result : null;
    // };

    const getKodeLemburById = (id: any) => {
        const data = kodeLembur;
        const result = data.find((value: any) => value.KODE_LEMBUR_ID == id);
        return result ? result : null;
    };

    const getAttendanceSettingById = (id: any) => {
        const data = shiftFromAttendanceSetting;
        const result = data.find((value: any) => value.ATTENDANCE_SETTING_ID == id);
        return result ? result : null;
    };

    const getDifferentMinute = (time: any, untukMasuk:boolean) => {
        // jika menit lebih dari 30, maka jam +1
        const arrTime = time.split(':')
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
    const [searchDate, setSearchDate] = useState<any>({
        lembur_search: [
            {
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
        const changeVal: any = [...searchDate.lembur_search];
        changeVal[i][name] = value;
        setSearchDate({ ...searchDate, lembur_search: changeVal });
    };

    const setDetailLembur = () => {
        const items = { ...dataRegisterLembur };
        const data = items;

        let detail:any = [];
        if (
            items["TANGGAL_PERIODE"] != "" &&
            items["TANGGAL_PERIODE_2"] != ""
        ) {
            axios
                .post(`/setDetailLembur`, { data })
                .then((res:any) => {
                    
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

        if (name == "EMPLOYEE_ID") {
            const lemburEmployee = getEmployeeById(value);
            items["COMPANY_ID"] == lemburEmployee.COMPANY_ID;
        }
        
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
                const uangLembur = getAdditionalAllowanceById(value)
                    ? getAdditionalAllowanceById(value)
                          .ADDITIONAL_ALLOWANCE_AMOUNT
                    : 0;
                
                details[i]["TOTAL_UANG_LEMBUR"] = uangLembur;
                details[i]["LEMBUR_UANG_MAKAN"] = uangLembur;
            }
        }

        if (name == "KODE_LEMBUR") {
            if (
                details[i]["LEMBUR_IN"] == "" ||
                details[i]["LEMBUR_OUT"] == ""
            ) {
                // jika masuk dan pulang kosong, maka jumlah jam lembur 0
                details[i]["JUMLAH_JAM_LEMBUR"] = 0;
            } else if (details[i]["SHIFT_ID"] == "") {
                // jika tidak ada shift id (untuk luar kota)
                details[i]["JUMLAH_JAM_LEMBUR"] = 0;
            } else { 

                const shiftDiMaster = getAttendanceSettingById(details[i]["SHIFT_ID"]);
                const differentMinuteOut = getDifferentMinute(details[i]["LEMBUR_OUT"], false)
                const differentMinuteIn = getDifferentMinute(details[i]["LEMBUR_IN"], true)
                if (value != 2) {
                    /*Untuk hari biasa*/
                    let lemburAwal = 0;                    
                    /*jika jammasuk di inputan > jammasuk di master, maka set 0*/
                    if (details[i]["LEMBUR_IN"] < shiftDiMaster.ATTENDANCE_CHECK_IN_TIME) {
                        // lembur awal = jammasuk di master - jammasuk di inputan
                        const splitJamMasukMaster = shiftDiMaster.ATTENDANCE_CHECK_IN_TIME.split(":")
                        lemburAwal = parseInt(splitJamMasukMaster[0]) - differentMinuteIn;
                    }

                    const splitJamKeluarMaster = shiftDiMaster.ATTENDANCE_CHECK_OUT_TIME.split(":")
                    let lemburAkhir = 0;
                    if (differentMinuteOut < parseInt(splitJamKeluarMaster[0])) {
                        if (differentMinuteOut < 6) {
                            /*untuk jam pulang diatas jam 00:00*/
                            lemburAkhir = (differentMinuteOut + 24) - parseInt(splitJamKeluarMaster[0])
                        }
                    } else {
                        lemburAkhir = (differentMinuteOut) - parseInt(splitJamKeluarMaster[0])
                    }

                    details[i]["JUMLAH_JAM_LEMBUR"] = lemburAwal + lemburAkhir;
                } else {
                    /*Untuk hari libur*/
                    if (differentMinuteOut < 6) {
                        /*untuk jam pulang diatas jam 00:00*/
                        details[i]["JUMLAH_JAM_LEMBUR"] = (differentMinuteOut + 24) - differentMinuteIn
                    } else {
                        details[i]["JUMLAH_JAM_LEMBUR"] = differentMinuteOut - differentMinuteIn
                        
                    }
                }
            }

            const detailKodeLembur = getKodeLemburById(value)
            details[i]["TOTAL_UANG_LEMBUR"] =
                parseInt(details[i]["JUMLAH_JAM_LEMBUR"]) *
                detailKodeLembur.PENGALI_LEMBUR *
                parseInt(getAdditionalAllowanceById(details[i]["ADDITIONAL_ALLOWANCE_ID"]).ADDITIONAL_ALLOWANCE_AMOUNT);
            
            if (details[i]["UANG_MAKAN"] == "") {
                details[i]["LEMBUR_UANG_MAKAN"] = details[i]["TOTAL_UANG_LEMBUR"] 
            } else {
                details[i]["LEMBUR_UANG_MAKAN"] =
                    parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
                    parseInt(details[i]["UANG_MAKAN"]);
            }            
        }

        if (name == "UANG_MAKAN") {
            if (value) {
                value = uangMakan
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] = parseInt(details[i]["TOTAL_UANG_LEMBUR"]) + parseInt(details[i]["UANG_MAKAN"]);
            } else {
                value = 0
                details[i]["UANG_MAKAN"] = value;
                details[i]["LEMBUR_UANG_MAKAN"] = parseInt(details[i]["TOTAL_UANG_LEMBUR"]) 
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
        modalRegisterLembur: false,
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

    
    const [dataRegisterLembur, setDataRegisterLembur] = useState<any>(
    );

    const handleRegisterLembur = () => {
        const items = { ...fieldLembur };
        items["TANGGAL"] = dateFormat(new Date(), "yyyy-mm-dd");
        setDataRegisterLembur(items);
        setModal({
            modalRegisterLembur: true,
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
            modalRegisterLembur: false,
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

    const handleEditModal = (data: any) => {
        getLemburById(data.LEMBUR_ID);
        setModal({
            modalRegisterLembur: false,
            modalEditLembur: !modal.modalEditLembur,
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
                const uangLembur = getAdditionalAllowanceById(value)
                    ? getAdditionalAllowanceById(value)
                          .ADDITIONAL_ALLOWANCE_AMOUNT
                    : 0;

                details[i]["TOTAL_UANG_LEMBUR"] = uangLembur;
                details[i]["LEMBUR_UANG_MAKAN"] = uangLembur;
            }
        }

        if (name == "KODE_LEMBUR") {
            
            if (value != "") {
                if (
                    details[i]["LEMBUR_IN"] == null ||
                    details[i]["LEMBUR_OUT"] == null
                ) {
                    // jika masuk dan pulang kosong, maka jumlah jam lembur 0
                    details[i]["JUMLAH_JAM_LEMBUR"] = 0;
                } else if (details[i]["SHIFT_ID"] == null) {
                    // jika tidak ada shift id (untuk luar kota)
                    details[i]["JUMLAH_JAM_LEMBUR"] = 0;
                } else {
                    const shiftDiMaster = getAttendanceSettingById(
                        details[i]["SHIFT_ID"]
                    );

                    let differentMinuteOut = 0;
                    let differentMinuteIn = 0;
                    if (details[i]["LEMBUR_OUT"]) {
                        differentMinuteOut = getDifferentMinute(
                            details[i]["LEMBUR_OUT"],
                            false
                        );
                    }

                    if (details[i]["LEMBUR_IN"]) {
                        differentMinuteIn = getDifferentMinute(
                            details[i]["LEMBUR_IN"],
                            true
                        );
                    }

                    if (value != 2) {
                        /*Untuk hari biasa*/
                        let lemburAwal = 0;
                        /*jika jammasuk di inputan > jammasuk di master, maka set 0*/
                        if (
                            details[i]["LEMBUR_IN"] <
                            shiftDiMaster.ATTENDANCE_CHECK_IN_TIME
                        ) {
                            // lembur awal = jammasuk di master - jammasuk di inputan
                            const splitJamMasukMaster =
                                shiftDiMaster.ATTENDANCE_CHECK_IN_TIME.split(
                                    ":"
                                );
                            lemburAwal =
                                parseInt(splitJamMasukMaster[0]) -
                                differentMinuteIn;
                        }
                        
                        const splitJamKeluarMaster =
                            shiftDiMaster.ATTENDANCE_CHECK_OUT_TIME.split(":");
                        let lemburAkhir = 0;
                        if (
                            differentMinuteOut <
                            parseInt(splitJamKeluarMaster[0])
                        ) {
                            if (differentMinuteOut < 6) {
                                /*untuk jam pulang diatas jam 00:00*/
                                lemburAkhir =
                                    differentMinuteOut +
                                    24 -
                                    parseInt(splitJamKeluarMaster[0]);
                            }
                        } else {
                            lemburAkhir =
                                differentMinuteOut -
                                parseInt(splitJamKeluarMaster[0]);
                        }

                        details[i]["JUMLAH_JAM_LEMBUR"] =
                            lemburAwal + lemburAkhir;
                    } else {
                        /*Untuk hari libur*/
                        if (differentMinuteOut < 6) {
                            /*untuk jam pulang diatas jam 00:00*/
                            details[i]["JUMLAH_JAM_LEMBUR"] =
                                differentMinuteOut + 24 - differentMinuteIn;
                        } else {
                            details[i]["JUMLAH_JAM_LEMBUR"] =
                                differentMinuteOut - differentMinuteIn;
                            
                        }
                    }
                }

                const detailKodeLembur = getKodeLemburById(value);
                details[i]["TOTAL_UANG_LEMBUR"] =
                    parseInt(details[i]["JUMLAH_JAM_LEMBUR"]) *
                    detailKodeLembur.PENGALI_LEMBUR *
                    parseInt(
                        getAdditionalAllowanceById(
                            details[i]["ADDITIONAL_ALLOWANCE_ID"]
                        ).ADDITIONAL_ALLOWANCE_AMOUNT
                    );

                if (details[i]["UANG_MAKAN"] == "") {
                    details[i]["LEMBUR_UANG_MAKAN"] =
                        details[i]["TOTAL_UANG_LEMBUR"];
                } else {
                    details[i]["LEMBUR_UANG_MAKAN"] =
                        parseInt(details[i]["TOTAL_UANG_LEMBUR"]) +
                        parseInt(details[i]["UANG_MAKAN"]);
                }
            }
        }

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
                            Swal.fire(
                                "Failed!",
                                "Failed Deleted Lembur."
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
                        "There was an error deleted Lembur",
                        "error"
                    );
                }
            }
        });
    };

   
    // console.log("dataRegisterLembur: ", dataRegisterLembur);
    // console.log("dataEditLembur: ", dataEditLembur);

    return (
        <AuthenticatedLayout user={auth.user} header={"Lembur Karyawan"}>
            <Head title="Lembur Karyawan" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Register Lembur */}

            {dataRegisterLembur && (
                <ModalToAdd
                    buttonAddOns={""}
                    show={modal.modalRegisterLembur}
                    onClose={() => {
                        setModal({
                            modalRegisterLembur: false,
                        });
                        setDataRegisterLembur(null);
                    }}
                    title={"Register Lembur"}
                    url={`/registerLembur`}
                    data={dataRegisterLembur}
                    onSuccess={handleSuccessLembur}
                    classPanel={
                        "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                    }
                    body={
                        <>
                            <div className="bg-white shadow-md rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Nama Karyawan{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={
                                                dataRegisterLembur.EMPLOYEE_ID
                                            }
                                            onChange={(e) =>
                                                inputLembur(
                                                    "EMPLOYEE_ID",
                                                    e.target.value
                                                )
                                            }
                                            name="EMPLOYEE_ID"
                                            required
                                        >
                                            <option value={""}>
                                                -- <i>Select Employee</i> --
                                            </option>
                                            {listEmployee.map(
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
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Awal Lembur{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative ">
                                            <DatePicker
                                                selected={
                                                    dataRegisterLembur.TANGGAL_PERIODE
                                                }
                                                onChange={(date: any) =>
                                                    inputLembur(
                                                        "TANGGAL_PERIODE",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Input{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative mt-1">
                                            <DatePicker
                                                selected={
                                                    dataRegisterLembur.TANGGAL
                                                }
                                                onChange={(date: any) =>
                                                    inputLembur(
                                                        "TANGGAL",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Akhir Lembur{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative mt-1">
                                            <DatePicker
                                                selected={
                                                    dataRegisterLembur.TANGGAL_PERIODE_2
                                                }
                                                onChange={(date: any) =>
                                                    inputLembur(
                                                        "TANGGAL_PERIODE_2",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                name="TANGGAL_PERIODE_2"
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700">
                                            Periode Penggajian
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                dataRegisterLembur.PERIODE_PENGGAJIAN
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            readOnly
                                        />
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="mt-6 text-center">
                                            {dataRegisterLembur.EMPLOYEE_ID ? (
                                                <button
                                                    type="button"
                                                    className="p-2 rounded-md bg-red-600 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                                    onClick={setDetailLembur}
                                                >
                                                    <span className="">
                                                        Generate
                                                    </span>
                                                </button>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {Object.keys(dataRegisterLembur?.detail)
                                    .length > 0 ? (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">
                                            Detail Lembur
                                        </h2>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            No
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Hari
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Tanggal
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Attendance Activity
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Tipe Lembur
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Shift
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Masuk
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Pulang
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Jumlah Jam Lembur
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Uang Makan{" "}
                                                            <i className="fas fa-question-circle"></i>
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Uang Lembur
                                                        </th>
                                                        <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Lembur + Uang Makan
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {dataRegisterLembur?.detail?.map(
                                                        (
                                                            item: any,
                                                            i: number
                                                        ) => (
                                                            <tr
                                                                key={i}
                                                                className={
                                                                    isWeekEnd(
                                                                        item.LEMBUR_DATE
                                                                    ) == 6 ||
                                                                    isWeekEnd(
                                                                        item.LEMBUR_DATE
                                                                    ) == 0
                                                                        ? "bg-red-500 text-white"
                                                                        : "text-gray-500"
                                                                }
                                                            >
                                                                <td className="border text-center px-2 py-1 whitespace-nowrap text-sm ">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    {dateFormat(
                                                                        item.LEMBUR_DATE,
                                                                        "dddd"
                                                                    )}
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    {dateFormat(
                                                                        item.LEMBUR_DATE,
                                                                        "dd mmm yyyy"
                                                                    )}
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    <select
                                                                        className={
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                6 ||
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                0
                                                                                ? " bg-red-500 "
                                                                                : "" +
                                                                                  "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        }
                                                                        value={
                                                                            item.ADDITIONAL_ALLOWANCE_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputDetailLembur(
                                                                                "ADDITIONAL_ALLOWANCE_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Choose
                                                                            One
                                                                            --
                                                                        </option>
                                                                        {additionalAllowance.map(
                                                                            (
                                                                                aA: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            aA.ADDITIONAL_ALLOWANCE_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            aA.ADDITIONAL_ALLOWANCE_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    <select
                                                                        className={
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                6 ||
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                0
                                                                                ? " bg-red-500 "
                                                                                : "" +
                                                                                  "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        }
                                                                        value={
                                                                            item.KODE_LEMBUR
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputDetailLembur(
                                                                                "KODE_LEMBUR",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Pilih
                                                                            Kode
                                                                            Lembur
                                                                            --
                                                                        </option>
                                                                        {kodeLembur.map(
                                                                            (
                                                                                kL: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            kL.KODE_LEMBUR_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            kL.KODE_LEMBUR_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    <select
                                                                        className={
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                6 ||
                                                                            isWeekEnd(
                                                                                item.LEMBUR_DATE
                                                                            ) ==
                                                                                0
                                                                                ? " bg-red-500 "
                                                                                : "" +
                                                                                  "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        }
                                                                        value={
                                                                            item.SHIFT_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputDetailLembur(
                                                                                "SHIFT_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Pilih
                                                                            Shift
                                                                            --
                                                                        </option>
                                                                        {shiftFromAttendanceSetting.map(
                                                                            (
                                                                                sf: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            sf.ATTENDANCE_SETTING_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            sf.ATTENDANCE_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    {
                                                                        item.LEMBUR_IN
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    {
                                                                        item.LEMBUR_OUT
                                                                    }
                                                                </td>
                                                                <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                    {
                                                                        item.JUMLAH_JAM_LEMBUR
                                                                    }
                                                                </td>
                                                                <td className="p-2 border">
                                                                    <div className="text-center ">
                                                                        <Checkbox
                                                                            defaultChecked={
                                                                                item.UANG_MAKAN !=
                                                                                    "" &&
                                                                                item.UANG_MAKAN !=
                                                                                    0
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            name={
                                                                                "uang_makan-" +
                                                                                i
                                                                            }
                                                                            id={
                                                                                item.UANG_MAKAN
                                                                            }
                                                                            value={
                                                                                item.UANG_MAKAN
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                inputDetailLembur(
                                                                                    "UANG_MAKAN",
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                                    i
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                                {/* <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                    <input type="checkbox" />
                                                                </td> */}
                                                                <td className="border px-2 py-1 text-right whitespace-nowrap text-sm">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        item.TOTAL_UANG_LEMBUR
                                                                    )}
                                                                </td>
                                                                <td className="border px-2 py-1 text-right whitespace-nowrap text-sm">
                                                                    {new Intl.NumberFormat(
                                                                        "id",
                                                                        {
                                                                            style: "decimal",
                                                                        }
                                                                    ).format(
                                                                        item.LEMBUR_UANG_MAKAN
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </>
                    }
                />
            )}

            {dataEditLembur && (
                <ModalToAction
                    buttonAddOns={"Delete"}
                    actionDelete={deleteLembur}
                    show={modal.modalEditLembur}
                    onClose={() => {
                        setModal({
                            modalEditLembur: false,
                        }),
                            setDataEditLembur({});
                    }}
                    headers={{ "Content-type": "multipart/form-data" }}
                    submitButtonName={"Edit"}
                    cancelButtonName={"Close"}
                    title={"Edit Lembur"}
                    url={`/editLembur`}
                    method={"post"}
                    data={dataEditLembur}
                    onSuccess={handleSuccessLembur}
                    classPanel={
                        "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                    }
                    body={
                        <>
                            <div className="bg-white shadow-md rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Nama Karyawan{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={dataEditLembur.EMPLOYEE_ID}
                                            onChange={(e) =>
                                                editLembur(
                                                    "EMPLOYEE_ID",
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                        >
                                            <option value={""}>
                                                -- <i>Select Employee</i> --
                                            </option>
                                            {listEmployee.map(
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
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Awal Lembur{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative ">
                                            <DatePicker
                                                selected={
                                                    dataEditLembur.TANGGAL_PERIODE
                                                }
                                                onChange={(date: any) =>
                                                    editLembur(
                                                        "TANGGAL_PERIODE",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Input{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative mt-1">
                                            <DatePicker
                                                selected={
                                                    dataEditLembur.TANGGAL
                                                }
                                                onChange={(date: any) =>
                                                    editLembur(
                                                        "TANGGAL",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">
                                            Tanggal Akhir Lembur{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative mt-1">
                                            <DatePicker
                                                selected={
                                                    dataEditLembur.TANGGAL_PERIODE_2
                                                }
                                                onChange={(date: any) =>
                                                    editLembur(
                                                        "TANGGAL_PERIODE_2",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                required
                                                showMonthDropdown
                                                showYearDropdown
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700">
                                            Periode Penggajian
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                dataEditLembur.PERIODE_PENGGAJIAN
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            readOnly
                                        />
                                    </div>
                                    {/* <div className="grid grid-cols-2">
                                        <div className="mt-6 text-center">
                                            {dataEditLembur.EMPLOYEE_ID ? (
                                                <button
                                                    type="button"
                                                    className="p-2 rounded-md bg-red-600 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                                    onClick={setDetailLembur}
                                                >
                                                    <span className="">
                                                        Generate
                                                    </span>
                                                </button>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div> */}
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-2">
                                        Detail Lembur
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        No
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Hari
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Tanggal
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Attendance Activity
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Tipe Lembur
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Shift
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Masuk
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Pulang
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Jumlah Jam Lembur
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Uang Makan{" "}
                                                        <i className="fas fa-question-circle"></i>
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Uang Lembur
                                                    </th>
                                                    <th className="border px-2 py-1 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Lembur + Uang Makan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {dataEditLembur?.detail?.map(
                                                    (
                                                        itemEdit: any,
                                                        i: number
                                                    ) => (
                                                        <tr
                                                            key={i}
                                                            className={
                                                                isWeekEnd(
                                                                    itemEdit.LEMBUR_DATE
                                                                ) == 6 ||
                                                                isWeekEnd(
                                                                    itemEdit.LEMBUR_DATE
                                                                ) == 0
                                                                    ? "text-red-500"
                                                                    : "text-gray-500"
                                                            }
                                                        >
                                                            <td className="border text-center px-2 py-1 whitespace-nowrap text-sm ">
                                                                {i + 1}
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                {dateFormat(
                                                                    itemEdit.LEMBUR_DATE,
                                                                    "dddd"
                                                                )}
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                {dateFormat(
                                                                    itemEdit.LEMBUR_DATE,
                                                                    "dd mmm yyyy"
                                                                )}
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                <select
                                                                    className={
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) ==
                                                                            6 ||
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) == 0
                                                                            ? "text-red-500 text-sm rounded-md shadow-sm"
                                                                            : "" +
                                                                              "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    }
                                                                    value={
                                                                        itemEdit.ADDITIONAL_ALLOWANCE_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editDetailLembur(
                                                                            "ADDITIONAL_ALLOWANCE_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        --
                                                                        Choose
                                                                        One --
                                                                    </option>
                                                                    {additionalAllowance.map(
                                                                        (
                                                                            aA: any,
                                                                            i: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        aA.ADDITIONAL_ALLOWANCE_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        aA.ADDITIONAL_ALLOWANCE_NAME
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                <select
                                                                    className={
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) ==
                                                                            6 ||
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) == 0
                                                                            ? "text-red-500 text-sm rounded-md shadow-sm"
                                                                            : "" +
                                                                              "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    }
                                                                    value={
                                                                        itemEdit.KODE_LEMBUR
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editDetailLembur(
                                                                            "KODE_LEMBUR",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        -- Pilih
                                                                        Kode
                                                                        Lembur
                                                                        --
                                                                    </option>
                                                                    {kodeLembur.map(
                                                                        (
                                                                            kL: any,
                                                                            i: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        kL.KODE_LEMBUR_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        kL.KODE_LEMBUR_NAME
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                <select
                                                                    className={
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) ==
                                                                            6 ||
                                                                        isWeekEnd(
                                                                            itemEdit.LEMBUR_DATE
                                                                        ) == 0
                                                                            ? "text-red-500 text-sm rounded-md shadow-sm"
                                                                            : "" +
                                                                              "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    }
                                                                    value={
                                                                        itemEdit.SHIFT_ID
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        editDetailLembur(
                                                                            "SHIFT_ID",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            ""
                                                                        }
                                                                    >
                                                                        -- Pilih
                                                                        Shift --
                                                                    </option>
                                                                    {shiftFromAttendanceSetting.map(
                                                                        (
                                                                            sf: any,
                                                                            i: number
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        sf.ATTENDANCE_SETTING_ID
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        sf.ATTENDANCE_NAME
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                {
                                                                    itemEdit.LEMBUR_IN
                                                                }
                                                            </td>
                                                            <td className="border px-2 py-1 whitespace-nowrap text-sm">
                                                                {
                                                                    itemEdit.LEMBUR_OUT
                                                                }
                                                            </td>
                                                            <td className="border px-2 py-1 text-center whitespace-nowrap text-sm">
                                                                {
                                                                    itemEdit.JUMLAH_JAM_LEMBUR
                                                                }
                                                            </td>
                                                            <td className="p-2 border">
                                                                <div className="text-center ">
                                                                    <Checkbox
                                                                        defaultChecked={
                                                                            itemEdit.UANG_MAKAN !=
                                                                                "" &&
                                                                            parseInt(
                                                                                itemEdit.UANG_MAKAN
                                                                            ) !=
                                                                                0
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        name={
                                                                            "uang_makan-" +
                                                                            i
                                                                        }
                                                                        id={
                                                                            "uang_makan-" +
                                                                            i
                                                                        }
                                                                        value={
                                                                            itemEdit.UANG_MAKAN
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            editDetailLembur(
                                                                                "UANG_MAKAN",
                                                                                e
                                                                                    .target
                                                                                    .checked,
                                                                                i
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>
                                                            {/* <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                                                    <input type="checkbox" />
                                                                </td> */}
                                                            <td className="border px-2 py-1 text-right whitespace-nowrap text-sm">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    itemEdit.TOTAL_UANG_LEMBUR
                                                                )}
                                                            </td>
                                                            <td className="border px-2 py-1 text-right whitespace-nowrap text-sm">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    itemEdit.LEMBUR_UANG_MAKAN
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
                        </>
                    }
                />
            )}

            {/* End Modal Register Lembur */}

            <div className="grid grid-cols-4 gap-4  xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <Button
                        className="p-2"
                        onClick={() => {
                            handleRegisterLembur();
                        }}
                    >
                        {"Register Lembur"}
                    </Button>

                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-2">
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={searchDate.lembur_search[0].YEAR}
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
                                    value={searchDate.lembur_search[0].MONTH}
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
                    </div>
                </div>

                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchDate.lembur_search}
                            // loading={isLoading.get_policy}
                            url={"getRequestLemburAgGrid"}
                            doubleClickEvent={handleEditModal}
                            triggeringRefreshData={successSearch}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.2,
                                },
                                {
                                    headerName: "Nama",
                                    flex: 3,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return getEmployeeById(
                                                params.data.EMPLOYEE_ID
                                            )
                                                ? getEmployeeById(
                                                      params.data.EMPLOYEE_ID
                                                  ).EMPLOYEE_FIRST_NAME
                                                : "-";
                                        }
                                    },
                                },
                                {
                                    headerName: "Periode",
                                    flex: 3,
                                    field: "PERIODE_PENGGAJIAN",
                                },
                                {
                                    headerName: "Total Lembur",
                                    flex: 4,
                                    type: "rightAligned",
                                    // field: "LEMBUR_UANG_MAKAN",
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return new Intl.NumberFormat("id", {
                                                style: "decimal",
                                            }).format(
                                                params.data.LEMBUR_UANG_MAKAN
                                            );
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
