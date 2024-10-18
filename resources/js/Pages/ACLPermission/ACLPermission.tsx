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
import AGGrid from "@/Components/AgGrid";
import { set } from "react-datepicker/dist/date_utils";
// import DetailMenu from "./DetailMenu";

export default function ACLPermission({ auth }: PageProps) {
    useEffect(() => {
        getPermission();
    }, []);

    // state for permission
    const [dataPermission, setDataPermission] = useState<any>([]);
    // const [searchPermission, setSearchPermission] = useState<any>([]);
    const [dataById, setDataById] = useState<any>({
        PERMISSION_ID: "",
        PERMISSION_NAME: "",
        PERMISSION_CLASS_NAME: "",
        PERMISSION_CREATED_BY: "",
        PERMISSION_CREATED_DATE: "",
        PERMISSION_DELETED_BY: "",
        PERMISSION_DELETED_DATE: "",
        PERMISSION_FLAG: "",
        PERMISSION_UPDATED_BY: "",
        PERMISSION_UPDATED_DATE: "",
    });

    const getPermission = async (pageNumber = "page=1") => {
        await axios
            .post(`/getPermission?${pageNumber}`, {
                // idRelation,
                PERMISSION_NAME: searchPermission.PERMISSION_NAME,
            })
            .then((res) => {
                setDataPermission(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [detailPermission, setDetailPermission] = useState<any>({
        PERMISSION_ID: "",
        PERMISSION_NAME: "",
    });
    const getPermissionById = async (idPermission: string) => {
        await axios
            .post(`/getPermissionById`, {
                idPermission,
            })
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for modal
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        detail: false,
    });

    // handle popup add permission
    const addPermissionPopup = async (e: FormEvent) => {
        e.preventDefault();

        setModal({
            add: !modal.add,
            edit: false,
            detail: false,
        });
    };

    // for request data permission
    const { data, setData } = useForm<any>({
        PERMISSION_NAME: "",
        PERMISSION_CLASS_NAME: "clsf_",
    });

    const permissionObject = (e: any) => {
        e.preventDefault();

        if (modal.add) {
            setData(
                "PERMISSION_CLASS_NAME",
                "clsf_" + e.target.value.split(" ").join("_").toLowerCase()
            );
        } else if (modal.edit) {
            setDataById({
                ...dataById,
                PERMISSION_CLASS_NAME:
                    "clsf_" + e.target.value.split(" ").join("_").toLowerCase(),
            });
        }
    };

    const handleSuccess = (message: string) => {
        if (modal.add) {
            setData({
                PERMISSION_NAME: "",
                PERMISSION_CLASS_NAME: "clsf_",
            });
            Swal.fire({
                title: "Success",
                text: "New Permission Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getPermission();
                }
            });
        } else if (modal.edit) {
            Swal.fire({
                title: "Success",
                text: "New Permission Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getPermission();
                }
            });
        }
    };

    const handleDetailPermission = async (e: any) => {
        setDetailPermission({
            PERMISSION_ID:
                e.PERMISSION_ID,
            PERMISSION_NAME:
                e.PERMISSION_NAME,
        });
        setModal({
            add: false,
            edit: !modal.edit,
            detail: false,
        });
        getPermissionById(
            e.PERMISSION_ID
        );
    }

    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccessPermission = (message: string) => {
        setIsSuccess('')
        // getMenu()
        if (message !== '') {
            setIsSuccess(message[0])
            setTimeout(() => {
                setIsSuccess('')
            }, 5000)
        }
    }

    const [searchPermission, setSearchPermission] = useState<any>({
        permission_search: [
            {
                PERMISSION_ID: "",
                PERMISSION_NAME: "",
                flag: "flag"
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchPermission.permission_search];
        changeVal[i][name] = value;
        setSearchPermission({ ...searchPermission, permission_search: changeVal });
    };

    const clearSearch = (e: React.MouseEvent) => {
        // Kosongkan input pencarian
        inputDataSearch("PERMISSION_NAME", "", 0);
        // Reset flag untuk menampilkan semua data
        inputDataSearch("flag", "", 0);
        setIsSuccess("Cleared");
    };

    


    return (
        <AuthenticatedLayout user={auth.user} header={"Permission"}>
            <Head title="Permission" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* modal Add */}
            <ModalToAction
            submitButtonName={'Submit'}
            headers={'Add Permission'}
            method="POST"
                show={modal.add}
                onClose={() =>{
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                    })
                    setData({
                        PERMISSION_NAME: "",
                        PERMISSION_CLASS_NAME: "clsf_",
                    });
                    

                }
                }
                title={"Add Permission"}
                url={`/setting/addPermission`}
                data={data}
                onSuccess={handleSuccessPermission}
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
                                value={data.PERMISSION_NAME}
                                className="mt-2"
                                onChange={(e) =>
                                    setData("PERMISSION_NAME", e.target.value)
                                }
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
                                value={data.PERMISSION_CLASS_NAME}
                                className="mt-2"
                                onChange={(e) =>
                                    setData(
                                        "PERMISSION_CLASS_NAME",
                                        e.target.value
                                    )
                                }
                                required
                                placeholder="Class Name"
                            />
                        </div>
                    </>
                }
            />
            {/* modal end add */}

            {/* Modal Edit */}
            <ModalToAction
            headers={'Edit Permission'}
            submitButtonName={'Submit'}
                show={modal.edit}
                method="POST"
                onClose={() =>
                {
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                    })
                    setDataById({
                        PERMISSION_ID: "",
                        PERMISSION_NAME: "",
                        PERMISSION_CLASS_NAME: "",
                        PERMISSION_CREATED_BY: "",
                        PERMISSION_CREATED_DATE: "",
                        PERMISSION_DELETED_BY: "",
                        PERMISSION_DELETED_DATE: "",
                        PERMISSION_FLAG: "",
                        PERMISSION_UPDATED_BY: "",
                        PERMISSION_UPDATED_DATE: "",
                    });
                }
                }
                title={"Edit Permission"}
                url={`/setting/editPermission`}
                data={dataById}
                onSuccess={handleSuccessPermission}
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
            />
            {/* End Modal Edit */}
            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addPermissionPopup(e)}
                        >
                            <span>Add Permission</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="PERMISSION_NAME"
                            type="text"
                            name="PERMISSION_NAME"
                            value={searchPermission.permission_search[0].PERMISSION_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={
                                (e) => inputDataSearch("PERMISSION_NAME", e.target.value, 0)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const title = searchPermission.permission_search[0].PERMISSION_NAME;
                                    const id = searchPermission.permission_search[0].PERMISSION_ID;
                                    if (title || id) {
                                        inputDataSearch("flag", title || id, 0);
                                        setIsSuccess("success");
                                        setTimeout(() => {
                                            setIsSuccess("");
                                        });
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                        setIsSuccess("Get All Permission");
                                    }
                                }
                            }}
                            placeholder="Search Permission Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={
                                    (e) => {
                                       
                                            const title = searchPermission.permission_search[0].PERMISSION_NAME;
                                            const id = searchPermission.permission_search[0].PERMISSION_ID;
                                            if (title || id) {
                                                inputDataSearch("flag", title || id, 0);
                                                setIsSuccess("success");
                                                setTimeout(() => {
                                                    setIsSuccess("");
                                                });
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                                setIsSuccess("Get All Permission");
                                            }
                                        }
                                    
                                }
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                // onClick={() => clearSearchPermission()}
                                onClick={(e) => clearSearch(e)}

                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={null}
                            searchParam={searchPermission.permission_search}
                            // loading={isLoading.get_policy}
                            url={"getPermission"}
                            doubleClickEvent={handleDetailPermission}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.5,
                                },
                                {
                                    headerName: "Permission Name",
                                    field: "PERMISSION_NAME",
                                    flex: 7,

                                },

                            ]}
                        />
                    </div>
                </div>



            </div>
        </AuthenticatedLayout>
    );
}
