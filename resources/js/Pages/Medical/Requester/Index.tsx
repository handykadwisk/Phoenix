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
import { ArrowDownTrayIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function Index({ auth }: PageProps) {
    const { selectYear, listMaternity }: any = usePage().props;

    const employee: any = auth.user.employee;

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
    // const [selectYear, setSelectYear] = useState<any>([]);

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

    useEffect(() => {
        getSalaryByEmployee(employee.EMPLOYEE_ID)
        getMedicalByEmployee(employee.EMPLOYEE_ID);
    }, []);
    
    
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
        const items = { ...dataRequestMedical };
        const details = data;

        const currentMedical = details?.reduce(
            (total: any, currentValue: any) =>
                (total = parseInt(total) + parseInt(currentValue.AMOUNT)),
            0
        );

         const buttonSubmit = document.getElementById(
             "buttonSubmitModalToAdd"
         ) as HTMLButtonElement;
        if (parseInt(totalMedical + currentMedical) > employeeSalary) {
            setValidation(true);
            buttonSubmit.disabled = true;
        } else {
            setValidation(false);
            buttonSubmit.disabled = false;
        }
    }

    const [successSearch, setSuccessSearch] = useState<string>("");
    const [searchDate, setSearchDate] = useState<any>({
        medical_search: [
            {
                EMPLOYEE_ID: employee.EMPLOYEE_ID,
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
    
    const clearSearch = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("YEAR", "", 0);
    };

    const [maternityLimit, setMaternityLimit] = useState<number>(0);
    const getMaternityByGradeId = (id: any) => {
        const data = listMaternity;
        const result = data.find((value: any) => value.GRADE_ID == id);
        return result ? result : null;
    };

    const inputMedical = (name: string, value: any) => {
        const items = { ...dataRequestMedical };
        
        if (name == "MEDICAL_TYPE") {
            if (value == '2') {
                // getMaternity
                setMaternityLimit(
                    parseInt(
                        getMaternityByGradeId(
                            employee.structure.COMPANY_GRADE_ID
                        ).MATERNITY_LIMIT_AMOUNT
                    )
                );
                inputDetailMedical("DESCRIPTION", "Maternity", 0);
                inputDetailMedical("AMOUNT", 0, 0);
            } else {
                setMaternityLimit(
                    0
                );
                inputDetailMedical("DESCRIPTION", "", 0);
                inputDetailMedical("AMOUNT", 0, 0);
            }
            
        }
        const details = [items.detail];

        items[name] = value;
        setDataRequestMedical(items);
    };

    const [validationMaternity, setValidationMaternity] = useState<boolean>(false);
    const inputDetailMedical = (name: string, value: any, i: any) => {
        const items = { ...dataRequestMedical };
        const details = [...dataRequestMedical.detail];

        if (items.MEDICAL_TYPE == 2) {
            // setMaternityLimit
            if (name == "AMOUNT" && value > maternityLimit) {
                console.log('melebihi maternity limit')
                value = maternityLimit
                setValidationMaternity(true)
            } else {
                setValidationMaternity(false);
            }
        }

        details[i][name] = value;
        setDataRequestMedical({
            ...dataRequestMedical,
            detail: details,
        });
        cekValidasiRequest(details);
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
        cekValidasiRequest(val);
    };

    // Request Medical
    const [modal, setModal] = useState<any>({
        modalRequestMedical: false,
        modalEditRequestMedical: false,
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
        setValidation(false);
        setValidationMaternity(false);
        const items = { ...fieldDataRequestMedical };
        items["EMPLOYEE_ID"] = employee.EMPLOYEE_ID;
        items["COMPANY_ID"] = employee.COMPANY_ID;
        items["DIVISION_ID"] = employee.DIVISION_ID;
        items["STRUCTURE_ID"] = employee.STRUCTURE_ID;
        items["REQUEST_DATE"] = dateFormat(new Date(), "dd-mm-yyyy");
        setDataRequestMedical(items);
        getSalaryByEmployee(employee.EMPLOYEE_ID);
        getMedicalByEmployee(employee.EMPLOYEE_ID);
        setModal({
            modalRequestMedical: true,
            modalEditRequestMedical: false,
        });
    };

    const handleSuccessRequestMedical = (message: any) => {
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
            modalEditRequestMedical: false,
        });
    };

    // End Request Medical

    const [isSuccess, setIsSuccess] = useState<string>("");

    // Edit Medical

    const [editRequestMedical, setEditRequestMedical] = useState<any>({});
    const getMedical = async (medicalId: any) => {
        await axios
            .get(`/getRequestMedicalById/${medicalId}`)
            .then((res) => setEditRequestMedical(res.data))
            .catch((err) => console.log(err));
    };

    const handleEditModal = async (data: any) => {
        getMedical(data.MEDICAL_ID);
        
        getSalaryByEmployee(data.EMPLOYEE_ID);
        getMedicalByEmployee(data.EMPLOYEE_ID);

        setModal({
            modalRequestMedical: false,
            modalEditRequestMedical: !modal.modalEditRequestMedical,
        });
        setValidationEdit(false);
    };

    const [validationEdit, setValidationEdit] = useState<boolean>(false);
    const cekValidasiEdit = (data:any) => {
        const items = { ...editRequestMedical };
        const details = data;

        const currentMedical = details?.reduce(
            (total: any, currentValue: any) =>
                (total = parseInt(total) + parseInt(currentValue.AMOUNT)),
            0
        );

        const buttonSubmit = document.getElementById(
            "buttonSubmitModalToAdd"
        ) as HTMLButtonElement;
        if (parseInt(totalMedical + currentMedical) > employeeSalary) {
            setValidationEdit(true);
            buttonSubmit.disabled = true;
        } else {
            setValidationEdit(false);
            buttonSubmit.disabled = false;
        }

    };
    

    const editMedical = (name: string, value: any) => {
        const items = { ...editRequestMedical };
        const details = [items.request_time_off];

        items[name] = value;
        setEditRequestMedical(items);
        setValidationMaternityEdit(false);
    };

    const [validationMaternityEdit, setValidationMaternityEdit] = useState<boolean>(false);
    const editDetailMedical = (name: string, value: any, i: any) => {
        const items = { ...editRequestMedical };
        const details = [...editRequestMedical.detail];
        
        if (items.MEDICAL_TYPE == 2) {
            // setMaternityLimit
            if (name == "AMOUNT" && value > maternityLimit) {
                console.log("melebihi maternity limit");
                value = maternityLimit;
                setValidationMaternityEdit(true);
            } else {
                setValidationMaternityEdit(false);
            }
        }

        details[i][name] = value;
        setEditRequestMedical({
            ...editRequestMedical,
            detail: details,
        });
        cekValidasiEdit(details);
    };

    const deleteRowEditDetailMedical = (i: number) => {
        const val = [...editRequestMedical.detail];
        val.splice(i, 1);
        setEditRequestMedical({
            ...editRequestMedical,
            detail: val,
        });
        cekValidasiEdit(val)
    };

    const addRowEditDetailMedical = (e: FormEvent) => {
        e.preventDefault();
        setEditRequestMedical({
            ...editRequestMedical,
            detail: [
                ...editRequestMedical.detail,
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
            text: "You won't be able to revert this!!",
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

    const cancelRequestMedical = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Cancel this Request Medical?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setModal({
                    modalRequestMedical: false,
                    modalEditRequestMedical: false,
                });
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
                                "Request Medical has been canceled.",
                                "success"
                            );
                        } else {
                            Swal.fire(
                                "Failed!",
                                "Failed Canceled Request Medical."
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
                        "There was an error canceled request Medical.",
                        "error"
                    );
                }
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Medical Benefit"}>
            <Head title="Medical Benefit" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Request Medical */}

            <ModalToAdd
                buttonAddOns={""}
                show={modal.modalRequestMedical}
                onClose={() =>
                    setModal({
                        modalRequestMedical: false,
                    })
                }
                title={"Request Medical Benefit"}
                url={`/requestMedical`}
                data={dataRequestMedical}
                onSuccess={handleSuccessRequestMedical}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div>
                            <div className="relative mt-2">
                                <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
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
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
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
                                    htmlFor="jabatan"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
                                >
                                    Jabatan
                                </label>
                                <input
                                    id="jabatan"
                                    name="jabatan"
                                    type="text"
                                    readOnly
                                    value={
                                        employee
                                            ? employee.structure
                                                  .COMPANY_STRUCTURE_NAME
                                            : null
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="request_date"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
                                >
                                    Request Date
                                </label>
                                <input
                                    id="request_date"
                                    name="request_date"
                                    type="text"
                                    readOnly
                                    value={dataRequestMedical.REQUEST_DATE}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900">
                                    Medical Type
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataRequestMedical.MEDICAL_TYPE}
                                    onChange={(e) =>
                                        inputMedical(
                                            "MEDICAL_TYPE",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {medicalType.map((item: any, i: number) => {
                                        return (
                                            <option key={i} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="sisa_medical"
                                    className="absolute font-bold -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs  text-gray-900"
                                >
                                    Sisa Medical
                                </label>
                                <input
                                    id="sisa_medical"
                                    name="sisa_medical"
                                    type="text"
                                    readOnly
                                    value={(
                                        employeeSalary - totalMedical
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {dataRequestMedical.MEDICAL_TYPE == 2 && (
                                <div className="relative mt-4">
                                    <label
                                        htmlFor="maternity_limit"
                                        className="absolute font-bold -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs  text-gray-900"
                                    >
                                        Maternity Limit
                                    </label>
                                    <input
                                        id="maternity_limit"
                                        name="maternity_limit"
                                        type="text"
                                        readOnly
                                        value={maternityLimit.toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            )}

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                                <table className="table-fixed w-full mb-4">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-12 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                No.
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Description
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-12 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            ></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {dataRequestMedical?.detail.map(
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
                                                    <td className="border text-sm border-[#eee] py-1 px-1.5 dark:border-strokedark">
                                                        <input
                                                            id="description"
                                                            name="description"
                                                            type="text"
                                                            value={
                                                                dO.DESCRIPTION
                                                            }
                                                            onChange={(
                                                                e: any
                                                            ) => {
                                                                inputDetailMedical(
                                                                    "DESCRIPTION",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="border text-sm border-[#eee] py-1 px-1.5 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="amount"
                                                            name="AMOUNT"
                                                            value={dO.AMOUNT}
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                inputDetailMedical(
                                                                    "AMOUNT",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                            required
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
                                                                    deleteRow(
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
                                            <td className="border-b p-2 font-bold text-right pr-4">
                                                {dataRequestMedical?.detail
                                                    ?.reduce(
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
                                                    .toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                            </td>
                                            <td className="border-b p-2"></td>
                                        </tr>
                                        {validation && (
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="bg-red-100 text-red-700 p-1 border border-red-500">
                                                        {"Medical Reimburst                                                        melebihi sisa medical.                                                        Sisa: " +
                                                            (
                                                                employeeSalary -
                                                                totalMedical
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
                                        {validationMaternity && (
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="bg-red-100 text-red-700 p-1 border border-red-500">
                                                        {"Limit Maternity sebesar : " +
                                                            maternityLimit.toLocaleString(
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

                                        {dataRequestMedical.MEDICAL_TYPE ==
                                        "1" ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className=" h-10 w-40 mb-2 mt-1"
                                                >
                                                    <a
                                                        href=""
                                                        className="text-xs mt-1 text-white ms-1 py-1 px-2 bg-red-500 rounded-md"
                                                        onClick={(e) =>
                                                            addRowDetail(e)
                                                        }
                                                    >
                                                        + Add Row
                                                    </a>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-3">
                                <InputLabel value="File Upload" />
                                <Input
                                    type="file"
                                    onChange={(e: any) => {
                                        inputMedical(
                                            "document",
                                            e.target.files
                                        );
                                    }}
                                    multiple
                                    className="mt-1 bg-white ring-white shadow-xl"
                                />
                            </div>
                        </div>
                    </>
                }
            />

            <ModalToAdd
                disableSubmit={editRequestMedical.STATUS != null && true}
                buttonAddOns={""}
                show={modal.modalEditRequestMedical}
                onClose={() =>
                    setModal({
                        modalEditRequestMedical: false,
                    })
                }
                title={"Edit Medical Benefit"}
                url={`/editRequestMedical`}
                data={editRequestMedical}
                onSuccess={handleSuccessRequestMedical}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div>
                            <div className="relative mt-2">
                                <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
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
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
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
                                    htmlFor="jabatan"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
                                >
                                    Jabatan
                                </label>
                                <input
                                    id="jabatan"
                                    name="jabatan"
                                    type="text"
                                    readOnly
                                    value={
                                        employee
                                            ? employee.structure
                                                  .COMPANY_STRUCTURE_NAME
                                            : null
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="request_date"
                                    className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900"
                                >
                                    Request Date
                                </label>
                                <input
                                    id="request_date"
                                    name="request_date"
                                    type="text"
                                    readOnly
                                    value={editRequestMedical.REQUEST_DATE}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative mt-4">
                                <label className="absolute -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs font-bold text-gray-900">
                                    Medical Type
                                </label>
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={editRequestMedical.MEDICAL_TYPE}
                                    onChange={(e) =>
                                        editMedical(
                                            "MEDICAL_TYPE",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value={""}>
                                        -- <i>Choose One</i> --
                                    </option>
                                    {medicalType.map((item: any, i: number) => {
                                        return (
                                            <option key={i} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="relative mt-4">
                                <label
                                    htmlFor="sisa_medical"
                                    className="absolute font-bold -top-2 left-2 inline-block rounded-md bg-white px-1 text-xs  text-gray-900"
                                >
                                    Sisa Medical
                                </label>
                                <input
                                    id="sisa_medical"
                                    name="sisa_medical"
                                    type="text"
                                    readOnly
                                    value={(
                                        employeeSalary - totalMedical
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                                <table className="table-fixed w-full mb-4">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-12 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                No.
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Description
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-40 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                rowSpan={2}
                                                scope="col"
                                                className="py-2 pl-4 pr-3 w-12 text-center text-sm font-semibold text-gray-900 sm:pl-3 border-[1px]"
                                            ></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {editRequestMedical.detail?.map(
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
                                                    <td className="border text-sm border-[#eee] py-1 px-1.5 dark:border-strokedark">
                                                        <input
                                                            id="description"
                                                            name="description"
                                                            type="text"
                                                            value={
                                                                dO.DESCRIPTION
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
                                                    <td className="border text-sm border-[#eee] py-1 px-1.5 dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="amount"
                                                            name="AMOUNT"
                                                            value={dO.AMOUNT}
                                                            decimalScale={2}
                                                            decimalsLimit={2}
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
                                            <td className="border-b p-2 font-bold text-right pr-4">
                                                {editRequestMedical?.detail
                                                    ?.reduce(
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
                                                    .toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                            </td>
                                            <td className="border-b p-2"></td>
                                        </tr>
                                        {validationEdit && (
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="bg-red-100 text-red-700 p-1 border border-red-500">
                                                        {"Medical Reimburst                                                        melebihi sisa medical.                                                        Sisa: " +
                                                            (
                                                                employeeSalary -
                                                                totalMedical
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
                                        {validationMaternityEdit && (
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="bg-red-100 text-red-700 p-1 border border-red-500">
                                                        {"Limit Maternity sebesar : " +
                                                            maternityLimit.toLocaleString(
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
                                        {editRequestMedical.STATUS == null &&
                                        editRequestMedical.MEDICAL_TYPE ==
                                            "1" ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className=" h-10 w-40 mb-2 mt-1"
                                                >
                                                    <a
                                                        href=""
                                                        className="text-xs mt-1 text-white ms-1 py-1 px-2 bg-red-500 rounded-md"
                                                        onClick={(e) =>
                                                            addRowEditDetailMedical(
                                                                e
                                                            )
                                                        }
                                                    >
                                                        + Add Row
                                                    </a>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-3">
                                <InputLabel value="File Upload" />
                                <Input
                                    type="file"
                                    onChange={(e: any) => {
                                        editMedical(
                                            "document_new",
                                            e.target.files
                                        );
                                    }}
                                    multiple
                                    className="mt-1 bg-white ring-white shadow-xl"
                                />
                                {editRequestMedical?.document &&
                                    editRequestMedical.document?.map(
                                        (doc: any, i: number) => (
                                            <div className="grid-cols-2 grid gap-4 ml-1 mt-4 mb-4">
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
                                                    {editRequestMedical.STATUS ==
                                                        null && (
                                                        <span>
                                                            <XMarkIcon
                                                                className="w-7 text-red-600 hover:cursor-pointer"
                                                                title="Delete Images"
                                                                onClick={(e) =>
                                                                    alertDelete(
                                                                        doc.DOCUMENT_ID,
                                                                        editRequestMedical.MEDICAL_ID
                                                                    )
                                                                }
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </>
                }
            />

            {/* End Modal Request Medical */}

            <div className="grid grid-cols-4 gap-4  xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    {employee.EMPLOYEE_CATEGORY == 1 && (
                        <div className="bg-white mb-4 rounded-md shadow-md p-4">
                            <Button
                                className="p-2"
                                onClick={() => {
                                    handleRequestMedical();
                                }}
                            >
                                {"Request Medical"}
                            </Button>
                        </div>
                    )}

                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
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
                        {/* <select
                            className="block w-44 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            value={searchDate.medical_search[0].DATE}
                            onChange={(e) => {
                                inputDataSearch("DATE", e.target.value, 0);
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
                                    <option key={i} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select> */}
                        {/* <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchDate.medical_search[0].DATE != ""
                                    ) {
                                        inputDataSearch(
                                            "DATE",
                                            searchDate.medical_search[0].DATE,
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
                            url={"getRequestMedicalAgGrid"}
                            doubleClickEvent={handleEditModal}
                            triggeringRefreshData={successSearch}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.2,
                                },
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
                                    headerName: "Medical Amount",
                                    flex: 4,
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
