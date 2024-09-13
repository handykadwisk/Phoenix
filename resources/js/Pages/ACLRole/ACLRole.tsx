import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
    Cog6ToothIcon,
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
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import Checkbox from "@/Components/Checkbox";
import { get } from "http";
import { Console, log } from "console";
import ModalToDetail from "@/Components/Modal/ModalToDetail";
import ModalToActions from "@/Components/Modal/ModalToActions";

export default function ACLRole({ auth, custom_menu, language, permission, newRole, menu }: any) {

    useEffect(() => {
        getRole();
    }, []);


    // // state for role
    const [dataRole, setDataRole] = useState<any>([]);
    const [searchRole, setSearchRole] = useState<any>([]);
    const [dataById, setDataById] = useState<any>([])


    const [isLoading, setIsLoading] = useState<any>({
        get_role_permission: false,
        get_data_by_id: false
    })
    const [accessMenu, setAccessMenu] = useState<any>([])

    const [isSuccess, setIsSuccess] = useState<string>('')

    //fetch data role
    const getRole = async (pageNumber = "page=1") => {
            try {
            const res = await axios.post(`/getRole?${pageNumber}`, {
                role_name: searchRole.role_name,
            })
            setDataRole(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const editMenuMapping = (e: any, item: any, parent: any = null) => {
        const { value, checked } = e.target;
        const parsedValue = parseInt(value);
        let updatedAccessMenu = [...accessMenu];

        if (checked) {
            // Tambahkan item saat ini jika belum ada di accessMenu
            if (!updatedAccessMenu.some((data: any) => data.menu_id === parsedValue)) {
                updatedAccessMenu.push({ menu_id: parsedValue, role_id: roleId });
            }
            // Jika ini adalah parent, tambahkan semua anak
            if (item.children) {
                item.children.forEach((child: any) => {
                    if (!updatedAccessMenu.some((data: any) => data.menu_id === child.id)) {
                        updatedAccessMenu.push({ menu_id: child.id, role_id: roleId });
                    }
                });
            }
            // Jika ada parent, tambahkan parent
            if (parent && !updatedAccessMenu.some((data: any) => data.menu_id === parent.id)) {
                updatedAccessMenu.push({ menu_id: parent.id, role_id: roleId });
            }
        } else {
            // Hapus item saat ini
            updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== parsedValue);

            // Jika ini adalah parent, hapus semua anak
            if (item.children) {
                updatedAccessMenu = updatedAccessMenu.filter((data: any) => !item.children.some((child: any) => child.id === data.menu_id));
            }
            // Jika ada parent, cek apakah semua anak sudah tidak dicentang
            if (parent) {
                const allChildrenUnchecked = !parent.children.some((child: any) => checkChecked(child.id));
                if (allChildrenUnchecked) {
                    updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== parent.id);
                }
            }
        }
        // Pastikan role_id tetap ada dalam updatedAccessMenu meskipun kosong
        if (updatedAccessMenu.length === 0) {
            updatedAccessMenu.push({ role_id: roleId });
        }
        setAccessMenu(updatedAccessMenu);
    }

    const checkChecked = (id: number) => {
        return accessMenu.some((f: any) => f.menu_id === id);
    }

    //fetch data by id
    const getRoleById = async (idRole: number) => {
        setIsLoading({ ...isLoading, get_data_by_id: true })
        setRoleId(idRole)
        await axios
            .post(`/getRoleById`, {
                idRole,
            })
            .then((res) => {
                setDataById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsLoading({ ...isLoading, get_data_by_id: false })

    };

    // clear search role
    const clearSearchRole = async (pageNumber = "page=1") => {
        try {
            const res = await axios.post(`/getRole?${pageNumber}`)
            setDataRole(res.data);
            setSearchRole({
                ...searchRole,
                role_name: "",
            });
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }

    // for modal
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        detail: false,
        menu: false,
        permission: false,
    });

    // handle popup add permission
    const addRolePopup = async (e: FormEvent) => {
        e.preventDefault();

        setModal({
            add: !modal.add,
            edit: false,
            detail: false,
            menu: false,
            permission: false,
        });
    };

    // for request data permission
    const { data, setData } = useForm<any>({
        role_name: "",
    });

    // handle success
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
                }
            });
        } else if (modal.menu) {
            Swal.fire({
                title: "Success",
                text: "New Role Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getRole();
                }
            });
        } else if (modal.permission) {
            Swal.fire({
                title: "Success",
                text: "New permission Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getRole();
                }
            });
        }
    };

    const [roleId, setRoleId] = useState<number>()

    const handleDetail = async (id: number) => {
        setRoleId(id)
        await axios.get(`/getRoleAccessMenuByRoleId/${id}`)
            .then((res) => {
                setAccessMenu(res.data)
            })
            .catch((err) => console.log(err))
        setModal({ ...modal, detail: true })

    }

    //handle modal Edit Menu
    const handleSetEditMenuModal = async (id: number) => {
        setRoleId(id)

        await axios.get(`/getRoleAccessMenuByRoleId/${id}`)
            .then((res) => {
                setAccessMenu(res.data)
            })
            .catch((err) => console.log(err))
        setModal({ ...modal, menu: true, detail: false })

    }

    //role Object
    const roleObject = (e: any) => {
        e.preventDefault();
        if (modal.add) {
            setData("role_name", e.target.value);
        } else if (modal.edit) {
            setDataById({
                ...dataById,
                role_name: e.target.value,
            });
        }
    }

    //=======================================================================
    //component tab
    interface TabProps {
        label: string;
        onClick: () => void;
        active: boolean;
    }

    const Tab: React.FC<TabProps> = ({ label, onClick, active }) => {
        return (
            <button
                className={`px-4 py-2 focus:outline-none ${active ? 'border-b-2 border-blue-500' : 'border-b-2 border-transparent'}`}
                onClick={onClick}
            >
                {label}
            </button>
        );
    };

    const TabMenu = () => {
        return (
            <div className="w-full max-w-md mx-auto">
                <div>
                    <div className="">
                        {
                            custom_menu?.map((cm: any) => (
                                <div key={cm.menu_id}>
                                    <div className="flex items-center">
                                        <Checkbox value={cm.menu_id} defaultChecked={checkChecked(cm.id)} disabled />
                                        <label className="text-gray-900 ml-3">{cm.menu_name}</label>
                                    </div>
                                    {
                                        cm.children?.map((children: any) => (
                                            <div className="ml-7 flex items-center" key={children.menu_id}>
                                                <Checkbox value={children.menu_id} defaultChecked={checkChecked(children.id)} disabled />
                                                <label className="text-gray-900 ml-3">{children.menu_name}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    };

    const [accessPermission, setAccessPermission] = useState<any>([])

    const getPermissionId = async (id: number) => {
        try {
            const data = await axios.get(`/rolePermission/${id}`)
            setAccessPermission(data.data)
            console.log(data.data);
            
            
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }

    const handlePermissionModal = async (id: number) => {
        setModal({
            ...modal,
            permission: true,
            detail: false
        })
    }
    const editPermissionMapping = (e: any) => {
        // destructuring
        const { value, checked } = e.target

        if (checked) {
            setAccessPermission([...accessPermission, { permission_id: parseInt(value), role_id: roleId }])
        } else {
            const updatedData = accessPermission.filter((data: any) => data.permission_id !== parseInt(value))
            setAccessPermission(updatedData)
        }
    }

    const checkPermissionChecked = (id: number) => {
        if (accessPermission?.find((f: any) => f.permission_id === id)) {
            return true
        }
    }

    const TabPermission = () => {
        return (
            <div className="w-full max-w-md mx-auto">
                <div>
                    <div className="">
                        {
                            permission?.map((permission: any, i: number) => (
                                <div key={i}>
                                    <div className="flex items-center">
                                        <Checkbox value={permission.PERMISSION_ID} defaultChecked={checkPermissionChecked(permission.PERMISSION_ID)} onChange={(e) => editPermissionMapping(e)} disabled />
                                        <label className="text-gray-900 ml-3">{permission.PERMISSION_NAME}</label>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }

    const [activeTab, setActiveTab] = useState<string>('menu');

    //end component tab
    //=======================================================================

    return (
        <AuthenticatedLayout user={auth.user} header={"Role"}>
            <Head title="Role" />

            {/* modal edit mapping permission */}
            <ModalToActions
                show={modal.permission}
                onClose={() => setModal({ ...modal, permission: false, detail: true })}
                title={"Set Permissions"}
                method={"post"}
                url={`/rolePermission`}
                data={accessPermission}
                headers={null}
                submitButtonName={''}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    permission?.map((permission: any, i: number) => (
                        <>
                            <div className="flex items-center" key={i}>
                                <Checkbox value={permission.PERMISSION_ID} defaultChecked={checkPermissionChecked(permission.PERMISSION_ID)} onChange={(e) => editPermissionMapping(e)} />
                                <label className="text-gray-900 ml-3">{permission.PERMISSION_NAME}</label>
                            </div>
                        </>
                    ))
                }
            />
            {/* end modal mapping menu */}

            {/* modal edit mapping menu */}
            <ModalToAction
                show={modal.menu}
                onClose={() => setModal({ ...modal, menu: false, detail: true })}
                title={"Set Mapping"}
                method={"post"}
                url={`/roleAccessMenu`}
                data={accessMenu}
                headers={null}
                submitButtonName={''}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    custom_menu?.map((cm: any, i: number) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center">
                                <Checkbox value={cm.id} checked={checkChecked(cm.id)} onChange={(e) => editMenuMapping(e, cm)} />
                                <label className="text-gray-900 ml-3">{cm.menu_name}</label>
                            </div>
                            {
                                cm.children?.map((children: any, j: number) => (
                                    <div className="ml-7 flex items-center" key={j}>
                                        <Checkbox value={children.id} checked={checkChecked(children.id)} onChange={(e) => editMenuMapping(e, children, cm)} />
                                        <label className="text-gray-900 ml-3">{children.menu_name}</label>
                                    </div>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            />
            {/* end modal mapping menu */}

            {/* modal Add */}
            <ModalToAdd
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                        menu: false,
                        permission: false,
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

            {/* Modal Edit role */}
            <ModalToDetail
                show={modal.detail}
                onClose={() =>
                    setModal({
                        add: false,
                        edit: false,
                        detail: false,
                        menu: false,
                        permission: false
                    })
                }
                title={"Detail Role"}
                url={``}
                data={dataById}
                onSuccess={handleSuccess}
                buttonAddOns={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div>
                            <TextInput
                                id="ROLE_NAME"
                                type="text"
                                name="ROLE_NAME"
                                value={dataById.role_name}
                                className="mt-2"
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        role_name: e.target.value,
                                    });
                                }}
                                onKeyUp={(e) => {
                                    roleObject(e);
                                }}
                                required
                                placeholder="Role Name"
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <div className="w-full max-w-md mx-auto">
                                <div className="flex border-b mb-4">
                                    <div className="flex border-r">
                                        <Tab
                                            label="Menu"
                                            onClick={() => setActiveTab('menu')}
                                            active={activeTab === 'menu'}
                                        />
                                        <PencilSquareIcon className="w-5 -ml-3 mr-2 hover:text-blue-500 cursor-pointer"
                                            onClick={() => {
                                                handleSetEditMenuModal(dataById.id);
                                            }}>a</PencilSquareIcon>
                                    </div>

                                    <Tab
                                        label="Permission"
                                        onClick={() => setActiveTab('permission')}
                                        active={activeTab === 'permission'}
                                    />
                                    <PencilSquareIcon className="w-5 -ml-3 mr-2 hover:text-blue-500 cursor-pointer"
                                        onClick={() => {
                                            handlePermissionModal(dataById.id);
                                        }}>a</PencilSquareIcon>
                                </div>
                                <div>
                                    {activeTab === 'menu' && <TabMenu />}
                                    {activeTab === 'permission' && <TabPermission />}
                                </div>
                            </div>

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
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                    <TableTH
                                        className={"min-w-[50px] bg-gray-200"}
                                        label={"Name Role"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataRole.data?.map(
                                    (dRole: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    setDataRole({
                                                        ...dataRole
                                                    });
                                                    setModal({
                                                        add: false,
                                                        edit: !modal.edit,
                                                        detail: false,
                                                        menu: false,
                                                        permission: false,
                                                    });
                                                    getRoleById(
                                                        dRole.id
                                                    );
                                                    getPermissionId(dRole.id);
                                                    handleDetail(dRole.id);

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
                                                                dRole.role_name
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
