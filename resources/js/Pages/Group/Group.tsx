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
import ModalDetailGroup from "./DetailGroup";
import Swal from "sweetalert2";

export default function Group({ auth }: PageProps) {
    // variabel relation Group
    const [relationsGroup, setRelationsGroup] = useState<any>([]);
    const [searchGroup, setSearchGroup] = useState<any>({
        RELATION_GROUP_NAME: "",
    });
    const [idGroup, setIdGroup] = useState<any>({
        RELATION_GROUP_ID: "",
        RELATION_GROUP_NAME: "",
    });

    // Get Relation Group
    const getRelationGroup = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationGroup?${pageNumber}`, {
                RELATION_GROUP_NAME: searchGroup.RELATION_GROUP_NAME,
            })
            .then((res) => {
                setRelationsGroup(res.data);
                setSearchGroup({
                    ...searchGroup,
                    RELATION_GROUP_NAME: "",
                });
                if (modal.search) {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
    };

    const {
        flash,
        relation,
        relationGroup,
        salutation,
        relationType,
        relationStatus,
        relationLOB,
        mRelationType,
        profession,
        custom_menu,
    }: any = usePage().props;

    const { data, setData, errors, reset } = useForm({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_DESCRIPTION: "",
    });

    const handleSuccess = (message: string) => {
        reset();
        setData({
            RELATION_GROUP_NAME: "",
            RELATION_GROUP_DESCRIPTION: "",
        });
        // getRelationGroup();
        Swal.fire({
            title: "Success",
            text: "New Group Added",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
            if (result.value) {
                setIdGroup(message);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: true,
                    document: false,
                    search: false,
                });
            }
        });
    };

    // Modal Button Handle
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // search
    const clearSearchGroup = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationGroup?${pageNumber}`)
            .then((res) => {
                setRelationsGroup([]);
                setSearchGroup({
                    ...searchGroup,
                    RELATION_GROUP_NAME: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Group"}>
            <Head title="Group" />

            {/* Modal Add Group */}
            <ModalToAdd
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Add Group"}
                url={`/group`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Relation Group"
                                />
                                <TextInput
                                    id="RELATION_GROUP_NAME"
                                    type="text"
                                    name="RELATION_GROUP_NAME"
                                    value={data.RELATION_GROUP_NAME}
                                    className="mt-2"
                                    autoComplete="RELATION_GROUP_NAME"
                                    onChange={(e) =>
                                        setData(
                                            "RELATION_GROUP_NAME",
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="Name Relation Group"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_DESCRIPTION"
                                    value="Relation Group Description"
                                />
                                <TextArea
                                    className="mt-2"
                                    id="RELATION_GROUP_DESCRIPTION"
                                    name="RELATION_GROUP_DESCRIPTION"
                                    defaultValue={
                                        data.RELATION_GROUP_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            RELATION_GROUP_DESCRIPTION:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Group */}

            {/* modal detail */}
            <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={idGroup.RELATION_GROUP_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[55%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <ModalDetailGroup
                            idGroup={idGroup.RELATION_GROUP_ID}
                            relationStatus={relationStatus}
                            relationGroup={relationGroup}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                        />
                    </>
                }
            />
            {/* modal end detail  */}

            {/* End Modal Detail Group */}

            <div className="grid grid-cols-6 gap-4 p-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                setModal({
                                    add: true,
                                    delete: false,
                                    edit: false,
                                    view: false,
                                    document: false,
                                    search: false,
                                });
                            }}
                        >
                            {"Add Group"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-96">
                        <TextInput
                            id="RELATION_GROUP_NAME"
                            type="text"
                            value={searchGroup.RELATION_GROUP_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchGroup({
                                    ...searchGroup,
                                    RELATION_GROUP_NAME: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchGroup.RELATION_GROUP_NAME !== ""
                                    ) {
                                        getRelationGroup();
                                    }
                                }
                            }}
                            autoComplete="off"
                            placeholder="Search Group Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchGroup()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchGroup()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 bg-white shadow-md rounded-md p-5 max-h-[100rem]">
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
                                        label={"Name Relation"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {relationsGroup.data?.map(
                                    (dataGroup: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    setModal({
                                                        add: false,
                                                        delete: false,
                                                        edit: false,
                                                        view: true,
                                                        document: false,
                                                        search: false,
                                                    });
                                                    setIdGroup({
                                                        RELATION_GROUP_ID:
                                                            dataGroup.RELATION_GROUP_ID,
                                                        RELATION_GROUP_NAME:
                                                            dataGroup.RELATION_GROUP_NAME,
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
                                                        relationsGroup.from + i
                                                    }
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dataGroup.RELATION_GROUP_NAME
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
                    <Pagination
                        links={relationsGroup.links}
                        fromData={relationsGroup.from}
                        toData={relationsGroup.to}
                        totalData={relationsGroup.total}
                        clickHref={(url: string) =>
                            getRelationGroup(url.split("?").pop())
                        }
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
