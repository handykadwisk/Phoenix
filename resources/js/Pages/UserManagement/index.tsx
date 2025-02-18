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
import AGGrid from "@/Components/AgGrid";
import { Label } from "flowbite-react";
import { data } from "jquery";
import ModalToActions from "@/Components/Modal/ModalToActions";
import { ShowHideButton } from "@/Components/ShowHideButton";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
// import {} from 're'
export default function UserManagement({ auth, type }: any) {

    //type DataInput
    interface DataInputType {
        name: string,
        email: string,
        user_login: string,
        password: string,
        employee_id: number,
        individual_relations_id: number,
        company_division_id: number,
        company_id: number,
        type: any,
        jobpost: number,
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
        company_division_id: 0,
        company_id: 0,
        jobpost: 0,
        role: []

    })
    const [dataUserId, setDataUserId] = useState<any>([])
    const [dataUser, setDataUser] = useState<any>([]);
    const [searchUser, setSearchUser] = useState<any>({
        user_search: [
            {
                name: "",
                id: "",
                flag: 'flag'
            }
        ]
    });
    const [dataType, setDataType] = useState<any>([])
    const [dataRole, setDataRole] = useState<any>([])
    const [resetPassword, setResetPassword] = useState<any>({
        password: 'Phoenix123',
    })
    const [isLoading, setIsLoading] = useState(false);

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchUser.user_search];
        changeVal[i][name] = value;
        setSearchUser({ ...searchUser, user_search: changeVal });
    };

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
        company_division_id: 0,
        company_id: 0,
        jobpost: 0,
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

    //handlechangejobpost
    const handleJobpostChange = (selectedOption: any) => {
        setDataInput((prevState) => ({
            ...prevState,
            jobpost: selectedOption ? selectedOption.value : null // Jika tidak ada pilihan, set null
        }));
    };

    //handle change email
    const handleUserLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        // Update state
        if (dataInput.name === '' && dataInputEdit.name === '') {
            const user_login = e.target.value;

            let name;
            if (user_login.includes('@')) {
                // Jika mengandung '@', ambil bagian sebelum '@'
                name = user_login.split("@")[0];
            } else {
                // Jika tidak mengandung '@', gunakan full user_login sebagai name
                name = user_login;
            }
            setDataInput({ ...dataInput, name: name });
            setDataInputEdit({ ...dataInputEdit, user_login, name });

        } else {
            setDataInput({ ...dataInput, user_login: e.target.value });
            setDataInputEdit({ ...dataInputEdit, user_login: e.target.value });
        }
    };


    //get role
    const getRole = async () => {
        try {
            const result = await axios.post('/getAllRole');
            setDataRole(result.data);
        } catch (error) {
            // console.error('Fetch error:', error);
            throw error;
        }
    }

    const roleFor = dataRole?.map((role: Role) => {
        return {
            value: role.id,
            label: role.role_name
        };
    });

    //get type
    const getTypeTest = async () => {
        try {
            const result = await axios.post('/getType');
            setDataType(result.data);
        } catch (error) {
            // console.error('Fetch error:', error);
            throw error;
        }
    }

    //modal add
    const addRolePopup = async (e: FormEvent) => {
        getCompanies()
        getTypeTest()
        getDiv()
        getRole()
        getJobPost()
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
        } catch (error) {
            // console.error('Fetch error:', error);
            throw error;
        }
    }


    //relation data
    const [relation, setRelation] = useState<any>([]);
    const getAllRelations = async () => {
        try {
            const result = await axios.get('/getAllRelations');
            setRelation(result.data);
        } catch (error) {
            // console.error('Fetch error:', error);
            throw error;
        }
    }
    const relationSelect = relation.map((el: any) => {
        return {
            value: el.RELATION_ORGANIZATION_ID,
            label: el.RELATION_ORGANIZATION_NAME
        };
    })
    //end relation data

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


    const handleUserStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ubah nilai menjadi 1 (on) atau 0 (off) sesuai status switch
        const userStatus = e.target.checked ? 1 : 0;
        setDataInputEdit({ ...dataInputEdit, user_status: userStatus });
    };


    const handleDetailUser = async (e: any) => {
        try {
            const result = await axios.post(`/settings/getUserId/${e.id}`);
            // console.log('result.data', result.data);

            setDataUserId(result.data);

            // set
            setDataInputEdit({
                name: result.data.name,
                email: result.data.email,
                user_login: result.data.user_login,
                employee_id: result.data.employee_id,
                individual_relations_id: result.data.individual_relation_id,
                type: result.data.type,
                user_status: result.data.user_status,
                role: result.data.roles,
                company_id: result.data.company_id,
                jobpost: result.data.jobpost_id,
                company_division_id: result.data.company_division_id
            });
        } catch (error) {
            console.log(error);
        }
        getTypeTest()
        getRole()
        getEmployee()
        getCompanies()
        getAllRelations()
        getJobPost()
        getDiv()
        setModal({
            add: false,
            edit: !modal.edit,
            reset: false
        });
    }

    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccessUser = (message: string) => {
        setIsSuccess('')
        // getMenu()
        if (message !== '') {
            setIsSuccess(message[0])
            setTimeout(() => {
                setIsSuccess('')
            }, 5000)
        }
    }

    const clearSearchUser = async (e: FormEvent) => {
        // Kosongkan input pencarian
        inputDataSearch("name", "", 0);
        // Reset flag untuk menampilkan semua data
        inputDataSearch("flag", "", 0);
        setIsSuccess("Cleared");
    };

    //company

    const [company, setCompany] = useState<any>([])
    const getCompanies = async () => {
        try {
            const result = await axios.get('/getAllCompany')
            setCompany(result.data)
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }

    const companySelect = company.map((el: any) => {
        // console.log(el);
        return {
            value: el.COMPANY_ID,
            label: el.COMPANY_NAME
        }
    })
    //end company

    //division
    const [div, setDiv] = useState<any>([]);
    const getDiv = async () => {
        try {
            const result = await axios.get('/getAllDivisionCompany');
            setDiv(result.data);
        } catch (error) {
            // console.error('Fetch error:', error);
            throw error;
        }
    }

    const employeeDiv = employee.find((el: any) => dataInput.employee_id === el.EMPLOYEE_ID)?.division;

    const filterEmployeeDiv = div.filter((el: any) => el.COMPANY_ID === dataInput.company_id);
    const filterEmployeeDivEdit = div.filter((el: any) => el.COMPANY_ID === dataInputEdit.company_id);

    useEffect(() => {
        if (employeeDiv) {
            setDataInput((prevState) => ({
                ...prevState,
                company_division_id: employeeDiv.COMPANY_DIVISION_ID
            }));
        }
    }, [employeeDiv]);

    const divSelect = filterEmployeeDiv.map((el: any) => {
        return {
            value: el?.COMPANY_DIVISION_ID,
            label: el?.COMPANY_DIVISION_NAME
        }

    });

    const divSelectEdit = filterEmployeeDivEdit.map((el: any) => {
        return {
            value: el?.COMPANY_DIVISION_ID,
            label: el?.COMPANY_DIVISION_NAME
        }

    });
    //end division

    //employee data
    const filterEmployee = employee.filter((el: any) => el.COMPANY_ID === dataInput.company_id && el.EMPLOYEE_IS_DELETED === 0)
    const filterEmployeeEdit = employee.filter((el: any) => el.COMPANY_ID === dataInputEdit.company_id && el.EMPLOYEE_IS_DELETED === 0)

    const selectEmployee = filterEmployee
        .sort((a: any, b: any) => a.EMPLOYEE_FIRST_NAME.localeCompare(b.EMPLOYEE_FIRST_NAME))
        .map((el: any) => {
            return {
                value: el.EMPLOYEE_ID,
                label: el.EMPLOYEE_FIRST_NAME
            };
        });

    const selectEmployeeEdit = filterEmployeeEdit
        .sort((a: any, b: any) => a.EMPLOYEE_FIRST_NAME.localeCompare(b.EMPLOYEE_FIRST_NAME))
        .map((el: any) => {
            return {
                value: el.EMPLOYEE_ID,
                label: el.EMPLOYEE_FIRST_NAME
            };
        })
    //end employee data


    //jobpost data
    const [jobpost, setJobpost] = useState<any>([])
    const getJobPost = async () => {
        try {
            const res = await axios.get('/getAllJobpost')
            setJobpost(res.data)
        } catch (error) {
            // console.log(error);
            throw error;

        }
    }

    const filteredJobPosts = jobpost.filter((el: any) => el.company_division_id === dataInput.company_division_id);
    const filteredJobPostsEdit = jobpost.filter((el: any) => el.company_division_id === dataInputEdit.company_division_id);

    const jobpostSelect = filteredJobPosts.map((el: any) => {
        return {
            value: el.jobpost_id,
            label: el.jobpost_name
        };
    });

    const jobpostSelectEdit = filteredJobPostsEdit.map((el: any) => {
        return {
            value: el.jobpost_id,
            label: el.jobpost_name
        };
    });
    //end jobpost data

    const optionRelation = relation.map((el: any) => {
        return {
            value: el.RELATION_ORGANIZATION_ID,
            label: el.RELATION_ORGANIZATION_NAME
        }
    });

    //handleInputChange
    const handleInputChange = (field: string) => (event: any) => {
        setDataInput({
            ...dataInput,
            [field]: event ? (event.target ? event.target.value : event.value) : ''
        });
    };

    const handleInputChangeEdit = (field: string) => (event: any) => {
        setDataInputEdit({
            ...dataInputEdit,
            // [field]: event.target ? event.target.value : event.value
            [field]: event ? (event.target ? event.target.value : event.value) : ''

        });
    };

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    // console.clear();
    console.log('dataInput', dataInputEdit);


    return (
        <AuthenticatedLayout user={auth.user} header="User Management">

            <Head title="User Management" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* modal add */}
            <ModalToAction
                submitButtonName={"Submit"}
                headers={"Add User"}
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
                            company_division_id: 0,
                            company_id: 0,

                            individual_relations_id: 0,
                            type: 2,
                            jobpost: 0,
                            role: []

                        });
                    }
                }
                method="POST"
                title={'Add User'}
                url={'/settings/addUser'}
                data={dataInput}
                onSuccess={handleSuccessUser}
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
                                {/* Company */}
                                <div className="mb-2">
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="company"
                                            value={'Company'}
                                        />
                                        <div className="ml-[4.6rem] text-red-600">*</div>
                                    </div>
                                    <Select
                                        classNames={{
                                            menuButton: () =>
                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                            menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                }`,
                                        }}
                                        options={companySelect}
                                        isSearchable={true}
                                        isMultiple={false}
                                        placeholder={"Select Company"}
                                        isClearable={true}
                                        value={companySelect.find((emp: { value: any }) => emp.value === dataInput.company_id) || ""}
                                        onChange={handleInputChange('company_id')}
                                        primaryColor={"red"}
                                    />
                                </div>
                                {/* Company */}

                                {/* Employee */}
                                <div className="mb-2">
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="employee"
                                            value={'Employee'}
                                        />
                                        <div className="ml-[4.6rem] text-red-600">*</div>
                                    </div>
                                    <Select
                                        classNames={{
                                            menuButton: () =>
                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                            menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                }`,
                                        }}
                                        options={selectEmployee}
                                        isSearchable={true}
                                        isMultiple={false}
                                        placeholder={"Select Employee"}
                                        isClearable={true}
                                        value={selectEmployee.find((emp: { value: any }) => emp.value === dataInput.employee_id) || ''}
                                        onChange={handleInputChange('employee_id')}
                                        primaryColor={"red"}
                                    />
                                </div>
                                {/* Employee */}

                                {/* division  */}
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        htmlFor="type"
                                        value={'Division'}
                                    />
                                    <div className="ml-[3.8rem] text-red-600">*</div>
                                    <div className="mb-2">
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={divSelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Division"}
                                            isClearable={true}
                                            value={divSelect.find((div: { value: any }) => div.value === dataInput.company_division_id) || ''}
                                            onChange={
                                                handleInputChange('company_division_id')
                                            }
                                            primaryColor={"red"}
                                        />
                                    </div>
                                </div>
                                {/* end division  */}

                                {/* jobpost  */}
                                <div className="relative">
                                    <InputLabel
                                        className=""
                                        htmlFor="type"
                                        value={'Job Post'}
                                    />
                                    {/* <div className="ml-[4rem] text-red-600">*</div> */}
                                    <div className="mb-2">
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={jobpostSelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Jobpost"}
                                            isClearable={true}
                                            value={jobpostSelect.find((jobpost: { value: any }) => jobpost.value === dataInput.jobpost) || ''}
                                            onChange={handleJobpostChange}
                                            primaryColor={"red"}
                                        />
                                    </div>
                                </div>
                                {/* end jobpost  */}

                                {/* role  */}
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
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={roleFor}
                                            isSearchable={true}
                                            isMultiple={true}
                                            placeholder={"Select Role"}
                                            isClearable={true}
                                            // value={dataInput.role.map(id => roleFor.find((role: { value: any }) => role.value === id)) || null}
                                            value={
                                                dataInput.role.length > 0
                                                    ? dataInput.role.map((id: any) =>
                                                        roleFor.find((role: { value: any }) => role.value === id))
                                                    : null // Set to null if no roles selected
                                            }
                                            onChange={handleRoleChange}
                                            primaryColor={"red"}

                                        />
                                    </div>
                                </div>
                                {/* end role  */}


                            </>
                        )}

                        {/* jika type nya 3 maka tampilkan company */}
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
                                    <Select
                                        classNames={{
                                            menuButton: () =>
                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                            menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                }`,
                                        }}
                                        options={optionRelation}
                                        isSearchable={true}
                                        isMultiple={false}
                                        placeholder={"Select"}
                                        isClearable={true}
                                        value={optionRelation.find((emp: { value: any }) => emp.value === dataInput.individual_relations_id) || ""}
                                        onChange={handleInputChange('individual_relations_id')}
                                        primaryColor={"red"}
                                    />
                                </div>
                                {/* company */}
                            </>
                        )}
                        {/* end company */}
                        {
                            dataInput.type === 4 && (
                                <>
                                    {/* name */}
                                    <div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className="absolute"
                                                value={'Name'}
                                            />
                                            <div className="ml-[2.8rem] text-red-600">*</div>
                                        </div>
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={dataInput.name}
                                            className="mt-2"
                                            onChange={
                                                (e) => setDataInput({
                                                    ...dataInput, name: e.target.value,
                                                })}
                                            required
                                            autoComplete="off"
                                            placeholder="Name"
                                        />
                                    </div>
                                    {/* end name  */}

                                    {/* Company */}
                                    < div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className=""
                                                htmlFor="company"
                                                value={'Company'}
                                            />
                                            {/* <div className="ml-[4.6rem] text-red-600">*</div> */}
                                        </div>
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={companySelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Company"}
                                            isClearable={true}
                                            value={companySelect.find((emp: { value: any }) => emp.value === dataInput.company_id) || ""}
                                            onChange={handleInputChange('company_id')}
                                            primaryColor={"red"}
                                        />
                                    </div>
                                    {/* Company */}

                                    {/* role  */}
                                    <div className="relative">
                                        <InputLabel
                                            className=""
                                            htmlFor="type"
                                            value={'Role'}
                                        />
                                        {/* <div className="ml-[2.3rem] text-red-600">*</div> */}
                                        <div className="mb-2">
                                            <Select
                                                classNames={{
                                                    menuButton: () =>
                                                        `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                    listItem: ({ isSelected }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                        }`,
                                                }}
                                                options={roleFor}
                                                isSearchable={true}
                                                isMultiple={true}
                                                placeholder={"Select Role"}
                                                isClearable={true}
                                                // value={dataInput.role.map(id => roleFor.find((role: { value: any }) => role.value === id)) || null}
                                                value={
                                                    dataInput.role.length > 0
                                                        ? dataInput.role.map((id: any) =>
                                                            roleFor.find((role: { value: any }) => role.value === id))
                                                        : null // Set to null if no roles selected
                                                }
                                                onChange={handleRoleChange}
                                                primaryColor={"red"}

                                            />
                                        </div>
                                    </div>
                                    {/* end role  */}
                                </>
                            )
                        }
                        {/* user_login */}
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
                                    })}
                                required
                                autoComplete="off"
                                placeholder="Email or Other unique id"
                            />
                        </div>
                        {/* end user_login  */}

                        {/* password */}
                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="password"
                                    value={'User Password'}
                                />
                                <div className="ml-[6.8rem] text-red-600">*</div>
                            </div>
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={dataInput.password}
                                    className="mt-2"
                                    onChange={(e) => setDataInput({ ...dataInput, password: e.target.value })}
                                    required
                                    placeholder="Password"
                                    autoComplete="off"
                                />
                                <ShowHideButton
                                    showPassword={showPassword}
                                    toggleShowPassword={toggleShowPassword}
                                />
                            </div>
                        </div>
                        {/* end password */}
                    </>
                }
            />

            {/* modal Edit */}
            <ModalToAction
                headers={null}
                submitButtonName={"Submit"}
                show={modal.edit}
                onClose={() => {
                    setModal({
                        add: false,
                        edit: false,
                        reset: false
                    });

                    setDataInputEdit({
                        name: "",
                        email: "",
                        user_login: "",
                        password: "",
                        employee_id: 0,
                        individual_relations_id: 0,
                        type: 2,
                        user_status: 0,
                        company_division_id: 0,
                        company_id: 0,
                        jobpost: 0,
                        role: [],
                        newRole: null

                    });
                }}
                method="patch"
                title={'Edit User'}
                url={`/settings/userEdit/${dataUserId.id}`}
                data={dataInputEdit}
                onSuccess={handleSuccessUser}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                body={
                    <>
                        <div>
                            {/* user_login */}
                            <div className="relative">
                                <div className="mb-2">
                                    <div className="container">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="name"
                                            value={'Name'}
                                        />
                                        <div className="ml-[3rem] text-red-600">*</div>
                                    </div>
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={dataInputEdit?.name || ''}
                                        className="mt-2"
                                        onChange={(e) => setDataInputEdit({ ...dataInputEdit, name: e.target.value })}
                                        required
                                        autoComplete="off"
                                        placeholder="Name or unique id"
                                    />
                                </div>
                            </div>
                            {/* end user_login */}

                            {/* type */}
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
                                        value={dataInputEdit?.type?.user_type_id || dataInputEdit?.type || ''}
                                        onChange={(e) => {
                                            const selectedType = Number(e.target.value);
                                            setDataInputEdit({
                                                ...dataInputEdit,
                                                type: selectedType,
                                                role: selectedType !== 2 ? [] : dataInputEdit.newRole,
                                            });
                                        }}
                                    >
                                        <option value="" disabled>
                                            -- Select Type --
                                        </option>
                                        {dataType?.map((mType: any, i: number) => (
                                            <option value={mType.user_type_id} key={i}>
                                                {mType.user_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* type */}

                            {(dataInputEdit?.type === 2 || dataInputEdit?.type?.user_type_id === 2) && (
                                <>
                                    {/* Company */}
                                    < div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className="absolute"
                                                htmlFor="Company"
                                                value={'Company'}
                                            />
                                            <div className="ml-[4.6rem] text-red-600">*</div>
                                        </div>
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={companySelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Company"}
                                            isClearable={true}
                                            value={companySelect.find((emp: { value: any }) => emp.value === dataInputEdit.company_id) || ''}
                                            onChange={(val: any) => {
                                                setDataInputEdit({
                                                    ...dataInputEdit,
                                                    company_id: val ? val.value : null
                                                });
                                            }}
                                            primaryColor={"red"}
                                        />
                                    </div>
                                    {/* Company */}

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
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={selectEmployeeEdit}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Employee"}
                                            isClearable={true}
                                            value={selectEmployeeEdit.find((emp: { value: any }) => emp.value === dataInputEdit.employee_id) || ''}
                                            onChange={handleInputChangeEdit('employee_id')}
                                            primaryColor={"red"}
                                        />
                                    </div>
                                    {/* Employee */}

                                    {/* Role */}
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
                                                        menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                                ? `text-white bg-red-500`
                                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                            }`,
                                                    }}
                                                    options={roleFor}
                                                    isSearchable={true}
                                                    isMultiple={true}
                                                    placeholder={"Select"}
                                                    isClearable={true}
                                                    // value={dataInputEdit?.role?.map(id => roleFor.find(role => role.value === id))}
                                                    value={getDataRoleSelect(dataInputEdit.role)|| dataInputEdit.role}
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
                                    {/* end Role */}

                                    {/* division  */}
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="type"
                                            value={'Division'}
                                        />
                                        <div className="ml-[3.8rem] text-red-600">*</div>
                                        <div className="mb-2">
                                            <Select
                                                classNames={{
                                                    menuButton: () =>
                                                        `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                    listItem: ({ isSelected }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                        }`,
                                                }}
                                                options={divSelectEdit}
                                                isSearchable={true}
                                                isMultiple={false}
                                                placeholder={"Select Division"}
                                                isClearable={true}
                                                value={divSelectEdit.find((div: { value: any }) => div.value === dataInputEdit.company_division_id) || null}
                                                onChange={(val: any) => {
                                                    setDataInputEdit({
                                                        ...dataInputEdit,
                                                        company_division_id: val ? val.value : null
                                                    });
                                                }}
                                                primaryColor={"red"}
                                            />
                                        </div>
                                    </div>
                                    {/* end division  */}

                                    {/* jobpost  */}
                                    <div className="relative">
                                        <InputLabel
                                            className=""
                                            htmlFor="type"
                                            value={'Job Post'}
                                        />
                                        {/* <div className="ml-[4rem] text-red-600">*</div> */}
                                        <div className="mb-2">
                                            <Select
                                                classNames={{
                                                    menuButton: () =>
                                                        `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                    listItem: ({ isSelected }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                        }`,
                                                }}
                                                options={jobpostSelectEdit}
                                                isSearchable={true}
                                                isMultiple={false}
                                                placeholder={"Select Jobpost"}
                                                isClearable={true}
                                                value={jobpostSelectEdit.find((jobpost: { value: any }) => jobpost.value === dataInputEdit.jobpost) || null}
                                                // onChange={handleJobpostChange}
                                                onChange={(val: any) => {
                                                    setDataInputEdit({
                                                        ...dataInputEdit,
                                                        jobpost: val ? val.value : null
                                                    });
                                                }}
                                                primaryColor={"red"}
                                            />
                                        </div>
                                    </div>
                                    {/* end jobpost  */}

                                </>
                            )}
                            {(dataInputEdit?.type === 4 || dataInputEdit?.type?.user_type_id === 4) && (
                                <>
                                    {/* Company */}
                                    <div className="mb-2">
                                        <div className="relative">
                                            <InputLabel
                                                className=""
                                                htmlFor="Company"
                                                value={'Company'}
                                            />
                                        </div>
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={companySelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Company"}
                                            isClearable={true}
                                            value={companySelect.find((emp: { value: any }) => emp.value === dataInputEdit.company_id) || ''}
                                            onChange={handleInputChangeEdit('company_id')}
                                            primaryColor={"red"}
                                        />
                                    </div>
                                    {/* Company */}

                                    {/* Role */}
                                    <div className="relative">
                                        <div className="mb-2">
                                            <InputLabel
                                                className=""
                                                htmlFor=""
                                                value={'Role'}
                                            />
                                            <div className="mb-2">
                                                <Select
                                                    classNames={{
                                                        menuButton: () =>
                                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                        menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                                ? `text-white bg-red-500`
                                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                            }`,
                                                    }}
                                                    options={roleFor}
                                                    isSearchable={true}
                                                    isMultiple={true}
                                                    placeholder={"Select"}
                                                    isClearable={true}
                                                    // value={dataInputEdit?.role?.map(id => roleFor.find(role => role.value === id))}
                                                    value={getDataRoleSelect(dataInputEdit.role) || ''}
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
                                    {/* end Role */}
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
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            options={relationSelect}
                                            isSearchable={true}
                                            isMultiple={false}
                                            placeholder={"Select Relation Organization"}
                                            isClearable={true}
                                            value={relationSelect.find((emp: { value: any }) => emp.value === dataInputEdit.individual_relations_id) || null}
                                            onChange={
                                                (val: any) => {
                                                    setDataInputEdit({
                                                        ...dataInputEdit,
                                                        individual_relations_id: val.value
                                                    });
                                                }
                                            }
                                            primaryColor={"red"}
                                        />
                                    </div>
                                    {/* company */}
                                </>
                            )}

                            {/* user_login */}
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
                                        autoComplete="off"
                                        placeholder="user login or unique id"
                                    />
                                </div>
                            </div>
                            {/* end user_login */}

                            {/* isActive user */}
                            <div className="flex items-center mt-4 ">
                                <span className="mr-2 text-sm">Is Active</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={dataInputEdit.user_status}
                                        onChange={handleUserStatusChange}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-red-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            {/* end isActive user */}



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
                onSuccess={handleSuccessUser}
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

                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            type="text"
                            className="mt-2 ring-1 ring-red-600"

                            value={searchUser.user_search[0].name}

                            onChange={(e) => {
                                inputDataSearch("name", e.target.value, 0)
                            }
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const title = searchUser.user_search[0].name;
                                    const id = searchUser.user_search[0].id;
                                    if (title || id) {
                                        inputDataSearch("flag", title || id, 0);
                                        setIsSuccess("success");
                                        setTimeout(() => {
                                            setIsSuccess("");
                                        })
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                        setIsSuccess("Get All Job Post");
                                    }
                                }
                            }}
                            placeholder="Search User Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchUser.user_search[0]
                                            .id === "" &&
                                        searchUser.user_search[0]
                                            .name === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess("Search");
                                }
                                }
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => clearSearchUser(e)}

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
                            withParam={''}
                            searchParam={searchUser.user_search}
                            // loading={isLoading.get_policy}
                            url={"getUser"}
                            doubleClickEvent={handleDetailUser}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 3,
                                    sortable: false, // Tidak perlu sorting di sini karena akan selalu dihitung ulang
                                    filter: false, // Tidak perlu filter di sini karena hanya berisi nomor urut
                                },
                                {
                                    headerName: "User Login",
                                    field: "user_login",
                                    flex: 7,

                                },
                                {
                                    headerName: "Name",
                                    field: "name",
                                    flex: 7,

                                },
                                {
                                    headerName: "Company",
                                    field: 'company_id',
                                    flex: 7,
                                    valueGetter: (params: any) => {
                                        return params.data?.company?.COMPANY_NAME || 'No Company';
                                    },

                                },

                                {
                                    headerName: "User Status",
                                    field: 'user_status',
                                    valueGetter: (params: any) => {
                                        return params.data?.user_status === 1 ? 'Active' : 'Inactive';
                                    },
                                    flex: 3,
                                    cellStyle: (params: any) => {
                                        return {
                                            color: params.data?.user_status === 1 ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        };
                                    }

                                },

                            ]}
                        />
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}