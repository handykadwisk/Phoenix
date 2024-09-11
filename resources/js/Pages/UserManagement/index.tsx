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
import Select from "react-tailwindcss-select";
// import DetailMenu from "./DetailMenu";
// import useForm from "@/action/handleChange";
import { set } from "react-datepicker/dist/date_utils";
import ModalToEdit from "@/Components/Modal/ModalToEdit";
import ModalToResetPassword from "@/Components/Modal/ModalToResetPassword";

export default function UserManagement({ auth, type }: any) {
    console.log('auth',auth);
    
    useEffect(() => {
        getUser()
    }, []);

    //type DataInput
    interface DataInputType {
        name: string,
        email: string,
        user_login: string,
        password: string,
        employee_id: number,
        individual_relations_id: number,
        type: any,
        role: number[]
    }

    //type role
    interface Role {
        id: number;
        role_name: string;
    }

    //state
    const [dataInput, setDataInput] = useState<DataInputType>({
        name: "",
        email: "",
        user_login: "",
        password: "",
        employee_id: 0,
        individual_relations_id: 0,
        type: 2,
        role: []
    })
    const [dataUserId, setDataUserId] = useState<any>([])
    const [dataUser, setDataUser] = useState<any>([]);
    const [searchUser, setSearchRole] = useState<any>([]);
    const [dataType, setDataType] = useState<any>([])
    const [dataRole, setDataRole] = useState<any>([])
    const [resetPassword, setResetPassword] = useState<any>({
        password: 'Phoenix123',
    })
    const [isError, setIsError] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    // console.log(isError, '<<<<<isError');

    //modal state
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        reset: false
        // detail: false,
    });

    //sate data input edit
    const [dataInputEdit, setDataInputEdit] = useState<any>({
        name: "",
        email: "",
        user_login: "",
        password: "",
        employee_id: 0,
        individual_relations_id: 0,
        type: 2,
        user_status: 0,
        role: [],
        newRole: null
    });

    //handle change role
    const handleRoleChange = (selectedOptions: any) => {
        const selectedRoleIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setDataInput((prevState: DataInputType) => ({
            ...prevState,
            role: selectedRoleIds,
        }));
    };

    //handle change email
    const handleUserLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const user_login = e.target.value;

        let name;
        if (user_login.includes('@')) {
            // Jika mengandung '@', ambil bagian sebelum '@'
            name = user_login.split("@")[0];
        } else {
            // Jika tidak mengandung '@', gunakan full user_login sebagai name
            name = user_login;
        }
        // Update state

        setDataInput({ ...dataInput, name: name });
        setDataInputEdit({ ...dataInputEdit, user_login, name });
    };


    //fetch data user
    const getUser = async (pageNumber = "page=1") => {
        await axios
            .post(`/getUser?${pageNumber}`, {
                // idRelation,
                name: searchUser.name,
            })
            .then((res) => {
                setDataUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //get user by id
    const getUserById = async (userId: number) => {
        try {
            const result = await axios.post(`/settings/getUserId/${userId}`);
            setDataUserId(result.data);
            setDataInputEdit({
                name: result.data.name,
                email: result.data.email,
                user_login: result.data.user_login,
                employee_id: result.data.employee_id,
                individual_relations_id: result.data.individual_relations_id,
                type: result.data.type,
                user_status: result.data.user_status,
                role: result.data.roles,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //get role
    const getRole = async () => {
        try {
            const result = await axios.post('/getAllRole');
            setDataRole(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    //get type
    const getTypeTest = async () => {
        try {
            const result = await axios.post('/getType');
            setDataType(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    //clear search
    const clearSearchRole = async (pageNumber = "page=1") => {
        await axios
            .post(`/getUser?${pageNumber}`)
            .then((res) => {
                setDataUser(res.data);
                setSearchRole({
                    ...searchUser,
                    name: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const roleFor = dataRole?.map((role: Role) => {
        return {
            value: role.id,
            label: role.role_name
        };
    });

    //modal add
    const addRolePopup = async (e: FormEvent) => {
        e.preventDefault();
        getTypeTest()
        getRole()
        getAllRelations()
        getEmployee()
        setModal({
            add: !modal.add,
            edit: false,
            reset: false
            // detail: false,
        });
    };
    //get employee
    const [employee, setEmployee] = useState<any>([]);
    const getEmployee = async () => {
        try {
            const result = await axios.get('/getAllEmployee');

            setEmployee(result.data);
            // console.log(result.data, '<<<<<<<<<<<<<<<<<<<<');
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    // console.log('employee',employee);

    //get company  
    const [relation, setRelation] = useState<any>([]);
    const getAllRelations = async () => {
        try {
            const result = await axios.get('/getAllRelations');
            setRelation(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }


    // handle success
    const handleSuccess = (message: string) => {
        if (modal.add) {
            Swal.fire({
                title: "Success",
                text: "New User Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getUser();
                    setDataInput({
                        name: "",
                        email: "",
                        user_login: "",
                        password: "",
                        employee_id: 0,
                        individual_relations_id: 0,
                        type: 0,
                        role: []
                    });
                }
            })
                .catch((error) => {
                    console.error('Fetch error:', error);
                });
        }
        else if (modal.edit) {
            Swal.fire({
                title: "Success",
                text: "New User Edit",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getUser();
                }
            })
                .catch((error) => {
                    console.error('Fetch error:', error);
                });
        }
        else if (modal.reset) {
            Swal.fire({
                title: "Success",
                text: "Reset Password",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    getUser();
                }
            });
        }
    };

    const getDataRoleSelect = (dataRole: any) => {
        const roleFor = dataRole?.map((role: any) => {
            // console.log("aaab",role.role_name);
            if (role.role_name !== undefined) {
                return {
                    value: role.id,
                    label: role.role_name
                };
            } else {
                return {
                    value: role.value,
                    label: role.label
                };
            }
        });
        return roleFor;
    }

    if (!dataInputEdit.newRole) {
        dataInputEdit.newRole = dataInputEdit.role.map((role: any) => role.id);
    }

    // console.log(dataInput, '<<<<<dataInput');
    // console.log(dataInputEdit, '<<<<<dataInputEdit');

    // Fungsi untuk menangani perubahan saat employee dipilih
    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmployeeId = Number(e.target.value);
        const selectedEmployee = employee.find((emp: any) => emp.EMPLOYEE_ID === selectedEmployeeId);

        // Update state dengan employee_id dan email yang terkait
        setDataInput({
            ...dataInput,
            employee_id: selectedEmployeeId,
            user_login: selectedEmployee?.EMPLOYEE_EMAIL || '', // Set email jika ada, kosongkan jika tidak ada
            name: selectedEmployee?.EMPLOYEE_FIRST_NAME || '' // Set email jika ada, kosongkan jika tidak ada
        });
    };
    const handleEmployeeChangeEdit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmployeeId = Number(e.target.value);
        const selectedEmployee = employee.find((emp: any) => emp.EMPLOYEE_ID === selectedEmployeeId);

        // Update state dengan employee_id dan email yang terkait
        setDataInputEdit({
            ...dataInputEdit,
            employee_id: selectedEmployeeId,
            user_login: selectedEmployee?.EMPLOYEE_EMAIL || '', // Set email jika ada, kosongkan jika tidak ada
            name: selectedEmployee?.EMPLOYEE_FIRST_NAME || '' // Set email jika ada, kosongkan jika tidak ada
        });
    };
    // Change relations
    const handleRelationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectRelationId = Number(e.target.value);
        const selectRelation = relation.find((emp: any) => emp.RELATION_ORGANIZATION_ID === selectRelationId);

        setDataInput({
            ...dataInput,
            individual_relations_id: selectRelationId,
            user_login: selectRelation?.RELATION_ORGANIZATION_EMAIL || '', // Set email jika ada, kosongkan jika tidak ada
            name: selectRelation?.RELATION_ORGANIZATION_NAME || '' // Set email jika ada, kosongkan jika tidak ada
        });
    };

    const handleUserStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ubah nilai menjadi 1 (on) atau 0 (off) sesuai status switch
        const userStatus = e.target.checked ? 1 : 0;
        setDataInputEdit({ ...dataInputEdit, user_status: userStatus });
    };
    console.log(dataInputEdit, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');


    return (
        <AuthenticatedLayout user={auth.user} header="User Management">

            <Head title="User Management" />

            {/* modal add */}
            <ModalToAdd
                show={modal.add}
                onClose={
                    () => {
                        setModal({
                            add: false,
                            edit: false,
                            reset: false
                        });
                        setDataInput({
                            name: "",
                            email: "",
                            user_login: "",
                            password: "",
                            employee_id: 0,
                            individual_relations_id: 0,
                            type: 2,
                            role: []

                        });
                    }
                }
                title={'Add User'}
                url={'/settings/addUser'}
                data={dataInput}
                onSuccess={handleSuccess}
                buttonAddOns={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        {/* type */}
                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="type"
                                    value={'Type'}
                                />
                                <div className="ml-[2.3rem] text-red-600">*</div>
                            </div>
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataInput.type}
                                onChange={(e) => setDataInput({ ...dataInput, type: Number(e.target.value) })}
                            >
                                <option value={""}>
                                    -- Choose Type --
                                </option>
                                {
                                    dataType?.map((mType: any, i: number) => {
                                        return (
                                            <option value={mType.user_type_id} key={i}>
                                                {mType.user_type_name}
                                            </option>
                                        )
                                    })
                                }

                            </select>
                        </div>
                        {/* type */}


                        {dataInput.type === 2 && (
                            <>
                                {/* Employee */}
                                <div className="mb-2">
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="type"
                                            value={'Employee'}
                                        />
                                        <div className="ml-[4.6rem] text-red-600">*</div>
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataInput.employee_id}
                                        onChange={handleEmployeeChange}
                                    >
                                        <option value={""}>
                                            -- Choose Employee --
                                        </option>
                                        {employee?.map((mEmp: any, i: number) => (
                                            <option value={mEmp.EMPLOYEE_ID} key={i}>
                                                {mEmp.EMPLOYEE_FIRST_NAME}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                {/* Employee */}

                            </>
                        )}

                        {dataInput.type === 3 && (
                            <>
                                {/* company */}
                                <div className="mb-2">
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="type"
                                            value={'Relation Organization'}
                                        />
                                        <div className="ml-[9.7rem] text-red-600">*</div>
                                    </div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataInput.individual_relations_id}
                                        onChange={handleRelationChange
                                        }
                                    >
                                        <option value={""}>
                                            -- Choose Type --
                                        </option>
                                        {
                                            relation?.map((mRel: any, i: number) => {
                                                return (
                                                    <option value={mRel.RELATION_ORGANIZATION_ID} key={i}>
                                                        {mRel.RELATION_ORGANIZATION_NAME}
                                                    </option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                {/* company */}
                            </>
                        )}

                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="email"
                                    value={'User Login'}
                                />
                                <div className="ml-[4.6rem] text-red-600">*</div>
                            </div>
                            <TextInput
                                id="user_login"
                                type="text"
                                name="user_login"
                                value={dataInput.user_login}
                                className="mt-2"
                                onChange={
                                    (e) => setDataInput({
                                        ...dataInput, user_login: e.target.value,
                                        // name: e.target.value.includes('@') ? e.target.value.split('@')[0] : e.target.value

                                    })}
                                required
                                placeholder="Email or Other unique id"
                            />
                        </div>
                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="password"
                                    value={'User Password'}
                                />
                                <div className="ml-[6.8rem] text-red-600">*</div>
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={dataInput.password}
                                className="mt-2"
                                onChange={(e) => setDataInput({ ...dataInput, password: e.target.value })}
                                required
                                placeholder="Password"
                            />
                        </div>
                        {/* role */}
                        {dataInput.type === 2 && (
                            <>

                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="type"
                                        value={'Role'}
                                    />
                                    <div className="ml-[2.3rem] text-red-600">*</div>

                                    <div className="mb-2">
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-fit bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-primary-pelindo`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={roleFor}
                                            isSearchable={true}
                                            isMultiple={true}
                                            placeholder={"Select"}
                                            isClearable={true}
                                            value={dataInput.role.map(id => roleFor.find((role: { value: any }) => role.value === id))}
                                            onChange={handleRoleChange}
                                            primaryColor={"red"}

                                        />
                                    </div>

                                </div>


                            </>
                        )}
                        {/* role */}






                    </>
                }

            />
            {/* modal Edit */}
            <ModalToAction
                headers={null}
                submitButtonName={""}
                show={modal.edit}
                onClose={() => setModal({
                    add: false,
                    edit: false,
                    reset: false
                })
                }
                method="patch"
                title={'Edit User'}
                url={`/settings/userEdit/${dataUserId.id}`}
                data={dataInputEdit}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div>
                            <div className="relative">
                                <div className="mb-2">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="type"
                                        value={'Type'}
                                    />
                                    <div className="ml-[2.3rem] text-red-600">*</div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataInputEdit?.type?.user_type_id}
                                        // onChange={(e) => setDataInputEdit({ ...dataInputEdit, type: Number(e.target.value) })}
                                        onChange={(e) => {
                                            const selectedType = Number(e.target.value);
                                            setDataInputEdit({
                                                ...dataInputEdit,
                                                type: selectedType,
                                                role: selectedType !== 2 ? [] : dataInputEdit.newRole,
                                            });
                                        }}
                                    >
                                        {
                                            dataType?.map((mType: any, i: number) => {
                                                return (
                                                    <option value={mType.user_type_id}
                                                        key={i}
                                                        selected={dataInputEdit?.type?.user_type_id === mType.user_type_id}>
                                                        {mType.user_type_name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            {(dataInputEdit?.type === 2 || dataInputEdit?.type?.user_type_id === 2) && (
                                <>
                                    {/* Employee */}
                                    < div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className="absolute"
                                                htmlFor="type"
                                                value={'Employee'}
                                            />
                                            <div className="ml-[4.6rem] text-red-600">*</div>
                                        </div>
                                        <select
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={dataInputEdit?.employee_id || ''} // Pastikan value berasal dari dataInputEdit
                                            onChange={handleEmployeeChangeEdit} // Menggunakan function handleEmployeeChange
                                        >
                                            {employee?.map((mEmp: any, i: number) => {
                                                return (
                                                    <option value={mEmp.EMPLOYEE_ID} key={i}>
                                                        {mEmp.EMPLOYEE_FIRST_NAME}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    {/* Employee */}
                                </>
                            )}

                            {(dataInputEdit?.type === 3 || dataInputEdit?.type?.user_type_id === 3) && (
                                <>
                                    {/* company */}
                                    <div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className="absolute"
                                                htmlFor="type"
                                                value={'Relation Organization'}
                                            />
                                            <div className="ml-[9.7rem] text-red-600">*</div>
                                        </div>
                                        <select
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                            value={dataInputEdit?.individual_relations_id}
                                            // value={dataInputEdit?.employee_id || ''} // Pastikan value berasal dari dataInputEdit

                                            onChange={handleRelationChange
                                            }
                                        >
                                            <option value={""}>
                                                -- Choose Type --
                                            </option>
                                            {
                                                relation?.map((mRel: any, i: number) => {
                                                    return (
                                                        <option value={mRel.RELATION_ORGANIZATION_ID} key={i}>
                                                            {mRel.RELATION_ORGANIZATION_NAME}
                                                        </option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>
                                    {/* company */}
                                </>
                            )}

                            <div className="relative">
                                <div className="mb-2">
                                    <div className="container">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="user_login"
                                            value={'User Login'}
                                        />
                                        <div className="ml-[4.6rem] text-red-600">*</div>
                                    </div>
                                    <TextInput
                                        id="user_login"
                                        type="text"
                                        name="user_login"
                                        value={dataInputEdit?.user_login}
                                        className="mt-2"
                                        onChange={handleUserLoginChange}
                                        required
                                        placeholder="user login or unique id"
                                    />
                                </div>
                            </div>


                            {(dataInputEdit?.type === 2 || dataInputEdit?.type?.user_type_id === 2) && (
                                <>
                                    <div className="relative">
                                        <div className="mb-2">
                                            <InputLabel
                                                className="absolute"
                                                htmlFor=""
                                                value={'Role'}
                                            />
                                            <div className="ml-[2.2rem] text-red-600">*</div>
                                            <div className="mb-2">
                                                <Select
                                                    classNames={{
                                                        menuButton: () =>
                                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                        menu: "text-left z-20 w-fit bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                                ? `text-white bg-primary-pelindo`
                                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                            }`,
                                                    }}
                                                    options={roleFor}
                                                    isSearchable={true}
                                                    isMultiple={true}
                                                    placeholder={"Select"}
                                                    isClearable={true}
                                                    // value={dataInputEdit?.role?.map(id => roleFor.find(role => role.value === id))}
                                                    value={getDataRoleSelect(dataInputEdit.role)}
                                                    onChange={(val: any) => {
                                                        const selectedRoleIds = val ? val.map((option: any) => option.value) : [];
                                                        setDataInputEdit({
                                                            ...dataInputEdit,
                                                            role: val,
                                                            newRole: selectedRoleIds
                                                        })
                                                    }}
                                                    primaryColor={"red"}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center ">
                                <span className="mr-2 text-sm">User Status</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={dataInputEdit.user_status}
                                        onChange={handleUserStatusChange}
                                    // onChange={(e) => setDataInputEdit({ ...dataInputEdit, user_status: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>


                            {/* Reset Password */}
                            <div className="flex text-sm mt-4">            
                              Click
                                <div className="ml-1 hover:text-blue-400 text-sm cursor-pointer" onClick={() => {
                                    setModal({
                                        add: false,
                                        edit: false,
                                        reset: true
                                    })
                                }}>

                                 Here for Reset Password
                                </div>
                            </div>

                            {/* Switch for User Status */}



                        </div>
                    </>
                }
            />

            {/* modal reset password */}
            <ModalToResetPassword
                submitButtonName={''}
                headers={null}
                closeAllModal={() => { }}
                show={modal.reset}
                onClose={() => setModal({
                    add: false,
                    edit: true,
                    reset: false
                })
                }
                method="patch"
                title={'Reset Password'}
                url={`/settings/userResetPassword/${dataUserId.id}`}
                data={resetPassword}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div>
                            <div className="relative">
                                <div className="mb-2 text-center">
                                    <div className="container ">
                                        <InputLabel
                                            className=""
                                            htmlFor="password"
                                            value={`Are you sure for reseting password ${dataInputEdit.email} to be 'Phoenix123'?`}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                }
            />

            {/* body */}
            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md p-4">

                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addRolePopup(e)}
                        >
                            <span>Add User</span>
                        </div>

                    </div>

                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="role_name"
                            type="text"
                            name="role_name"
                            value={searchUser.name}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchRole({
                                    ...searchUser,
                                    name: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (searchUser.name !== "") {
                                        getUser();
                                        setSearchRole({
                                            ...searchUser,
                                            name: "",
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
                                        label={"Login User"}
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
                                        label={"Type"}
                                        colSpan={''}
                                        rowSpan={''}
                                    />

                                </tr>
                            </thead>

                            <tbody>
                                {dataUser?.data?.map(
                                    (dUser: any, i: number) => {
                                        return (
                                            <tr
                                                key={i}
                                                onDoubleClick={
                                                    () => {
                                                        setModal({
                                                            add: false,
                                                            edit: !modal.edit,
                                                            reset: false
                                                        });
                                                        getUserById(dUser.id);
                                                        getTypeTest()
                                                        getRole()
                                                        getEmployee()
                                                        getAllRelations()
                                                    }

                                                }
                                            >
                                                <TableTD
                                                    value={dataUser.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dUser?.user_login
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dUser?.name
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dUser?.type?.user_type_name
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
                            links={dataUser.links}
                            fromData={dataUser.from}
                            toData={dataUser.to}
                            totalData={dataUser.total}
                            clickHref={(url: string) =>
                                getUser(url.split("?").pop())
                            }
                        />
                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    )
}