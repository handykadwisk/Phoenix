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
import axios from "axios";
import {
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    CreditCardIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
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

export default function EmploymentDetail({
    idPerson,
    taxStatus,
    handleSuccessEmployment,
}: PropsWithChildren<{
    idPerson: any;
    taxStatus: any;
    handleSuccessEmployment: any;
}>) {
    // console.log(dataById);
    useEffect(() => {
        getPersonDetail(idPerson);
    }, [idPerson]);
    const [detailPerson, setDetailPerson] = useState<any>([]);
    const getPersonDetail = async (id: string) => {
        await axios
            .post(`/getPersonDetail`, { id })
            .then((res) => {
                setDetailPerson(res.data);
                console.log("zz", res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [tab, setTab] = useState<any>({
        nameTab: "Employment",
        currentTab: true,
    });
    const tabs = [
        { name: "Employment", href: "#", current: true },
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

    const handleEditEmployment = async (e: FormEvent) => {
        setModalEmployment({
            add: false,
            edit: !modalEmployment.edit,
        });
        setDataById(detailPerson);
    };

    const [dataById, setDataById] = useState<any>({
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

    // modal add education
    const [modalEducation, setModalEducation] = useState<any>({
        add: false,
        edit: false,
    });

    // modal add certificate
    const [modalCertificate, setModalCertificate] = useState<any>({
        add: false,
        edit: false,
    });

    // modal add document
    const [modalDocument, setModalDocument] = useState<any>({
        add: false,
        edit: false,
    });

    const handleAddEducation = async (e: FormEvent) => {
        setModalEducation({
            add: !modalEducation.add,
        });
        getEducationDegree();
    };

    const handleEditEducation = async (e: FormEvent) => {
        setModalEducation({
            edit: !modalEducation.edit,
        });
        setDataEditEducation({
            person_education: detailPerson.person_education,
        });
        getEducationDegree();
    };

    const handleAddCertificate = async (e: FormEvent) => {
        setModalCertificate({
            add: !modalCertificate.add,
        });
        getQualification();
    };

    const handleEditCertificate = async (e: FormEvent) => {
        setModalCertificate({
            edit: !modalCertificate.edit,
        });
        setDataEditCertificate({
            person_certificate: detailPerson.person_certificate,
        });
        getQualification();
    };

    const handleAddDocument = async (e: FormEvent) => {
        setModalDocument({
            add: !modalDocument.add,
        });
        getQualification();
    };

    // data add education
    const [dataEducation, setDataEducation] = useState<any>({
        dataEducations: [
            {
                PERSON_ID: idPerson,
                PERSON_EDUCATION_START: "",
                PERSON_EDUCATION_END: "",
                EDUCATION_DEGREE_ID: "",
                PERSON_EDUCATION_MAJOR: "",
                PERSON_EDUCATION_SCHOOL: "",
            },
        ],
    });

    // data Edit education
    const [dataEditEducation, setDataEditEducation] = useState<any>({
        person_education: [
            {
                PERSON_ID: idPerson,
                PERSON_EDUCATION_START: "",
                PERSON_EDUCATION_END: "",
                EDUCATION_DEGREE_ID: "",
                PERSON_EDUCATION_MAJOR: "",
                PERSON_EDUCATION_SCHOOL: "",
            },
        ],
    });

    // data add certificate
    const [dataCertificate, setDataCertificate] = useState<any>({
        dataCertificates: [
            {
                PERSON_ID: idPerson,
                PERSON_CERTIFICATE_NAME: "",
                PERSON_CERTIFICATE_IS_QUALIFICATION: "",
                CERTIFICATE_QUALIFICATION_ID: "",
                PERSON_CERTIFICATE_POINT: "",
                PERSON_CERTIFICATE_START_DATE: "",
                PERSON_CERTIFICATE_EXPIRES_DATE: "",
            },
        ],
    });

    // data edit certificate
    const [dataEditCertificate, setDataEditCertificate] = useState<any>({
        person_certificate: [
            {
                PERSON_ID: idPerson,
                PERSON_CERTIFICATE_NAME: "",
                PERSON_CERTIFICATE_IS_QUALIFICATION: "",
                CERTIFICATE_QUALIFICATION_ID: "",
                PERSON_CERTIFICATE_POINT: "",
                PERSON_CERTIFICATE_START_DATE: "",
                PERSON_CERTIFICATE_EXPIRES_DATE: "",
            },
        ],
    });

    console.log("acaca", dataEditCertificate);

    const addRowAddEducation = (e: FormEvent) => {
        e.preventDefault();
        setDataEducation({
            ...dataEducation,
            dataEducations: [
                ...dataEducation.dataEducations,
                {
                    PERSON_ID: idPerson,
                    PERSON_EDUCATION_START: "",
                    PERSON_EDUCATION_END: "",
                    EDUCATION_DEGREE_ID: "",
                    PERSON_EDUCATION_MAJOR: "",
                    PERSON_EDUCATION_SCHOOL: "",
                },
            ],
        });
    };

    const addRowEditEducation = (e: FormEvent) => {
        e.preventDefault();
        setDataEditEducation({
            ...dataEditEducation,
            person_education: [
                ...dataEditEducation.person_education,
                {
                    PERSON_ID: idPerson,
                    PERSON_EDUCATION_START: "",
                    PERSON_EDUCATION_END: "",
                    EDUCATION_DEGREE_ID: "",
                    PERSON_EDUCATION_MAJOR: "",
                    PERSON_EDUCATION_SCHOOL: "",
                },
            ],
        });
    };

    const addRowAddCertificate = (e: FormEvent) => {
        e.preventDefault();
        setDataCertificate({
            ...dataCertificate,
            dataCertificates: [
                ...dataCertificate.dataCertificates,
                {
                    PERSON_ID: idPerson,
                    PERSON_CERTIFICATE_NAME: "",
                    PERSON_CERTIFICATE_IS_QUALIFICATION: "",
                    CERTIFICATE_QUALIFICATION_ID: "",
                    PERSON_CERTIFICATE_POINT: "",
                    PERSON_CERTIFICATE_START_DATE: "",
                    PERSON_CERTIFICATE_EXPIRES_DATE: "",
                },
            ],
        });
    };
    const addRowEditCertificate = (e: FormEvent) => {
        e.preventDefault();
        setDataEditCertificate({
            ...dataEditCertificate,
            person_certificate: [
                ...dataEditCertificate.person_certificate,
                {
                    PERSON_ID: idPerson,
                    PERSON_CERTIFICATE_NAME: "",
                    PERSON_CERTIFICATE_IS_QUALIFICATION: "",
                    CERTIFICATE_QUALIFICATION_ID: "",
                    PERSON_CERTIFICATE_POINT: "",
                    PERSON_CERTIFICATE_START_DATE: "",
                    PERSON_CERTIFICATE_EXPIRES_DATE: "",
                },
            ],
        });
    };

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

    const inputEditEducation = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditEducation.person_education];
        changeVal[i][name] = value;
        setDataEditEducation({
            ...dataEditEducation,
            person_education: changeVal,
        });
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

    const inputEditCertificate = (
        name: string,
        value: string | undefined | number,
        i: number
    ) => {
        const changeVal: any = [...dataEditCertificate.person_certificate];
        changeVal[i][name] = value;
        setDataEditCertificate({
            ...dataEditCertificate,
            person_certificate: changeVal,
        });
    };

    const handleSuccessAddEducation = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Education Add",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                }
            });
        }
    };
    const handleSuccessEditEducation = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Education Edit",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                }
            });
        }
    };

    const handleSuccessAddCertificate = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Certificate Add",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                }
            });
        }
    };
    const handleSuccessEditCertificate = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Certificate Edit",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                }
            });
        }
    };

    const handleSuccessAddDocument = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Document Add",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                    setDataDocument({
                        PERSON_ID: idPerson,
                        ktp_document: "",
                        other_document: "",
                    });
                }
            });
        }
    };

    const [dataDocument, setDataDocument] = useState<any>({
        PERSON_ID: idPerson,
        ktp_document: "",
        other_document: "",
    });

    const handleChange = (e: any) => {
        // setFile(URL.createObjectURL(e.target.files[0]));
        setDataDocument({
            ...dataDocument,
            ktp_document: e.target.files,
        });
    };

    const handleChangeOther = (e: any) => {
        // setFile(URL.createObjectURL(e.target.files[0]));
        setDataDocument({
            ...dataDocument,
            other_document: e.target.files,
        });
    };

    console.log(dataDocument);

    const alertDelete = async (idDocument: string, idPerson: string) => {
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
                deleteDocument(idDocument, idPerson);
            }
        });
    };

    const deleteDocument = async (idDocument: string, idPerson: string) => {
        // console.log(data);
        await axios
            .post(`/deleteDocument`, { idDocument, idPerson })
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    text: "Images Delete",
                    icon: "success",
                }).then((result: any) => {
                    // console.log(result);
                    if (result.value) {
                        getPersonDetail(idPerson);
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
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const downloadImage = async (id: string) => {
        // console.log(data);
        await axios
            .get(`/downloadImage/${id}`)
            .then((res) => {
                // Swal.fire({
                //     title: "Success",
                //     text: "Images Delete",
                //     icon: "success",
                // }).then((result: any) => {
                //     // console.log(result);
                //     if (result.value) {
                //         getPersonDetail(idPerson);
                //         // getPersons();
                //         // setGetDetailRelation(message);
                //         // setModal({
                //         //     add: false,
                //         //     delete: false,
                //         //     edit: false,
                //         //     view: true,
                //         //     document: false,
                //         //     search: false,
                //         // });
                //     }
                // });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {/* Edit Document */}
            <ModalToAdd
                show={modalDocument.add}
                onClose={() => {
                    setModalDocument({
                        add: false,
                    });
                    getPersonDetail(idPerson);
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
                                <div>
                                    <span>Photo KTP</span>
                                </div>
                                <div>
                                    {/* <TextInput
                                        type="file"
                                        // value={pC.PERSON_CERTIFICATE_NAME}
                                        className="mt-1"
                                        onChange={(e) => {
                                            inputEditCertificate(
                                                "PERSON_CERTIFICATE_NAME",
                                                e.target.value,
                                                i
                                            );
                                        }}
                                        placeholder="Certificate Name"
                                        required
                                    /> */}
                                    <input
                                        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                        id="file_input"
                                        type="file"
                                        onChange={(e) => handleChange(e)}
                                    ></input>
                                </div>
                                <div className="mt-3">
                                    <span>Other Document</span>
                                </div>
                                <div>
                                    {/* <TextInput
                                        type="file"
                                        // value={pC.PERSON_CERTIFICATE_NAME}
                                        className="mt-1"
                                        onChange={(e) => {
                                            inputEditCertificate(
                                                "PERSON_CERTIFICATE_NAME",
                                                e.target.value,
                                                i
                                            );
                                        }}
                                        placeholder="Certificate Name"
                                        required
                                    /> */}
                                    <input
                                        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                        id="file_input"
                                        type="file"
                                        multiple
                                        onChange={(e) => handleChangeOther(e)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Certificate */}

            {/* Edit Certificate */}
            <ModalToAdd
                show={modalCertificate.edit}
                onClose={() => {
                    setModalCertificate({
                        edit: false,
                    });
                    getPersonDetail(idPerson);
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
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Date</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Expiry Date</span>
                                    </div>
                                </div>
                            </div>
                            {dataEditCertificate.person_certificate?.map(
                                (pC: any, i: number) => {
                                    return (
                                        <div className="grid grid-cols-14 gap-3">
                                            <div className="col-span-3">
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            pC.PERSON_CERTIFICATE_NAME
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputEditCertificate(
                                                                "PERSON_CERTIFICATE_NAME",
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
                                                            pC.PERSON_CERTIFICATE_IS_QUALIFICATION
                                                        }
                                                        defaultChecked={
                                                            pC.PERSON_CERTIFICATE_IS_QUALIFICATION
                                                        }
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                inputEditCertificate(
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
                                                                    1,
                                                                    i
                                                                );
                                                            } else {
                                                                inputEditCertificate(
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
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
                                            {pC.PERSON_CERTIFICATE_IS_QUALIFICATION ===
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
                                                            // onChange={(e) =>
                                                            //     inputEditEducation(
                                                            //         "EDUCATION_DEGREE_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
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
                                            pC.PERSON_CERTIFICATE_IS_QUALIFICATION ===
                                                1 ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                pC.PERSON_CERTIFICATE_POINT
                                                            }
                                                            className="mt-1"
                                                            onChange={(e) => {
                                                                inputEditCertificate(
                                                                    "PERSON_CERTIFICATE_POINT",
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
                                                                    "PERSON_CERTIFICATE_POINT",
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
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            pC.PERSON_CERTIFICATE_START_DATE
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputEditCertificate(
                                                                "PERSON_CERTIFICATE_START_DATE",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        required
                                                        placeholder="From"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            pC.PERSON_CERTIFICATE_EXPIRES_DATE
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputEditCertificate(
                                                                "PERSON_CERTIFICATE_EXPIRES_DATE",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        required
                                                        placeholder="From"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <span>
                                                        <XMarkIcon
                                                            className="w-6 mt-3 text-red-600 cursor-pointer"
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataEditCertificate.person_certificate.filter(
                                                                        (
                                                                            data: any,
                                                                            a: number
                                                                        ) =>
                                                                            a !==
                                                                            i
                                                                    );
                                                                // console.log(
                                                                //     "aaavv",
                                                                //     updatedData
                                                                // );
                                                                setDataEditCertificate(
                                                                    {
                                                                        ...dataEditCertificate,
                                                                        person_certificate:
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

            {/* Add Certificate */}
            <ModalToAdd
                show={modalCertificate.add}
                onClose={() => {
                    setModalCertificate({
                        add: false,
                    });
                    getPersonDetail(idPerson);
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
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Date</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm">
                                        <span>Certificate Expiry Date</span>
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
                                                            dC.PERSON_CERTIFICATE_NAME
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputAddCertificate(
                                                                "PERSON_CERTIFICATE_NAME",
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
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
                                                                    "1",
                                                                    i
                                                                );
                                                            } else {
                                                                inputAddCertificate(
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
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
                                            {dC.PERSON_CERTIFICATE_IS_QUALIFICATION ===
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
                                                            // onChange={(e) =>
                                                            //     inputEditEducation(
                                                            //         "EDUCATION_DEGREE_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
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
                                            dC.PERSON_CERTIFICATE_IS_QUALIFICATION ===
                                                "1" ? (
                                                <div className="col-span-2">
                                                    <div>
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                dC.PERSON_CERTIFICATE_POINT
                                                            }
                                                            className="mt-1"
                                                            onChange={(e) => {
                                                                inputAddCertificate(
                                                                    "PERSON_CERTIFICATE_POINT",
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
                                                                inputAddCertificate(
                                                                    "PERSON_CERTIFICATE_POINT",
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
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            dC.PERSON_CERTIFICATE_START_DATE
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputAddCertificate(
                                                                "PERSON_CERTIFICATE_START_DATE",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        required
                                                        placeholder="From"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            dC.PERSON_CERTIFICATE_EXPIRES_DATE
                                                        }
                                                        className="mt-1"
                                                        onChange={(e) => {
                                                            inputAddCertificate(
                                                                "PERSON_CERTIFICATE_EXPIRES_DATE",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        required
                                                        placeholder="From"
                                                    />
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
                                                                // console.log(
                                                                //     "aaavv",
                                                                //     updatedData
                                                                // );
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

            {/* Edit Education */}
            <ModalToAdd
                show={modalEducation.edit}
                onClose={() => {
                    setModalEducation({
                        edit: false,
                    });
                    getPersonDetail(idPerson);
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
                        <div className="mb-2">
                            <div className="grid grid-cols-13 gap-3">
                                <div className="col-span-2">
                                    <div>
                                        <span>From</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>To</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Degree</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>Major</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>School/College/University</span>
                                    </div>
                                </div>
                            </div>
                            {dataEditEducation.person_education?.map(
                                (dE: any, i: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-13 gap-3"
                                            key={i}
                                        >
                                            <div className="col-span-2">
                                                <TextInput
                                                    type="date"
                                                    value={
                                                        dE.PERSON_EDUCATION_START
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "PERSON_EDUCATION_START",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                    placeholder="From"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <TextInput
                                                    type="date"
                                                    value={
                                                        dE.PERSON_EDUCATION_END
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "PERSON_EDUCATION_END",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                    placeholder="From"
                                                />
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
                                                        dE.PERSON_EDUCATION_MAJOR
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "PERSON_EDUCATION_MAJOR",
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
                                                        dE.PERSON_EDUCATION_SCHOOL
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEditEducation(
                                                            "PERSON_EDUCATION_SCHOOL",
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
                                                                dataEditEducation.person_education.filter(
                                                                    (
                                                                        data: any,
                                                                        a: number
                                                                    ) => a !== i
                                                                );
                                                            // console.log(
                                                            //     "aaavv",
                                                            //     updatedData
                                                            // );
                                                            setDataEditEducation(
                                                                {
                                                                    ...dataEditEducation,
                                                                    person_education:
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

            {/* Add Education */}
            <ModalToAdd
                show={modalEducation.add}
                onClose={() => {
                    setModalEducation({
                        add: false,
                    });
                    getPersonDetail(idPerson);
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
                        <div className="mb-2">
                            <div className="grid grid-cols-13 gap-3">
                                <div className="col-span-2">
                                    <div>
                                        <span>From</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>To</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Degree</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>Major</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <span>School/College/University</span>
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
                                                <TextInput
                                                    type="date"
                                                    value={
                                                        dE.PERSON_EDUCATION_START
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "PERSON_EDUCATION_START",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                    placeholder="From"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <TextInput
                                                    type="date"
                                                    value={
                                                        dE.PERSON_EDUCATION_END
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "PERSON_EDUCATION_END",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                    placeholder="From"
                                                />
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
                                                        dE.PERSON_EDUCATION_MAJOR
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "PERSON_EDUCATION_MAJOR",
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
                                                        dE.PERSON_EDUCATION_SCHOOL
                                                    }
                                                    className="mt-1"
                                                    onChange={(e) =>
                                                        inputEducation(
                                                            "PERSON_EDUCATION_SCHOOL",
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

            {/* Edit Employment */}
            <ModalToAdd
                show={modalEmployment.edit}
                onClose={() => {
                    setModalEmployment({
                        add: false,
                        edit: false,
                    });
                    getPersonDetail(idPerson);
                }}
                title={"Edit Employment Information"}
                url={`/editPersonEmployment`}
                data={dataById}
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
                                        value={dataById.PERSONE_ID}
                                        className="mt-1"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                PERSONE_ID: e.target.value,
                                            })
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
                                        value={dataById.PERSON_CATEGORY}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                PERSON_CATEGORY: e.target.value,
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
                                        htmlFor="PERSON_IS_DELETED"
                                        value={"Status"}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.PERSON_IS_DELETED}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                PERSON_IS_DELETED:
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
                                    dataById.PERSON_CATEGORY === "2" ||
                                    dataById.PERSON_CATEGORY === "3"
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
                                <div>
                                    <InputLabel
                                        htmlFor="PERSON_HIRE_DATE"
                                        value={"Hire Date "}
                                    />
                                    <TextInput
                                        id="PERSON_HIRE_DATE"
                                        type="date"
                                        name="PERSON_HIRE_DATE"
                                        value={dataById.PERSON_HIRE_DATE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                PERSON_HIRE_DATE:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="Hire Date"
                                    />
                                </div>
                                <div
                                    className={
                                        dataById.PERSON_CATEGORY === "2" ||
                                        dataById.PERSON_CATEGORY === "3"
                                            ? ""
                                            : "hidden"
                                    }
                                >
                                    {dataById.PERSON_CATEGORY === "2" ||
                                    dataById.PERSON_CATEGORY === "3" ? (
                                        <>
                                            <InputLabel
                                                htmlFor="PERSON_END_DATE"
                                                value={"End Date "}
                                            />
                                            <TextInput
                                                id="PERSON_END_DATE"
                                                type="date"
                                                name="PERSON_END_DATE"
                                                value={dataById.PERSON_END_DATE}
                                                className="mt-2"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        PERSON_END_DATE:
                                                            e.target.value,
                                                    })
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
                                        value={
                                            dataById.PERSON_SALARY_ADJUSTMENT1
                                        }
                                        className="mt-2"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                PERSON_SALARY_ADJUSTMENT1:
                                                    e.target.value,
                                            })
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
                                        value={
                                            dataById.PERSON_SALARY_ADJUSTMENT2
                                        }
                                        className="mt-2"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                PERSON_SALARY_ADJUSTMENT2:
                                                    e.target.value,
                                            })
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
                                        dataById.PERSON_RECRUITMENT_LOCATION
                                    }
                                    onChange={(e: any) =>
                                        setDataById({
                                            ...dataById,
                                            PERSON_RECRUITMENT_LOCATION:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />

            {/* Empolyment add */}
            <ModalToAdd
                show={modalEmployment.add}
                onClose={() => {
                    setModalEmployment({
                        add: false,
                    });
                    getPersonDetail(idPerson);
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
            <div className="mb-4">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        defaultValue={tabs.find((tab) => tab.current).name}
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
                {tab.nameTab === "Employment" ? (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md h-48">
                        {detailPerson.PERSONE_ID !== null &&
                        detailPerson.PERSON_CATEGORY !== null &&
                        detailPerson.PERSON_IS_DELETED !== null &&
                        detailPerson.TAX_STATUS_ID !== null &&
                        detailPerson.PERSON_HIRE_DATE !== null &&
                        detailPerson.PERSON_SALARY_ADJUSTMENT1 !== null &&
                        detailPerson.PERSON_SALARY_ADJUSTMENT2 !== null ? (
                            <>
                                <div className="grid grid-cols-4 gap-4 divide-x px-1 py-4">
                                    <div className="px-2">
                                        <div className="text-red-700">
                                            Employee Id
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.PERSONE_ID}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Tax Status
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.TAX_STATUS_ID === null
                                                ? "-"
                                                : detailPerson.tax_status
                                                      ?.TAX_STATUS_NAME}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Location Recruitment
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.PERSON_RECRUITMENT_LOCATION ===
                                            null
                                                ? "-"
                                                : detailPerson.PERSON_RECRUITMENT_LOCATION}
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-red-700">
                                            Category
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.PERSON_CATEGORY === 1
                                                ? "Full-time"
                                                : detailPerson.PERSON_CATEGORY ===
                                                  2
                                                ? "Contract"
                                                : "Intern"}
                                        </div>
                                        <div className="text-red-700 mt-2">
                                            Hire date
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.PERSON_HIRE_DATE}
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-red-700">
                                            Status
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {detailPerson.PERSON_IS_DELETED ===
                                            0
                                                ? "Active"
                                                : "Inactive"}
                                        </div>
                                        {detailPerson.PERSON_CATEGORY === 2 ||
                                        detailPerson.PERSON_CATEGORY === 3 ? (
                                            <>
                                                <div className="text-red-700 mt-2">
                                                    End date
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    {
                                                        detailPerson.PERSON_END_DATE
                                                    }
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="px-2">
                                        <div className="flex justify-between gap-1">
                                            <div className="text-red-700">
                                                Company Facilities
                                                <div className="text-gray-600">
                                                    -
                                                </div>
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
                                        <span>Add Employment</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : tab.nameTab === "Education" ? (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md h-40">
                        {detailPerson.person_education?.length === 0 ? (
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
                                {detailPerson.person_education?.map(
                                    (pE: any, i: number) => {
                                        return (
                                            <div
                                                className="grid grid-cols-13 gap-3 px-4 divide-x mb-2 mt-2"
                                                key={i}
                                            >
                                                <div className="col-span-2 text-sm text-gray-500">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.PERSON_EDUCATION_START
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500 px-2">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.PERSON_EDUCATION_END
                                                            }
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
                                                                pE.PERSON_EDUCATION_MAJOR
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-gray-500 px-2 text-sm">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.PERSON_EDUCATION_SCHOOL
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
                        {detailPerson.person_certificate?.length === 0 ? (
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
                                {detailPerson.person_certificate?.map(
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
                                                                pC.PERSON_CERTIFICATE_NAME
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        {pC.PERSON_CERTIFICATE_IS_QUALIFICATION ===
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
                                                        {pC.PERSON_CERTIFICATE_POINT ===
                                                        null ? (
                                                            <span>{"-"}</span>
                                                        ) : (
                                                            <span>
                                                                {
                                                                    pC.PERSON_CERTIFICATE_POINT
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        <span>
                                                            {
                                                                pC.PERSON_CERTIFICATE_START_DATE
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 px-1">
                                                    <div className="text-sm text-gray-500">
                                                        <span>
                                                            {
                                                                pC.PERSON_CERTIFICATE_EXPIRES_DATE
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
                ) : (
                    <div className="bg-white shadow-md p-4 rounded-bl-md rounded-br-md rounded-tr-md h-full">
                        <div>
                            <div
                                className="bg-red-600 w-fit p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                onClick={(e) => {
                                    handleAddDocument(e);
                                }}
                            >
                                <span>Add Document</span>
                            </div>
                        </div>
                        <div className="mt-2 grid-cols-4 grid gap-4">
                            <div className="text-sm font-semibold ">
                                <span>Images</span>
                            </div>
                            <div className="text-sm font-semibold ">
                                <span>Name Document</span>
                            </div>
                            <div className="text-sm font-semibold ">
                                <span>Type / Size</span>
                            </div>
                        </div>
                        {detailPerson.m_person_document?.map(
                            (mPD: any, l: number) => {
                                return (
                                    <div className="grid-cols-4 grid gap-4 mb-2">
                                        <div className="text-sm ">
                                            <span>
                                                <img
                                                    className="h-44 w-44 rounded-md border-2 bg-gray-50 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
                                                    src={
                                                        window.location.origin +
                                                        "/storage/" +
                                                        mPD.document_person
                                                            ?.DOCUMENT_DIRNAME +
                                                        mPD.document_person
                                                            ?.DOCUMENT_FILENAME
                                                    }
                                                    alt="Image Person"
                                                    // onClick={(e) => {
                                                    //     downloadImage(
                                                    //         mPD.document_person
                                                    //             ?.DOCUMENT_ID
                                                    //     );
                                                    // }}
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
                                                />
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 font-semibold ">
                                            <span>
                                                {
                                                    mPD.document_person
                                                        .DOCUMENT_ORIGINAL_NAME
                                                }
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold text-gray-500">
                                                <span>
                                                    {
                                                        mPD.document_person
                                                            .DOCUMENT_FILETYPE
                                                    }
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="text-xs">
                                                    {
                                                        mPD.document_person
                                                            .DOCUMENT_FILESIZE
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span>
                                                <XMarkIcon
                                                    className="w-7 text-red-600 hover:cursor-pointer"
                                                    title="Delete Images"
                                                    onClick={(e) =>
                                                        alertDelete(
                                                            mPD.DOCUMENT_ID,
                                                            mPD.PERSON_ID
                                                        )
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
