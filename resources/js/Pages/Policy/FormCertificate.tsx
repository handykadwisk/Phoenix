import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";

export default function FormCertificate({}: PropsWithChildren<{}>) {
    return (
        <>
            <div className="bg-white shadow-md rounded-md p-4 max-w-full ml-4">
                <div className="border-b-2 w-fit font-semibold text-lg">
                    <span>Form Untuk Policy Type Certificate</span>
                </div>
                <div className="flex gap-2 mt-4">
                    <div>
                        {/* <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto "
                            onClick={() => {
                                handleAddCoverage(
                                    policy.POLICY_ID
                                );
                            }}
                        >
                            Add Coverage
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
}
