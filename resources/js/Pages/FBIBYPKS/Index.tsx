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
import DetailFBI from "./DetailFBI";

export default function Index({ auth }: PageProps) {
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [detailFBI, setDetailFBI] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
    });

    // for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
    });

    const handleDetailFBI = async (data: any) => {
        // getDivisionCombo(idRelation);
        setDetailFBI({
            RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
            RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_NAME,
        });
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"FBI By PKS"}>
            <Head title="FBI By PKS" />

            <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"FBI By PKS " + detailFBI.RELATION_ORGANIZATION_NAME}
                url={""}
                data={""}
                onSuccess={null}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailFBI
                            auth={auth}
                            idFBI={detailFBI.RELATION_ORGANIZATION_ID}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 hidden rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addAgentPopup(e)}
                        >
                            <span>Add Agent</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100%] h-[100%]">
                        <TextInput
                            type="text"
                            // value={searchAgent.RELATION_ORGANIZATION_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchAgent({
                                    ...searchAgent,
                                    RELATION_ORGANIZATION_NAME: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchAgent.RELATION_ORGANIZATION_NAME !==
                                        ""
                                    ) {
                                        getAgent();
                                    }
                                }
                            }}
                            placeholder="Search FBI By PKS Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchAgent()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchAgent()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100%]">
                    <AGGrid
                        searchParam={""}
                        addButtonLabel={null}
                        addButtonModalState={undefined}
                        withParam={null}
                        // loading={isLoading.get_policy}
                        url={"getRelationFBI"}
                        doubleClickEvent={handleDetailFBI}
                        triggeringRefreshData={isSuccess}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1,
                            },
                            {
                                headerName: "Relation FBI By PKS",
                                field: "RELATION_ORGANIZATION_ALIAS",
                                flex: 7,
                            },
                        ]}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
