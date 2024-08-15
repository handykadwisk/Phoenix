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
import DetailAgentPopup from "./DetailAgent";
import Swal from "sweetalert2";
import AGGrid from "@/Components/AgGrid";

export default function Agent({ auth }: PageProps) {
    // useEffect(() => {
    //     getAgent();
    // }, []);
    const [dataAgent, setDataAgent] = useState<any>([]);
    const [isSuccess, setIsSuccess] = useState<string>("");
    // for search agent
    const [searchAgent, setSearchAgent] = useState<any>({
        RELATION_ORGANIZATION_NAME: "",
    });

    // get data agent
    const getAgent = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationAgent?${pageNumber}`, {
                RELATION_ORGANIZATION_NAME:
                    searchAgent.RELATION_ORGANIZATION_NAME,
            })
            .then((res) => {
                setDataAgent(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for clear search
    const clearSearchAgent = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationAgent?${pageNumber}`, {
                // idRelation,
            })
            .then((res) => {
                setDataAgent([]);
                setSearchAgent({
                    ...searchAgent,
                    RELATION_ORGANIZATION_NAME: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
    });

    // popup menu add
    const addAgentPopup = async (e: FormEvent) => {
        e.preventDefault();

        // getComboMenu();
        setModal({
            add: !modal.add,
            delete: false,
            edit: false,
            view: false,
        });
    };

    const { data, setData } = useForm<any>({
        RELATION_ORGANIZATION_NAME: "",
        RELATION_AGENT_ALIAS: "",
        RELATION_AGENT_DESCRIPTION: "",
    });

    const handleSuccess = (message: string) => {
        setData({
            RELATION_ORGANIZATION_NAME: "",
            RELATION_AGENT_ALIAS: "",
            RELATION_AGENT_DESCRIPTION: "",
        });

        Swal.fire({
            title: "Success",
            text: "New Relation Agent",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                setDetailAgent({
                    RELATION_AGENT_ID: message[0],
                    RELATION_ORGANIZATION_NAME: message[1],
                });
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: !modal.view,
                });
            }
        });
    };

    const [detailAgent, setDetailAgent] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
    });

    const handleDetailAgent = async (data: any) => {
        // getDivisionCombo(idRelation);
        setDetailAgent({
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
        <AuthenticatedLayout user={auth.user} header={"Agent"}>
            <Head title="Agent" />

            {/* modal add*/}
            {/* <ModalToAdd
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Add Agent"}
                buttonAddOns={""}
                url={`/relation/agent`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-0 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_ORGANIZATION_NAME"
                                    value="Name Relation Agent"
                                />
                                <div className="ml-[9.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.RELATION_ORGANIZATION_NAME}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData(
                                            "RELATION_ORGANIZATION_NAME",
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="Name Relation Agent"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_AGENT_DESCRIPTION"
                                    value="Description"
                                />
                                <TextArea
                                    className="mt-2"
                                    id="RELATION_AGENT_DESCRIPTION"
                                    name="RELATION_AGENT_DESCRIPTION"
                                    defaultValue={
                                        data.RELATION_AGENT_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            RELATION_AGENT_DESCRIPTION:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            /> */}
            {/* end modal add */}

            {/* detail modal */}
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
                title={"Agent " + detailAgent.RELATION_ORGANIZATION_NAME}
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
                        <DetailAgentPopup
                            auth={auth}
                            idAgent={detailAgent.RELATION_ORGANIZATION_ID}
                        />
                    </>
                }
            />
            {/* end detail modal */}

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
                            value={searchAgent.RELATION_ORGANIZATION_NAME}
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
                            placeholder="Search Agent Name"
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
                        url={"getRelationAgent"}
                        doubleClickEvent={handleDetailAgent}
                        triggeringRefreshData={isSuccess}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1,
                            },
                            {
                                headerName: "Relation Agent",
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
