import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
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
    PrinterIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import PersonPopup from "../Person/Person";
import StructurePopup from "../Structure/Structure";
import Division from "../Division/Division";
import AddressPopup from "../Address/Address";
import JobDesk from "../Job/JobDesk";
import SelectTailwind from "react-tailwindcss-select";
import ModalToAdd from "@/Components/Modal/ModalToAdd";

export default function SummaryGroup({
    idGroup,
}: PropsWithChildren<{
    idGroup: any;
}>) {
    // console.log("xx", dataDetailGroups);
    // useEffect(() => {
    //     setDetailGroups(dataDetailGroups);
    // }, [dataDetailGroups]);

    return (
        <>
            <div className="mb-5">
                <div className="grid grid-cols-4 gap-2">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Policy Active
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Policy Lapse
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Claim
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Asset Registered
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Amount DN
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:cursor-pointer hover:bg-red-500 group">
                        <div className="truncate text-sm font-medium text-gray-500 group-hover:text-white">
                            Total Amount CN
                        </div>
                        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-white">
                            0
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="bg-red-500 w-fit p-2 rounded-md text-white flex gap-1 hover:cursor-pointer hover:bg-red-400">
                        <span>
                            <PrinterIcon className="w-5" />
                        </span>
                        <span>Print Preview</span>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="text-gray-400">
                        <span>
                            *Muncul table yang isinya List-List Ketika Di Klik
                            Total Di atas
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
