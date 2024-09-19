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

export default function ACLMenu({ auth, custom_menu }: PageProps) {

    useEffect(() => {
        getMenu();
    }, []);

    const [seqMenu, setSeqMenu] = useState<any>([]);


    const [menuData, setMenuData] = useState<any>([]);
    const [searchMenu, setSearchMenu] = useState<any>({
        menu_name: "",
    });
    const [comboMenu, setComboMenu] = useState<any>([]);

    const [detailMenu, setDetailMenu] = useState<any>({
        id: "",
        menu_name: "",
    });

    //getMenus
    const getMenu = async (pageNumber = "page=1") => {
        await axios
            .post(`/getMenus?${pageNumber}`, {
                // idRelation,
                menu_name: searchMenu.menu_name,
            })
            .then((res) => {
                setMenuData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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

    // handleSuccess
    const handleSuccess = ({ message }: any) => {
        console.log("message", message);

        if (modal.add) {
            Swal.fire({
                title: "Success",
                text: "New Menu Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getMenu();
                }
            });
        } else if (modal.edit) {
            Swal.fire({
                title: "Success",
                text: "New Menu Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getMenu();
                }
            });
        } else if (modal.sequence) {
            Swal.fire({
                title: "Success",
                text: message,
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getMenu();
                }
            });
        }
    };

    const handleItemsChange = (updatedItems: any) => {
        setSeqMenu(updatedItems);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Menu"}>
            <Head title="Menu" />

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
                onSuccess={handleSuccess}
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
                                    {comboMenu.map((mData: any, i: number) => {
                                        return (
                                            <option value={mData.id} key={i}>
                                                {mData.menu_name}
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
                onSuccess={handleSuccess}
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
                handleSuccess={handleSuccess}
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
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="menu_name"
                            type="text"
                            name="menu_name"
                            value={searchMenu.menu_name}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchMenu({
                                    ...searchMenu,
                                    menu_name: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (searchMenu.menu_name !== "") {
                                        getMenu();
                                        setSearchMenu({
                                            ...searchMenu,
                                            menu_name: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Menu Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchMenu()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchMenu()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[60rem] xs:mt-4 lg:mt-0" style={{}}>
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
                        <table className=" w-full table-auto divide-y divide-gray-300">
                            <thead className="">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                    <TableTH
                                        className={"min-w-[50px] bg-gray-200"}
                                        label={"Name"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                    <TableTH
                                        className={"min-w-[50px] bg-gray-200"}
                                        label={" URL"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                    <TableTH

                                        className={"min-w-[50px] bg-gray-200"}


                                        label={"Parent"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                    <TableTH
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Sequence"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {menuData.data?.map((dMenu: any, i: number) => {
                                    return (
                                        <tr
                                            onDoubleClick={(event) => {
                                                event.stopPropagation();
                                                getComboMenu();
                                                setDetailMenu({
                                                    id: dMenu.id,
                                                    menu_name: dMenu.menu_name,
                                                });
                                                setModal({
                                                    add: false,
                                                    edit: !modal.edit,
                                                    detail: false,
                                                    sequence: false,
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
                                                value={menuData.from + i}
                                                className={"text-center"}
                                            />
                                            <TableTD
                                                value={
                                                    <>
                                                        {dMenu?.menu_is_deleted === 1
                                                            ? <span className="text-red-600">{dMenu.menu_name} (Deleted)</span>
                                                            : <span className="text-black-600">{dMenu.menu_name}</span>
                                                        }
                                                    </>
                                                }
                                                className={dMenu?.menu_is_deleted
                                                    === 0 ? "text-black-600" : "text-red-600"}

                                            />



                                            <TableTD
                                                value={<>{dMenu.menu_url}</>}
                                                className={""}
                                            />

                                            <TableTD
                                                value={
                                                    <>
                                                        {
                                                            dMenu.parent
                                                                ?.menu_name
                                                        }
                                                    </>
                                                }
                                                className={""}
                                            />
                                            <TableTD
                                                value={
                                                    <>
                                                        {
                                                            dMenu.menu_sequence
                                                        }
                                                    </>
                                                }
                                                className={""}
                                            />
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                        <Pagination
                            links={menuData.links}
                            fromData={menuData.from}
                            toData={menuData.to}
                            totalData={menuData.total}
                            clickHref={(url: string) =>
                                getMenu(url.split("?").pop())
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
