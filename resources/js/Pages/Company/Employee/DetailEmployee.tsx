import AGGrid from "@/Components/AgGrid";
import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToastMessage from "@/Components/ToastMessage";
import {
    ArrowUpTrayIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilSquareIcon,
    PhoneIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectTailwind from "react-tailwindcss-select";
import defaultImage from "../../../Images/user/default.jpg";
import dateFormat from "dateformat";
import EmploymentDetail from "@/Pages/Person/EmploymentDetail";
import ModalAddEmployee from "./ModalAddEmployee";
import DetailEmployeeAddress from "./DetailEmployeeAddress";
import AddBankAccountEmployee from "./AddBankAccountEmployee";
import DetailBankAccountEmployee from "./DetailBankAccountEmployee";
import Swal from "sweetalert2";

export default function DetailEmployee({
    idEmployee,
    dataRelationship,
    setIsSuccess,
    division,
    structure,
    office,
    dataRelationshipFamily,
}: PropsWithChildren<{
    idEmployee: any;
    dataRelationship: any;
    setIsSuccess: any;
    division: any;
    structure: any;
    office: any;
    dataRelationshipFamily: any;
}>) {
    // load data structure
    useEffect(() => {
        getDetailEmployee(idEmployee);
    }, [idEmployee]);

    const [dataDetailEmployee, setDataDetailEmployee] = useState<any>([]);

    // FILE
    const [file, setFile] = useState<any>();
    const [fileNew, setFileNew] = useState<any>();

    // modal detail employment
    const [editModalEmployment, setEditModalEmployment] = useState<any>({
        edit: false,
    });

    const getDetailEmployee = async (idEmployee: string) => {
        await axios
            .post(`/getDetailEmployee`, { idEmployee })
            .then((res) => {
                setDataDetailEmployee(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditEmployment = async (e: FormEvent) => {
        e.preventDefault();
        setDataEditEmployment(dataDetailEmployee);
        setEditModalEmployment({
            edit: !editModalEmployment.edit,
        });
    };

    // data Request Employment
    const [dataEditEmployment, setDataEditEmployment] = useState<any>({
        EMPLOYEE_FIRST_NAME: "",
        EMPLOYEE_GENDER: "",
        EMPLOYEE_BIRTH_PLACE: "",
        EMPLOYEE_BIRTH_DATE: "",
        EMPLOYEE_KTP: "",
        EMPLOYEE_NPWP: "",
        EMPLOYEE_KK: "",
        EMPLOYEE_BLOOD_TYPE: "",
        EMPLOYEE_BLOOD_RHESUS: "",
        EMPLOYEE_MARITAL_STATUS: "",
        STRUCTURE_ID: "",
        DIVISION_ID: "",
        OFFICE_ID: "",
        // COMPANY_ID: idCompany,
        m_employment_contact: [
            {
                t_employee_contact: {
                    EMPLOYEE_PHONE_NUMBER: "",
                    EMPLOYEE_EMAIL: "",
                },
            },
        ],
        t_employment_emergency: [
            {
                EMPLOYEE_EMERGENCY_CONTACT_NAME: "",
                EMPLOYEE_EMERGENCY_CONTACT_NUMBER: "",
                EMPLOYEE_RELATIONSHIP_ID: "",
            },
        ],
        t_employment_family_member: [
            {
                EMPLOYEE_FAMILY_MEMBER_NAME: "",
                EMPLOYEE_RELATIONSHIP_ID: "",
            },
        ],
    });

    // const [structure, setStructure] = useState<any>([]);
    const structureSelect = structure?.map((query: any) => {
        return {
            value: query.COMPANY_STRUCTURE_ID,
            label: query.text_combo,
        };
    });

    const divisionSelect = division?.map((query: any) => {
        return {
            value: query.COMPANY_DIVISION_ID,
            label: query.text_combo,
        };
    });

    const officeSelect = office?.map((query: any) => {
        return {
            value: query.COMPANY_OFFICE_ID,
            label: query.text_combo,
        };
    });

    const addRowEmergencyContact = (e: FormEvent) => {
        e.preventDefault();
        setDataEditEmployment({
            ...dataEditEmployment,
            t_employment_emergency: [
                ...dataEditEmployment.t_employment_emergency,
                {
                    EMPLOYEE_EMERGENCY_CONTACT_NAME: "",
                    EMPLOYEE_EMERGENCY_CONTACT_NUMBER: "",
                    EMPLOYEE_RELATIONSHIP_ID: "",
                },
            ],
        });
    };

    const addRowFamilyMember = (e: FormEvent) => {
        e.preventDefault();
        setDataEditEmployment({
            ...dataEditEmployment,
            t_employment_family_member: [
                ...dataEditEmployment.t_employment_family_member,
                {
                    EMPLOYEE_FAMILY_MEMBER_NAME: "",
                    EMPLOYEE_RELATIONSHIP_ID: "",
                },
            ],
        });
    };

    const addRowEmployeeContact = (e: FormEvent) => {
        e.preventDefault();
        setDataEditEmployment({
            ...dataEditEmployment,
            m_employment_contact: [
                ...dataEditEmployment.m_employment_contact,
                {
                    t_employee_contact: {
                        EMPLOYEE_PHONE_NUMBER: "",
                        EMPLOYEE_EMAIL: "",
                    },
                },
            ],
        });
    };

    const inputDataEmployeeContact = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditEmployment.m_employment_contact];
        changeVal[i].t_employee_contact[name] = value;
        setDataEditEmployment({
            ...dataEditEmployment,
            m_employment_contact: changeVal,
        });
    };

    const inputContactEmergency = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditEmployment.t_employment_emergency];
        changeVal[i][name] = value;
        setDataEditEmployment({
            ...dataEditEmployment,
            t_employment_emergency: changeVal,
        });
    };

    const inputFamilyMember = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [
            ...dataEditEmployment.t_employment_family_member,
        ];
        changeVal[i][name] = value;
        setDataEditEmployment({
            ...dataEditEmployment,
            t_employment_family_member: changeVal,
        });
    };

    const handleSuccessEditEmployee = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            getDetailEmployee(message[0]);
            setIsSuccess(message[1]);
            setDataEditEmployment({
                EMPLOYEE_FIRST_NAME: "",
                EMPLOYEE_GENDER: "",
                EMPLOYEE_BIRTH_PLACE: "",
                EMPLOYEE_BIRTH_DATE: "",
                EMPLOYEE_KTP: "",
                EMPLOYEE_NPWP: "",
                EMPLOYEE_KK: "",
                EMPLOYEE_BLOOD_TYPE: "",
                EMPLOYEE_BLOOD_RHESUS: "",
                EMPLOYEE_MARITAL_STATUS: "",
                STRUCTURE_ID: "",
                DIVISION_ID: "",
                OFFICE_ID: "",
                // COMPANY_ID: idCompany,
                m_employment_contact: [
                    {
                        t_employee_contact: {
                            EMPLOYEE_PHONE_NUMBER: "",
                            EMPLOYEE_EMAIL: "",
                        },
                    },
                ],
                t_employment_emergency: [
                    {
                        EMPLOYEE_EMERGENCY_CONTACT_NAME: "",
                        EMPLOYEE_EMERGENCY_CONTACT_NUMBER: "",
                        EMPLOYEE_RELATIONSHIP_ID: "",
                    },
                ],
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [modalEmployee, setModalEmployee] = useState<any>({
        view: false,
    });

    const handleEmploymentNew = async (e: FormEvent) => {
        e.preventDefault();
        getTax();
        setModalEmployee({
            view: !modalEmployee.view,
        });
    };

    const [taxStatus, setTaxStatus] = useState<any>([]);
    const getTax = async () => {
        await axios
            .get(`/getTaxStatus`)
            .then((res) => {
                setTaxStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modalAddressPerson, setModalAddressPerson] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const [addressStatus, setAddressStatus] = useState<any>([]);
    const getAddressStatus = async () => {
        await axios
            .post(`/getAddressStatus`)
            .then((res) => {
                setAddressStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleAddressPerson = async (e: FormEvent) => {
        e.preventDefault();
        getWilayah();
        dataDetailEmployee.m_address_employee?.length === 0
            ? setModalAddressPerson({
                  add: !modalAddressPerson.add,
                  delete: false,
                  edit: false,
                  view: false,
                  document: false,
                  search: false,
              })
            : setModalAddressPerson({
                  add: false,
                  delete: false,
                  edit: false,
                  view: !modalAddressPerson.view,
                  document: false,
                  search: false,
              });
        getAddressStatus();
    };

    const [dataAddress, setDataAddress] = useState<any>({
        address_ktp: [
            {
                idEmployee: idEmployee,
                ADDRESS_CATEGORY: "",
                ADDRESS_LOCATION_TYPE: "",
                ADDRESS_DETAIL: "",
                ADDRESS_RT_NUMBER: "",
                ADDRESS_RW_NUMBER: "",
                ADDRESS_VILLAGE: "",
                ADDRESS_DISTRICT: "",
                ADDRESS_PROVINCE: "",
                ADDRESS_REGENCY: "",
                ADDRESS_STATUS: "",
            },
        ],
        address_domicile: [],
        other_address: [],
    });

    const [wilayah, setWilayah] = useState<any>([]);
    const getWilayah = async () => {
        await axios
            .post(`/getWilayah`)
            .then((res) => {
                setWilayah(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const wilayahSelect = wilayah?.map((query: any) => {
        return {
            value: query.kode,
            label: query.nama,
        };
    });
    const [checkDomAddress, setCheckDomAddress] = useState({
        domAddress: "",
    });

    const handleSuccessAddAddress = (message: string) => {
        // setIsSuccess("");
        setIsSuccess("");
        if (message != "") {
            getDetailEmployee(message[0]);
            setIsSuccess(message[1]);
            setDataAddress({
                address_ktp: [
                    {
                        idEmployee: idEmployee,
                        ADDRESS_CATEGORY: "",
                        ADDRESS_LOCATION_TYPE: "",
                        ADDRESS_DETAIL: "",
                        ADDRESS_RT_NUMBER: "",
                        ADDRESS_RW_NUMBER: "",
                        ADDRESS_VILLAGE: "",
                        ADDRESS_DISTRICT: "",
                        ADDRESS_PROVINCE: "",
                        ADDRESS_REGENCY: "",
                        ADDRESS_STATUS: "",
                    },
                ],
                address_domicile: [],
                other_address: [],
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [bank, setBank] = useState<any>([]);
    const getRBank = async () => {
        await axios
            .post(`/getRBank`)
            .then((res) => {
                setBank(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [optionsBank, setOptionsBank] = useState<any>([]);
    const getForBankAccount = async () => {
        await axios
            .post(`/getForBankAccount`)
            .then((res) => {
                setOptionsBank(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modalBank, setModalBank] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const handleBankAccount = async (e: FormEvent) => {
        e.preventDefault();

        getRBank();
        getForBankAccount();
        if (dataDetailEmployee.t_employee_bank?.length === 0) {
            setModalBank({
                add: !modalBank.add,
                delete: false,
                edit: false,
                view: false,
                document: false,
                search: false,
            });
        } else {
            setModalBank({
                add: false,
                delete: false,
                edit: !modalBank.edit,
                view: false,
                document: false,
                search: false,
            });
        }
    };

    const handleFamilyMember = async (e: FormEvent) => {
        e.preventDefault();
    };

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            getDetailEmployee(message[0]);
            setIsSuccess(message[1]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    // Upload File
    const handleChange = (e: any) => {
        if (
            e.target.files[0].type === "image/jpeg" ||
            e.target.files[0].type === "image/jpg" ||
            e.target.files[0].type === "image/png"
        ) {
            setFile(URL.createObjectURL(e.target.files[0]));
            setFileNew(e.target.files);
        } else {
            Swal.fire({
                title: "Failed",
                text: "File Tidak Mendukung!!",
                icon: "error",
            }).then((result: any) => {
                if (result.value) {
                    return false;
                    // getPersons();
                    // setGetDetailRelation(message);
                    // setModal({
                    //     add: false,
                    //     delete: false,
                    //     edit: false,
                    //     view: true,
                    //     document: false,
                    //     search: false,
                    // });
                }
            });
        }
    };

    const saveUpload = async (files: any, id: string) => {
        await axios
            .post(
                `/uploadProfile`,
                { files, id },
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                }
            )
            .then((res) => {
                setIsSuccess(res.data[1]);
                setFile(null);
                getDetailEmployee(res.data[0]);
                setTimeout(() => {
                    setIsSuccess("");
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getStructureLabel = (value: any) => {
        if (value) {
            const selected = structureSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const getDivisionLabel = (value: any) => {
        if (value) {
            const selected = divisionSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const getOfficeLabel = (value: any) => {
        if (value) {
            const selected = officeSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    return (
        <>
            {/* Bank Account */}
            <AddBankAccountEmployee
                show={modalBank.add}
                modal={() =>
                    setModalBank({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                bank={bank}
                optionsBank={optionsBank}
                idEmployee={idEmployee}
                handleSuccess={handleSuccess}
            />
            {/* End Bank Account */}

            {/* Bank Account */}
            <DetailBankAccountEmployee
                show={modalBank.edit}
                modal={() =>
                    setModalBank({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                bank={bank}
                optionsBank={optionsBank}
                idEmployee={idEmployee}
                handleSuccess={handleSuccess}
                detailBank={dataDetailEmployee.t_employee_bank}
            />
            {/* End Bank Account */}

            {/* modal detail address person */}
            <ModalToAction
                show={modalAddressPerson.view}
                onClose={() =>
                    setModalAddressPerson({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Address Person"}
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
                        <DetailEmployeeAddress
                            idEmployee={idEmployee}
                            wilayah={wilayah}
                            wilayahSelect={wilayahSelect}
                            setIsSuccess={setIsSuccess}
                        />
                    </>
                }
            />
            {/* end modal detail address person */}

            {/* address Person */}
            <ModalAddEmployee
                show={modalAddressPerson.add}
                modal={() => {
                    setModalAddressPerson({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                dataAddress={dataAddress}
                setDataAddress={setDataAddress}
                wilayahSelect={wilayahSelect}
                checkDomAddress={checkDomAddress}
                setCheckDomAddress={setCheckDomAddress}
                addressStatus={addressStatus}
                idEmployee={idEmployee}
                handleSuccessAddAddress={handleSuccessAddAddress}
            />

            {/* end address person */}

            {/* Edit Employment */}
            <ModalToAdd
                buttonAddOns={""}
                show={editModalEmployment.edit}
                onClose={() =>
                    setEditModalEmployment({
                        edit: false,
                    })
                }
                title={"Edit Employee"}
                url={`/editEmployee`}
                data={dataEditEmployment}
                onSuccess={handleSuccessEditEmployee}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    value={"Employee Name"}
                                />
                                <div className="ml-[7.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={
                                        dataEditEmployment.EMPLOYEE_FIRST_NAME
                                    }
                                    className="mt-1"
                                    onChange={(e) => {
                                        setDataEditEmployment({
                                            ...dataEditEmployment,
                                            EMPLOYEE_FIRST_NAME: e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Employee Name"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="">
                                    <InputLabel className="" value={"Gender"} />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataEditEmployment.EMPLOYEE_GENDER ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_GENDER
                                        }
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_GENDER: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Gender --
                                        </option>
                                        <option value={"m"}>Male</option>
                                        <option value={"f"}>Female</option>
                                    </select>
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Place Of Birth"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataEditEmployment.EMPLOYEE_BIRTH_PLACE ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_BIRTH_PLACE
                                        }
                                        className="mt-2"
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_BIRTH_PLACE:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Place Of Birth"
                                    />
                                </div>
                                <div className="grid grid-cols-1">
                                    <InputLabel
                                        className=""
                                        value={"Date Of Birth"}
                                    />
                                    <div className="relative">
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
                                            value={
                                                dataEditEmployment.EMPLOYEE_BIRTH_DATE ===
                                                null
                                                    ? ""
                                                    : dataEditEmployment.EMPLOYEE_BIRTH_DATE
                                            }
                                            onChange={(date: any) => {
                                                setDataEditEmployment({
                                                    ...dataEditEmployment,
                                                    EMPLOYEE_BIRTH_DATE:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                });
                                            }}
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person KTP"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataEditEmployment.EMPLOYEE_KTP ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_KTP
                                        }
                                        className="mt-2"
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_KTP: e.target.value,
                                            });
                                        }}
                                        placeholder="Person KTP"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person NPWP"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataEditEmployment.EMPLOYEE_NPWP ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_NPWP
                                        }
                                        className="mt-2"
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_NPWP: e.target.value,
                                            });
                                        }}
                                        placeholder="Person NPWP"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person KK"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataEditEmployment.EMPLOYEE_KK ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_KK
                                        }
                                        className="mt-2"
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_KK: e.target.value,
                                            });
                                        }}
                                        placeholder="Person KK"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-3 mt-4">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BLOOD_TYPE"
                                        value={"Blood Type "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataEditEmployment.EMPLOYEE_BLOOD_TYPE ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_BLOOD_TYPE
                                        }
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_BLOOD_TYPE:
                                                    e.target.value,
                                            });
                                        }}
                                    >
                                        <option>-- Blood Type --</option>
                                        <option value={"1"}>A</option>
                                        <option value={"2"}>B</option>
                                        <option value={"3"}>AB</option>
                                        <option value={"4"}>O</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BLOOD_RHESUS"
                                        value={"Blood Rhesus "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataEditEmployment.EMPLOYEE_BLOOD_RHESUS ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_BLOOD_RHESUS
                                        }
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_BLOOD_RHESUS:
                                                    e.target.value,
                                            });
                                        }}
                                    >
                                        <option>-- Blood Rhesus --</option>
                                        <option value={"1"}>Positive</option>
                                        <option value={"2"}>Negative</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_MARTIAL_STATUS"
                                        value={"Marital Status "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataEditEmployment.EMPLOYEE_MARITAL_STATUS ===
                                            null
                                                ? ""
                                                : dataEditEmployment.EMPLOYEE_MARITAL_STATUS
                                        }
                                        onChange={(e) => {
                                            setDataEditEmployment({
                                                ...dataEditEmployment,
                                                EMPLOYEE_MARITAL_STATUS:
                                                    e.target.value,
                                            });
                                        }}
                                    >
                                        <option>-- Marital Status --</option>
                                        <option value={"1"}>Single</option>
                                        <option value={"2"}>Married</option>
                                        <option value={"3"}>Divorced</option>
                                        <option value={"4"}>Widowed</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold mt-2">
                                    <span>Structure & Division</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="">
                                        {/* <InputLabel className="" value={"Structure"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={structureSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Structure--"}
                                            value={
                                                dataEditEmployment.STRUCTURE_ID ===
                                                null
                                                    ? dataEditEmployment.STRUCTURE_ID
                                                    : {
                                                          label: getStructureLabel(
                                                              dataEditEmployment.STRUCTURE_ID
                                                          ),
                                                          value: dataEditEmployment.STRUCTURE_ID,
                                                      }
                                            }
                                            onChange={(val: any) => {
                                                setDataEditEmployment({
                                                    ...dataEditEmployment,
                                                    STRUCTURE_ID: val.value,
                                                });
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                    <div className="">
                                        {/* <InputLabel className="" value={"Division"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={divisionSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Division--"}
                                            value={
                                                dataEditEmployment.DIVISION_ID ===
                                                null
                                                    ? dataEditEmployment.DIVISION_ID
                                                    : {
                                                          label: getDivisionLabel(
                                                              dataEditEmployment.DIVISION_ID
                                                          ),
                                                          value: dataEditEmployment.DIVISION_ID,
                                                      }
                                            }
                                            onChange={(val: any) => {
                                                setDataEditEmployment({
                                                    ...dataEditEmployment,
                                                    DIVISION_ID: val.value,
                                                });
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                    <div className="">
                                        {/* <InputLabel className="" value={"Office"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={officeSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Office--"}
                                            value={
                                                dataEditEmployment.OFFICE_ID ===
                                                null
                                                    ? dataEditEmployment.OFFICE_ID
                                                    : {
                                                          label: getOfficeLabel(
                                                              dataEditEmployment.OFFICE_ID
                                                          ),
                                                          value: dataEditEmployment.OFFICE_ID,
                                                      }
                                            }
                                            // onChange={(e) =>
                                            //     inputDataBank(
                                            //         "BANK_ID",
                                            //         e.target.value,
                                            //         i
                                            //     )
                                            // }
                                            onChange={(val: any) => {
                                                setDataEditEmployment({
                                                    ...dataEditEmployment,
                                                    OFFICE_ID: val.value,
                                                });
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-black"
                                                colSpan={4}
                                            >
                                                Family Member
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataEditEmployment
                                            .t_employment_family_member
                                            ?.length !== 0 ? (
                                            <>
                                                {dataEditEmployment.t_employment_family_member?.map(
                                                    (cm: any, i: number) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="py-3 px-2">
                                                                    <span className="text-sm">
                                                                        Family
                                                                        Member{" "}
                                                                        {/* {i + 1} */}
                                                                    </span>
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.EMPLOYEE_FAMILY_MEMBER_NAME
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputFamilyMember(
                                                                                "EMPLOYEE_FAMILY_MEMBER_NAME",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Name *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <select
                                                                        className="mt-7 rounded-md border-0 py-1.5 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 w-full"
                                                                        value={
                                                                            cm.EMPLOYEE_RELATIONSHIP_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputFamilyMember(
                                                                                "EMPLOYEE_RELATIONSHIP_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Employee
                                                                            Relationship
                                                                            --
                                                                        </option>
                                                                        {dataRelationshipFamily?.map(
                                                                            (
                                                                                getPersonRelation: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="w-1">
                                                                    <XMarkIcon
                                                                        className="w-7 mt-7 text-red-600 hover:cursor-pointer"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                dataEditEmployment.t_employment_family_member.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setDataEditEmployment(
                                                                                {
                                                                                    ...dataEditEmployment,
                                                                                    t_employment_family_member:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : null}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer text-black"
                                                    onClick={(e) =>
                                                        addRowFamilyMember(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Family Number
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-slate-900-700"
                                                colSpan={3}
                                            >
                                                <span>Employee Contact</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataEditEmployment.m_employment_contact?.map(
                                            (
                                                dataEmployeeContact: any,
                                                i: number
                                            ) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                            <TextInput
                                                                type="text"
                                                                value={
                                                                    dataEmployeeContact
                                                                        .t_employee_contact
                                                                        ?.EMPLOYEE_PHONE_NUMBER
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataEmployeeContact(
                                                                        "EMPLOYEE_PHONE_NUMBER",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Employee Number"
                                                            />
                                                        </td>
                                                        <td>
                                                            <TextInput
                                                                type="email"
                                                                value={
                                                                    dataEmployeeContact
                                                                        .t_employee_contact
                                                                        ?.EMPLOYEE_EMAIL
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataEmployeeContact(
                                                                        "EMPLOYEE_EMAIL",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Email"
                                                            />
                                                        </td>
                                                        <td className="">
                                                            <XMarkIcon
                                                                className="w-6 mt-2 text-red-600 hover:cursor-pointer"
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        dataEditEmployment.m_employment_contact.filter(
                                                                            (
                                                                                data: any,
                                                                                a: number
                                                                            ) =>
                                                                                a !==
                                                                                i
                                                                        );
                                                                    setDataEditEmployment(
                                                                        {
                                                                            ...dataEditEmployment,
                                                                            m_employment_contact:
                                                                                updatedData,
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                    onClick={(e) =>
                                                        addRowEmployeeContact(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Employee Contact
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2">
                                <table className="w-full table-auto border border-red-500 overflow-x-auto rounded-xl">
                                    <thead className="border-red-500 bg-red-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-red-700"
                                                colSpan={4}
                                            >
                                                Emergency Contact
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataEditEmployment
                                            .t_employment_emergency?.length !==
                                        0 ? (
                                            <>
                                                {dataEditEmployment.t_employment_emergency?.map(
                                                    (cm: any, i: number) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="py-3 px-2">
                                                                    <span className="text-sm">
                                                                        Emergency
                                                                        Contact{" "}
                                                                        {/* {i + 1} */}
                                                                    </span>
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.EMPLOYEE_EMERGENCY_CONTACT_NAME
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "EMPLOYEE_EMERGENCY_CONTACT_NAME",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Name *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.EMPLOYEE_EMERGENCY_CONTACT_NUMBER
                                                                        }
                                                                        className="mt-7"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "EMPLOYEE_EMERGENCY_CONTACT_NUMBER",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Phone Number *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <select
                                                                        className="mt-7 rounded-md border-0 py-1.5 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 w-full"
                                                                        value={
                                                                            cm.EMPLOYEE_RELATIONSHIP_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "EMPLOYEE_RELATIONSHIP_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        // required
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Employee
                                                                            Relationship
                                                                            --
                                                                        </option>
                                                                        {dataRelationship.map(
                                                                            (
                                                                                getPersonRelation: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="w-1">
                                                                    <XMarkIcon
                                                                        className="w-7 mt-7 text-red-600 hover:cursor-pointer"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                dataEditEmployment.t_employment_emergency.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setDataEditEmployment(
                                                                                {
                                                                                    ...dataEditEmployment,
                                                                                    t_employment_emergency:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : null}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer text-red-500"
                                                    onClick={(e) =>
                                                        addRowEmergencyContact(
                                                            e
                                                        )
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Emergency Contact
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Edit Employment */}

            {/* detail employee */}
            <ModalToAction
                show={modalEmployee.view}
                onClose={() =>
                    setModalEmployee({
                        view: false,
                    })
                }
                title={"Detail Employee Information"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <EmploymentDetail
                            idEmployee={idEmployee}
                            taxStatus={taxStatus}
                            setIsSuccess={setIsSuccess}
                            // handleSuccessEmployment={handleSuccessEmployment}
                        />
                    </>
                }
            />
            {/* End Detail Employee */}
            <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="bg-white p-2 rounded-md shadow-md">
                    <div className="flex justify-end">
                        {file ? (
                            <div
                                className="mt-3 flex justify-center items-center font-semibold text-red-600 cursor-pointer"
                                onClick={(e) => saveUpload(fileNew, idEmployee)}
                            >
                                <div className="bg-red-600 text-white w-24 text-center px-2 py-2 rounded-md hover:bg-red-500 text-sm">
                                    Save
                                </div>
                            </div>
                        ) : (
                            <div
                                className="text-red-600 cursor-pointer"
                                title="Edit Employment"
                                onClick={(e) => handleEditEmployment(e)}
                            >
                                <span>
                                    <PencilSquareIcon className="w-5" />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center relative mt-2">
                        <label
                            htmlFor="imgProfile"
                            className="bg-red-800 w-50 rounded-full"
                        >
                            <div className="absolute w-44 h-44 rounded-full flex justify-center items-center group hover:bg-gray-700 opacity-70 transition duration-500 cursor-pointer">
                                <ArrowUpTrayIcon className="w-10 text-white hidden group-hover:block" />
                            </div>
                            {file ? (
                                <img
                                    className="h-44 w-44 rounded-full border-2 bg-gray-50 border-red-600"
                                    src={file}
                                    alt="Image Person"
                                />
                            ) : dataDetailEmployee.EMPLOYEE_IMAGE_ID === null ||
                              dataDetailEmployee.EMPLOYEE_IMAGE_ID === "" ? (
                                <img
                                    className="h-44 w-44 rounded-full border-2 bg-gray-50"
                                    src={defaultImage}
                                    alt="Image Person"
                                />
                            ) : (
                                <img
                                    className="h-44 w-44 rounded-full border-2 bg-gray-50"
                                    src={
                                        window.location.origin +
                                        "/storage/" +
                                        dataDetailEmployee.document
                                            ?.DOCUMENT_DIRNAME +
                                        dataDetailEmployee.document
                                            ?.DOCUMENT_FILENAME
                                    }
                                    alt="Image Person"
                                />
                            )}

                            <input
                                id="imgProfile"
                                type="file"
                                name="imgProfile"
                                className="hidden"
                                onChange={(e) => handleChange(e)}
                            />
                        </label>
                    </div>
                    <div className="relative mt-9 flex justify-center items-center font-semibold text-red-600">
                        <div className="absolute pb-9">
                            {dataDetailEmployee.EMPLOYEE_FIRST_NAME}
                        </div>
                        <div className="text-[12px] text-gray-500">
                            {dataDetailEmployee.company?.COMPANY_NAME}
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Place Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_BIRTH_PLACE ===
                                    null
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_BIRTH_PLACE}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Date Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_BIRTH_DATE ===
                                    null
                                        ? "-"
                                        : dateFormat(
                                              dataDetailEmployee.EMPLOYEE_BIRTH_DATE,
                                              "dd-mm-yyyy"
                                          )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-0">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Blood Type
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_BLOOD_TYPE ===
                                        "" ||
                                    dataDetailEmployee.EMPLOYEE_BLOOD_TYPE ===
                                        null
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_BLOOD_TYPE ===
                                          1
                                        ? "A"
                                        : dataDetailEmployee.EMPLOYEE_BLOOD_TYPE ===
                                          2
                                        ? "B"
                                        : dataDetailEmployee.EMPLOYEE_BLOOD_TYPE ===
                                          3
                                        ? "AB"
                                        : "O"}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Marital Status
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_MARITAL_STATUS ===
                                        "" ||
                                    dataDetailEmployee.EMPLOYEE_MARITAL_STATUS ===
                                        null
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_MARITAL_STATUS ===
                                          1
                                        ? "Single"
                                        : dataDetailEmployee.EMPLOYEE_MARITAL_STATUS ===
                                          2
                                        ? "Married"
                                        : dataDetailEmployee.EMPLOYEE_MARITAL_STATUS ===
                                          3
                                        ? "Divorced"
                                        : "Widowed"}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-0">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Gender
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_GENDER === "m"
                                        ? "Laki-Laki"
                                        : dataDetailEmployee.EMPLOYEE_GENDER ===
                                          "f"
                                        ? "Perempuan"
                                        : "-"}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No KTP
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_KTP === null ||
                                    dataDetailEmployee.EMPLOYEE_KTP === ""
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_KTP}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-0">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No KK
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_KK === null ||
                                    dataDetailEmployee.EMPLOYEE_KK === ""
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_KK}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No NPWP
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {dataDetailEmployee.EMPLOYEE_NPWP ===
                                        null ||
                                    dataDetailEmployee.EMPLOYEE_NPWP === ""
                                        ? "-"
                                        : dataDetailEmployee.EMPLOYEE_NPWP}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-2 rounded-md shadow-md col-span-2">
                    <div className="grid grid-cols-3 gap-4 divide-x xs:grid xs:grid-cols-1 xs:divide-x-0 lg:grid lg:grid-cols-3 lg:divide-x">
                        <div>
                            <div className="font-semibold text-red-600">
                                <span>Contact</span>
                            </div>
                            {dataDetailEmployee.m_employment_contact?.length ===
                            0 ? (
                                "-"
                            ) : (
                                <>
                                    {dataDetailEmployee.m_employment_contact?.map(
                                        (pc: any, i: number) => {
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between mt-2">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <PhoneIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    pc
                                                                        .t_employee_contact
                                                                        ?.EMPLOYEE_PHONE_NUMBER
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-3">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <EnvelopeIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    pc
                                                                        .t_employee_contact
                                                                        ?.EMPLOYEE_EMAIL
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {i !==
                                                    dataDetailEmployee
                                                        .m_employment_contact
                                                        ?.length -
                                                        1 ? (
                                                        <hr className="mt-2" />
                                                    ) : null}
                                                </div>
                                            );
                                        }
                                    )}
                                </>
                            )}
                            {/* <div className="flex justify-between mt-2">
                                    <div className="relative text-sm text-gray-500">
                                        <span>
                                            <PhoneIcon className="w-4 absolute" />
                                        </span>
                                        <span className="ml-7">
                                            {dataDetailEmployee.EMPLOYEE_CONTACT}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <div className="relative text-sm text-gray-500">
                                        <span>
                                            <EnvelopeIcon className="w-4 absolute" />
                                        </span>
                                        <span className="ml-7">
                                            {dataDetailEmployee.EMPLOYEE_EMAIL}
                                        </span>
                                    </div>
                                </div> */}
                        </div>
                        <div className="px-2 xs:px-0 lg:px-2">
                            <div className="font-semibold text-red-600">
                                <span>Alt Contact</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-sm text-gray-500">
                                    <span className="">
                                        <i>None</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 xs:px-0 lg:px-2">
                            <div
                                className="font-semibold text-red-600 cursor-context-menu"
                                onContextMenu={(e: any) => {
                                    return <span>aloo</span>;
                                }}
                            >
                                <span>Contact Emergency</span>
                            </div>
                            {dataDetailEmployee.t_employment_emergency
                                ?.length === 0 ? (
                                "-"
                            ) : (
                                <>
                                    {dataDetailEmployee.t_employment_emergency?.map(
                                        (cm: any, i: number) => {
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between mt-2">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <UserIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    cm.EMPLOYEE_EMERGENCY_CONTACT_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-3">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <PhoneIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    cm.EMPLOYEE_EMERGENCY_CONTACT_NUMBER
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-3">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <UsersIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    cm
                                                                        .employment_relationship
                                                                        ?.PERSON_RELATIONSHIP_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {i !==
                                                    dataDetailEmployee
                                                        .t_employment_emergency
                                                        ?.length -
                                                        1 ? (
                                                        <hr className="mt-2" />
                                                    ) : null}
                                                </div>
                                            );
                                        }
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <hr className="mt-5" />
                    <div>
                        <div className="font-semibold text-red-600">
                            <span>Family Member</span>
                        </div>
                        {dataDetailEmployee.t_employment_family_member
                            ?.length === 0 ? (
                            "-"
                        ) : (
                            <>
                                <div className="grid grid-cols-4 gap-2 divide-x">
                                    {dataDetailEmployee.t_employment_family_member?.map(
                                        (cm: any, i: number) => {
                                            return (
                                                <div key={i} className="px-2">
                                                    <div className="flex justify-between mt-2">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <UserIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    cm.EMPLOYEE_FAMILY_MEMBER_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-3">
                                                        <div className="relative text-sm text-gray-500">
                                                            <span>
                                                                <UsersIcon className="w-4 absolute" />
                                                            </span>
                                                            <span className="ml-7">
                                                                {
                                                                    cm
                                                                        .employment_relationship
                                                                        ?.PERSON_RELATIONSHIP_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <hr className="mt-5" />
                    <div>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                            <div className="p-2 flex justify-center text-sm font-semibold">
                                <div>
                                    <div className="flex justify-center items-center">
                                        <UserGroupIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <span>Structure</span>
                                    </div>
                                    <div className="flex justify-center items-center text-[12px] text-gray-500">
                                        <span className="">
                                            {dataDetailEmployee.STRUCTURE_ID ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee.structure
                                                      ?.COMPANY_STRUCTURE_NAME}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 flex justify-center text-sm font-semibold">
                                <div>
                                    <div className="flex justify-center items-center">
                                        <IdentificationIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <span>Division</span>
                                    </div>
                                    <div className="flex justify-center items-center text-[12px] text-gray-500">
                                        <span className="">
                                            {dataDetailEmployee.DIVISION_ID ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee
                                                      .division_company
                                                      ?.COMPANY_DIVISION_ALIAS}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 flex justify-center text-sm font-semibold">
                                {/* <div>
                                    <UserGroupIcon className="w-12 text-red-600" />
                                </div> */}
                                <div>
                                    <div className="flex justify-center items-center">
                                        <MapIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <span>Address & Location</span>
                                    </div>
                                    <div className="flex justify-center items-center text-[12px] text-gray-500">
                                        <span className="">
                                            {dataDetailEmployee.OFFICE_ID ===
                                            null
                                                ? "-"
                                                : dataDetailEmployee.office
                                                      ?.COMPANY_OFFICE_ALIAS}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-5" />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div
                            className="bg-red-600 text-white p-2 rounded-md shadow-md cursor-pointer hover:bg-red-500"
                            onClick={(e) => handleEmploymentNew(e)}
                        >
                            <div className="flex justify-center items-center">
                                <span>Employee</span>
                            </div>
                        </div>
                        <div
                            className="bg-red-600 text-white p-2 rounded-md shadow-md cursor-pointer hover:bg-red-500"
                            onClick={(e) => handleAddressPerson(e)}
                        >
                            <div className="flex justify-center items-center">
                                <span>Address Employee</span>
                            </div>
                        </div>
                        <div
                            className="bg-red-600 text-white p-2 rounded-md shadow-md cursor-pointer hover:bg-red-500"
                            onClick={(e) => handleBankAccount(e)}
                        >
                            <div className="flex justify-center items-center">
                                <span>Bank Account</span>
                            </div>
                        </div>
                        <div
                            className="bg-red-600 text-white p-2 rounded-md shadow-md cursor-pointer hover:bg-red-500 hidden"
                            onClick={(e) => handleFamilyMember(e)}
                        >
                            <div className="flex justify-center items-center">
                                <span>Family Member</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
