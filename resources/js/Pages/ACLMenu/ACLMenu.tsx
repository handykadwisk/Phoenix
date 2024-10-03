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
import DetailMenu from "./DetailMenu";
import SequenceEdit from "@/Components/sequenceEdit";
import AGGrid from "@/Components/AgGrid";
import { get } from "jquery";

export default function ACLMenu({ auth, custom_menu }: PageProps) {

    const [show, setShow] = useState<any>([]);
    const getmenusShow = async () => {
        try {
            const res = await axios.get(`/showMenu`);
            setShow(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const [seqMenu, setSeqMenu] = useState<any>([]);


    const [menuData, setMenuData] = useState<any>([]);
    const [searchMenu, setSearchMenu] = useState<any>({
        menu_search: [
            {
                menu_name: "",
                id: "",
                flag: "flag",
            }
        ]
    });
    const [comboMenu, setComboMenu] = useState<any>([]);

    const [detailMenu, setDetailMenu] = useState<any>({
        id: "",
        menu_name: "",
    });

    // getComboMenu
    const getComboMenu = async () => {
        try {
            const res = await axios.post(`/getMenuCombo`);
            setComboMenu(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    //clearSearchMenu
    const clearSearchMenu = async (pageNumber = "page=1") => {
        await axios
            .post(`/getMenus?${pageNumber}`, {})
            .then((res) => {
                setMenuData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modal, setModal] = useState({
        add: false,
        edit: false,
        detail: false,
        sequence: false,

    });

    const addMenuPopup = async (e: FormEvent) => {
        e.preventDefault();
        getmenusShow()
        getComboMenu();
        setModal({
            add: !modal.add,
            edit: false,
            detail: false,
            sequence: false,
        });
    };

    const addSequencePopup = async (e: FormEvent) => {
        e.preventDefault();

        getComboMenu();
        setModal({
            add: false,
            edit: false,
            detail: false,
            sequence: !modal.sequence,
        });
    };

    const { data, setData } = useForm<any>({
        menu_parent: "",
        menu_name: "",
        menu_url: "",
        menu_sequence: "",
        menu_is_deleted: "",
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchMenu.menu_search];
        changeVal[i][name] = value;
        setSearchMenu({ ...searchMenu, menu_search: changeVal });
    };

    // Fungsi untuk menghapus input pencarian dan menampilkan semua data
    const clearSearch = (e: React.MouseEvent) => {
        // Kosongkan input pencarian
        inputDataSearch("jobpost_title", "", 0);
        // Reset flag untuk menampilkan semua data
        inputDataSearch("flag", "", 0);
        setIsSuccess("Cleared");
    };

    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccessMenu = (message: string) => {
        setIsSuccess('')
        // getMenu()
        if (message !== '') {
            setIsSuccess(message[0])
            setTimeout(() => {
                setIsSuccess('')
            }, 5000)
        }
    }


    const handleItemsChange = (updatedItems: any) => {
        setSeqMenu(updatedItems);
    };

    const handleDetailMenu = async (data: any) => {
        setDetailMenu({
            id: data.id,
            menu_name: data.menu_name,
        });
        setModal({
            add: false,
            edit: !modal.edit,
            detail: false,
            sequence: false,
        });

    }


    return (
        <AuthenticatedLayout user={auth.user} header={"Menu"}>
            <Head title="Menu" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* modal Add */}
            <ModalToAdd
                buttonAddOns={''}
                show={modal.add}
                onClose={
                    () => {

                        setModal({
                            add: false,
                            edit: false,
                            detail: false,
                            sequence: false,
                        })

                        setData({
                            menu_name: "",
                            menu_url: "",
                        })
                    }
                }
                title={"Add Menu"}
                url={`/setting/addMenu`}
                data={data}
                onSuccess={handleSuccessMenu}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        {/* Parent */}
                        <div className="mb-3">
                            <div>
                                <InputLabel
                                    className=""
                                    htmlFor="name_parent"
                                    value={"Parent"}
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.menu_parent}
                                    onChange={(e) => {
                                        setData("menu_parent", e.target.value);
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Parent --
                                    </option>
                                    {show.map((mData: any, i: number) => {
                                        return (
                                            <option value={mData.id} key={i}>
                                                {mData.text_combo}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="menu_name"
                                    value={"Menu Name"}
                                />
                                <div className="ml-[5.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="menu_name"
                                    type="text"
                                    name="menu_name"
                                    value={data.menu_name}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData("menu_name", e.target.value)
                                    }
                                    required
                                    placeholder="Name Menu"
                                />
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    className=""
                                    htmlFor="menu_url"
                                    value={"Menu URL"}
                                />

                                <TextInput
                                    id="menu_url"
                                    type="text"
                                    name="menu_url"
                                    value={data.menu_url}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData("menu_url", e.target.value)
                                    }
                                    placeholder="Menu URL"
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* modal end add */}

            {/* modal sequence */}
            <ModalToAdd
                buttonAddOns={''}
                show={modal.sequence}
                onClose={
                    () =>
                        setModal({
                            add: false,
                            edit: false,
                            detail: false,
                            sequence: false,
                        })

                }
                title={"Sort Sequence"}
                url={`/setting/changeSeqMenu`}
                data={seqMenu}
                onSuccess={handleSuccessMenu}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <SequenceEdit initialItems={comboMenu as any}
                        onItemsChange={handleItemsChange}
                    />
                }
            />
            {/* modal end sequence */}

            {/* Modal detail */}
            <DetailMenu
                idMenu={detailMenu.id}
                comboMenu={comboMenu}
                modal={modal.edit}
                setModal={() =>
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                        sequence: false
                    })
                }
                handleSuccess={handleSuccessMenu}
            />
            {/* modal end detail */}


            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="flex bg-white mb-4 rounded-md p-4 gap-2">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addMenuPopup(e)}
                        >
                            <span>Add Menu</span>
                        </div>
                        <div
                            className="ml-auto bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addSequencePopup(e)}
                        >
                            <span>Change Sequence</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="menu_name"
                            type="text"
                            name="menu_name"
                            value={searchMenu.menu_search[0].menu_name}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch("menu_name", e.target.value, 0)
                            }
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const name = searchMenu.menu_search[0].menu_name;
                                    const id = searchMenu.menu_search[0].id;
                                    if (name || id) {
                                        inputDataSearch("flag", name || id, 0);
                                        setIsSuccess("success");
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                        setIsSuccess("Get All Menu");
                                    }
                                }
                            }}
                            placeholder="Search Menu Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchMenu.menu_search[0]
                                            .id === "" &&
                                        searchMenu.menu_search[0]
                                            .menu_name === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess("Search");
                                }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => clearSearch(e)}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>


                {/* AGGrid */}
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={null}
                            searchParam={searchMenu.menu_search}
                            // loading={isLoading.get_policy}
                            url={"getMenusJson"}
                            doubleClickEvent={handleDetailMenu}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.5,
                                },
                                {
                                    headerName: "Menu Name",
                                    field: "menu_name",
                                    flex: 7,
                                    cellStyle: (params: any) => {
                                        if (params.data && params.data.menu_is_deleted === 1) {
                                            return { color: 'red' };
                                        }
                                        return null;
                                    },
                                    // Tambahkan cellRenderer di sini untuk menambahkan teks (delete)
                                    cellRenderer: (params: any) => {
                                        if (params.data && params.data.menu_is_deleted === 1) {
                                            return `${params.value} (delete)`;
                                        }
                                        return params.value;
                                    }
                                },
                                {
                                    headerName: "URL",
                                    field: "menu_url",
                                    flex: 4,
                                },
                                {
                                    headerName: "Parent",
                                    field: "parent.menu_name",
                                    flex: 3,
                                },
                                {
                                    headerName: "Sequence",
                                    field: "menu_sequence",
                                    flex: 3,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
