import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import AddPersonPopup from "./AddPerson";
import DetailPersonPopup from "./DetailPerson";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";

export default function Structure({
    auth,
    idRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
}>) {
    return (
        <>
            <div className="p-6">
                {/* button add structure */}
                <div className="bg-white shadow-md rounded-md p-6">
                    <Button
                        className="p-3 w-fit"
                        // onClick={() => {
                        //     // setSwitchPage(false);
                        //     setModal({
                        //         add: false,
                        //         delete: false,
                        //         edit: false,
                        //         view: !modal.view,
                        //         document: false,
                        //         search: false,
                        //     });
                        // }}
                        onClick={(e) => handleAddModel(e)}
                    >
                        {"Add Structure"}
                    </Button>
                </div>
                {/* search dan grid structure */}
                <div className="bg-white mt-4 rounded-md shadow-md p-6">
                    <div>1</div>
                </div>
                {/* end search dan grid structure*/}
            </div>
        </>
    );
}
