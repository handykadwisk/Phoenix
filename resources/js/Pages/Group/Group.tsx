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
    // useEffect(() => {
    //     getRelationGroup();
    // }, []);

    // variabel relation Group
    const [relationsGroup, setRelationsGroup] = useState<any>([]);
    const [searchGroup, setSearchGroup] = useState<any>({
        RELATION_GROUP_NAME: "",
    });
    const [idGroup, setIdGroup] = useState<string>("");
    // detail Group
    const [detailGroup, setDetailGroup] = useState<any>([]);
    // variabel succes
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Get Relation Group
    const getRelationGroup = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelationGroup?${pageNumber}`, {
                RELATION_GROUP_NAME: searchGroup.RELATION_GROUP_NAME,
            })
            .then((res) => {
                setRelationsGroup(res.data);
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
        setIsSuccess("");
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
        setIsSuccess(message);
    };

    const clickDetailRelation = async (e: FormEvent, id: number) => {
        e.preventDefault();
        window.open(`/relation/detailRelation/${id}`, "_self");
        // await axios
        //     .get(`/relation/detailRelation/${id}`)
        //     .then((res) => {})
        //     .catch((err) => console.log(err));
    };

    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getGroup/${id}`)
            .then((res) => {
                console.log(res.data);
                setDetailGroup(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
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

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <AuthenticatedLayout user={auth.user} header={"Group"}>
            <Head title="Group" />

            {/* {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
                />
            )} */}

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

            {/* Modal Detail Group
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
                addOns={""}
                title={"View Policy"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl"
                }
                url={``}
                data={null}
                onSuccess={null}
                method={""}
                headers={null}
                submitButtonName={null}
                body={
                    <>
                        <ModalDetailGroup auth={auth} idGroup={idGroup} />
                    </>
                }
            /> */}

            {/* modal search */}
            <ModalSearch
                show={modal.search}
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
                title={"Search Group"}
                submitButtonName={"Search"}
                onAction={() => {
                    if (searchGroup.RELATION_GROUP_NAME !== "") {
                        getRelationGroup();
                    }
                }}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="RELATION_GROUP_NAME"
                                value="Relation Group"
                            />
                            <TextInput
                                // id="RELATION_GROUP_NAME"
                                type="text"
                                value={searchGroup.RELATION_GROUP_NAME}
                                className="mt-2"
                                onChange={(e) =>
                                    setSearchGroup({
                                        ...searchGroup,
                                        RELATION_GROUP_NAME: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (
                                            searchGroup.RELATION_GROUP_NAME !==
                                            ""
                                        ) {
                                            getRelationGroup();
                                            setSearchGroup({
                                                ...searchGroup,
                                                RELATION_GROUP_NAME: "",
                                            });
                                        }
                                    }
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal search */}

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
                title={"Detail Group"}
                url={""}
                data={""}
                addOns={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <ModalDetailGroup
                            idGroup={idGroup}
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
            <div>
                <div className="overflow-hidden rounded-lg bg-white p-10 shadow-md">
                    <div className="md:grid md:grid-cols-8 md:gap-4">
                        <Button
                            className="text-sm w-full lg:w-1/2 font-semibold px-3 py-1.5 mb-4 md:col-span-2"
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
                            Add Group
                        </Button>
                    </div>
                </div>
                {/* search dan table */}
                <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 xs:gap-0 lg:grid-cols-3 lg:gap-4">
                    <div className="bg-white p-10 rounded-md shadow-md mb-5 lg:mb-0">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                <button
                                    className=" w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4 hover:ring-red-500"
                                    onClick={() => {
                                        setModal({
                                            add: false,
                                            delete: false,
                                            edit: false,
                                            view: false,
                                            document: false,
                                            search: !modal.search,
                                        });
                                    }}
                                >
                                    <MagnifyingGlassIcon
                                        className="mx-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Search Group
                                </button>
                            </div>
                            <div className="flex justify-center items-center xs:col-span-3 lg:col-auto">
                                <Button
                                    className="mb-4 w-full py-1.5 px-2"
                                    onClick={() => clearSearchGroup()}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-md shadow-md col-span-2">
                        {relationsGroup.length === 0 ? (
                            <div className="text-center text-lg">
                                <span>No Data Available</span>
                            </div>
                        ) : (
                            <>
                                <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                                    <table className="w-full table-auto divide-y divide-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                <TableTH
                                                    className={
                                                        "max-w-[0px] text-center"
                                                    }
                                                    label={"No"}
                                                />
                                                <TableTH
                                                    className={"min-w-[50px]"}
                                                    label={"Name Group"}
                                                />
                                                <TableTH
                                                    className={
                                                        "min-w-[50px] text-center"
                                                    }
                                                    label={"Action"}
                                                />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {relationsGroup.data?.map(
                                                (dataGroup: any, i: number) => {
                                                    return (
                                                        <tr
                                                            key={i}
                                                            className={
                                                                i % 2 === 0
                                                                    ? ""
                                                                    : "bg-gray-100"
                                                            }
                                                        >
                                                            <TableTD
                                                                value={
                                                                    relationsGroup.from +
                                                                    i
                                                                }
                                                                className={
                                                                    "text-center"
                                                                }
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
                                                            <TableTD
                                                                value={
                                                                    <>
                                                                        <a
                                                                            onClick={() => {
                                                                                setModal(
                                                                                    {
                                                                                        add: false,
                                                                                        delete: false,
                                                                                        edit: false,
                                                                                        view: true,
                                                                                        document:
                                                                                            false,
                                                                                        search: false,
                                                                                    }
                                                                                );
                                                                                setIdGroup(
                                                                                    dataGroup.RELATION_GROUP_ID
                                                                                );
                                                                            }}
                                                                            // href={`/group/detailGroup/${dataGroup.RELATION_GROUP_ID}`}
                                                                        >
                                                                            <div
                                                                                className="flex justify-center items-center"
                                                                                title="Detail"
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth={
                                                                                        1.5
                                                                                    }
                                                                                    stroke="currentColor"
                                                                                    className="size-6 text-red-700 cursor-pointer"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                                    />
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                        </a>
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
                            </>
                        )}
                    </div>
                </div>
                {/* end search dan table */}
            </div>
        </AuthenticatedLayout>
    );
}
