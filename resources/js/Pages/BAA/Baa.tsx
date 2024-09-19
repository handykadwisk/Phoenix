import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
    EllipsisHorizontalIcon,
    EnvelopeIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Swal from "sweetalert2";
import AGGrid from "@/Components/AgGrid";
import DetailBaa from "./DetailBaa";

export default function Baa({ auth }: PageProps) {
    // for judul modal
    const [detailBaa, setDetailBaa] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_ALIAS: "",
    });

    const [isSuccess, setIsSuccess] = useState<string>("");

    // for modal
    const [modal, setModal] = useState<any>({
        add: false,
        delete: false,
        edit: false,
        view: false,
    });

    const handleDetailRelationBAA = async (data: any) => {
        // getDivisionCombo(idRelation);
        setDetailBaa({
            RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
            RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_ALIAS,
        });
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
        });
    };

    const [searchBAA, setSearchBAA] = useState<any>({
        baa: [
            {
                RELATION_ORGANIZATION_NAME: "",
                flag: "",
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchBAA.baa];
        changeVal[i][name] = value;
        setSearchBAA({
            ...searchBAA,
            baa: changeVal,
        });
    };

    const [refreshGrid, setRefreshGrid] = useState<any>("");
    // search
    const clearSearchBAA = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("RELATION_ORGANIZATION_NAME", "", 0);
        inputDataSearch("flag", "", 0);
        setRefreshGrid("success");
        setTimeout(() => {
            setRefreshGrid("");
        }, 1000);
    };
    return (
        <>
            {/* modal Action View  */}
            <ModalToAction
                show={modal.view}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                    });
                }}
                title={"Relation BAA - " + detailBaa.RELATION_ORGANIZATION_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailBaa
                            // isSuccess={isSuccess}
                            // setIsSuccess={setIsSuccess}
                            idBaa={detailBaa.RELATION_ORGANIZATION_ID}
                            auth={auth}
                        />
                    </>
                }
            />
            {/* end Modal View Action */}

            <AuthenticatedLayout
                user={auth.user}
                header={"BAA (Business Acquisition Assistant)"}
            >
                <Head title="BAA" />

                <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                        <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                            <TextInput
                                type="text"
                                value={
                                    searchBAA.baa[0]
                                        .RELATION_ORGANIZATION_NAME === ""
                                        ? ""
                                        : searchBAA.baa[0]
                                              .RELATION_ORGANIZATION_NAME
                                }
                                className="mt-2 ring-1 ring-red-600"
                                onChange={(e) => {
                                    inputDataSearch(
                                        "RELATION_ORGANIZATION_NAME",
                                        e.target.value,
                                        0
                                    );
                                    if (
                                        searchBAA.baa[0]
                                            .RELATION_ORGANIZATION_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "flag", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                }}
                                placeholder="Search Relation BAA Name"
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <div
                                    className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                    onClick={() => {
                                        if (
                                            searchBAA.baa[0]
                                                .RELATION_ORGANIZATION_NAME ===
                                            ""
                                        ) {
                                            inputDataSearch("flag", "", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                        setRefreshGrid("success");
                                        setTimeout(() => {
                                            setRefreshGrid("");
                                        }, 1000);
                                    }}
                                >
                                    Search
                                </div>
                                <div
                                    className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                    onClick={(e) => clearSearchBAA(e)}
                                >
                                    Clear Search
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                        <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                            <AGGrid
                                searchParam={searchBAA.baa}
                                addButtonLabel={null}
                                addButtonModalState={undefined}
                                withParam={""}
                                // loading={isLoading.get_policy}
                                url={"getBAA"}
                                doubleClickEvent={handleDetailRelationBAA}
                                triggeringRefreshData={refreshGrid}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1" + ".",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "Relation BAA Name",
                                        field: "RELATION_ORGANIZATION_ALIAS",
                                        flex: 9,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
