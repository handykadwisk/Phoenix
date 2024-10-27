import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "@/Images/user/default.jpg";
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
import axios from "axios";
import Select from "react-tailwindcss-select";
import dateFormat from "dateformat";
import {
    ArrowUpIcon,
    ArrowUpTrayIcon,
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    CreditCardIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
    PlusIcon,
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
import DetailEmployment from "./EmploymentDetail";
import DetailStructure from "./StructureDivision";
import { Datepicker } from "flowbite-react";
import test from "node:test";
import BankAccount from "./BankAccount";
// import AddressPerson from "./AddressPerson";
import SelectTailwind from "react-tailwindcss-select";
import AddressPerson from "./AddressPerson";
import DetailPersonAddress from "./DetailPersonAddress";
import DatePicker from "react-datepicker";
import DetailBankAccount from "./DetailBankAccount";
import ToastMessage from "@/Components/ToastMessage";

export default function DetailPerson({
    idPerson,
    idRelation,
    dataPersonRelationship,
}: PropsWithChildren<{
    idPerson: any;
    idRelation: any;
    dataPersonRelationship: any;
}>) {
    const [detailPerson, setDetailPerson] = useState<any>([]);
    const [taxStatus, setTaxStatus] = useState<any>([]);
    const [structure, setStructure] = useState<any>([]);
    const [division, setDivision] = useState<any>([]);
    const [office, setOffice] = useState<any>([]);
    const [bank, setBank] = useState<any>([]);
    const [optionsBank, setOptionsBank] = useState<any>([]);
    const [file, setFile] = useState<any>();
    const [fileNew, setFileNew] = useState<any>();
    const [wilayah, setWilayah] = useState<any>([]);
    // for switch baa
    const [switchPageBAA, setSwitchPageBAA] = useState(false);
    // for switch vip
    const [switchPageVIP, setSwitchPageVIP] = useState(false);
    useEffect(() => {
        getPersonDetail(idPerson);
    }, [idPerson]);

    useEffect(() => {
        getTax();
    }, [idPerson]);

    useEffect(() => {
        getWilayah();
    }, [idPerson]);

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

    const bankSelect = bank?.map((query: any) => {
        return {
            value: query.BANK_ID,
            label: query.BANK_ABBREVIATION,
        };
    });

    const getPersonDetail = async (id: string) => {
        await axios
            .post(`/getPersonDetail`, { id })
            .then((res) => {
                setDetailPerson(res.data);
                console.log("detail", res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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

    const getStructure = async (id: string) => {
        await axios
            .post(`/getStructurePerson`, { id })
            .then((res) => {
                setStructure(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDivision = async (id: string) => {
        await axios
            .post(`/getDivisionPerson`, { id })
            .then((res) => {
                setDivision(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getOffice = async (id: string) => {
        await axios
            .post(`/getOfficePerson`, { id })
            .then((res) => {
                setOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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

    const { data, setData, errors, reset } = useForm<any>({
        PERSON_ID: idPerson,
        PERSONE_ID: "",
        PERSON_CATEGORY: "",
        PERSON_IS_DELETED: "",
        TAX_STATUS_ID: "",
        PERSON_HIRE_DATE: "",
        PERSON_END_DATE: "",
        PERSON_SALARY_ADJUSTMENT1: "",
        PERSON_SALARY_ADJUSTMENT2: "",
        PERSON_RECRUITMENT_LOCATION: "",
    });

    const [editPerson, setEditPerson] = useState<any>({
        PERSON_ID: idPerson,
        PERSON_FIRST_NAME: "",
        PERSON_GENDER: "",
        PERSON_BIRTH_PLACE: "",
        PERSON_BIRTH_DATE: "",
        // PERSON_EMAIL: "",
        // PERSON_CONTACT: "",
        PERSON_UPDATED_BY: "",
        PERSON_UPDATED_DATE: "",
        PERSON_KTP: "",
        PERSON_NPWP: "",
        PERSON_KK: "",
        PERSON_IS_BAA: "",
        PERSON_IS_VIP: "",
        PERSON_BLOOD_TYPE: "",
        PERSON_BLOOD_RHESUS: "",
        PERSON_MARITAL_STATUS: "",
        m_person_contact: [
            {
                t_person_contact: {
                    PERSON_PHONE_NUMBER: "",
                    PERSON_EMAIL: "",
                },
            },
        ],
        contact_emergency: [
            {
                PERSON_EMERGENCY_CONTACT_NAME: "",
                PERSON_EMERGENCY_CONTACT_NUMBER: "",
                PERSON_RELATIONSHIP_ID: "",
            },
        ],
    });

    const [dataAddress, setDataAddress] = useState<any>({
        address_ktp: [
            {
                idPerson: idPerson,
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
        address_domicile: [
            // {
            //     idPerson: idPerson,
            //     ADDRESS_ID: "",
            //     ADDRESS_CATEGORY: "",
            //     ADDRESS_LOCATION_TYPE: "",
            //     ADDRESS_DETAIL: "",
            //     ADDRESS_RT_NUMBER: "",
            //     ADDRESS_RW_NUMBER: "",
            //     ADDRESS_VILLAGE: "",
            //     ADDRESS_DISTRICT: "",
            //     ADDRESS_PROVINCE: "",
            //     ADDRESS_REGENCY: "",
            //     ADDRESS_STATUS: "",
            // },
        ],
        other_address: [],
        // other_address: [
        //     {
        //         idPerson: idPerson,
        //         ADDRESS_ID: "",
        //         ADDRESS_CATEGORY: "",
        //         ADDRESS_LOCATION_TYPE: "",
        //         ADDRESS_DETAIL: "",
        //         ADDRESS_RT_NUMBER: "",
        //         ADDRESS_RW_NUMBER: "",
        //         ADDRESS_VILLAGE: "",
        //         ADDRESS_DISTRICT: "",
        //         ADDRESS_PROVINCE: "",
        //         ADDRESS_REGENCY: "",
        //         ADDRESS_STATUS: "",
        //     },
        // ],
    });

    const [dataStructure, setDataStructure] = useState<any>({
        PERSON_ID: idPerson,
        STRUCTURE_ID: "",
        DIVISION_ID: "",
        OFFICE_ID: "",
    });

    const [dataStructureId, setDataStructureId] = useState<any>({
        PERSON_ID: idPerson,
        STRUCTURE_ID: "",
        DIVISION_ID: "",
        OFFICE_ID: "",
    });

    const [dataBank, setDataBank] = useState<any>({
        account_bank: [],
    });

    // for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // modal structure
    const [modalStructure, setModalStructure] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const [modalBank, setModalBank] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const [modalAddressPerson, setModalAddressPerson] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const addRowEmergencyContact = (e: FormEvent) => {
        e.preventDefault();
        setEditPerson({
            ...editPerson,
            contact_emergency: [
                ...editPerson.contact_emergency,
                {
                    PERSON_EMERGENCY_CONTACT_NAME: "",
                    PERSON_EMERGENCY_CONTACT_NUMBER: "",
                    PERSON_RELATIONSHIP_ID: "",
                },
            ],
        });
    };

    const saveUpload = async (files: any, id: string) => {
        await axios
            .post(
                `/uploadFile`,
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
                getPersonDetail(res.data[0]);
                setTimeout(() => {
                    setIsSuccess("");
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const inputContactEmergency = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...editPerson.contact_emergency];
        changeVal[i][name] = value;
        setData("contact_emergency", changeVal);
    };

    const handleEditPerson = async (e: FormEvent) => {
        setEditPerson(detailPerson);
        if (detailPerson.PERSON_IS_BAA == "1") {
            setSwitchPageBAA(true);
        } else {
            setSwitchPageBAA(false);
        }
        if (detailPerson.PERSON_IS_VIP == "1") {
            setSwitchPageVIP(true);
        } else {
            setSwitchPageVIP(false);
        }
        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    const handleCheckboxEditBAA = (e: any) => {
        if (e == true) {
            setSwitchPageBAA(true);
            setEditPerson({ ...editPerson, PERSON_IS_BAA: "1" });
        } else {
            setSwitchPageBAA(false);
            setEditPerson({ ...editPerson, PERSON_IS_BAA: "0" });
        }
    };

    const handleCheckboxEditVIP = (e: any) => {
        if (e == true) {
            setSwitchPageVIP(true);
            setEditPerson({ ...editPerson, PERSON_IS_VIP: "1" });
        } else {
            setSwitchPageVIP(false);
            setEditPerson({ ...editPerson, PERSON_IS_VIP: "0" });
        }
    };

    const handleEmployment = async (e: FormEvent) => {
        detailPerson.PERSONE_ID !== null &&
        detailPerson.PERSON_CATEGORY !== null &&
        detailPerson.PERSON_IS_DELETED !== null &&
        detailPerson.TAX_STATUS_ID !== null &&
        detailPerson.PERSON_HIRE_DATE !== null &&
        detailPerson.PERSON_SALARY_ADJUSTMENT1 !== null &&
        detailPerson.PERSON_SALARY_ADJUSTMENT2 !== null
            ? setModal({
                  add: false,
                  delete: false,
                  edit: false,
                  view: !modal.view,
                  document: false,
                  search: false,
              })
            : setModal({
                  add: !modal.add,
                  delete: false,
                  edit: false,
                  view: false,
                  document: false,
                  search: false,
              });
    };

    const handleEmploymentNew = async (e: FormEvent) => {
        e.preventDefault();

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };

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
        detailPerson.m_address_person?.length === 0
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

    const handleStructure = async (e: FormEvent) => {
        e.preventDefault();

        setDataStructureId(detailPerson);
        getStructure(idRelation);
        getDivision(idRelation);
        getOffice(idRelation);
        detailPerson.STRUCTURE_ID !== null &&
        detailPerson.DIVISION_ID !== null &&
        detailPerson.OFFICE_ID !== null
            ? setModalStructure({
                  add: false,
                  delete: false,
                  edit: !modalStructure.edit,
                  view: false,
                  document: false,
                  search: false,
              })
            : setModalStructure({
                  add: !modalStructure.add,
                  delete: false,
                  edit: false,
                  view: false,
                  document: false,
                  search: false,
              });
    };

    // const [dataPersonBank, setDataPersonBank] = useState<any>({
    //     idPerson: "",
    //     BANK_ACCOUNT: [
    //         {
    //             idPerson: idPerson,
    //             PERSON_BANK_ACCOUNT_NAME: "",
    //             PERSON_BANK_ACCOUNT_NUMBER: "",
    //             PERSON_BANK_ACCOUNT_FOR: null,
    //             BANK_ID: "",
    //         },
    //     ],
    // });

    const handleBankAccount = async (e: FormEvent) => {
        e.preventDefault();

        getRBank();
        getForBankAccount();
        if (detailPerson.t_person_bank?.length === 0) {
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

    const handleSuccessEditPerson = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            setIsSuccess(message[1]);
            getPersonDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const handleSuccessAddAddress = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Add Address",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getPersonDetail(message[0]);
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
                    setDataAddress({
                        address_ktp: [
                            {
                                idPerson: idPerson,
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
                        address_domicile: [
                            // {
                            //     idPerson: idPerson,
                            //     ADDRESS_ID: "",
                            //     ADDRESS_CATEGORY: "",
                            //     ADDRESS_LOCATION_TYPE: "",
                            //     ADDRESS_DETAIL: "",
                            //     ADDRESS_RT_NUMBER: "",
                            //     ADDRESS_RW_NUMBER: "",
                            //     ADDRESS_VILLAGE: "",
                            //     ADDRESS_DISTRICT: "",
                            //     ADDRESS_PROVINCE: "",
                            //     ADDRESS_REGENCY: "",
                            //     ADDRESS_STATUS: "",
                            // },
                        ],
                        other_address: [],
                    });
                }
            });
        }
    };

    const handleSuccessEmployment = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            setData({
                PERSON_ID: idPerson,
                PERSONE_ID: "",
                PERSON_CATEGORY: "",
                PERSON_IS_DELETED: "",
                TAX_STATUS_ID: "",
                PERSON_HIRE_DATE: "",
                PERSON_END_DATE: "",
                PERSON_SALARY_ADJUSTMENT1: "",
                PERSON_SALARY_ADJUSTMENT2: "",
                PERSON_RECRUITMENT_LOCATION: "",
            });
            Swal.fire({
                title: "Success",
                text: "Employment Information Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getPersonDetail(message[0]);
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

    const handleSuccess = (message: string) => {
        // setIsSuccess("");
        // if (message !== "") {
        Swal.fire({
            title: "Success",
            text: "Bank Account Added",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getPersonDetail(idPerson);
            }
        });
        // }
    };

    const handleSuccessStructure = (message: string) => {
        setIsSuccess("");
        if (message[1] === "add") {
            setIsSuccess(message[2]);
            setDataStructure({
                PERSON_ID: idPerson,
                STRUCTURE_ID: "",
                DIVISION_ID: "",
                OFFICE_ID: "",
            });
            getPersonDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        } else {
            setIsSuccess("Person Structure Edited");
            getPersonDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [checkDomAddress, setCheckDomAddress] = useState({
        domAddress: "",
    });

    const handleCheckbox = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setCheckDomAddress({
                ...checkDomAddress,
                domAddress: "3",
            });
        } else {
            setCheckDomAddress({
                ...checkDomAddress,
                domAddress: "",
            });
        }
    };

    const wilayahSelect = wilayah?.map((query: any) => {
        return {
            value: query.kode,
            label: query.nama,
        };
    });

    const inputDataPersonContact = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...editPerson.m_person_contact];
        changeVal[i].t_person_contact[name] = value;
        setEditPerson({
            ...editPerson,
            m_person_contact: changeVal,
        });
    };

    const addRowPersonContact = (e: FormEvent) => {
        e.preventDefault();
        setEditPerson({
            ...editPerson,
            m_person_contact: [
                ...editPerson.m_person_contact,
                {
                    t_person_contact: {
                        PERSON_PHONE_NUMBER: "",
                        PERSON_EMAIL: "",
                    },
                },
            ],
        });
    };

    const [isSuccess, setIsSuccess] = useState<string>("");
    return (
        <>
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Detail Employment"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                submitButtonName={""}
                body={
                    <>
                        <span>alo</span>
                    </>
                }
            /> */}

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
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailPersonAddress
                            idPerson={idPerson}
                            wilayah={wilayah}
                            wilayahSelect={wilayahSelect}
                        />
                    </>
                }
            />
            {/* end modal detail address person */}

            {/* address Person */}
            <AddressPerson
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
                idPerson={idPerson}
                handleSuccessAddAddress={handleSuccessAddAddress}
            />

            {/* end address person */}

            {/* Bank Account */}
            <BankAccount
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
                idPerson={idPerson}
                handleSuccess={handleSuccess}
            />
            {/* End Bank Account */}

            {/* Bank Account */}
            <DetailBankAccount
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
                idPerson={idPerson}
                handleSuccess={handleSuccess}
                detailBank={detailPerson.t_person_bank}
            />
            {/* End Bank Account */}

            {/* Edit Person */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.edit}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={"Edit Person"}
                url={`/editPersons`}
                data={editPerson}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccessEditPerson}
                body={
                    <>
                        {/* From Add Person */}
                        <div className="">
                            {/* <div className="">
                                <span className="w-fit border-b-4 border-red-500">
                                    Personal Information
                                </span> */}
                            {/* <div className=""></div> */}
                            {/* </div> */}
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="PERSON_FIRST_NAME"
                                    value={"Name Person"}
                                />
                                <div className="ml-24 text-red-600">*</div>
                                <TextInput
                                    id="PERSON_FIRST_NAME"
                                    type="text"
                                    name="PERSON_FIRST_NAME"
                                    value={editPerson.PERSON_FIRST_NAME}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setEditPerson({
                                            ...editPerson,
                                            PERSON_FIRST_NAME: e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Name Person"
                                />
                            </div>
                            <div className="grid gap-4 grid-cols-3 mt-4">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_GENDER"
                                        value={"Gender"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={editPerson.PERSON_GENDER}
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_GENDER: e.target.value,
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
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BIRTH_PLACE"
                                        value={"Place Of Birth "}
                                    />
                                    <TextInput
                                        id="PERSON_BIRTH_PLACE"
                                        type="text"
                                        name="PERSON_BIRTH_PLACE"
                                        value={editPerson.PERSON_BIRTH_PLACE}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_BIRTH_PLACE:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Place Of Birth"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        htmlFor="PERSON_BIRTH_DATE"
                                        value={"Date Of Birth "}
                                    />
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
                                                editPerson.PERSON_BIRTH_DATE
                                            }
                                            onChange={(date: any) => {
                                                setEditPerson({
                                                    ...editPerson,
                                                    PERSON_BIRTH_DATE:
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
                                    {/* <TextInput
                                        id="PERSON_BIRTH_DATE"
                                        type="date"
                                        name="PERSON_BIRTH_DATE"
                                        value={editPerson.PERSON_BIRTH_DATE}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_BIRTH_DATE:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Date Of Birth"
                                    /> */}
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-3 mt-4 hidden">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BLOOD_TYPE"
                                        value={"Blood Type "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={editPerson.PERSON_BLOOD_TYPE}
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_BLOOD_TYPE:
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
                                        value={editPerson.PERSON_BLOOD_RHESUS}
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_BLOOD_RHESUS:
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
                                        value={editPerson.PERSON_MARITAL_STATUS}
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_MARITAL_STATUS:
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
                            <div className="grid gap-4 grid-cols-3 mt-4">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_KTP"
                                        value={"Person KTP"}
                                    />
                                    <TextInput
                                        id="PERSON_KTP"
                                        type="text"
                                        name="PERSON_KTP"
                                        value={editPerson.PERSON_KTP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_KTP: e.target.value,
                                            });
                                        }}
                                        placeholder="Person KTP"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_NPWP"
                                        value={"Person NPWP "}
                                    />
                                    <TextInput
                                        id="PERSON_NPWP"
                                        type="text"
                                        name="PERSON_NPWP"
                                        value={editPerson.PERSON_NPWP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_NPWP: e.target.value,
                                            });
                                        }}
                                        placeholder="Person NPWP"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_KK"
                                        value={"Person KK "}
                                    />
                                    <TextInput
                                        id="PERSON_KK"
                                        type="text"
                                        name="PERSON_KK"
                                        value={editPerson.PERSON_KK}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setEditPerson({
                                                ...editPerson,
                                                PERSON_KK: e.target.value,
                                            });
                                        }}
                                        placeholder="Person KK"
                                    />
                                </div>
                            </div>
                            <div
                                className="grid grid-cols-2 gap-2 hidden"
                                title="BAA (Business Acquisition Assistant)"
                            >
                                <div className="mt-4 ">
                                    <ul role="list" className="">
                                        <li className="col-span-1 flex rounded-md shadow-sm">
                                            <div className="flex flex-1 items-center truncate rounded-md shadow-md bg-white h-9">
                                                <span className="mt-1 ml-2">
                                                    <Switch
                                                        enabled={switchPageBAA}
                                                        onChangeButton={(
                                                            e: any
                                                        ) =>
                                                            handleCheckboxEditBAA(
                                                                e
                                                            )
                                                        }
                                                    />
                                                </span>
                                                <span className="ml-2 text-sm">
                                                    PERSON IS BAA
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-4 ">
                                    <ul role="list" className="">
                                        <li className="col-span-1 flex rounded-md shadow-sm">
                                            <div className="flex flex-1 items-center truncate rounded-md shadow-md bg-white h-9">
                                                <span className="mt-1 ml-2">
                                                    <Switch
                                                        enabled={switchPageVIP}
                                                        onChangeButton={(
                                                            e: any
                                                        ) =>
                                                            handleCheckboxEditVIP(
                                                                e
                                                            )
                                                        }
                                                    />
                                                </span>
                                                <span className="ml-2 text-sm">
                                                    PERSON IS VIP
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-6">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-slate-900-700"
                                                colSpan={3}
                                            >
                                                <span>Person Contact</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editPerson.m_person_contact?.map(
                                            (Cp: any, i: number) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                            <TextInput
                                                                type="text"
                                                                value={
                                                                    Cp
                                                                        .t_person_contact
                                                                        .PERSON_PHONE_NUMBER
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataPersonContact(
                                                                        "PERSON_PHONE_NUMBER",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Person Number"
                                                            />
                                                        </td>
                                                        <td>
                                                            <TextInput
                                                                id="PERSON_EMAIL"
                                                                type="email"
                                                                name="PERSON_EMAIL"
                                                                value={
                                                                    Cp
                                                                        .t_person_contact
                                                                        .PERSON_EMAIL
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataPersonContact(
                                                                        "PERSON_EMAIL",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Email"
                                                            />
                                                        </td>
                                                        <td>
                                                            <XMarkIcon
                                                                className="w-7 mt-2"
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        editPerson.m_person_contact.filter(
                                                                            (
                                                                                data: any,
                                                                                a: number
                                                                            ) =>
                                                                                a !==
                                                                                i
                                                                        );
                                                                    setEditPerson(
                                                                        {
                                                                            ...editPerson,
                                                                            m_person_contact:
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
                                                        addRowPersonContact(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Person Contact
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6">
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
                                        {editPerson.contact_emergency
                                            ?.length !== 0 ? (
                                            <>
                                                {editPerson.contact_emergency?.map(
                                                    (cm: any, i: number) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="py-3 px-2">
                                                                    <span className="text-sm">
                                                                        Emergency
                                                                        Contact{" "}
                                                                        {i + 1}
                                                                    </span>
                                                                    <TextInput
                                                                        id="PERSON_EMERGENCY_CONTACT_NAME"
                                                                        type="text"
                                                                        name="PERSON_EMERGENCY_CONTACT_NAME"
                                                                        value={
                                                                            cm.PERSON_EMERGENCY_CONTACT_NAME
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PERSON_EMERGENCY_CONTACT_NAME",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        placeholder="Name"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <TextInput
                                                                        id="PERSON_EMERGENCY_CONTACT_NUMBER"
                                                                        type="text"
                                                                        name="PERSON_EMERGENCY_CONTACT_NUMBER"
                                                                        value={
                                                                            cm.PERSON_EMERGENCY_CONTACT_NUMBER
                                                                        }
                                                                        className="mt-7"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PERSON_EMERGENCY_CONTACT_NUMBER",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        placeholder="Phone Number"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <select
                                                                        className="mt-7 rounded-md border-0 py-1.5 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                        value={
                                                                            cm.PERSON_RELATIONSHIP_ID
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PERSON_RELATIONSHIP_ID",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                    >
                                                                        <option>
                                                                            --
                                                                            Person
                                                                            Relationship
                                                                            --
                                                                        </option>
                                                                        {dataPersonRelationship?.map(
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
                                                                <td className="py-3 px-2">
                                                                    {editPerson
                                                                        .contact_emergency
                                                                        ?.length >=
                                                                    1 ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            stroke="currentColor"
                                                                            className="mx-auto h-6 text-red-500 cursor-pointer font-semibold mt-7"
                                                                            onClick={() => {
                                                                                const updatedData =
                                                                                    editPerson.contact_emergency.filter(
                                                                                        (
                                                                                            data: any,
                                                                                            a: number
                                                                                        ) =>
                                                                                            a !==
                                                                                            i
                                                                                    );
                                                                                setEditPerson(
                                                                                    {
                                                                                        ...editPerson,
                                                                                        contact_emergency:
                                                                                            updatedData,
                                                                                    }
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
                                                                    ) : null}
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
            {/* End Edit Person */}
            {/* Empolyment add */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.add}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={"Add Employment Information"}
                url={`/personEmployment`}
                data={data}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccessEmployment}
                body={
                    <>
                        <div className="mt-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="PERSONE_ID"
                                        value={"Employee Id"}
                                    />
                                    <TextInput
                                        id="PERSONE_ID"
                                        type="text"
                                        name="PERSONE_ID"
                                        value={data.PERSONE_ID}
                                        className="mt-1"
                                        onChange={(e) =>
                                            setData(
                                                "PERSONE_ID",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Employee Id"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="PERSON_CATEGORY"
                                        value={"Category"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.PERSON_CATEGORY}
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_CATEGORY",
                                                e.target.value
                                            );
                                        }}
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
                                        htmlFor="PERSON_IS_DELETED"
                                        value={"Status"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.PERSON_IS_DELETED}
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_IS_DELETED",
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
                                    data.PERSON_CATEGORY === "2" ||
                                    data.PERSON_CATEGORY === "3"
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
                                        htmlFor="PERSON_HIRE_DATE"
                                        value={"Hire Date "}
                                    />
                                    <TextInput
                                        id="PERSON_HIRE_DATE"
                                        type="date"
                                        name="PERSON_HIRE_DATE"
                                        value={data.PERSON_HIRE_DATE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "PERSON_HIRE_DATE",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Hire Date"
                                    />
                                </div>
                                <div
                                    className={
                                        data.PERSON_CATEGORY === "2" ||
                                        data.PERSON_CATEGORY === "3"
                                            ? ""
                                            : "hidden"
                                    }
                                >
                                    {data.PERSON_CATEGORY === "2" ||
                                    data.PERSON_CATEGORY === "3" ? (
                                        <>
                                            <InputLabel
                                                htmlFor="PERSON_END_DATE"
                                                value={"End Date "}
                                            />
                                            <TextInput
                                                id="PERSON_END_DATE"
                                                type="date"
                                                name="PERSON_END_DATE"
                                                value={data.PERSON_END_DATE}
                                                className="mt-2"
                                                onChange={(e) =>
                                                    setData(
                                                        "PERSON_END_DATE",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                placeholder="End Date"
                                            />
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <InputLabel
                                        htmlFor="PERSON_SALARY_ADJUSTMENT1"
                                        value={"First Salary Adjustment "}
                                    />
                                    <TextInput
                                        id="PERSON_SALARY_ADJUSTMENT1"
                                        type="date"
                                        name="PERSON_SALARY_ADJUSTMENT1"
                                        value={data.PERSON_SALARY_ADJUSTMENT1}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "PERSON_SALARY_ADJUSTMENT1",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="First Salary Adjustment"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="PERSON_SALARY_ADJUSTMENT2"
                                        value={"Secondary Salary Adjustment "}
                                    />
                                    <TextInput
                                        id="PERSON_SALARY_ADJUSTMENT2"
                                        type="date"
                                        name="PERSON_SALARY_ADJUSTMENT2"
                                        value={data.PERSON_SALARY_ADJUSTMENT2}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "PERSON_SALARY_ADJUSTMENT2",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Secondary Salary Adjustment"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="PERSON_RECRUITMENT_LOCATION"
                                    value="Recruitment Location"
                                />
                                <TextArea
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    id="PERSON_RECRUITMENT_LOCATION"
                                    name="PERSON_RECRUITMENT_LOCATION"
                                    defaultValue={
                                        data.PERSON_RECRUITMENT_LOCATION
                                    }
                                    onChange={(e: any) =>
                                        setData(
                                            "PERSON_RECRUITMENT_LOCATION",
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

            {/* Detail Employment */}
            <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
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
                        <DetailEmployment
                            idEmployee={null}
                            taxStatus={null}
                            setIsSuccess={null}
                        />
                    </>
                }
            />
            {/* End Detail employment */}

            {/* Add STRUCTURE Division */}
            <ModalToAdd
                show={modalStructure.add}
                onClose={() => {
                    setModalStructure({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                buttonAddOns={""}
                title={"Add Structure Division"}
                url={`/personStructureDivision`}
                data={dataStructure}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                onSuccess={handleSuccessStructure}
                body={
                    <>
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="">
                                    <InputLabel
                                        className=""
                                        htmlFor="RELATION_ORGANIZATION_ID"
                                        value={"Entity"}
                                    />
                                    {/* <div className="ml-10 text-red-600">*</div> */}
                                    <TextInput
                                        id="RELATION_ORGANIZATION_ID"
                                        type="text"
                                        name="RELATION_ORGANIZATION_ID"
                                        value={
                                            detailPerson.relation
                                                ?.RELATION_ORGANIZATION_NAME
                                        }
                                        className="mt-2 bg-slate-400"
                                        // onChange={(e) =>
                                        //     setDataById({
                                        //         ...dataById,
                                        //         RELATION_ORGANIZATION_ID:
                                        //             e.target.value,
                                        //     })
                                        // }
                                        required
                                        disabled
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="STRUCTURE_ID"
                                        value={"Structure"}
                                    />
                                    <div className="ml-[67px] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructure.STRUCTURE_ID}
                                        onChange={(e) => {
                                            setDataStructure({
                                                ...dataStructure,
                                                STRUCTURE_ID: e.target.value,
                                            });
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- Choose Sub Entity --
                                        </option>
                                        {structure.map(
                                            (dataStructure: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataStructure.RELATION_STRUCTURE_ID
                                                        }
                                                    >
                                                        {
                                                            dataStructure.text_combo
                                                        }
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
                                        htmlFor="DIVISION_ID"
                                        value={"Division"}
                                    />
                                    <div className="ml-[58px] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructure.DIVISION_ID}
                                        onChange={(e) => {
                                            setDataStructure({
                                                ...dataStructure,
                                                DIVISION_ID: e.target.value,
                                            });
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- Choose Division --
                                        </option>
                                        {division.map(
                                            (dataDivision: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataDivision.RELATION_DIVISION_ID
                                                        }
                                                    >
                                                        {
                                                            dataDivision.text_combo
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="OFFICE_ID"
                                        value={"Office"}
                                    />
                                    <div className="ml-[45px] text-red-600">
                                        *
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructure.OFFICE_ID}
                                        onChange={(e) => {
                                            setDataStructure({
                                                ...dataStructure,
                                                OFFICE_ID: e.target.value,
                                            });
                                        }}
                                        required
                                    >
                                        <option value={""}>
                                            -- Choose Office --
                                        </option>
                                        {office.map(
                                            (dataOffice: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataOffice.RELATION_OFFICE_ID
                                                        }
                                                    >
                                                        {dataOffice.text_combo}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Add Structure Division */}

            {/* Edit Structure and Division */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalStructure.edit}
                onClose={() => {
                    setModalStructure({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={"Edit Structure Division"}
                url={`/personStructureDivision`}
                data={dataStructureId}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                onSuccess={handleSuccessStructure}
                body={
                    <>
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="RELATION_ORGANIZATION_ID"
                                        value={"Entity"}
                                    />
                                    <TextInput
                                        id="RELATION_ORGANIZATION_ID"
                                        type="text"
                                        name="RELATION_ORGANIZATION_ID"
                                        value={
                                            dataStructureId.relation
                                                ?.RELATION_ORGANIZATION_NAME
                                        }
                                        className="mt-2 bg-slate-400"
                                        // onChange={(e) =>
                                        //     setDataById({
                                        //         ...dataById,
                                        //         RELATION_ORGANIZATION_ID:
                                        //             e.target.value,
                                        //     })
                                        // }
                                        required
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="STRUCTURE_ID"
                                        value={"Structure"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructureId.STRUCTURE_ID}
                                        // onChange={(e) => {
                                        //     setDataStructure({
                                        //         ...dataStructure,
                                        //         STRUCTURE_ID: e.target.value,
                                        //     });
                                        // }}
                                        onChange={(e) => {
                                            setDataStructureId({
                                                ...dataStructureId,
                                                STRUCTURE_ID: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Structure --
                                        </option>
                                        {structure.map(
                                            (dataStructure: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataStructure.RELATION_STRUCTURE_ID
                                                        }
                                                    >
                                                        {
                                                            dataStructure.text_combo
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <InputLabel
                                        htmlFor="DIVISION_ID"
                                        value={"Division"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructureId.DIVISION_ID}
                                        onChange={(e) => {
                                            setDataStructureId({
                                                ...dataStructureId,
                                                DIVISION_ID: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Division --
                                        </option>
                                        {division.map(
                                            (dataDivision: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataDivision.RELATION_DIVISION_ID
                                                        }
                                                    >
                                                        {
                                                            dataDivision.text_combo
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="OFFICE_ID"
                                        value={"Office"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataStructureId.OFFICE_ID}
                                        onChange={(e) => {
                                            setDataStructureId({
                                                ...dataStructureId,
                                                OFFICE_ID: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Office --
                                        </option>
                                        {office.map(
                                            (dataOffice: any, i: number) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            dataOffice.RELATION_OFFICE_ID
                                                        }
                                                    >
                                                        {dataOffice.text_combo}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Edit Structure And Division */}

            <div className="mt-4">
                {/* Profile and information */}
                <div className="xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-3 lg:gap-4">
                    <div className="bg-white p-4 shadow-md rounded-md">
                        <div
                            className={
                                detailPerson.PERSON_IS_VIP === 1
                                    ? "flex justify-between items-center"
                                    : "flex justify-end"
                            }
                        >
                            {/* label vip */}
                            {detailPerson.PERSON_IS_VIP === 1 ? (
                                <>
                                    <div className="bg-amber-600 w-fit font-semibold text-sm text-white px-2 rounded-md">
                                        <span>VIP</span>
                                    </div>
                                </>
                            ) : null}
                            {/* button save gambar */}
                            {file ? (
                                <div
                                    className="mt-3 flex justify-center items-center font-semibold text-red-600 cursor-pointer"
                                    onClick={(e) =>
                                        saveUpload(fileNew, idPerson)
                                    }
                                >
                                    <div className="bg-red-600 text-white w-24 text-center px-2 py-2 rounded-md hover:bg-red-500 text-sm">
                                        Save
                                    </div>
                                </div>
                            ) : (
                                <a
                                    className="hover:text-red-500 cursor-pointer"
                                    onClick={(e) => handleEditPerson(e)}
                                >
                                    <PencilSquareIcon
                                        className="w-7 text-red-600"
                                        title="Edit Profile"
                                    />
                                </a>
                            )}
                        </div>
                        <div className="flex justify-center items-center relative">
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
                                ) : detailPerson.PERSON_IMAGE_ID === null ||
                                  detailPerson.PERSON_IMAGE_ID === "" ? (
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
                                            detailPerson.document
                                                ?.DOCUMENT_DIRNAME +
                                            detailPerson.document
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
                                {detailPerson.PERSON_FIRST_NAME}
                            </div>
                            <div className="text-[12px] text-gray-500">
                                {
                                    detailPerson.relation
                                        ?.RELATION_ORGANIZATION_NAME
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Place Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_BIRTH_PLACE === null
                                        ? "-"
                                        : detailPerson.PERSON_BIRTH_PLACE}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Date Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_BIRTH_DATE === null
                                        ? "-"
                                        : dateFormat(
                                              detailPerson.PERSON_BIRTH_DATE,
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
                                    {detailPerson.PERSON_BLOOD_TYPE === "" ||
                                    detailPerson.PERSON_BLOOD_TYPE === null
                                        ? "-"
                                        : detailPerson.PERSON_BLOOD_TYPE === 1
                                        ? "A"
                                        : detailPerson.PERSON_BLOOD_TYPE === 2
                                        ? "B"
                                        : detailPerson.PERSON_BLOOD_TYPE === 3
                                        ? "AB"
                                        : "O"}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Marital Status
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_MARITAL_STATUS ===
                                        "" ||
                                    detailPerson.PERSON_MARITAL_STATUS === null
                                        ? "-"
                                        : detailPerson.PERSON_MARITAL_STATUS ===
                                          1
                                        ? "Single"
                                        : detailPerson.PERSON_MARITAL_STATUS ===
                                          2
                                        ? "Married"
                                        : detailPerson.PERSON_MARITAL_STATUS ===
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
                                    {detailPerson.PERSON_GENDER === "m"
                                        ? "Laki-Laki"
                                        : detailPerson.PERSON_GENDER === "f"
                                        ? "Perempuan"
                                        : "-"}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No KTP
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_KTP === null ||
                                    detailPerson.PERSON_KTP === ""
                                        ? "-"
                                        : detailPerson.PERSON_KTP}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-0">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No KK
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_KK === null ||
                                    detailPerson.PERSON_KK === ""
                                        ? "-"
                                        : detailPerson.PERSON_KK}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    No NPWP
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_NPWP === null ||
                                    detailPerson.PERSON_NPWP === ""
                                        ? "-"
                                        : detailPerson.PERSON_NPWP}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 bg-white px-5 py-4 shadow-md rounded-md xs:mt-4 lg:mt-0">
                        {/* contact */}
                        <div className="grid grid-cols-3 gap-4 divide-x xs:grid xs:grid-cols-1 xs:divide-x-0 lg:grid lg:grid-cols-3 lg:divide-x">
                            <div>
                                <div className="font-semibold text-red-600">
                                    <span>Contact</span>
                                </div>
                                {detailPerson.m_person_contact?.length === 0 ? (
                                    "-"
                                ) : (
                                    <>
                                        {detailPerson.m_person_contact?.map(
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
                                                                            .t_person_contact
                                                                            ?.PERSON_PHONE_NUMBER
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
                                                                            .t_person_contact
                                                                            ?.PERSON_EMAIL
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {i !==
                                                        detailPerson
                                                            .m_person_contact
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
                                            {detailPerson.PERSON_CONTACT}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <div className="relative text-sm text-gray-500">
                                        <span>
                                            <EnvelopeIcon className="w-4 absolute" />
                                        </span>
                                        <span className="ml-7">
                                            {detailPerson.PERSON_EMAIL}
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
                                <div className="font-semibold text-red-600">
                                    <span>Contact Emergency</span>
                                </div>
                                {detailPerson.contact_emergency?.length ===
                                0 ? (
                                    "-"
                                ) : (
                                    <>
                                        {detailPerson.contact_emergency?.map(
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
                                                                        cm.PERSON_EMERGENCY_CONTACT_NAME
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
                                                                        cm.PERSON_EMERGENCY_CONTACT_NUMBER
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
                                                                            .person_relationship
                                                                            ?.PERSON_RELATIONSHIP_NAME
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {i !==
                                                        detailPerson
                                                            .contact_emergency
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
                        {/* end Contact */}
                        <hr className="mt-5" />
                        {/* Division And Location */}
                        <div className="flex justify-between mt-4">
                            <div className="text-red-600 font-semibold">
                                <span>Structure & Division</span>
                            </div>
                            <a
                                className="hover:text-red-500 cursor-pointer"
                                onClick={(e) => handleStructure(e)}
                            >
                                <PencilSquareIcon
                                    className="w-6 text-red-600"
                                    title="Structure & Division"
                                />
                            </a>
                        </div>
                        {detailPerson.STRUCTURE_ID === null &&
                        detailPerson.DIVISION_ID === null &&
                        detailPerson.OFFICE_ID === null ? (
                            <div className="text-gray-500">
                                <span>
                                    <i>None</i>
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 mt-1">
                                <div className="p-2 grid grid-cols-3 gap-2 relative">
                                    <div className="flex justify-center">
                                        <UserGroupIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="col-span-2 text-sm font-semibold flex items-center">
                                        <div className="absolute">
                                            <span>Structure</span>
                                        </div>
                                        <div className="mt-7 text-[13px] text-gray-500">
                                            <span className="">
                                                {
                                                    detailPerson.structure
                                                        ?.RELATION_STRUCTURE_ALIAS
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 grid grid-cols-3 gap-2 relative">
                                    <div className="flex justify-center">
                                        <IdentificationIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="col-span-2 text-sm font-semibold flex items-center">
                                        <div className="absolute">
                                            <span>Division</span>
                                        </div>
                                        <div className="mt-8 text-[13px] text-gray-500">
                                            <span className="">
                                                {
                                                    detailPerson.division
                                                        ?.RELATION_DIVISION_INITIAL
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 grid grid-cols-3 gap-2 relative">
                                    <div className="flex justify-center">
                                        <MapIcon className="w-12 text-red-600" />
                                    </div>
                                    <div className="col-span-2 text-sm font-semibold flex items-center">
                                        <div className="absolute">
                                            <span>Addres & Location</span>
                                        </div>
                                        <div className="mt-8 text-[13px] text-gray-500">
                                            <span className="">
                                                {
                                                    detailPerson.office
                                                        ?.RELATION_OFFICE_ALIAS
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* end structure division */}
                        <hr className="mt-5" />
                        {/* <div className="flex justify-between mt-4">
                            <div className="text-red-600 font-semibold">
                                <span>Address KTP</span>
                            </div>
                            <a
                                className="hover:text-red-500 cursor-pointer"
                                onClick={(e) => handleStructure(e)}
                            >
                                <PencilSquareIcon
                                    className="w-6"
                                    title="Structure & Division"
                                />
                            </a>
                        </div>
                        {detailPerson.m_address_person?.length === 0 ? (
                            "-"
                        ) : (
                            <div>
                                <p></p>
                            </div>
                        )} */}
                        <div className="grid grid-cols-3 gap-3 mt-4 xs:grid xs:grid-cols-1 lg:grid lg:grid-cols-3">
                            {detailPerson.relation?.HR_MANAGED_BY_APP !== 0 ? (
                                <div className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex cursor-pointer hidden">
                                    <a
                                        className="m-auto"
                                        onClick={(e) => handleEmploymentNew(e)}
                                    >
                                        Employee Information
                                    </a>
                                </div>
                            ) : null}

                            <div
                                className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex cursor-pointer hidden"
                                onClick={(e) => handleAddressPerson(e)}
                            >
                                <a className="m-auto">Address Person</a>
                            </div>
                            {detailPerson.relation?.HR_MANAGED_BY_APP !== 0 ? (
                                <div className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex cursor-pointer hidden">
                                    <a
                                        className="m-auto"
                                        onClick={(e) => handleBankAccount(e)}
                                    >
                                        Bank Account
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                {/* end profile and information */}
            </div>
        </>
    );
}
