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
import AGGrid from "@/Components/AgGrid";

export default function ACLRole({ auth, custom_menu, language, permission, newRole, menu }: any) {

    useEffect(() => {
        getRole();
    }, []);


    // // state for role
    const [dataRole, setDataRole] = useState<any>([]);
    const [searchRole, setSearchRole] = useState<any>({
        role_search: [
            {
                id: "",
                role_name: "",
                flag: "flag"
            },
        ],
    });
    const [dataById, setDataById] = useState<any>([])


    const [isLoading, setIsLoading] = useState<any>({
        get_role_permission: false,
        get_data_by_id: false
    })
    const [accessMenu, setAccessMenu] = useState<any>([])

    // const [isSuccess, setIsSuccess] = useState<string>('')

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
            // Jika ini adalah parent, tambahkan semua anak secara rekursif
            if (item.children) {
                item.children.forEach((child: any) => {
                    if (!updatedAccessMenu.some((data: any) => data.menu_id === child.id)) {
                        updatedAccessMenu.push({ menu_id: child.id, role_id: roleId });
                    }
                    // Panggil fungsi ini lagi untuk menangani children dari child
                    editMenuMapping({ target: { value: child.id, checked: true } }, child, item);
                });
            }
            // Jika ada parent, tambahkan parent
            if (parent && !updatedAccessMenu.some((data: any) => data.menu_id === parent.id)) {
                updatedAccessMenu.push({ menu_id: parent.id, role_id: roleId });
            }
        } else {
            // Hapus item saat ini
            updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== parsedValue);

            // Jika ini adalah parent, hapus semua anak secara rekursif
            if (item.children) {
                item.children.forEach((child: any) => {
                    updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== child.id);
                    // Panggil fungsi ini lagi untuk menangani penghapusan children dari child
                    editMenuMapping({ target: { value: child.id, checked: false } }, child, item);
                });
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

        // Perbarui state accessMenu
        setAccessMenu(updatedAccessMenu);
    };



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

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchRole.role_search];
        changeVal[i][name] = value;
        setSearchRole({ ...searchRole, role_search: changeVal });
    };
    // Fungsi untuk menghapus input pencarian dan menampilkan semua data
    const clearSearch = (e: React.MouseEvent) => {
        // Kosongkan input pencarian
        inputDataSearch("role_name", "", 0);
        // Reset flag untuk menampilkan semua data
        inputDataSearch("flag", "", 0);
        setIsSuccess("Cleared");
    };


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

    const renderMenu = (menu: any, index: number) => {
        const menuKey = menu.menu_id || `menu-fallback-${index}`;

        return (
            <div key={`parent-${menuKey}`}>
                {/* Parent Menu */}
                <div className="flex items-center">
                    <Checkbox value={menu.menu_id} defaultChecked={checkChecked(menu.id)} disabled />
                    <label className="text-gray-900 ml-3 ">{menu.menu_name}</label>
                </div>

                {/* Cek apakah menu memiliki children */}
                {menu.children?.map((child: any, childIndex: number) => {
                    const childKey = child.menu_id || `child-fallback-${childIndex}`;

                    return (
                        <div className="ml-7 pl-4 border-l-2 border-red-400" key={`child-${childKey}`}>
                            {/* Render ulang secara rekursif */}
                            {renderMenu(child, childIndex)}
                        </div>
                    );
                })}
            </div>
        );
    };

    const TabMenu = () => {
        return (
            <div className="w-full max-w-md mx-auto">
                <div>
                    <div className="">
                        {custom_menu?.map((menu: any, index: number) => (
                            <div key={`main-${menu.menu_id || `fallback-${index}`}`}>
                                {renderMenu(menu, index)}
                            </div>
                        ))}
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
            // console.log(data.data);


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
                            permission?.map((permission: any) => (
                                <div key={permission.PERMISSION_ID}>
                                    <div className="flex items-center">
                                        <Checkbox
                                            value={permission.PERMISSION_ID}
                                            defaultChecked={checkPermissionChecked(permission.PERMISSION_ID)}
                                            onChange={(e) => editPermissionMapping(e)}
                                            disabled
                                        />
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
    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccessRole = (message: string) => {
        setIsSuccess('')
        // getMenu()
        if (message !== '') {
            setIsSuccess(message[0])
            setTimeout(() => {
                setIsSuccess('')
            }, 5000)
        }
    }
    const handleDetailRole = (data: any) => {
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
            data.id
        );
        getPermissionId(data.id);
        handleDetail(data.id);
    }

    const handleCheckboxChange = (e: any, item: any, parent: any = null) => {
        const { value, checked } = e.target;
        const parsedValue = parseInt(value);
        let updatedAccessMenu = [...accessMenu];

        if (checked) {
            // Tambahkan item yang dicentang
            if (!updatedAccessMenu.some((data: any) => data.menu_id === parsedValue)) {
                updatedAccessMenu.push({ menu_id: parsedValue });
            }
    
            // Fungsi rekursif untuk mencentang semua child dari item yang dicentang
            const checkAllChildrenRecursively = (parentItem: any) => {
                if (parentItem.children) {
                    parentItem.children.forEach((child: any) => {
                        if (!updatedAccessMenu.some((data: any) => data.menu_id === child.id)) {
                            updatedAccessMenu.push({ menu_id: child.id });
                        }
                        // Panggil rekursif untuk setiap child
                        checkAllChildrenRecursively(child);
                    });
                }
            };
    
            checkAllChildrenRecursively(item);  // Pastikan semua child ikut dicentang
    
            // Centang parent dan semua parent di atasnya secara rekursif
            const checkParentsRecursively = (parentItem: any) => {
                if (parentItem && !updatedAccessMenu.some((data: any) => data.menu_id === parentItem.id)) {
                    updatedAccessMenu.push({ menu_id: parentItem.id });
                    const parentData = custom_menu.find((menu: any) => menu.id === parentItem.menu_parent_id); // Cari parent berdasarkan menu_parent_id
                    if (parentData) {
                        checkParentsRecursively(parentData);  // Panggil rekursif untuk parent di atasnya
                    }
                }
            };
    
            checkParentsRecursively(parent);
        } else {
            // Hapus item yang tidak dicentang
        updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== parsedValue);

        // Fungsi rekursif untuk menghapus semua child dari item yang di-uncheck
        const uncheckAllChildrenRecursively = (parentItem: any) => {
            if (parentItem.children) {
                parentItem.children.forEach((child: any) => {
                    updatedAccessMenu = updatedAccessMenu.filter((data: any) => data.menu_id !== child.id);
                    // Panggil rekursif untuk setiap child
                    uncheckAllChildrenRecursively(child);
                });
            }
        };

        uncheckAllChildrenRecursively(item);  // Pastikan semua child ikut di-uncheck

        // Tidak perlu uncheck parent
    
        }

        // Perbarui state accessMenu
        setAccessMenu(updatedAccessMenu);
    };


    const renderMenuEdit = (menu: any, parent: any = null) => {
        return (
            <div key={menu.id}>
                {/* Parent Menu */}
                <div className="flex items-center">
                    <Checkbox
                        value={menu.id}
                        checked={checkChecked(menu.id)}  // Cek status tercentang menggunakan checkChecked
                        onChange={(e) => handleCheckboxChange(e, menu, parent)}  // Tambahkan parent sebagai argumen
                    />
                    <label className="text-gray-900 ml-3">{menu.menu_name}</label>
                </div>

                {/* Jika menu memiliki children */}
                {menu.children?.map((child: any) => (
                    <div className="ml-7 pl-4 border-l-2 border-red-400" key={child.id}>
                        {/* Rekursif render untuk child */}
                        {renderMenuEdit(child, menu)}
                    </div>
                ))}
            </div>
        );
    };




    return (
        <AuthenticatedLayout user={auth.user} header={"Role"}>
            <Head title="Role" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* modal edit mapping permission */}
            <ModalToAction
                show={modal.permission}
                onClose={() => setModal({ ...modal, permission: false, detail: true })}
                title={"Set Permission"}
                method={"post"}
                url={`/rolePermission`}
                data={accessPermission}
                headers={null}
                submitButtonName={''}
                onSuccess={handleSuccessRole}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    permission?.map((permission: any) => (
                        <div className="flex items-center" key={permission.PERMISSION_ID}>
                            <Checkbox
                                value={permission.PERMISSION_ID}
                                defaultChecked={checkPermissionChecked(permission.PERMISSION_ID)}
                                onChange={(e) => editPermissionMapping(e)}
                            />
                            <label className="text-gray-900 ml-3">{permission.PERMISSION_NAME}</label>
                        </div>
                    ))
                }
            />

            {/* end modal mapping menu */}

            {/* modal edit mapping menu */}
            <ModalToAction
                show={modal.menu}
                onClose={() => setModal({ ...modal, menu: false, detail: true })}
                title={"Set Menu"}
                method={"post"}
                url={`/addAccessMenu/${roleId}`}
                data={accessMenu}
                headers={null}
                submitButtonName={'Submit'}
                onSuccess={handleSuccessRole}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    custom_menu?.map((menu: any) => (
                        renderMenuEdit(menu)
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
                onSuccess={handleSuccessRole}
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
            <ModalToAction
                headers={''}
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
                submitButtonName={''}
                method=""
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
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="role_name"
                            type="text"
                            name="role_name"
                            value={searchRole.role_search[0].role_name}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch("role_name", e.target.value, 0);
                            }
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const title = searchRole.role_search[0].role_name;
                                    const id = searchRole.role_search[0].id;
                                    if (title || id) {
                                        inputDataSearch("flag", title || id, 0);
                                        setIsSuccess("success");
                                        setTimeout(() => {
                                            setIsSuccess("");
                                        });
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                        setIsSuccess("Get All Job Post");
                                    }
                                }
                            }}
                            placeholder="Search Role Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => {
                                    if (
                                        searchRole.role_search[0]
                                            .id === "" &&
                                        searchRole.role_search[0]
                                            .role_name === ""
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
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={null}
                            searchParam={searchRole.role_search}
                            // loading={isLoading.get_policy}
                            url={"getRole"}
                            doubleClickEvent={handleDetailRole}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.5,
                                },
                                {
                                    headerName: "Role Name",
                                    field: "role_name",
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
