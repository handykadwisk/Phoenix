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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
// import DetailMenu from "./DetailMenu";

export default function ACLRole({ auth }: PageProps) {
    useEffect(() => {
        getRole();
    }, []);

    // // state for permission
    const [dataRole, setDataRole] = useState<any>([]);
    const [searchRole, setSearchRole] = useState<any>([]);
    // const [dataById, setDataById] = useState<any>({
    //     PERMISSION_ID: "",
    //     PERMISSION_NAME: "",
    //     PERMISSION_CLASS_NAME: "",
    //     PERMISSION_CREATED_BY: "",
    //     PERMISSION_CREATED_DATE: "",
    //     PERMISSION_DELETED_BY: "",
    //     PERMISSION_DELETED_DATE: "",
    //     PERMISSION_FLAG: "",
    //     PERMISSION_UPDATED_BY: "",
    //     PERMISSION_UPDATED_DATE: "",
    // });

    const getRole = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRole?${pageNumber}`, {
                // idRelation,
                role_name: searchRole.role_name,
            })
            .then((res) => {
                setDataRole(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const clearSearchRole = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRole?${pageNumber}`)
            .then((res) => {
                setDataRole(res.data);
                setSearchRole({
                    ...searchRole,
                    role_name: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // // for modal
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        detail: false,
    });

    // handle popup add permission
    const addRolePopup = async (e: FormEvent) => {
        e.preventDefault();

        setModal({
            add: !modal.add,
            edit: false,
            detail: false,
        });
    };

    // for request data permission
    const { data, setData } = useForm<any>({
        role_name: "",
    });

    // const permissionObject = (e: any) => {
    //     e.preventDefault();

    //     if (modal.add) {
    //         setData(
    //             "PERMISSION_CLASS_NAME",
    //             "clsf_" + e.target.value.split(" ").join("_").toLowerCase()
    //         );
    //     } else if (modal.edit) {
    //         setDataById({
    //             ...dataById,
    //             PERMISSION_CLASS_NAME:
    //                 "clsf_" + e.target.value.split(" ").join("_").toLowerCase(),
    //         });
    //     }
    // };

    const handleSuccess = (message: string) => {
        if (modal.add) {
            setData({
                role_name: "",
            });
            Swal.fire({
                title: "Success",
                text: "New Role Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getRole();
                    // setGetDetailRelation({
                    //     RELATION_ORGANIZATION_NAME: message[1],
                    //     RELATION_ORGANIZATION_ID: message[0],
                    // });
                    // setModal({
                    //     add: false,
                    //     delete: false,
                    //     edit: false,
                    //     view: true,
                    //     document: false,
                    //     search: false,
                    // });
                }
            });
        } else if (modal.edit) {
            Swal.fire({
                title: "Success",
                text: "New Role Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getRole();
                    // setGetDetailRelation({
                    //     RELATION_ORGANIZATION_NAME: message[1],
                    //     RELATION_ORGANIZATION_ID: message[0],
                    // });
                    // setModal({
                    //     add: false,
                    //     delete: false,
                    //     edit: false,
                    //     view: true,
                    //     document: false,
                    //     search: false,
                    // });
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Role"}>
            <Head title="Role" />

            {/* modal Add */}
            <ModalToAdd
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                    })
                }
                title={"Add Role"}
                url={`/setting/addRole`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div className="mb-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="role_name"
                                value={"Role Name"}
                            />
                            <div className="ml-[4.9rem] text-red-600">*</div>
                            <TextInput
                                id="role_name"
                                type="text"
                                name="role_name"
                                value={data.role_name}
                                className="mt-2"
                                onChange={(e) =>
                                    setData("role_name", e.target.value)
                                }
                                required
                                placeholder="Role Name"
                            />
                        </div>
                    </>
                }
            />
            {/* modal end add */}

            {/* Modal Edit */}
            {/* <ModalToAdd
                show={modal.edit}
                onClose={() =>
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                    })
                }
                title={"Edit Permission"}
                url={`/setting/editPermission`}
                data={dataById}
                onSuccess={handleSuccess}
                buttonAddOns={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className="absolute"
                                htmlFor="PERMISSION_NAME"
                                value={"Permission Name"}
                            />
                            <div className="ml-[7.9rem] text-red-600">*</div>
                            <TextInput
                                id="PERMISSION_NAME"
                                type="text"
                                name="PERMISSION_NAME"
                                value={dataById.PERMISSION_NAME}
                                className="mt-2"
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        PERMISSION_NAME: e.target.value,
                                    });
                                }}
                                onKeyUp={(e) => {
                                    permissionObject(e);
                                }}
                                required
                                placeholder="Permission Name"
                            />
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="PERMISSION_CLASS_NAME"
                                value={"Class Name"}
                            />
                            <div className="ml-[5.4rem] text-red-600">*</div>
                            <TextInput
                                id="PERMISSION_CLASS_NAME"
                                type="text"
                                name="PERMISSION_CLASS_NAME"
                                value={dataById.PERMISSION_CLASS_NAME}
                                className="mt-2"
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        PERMISSION_CLASS_NAME: e.target.value,
                                    });
                                }}
                                required
                                placeholder="Class Name"
                            />
                        </div>
                    </>
                }
            /> */}
            {/* End Modal Edit */}
            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addRolePopup(e)}
                        >
                            <span>Add Role</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="role_name"
                            type="text"
                            name="role_name"
                            value={searchRole.role_name}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchRole({
                                    ...searchRole,
                                    role_name: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (searchRole.role_name !== "") {
                                        getRole();
                                        setSearchRole({
                                            ...searchRole,
                                            role_name: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Role Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchRole()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchRole()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[60rem] xs:mt-4 lg:mt-0">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
                        <table className="w-full table-auto divide-y divide-gray-300">
                            <thead className="">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={"min-w-[50px] bg-gray-200"}
                                        label={"Name Role"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataRole.data?.map(
                                    (dPermission: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    // setDetailPermission({
                                                    //     PERMISSION_ID:
                                                    //         dPermission.PERMISSION_ID,
                                                    //     PERMISSION_NAME:
                                                    //         dPermission.PERMISSION_NAME,
                                                    // });
                                                    setModal({
                                                        add: false,
                                                        edit: !modal.edit,
                                                        detail: false,
                                                    });
                                                    // getPermissionById(
                                                    //     dPermission.PERMISSION_ID
                                                    // );
                                                }}
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? "cursor-pointer"
                                                        : "bg-gray-100 cursor-pointer"
                                                }
                                            >
                                                <TableTD
                                                    value={dataRole.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dPermission.role_name
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
                    <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                        <Pagination
                            links={dataRole.links}
                            fromData={dataRole.from}
                            toData={dataRole.to}
                            totalData={dataRole.total}
                            clickHref={(url: string) =>
                                getRole(url.split("?").pop())
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
