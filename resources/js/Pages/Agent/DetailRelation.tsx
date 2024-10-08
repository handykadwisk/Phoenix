import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import AGGrid from "@/Components/AgGrid";
import { BeatLoader } from "react-spinners";

export default function DetailRelation({
    auth,
    // isSuccessNew,
    // setIsSuccessNew,
    idRelation,
}: PropsWithChildren<{
    auth: any;
    // isSuccessNew: any;
    idRelation: any;
    // setIsSuccessNew: any;
}>) {
    // header custom for policy number
    const customHeader = (props: any) => {
        return (
            <div className="flex items-center gap-2">
                <div>
                    <span>Policy Number</span>
                </div>
                <div className="bg-green-600 w-3 h-3 p-1 rounded-sm mt-1"></div>
                <div>: Active</div>
                <div className="bg-red-600 w-3 h-3 p-1 rounded-sm mt-1"></div>
                <div>: Inactive</div>
            </div>
        );
    };

    // header for amount
    const customHeaderAmount = (props: any) => {
        return (
            <div className="flex items-center gap-2">
                <div>
                    <span>Fee Amount (IDR)</span>
                </div>
                <div className="bg-green-600 w-3 h-3 p-1 rounded-sm mt-1"></div>
                <div>: Settlement</div>
                <div className="bg-red-600 w-3 h-3 p-1 rounded-sm mt-1"></div>
                <div>: Pending</div>
            </div>
        );
    };
    return (
        <>
            <div className="bg-white rounded-md shadow-md p-3">
                <div className="font-semibold text-sm">
                    <span>Policy List:</span>
                </div>

                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-employee rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            searchParam={""}
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={idRelation}
                            // loading={isLoading.get_policy}
                            url={"getPolicyByRelationId"}
                            doubleClickEvent={undefined}
                            triggeringRefreshData={""}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 2,
                                },
                                {
                                    // headerName: "Policy Number",
                                    headerComponent: customHeader,
                                    field: "POLICY_NUMBER",
                                    flex: 11,
                                    filter: "agTextColumnFilter",
                                    filterParams: {
                                        filterOptions: ["contains"],
                                    },
                                    floatingFilter: true,
                                },
                                {
                                    // headerName: "Fee Amount (IDR)",
                                    headerComponent: customHeaderAmount,
                                    field: "POLICY_SHARE",
                                    flex: 12,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
