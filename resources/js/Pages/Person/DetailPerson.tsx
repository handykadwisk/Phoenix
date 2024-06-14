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

export default function DetailPerson({
    idPerson,
    idRelation,
}: PropsWithChildren<{
    idPerson: any;
    idRelation: any;
}>) {
    const [detailPerson, setDetailPerson] = useState<any>([]);
    useEffect(() => {
        getPersonDetail(idPerson);
    }, [idPerson]);

    const getPersonDetail = async (id: string) => {
        await axios
            .post(`/getPersonDetail`, { id })
            .then((res) => {
                setDetailPerson(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="mt-4">
                {/* Profile and information */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 shadow-md rounded-md">
                        <div className="flex justify-end">
                            <a href="" className="hover:text-red-500">
                                <PencilSquareIcon
                                    className="w-7"
                                    title="Edit Profile"
                                />
                            </a>
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                className="h-44 w-44 rounded-full border-2 bg-gray-50"
                                src={defaultImage}
                                alt="Image Person"
                            />
                        </div>
                        <div className="mt-4 flex justify-center items-center font-semibold text-red-600">
                            {detailPerson.PERSON_FIRST_NAME}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Place Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_BIRTH_PLACE}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="text-sm font-semibold text-red-600">
                                    Date Of Birth
                                </div>
                                <div className="text-sm mt-2 text-gray-500">
                                    {detailPerson.PERSON_BIRTH_DATE}
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
                                        : "Perempuan"}
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
                    <div className="col-span-2 bg-white px-5 py-4 shadow-md rounded-md">
                        {/* contact */}
                        <div className="grid grid-cols-3 gap-4 divide-x">
                            <div>
                                <div className="font-semibold text-red-600">
                                    <span>Contact</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div className="text-sm text-gray-500">
                                        <span>
                                            <PhoneIcon className="w-4 absolute" />
                                        </span>
                                        <span className="ml-7">
                                            {detailPerson.PERSON_CONTACT}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <div className="text-sm text-gray-500">
                                        <span>
                                            <EnvelopeIcon className="w-4 absolute" />
                                        </span>
                                        <span className="ml-7">
                                            {detailPerson.PERSON_EMAIL}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2">
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
                            <div className="px-2">
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
                                                    <>
                                                        <div key={i}>
                                                            <div className="flex justify-between mt-2">
                                                                <div className="text-sm text-gray-500">
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
                                                                <div className="text-sm text-gray-500">
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
                                                                <div className="text-sm text-gray-500">
                                                                    <span>
                                                                        <UsersIcon className="w-4 absolute" />
                                                                    </span>
                                                                    <span className="ml-7">
                                                                        {
                                                                            cm
                                                                                .person_relationship
                                                                                .PERSON_RELATIONSHIP_NAME
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {i !==
                                                            cm.length - 1 ? (
                                                                <hr className="mt-2" />
                                                            ) : null}
                                                        </div>
                                                    </>
                                                );
                                            }
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* end Contact */}
                        {/* <hr className="mt-5" /> */}
                        {/* Division And Location
                        <div className="flex justify-between mt-4">
                            <div className="text-red-600 font-semibold">
                                <span>Division and Location</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-1">
                            <div className="p-2 grid grid-cols-3 gap-2">
                                <div className="flex justify-center">
                                    <BuildingOffice2Icon className="w-12 text-red-600" />
                                </div>
                                <div className="col-span-2 text-sm font-semibold flex">
                                    <span className="my-auto">
                                        PT Fresnel Perdana Mandiri
                                    </span>
                                </div>
                            </div>
                            <div className="p-2 grid grid-cols-3 gap-2">
                                <div className="flex justify-center">
                                    <UserGroupIcon className="w-12 text-red-600" />
                                </div>
                                <div className="col-span-2 text-sm font-semibold flex">
                                    <span className="my-auto">STAFF</span>
                                </div>
                            </div>
                            <div className="p-2 grid grid-cols-3 gap-2">
                                <div className="flex justify-center">
                                    <IdentificationIcon className="w-12 text-red-600" />
                                </div>
                                <div className="col-span-2 text-sm font-semibold flex">
                                    <span className="my-auto">IT</span>
                                </div>
                            </div>
                            <div className="p-2 grid grid-cols-3 gap-2">
                                <div className="flex justify-center">
                                    <MapIcon className="w-12 text-red-600" />
                                </div>
                                <div className="col-span-2 text-sm font-semibold flex">
                                    <span className="my-auto">
                                        Kantor Pusat
                                    </span>
                                </div>
                            </div>
                        </div> */}
                        <hr className="mt-5" />
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex">
                                <a href="" className="m-auto">
                                    Employment Information
                                </a>
                            </div>
                            <div className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex">
                                <a href="" className="m-auto">
                                    Address Person
                                </a>
                            </div>
                            <div className="bg-red-500 p-2 rounded-md shadow-md text-center text-white hover:bg-red-700 flex">
                                <a href="" className="m-auto">
                                    Structur And Division Person
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end profle and information */}
            </div>
        </>
    );
}
