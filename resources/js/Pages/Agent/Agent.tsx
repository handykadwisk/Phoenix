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

export default function Agent({ auth }: PageProps) {
    const [dataAgent, setDataAgent] = useState<any>([]);

    // for search agent
    const [searchAgent, setSearchAgent] = useState<any>({
        RELATION_AGENT_NAME: "",
    });

    // get data agent
    const getAgent = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationAgent?${pageNumber}`, {
                RELATION_AGENT_NAME: searchAgent.RELATION_AGENT_NAME,
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
                    RELATION_AGENT_NAME: "",
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
        RELATION_AGENT_NAME: "",
        RELATION_AGENT_ALIAS: "",
        RELATION_AGENT_DESCRIPTION: "",
    });

    const handleSuccess = (message: string) => {
        setData({
            RELATION_AGENT_NAME: "",
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
                    RELATION_AGENT_NAME: message[1],
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
        RELATION_AGENT_ID: "",
        RELATION_AGENT_NAME: "",
    });

    return (
        <AuthenticatedLayout user={auth.user} header={"Agent"}>
            <Head title="Agent" />

            {/* modal add*/}
            <ModalToAdd
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
                                    htmlFor="RELATION_AGENT_NAME"
                                    value="Name Relation Agent"
                                />
                                <div className="ml-[9.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.RELATION_AGENT_NAME}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData(
                                            "RELATION_AGENT_NAME",
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
            />
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
                title={detailAgent.RELATION_AGENT_NAME}
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
                        <DetailAgentPopup
                            auth={auth}
                            idAgent={detailAgent.RELATION_AGENT_ID}
                        />
                    </>
                }
            />
            {/* end detail modal */}

            <div className="grid grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addAgentPopup(e)}
                        >
                            <span>Add Agent</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-96">
                        <TextInput
                            type="text"
                            value={searchAgent.RELATION_AGENT_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchAgent({
                                    ...searchAgent,
                                    RELATION_AGENT_NAME: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchAgent.RELATION_AGENT_NAME !== ""
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
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem]">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                        <table className="w-full table-auto divide-y divide-gray-300">
                            <thead className="">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg rounded-bl-lg"
                                        }
                                        label={"No"}
                                    />
                                    <TableTH
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg rounded-br-lg"
                                        }
                                        label={"Name Agent"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataAgent.data?.map(
                                    (dAgent: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    // getDivisionCombo(
                                                    //     idRelation
                                                    // );
                                                    setDetailAgent({
                                                        RELATION_AGENT_ID:
                                                            dAgent.RELATION_AGENT_ID,
                                                        RELATION_AGENT_NAME:
                                                            dAgent.RELATION_AGENT_NAME,
                                                    });
                                                    setModal({
                                                        add: false,
                                                        delete: false,
                                                        edit: false,
                                                        view: true,
                                                    });
                                                }}
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? "cursor-pointer"
                                                        : "bg-gray-100 cursor-pointer"
                                                }
                                            >
                                                <TableTD
                                                    value={
                                                        dataAgent.from + i + "."
                                                    }
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dAgent.RELATION_AGENT_NAME
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
