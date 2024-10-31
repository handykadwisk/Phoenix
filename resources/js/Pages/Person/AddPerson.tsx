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
    PencilIcon,
    PencilSquareIcon,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddPerson({
    show,
    modal,
    handleSuccessPersonalInfo,
    setData,
    data,
}: PropsWithChildren<{
    show: any;
    modal: any;
    setData: any;
    data: any;
    handleSuccessPersonalInfo?: any;
}>) {
    useEffect(() => {
        getPersonRelationship();
    }, []);
    // for switch baa
    const [switchPageBAA, setSwitchPageBAA] = useState(false);
    // for switch vip
    const [switchPageVIP, setSwitchPageVIP] = useState(false);
    const [isSuccess, setIsSuccess] = useState<string>("");
    // for data from
    const [dataPersonRelationship, setDataPersonRelationship] = useState<any>(
        []
    );

    const getPersonRelationship = async () => {
        await axios
            .get(`/getPersonRelationship`)
            .then((res) => {
                setDataPersonRelationship(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addRowEmergencyContact = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            contact_emergency: [
                ...data.contact_emergency,
                {
                    PERSON_EMERGENCY_CONTACT_NAME: "",
                    PERSON_EMERGENCY_CONTACT_NUMBER: "",
                    PERSON_RELATIONSHIP_ID: "",
                },
            ],
        });
    };

    const addRowPersonContact = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            m_person_contact: [
                ...data.m_person_contact,
                {
                    PERSON_PHONE_NUMBER: "",
                },
            ],
        });
    };

    const addRowPersonEmail = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            m_person_email: [
                ...data.m_person_email,
                {
                    PERSON_EMAIL: "",
                },
            ],
        });
    };

    const inputContactEmergency = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.contact_emergency];
        changeVal[i][name] = value;
        setData({
            ...data,
            contact_emergency: changeVal,
        });
    };

    const handleCheckboxBAA = (e: any) => {
        if (e == true) {
            setSwitchPageBAA(true);
            setData("PERSON_IS_BAA", "1");
        } else {
            setSwitchPageBAA(false);
            setData("PERSON_IS_BAA", "0");
        }
    };

    const handleCheckboxVIP = (e: any) => {
        if (e == true) {
            setSwitchPageVIP(true);
            setData("PERSON_IS_VIP", "1");
        } else {
            setSwitchPageVIP(false);
            setData("PERSON_IS_VIP", "0");
        }
    };

    const inputDataPersonContact = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.m_person_contact];
        changeVal[i][name] = value;
        setData({
            ...data,
            m_person_contact: changeVal,
        });
    };

    const inputDataPersonEmail = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.m_person_email];
        changeVal[i][name] = value;
        setData({
            ...data,
            m_person_email: changeVal,
        });
    };

    return (
        <>
            <ModalToAdd
                show={show}
                onClose={modal}
                buttonAddOns={""}
                title={"Add Person"}
                url={`/editPersonRelation`}
                data={data}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccessPersonalInfo}
                body={
                    <>
                        {/* From Add Person */}
                        <div className="">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="PERSON_FIRST_NAME"
                                    value={"Name Person"}
                                />
                                <div className="ml-24 text-red-600">*</div>
                                <TextInput
                                    type="text"
                                    value={data.PERSON_FIRST_NAME}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            PERSON_FIRST_NAME: e.target.value,
                                        })
                                    }
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
                                        value={data.PERSON_GENDER}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                PERSON_GENDER: e.target.value,
                                            });
                                            // setData(
                                            //     "PERSON_GENDER",
                                            //     e.target.value
                                            // );
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
                                        type="text"
                                        value={data.PERSON_BIRTH_PLACE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                PERSON_BIRTH_PLACE:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Place Of Birth"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
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
                                            selected={data.PERSON_BIRTH_DATE}
                                            onChange={(date: any) =>
                                                setData({
                                                    ...data,
                                                    PERSON_BIRTH_DATE:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
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
                                        type="text"
                                        value={data.PERSON_KTP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData({
                                                ...data,
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
                                        type="text"
                                        value={data.PERSON_NPWP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData({
                                                ...data,
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
                                        type="text"
                                        value={data.PERSON_KK}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                PERSON_KK: e.target.value,
                                            });
                                        }}
                                        placeholder="Person KK"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_CONTACT"
                                        value={"Person Number"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.PERSON_CONTACT}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                PERSON_CONTACT: e.target.value,
                                            });
                                        }}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_EMAIL"
                                        value={"Person Email"}
                                    />
                                    <TextInput
                                        type="email"
                                        value={data.PERSON_EMAIL}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                PERSON_EMAIL: e.target.value,
                                            });
                                        }}
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="mt-6">
                                    <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                        <thead className="border-slate-300 bg-slate-300">
                                            <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                                <th
                                                    className="py-2 px-2 text-slate-900-700"
                                                    colSpan={3}
                                                >
                                                    <span>
                                                        Alternative Contact
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.m_person_contact?.map(
                                                (Cp: any, i: number) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                                <TextInput
                                                                    type="text"
                                                                    value={
                                                                        Cp?.PERSON_PHONE_NUMBER
                                                                    }
                                                                    className="mt-2"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataPersonContact(
                                                                            "PERSON_PHONE_NUMBER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    placeholder="Phone Number"
                                                                />
                                                            </td>
                                                            <td>
                                                                <XMarkIcon
                                                                    className="w-7 mt-2 cursor-pointer hover:text-red-600"
                                                                    onClick={() => {
                                                                        const updatedData =
                                                                            data.m_person_contact.filter(
                                                                                (
                                                                                    data: any,
                                                                                    a: number
                                                                                ) =>
                                                                                    a !==
                                                                                    i
                                                                            );
                                                                        setData(
                                                                            {
                                                                                ...data,
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
                                            <tr className="">
                                                <td>
                                                    <a
                                                        className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                        onClick={(e) =>
                                                            addRowPersonContact(
                                                                e
                                                            )
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
                                    <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                        <thead className="border-slate-300 bg-slate-300">
                                            <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                                <th
                                                    className="py-2 px-2 text-slate-900-700"
                                                    colSpan={3}
                                                >
                                                    <span>
                                                        Alternative Email
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.m_person_email?.map(
                                                (Cp: any, i: number) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                                <TextInput
                                                                    type="text"
                                                                    value={
                                                                        Cp?.PERSON_EMAIL
                                                                    }
                                                                    className="mt-2"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataPersonEmail(
                                                                            "PERSON_EMAIL",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    placeholder="Email"
                                                                />
                                                            </td>
                                                            <td>
                                                                <XMarkIcon
                                                                    className="w-7 mt-2 cursor-pointer hover:text-red-600"
                                                                    onClick={() => {
                                                                        const updatedData =
                                                                            data.m_person_email.filter(
                                                                                (
                                                                                    data: any,
                                                                                    a: number
                                                                                ) =>
                                                                                    a !==
                                                                                    i
                                                                            );
                                                                        setData(
                                                                            {
                                                                                ...data,
                                                                                m_person_email:
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
                                            <tr className="">
                                                <td>
                                                    <a
                                                        className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                        onClick={(e) =>
                                                            addRowPersonEmail(e)
                                                        }
                                                    >
                                                        <span className="hover:underline hover:decoration-from-font">
                                                            + Add Person Email
                                                        </span>
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* <div className="mt-6">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-slate-900-700"
                                                colSpan={3}
                                            >
                                                <span>Alternative Contact</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.m_person_contact?.map(
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
                                                                className="w-7 mt-2 hover:text-red-600 hover:cursor-pointer"
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        data.m_person_contact.filter(
                                                                            (
                                                                                data: any,
                                                                                a: number
                                                                            ) =>
                                                                                a !==
                                                                                i
                                                                        );
                                                                    setData({
                                                                        ...data,
                                                                        m_person_contact:
                                                                            updatedData,
                                                                    });
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
                                                        + Add Alternative
                                                        Contact
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
                                                Contact Emergency
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.contact_emergency?.length !==
                                        0 ? (
                                            <>
                                                {data.contact_emergency?.map(
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
                                                                                data.contact_emergency.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
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
                            </div> */}
                            {/* <div className="grid grid-cols-2 gap-2">
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
                                            {data.m_person_contact?.map(
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataPersonContact(
                                                                            "PERSON_PHONE_NUMBER",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    placeholder="Phone Number"
                                                                />
                                                            </td>
                                                            <td>
                                                                {data
                                                                    .m_person_contact
                                                                    .length !==
                                                                1 ? (
                                                                    <XMarkIcon
                                                                        className="w-7 mt-2 cursor-pointer hover:text-red-600"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                data.m_person_contact.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
                                                                                    m_person_contact:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                            <tr className="hidden">
                                                <td>
                                                    <a
                                                        className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                        onClick={(e) =>
                                                            addRowPersonContact(
                                                                e
                                                            )
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
                                    <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                        <thead className="border-slate-300 bg-slate-300">
                                            <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                                <th
                                                    className="py-2 px-2 text-slate-900-700"
                                                    colSpan={3}
                                                >
                                                    <span>Person Email</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.m_person_email?.map(
                                                (Cp: any, i: number) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                                <TextInput
                                                                    type="text"
                                                                    value={
                                                                        Cp
                                                                            .t_person_email
                                                                            .PERSON_EMAIL
                                                                    }
                                                                    className="mt-2"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        inputDataPersonEmail(
                                                                            "PERSON_EMAIL",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            i
                                                                        )
                                                                    }
                                                                    placeholder="Email"
                                                                />
                                                            </td>
                                                            <td>
                                                                {data
                                                                    .m_person_email
                                                                    .length !==
                                                                1 ? (
                                                                    <XMarkIcon
                                                                        className="w-7 mt-2 cursor-pointer hover:text-red-600"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                data.m_person_email.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
                                                                                    m_person_email:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                            <tr className="hidden">
                                                <td>
                                                    <a
                                                        className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                        onClick={(e) =>
                                                            addRowPersonEmail(e)
                                                        }
                                                    >
                                                        <span className="hover:underline hover:decoration-from-font">
                                                            + Add Person Email
                                                        </span>
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                                        {data.contact_emergency?.length !==
                                        0 ? (
                                            <>
                                                {data.contact_emergency?.map(
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
                                                                                data.contact_emergency.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
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
                            </div> */}
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
                                        {data.contact_emergency?.length !==
                                        0 ? (
                                            <>
                                                {data.contact_emergency?.map(
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
                                                                                data.contact_emergency.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
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
        </>
    );
}
