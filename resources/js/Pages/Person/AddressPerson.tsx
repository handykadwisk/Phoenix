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

export default function AddressPerson({
    idPerson,
}: PropsWithChildren<{ idPerson: any }>) {
    // console.log(dataById);
    return (
        <>
            <div className="mb-2">
                <div className="">
                    <InputLabel htmlFor="address_person" value="Address" />
                    <TextArea
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                        id="address_person"
                        name="address_person"
                        // defaultValue={data.address_person}
                        onChange={(e: any) =>
                            setData("address_person", e.target.value)
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <InputLabel htmlFor="address_rw" value="RT" />
                        <TextInput
                            type="text"
                            // value={data.abbreviation}
                            className=""
                            onChange={(e) =>
                                setData("abbreviation", e.target.value)
                            }
                            // required
                            placeholder="RT"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="address_rt" value="RW" />
                        <TextInput
                            type="text"
                            // value={data.abbreviation}
                            className=""
                            onChange={(e) =>
                                setData("abbreviation", e.target.value)
                            }
                            // required
                            placeholder="RW"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <InputLabel htmlFor="address_village" value="Village" />
                        <TextInput
                            type="text"
                            // value={data.abbreviation}
                            className=""
                            onChange={(e) =>
                                setData("abbreviation", e.target.value)
                            }
                            // required
                            placeholder="Village"
                        />
                    </div>
                    <div className="mt-2">
                        <InputLabel
                            htmlFor="address_district"
                            value="District"
                        />
                        <TextInput
                            type="text"
                            // value={data.abbreviation}
                            className=""
                            onChange={(e) =>
                                setData("abbreviation", e.target.value)
                            }
                            // required
                            placeholder="District"
                        />
                    </div>
                </div>

                <div className="mt-2">
                    <InputLabel htmlFor="address_province" value="Province" />
                    <TextInput
                        type="text"
                        // value={data.abbreviation}
                        className=""
                        onChange={(e) =>
                            setData("abbreviation", e.target.value)
                        }
                        // required
                        placeholder="Province"
                    />
                </div>
            </div>
        </>
    );
}
