import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import axios from "axios";
import {
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    CreditCardIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";
import SelectTailwind from "react-tailwindcss-select";

export default function ModalAddEmployee({
    show,
    modal,
    dataAddress,
    setDataAddress,
    wilayahSelect,
    checkDomAddress,
    setCheckDomAddress,
    addressStatus,
    idEmployee,
    handleSuccessAddAddress,
}: PropsWithChildren<{
    show: any;
    modal: any;
    dataAddress: any;
    setDataAddress: any;
    wilayahSelect: any;
    checkDomAddress: any;
    setCheckDomAddress: any;
    addressStatus: any;
    idEmployee: any;
    handleSuccessAddAddress: any;
}>) {
    const [regency, setRegency] = useState<any>([]);
    const [district, setDistrict] = useState<any>([]);
    const [village, setVillage] = useState<any>([]);

    const handleCheckbox = (e: any) => {
        const { value, checked } = e.target;

        if (!checked) {
            setCheckDomAddress({
                ...checkDomAddress,
                domAddress: "3",
            });
            setDataAddress({
                ...dataAddress,
                address_domicile: [
                    ...dataAddress.address_domicile,
                    {
                        idEmployee: idEmployee,
                        ADDRESS_CATEGORY: "",
                        ADDRESS_LOCATION_TYPE: 2,
                        ADDRESS_DETAIL: "",
                        ADDRESS_RT_NUMBER: "",
                        ADDRESS_RW_NUMBER: "",
                        ADDRESS_VILLAGE: "",
                        ADDRESS_DISTRICT: "",
                        ADDRESS_PROVINCE: "",
                        ADDRESS_REGENCY: "",
                        ADDRESS_STATUS: "",
                    },
                ],
            });
        } else {
            setCheckDomAddress({
                ...checkDomAddress,
                domAddress: "",
            });
            const updatedData = dataAddress.address_domicile.filter(
                (data: any, a: number) => a !== 0
            );
            setDataAddress({
                ...dataAddress,
                address_domicile: updatedData,
            });
        }
    };

    const getRegency = async (id: any) => {
        const valueKode = id.value;
        await axios
            .post(`/get_regency`, { valueKode })
            .then((res) => {
                setRegency(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDistrict = async (id: any) => {
        const valueKode = id.value;
        await axios
            .post(`/getDistrict`, { valueKode })
            .then((res) => {
                setDistrict(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getVillage = async (id: any) => {
        const valueKode = id.value;
        await axios
            .post(`/getVillage`, { valueKode })
            .then((res) => {
                setVillage(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const regencySelect = regency?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const districtSelect = district?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const villageSelect = village?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const inputDetailAddress = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataAddress.address_ktp];
        changeVal[i][name] = value;
        // console.log("zzzz", changeVal);
        setDataAddress({
            ...dataAddress,
            address_ktp: changeVal,
        });
    };

    const inputAddressDomicile = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataAddress.address_domicile];
        changeVal[i][name] = value;
        // console.log("zzzz", changeVal);
        setDataAddress({
            ...dataAddress,
            address_domicile: changeVal,
        });
    };

    const inputAddressOther = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataAddress.other_address];
        changeVal[i][name] = value;
        // console.log("zzzz", changeVal);
        setDataAddress({
            ...dataAddress,
            other_address: changeVal,
        });
    };

    const addRowOtherAddress = (e: FormEvent) => {
        e.preventDefault();
        setDataAddress({
            ...dataAddress,
            other_address: [
                ...dataAddress.other_address,
                {
                    idEmployee: idEmployee,
                    ADDRESS_CATEGORY: "",
                    ADDRESS_LOCATION_TYPE: 3,
                    ADDRESS_DETAIL: "",
                    ADDRESS_RT_NUMBER: "",
                    ADDRESS_RW_NUMBER: "",
                    ADDRESS_VILLAGE: "",
                    ADDRESS_DISTRICT: "",
                    ADDRESS_PROVINCE: "",
                    ADDRESS_REGENCY: "",
                    ADDRESS_STATUS: "",
                },
            ],
        });
    };

    const close = async () => {
        modal();
        setCheckDomAddress({
            ...checkDomAddress,
            domAddress: "",
        });
        const updatedData = dataAddress.address_domicile.filter(
            (data: any, a: number) => a !== 0
        );
        setDataAddress({
            ...dataAddress,
            address_domicile: updatedData,
        });
    };

    return (
        <>
            {/* address Person */}
            <ModalToAdd
                show={show}
                onClose={close}
                buttonAddOns={""}
                title={"Add Address Person"}
                url={`/addAddressPerson`}
                data={dataAddress}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                onSuccess={handleSuccessAddAddress}
                body={
                    <>
                        <div className="text-red-600 font-semibold">
                            <span>KTP Address</span>
                        </div>
                        {dataAddress.address_ktp?.map((ak: any, i: number) => {
                            return (
                                <div className="mb-2" key={i}>
                                    <div className="relative">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="ADDRESS_DETAIL"
                                            value="Address"
                                        />
                                        <div className="ml-[60px] text-red-600">
                                            *
                                        </div>
                                        <TextArea
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                            id="ADDRESS_DETAIL"
                                            name="ADDRESS_DETAIL"
                                            defaultValue={ak.ADDRESS_DETAIL}
                                            // onChange={(e) => {
                                            //     setDataAddress({
                                            //         ...dataAddress,
                                            //         address_ktp: [
                                            //             {
                                            //                 ADDRESS_DETAIL:
                                            //                     e.target.value,
                                            //             },
                                            //         ],
                                            //     });
                                            // }}
                                            onChange={(e: any) =>
                                                inputDetailAddress(
                                                    "ADDRESS_DETAIL",
                                                    e.target.value,
                                                    i
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="ADDRESS_RT_NUMBER"
                                                value="RT"
                                            />
                                            <TextInput
                                                type="text"
                                                value={ak.ADDRESS_RT_NUMBER}
                                                className=""
                                                onChange={(e) =>
                                                    inputDetailAddress(
                                                        "ADDRESS_RT_NUMBER",
                                                        e.target.value,
                                                        i
                                                    )
                                                }
                                                // required
                                                placeholder="RT"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="ADDRESS_RW_NUMBER"
                                                value="RW"
                                            />
                                            <TextInput
                                                type="text"
                                                value={ak.ADDRESS_RW_NUMBER}
                                                className=""
                                                onChange={(e) =>
                                                    inputDetailAddress(
                                                        "ADDRESS_RW_NUMBER",
                                                        e.target.value,
                                                        i
                                                    )
                                                }
                                                // required
                                                placeholder="RW"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-2">
                                            <InputLabel
                                                htmlFor="ADDRESS_PROVINCE"
                                                value="Province"
                                            />
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
                                                options={wilayahSelect}
                                                isSearchable={true}
                                                placeholder={
                                                    "--Select Province--"
                                                }
                                                value={ak.ADDRESS_PROVINCE}
                                                // onChange={(e) =>
                                                //     inputDataBank(
                                                //         "BANK_ID",
                                                //         e.target.value,
                                                //         i
                                                //     )
                                                // }
                                                onChange={(val: any) => {
                                                    getRegency(val);
                                                    // setDataAddress({
                                                    //     ...dataAddress.address_ktp,
                                                    //     ADDRESS_PROVINCE: val,
                                                    // });
                                                    inputDetailAddress(
                                                        "ADDRESS_PROVINCE",
                                                        val,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <InputLabel
                                                htmlFor="ADDRESS_REGENCY"
                                                value="Regency"
                                            />
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
                                                options={regencySelect}
                                                isSearchable={true}
                                                placeholder={
                                                    "--Select Regency--"
                                                }
                                                value={ak.ADDRESS_REGENCY}
                                                // onChange={(e) =>
                                                //     inputDataBank(
                                                //         "BANK_ID",
                                                //         e.target.value,
                                                //         i
                                                //     )
                                                // }
                                                onChange={(val: any) => {
                                                    getDistrict(val);
                                                    inputDetailAddress(
                                                        "ADDRESS_REGENCY",
                                                        val,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-2">
                                            <InputLabel
                                                htmlFor="ADDRESS_DISTRICT"
                                                value="District"
                                            />
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
                                                options={districtSelect}
                                                isSearchable={true}
                                                placeholder={
                                                    "--Select Regency--"
                                                }
                                                value={ak.ADDRESS_DISTRICT}
                                                // onChange={(e) =>
                                                //     inputDataBank(
                                                //         "BANK_ID",
                                                //         e.target.value,
                                                //         i
                                                //     )
                                                // }
                                                onChange={(val: any) => {
                                                    getVillage(val);
                                                    inputDetailAddress(
                                                        "ADDRESS_DISTRICT",
                                                        val,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <InputLabel
                                                htmlFor="ADDRESS_VILLAGE"
                                                value="Village"
                                            />
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
                                                options={villageSelect}
                                                isSearchable={true}
                                                placeholder={
                                                    "--Select Province--"
                                                }
                                                value={ak.ADDRESS_VILLAGE}
                                                // onChange={(e) =>
                                                //     inputDataBank(
                                                //         "BANK_ID",
                                                //         e.target.value,
                                                //         i
                                                //     )
                                                // }
                                                onChange={(val: any) => {
                                                    // getRegency(val);
                                                    inputDetailAddress(
                                                        "ADDRESS_VILLAGE",
                                                        val,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm flex">
                                        <div className="flex w-4 flex-shrink-0 items-center justify-end rounded-l-md text-sm font-medium">
                                            <Checkbox
                                                // id={typeRelation.RELATION_TYPE_ID}
                                                value={
                                                    checkDomAddress.domAddress
                                                }
                                                defaultChecked={true}
                                                onChange={(e) =>
                                                    handleCheckbox(e)
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md">
                                            <div className="flex-1 truncate px-1 py-2 text-xs">
                                                <span className="text-gray-900">
                                                    {/* {typeRelation.RELATION_TYPE_NAME} */}
                                                    Set KTP Address as Domicile
                                                    Address
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {checkDomAddress.domAddress === "3" ? (
                            <>
                                <div className="border-b-2"></div>
                                <div className="text-red-600 font-semibold">
                                    <span>Domicile Address</span>
                                </div>
                                {dataAddress.address_domicile?.map(
                                    (ad: any, i: number) => {
                                        return (
                                            <div className="mb-2" key={i}>
                                                <div className="">
                                                    <InputLabel
                                                        htmlFor="ADDRESS_STATUS"
                                                        value="Status"
                                                    />
                                                    <select
                                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            ad.ADDRESS_STATUS
                                                        }
                                                        required
                                                        onChange={(e) =>
                                                            inputAddressDomicile(
                                                                "ADDRESS_STATUS",
                                                                e.target.value,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <option value={""}>
                                                            -- Choose Status --
                                                        </option>
                                                        {addressStatus.map(
                                                            (
                                                                addressStatus: any,
                                                                i: number
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            addressStatus.ADDRESS_STATUS_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            addressStatus.ADDRESS_STATUS_NAME
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="mt-2 relative">
                                                    <InputLabel
                                                        className="absolute"
                                                        htmlFor="ADDRESS_DETAIL"
                                                        value="Address"
                                                    />
                                                    <div className="ml-[60px] text-red-600">
                                                        *
                                                    </div>
                                                    <TextArea
                                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        id="ADDRESS_DETAIL"
                                                        name="ADDRESS_DETAIL"
                                                        defaultValue={
                                                            ad.ADDRESS_DETAIL
                                                        }
                                                        // onChange={(e) => {
                                                        //     setDataAddress({
                                                        //         ...dataAddress,
                                                        //         address_ktp: [
                                                        //             {
                                                        //                 ADDRESS_DETAIL:
                                                        //                     e.target.value,
                                                        //             },
                                                        //         ],
                                                        //     });
                                                        // }}
                                                        onChange={(e: any) =>
                                                            inputAddressDomicile(
                                                                "ADDRESS_DETAIL",
                                                                e.target.value,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ADDRESS_RT_NUMBER"
                                                            value="RT"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                ad.ADDRESS_RT_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(e) =>
                                                                inputAddressDomicile(
                                                                    "ADDRESS_RT_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            // required
                                                            placeholder="RT"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ADDRESS_RW_NUMBER"
                                                            value="RW"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                ad.ADDRESS_RW_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(e) =>
                                                                inputAddressDomicile(
                                                                    "ADDRESS_RW_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            // required
                                                            placeholder="RW"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_PROVINCE"
                                                            value="Province"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                wilayahSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Province--"
                                                            }
                                                            value={
                                                                ad.ADDRESS_PROVINCE
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getRegency(val);
                                                                // setDataAddress({
                                                                //     ...dataAddress.address_ktp,
                                                                //     ADDRESS_PROVINCE: val,
                                                                // });
                                                                inputAddressDomicile(
                                                                    "ADDRESS_PROVINCE",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_REGENCY"
                                                            value="Regency"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                regencySelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Regency--"
                                                            }
                                                            value={
                                                                ad.ADDRESS_REGENCY
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getDistrict(
                                                                    val
                                                                );
                                                                inputAddressDomicile(
                                                                    "ADDRESS_REGENCY",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_DISTRICT"
                                                            value="District"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                districtSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Regency--"
                                                            }
                                                            value={
                                                                ad.ADDRESS_DISTRICT
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getVillage(val);
                                                                inputAddressDomicile(
                                                                    "ADDRESS_DISTRICT",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_VILLAGE"
                                                            value="Village"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                villageSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Province--"
                                                            }
                                                            value={
                                                                ad.ADDRESS_VILLAGE
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                // getRegency(val);
                                                                inputAddressDomicile(
                                                                    "ADDRESS_VILLAGE",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </>
                        ) : null}
                        <div
                            className="text-gray-600 text-xs hover:underline hover:cursor-pointer w-fit border-b-2 mb-2"
                            onClick={(e) => addRowOtherAddress(e)}
                        >
                            <span>
                                <i>+ Add Other Address</i>
                            </span>
                        </div>
                        {dataAddress.other_address?.map(
                            (otd: any, i: number) => {
                                return (
                                    <>
                                        <div className="" key={i}>
                                            <div className="flex justify-between items-center">
                                                <div className="text-red-600 font-semibold">
                                                    <span>Other Address</span>
                                                </div>
                                                <div>
                                                    <XMarkIcon
                                                        className="w-7 text-red-600 hover:cursor-pointer"
                                                        onClick={() => {
                                                            const updatedData =
                                                                dataAddress.other_address.filter(
                                                                    (
                                                                        data: any,
                                                                        a: number
                                                                    ) => a !== i
                                                                );
                                                            setDataAddress({
                                                                ...dataAddress,
                                                                other_address:
                                                                    updatedData,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <div className="">
                                                    <InputLabel
                                                        htmlFor="ADDRESS_STATUS"
                                                        value="Status"
                                                    />
                                                    <select
                                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            otd.ADDRESS_STATUS
                                                        }
                                                        required
                                                        onChange={(e) =>
                                                            inputAddressOther(
                                                                "ADDRESS_STATUS",
                                                                e.target.value,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <option value={""}>
                                                            -- Choose Status --
                                                        </option>
                                                        {addressStatus.map(
                                                            (
                                                                addressStatus: any,
                                                                i: number
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            addressStatus.ADDRESS_STATUS_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            addressStatus.ADDRESS_STATUS_NAME
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="mt-2 relative">
                                                    <InputLabel
                                                        className="absolute"
                                                        htmlFor="ADDRESS_DETAIL"
                                                        value="Address"
                                                    />
                                                    <div className="ml-[60px] text-red-600">
                                                        *
                                                    </div>
                                                    <TextArea
                                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        id="ADDRESS_DETAIL"
                                                        name="ADDRESS_DETAIL"
                                                        defaultValue={
                                                            otd.ADDRESS_DETAIL
                                                        }
                                                        // onChange={(e) => {
                                                        //     setDataAddress({
                                                        //         ...dataAddress,
                                                        //         address_ktp: [
                                                        //             {
                                                        //                 ADDRESS_DETAIL:
                                                        //                     e.target.value,
                                                        //             },
                                                        //         ],
                                                        //     });
                                                        // }}
                                                        onChange={(e: any) =>
                                                            inputAddressOther(
                                                                "ADDRESS_DETAIL",
                                                                e.target.value,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ADDRESS_RT_NUMBER"
                                                            value="RT"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                otd.ADDRESS_RT_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(e) =>
                                                                inputAddressOther(
                                                                    "ADDRESS_RT_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            // required
                                                            placeholder="RT"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="ADDRESS_RW_NUMBER"
                                                            value="RW"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                otd.ADDRESS_RW_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(e) =>
                                                                inputAddressOther(
                                                                    "ADDRESS_RW_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            // required
                                                            placeholder="RW"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_PROVINCE"
                                                            value="Province"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                wilayahSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Province--"
                                                            }
                                                            value={
                                                                otd.ADDRESS_PROVINCE
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getRegency(val);
                                                                // setDataAddress({
                                                                //     ...dataAddress.address_ktp,
                                                                //     ADDRESS_PROVINCE: val,
                                                                // });
                                                                inputAddressOther(
                                                                    "ADDRESS_PROVINCE",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_REGENCY"
                                                            value="Regency"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                regencySelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Regency--"
                                                            }
                                                            value={
                                                                otd.ADDRESS_REGENCY
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getDistrict(
                                                                    val
                                                                );
                                                                inputAddressOther(
                                                                    "ADDRESS_REGENCY",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_DISTRICT"
                                                            value="District"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                districtSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Regency--"
                                                            }
                                                            value={
                                                                otd.ADDRESS_DISTRICT
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                getVillage(val);
                                                                inputAddressOther(
                                                                    "ADDRESS_DISTRICT",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_VILLAGE"
                                                            value="Village"
                                                        />
                                                        <SelectTailwind
                                                            classNames={{
                                                                menuButton:
                                                                    () =>
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
                                                            options={
                                                                villageSelect
                                                            }
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Select Province--"
                                                            }
                                                            value={
                                                                otd.ADDRESS_VILLAGE
                                                            }
                                                            // onChange={(e) =>
                                                            //     inputDataBank(
                                                            //         "BANK_ID",
                                                            //         e.target.value,
                                                            //         i
                                                            //     )
                                                            // }
                                                            onChange={(
                                                                val: any
                                                            ) => {
                                                                // getRegency(val);
                                                                inputAddressOther(
                                                                    "ADDRESS_VILLAGE",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            }
                        )}
                    </>
                }
            />
        </>
    );
}
