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
import SelectTailwind from "react-tailwindcss-select";
import AGGrid from "@/Components/AgGrid";

export default function Group({ auth }: PageProps) {
    // useEffect(() => {
    //     getMappingParentGroup();
    // }, []);

    // variabel relation Group
    const [relationsGroup, setRelationsGroup] = useState<any>([]);
    const [searchGroup, setSearchGroup] = useState<any>({
        RELATION_GROUP_NAME: "",
    });

    const [searchGroupNew, setSearchGroupNew] = useState<any>({
        group_search: [
            {
                RELATION_GROUP_NAME: "",
                flag: "flag",
            },
        ],
    });
    const [idGroup, setIdGroup] = useState<any>({
        RELATION_GROUP_ID: "",
        RELATION_GROUP_NAME: "",
    });

    const [mappingGroup, setMappingGroup] = useState<any>([]);

    // get combo group parent
    const getMappingParentGroup = async () => {
        // setIsLoading(true)

        // if (name) {
        await axios
            .post(`/getMappingParentGroup`)
            .then((res: any) => {
                setMappingGroup(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const mappingParentGroup = mappingGroup?.map((query: any) => {
        return {
            value: query.RELATION_GROUP_ID,
            label: query.text_combo,
        };
    });

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

    const { data, setData, errors, reset } = useForm<any>({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_PARENT: "",
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
            if (result.value) {
                setIdGroup({
                    RELATION_GROUP_ID: message[0],
                    RELATION_GROUP_NAME: message[1],
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
    const clearSearchGroup = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("RELATION_GROUP_NAME", "", 0);
        inputDataSearch("flag", "flag", 0);
        setIsSuccess({
            isSuccess: "success",
        });
    };

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchGroupNew.group_search];
        changeVal[i][name] = value;
        setSearchGroupNew({ ...searchGroupNew, group_search: changeVal });
    };

    const handleClickDetailGroup = async (data: any) => {
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: true,
            document: false,
            search: false,
        });
        setIdGroup({
            RELATION_GROUP_ID: data.RELATION_GROUP_ID,
            RELATION_GROUP_NAME: data.RELATION_GROUP_NAME,
        });
    };
    const [isSuccess, setIsSuccess] = useState<any>("");

    return (
        <AuthenticatedLayout user={auth.user} header={"Group"}>
            <Head title="Group" />

            {/* Modal Add Group */}
            <ModalToAdd
                show={modal.add}
                buttonAddOns={""}
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
                url={`/relation/group`}
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
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Relation Group"
                                />
                                <div className="ml-[9.6rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.RELATION_GROUP_NAME}
                                    className="mt-2"
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
                                    className=""
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Parent Group"
                                />
                                <SelectTailwind
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-red-500 hover:text-white`
                                            }`,
                                    }}
                                    options={mappingParentGroup}
                                    isSearchable={true}
                                    placeholder={"--Select Parent--"}
                                    value={data.RELATION_GROUP_PARENT}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        setData("RELATION_GROUP_PARENT", val);
                                    }}
                                    primaryColor={"bg-red-500"}
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
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    getRelationGroup();
                }}
                title={"GROUP OF " + idGroup.RELATION_GROUP_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <ModalDetailGroup
                            idGroup={idGroup.RELATION_GROUP_ID}
                            setIdGroup={setIdGroup}
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

            <div className="grid grid-cols-4 gap-4 p-4">
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
                                getMappingParentGroup();
                            }}
                        >
                            {"Add Group"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-96">
                        <TextInput
                            type="text"
                            value={
                                searchGroupNew.group_search[0]
                                    .RELATION_GROUP_NAME
                            }
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch(
                                    "RELATION_GROUP_NAME",
                                    e.target.value,
                                    0
                                );
                                if (
                                    searchGroupNew.group_search[0]
                                        .RELATION_GROUP_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchGroupNew.group_search[0]
                                            .RELATION_GROUP_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess({
                                        isSuccess: "success",
                                    });
                                }
                            }}
                            placeholder="Search Group Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchGroupNew.group_search[0]
                                            .RELATION_GROUP_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess({
                                        isSuccess: "success",
                                    });
                                }}
                                // onClick={() => {
                                //     if (
                                //         searchGroup.RELATION_GROUP_NAME !== ""
                                //     ) {
                                //         getRelationGroup();
                                //     }
                                // }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e: any) => clearSearchGroup(e)}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchGroupNew.group_search}
                            // loading={isLoading.get_policy}
                            url={"getRelationGroupNew"}
                            doubleClickEvent={handleClickDetailGroup}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Name Group",
                                    field: "RELATION_GROUP_NAME",
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
