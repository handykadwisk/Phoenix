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

    // modal add education
    const [modalCertificate, setModalCertificate] = useState<any>({
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

    console.log(dataCertificate.dataCertificates);

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

    const inputEditCertificate = (
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
    return (
        <>
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
                url={`/addEducationPerson`}
                data={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                onSuccess={handleSuccessAddEducation}
                body={
                    <>
                        <div className="mb-2">
                            <div className="grid grid-cols-14 gap-3">
                                <div className="col-span-3">
                                    <div>
                                        <span>Certificate Name</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Is Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Qualification</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Point</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <span>Certificate Date</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div>
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
                                                        // onChange={(e) =>
                                                        //     inputEditEducation(
                                                        //         "PERSON_EDUCATION_MAJOR",
                                                        //         e.target.value,
                                                        //         i
                                                        //     )
                                                        // }
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
                                                                inputEditCertificate(
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
                                                                    "1",
                                                                    i
                                                                );
                                                            } else {
                                                                inputEditCertificate(
                                                                    "PERSON_CERTIFICATE_IS_QUALIFICATION",
                                                                    "0",
                                                                    i
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span> Yes</span>
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
                                                            // onChange={(e) =>
                                                            //     inputEditEducation(
                                                            //         "EDUCATION_DEGREE_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
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

                                            <div className="col-span-2">
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            dC.PERSON_CERTIFICATE_POINT
                                                        }
                                                        className="mt-1"
                                                        // onChange={(e) =>
                                                        //     inputEditEducation(
                                                        //         "PERSON_EDUCATION_MAJOR",
                                                        //         e.target.value,
                                                        //         i
                                                        //     )
                                                        // }
                                                        placeholder="Point"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            dC.PERSON_CERTIFICATE_START_DATE
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
                                            </div>
                                            <div className="col-span-2">
                                                <div>
                                                    <TextInput
                                                        type="date"
                                                        value={
                                                            dC.PERSON_CERTIFICATE_EXPIRES_DATE
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

                            <div className="mt-2">
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
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
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
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
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
                                                    placeholder="Major"
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

                            <div className="mt-2">
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
                                <div className="grid grid-cols-13 gap-3 px-4 py-0">
                                    <div className="col-span-2 text-md font-semibold">
                                        <div>
                                            <span>From</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-md font-semibold">
                                        <div>
                                            <span>To</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-md font-semibold">
                                        <div>
                                            <span>Degree</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-md font-semibold">
                                        <div>
                                            <span>Major</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-md font-semibold">
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
                                                className="grid grid-cols-13 gap-3 px-4"
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
                                                <div className="col-span-2 text-sm text-gray-500">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.PERSON_EDUCATION_END
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.EDUCATION_DEGREE_ID
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-gray-500 text-sm">
                                                    <div>
                                                        <span>
                                                            {
                                                                pE.PERSON_EDUCATION_MAJOR
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-gray-500 text-sm">
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
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md">
                        <div className="px-2 p-4">
                            <div
                                className="bg-red-500 w-fit p-2 rounded-md text-white hover:cursor-pointer hover:bg-red-400"
                                onClick={(e) => handleAddCertificate(e)}
                            >
                                <span>Add Certificate</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-13 gap-3 px-4 py-0">
                            <div className="col-span-2 text-md font-semibold">
                                <div>
                                    <span>From</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-md font-semibold">
                                <div>
                                    <span>To</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-md font-semibold">
                                <div>
                                    <span>Degree</span>
                                </div>
                            </div>
                            <div className="col-span-3 text-md font-semibold">
                                <div>
                                    <span>Major</span>
                                </div>
                            </div>
                            <div className="col-span-4 text-md font-semibold">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span>School/College/University</span>
                                    </div>
                                    <div>
                                        <span>
                                            <PencilSquareIcon
                                                className="w-6 text-red-600 cursor-pointer"
                                                title="Edit Education"
                                                onClick={(e: any) => {
                                                    handleEditEducation(e);
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md p-2 rounded-bl-md rounded-br-md rounded-tr-md">
                        <div>Document</div>
                    </div>
                )}
            </div>
        </>
    );
}
