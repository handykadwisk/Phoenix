import AGGrid from "@/Components/AgGrid";
import InputLabel from "@/Components/InputLabel";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextInput from "@/Components/TextInput";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectTailwind from "react-tailwindcss-select";
import { useForm } from "@inertiajs/react";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailEmployee from "./DetailEmployee";

export default function Employee({
    idCompany,
    setIsSuccess,
    isSuccess,
}: PropsWithChildren<{
    idCompany: any;
    setIsSuccess: any | string | null;
    isSuccess: any | string | null;
}>) {
    const [refreshGrid, setRefreshGrid] = useState<any>("");
    // modal for add employee
    const [modalEmployee, setModalEmployee] = useState<any>({
        add: false,
        view: false,
    });

    // handle click add employee
    const handleAddModel = async (e: FormEvent) => {
        e.preventDefault();
        getPersonRelationship();
        getPersonRelationshipFamily();
        getStructure(idCompany);
        getDivision(idCompany);
        getOffice(idCompany);
        setModalEmployee({
            add: !modalEmployee.add,
            view: false,
        });
    };

    const [structure, setStructure] = useState<any>([]);
    // get Structure
    const getStructure = async (idCompany: any) => {
        await axios
            .post(`/getStructureCompany`, { idCompany })
            .then((res) => {
                setStructure(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [division, setDivision] = useState<any>([]);
    // get Structure
    const getDivision = async (idCompany: any) => {
        await axios
            .post(`/getComboDivision`, { idCompany })
            .then((res) => {
                setDivision(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [office, setOffice] = useState<any>([]);
    // get Structure
    const getOffice = async (idCompany: any) => {
        await axios
            .post(`/getComboOffice`, { idCompany })
            .then((res) => {
                setOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const { data, setData } = useForm<any>({
        EMPLOYEE_FIRST_NAME: "",
        EMPLOYEE_GENDER: "",
        EMPLOYEE_BIRTH_PLACE: "",
        EMPLOYEE_BIRTH_DATE: "",
        EMPLOYEE_KTP: "",
        EMPLOYEE_NPWP: "",
        EMPLOYEE_KK: "",
        EMPLOYEE_BLOOD_TYPE: "",
        EMPLOYEE_BLOOD_RHESUS: "",
        EMPLOYEE_MARITAL_STATUS: "",
        STRUCTURE_ID: "",
        DIVISION_ID: "",
        OFFICE_ID: "",
        COMPANY_ID: idCompany,
        employee_contact: [],
        emergency_contact: [],
        family_member: [],
    });

    const structureSelect = structure?.map((query: any) => {
        return {
            value: query.COMPANY_STRUCTURE_ID,
            label: query.text_combo,
        };
    });

    const divisionSelect = division?.map((query: any) => {
        return {
            value: query.COMPANY_DIVISION_ID,
            label: query.text_combo,
        };
    });

    const officeSelect = office?.map((query: any) => {
        return {
            value: query.COMPANY_OFFICE_ID,
            label: query.text_combo,
        };
    });

    // state for relationship
    const [dataRelationship, setDataRelationship] = useState<any>([]);
    const [dataRelationshipFamily, setDataRelationshipFamily] = useState<any>(
        []
    );
    const getPersonRelationship = async () => {
        await axios
            .get(`/getPersonRelationship`)
            .then((res) => {
                setDataRelationship(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getPersonRelationshipFamily = async () => {
        await axios
            .get(`/getPersonRelationshipFamily`)
            .then((res) => {
                setDataRelationshipFamily(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addRowEmployeeContact = (e: FormEvent) => {
        e.preventDefault();
        setData("employee_contact", [
            ...data.employee_contact,
            {
                EMPLOYEE_PHONE_NUMBER: "",
                EMPLOYEE_EMAIL: "",
            },
        ]);
    };

    const addRowEmergencyContact = (e: FormEvent) => {
        e.preventDefault();
        setData("emergency_contact", [
            ...data.emergency_contact,
            {
                NAME_CONTACT_EMERGENCY: "",
                PHONE_CONTACT_EMERGENCY: "",
                PERSON_RELATIONSHIP: "",
            },
        ]);
    };

    const addRowFamilyMember = (e: FormEvent) => {
        e.preventDefault();
        setData("family_member", [
            ...data.family_member,
            {
                NAME_FAMILY_MEMBER: "",
                FAMILY_MEMBER: "",
            },
        ]);
    };

    const inputDataEmployeeContact = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.employee_contact];
        changeVal[i][name] = value;
        setData({ ...data, employee_contact: changeVal });
    };

    const inputContactEmergency = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.emergency_contact];
        changeVal[i][name] = value;
        setData({ ...data, emergency_contact: changeVal });
    };

    const inputFamilyMember = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.family_member];
        changeVal[i][name] = value;
        setData({ ...data, family_member: changeVal });
    };

    const handleSuccessAddEmployee = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[1]);
            setData({
                EMPLOYEE_FIRST_NAME: "",
                EMPLOYEE_GENDER: "",
                EMPLOYEE_BIRTH_PLACE: "",
                EMPLOYEE_BIRTH_DATE: "",
                EMPLOYEE_KTP: "",
                EMPLOYEE_NPWP: "",
                EMPLOYEE_KK: "",
                EMPLOYEE_BLOOD_TYPE: "",
                EMPLOYEE_BLOOD_RHESUS: "",
                EMPLOYEE_MARITAL_STATUS: "",
                STRUCTURE_ID: "",
                DIVISION_ID: "",
                OFFICE_ID: "",
                COMPANY_ID: idCompany,
                employee_contact: [],
                emergency_contact: [],
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
            setRefreshGrid("success");
            setTimeout(() => {
                setRefreshGrid("");
            }, 1000);
        }
    };

    const [dataEmployee, setDataEmployee] = useState<any>({
        EMPLOYEE_ID: "",
    });
    const handleClickDetailEmployee = async (data: any) => {
        setDataEmployee({
            EMPLOYEE_ID: data.EMPLOYEE_ID,
        });
        getPersonRelationship();
        getPersonRelationshipFamily();
        getStructure(idCompany);
        getDivision(idCompany);
        getOffice(idCompany);
        setModalEmployee({
            add: false,
            view: !modalEmployee.view,
        });
    };

    const [searchEmployee, setSearchEmployee] = useState<any>({
        company_employee: [
            {
                EMPLOYEE_FIRST_NAME: "",
                EMPLOYEE_ID: "",
                flag: "",
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchEmployee.company_employee];
        changeVal[i][name] = value;

        setSearchEmployee({ ...searchEmployee, company_employee: changeVal });
    };

    // search
    const clearSearchEmployee = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("EMPLOYEE_FIRST_NAME", "", 0);
        inputDataSearch("flag", "", 0);
        setRefreshGrid("success");
        setTimeout(() => {
            setRefreshGrid("");
        }, 1000);
    };

    return (
        <>
            {/* modal add employee */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEmployee.add}
                onClose={() =>
                    setModalEmployee({
                        add: false,
                        view: false,
                    })
                }
                title={"Add Employee"}
                url={`/addEmployee`}
                data={data}
                onSuccess={handleSuccessAddEmployee}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div className="mb-2">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    value={"Employee Name"}
                                />
                                <div className="ml-[7.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.EMPLOYEE_FIRST_NAME}
                                    className="mt-1"
                                    onChange={(e) => {
                                        setData(
                                            "EMPLOYEE_FIRST_NAME",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Employee Name"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="">
                                    <InputLabel className="" value={"Gender"} />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_GENDER}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_GENDER",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Gender --
                                        </option>
                                        <option value={"m"}>Male</option>
                                        <option value={"f"}>Female</option>
                                    </select>
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Place Of Birth"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.EMPLOYEE_BIRTH_PLACE}
                                        className="mt-2"
                                        onChange={(e) =>
                                            setData(
                                                "EMPLOYEE_BIRTH_PLACE",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Place Of Birth"
                                    />
                                </div>
                                <div className="grid grid-cols-1">
                                    <InputLabel
                                        className=""
                                        value={"Date Of Birth"}
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
                                            <svg
                                                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                            </svg>
                                        </div>
                                        <DatePicker
                                            value={data.EMPLOYEE_BIRTH_DATE}
                                            onChange={(date: any) =>
                                                setData(
                                                    "EMPLOYEE_BIRTH_DATE",
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    )
                                                )
                                            }
                                            className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd - mm - yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person KTP"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.EMPLOYEE_KTP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_KTP",
                                                e.target.value
                                            );
                                        }}
                                        placeholder="Person KTP"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person NPWP"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.EMPLOYEE_NPWP}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_NPWP",
                                                e.target.value
                                            );
                                        }}
                                        placeholder="Person NPWP"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Person KK"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.EMPLOYEE_KK}
                                        className="mt-2"
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_KK",
                                                e.target.value
                                            );
                                        }}
                                        placeholder="Person KK"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-3 mt-4">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BLOOD_TYPE"
                                        value={"Blood Type "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_BLOOD_TYPE}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_BLOOD_TYPE",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option>-- Blood Type --</option>
                                        <option value={"1"}>A</option>
                                        <option value={"2"}>B</option>
                                        <option value={"3"}>AB</option>
                                        <option value={"4"}>O</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_BLOOD_RHESUS"
                                        value={"Blood Rhesus "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_BLOOD_RHESUS}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_BLOOD_RHESUS",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option>-- Blood Rhesus --</option>
                                        <option value={"1"}>Positive</option>
                                        <option value={"2"}>Negative</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="PERSON_MARTIAL_STATUS"
                                        value={"Marital Status "}
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.EMPLOYEE_MARITAL_STATUS}
                                        onChange={(e) => {
                                            setData(
                                                "EMPLOYEE_MARITAL_STATUS",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option>-- Marital Status --</option>
                                        <option value={"1"}>Single</option>
                                        <option value={"2"}>Married</option>
                                        <option value={"3"}>Divorced</option>
                                        <option value={"4"}>Widowed</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold mt-2">
                                    <span>Structure & Division</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="">
                                        {/* <InputLabel className="" value={"Structure"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={structureSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Structure--"}
                                            value={data.STRUCTURE_ID}
                                            // onChange={(e) =>
                                            //     inputDataBank(
                                            //         "BANK_ID",
                                            //         e.target.value,
                                            //         i
                                            //     )
                                            // }
                                            onChange={(val: any) => {
                                                setData("STRUCTURE_ID", val);
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                    <div className="">
                                        {/* <InputLabel className="" value={"Division"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={divisionSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Division--"}
                                            value={data.DIVISION_ID}
                                            // onChange={(e) =>
                                            //     inputDataBank(
                                            //         "BANK_ID",
                                            //         e.target.value,
                                            //         i
                                            //     )
                                            // }
                                            onChange={(val: any) => {
                                                setData("DIVISION_ID", val);
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                    <div className="">
                                        {/* <InputLabel className="" value={"Office"} /> */}
                                        <SelectTailwind
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({
                                                    isSelected,
                                                }: any) =>
                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                        isSelected
                                                            ? `text-white bg-red-500`
                                                            : `text-gray-500 hover:bg-red-500 hover:text-white`
                                                    }`,
                                            }}
                                            options={officeSelect}
                                            isSearchable={true}
                                            placeholder={"--Select Office--"}
                                            value={data.OFFICE_ID}
                                            // onChange={(e) =>
                                            //     inputDataBank(
                                            //         "BANK_ID",
                                            //         e.target.value,
                                            //         i
                                            //     )
                                            // }
                                            onChange={(val: any) => {
                                                setData("OFFICE_ID", val);
                                            }}
                                            primaryColor={"bg-red-500"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-slate-900-700"
                                                colSpan={3}
                                            >
                                                <span>Family Member</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.family_member?.length !== 0 ? (
                                            <>
                                                {data.family_member?.map(
                                                    (cm: any, i: number) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="py-3 px-2">
                                                                    <span className="text-sm">
                                                                        Family
                                                                        Member{" "}
                                                                        {/* {i + 1} */}
                                                                    </span>
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.NAME_FAMILY_MEMBER
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputFamilyMember(
                                                                                "NAME_FAMILY_MEMBER",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Name *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <select
                                                                        className="mt-7 rounded-md border-0 py-1.5 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 w-full"
                                                                        value={
                                                                            cm.FAMILY_MEMBER
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputFamilyMember(
                                                                                "FAMILY_MEMBER",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        // required
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Family
                                                                            Member
                                                                            --
                                                                        </option>
                                                                        {dataRelationshipFamily?.map(
                                                                            (
                                                                                getPersonRelation: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="w-1">
                                                                    <XMarkIcon
                                                                        className="w-7 mt-7 text-red-600 hover:cursor-pointer"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                data.family_member.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
                                                                                    family_member:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : null}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer"
                                                    onClick={(e) =>
                                                        addRowFamilyMember(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Family Member
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4">
                                <table className="w-full table-auto border border-slate-300 overflow-x-auto rounded-xl">
                                    <thead className="border-slate-300 bg-slate-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-slate-900-700"
                                                colSpan={3}
                                            >
                                                <span>Employee Contact</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.employee_contact?.map(
                                            (
                                                dataEmployeeContact: any,
                                                i: number
                                            ) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className="px-2 py-2 text-xs text-red-500 mb-2">
                                                            <TextInput
                                                                type="text"
                                                                value={
                                                                    dataEmployeeContact.EMPLOYEE_PHONE_NUMBER
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataEmployeeContact(
                                                                        "EMPLOYEE_PHONE_NUMBER",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Employee Number"
                                                            />
                                                        </td>
                                                        <td>
                                                            <TextInput
                                                                type="email"
                                                                value={
                                                                    dataEmployeeContact.EMPLOYEE_EMAIL
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataEmployeeContact(
                                                                        "EMPLOYEE_EMAIL",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                required
                                                                placeholder="Email"
                                                            />
                                                        </td>
                                                        <td className="">
                                                            <XMarkIcon
                                                                className="w-6 mt-2 text-red-600 hover:cursor-pointer"
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        data.employee_contact.filter(
                                                                            (
                                                                                data: any,
                                                                                a: number
                                                                            ) =>
                                                                                a !==
                                                                                i
                                                                        );
                                                                    setData({
                                                                        ...data,
                                                                        employee_contact:
                                                                            updatedData,
                                                                    });
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer text-gray-500 hover:text-red-500"
                                                    onClick={(e) =>
                                                        addRowEmployeeContact(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Employee Contact
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2">
                                <table className="w-full table-auto border border-red-500 overflow-x-auto rounded-xl">
                                    <thead className="border-red-500 bg-red-300">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-sm">
                                            <th
                                                className="py-2 px-2 text-red-700"
                                                colSpan={4}
                                            >
                                                Emergency Contact
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.emergency_contact?.length !==
                                        0 ? (
                                            <>
                                                {data.emergency_contact?.map(
                                                    (cm: any, i: number) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td className="py-3 px-2">
                                                                    <span className="text-sm">
                                                                        Emergency
                                                                        Contact{" "}
                                                                        {/* {i + 1} */}
                                                                    </span>
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.NAME_CONTACT_EMERGENCY
                                                                        }
                                                                        className="mt-1"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "NAME_CONTACT_EMERGENCY",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Name *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <TextInput
                                                                        type="text"
                                                                        value={
                                                                            cm.PHONE_CONTACT_EMERGENCY
                                                                        }
                                                                        className="mt-7"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PHONE_CONTACT_EMERGENCY",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        required
                                                                        placeholder="Phone Number *"
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <select
                                                                        className="mt-7 rounded-md border-0 py-1.5 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 w-full"
                                                                        value={
                                                                            cm.PERSON_RELATIONSHIP
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            inputContactEmergency(
                                                                                "PERSON_RELATIONSHIP",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                i
                                                                            )
                                                                        }
                                                                        // required
                                                                    >
                                                                        <option
                                                                            value={
                                                                                ""
                                                                            }
                                                                        >
                                                                            --
                                                                            Employee
                                                                            Relationship
                                                                            --
                                                                        </option>
                                                                        {dataRelationship.map(
                                                                            (
                                                                                getPersonRelation: any,
                                                                                i: number
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        value={
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_ID
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            getPersonRelation.PERSON_RELATIONSHIP_NAME
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td className="w-1">
                                                                    <XMarkIcon
                                                                        className="w-7 mt-7 text-red-600 hover:cursor-pointer"
                                                                        onClick={() => {
                                                                            const updatedData =
                                                                                data.emergency_contact.filter(
                                                                                    (
                                                                                        data: any,
                                                                                        a: number
                                                                                    ) =>
                                                                                        a !==
                                                                                        i
                                                                                );
                                                                            setData(
                                                                                {
                                                                                    ...data,
                                                                                    emergency_contact:
                                                                                        updatedData,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : null}
                                        <tr>
                                            <td>
                                                <a
                                                    className="px-2 py-2 text-xs cursor-pointer text-red-500"
                                                    onClick={(e) =>
                                                        addRowEmergencyContact(
                                                            e
                                                        )
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font">
                                                        + Add Emergency Contact
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            />
            {/* end Modal add Employee */}

            {/* Detail Employee */}
            <ModalToAction
                show={modalEmployee.view}
                onClose={() => {
                    setModalEmployee({
                        add: false,
                        view: false,
                    });
                }}
                title={"Detail Employee"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={undefined}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailEmployee
                            idEmployee={dataEmployee.EMPLOYEE_ID}
                            division={division}
                            structure={structure}
                            office={office}
                            dataRelationship={dataRelationship}
                            dataRelationshipFamily={dataRelationshipFamily}
                            setIsSuccess={setIsSuccess}
                        />
                    </>
                }
            />
            {/* End Detail Employee */}

            <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => handleAddModel(e)}
                        >
                            <span>Add Employee</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="PERSON_FIRST_NAME"
                            type="text"
                            name="PERSON_FIRST_NAME"
                            value={
                                searchEmployee.company_employee[0]
                                    .EMPLOYEE_FIRST_NAME === ""
                                    ? ""
                                    : searchEmployee.company_employee[0]
                                          .EMPLOYEE_FIRST_NAME
                            }
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch(
                                    "EMPLOYEE_FIRST_NAME",
                                    e.target.value,
                                    0
                                );
                                if (
                                    searchEmployee.company_employee[0]
                                        .EMPLOYEE_FIRST_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchEmployee.company_employee[0]
                                            .EMPLOYEE_FIRST_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setRefreshGrid("success");
                                    setTimeout(() => {
                                        setRefreshGrid("");
                                    }, 1000);
                                }
                            }}
                            placeholder="Search Employee Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchEmployee.company_employee[0]
                                            .EMPLOYEE_FIRST_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setRefreshGrid("success");
                                    setTimeout(() => {
                                        setRefreshGrid("");
                                    }, 1000);
                                }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => clearSearchEmployee(e)}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-employee rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={idCompany}
                            searchParam={searchEmployee.company_employee}
                            // loading={isLoading.get_policy}
                            url={"getEmployee"}
                            doubleClickEvent={handleClickDetailEmployee}
                            triggeringRefreshData={refreshGrid}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Employee Name",
                                    field: "EMPLOYEE_FIRST_NAME",
                                    flex: 7,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
