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
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    CreditCardIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilIcon,
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

export default function EmploymentDetail({
    idEmployee,
    taxStatus,
    setIsSuccess,
}: // handleSuccessEmployment,
PropsWithChildren<{
    idEmployee: any;
    taxStatus: any;
    setIsSuccess: any;
}>) {
    useEffect(() => {
        getEmployee(idEmployee);
    }, [idEmployee]);
    const [dataDetailEmployee, setDataDetailEmployee] = useState<any>([]);
    const getEmployee = async (id: string) => {
        await axios
            .post(`/getEmployeeDetail`, { id })
            .then((res) => {
                setDataDetailEmployee(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [tab, setTab] = useState<any>({
        nameTab: "Employee",
        currentTab: true,
    });
    const tabs = [
        { name: "Employee", href: "#", current: true },
        { name: "Education", href: "#", current: false },
        { name: "Certificate", href: "#", current: false },
        { name: "Document", href: "#", current: false },
    ];

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    const [modalEmployment, setModalEmployment] = useState<any>({
        add: false,
        edit: false,
    });

    const { data, setData, errors, reset } = useForm<any>({
        EMPLOYEE_ID: idEmployee,
        EMPLOYEE_NUMBER_ID: "",
        EMPLOYEE_CATEGORY: "",
        EMPLOYEE_IS_DELETED: "",
        TAX_STATUS_ID: "",
        EMPLOYEE_HIRE_DATE: "",
        EMPLOYEE_END_DATE: "",
        EMPLOYEE_SALARY_ADJUSTMENT1: "",
        EMPLOYEE_SALARY_ADJUSTMENT2: "",
        EMPLOYEE_RECRUITMENT_LOCATION: "",
    });

    const handleSuccessEditEmployee = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setData({
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_NUMBER_ID: "",
                EMPLOYEE_CATEGORY: "",
                EMPLOYEE_IS_DELETED: "",
                TAX_STATUS_ID: "",
                EMPLOYEE_HIRE_DATE: "",
                EMPLOYEE_END_DATE: "",
                EMPLOYEE_SALARY_ADJUSTMENT1: "",
                EMPLOYEE_SALARY_ADJUSTMENT2: "",
                EMPLOYEE_RECRUITMENT_LOCATION: "",
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const handleEditEmployment = async (e: FormEvent) => {
        setModalEmployment({
            add: false,
            edit: !modalEmployment.edit,
        });
        setDataById(dataDetailEmployee);
    };

    const [dataById, setDataById] = useState<any>({
        EMPLOYEE_ID: idEmployee,
        EMPLOYEE_NUMBER_ID: "",
        EMPLOYEE_CATEGORY: "",
        EMPLOYEE_IS_DELETED: "",
        TAX_STATUS_ID: "",
        EMPLOYEE_HIRE_DATE: "",
        EMPLOYEE_END_DATE: "",
        EMPLOYEE_SALARY_ADJUSTMENT1: "",
        EMPLOYEE_SALARY_ADJUSTMENT2: "",
        EMPLOYEE_RECRUITMENT_LOCATION: "",
    });

    // modal add education
    const [modalEducation, setModalEducation] = useState<any>({
        add: false,
        edit: false,
    });

    const [dataEducationDegree, setDataEducationDegree] = useState<any>([]);
    const getEducationDegree = async () => {
        await axios
            .post(`/getEducationDegree`)
            .then((res) => {
                setDataEducationDegree(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAddEducation = async (e: FormEvent) => {
        setModalEducation({
            add: !modalEducation.add,
        });
        getEducationDegree();
    };

    // data add education
    const [dataEducation, setDataEducation] = useState<any>({
        dataEducations: [
            {
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_EDUCATION_START: "",
                EMPLOYEE_EDUCATION_END: "",
                EDUCATION_DEGREE_ID: "",
                EMPLOYEE_EDUCATION_MAJOR: "",
                EMPLOYEE_EDUCATION_SCHOOL: "",
            },
        ],
    });

    const handleSuccessAddEducation = (message: string) => {
        setIsSuccess("");
        if (message !== "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const inputEducation = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEducation.dataEducations];
        changeVal[i][name] = value;
        setDataEducation({
            ...dataEducation,
            dataEducations: changeVal,
        });
    };

    const addRowAddEducation = (e: FormEvent) => {
        e.preventDefault();
        setDataEducation({
            ...dataEducation,
            dataEducations: [
                ...dataEducation.dataEducations,
                {
                    EMPLOYEE_ID: idEmployee,
                    EMPLOYEE_EDUCATION_START: "",
                    EMPLOYEE_EDUCATION_END: "",
                    EDUCATION_DEGREE_ID: "",
                    EMPLOYEE_EDUCATION_MAJOR: "",
                    EMPLOYEE_EDUCATION_SCHOOL: "",
                },
            ],
        });
    };

    // data Edit education
    const [dataEditEducation, setDataEditEducation] = useState<any>({
        employee_education: [
            {
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_EDUCATION_START: "",
                EMPLOYEE_EDUCATION_END: "",
                EDUCATION_DEGREE_ID: "",
                EMPLOYEE_EDUCATION_MAJOR: "",
                EMPLOYEE_EDUCATION_SCHOOL: "",
            },
        ],
    });

    const handleEditEducation = async (e: FormEvent) => {
        setModalEducation({
            edit: !modalEducation.edit,
        });
        setDataEditEducation({
            employee_education: dataDetailEmployee.employee_education,
        });
        getEducationDegree();
    };

    const handleSuccessEditEducation = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const inputEditEducation = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditEducation.employee_education];
        changeVal[i][name] = value;
        setDataEditEducation({
            ...dataEditEducation,
            employee_education: changeVal,
        });
    };

    const addRowEditEducation = (e: FormEvent) => {
        e.preventDefault();
        setDataEditEducation({
            ...dataEditEducation,
            employee_education: [
                ...dataEditEducation.employee_education,
                {
                    EMPLOYEE_ID: idEmployee,
                    EMPLOYEE_EDUCATION_START: "",
                    EMPLOYEE_EDUCATION_END: "",
                    EDUCATION_DEGREE_ID: "",
                    EMPLOYEE_EDUCATION_MAJOR: "",
                    EMPLOYEE_EDUCATION_SCHOOL: "",
                },
            ],
        });
    };

    const [dataQualification, setDataQualification] = useState<any>([]);
    const getQualification = async () => {
        await axios
            .post(`/getQualification`)
            .then((res) => {
                setDataQualification(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // modal add certificate
    const [modalCertificate, setModalCertificate] = useState<any>({
        add: false,
        edit: false,
    });

    const handleAddCertificate = async (e: FormEvent) => {
        setModalCertificate({
            add: !modalCertificate.add,
        });
        getQualification();
    };

    // data add certificate
    const [dataCertificate, setDataCertificate] = useState<any>({
        dataCertificates: [
            {
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_CERTIFICATE_NAME: "",
                EMPLOYEE_CERTIFICATE_IS_QUALIFICATION: "",
                CERTIFICATE_QUALIFICATION_ID: "",
                EMPLOYEE_CERTIFICATE_POINT: "",
                EMPLOYEE_CERTIFICATE_START_DATE: "",
                EMPLOYEE_CERTIFICATE_EXPIRES_DATE: "",
            },
        ],
    });

    const handleSuccessAddCertificate = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const inputAddCertificate = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataCertificate.dataCertificates];
        changeVal[i][name] = value;
        setDataCertificate({
            ...dataCertificate,
            dataCertificates: changeVal,
        });
    };

    const addRowAddCertificate = (e: FormEvent) => {
        e.preventDefault();
        setDataCertificate({
            ...dataCertificate,
            dataCertificates: [
                ...dataCertificate.dataCertificates,
                {
                    EMPLOYEE_ID: idEmployee,
                    EMPLOYEE_CERTIFICATE_NAME: "",
                    EMPLOYEE_CERTIFICATE_IS_QUALIFICATION: "",
                    CERTIFICATE_QUALIFICATION_ID: "",
                    EMPLOYEE_CERTIFICATE_POINT: "",
                    EMPLOYEE_CERTIFICATE_START_DATE: "",
                    EMPLOYEE_CERTIFICATE_EXPIRES_DATE: "",
                },
            ],
        });
    };

    // data edit certificate
    const [dataEditCertificate, setDataEditCertificate] = useState<any>({
        employee_certificate: [
            {
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_CERTIFICATE_NAME: "",
                EMPLOYEE_CERTIFICATE_IS_QUALIFICATION: "",
                CERTIFICATE_QUALIFICATION_ID: "",
                EMPLOYEE_CERTIFICATE_POINT: "",
                EMPLOYEE_CERTIFICATE_START_DATE: "",
                EMPLOYEE_CERTIFICATE_EXPIRES_DATE: "",
            },
        ],
    });

    const handleEditCertificate = async (e: FormEvent) => {
        setModalCertificate({
            edit: !modalCertificate.edit,
        });
        setDataEditCertificate({
            employee_certificate: dataDetailEmployee.employee_certificate,
        });
        if (
            dataEditCertificate.employee_certificate[0][
                "CERTIFICATE_QUALIFICATION_ID"
            ] === null
        ) {
            inputEditCertificate("CERTIFICATE_QUALIFICATION_ID", "", 0);
        }

        getQualification();
    };

    const inputEditCertificate = (
        name: string,
        value: string | undefined | number,
        i: number
    ) => {
        const changeVal: any = [...dataEditCertificate.employee_certificate];
        changeVal[i][name] = value;
        setDataEditCertificate({
            ...dataEditCertificate,
            employee_certificate: changeVal,
        });
    };

    const handleSuccessEditCertificate = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const addRowEditCertificate = (e: FormEvent) => {
        e.preventDefault();
        setDataEditCertificate({
            ...dataEditCertificate,
            employee_certificate: [
                ...dataEditCertificate.employee_certificate,
                {
                    EMPLOYEE_ID: idEmployee,
                    EMPLOYEE_CERTIFICATE_NAME: "",
                    EMPLOYEE_CERTIFICATE_IS_QUALIFICATION: "",
                    CERTIFICATE_QUALIFICATION_ID: "",
                    EMPLOYEE_CERTIFICATE_POINT: "",
                    EMPLOYEE_CERTIFICATE_START_DATE: "",
                    EMPLOYEE_CERTIFICATE_EXPIRES_DATE: "",
                },
            ],
        });
    };

    // modal add document
    const [modalDocument, setModalDocument] = useState<any>({
        add: false,
        edit: false,
    });

    const [flagDocument, setFlagDocument] = useState<string>("");
    const handleAddDocument = async (e: FormEvent, number: number) => {
        e.preventDefault();

        setModalDocument({
            add: !modalDocument.add,
        });
        if (number === 1) {
            setFlagDocument("KTP");
        } else {
            setFlagDocument("Document");
        }
    };

    const [dataDocument, setDataDocument] = useState<any>({
        EMPLOYEE_ID: idEmployee,
        ktp_document: "",
        other_document: "",
    });

    const handleSuccessAddDocument = (message: string) => {
        // setIsSuccess("");\
        if (message !== "") {
            getEmployee(message[0]);
            setIsSuccess(message[1]);
            setDataDocument({
                EMPLOYEE_ID: idEmployee,
                ktp_document: "",
                other_document: "",
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const handleChange = (e: any) => {
        setDataDocument({
            ...dataDocument,
            ktp_document: e.target.files,
        });
    };

    const handleChangeOther = (e: any) => {
        setDataDocument({
            ...dataDocument,
            other_document: e.target.files,
        });
    };

    const handleFileDownload = async (id: number) => {
        await axios({
            url: `/downloadPersonDocument/${id}`,
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
                console.log(err);
                if (err.response.status === 404) {
                    alert("File not Found");
                }
            });
    };

    const alertDelete = async (idDocument: string, idEmployee: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't delete document!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "Deleted!",
                //     text: "Your file has been deleted.",
                //     icon: "success",
                // });
                deleteDocument(idDocument, idEmployee);
            }
        });
    };

    const deleteDocument = async (idDocument: string, idEmployee: string) => {
        await axios
            .post(`/deleteDocument`, { idDocument, idEmployee })
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    text: "Images Delete",
                    icon: "success",
                }).then((result: any) => {
                    if (result.value) {
                        getEmployee(idEmployee);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {/* Edit Document */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalDocument.add}
                onClose={() => {
                    setModalDocument({
                        add: false,
                    });
                }}
                title={"Add Document"}
                url={`/addDocumentPerson`}
                data={dataDocument}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[97%]"
                }
                onSuccess={handleSuccessAddDocument}
                body={
                    <>
                        <div>
                            <div className="bg-white rounded-md p-4">
                                <div className="bg-red-300 rounded-md p-2 mb-2">
                                    <div className="font-semibold text-sm">
                                        <span>
                                            * Document Format: Image or PDF
                                            File.
                                        </span>
                                    </div>
                                </div>
                                {flagDocument === "KTP" ? (
                                    <>
                                        <div>
                                            <span>Photo KTP</span>
                                        </div>
                                        <div>
                                            <input
                                                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                id="file_input"
                                                type="file"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            ></input>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-3">
                                            <span>Other Document</span>
                                        </div>
                                        <div>
                                            <input
                                                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                id="file_input"
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    handleChangeOther(e)
                                                }
                                            ></input>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Certificate */}

            {/* Empolyment add */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEmployment.add}
                onClose={() => {
                    setModalEmployment({
                        add: false,
                    });
                    // getEmployee(idEmployee);
                }}
                title={"Add Employee Detail"}
                url={`/employmentEdit`}
                data={data}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                }
                onSuccess={handleSuccessEditEmployee}
                body={
                    <>
                        <div className="mt-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_NUMBER_ID"
                                        value={"Employee Number Id"}
                                    />
                                    <TextInput
                                        id="EMPLOYEE_NUMBER_ID"
                                        type="text"
                                        name="EMPLOYEE_NUMBER_ID"
                                        value={data.EMPLOYEE_NUMBER_ID}
                                        className="mt-1"
                                        onChange={(e) =>
                                            setData(
                                                "EMPLOYEE_NUMBER_ID",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Employee Number Id"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="EMPLOYEE_CATEGORY"
                                        value={"Category"}
                                    />
                                    <div className="ml-[67px] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_CATEGORY}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_CATEGORY",
                                                e.target.value
                                            );
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- Choose Category --
                                        </option>
                                        <option value={"1"}>Full-time</option>
                                        <option value={"2"}>Contract</option>
                                        <option value={"3"}>Intern</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_IS_DELETED"
                                        value={"Status"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_IS_DELETED}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_IS_DELETED",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Status --
                                        </option>
                                        <option value={"0"}>Active</option>
                                        <option value={"1"}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div
                                className={
                                    data.EMPLOYEE_CATEGORY === "2" ||
                                    data.EMPLOYEE_CATEGORY === "3"
                                        ? "grid grid-cols-3 gap-4 mt-2"
                                        : "grid grid-cols-3 gap-4 mt-2"
                                }
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="TAX_STATUS_ID"
                                        value={"Tax Status"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.TAX_STATUS_ID}
                                        onChange={(e) => {
                                            setData(
                                                "TAX_STATUS_ID",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Tax Status --
                                        </option>
                                        {taxStatus.map((tS: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={tS.TAX_STATUS_ID}
                                                >
                                                    {tS.TAX_STATUS_NAME}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        required={true}
                                        htmlFor="EMPLOYEE_HIRE_DATE"
                                        value={"Hire Date "}
                                    />
                                    <div className="">
                                        <div className="relative max-w-sm ">
                                            <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                            <div className="grid grid-cols-1">
                                                <DatePicker
                                                    selected={
                                                        data.EMPLOYEE_HIRE_DATE
                                                    }
                                                    onChange={(date: any) =>
                                                        setData(
                                                            "EMPLOYEE_HIRE_DATE",
                                                            date.toLocaleDateString(
                                                                "en-CA"
                                                            )
                                                        )
                                                    }
                                                    className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd - mm - yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {data.EMPLOYEE_CATEGORY === "2" ||
                                data.EMPLOYEE_CATEGORY === "3" ? (
                                    <>
                                        <div>
                                            <InputLabel
                                                htmlFor="EMPLOYEE_END_DATE"
                                                value={"End Date "}
                                            />
                                            <div className="">
                                                <div className="relative max-w-sm grid grid-cols-1">
                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                            data.EMPLOYEE_HIRE_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            setData(
                                                                "EMPLOYEE_HIRE_DATE",
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                )
                                                            )
                                                        }
                                                        className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd - mm - yyyy"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_SALARY_ADJUSTMENT1"
                                        value={"First Salary Adjustment "}
                                    />
                                    <div className="grid grid-cols-1">
                                        <div className="relative max-w-sm ">
                                            <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                            <div className="grid grid-cols-1">
                                                <DatePicker
                                                    selected={
                                                        data.EMPLOYEE_SALARY_ADJUSTMENT1
                                                    }
                                                    onChange={(date: any) =>
                                                        setData(
                                                            "EMPLOYEE_SALARY_ADJUSTMENT1",
                                                            date.toLocaleDateString(
                                                                "en-CA"
                                                            )
                                                        )
                                                    }
                                                    className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd - mm - yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_SALARY_ADJUSTMENT2"
                                        value={"Secondary Salary Adjustment "}
                                    />
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 z-9999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                        <div className="grid grid-cols-1">
                                            <DatePicker
                                                selected={
                                                    data.EMPLOYEE_SALARY_ADJUSTMENT2
                                                }
                                                onChange={(date: any) =>
                                                    setData(
                                                        "EMPLOYEE_SALARY_ADJUSTMENT2",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd - mm - yyyy"
                                            />
                                        </div>
                                    </div>
                                    {/* <TextInput
                                        id="EMPLOYEE_SALARY_ADJUSTMENT2"
                                        type="date"
                                        name="EMPLOYEE_SALARY_ADJUSTMENT2"
                                        value={data.EMPLOYEE_SALARY_ADJUSTMENT2}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "EMPLOYEE_SALARY_ADJUSTMENT2",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Secondary Salary Adjustment"
                                    /> */}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="EMPLOYEE_RECRUITMENT_LOCATION"
                                    value="Recruitment Location"
                                />
                                <TextArea
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    id="EMPLOYEE_RECRUITMENT_LOCATION"
                                    name="EMPLOYEE_RECRUITMENT_LOCATION"
                                    defaultValue={
                                        data.EMPLOYEE_RECRUITMENT_LOCATION
                                    }
                                    onChange={(e: any) =>
                                        setData(
                                            "EMPLOYEE_RECRUITMENT_LOCATION",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Employment add */}

            {/* Edit Employment */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEmployment.edit}
                onClose={() => {
                    setModalEmployment({
                        add: false,
                        edit: false,
                    });
                    // getPersonDetail(idEmployee);
                }}
                title={"Edit Detail Employee"}
                url={`/editEmployeeDetail`}
                data={dataById}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[53%]"
                }
                onSuccess={handleSuccessEditEmployee}
                body={
                    <>
                        <div className="mt-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_NUMBER_ID"
                                        value={"Employee Number Id"}
                                    />
                                    <TextInput
                                        id="EMPLOYEE_NUMBER_ID"
                                        type="text"
                                        name="EMPLOYEE_NUMBER_ID"
                                        value={dataById.EMPLOYEE_NUMBER_ID}
                                        className="mt-1"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                EMPLOYEE_NUMBER_ID:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Employee Number Id"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="EMPLOYEE_CATEGORY"
                                        value={"Category"}
                                    />
                                    <div className="ml-[67px] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.EMPLOYEE_CATEGORY}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                EMPLOYEE_CATEGORY:
                                                    e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Category --
                                        </option>
                                        <option value={1}>Full-time</option>
                                        <option value={2}>Contract</option>
                                        <option value={3}>Intern</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_IS_DELETED"
                                        value={"Status"}
                                    />
                                    <select
                                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.EMPLOYEE_IS_DELETED}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                EMPLOYEE_IS_DELETED:
                                                    e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Status --
                                        </option>
                                        <option value={"0"}>Active</option>
                                        <option value={"1"}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div
                                className={
                                    dataById.EMPLOYEE_CATEGORY === 2 ||
                                    dataById.EMPLOYEE_CATEGORY === "2" ||
                                    dataById.EMPLOYEE_CATEGORY === 3 ||
                                    dataById.EMPLOYEE_CATEGORY === "3"
                                        ? "grid grid-cols-3 gap-4 mt-2"
                                        : "grid grid-cols-2 gap-4 mt-2"
                                }
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="TAX_STATUS_ID"
                                        value={"Tax Status"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.TAX_STATUS_ID}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                TAX_STATUS_ID: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Tax Status --
                                        </option>
                                        {taxStatus.map((tS: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={tS.TAX_STATUS_ID}
                                                >
                                                    {tS.TAX_STATUS_NAME}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="EMPLOYEE_HIRE_DATE"
                                        value={"Hire Date "}
                                    />
                                    <div className="ml-[67px] text-red-600">
                                        *
                                    </div>
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 z-9999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                dataById.EMPLOYEE_HIRE_DATE
                                            }
                                            onChange={(date: any) =>
                                                setDataById({
                                                    ...dataById,
                                                    EMPLOYEE_HIRE_DATE:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8 z-999999"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
                                </div>
                                <div
                                    className={
                                        dataById.EMPLOYEE_CATEGORY === 2 ||
                                        dataById.EMPLOYEE_CATEGORY === "2" ||
                                        dataById.EMPLOYEE_CATEGORY === 3 ||
                                        dataById.EMPLOYEE_CATEGORY === "3"
                                            ? ""
                                            : "hidden"
                                    }
                                >
                                    {dataById.EMPLOYEE_CATEGORY === 2 ||
                                    dataById.EMPLOYEE_CATEGORY === "2" ||
                                    dataById.EMPLOYEE_CATEGORY === 3 ||
                                    dataById.EMPLOYEE_CATEGORY === "3" ? (
                                        <>
                                            <InputLabel
                                                htmlFor="EMPLOYEE_END_DATE"
                                                value={"End Date "}
                                            />
                                            <div className="relative max-w-sm">
                                                <div className="absolute inset-y-0 z-9999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                        dataById.EMPLOYEE_END_DATE
                                                    }
                                                    onChange={(date: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            EMPLOYEE_END_DATE:
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                        })
                                                    }
                                                    className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8 z-999999"
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd - mm - yyyy"
                                                />
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_SALARY_ADJUSTMENT1"
                                        value={"First Salary Adjustment "}
                                    />
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 z-9999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                dataById.EMPLOYEE_SALARY_ADJUSTMENT1
                                            }
                                            onChange={(date: any) =>
                                                setDataById({
                                                    ...dataById,
                                                    EMPLOYEE_SALARY_ADJUSTMENT1:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8 z-999999"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="EMPLOYEE_SALARY_ADJUSTMENT2"
                                        value={"Secondary Salary Adjustment "}
                                    />
                                    <div className="relative max-w-sm">
                                        <div className="absolute inset-y-0 z-9999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                dataById.EMPLOYEE_SALARY_ADJUSTMENT2
                                            }
                                            onChange={(date: any) =>
                                                setDataById({
                                                    ...dataById,
                                                    EMPLOYEE_SALARY_ADJUSTMENT2:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8 z-999999"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    htmlFor="EMPLOYEE_RECRUITMENT_LOCATION"
                                    value="Recruitment Location"
                                />
                                <TextArea
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    id="EMPLOYEE_RECRUITMENT_LOCATION"
                                    name="EMPLOYEE_RECRUITMENT_LOCATION"
                                    defaultValue={
                                        dataById.EMPLOYEE_RECRUITMENT_LOCATION
                                    }
                                    onChange={(e: any) =>
                                        setDataById({
                                            ...dataById,
                                            EMPLOYEE_RECRUITMENT_LOCATION:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* Edit Employement */}

            {/* Add Education */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEducation.add}
                onClose={() => {
                    setModalEducation({
                        add: false,
                    });
                }}
                title={"Add Education"}
                url={`/addEducationPerson`}
                data={dataEducation}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                onSuccess={handleSuccessAddEducation}
                body={
                    <>
                        <div className="mb-2 p-6">
                            <div className="grid grid-cols-13 gap-3">
                                <div className="col-span-2">
                                    <div>
                                        <span>From</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>To</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Degree</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>Major</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>School/College/University</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                            </div>
                            {dataEducation.dataEducations?.map(
                                (dE: any, i: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-13 gap-3"
                                            key={i}
                                        >
                                            <div className="col-span-2">
                                                <div className="relative max-w-sm">
                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                            dE.EMPLOYEE_EDUCATION_START
                                                        }
                                                        onChange={(date: any) =>
                                                            inputEducation(
                                                                "EMPLOYEE_EDUCATION_START",
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                                i
                                                            )
                                                        }
                                                        className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd - mm - yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="relative max-w-sm">
                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                            dE.EMPLOYEE_EDUCATION_END
                                                        }
                                                        onChange={(date: any) =>
                                                            inputEducation(
                                                                "EMPLOYEE_EDUCATION_END",
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                                i
                                                            )
                                                        }
                                                        className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd - mm - yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <select
                                                    className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={
                                                        dE.EDUCATION_DEGREE_ID
                                                    }
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "EDUCATION_DEGREE_ID",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option
                                                        value={""}
                                                        className="text-white"
                                                    >
                                                        -- Choose Degree --
                                                    </option>
                                                    {dataEducationDegree?.map(
                                                        (
                                                            EducationDegree: any,
                                                            a: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={a}
                                                                    value={
                                                                        EducationDegree.EDUCATION_DEGREE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        EducationDegree.EDUCATION_DEGREE_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    type="text"
                                                    value={
                                                        dE.EMPLOYEE_EDUCATION_MAJOR
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "EMPLOYEE_EDUCATION_MAJOR",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    placeholder="Major"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    type="text"
                                                    value={
                                                        dE.EMPLOYEE_EDUCATION_SCHOOL
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "EMPLOYEE_EDUCATION_SCHOOL",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    placeholder="School/Collage/University"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <span>
                                                    <XMarkIcon
                                                        className="w-7 mt-2 text-red-600 cursor-pointer"
                                                        onClick={() => {
                                                            const updatedData =
                                                                dataEducation.dataEducations.filter(
                                                                    (
                                                                        data: any,
                                                                        a: number
                                                                    ) => a !== i
                                                                );
                                                            setDataEducation({
                                                                ...dataEducation,
                                                                dataEducations:
                                                                    updatedData,
                                                            });
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            <div className="mt-2 w-fit">
                                <div
                                    className="text-sm hover:cursor-pointer hover:underline hover:text-gray-500"
                                    onClick={(e) => addRowAddEducation(e)}
                                >
                                    <span>+ Add Education</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Education */}

            {/* Edit Education */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEducation.edit}
                onClose={() => {
                    setModalEducation({
                        edit: false,
                    });
                }}
                title={"Edit Education"}
                url={`/editEducationPerson`}
                data={dataEditEducation}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                onSuccess={handleSuccessEditEducation}
                body={
                    <>
                        <div className="mb-2 px-7">
                            <div className="grid grid-cols-13 gap-3">
                                <div className="col-span-2">
                                    <div>
                                        <span>From</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>To</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Degree</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>Major</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>School/College/University</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                            </div>
                            {dataEditEducation.employee_education?.map(
                                (dE: any, i: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-13 gap-3"
                                            key={i}
                                        >
                                            <div className="col-span-2">
                                                <div className="relative max-w-sm">
                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                        popperPlacement="top-end"
                                                        selected={
                                                            dE.EMPLOYEE_EDUCATION_START
                                                        }
                                                        onChange={(date: any) =>
                                                            inputEditEducation(
                                                                "EMPLOYEE_EDUCATION_START",
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                                i
                                                            )
                                                        }
                                                        className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd - mm - yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="relative max-w-sm">
                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                                        popperPlacement="top-start"
                                                        selected={
                                                            dE.EMPLOYEE_EDUCATION_END
                                                        }
                                                        onChange={(date: any) =>
                                                            inputEditEducation(
                                                                "EMPLOYEE_EDUCATION_END",
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                                i
                                                            )
                                                        }
                                                        className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd - mm - yyyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <select
                                                    className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    value={
                                                        dE.EDUCATION_DEGREE_ID
                                                    }
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "EDUCATION_DEGREE_ID",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option
                                                        value={""}
                                                        className="text-white"
                                                    >
                                                        -- Choose Degree --
                                                    </option>
                                                    {dataEducationDegree?.map(
                                                        (
                                                            EducationDegree: any,
                                                            a: number
                                                        ) => {
                                                            return (
                                                                <option
                                                                    key={a}
                                                                    value={
                                                                        EducationDegree.EDUCATION_DEGREE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        EducationDegree.EDUCATION_DEGREE_NAME
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    type="text"
                                                    value={
                                                        dE.EMPLOYEE_EDUCATION_MAJOR
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "EMPLOYEE_EDUCATION_MAJOR",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    placeholder="Major"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    type="text"
                                                    value={
                                                        dE.EMPLOYEE_EDUCATION_SCHOOL
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "EMPLOYEE_EDUCATION_SCHOOL",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    placeholder="School/College/University"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <span>
                                                    <XMarkIcon
                                                        className="w-7 mt-2 text-red-600 cursor-pointer"
                                                        onClick={() => {
                                                            const updatedData =
                                                                dataEditEducation.employee_education.filter(
                                                                    (
                                                                        data: any,
                                                                        a: number
                                                                    ) => a !== i
                                                                );
                                                            setDataEditEducation(
                                                                {
                                                                    ...dataEditEducation,
                                                                    employee_education:
                                                                        updatedData,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            <div className="mt-2">
                                <div
                                    className="text-sm hover:cursor-pointer hover:underline hover:text-gray-500"
                                    onClick={(e) => addRowEditEducation(e)}
                                >
                                    <span>+ Add Education</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Education */}

            {/* Add Certificate */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalCertificate.add}
                onClose={() => {
                    setModalCertificate({
                        add: false,
                    });
                }}
                title={"Add Certificate"}
                url={`/addCertificate`}
                data={dataCertificate}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[97%]"
                }
                onSuccess={handleSuccessAddCertificate}
                body={
                    <>
                        <div className="mb-2">
                            <div className="grid grid-cols-14 gap-3">
                                <div className="col-span-3">
                                    <div className="text-sm">
                                        <span>Certificate Name</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Is Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Point</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Date</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Expiry Date</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                            </div>
                            {dataCertificate.dataCertificates?.map(
                                (dC: any, i: number) => {
                                    return (
                                        <div className="grid grid-cols-14 gap-3">
                                            <div className="col-span-3">
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            dC.EMPLOYEE_CERTIFICATE_NAME
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputAddCertificate(
                                                                "EMPLOYEE_CERTIFICATE_NAME",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        placeholder="Certificate Name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="mt-2">
                                                    <Checkbox
                                                        value={"0"}
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION",
                                                                    "1",
                                                                    i
                                                                );
                                                            } else {
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION",
                                                                    "0",
                                                                    i
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm">
                                                        {"   "}
                                                        Yes
                                                    </span>
                                                </div>
                                            </div>
                                            {dC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION ===
                                            "1" ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <select
                                                            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                dC.CERTIFICATE_QUALIFICATION_ID
                                                            }
                                                            onChange={(e) => {
                                                                inputAddCertificate(
                                                                    "CERTIFICATE_QUALIFICATION_ID",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            required
                                                        >
                                                            <option
                                                                value={""}
                                                                className="text-white"
                                                            >
                                                                -- Choose
                                                                Qualification --
                                                            </option>
                                                            {dataQualification?.map(
                                                                (
                                                                    dataQua: any,
                                                                    a: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                a
                                                                            }
                                                                            value={
                                                                                dataQua.CERTIFICATE_QUALIFICATION_ID
                                                                            }
                                                                        >
                                                                            {
                                                                                dataQua.CERTIFICATE_QUALIFICATION_NAME
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-span-2">
                                                    <div>
                                                        <select
                                                            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 bg-gray-300"
                                                            value={
                                                                dC.CERTIFICATE_QUALIFICATION_ID
                                                            }
                                                            required
                                                            disabled
                                                        >
                                                            <option
                                                                value={""}
                                                                className="text-white"
                                                            >
                                                                -- Choose
                                                                Qualification --
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {dC.CERTIFICATE_QUALIFICATION_ID !==
                                                "1" &&
                                            dC.CERTIFICATE_QUALIFICATION_ID !==
                                                "2" &&
                                            dC.CERTIFICATE_QUALIFICATION_ID !==
                                                "3" &&
                                            dC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION ===
                                                "1" ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                dC.EMPLOYEE_CERTIFICATE_POINT
                                                            }
                                                            className="mt-1"
                                                            onChange={(e) => {
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_POINT",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            placeholder="Point"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="col-span-2"
                                                    title="Point only for CIIB, APAI, AAPAI"
                                                >
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={""}
                                                            className="mt-1 bg-gray-500"
                                                            onChange={(e) => {
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_POINT",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            placeholder="Point"
                                                            required
                                                            readOnly
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-span-2">
                                                <div>
                                                    <div className="relative max-w-sm">
                                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                                dC.EMPLOYEE_CERTIFICATE_START_DATE
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) =>
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_START_DATE",
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    i
                                                                )
                                                            }
                                                            className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                            dateFormat={
                                                                "dd-MM-yyyy"
                                                            }
                                                            placeholderText="dd - mm - yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <div className="relative max-w-sm">
                                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                                dC.EMPLOYEE_CERTIFICATE_EXPIRES_DATE
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) =>
                                                                inputAddCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_EXPIRES_DATE",
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    i
                                                                )
                                                            }
                                                            className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                            dateFormat={
                                                                "dd-MM-yyyy"
                                                            }
                                                            placeholderText="dd - mm - yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <span>
                                                        <XMarkIcon
                                                            className="w-6 mt-3 text-red-600 cursor-pointer"
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataCertificate.dataCertificates.filter(
                                                                        (
                                                                            data: any,
                                                                            a: number
                                                                        ) =>
                                                                            a !==
                                                                            i
                                                                    );
                                                                setDataCertificate(
                                                                    {
                                                                        ...dataCertificate,
                                                                        dataCertificates:
                                                                            updatedData,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            <div className="mt-2 w-fit">
                                <div
                                    className="text-sm hover:cursor-pointer hover:underline hover:text-gray-500"
                                    onClick={(e) => addRowAddCertificate(e)}
                                >
                                    <span>+ Add Certificate</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Certificate */}

            {/* Edit Certificate */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalCertificate.edit}
                onClose={() => {
                    setModalCertificate({
                        edit: false,
                    });
                }}
                title={"Edit Certificate"}
                url={`/EditCertificate`}
                data={dataEditCertificate}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[97%]"
                }
                onSuccess={handleSuccessEditCertificate}
                body={
                    <>
                        <div className="mb-2">
                            <div className="grid grid-cols-14 gap-3">
                                <div className="col-span-3">
                                    <div className="text-sm">
                                        <span>Certificate Name</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Is Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Point</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Date</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Expiry Date</span>
                                        <span className="text-red-600">*</span>
                                    </div>
                                </div>
                            </div>
                            {dataEditCertificate.employee_certificate?.map(
                                (pC: any, i: number) => {
                                    return (
                                        <div className="grid grid-cols-14 gap-3">
                                            <div className="col-span-3">
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            pC.EMPLOYEE_CERTIFICATE_NAME
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputEditCertificate(
                                                                "EMPLOYEE_CERTIFICATE_NAME",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        placeholder="Certificate Name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="mt-2">
                                                    <Checkbox
                                                        value={
                                                            pC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION
                                                        }
                                                        defaultChecked={
                                                            pC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION
                                                        }
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION",
                                                                    1,
                                                                    i
                                                                );
                                                            } else {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION",
                                                                    0,
                                                                    i
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm">
                                                        {"   "}
                                                        Yes
                                                    </span>
                                                </div>
                                            </div>
                                            {pC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION ===
                                            1 ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <select
                                                            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                pC.CERTIFICATE_QUALIFICATION_ID
                                                            }
                                                            onChange={(e) => {
                                                                inputEditCertificate(
                                                                    "CERTIFICATE_QUALIFICATION_ID",
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                                    i
                                                                );
                                                            }}
                                                            required
                                                        >
                                                            <option
                                                                value={""}
                                                                className="text-white"
                                                            >
                                                                -- Choose
                                                                Qualification --
                                                            </option>
                                                            {dataQualification?.map(
                                                                (
                                                                    dataQua: any,
                                                                    a: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                a
                                                                            }
                                                                            value={
                                                                                dataQua.CERTIFICATE_QUALIFICATION_ID
                                                                            }
                                                                        >
                                                                            {
                                                                                dataQua.CERTIFICATE_QUALIFICATION_NAME
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-span-2">
                                                    <div>
                                                        <select
                                                            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 bg-gray-300"
                                                            value={
                                                                pC.CERTIFICATE_QUALIFICATION_ID
                                                            }
                                                            required
                                                            disabled
                                                        >
                                                            <option
                                                                value={""}
                                                                className="text-white"
                                                            >
                                                                -- Choose
                                                                Qualification --
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {pC.CERTIFICATE_QUALIFICATION_ID !==
                                                1 &&
                                            pC.CERTIFICATE_QUALIFICATION_ID !==
                                                2 &&
                                            pC.CERTIFICATE_QUALIFICATION_ID !==
                                                3 &&
                                            pC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION ===
                                                1 ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                pC.EMPLOYEE_CERTIFICATE_POINT
                                                            }
                                                            className="mt-1"
                                                            onChange={(e) => {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_POINT",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            placeholder="Point"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-span-2">
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={""}
                                                            className="mt-1 bg-gray-500"
                                                            onChange={(e) => {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_POINT",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
                                                            placeholder="Point"
                                                            required
                                                            readOnly
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-span-2">
                                                <div>
                                                    <div className="relative max-w-sm">
                                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                            popperPlacement="top-end"
                                                            selected={
                                                                pC.EMPLOYEE_CERTIFICATE_START_DATE
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) => {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_START_DATE",
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    i
                                                                );
                                                            }}
                                                            className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                            dateFormat={
                                                                "dd-MM-yyyy"
                                                            }
                                                            placeholderText="dd - mm - yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <div className="relative max-w-sm">
                                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                                pC.EMPLOYEE_CERTIFICATE_EXPIRES_DATE
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) => {
                                                                inputEditCertificate(
                                                                    "EMPLOYEE_CERTIFICATE_EXPIRES_DATE",
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    i
                                                                );
                                                            }}
                                                            className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                            dateFormat={
                                                                "dd-MM-yyyy"
                                                            }
                                                            placeholderText="dd - mm - yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <span>
                                                        <XMarkIcon
                                                            className="w-6 mt-3 text-red-600 cursor-pointer"
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataEditCertificate.employee_certificate.filter(
                                                                        (
                                                                            data: any,
                                                                            a: number
                                                                        ) =>
                                                                            a !==
                                                                            i
                                                                    );
                                                                setDataEditCertificate(
                                                                    {
                                                                        ...dataEditCertificate,
                                                                        employee_certificate:
                                                                            updatedData,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            <div className="mt-2 w-fit">
                                <div
                                    className="text-sm hover:cursor-pointer hover:underline hover:text-gray-500"
                                    onClick={(e) => addRowEditCertificate(e)}
                                >
                                    <span>+ Add Certificate</span>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Certificate */}
            <div>
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        // defaultValue={
                        //     tabs?.find((tab: any) => tab.current).name
                        // }
                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
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
                {tab.nameTab === "Employee" ? (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md h-48">
                        {dataDetailEmployee.EMPLOYEE_CTEAGORY !== null &&
                        dataDetailEmployee.EMPLOYEE_HIRE_DATE !== null ? (
                            <>
                                <div className="grid grid-cols-3 gap-4 divide-x px-1 py-4">
                                    <div className="px-2">
                                        <div className="text-red-700">
                                            Employee Id
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.EMPLOYEE_NUMBER_ID ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee.EMPLOYEE_NUMBER_ID}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Tax Status
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.TAX_STATUS_ID ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee.tax_status
                                                      ?.TAX_STATUS_NAME}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Location Recruitment
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.EMPLOYEE_RECRUITMENT_LOCATION ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee.EMPLOYEE_RECRUITMENT_LOCATION}
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-red-700">
                                            Category
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.EMPLOYEE_CATEGORY ===
                                            1
                                                ? "Full-time"
                                                : dataDetailEmployee.EMPLOYEE_CATEGORY ===
                                                  2
                                                ? "Contract"
                                                : "Intern"}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Hire date
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.EMPLOYEE_HIRE_DATE ===
                                            null
                                                ? "-"
                                                : dateFormat(
                                                      dataDetailEmployee.EMPLOYEE_HIRE_DATE,
                                                      "dd-mm-yyyy"
                                                  )}
                                            {/* {dataDetailEmployee.EMPLOYEE_HIRE_DATE} */}
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="flex justify-between gap-1">
                                            <div className="text-red-700">
                                                Status
                                            </div>
                                            <div className="text-gray-600 text-sm">
                                                <a
                                                    className="hover:text-red-500 hover:cursor-pointer"
                                                    onClick={(e) =>
                                                        handleEditEmployment(e)
                                                    }
                                                >
                                                    <PencilSquareIcon
                                                        className="w-5"
                                                        title="Edit Profile"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {dataDetailEmployee.EMPLOYEE_IS_DELETED ===
                                            0
                                                ? "Active"
                                                : dataDetailEmployee.EMPLOYEE_IS_DELETED !==
                                                  null
                                                ? "Inactive"
                                                : "-"}
                                        </div>
                                        {dataDetailEmployee.EMPLOYEE_CATEGORY ===
                                            2 ||
                                        dataDetailEmployee.EMPLOYEE_CATEGORY ===
                                            3 ? (
                                            <>
                                                <div className="text-red-700 mt-2">
                                                    End date
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    {/* {
                                                        dataDetailEmployee.EMPLOYEE_END_DATE
                                                            } */}
                                                    {dataDetailEmployee.EMPLOYEE_END_DATE ===
                                                    null
                                                        ? "-"
                                                        : dateFormat(
                                                              dataDetailEmployee.EMPLOYEE_END_DATE,
                                                              "dd-mm-yyyy"
                                                          )}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* tombol add muncul jika tidak ada data employemet */}
                                <div className="px-1 py-4">
                                    <div
                                        className="text-sm bg-red-600 p-2 text-white w-fit rounded-md hover:cursor-pointer hover:bg-red-400"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setModalEmployment({
                                                add: true,
                                            });
                                        }}
                                    >
                                        <span>Add Detail Employee</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : tab.nameTab === "Education" ? (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md h-40">
                        {dataDetailEmployee.employee_education?.length === 0 ? (
                            <div className="px-2 p-4">
                                <div
                                    className="bg-red-500 w-fit p-2 rounded-md text-white hover:cursor-pointer hover:bg-red-400"
                                    onClick={(e) => handleAddEducation(e)}
                                >
                                    <span>Add Education</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-13 gap-3 px-4 divide-x py-0">
                                    <div className="col-span-2 text-md font-semibold">
                                        <div>
                                            <span>From</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-md font-semibold px-2">
                                        <div>
                                            <span>To</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-md font-semibold px-2">
                                        <div>
                                            <span>Degree</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-md font-semibold px-2">
                                        <div>
                                            <span>Major</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-md font-semibold px-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span>
                                                    School/College/University
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                                    <PencilSquareIcon
                                                        className="w-6 text-red-600 cursor-pointer"
                                                        title="Edit Education"
                                                        onClick={(e: any) => {
                                                            handleEditEducation(
                                                                e
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {dataDetailEmployee.employee_education?.map(
                                    (pE: any, i: number) => {
                                        return (
                                            <div
                                                className="grid grid-cols-13 gap-3 px-4 divide-x mb-2 mt-2"
                                                key={i}
                                            >
                                                <div className="col-span-2 text-sm text-gray-500">
                                                    <div>
                                                        <span>
                                                            {pE.EMPLOYEE_EDUCATION_START ===
                                                            null
                                                                ? "-"
                                                                : dateFormat(
                                                                      pE.EMPLOYEE_EDUCATION_START,
                                                                      "dd-mm-yyyy"
                                                                  )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500 px-2">
                                                    <div>
                                                        <span>
                                                            {pE.EMPLOYEE_EDUCATION_END ===
                                                            null
                                                                ? "-"
                                                                : dateFormat(
                                                                      pE.EMPLOYEE_EDUCATION_END,
                                                                      "dd-mm-yyyy"
                                                                  )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500 px-2">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE
                                                                    .education_degree
                                                                    .EDUCATION_DEGREE_NAME
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-gray-500 px-2 text-sm">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.EMPLOYEE_EDUCATION_MAJOR
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-gray-500 px-2 text-sm">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.EMPLOYEE_EDUCATION_SCHOOL
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </div>
                ) : tab.nameTab === "Certificate" ? (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md h-40">
                        {dataDetailEmployee.employee_certificate?.length ===
                        0 ? (
                            <div className="px-2 p-4">
                                <div
                                    className="bg-red-500 w-fit p-2 rounded-md text-white hover:cursor-pointer hover:bg-red-400"
                                    onClick={(e) => handleAddCertificate(e)}
                                >
                                    <span>Add Certificate</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-14 gap-3 divide-x">
                                    <div className="col-span-3">
                                        <div className="text-sm font-semibold">
                                            <span>Certificate Name</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 px-1">
                                        <div className="text-sm font-semibold">
                                            <span>Is Qualification</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 px-1">
                                        <div className="text-sm font-semibold">
                                            <span>Qualification</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 px-1">
                                        <div className="text-sm font-semibold">
                                            <span>Point</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 px-1">
                                        <div className="text-sm font-semibold">
                                            <span>Certificate Date</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 px-1">
                                        <div className="text-sm font-semibold flex justify-between">
                                            <div>
                                                <span>
                                                    Certificate Expiry Date
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                                    <PencilSquareIcon
                                                        className="w-5 text-red-600 cursor-pointer"
                                                        title="Edit Certificate"
                                                        onClick={(e) => {
                                                            handleEditCertificate(
                                                                e
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {dataDetailEmployee.employee_certificate?.map(
                                    (pC: any, a: number) => {
                                        return (
                                            <div
                                                className="grid grid-cols-14 gap-3 divide-x mb-2 mt-2"
                                                key={a}
                                            >
                                                <div className="col-span-3">
                                                    <div className="text-sm text-gray-500">
                                                        <span>
                                                            {
                                                                pC.EMPLOYEE_CERTIFICATE_NAME
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        {pC.EMPLOYEE_CERTIFICATE_IS_QUALIFICATION ===
                                                        1 ? (
                                                            <div className="bg-green-600 px-3 py-1 rounded-md w-fit text-white">
                                                                <span>Yes</span>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-red-600 px-3 py-1 rounded-md w-fit text-white">
                                                                <span>No</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        {pC.certificate_qualification ===
                                                        null ? (
                                                            <span>{"-"}</span>
                                                        ) : (
                                                            <span>
                                                                {
                                                                    pC
                                                                        .certificate_qualification
                                                                        .CERTIFICATE_QUALIFICATION_NAME
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        {pC.EMPLOYEE_CERTIFICATE_POINT ===
                                                        null ? (
                                                            <span>{"-"}</span>
                                                        ) : (
                                                            <span>
                                                                {
                                                                    pC.EMPLOYEE_CERTIFICATE_POINT
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        <span>
                                                            {pC.EMPLOYEE_CERTIFICATE_START_DATE ===
                                                            null
                                                                ? "-"
                                                                : dateFormat(
                                                                      pC.EMPLOYEE_CERTIFICATE_START_DATE,
                                                                      "dd-mm-yyyy"
                                                                  )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        <span>
                                                            {pC.EMPLOYEE_CERTIFICATE_EXPIRES_DATE ===
                                                            null
                                                                ? "-"
                                                                : dateFormat(
                                                                      pC.EMPLOYEE_CERTIFICATE_EXPIRES_DATE,
                                                                      "dd-mm-yyyy"
                                                                  )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-white shadow-md p-4 rounded-bl-md rounded-br-md rounded-tr-md h-full">
                        <div className="grid-cols-4 grid gap-4">
                            <div className="text-sm font-semibold ">
                                <span>KTP</span>
                            </div>
                        </div>
                        {dataDetailEmployee.m_employee_document?.filter(
                            (m: any) => m.CATEGORY_DOCUMENT === 1
                        )?.length === 0 ? (
                            <div
                                className="w-fit flex items-center group mt-2 mb-2 text-sm"
                                onClick={(e) => {
                                    handleAddDocument(e, 1);
                                }}
                            >
                                <div className="group-hover:underline group-hover:cursor-pointer">
                                    <span>
                                        <PlusCircleIcon className="w-5 text-gray-500 text-sm" />
                                    </span>
                                </div>
                                <div className="group-hover:underline group-hover:cursor-pointer text-gray-500">
                                    <span>Add KTP</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {dataDetailEmployee.m_employee_document
                                    ?.filter(
                                        (m: any) => m.CATEGORY_DOCUMENT === 1
                                    )
                                    .map((mPD: any, l: number) => {
                                        return (
                                            <div className="grid-cols-4 grid gap-4 mb-2">
                                                <div
                                                    className="text-sm text-gray-500 font-semibold cursor-pointer hover:text-red-600 w-fit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.open(
                                                            window.location
                                                                .origin +
                                                                "/storage/" +
                                                                mPD
                                                                    .document_person
                                                                    ?.DOCUMENT_DIRNAME +
                                                                mPD
                                                                    .document_person
                                                                    ?.DOCUMENT_FILENAME,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        {
                                                            mPD.document_person
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
                                                                    mPD.DOCUMENT_ID
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                    <span>
                                                        <XMarkIcon
                                                            className="w-7 text-red-600 hover:cursor-pointer"
                                                            title="Delete Images"
                                                            onClick={(e) =>
                                                                alertDelete(
                                                                    mPD.DOCUMENT_ID,
                                                                    mPD.EMPLOYEE_ID
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        )}

                        <div className="mt-2 grid-cols-4 grid gap-4">
                            <div className="text-sm font-semibold ">
                                <span>Other Document</span>
                            </div>
                        </div>
                        {dataDetailEmployee.m_employee_document?.filter(
                            (m: any) => m.CATEGORY_DOCUMENT === 2
                        )?.length === 0 ? (
                            <div
                                className="w-fit flex items-center group mt-2 mb-2 text-sm"
                                onClick={(e) => {
                                    handleAddDocument(e, 2);
                                }}
                            >
                                <div className="group-hover:underline group-hover:cursor-pointer">
                                    <span>
                                        <PlusCircleIcon className="w-5 text-gray-500 text-sm" />
                                    </span>
                                </div>
                                <div className="group-hover:underline group-hover:cursor-pointer text-gray-500">
                                    <span>Add Other Document</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="w-fit flex items-center group mt-2 mb-2 text-sm"
                                    onClick={(e) => {
                                        handleAddDocument(e, 2);
                                    }}
                                >
                                    <div className="group-hover:underline group-hover:cursor-pointer">
                                        <span>
                                            <PlusCircleIcon className="w-5 text-gray-500 text-sm" />
                                        </span>
                                    </div>
                                    <div className="group-hover:underline group-hover:cursor-pointer text-gray-500">
                                        <span>Add Other Document</span>
                                    </div>
                                </div>
                                {dataDetailEmployee.m_employee_document
                                    ?.filter(
                                        (m: any) => m.CATEGORY_DOCUMENT === 2
                                    )
                                    .map((mPD: any, l: number) => {
                                        return (
                                            <div className="grid-cols-4 grid gap-4 mb-2">
                                                <div
                                                    className="text-sm text-gray-500 font-semibold cursor-pointer hover:text-red-600 w-fit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.open(
                                                            window.location
                                                                .origin +
                                                                "/storage/" +
                                                                mPD
                                                                    .document_person
                                                                    ?.DOCUMENT_DIRNAME +
                                                                mPD
                                                                    .document_person
                                                                    ?.DOCUMENT_FILENAME,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        {
                                                            mPD.document_person
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
                                                                    mPD.DOCUMENT_ID
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                    <span>
                                                        <XMarkIcon
                                                            className="w-7 text-red-600 hover:cursor-pointer"
                                                            title="Delete Images"
                                                            onClick={(e) =>
                                                                alertDelete(
                                                                    mPD.DOCUMENT_ID,
                                                                    mPD.EMPLOYEE_ID
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
