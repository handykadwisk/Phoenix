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
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";

export default function AddPerson({
    show,
    modal,
    handleSuccess,
    setData,
    data,
    dataPersonRelationship,
}: PropsWithChildren<{
    show: any;
    modal: any;
    setData: any;
    data: any;
    handleSuccess: any;
    dataPersonRelationship: any;
}>) {
    const [isSuccess, setIsSuccess] = useState<string>("");
    // for data from

    const addRowEmergencyContact = (e: FormEvent) => {
        e.preventDefault();
        setData("CONTACT_EMERGENCY", [
            ...data.CONTACT_EMERGENCY,
            {
                NAME_CONTACT_EMERGENCY: "",
                PHONE_CONTACT_EMERGENCY: "",
                PERSON_RELATIONSHIP: "",
            },
        ]);
    };

    const inputContactEmergency = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.CONTACT_EMERGENCY];
        changeVal[i][name] = value;
        setData("CONTACT_EMERGENCY", changeVal);
    };

    // const handleSuccess = (message: string) => {
    //     // setIsSuccess("");
    //     if (message !== "") {
    //         setData({
    //             PERSON_FIRST_NAME: "",
    //             PERSON_MIDDLE_NAME: "",
    //             PERSON_LAST_NAME: "",
    //             PERSON_NICKNAME: "",
    //             PERSON_GENDER: "",
    //             PERSON_BIRTH_PLACE: "",
    //             PERSON_BIRTH_DATE: "",
    //             PERSON_EMAIL: "",
    //             PERSON_CONTACT: "",
    //             PERSON_PARENT: "",
    //             PERSON_MAPPING: "",
    //             RELATION_ORGANIZATION_ID: "",
    //             STRUCTURE_ID: "",
    //             DIVISION_ID: "",
    //             OFFICE_ID: "",
    //             PERSON_IS_DELETED: "",
    //             PERSON_CREATED_BY: "",
    //             PERSON_CREATED_DATE: "",
    //             PERSON_UPDATED_BY: "",
    //             PERSON_UPDATED_DATE: "",
    //             PERSON_CATEGORY: "",
    //             PERSON_HIRE_DATE: "",
    //             PERSON_END_DATE: "",
    //             PERSON_KTP: "",
    //             PERSON_NPWP: "",
    //             PERSON_BANK_ACCOUNT_ID: "",
    //             PERSON_IMAGE_ID: "",
    //             PERSON_KK: "",
    //             PERSON_BLOOD_TYPE: "",
    //             PERSON_BLOOD_RHESUS: "",
    //             PERSON_MARITAL_STATUS: "",
    //             TEXT_STATUS_ID: "",
    //             PERSON_RECRUITMENT_LOCATION: "",
    //             PERSON_LOCK_UPDATE: "",
    //             PERSON_LOCK_UPDATED_DATE: "",
    //             PERSON_SALARY_ADJUSTMENT1: "",
    //             PERSON_SALARY_ADJUSTMENT2: "",
    //             CONTACT_EMERGENCY: [],
    //         });

    //         Swal.fire({
    //             title: "Success",
    //             text: "New Relation Added",
    //             icon: "success",
    //         }).then((result: any) => {
    //             // console.log(result);
    //             if (result.value) {
    //                 // setGetDetailRelation(message);
    //                 // setModal({
    //                 //     add: false,
    //                 //     delete: false,
    //                 //     edit: false,
    //                 //     view: true,
    //                 //     document: false,
    //                 //     search: false,
    //                 // });
    //             }
    //         });
    //     }
    // };

    return (
        <>
            <ModalToAdd
                show={show}
                onClose={modal}
                title={"Add Person"}
                url={`/person`}
                data={data}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccess}
                body={
                    <>
                        {/* From Add Person */}
                        <div className="mt-5">
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
                                    value={data.PERSON_FIRST_NAME}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData(
                                            "PERSON_FIRST_NAME",
                                            e.target.value
                                        )
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
                                            setData(
                                                "PERSON_GENDER",
                                                e.target.value
                                            );
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
                                        value={data.PERSON_BIRTH_PLACE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "PERSON_BIRTH_PLACE",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Place Of Birth"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="PERSON_BIRTH_DATE"
                                        value={"Date Of Birth "}
                                    />
                                    <div className="ml-24 text-red-600">*</div>
                                    <TextInput
                                        id="PERSON_BIRTH_DATE"
                                        type="date"
                                        name="PERSON_BIRTH_DATE"
                                        value={data.PERSON_BIRTH_DATE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "PERSON_BIRTH_DATE",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Date Of Birth"
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
                                        value={data.PERSON_BLOOD_TYPE}
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_BLOOD_TYPE",
                                                e.target.value
                                            );
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
                                        value={data.PERSON_BLOOD_RHESUS}
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_BLOOD_RHESUS",
                                                e.target.value
                                            );
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
                                        value={data.PERSON_MARITAL_STATUS}
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_MARITAL_STATUS",
                                                e.target.value
                                            );
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
                                        value={data.PERSON_KTP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_KTP",
                                                e.target.value
                                            );
                                        }}
                                        required
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
                                        value={data.PERSON_NPWP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_NPWP",
                                                e.target.value
                                            );
                                        }}
                                        required
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
                                        value={data.PERSON_KK}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "PERSON_KK",
                                                e.target.value
                                            );
                                        }}
                                        required
                                        placeholder="Person KK"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th className="py-2 px-2 text-slate-900-700">
                                                <span>Person Contact</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                <InputLabel
                                                    className=""
                                                    htmlFor="PERSON_CONTACT"
                                                    value={"Phone Number"}
                                                />
                                                <TextInput
                                                    id="PERSON_CONTACT"
                                                    type="text"
                                                    name="PERSON_CONTACT"
                                                    value={data.PERSON_CONTACT}
                                                    className="mt-2"
                                                    onChange={(e) =>
                                                        setData(
                                                            "PERSON_CONTACT",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Person Number"
                                                />
                                                <InputLabel
                                                    className="mt-2"
                                                    htmlFor="PERSON_EMAIL"
                                                    value={"Email"}
                                                />
                                                <TextInput
                                                    id="PERSON_EMAIL"
                                                    type="email"
                                                    name="PERSON_EMAIL"
                                                    value={data.PERSON_EMAIL}
                                                    className="mt-2 mb-2"
                                                    onChange={(e) =>
                                                        setData(
                                                            "PERSON_EMAIL",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Email"
                                                />
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
                                                colSpan={3}
                                            >
                                                Emergency Contact
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.CONTACT_EMERGENCY?.length !==
                                        0 ? (
                                            <>
                                                {data.CONTACT_EMERGENCY?.map(
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
                                                                        id="NAME_CONTACT_EMERGENCY"
                                                                        type="text"
                                                                        name="NAME_CONTACT_EMERGENCY"
                                                                        value={
                                                                            cm.NAME_CONTACT_EMERGENCY
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "NAME_CONTACT_EMERGENCY",
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
                                                                        id="PHONE_CONTACT_EMERGENCY"
                                                                        type="text"
                                                                        name="PHONE_CONTACT_EMERGENCY"
                                                                        value={
                                                                            cm.PHONE_CONTACT_EMERGENCY
                                                                        }
                                                                        className="mt-7"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PHONE_CONTACT_EMERGENCY",
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
                                                                            cm.PERSON_RELATIONSHIP
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PERSON_RELATIONSHIP",
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
                                                                        {dataPersonRelationship.map(
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
                                                        Add Emergency Contact
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
