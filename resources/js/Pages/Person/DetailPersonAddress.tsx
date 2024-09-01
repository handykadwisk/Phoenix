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

export default function DetailPersonAddress({
    idPerson,
    wilayah,
    wilayahSelect,
}: PropsWithChildren<{ idPerson: any; wilayah: any; wilayahSelect: any }>) {
    useEffect(() => {
        getPersonAddress(idPerson);
    }, [idPerson]);

    const [detailAddressPerson, setDetailAddressPerson] = useState<any>([]);
    const [regency, setRegency] = useState<any>([]);
    const [district, setDistrict] = useState<any>([]);
    const [village, setVillage] = useState<any>([]);

    const [regencyOther, setRegencyOther] = useState<any>([]);
    const [districtOther, setDistrictOther] = useState<any>([]);
    const [villageOther, setVillageOther] = useState<any>([]);
    const [editAddressNew, setEditAddressNew] = useState<any>({
        dataEdit: [
            {
                idPerson: idPerson,
                ADDRESS_CATEGORY: "",
                ADDRESS_LOCATION_TYPE: "",
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
        other_address: [],
    });

    const getDistrict = async (id: any) => {
        // console.log(id);
        const valueKode = id;
        await axios
            .post(`/getDistrict`, { valueKode })
            .then((res) => {
                setDistrict(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDistrictOther = async (id: any) => {
        // console.log(id);
        const valueKode = id;
        await axios
            .post(`/getDistrict`, { valueKode })
            .then((res) => {
                setDistrictOther(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getRegency = async (id: any) => {
        const valueKode = id;
        await axios
            .post(`/get_regency`, { valueKode })
            .then((res) => {
                setRegency(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getRegencyOther = async (id: any) => {
        const valueKode = id;
        await axios
            .post(`/get_regency`, { valueKode })
            .then((res) => {
                setRegencyOther(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getVillage = async (id: any) => {
        const valueKode = id;
        await axios
            .post(`/getVillage`, { valueKode })
            .then((res) => {
                setVillage(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getVillageOther = async (id: any) => {
        const valueKode = id;
        await axios
            .post(`/getVillage`, { valueKode })
            .then((res) => {
                setVillageOther(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getPersonAddress = async (id: string) => {
        await axios
            .post(`/getPersonAddress`, { id })
            .then((res) => {
                setDetailAddressPerson(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const detailAddressById = async (idAddress: string) => {
        await axios
            .post(`/detailAddress`, { idAddress })
            .then((res) => {
                // setEditAddressNew(res.data);
                setEditAddressNew({
                    dataEdit: [res.data],
                    other_address: [],
                });
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

    const regencySelectOther = regencyOther?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const [modalEditAddress, setEditModalAddress] = useState<any>({
        edit: false,
    });

    const [addressStatus, setAddressStatus] = useState<any>([]);
    const getAddressStatus = async () => {
        await axios
            .post(`/getAddressStatus`)
            .then((res) => {
                setAddressStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditAddress = async (
        e: FormEvent,
        idAddress: string,
        idProvince: string,
        idRegency: string,
        idDistrict: string,
        idVillage: string
    ) => {
        e.preventDefault();
        detailAddressById(idAddress);
        getAddressStatus();
        setEditModalAddress({
            edit: !modalEditAddress.edit,
        });
        getRegency(idProvince);
        getDistrict(idRegency);
        getVillage(idDistrict);
    };
    // console.log(editAddressNew);
    const getProvinceLabel = (value: any) => {
        if (value) {
            const selected = wilayahSelect.filter(
                (option: any) => option.value === parseInt(value)
            );
            return selected[0].label;
        }
    };

    const getRegencyLabel = (value: any) => {
        if (value) {
            const selected = regencySelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const getDistrictLabel = (value: any) => {
        if (value) {
            const selected = districtSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const getVillageLabel = (value: any) => {
        if (value) {
            const selected = villageSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const districtSelect = district?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });
    const districtSelectOther = districtOther?.map((query: any) => {
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

    const villageSelectOther = villageOther?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const handleSuccessEditAddress = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            Swal.fire({
                title: "Success",
                text: "Person Address Edited",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                    getPersonAddress(idPerson);
                    // getPersons();
                    // setGetDetailRelation(message);
                    // setModal({
                    //     add: false,
                    //     delete: false,
                    //     edit: false,
                    //     view: true,
                    //     document: false,
                    //     search: false,
                    // });
                }
            });
        }
    };

    const inputAddressOther = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...editAddressNew.other_address];
        changeVal[i][name] = value;
        // console.log("zzzz", changeVal);
        setEditAddressNew({
            ...editAddressNew,
            other_address: changeVal,
        });
    };

    const inputEditAddress = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...editAddressNew.dataEdit];
        changeVal[i][name] = value;
        // console.log("zzzz", changeVal);
        setEditAddressNew({
            ...editAddressNew,
            dataEdit: changeVal,
        });
    };

    const addRowOtherAddress = (e: FormEvent) => {
        e.preventDefault();
        setEditAddressNew({
            ...editAddressNew,
            other_address: [
                ...editAddressNew.other_address,
                {
                    idPerson: idPerson,
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

    return (
        <>
            <ModalToAdd
                show={modalEditAddress.edit}
                onClose={() =>
                    setEditModalAddress({
                        edit: false,
                    })
                }
                buttonAddOns={""}
                title={"Edit Address"}
                url={`/editAddress`}
                data={editAddressNew}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccessEditAddress}
                body={
                    <>
                        <div className="mb-2">
                            {editAddressNew.dataEdit?.map(
                                (dE: any, i: number) => {
                                    return (
                                        <>
                                            <div key={i}>
                                                {dE?.ADDRESS_LOCATION_TYPE ===
                                                1 ? (
                                                    <div className="text-red-600 font-semibold">
                                                        <span>KTP Address</span>
                                                    </div>
                                                ) : dE?.ADDRESS_LOCATION_TYPE ===
                                                  2 ? (
                                                    <div className="text-red-600 font-semibold">
                                                        <span>
                                                            Domicile Address
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="text-red-600 font-semibold">
                                                        <span>
                                                            Other Address
                                                        </span>
                                                    </div>
                                                )}
                                                {dE?.ADDRESS_LOCATION_TYPE !==
                                                1 ? (
                                                    <div className="">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_STATUS"
                                                            value="Status"
                                                        />
                                                        <select
                                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                dE.ADDRESS_STATUS
                                                            }
                                                            required
                                                            onChange={(e) =>
                                                                inputEditAddress(
                                                                    "ADDRESS_STATUS",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <option value={""}>
                                                                -- Choose Status
                                                                --
                                                            </option>
                                                            {addressStatus.map(
                                                                (
                                                                    addressStatus: any,
                                                                    i: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                i
                                                                            }
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
                                                ) : null}
                                                <div className="">
                                                    <InputLabel
                                                        htmlFor="ADDRESS_DETAIL"
                                                        value="Address"
                                                    />
                                                    <TextArea
                                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        id="ADDRESS_DETAIL"
                                                        name="ADDRESS_DETAIL"
                                                        defaultValue={
                                                            dE.ADDRESS_DETAIL
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
                                                        onChange={(e: any) => {
                                                            // setEditAddressNew({
                                                            //     ...editAddressNew,
                                                            //     ADDRESS_DETAIL:
                                                            //         e.target
                                                            //             .value,
                                                            // });
                                                            inputEditAddress(
                                                                "ADDRESS_DETAIL",
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
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
                                                                dE.ADDRESS_RT_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(
                                                                e: any
                                                            ) => {
                                                                inputEditAddress(
                                                                    "ADDRESS_RT_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
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
                                                                dE.ADDRESS_RW_NUMBER
                                                            }
                                                            className=""
                                                            onChange={(
                                                                e: any
                                                            ) => {
                                                                inputEditAddress(
                                                                    "ADDRESS_RW_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                );
                                                            }}
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
                                                            // value={editAddressNew.ADDRESS_PROVINCE}
                                                            value={{
                                                                label: getProvinceLabel(
                                                                    dE.ADDRESS_PROVINCE
                                                                ),
                                                                value: dE.ADDRESS_PROVINCE,
                                                            }}
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
                                                                getRegency(
                                                                    val.value
                                                                );
                                                                inputEditAddress(
                                                                    "ADDRESS_PROVINCE",
                                                                    val.value,
                                                                    i
                                                                );
                                                                // setEditAddressNew({
                                                                //     ...editAddressNew,
                                                                //     ADDRESS_VILLAGE: "",
                                                                // });
                                                                // inputDetailAddress(
                                                                //     "ADDRESS_PROVINCE",
                                                                //     val,
                                                                //     i
                                                                // );
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
                                                            value={{
                                                                label: getRegencyLabel(
                                                                    dE.ADDRESS_REGENCY
                                                                ),
                                                                value: dE.ADDRESS_REGENCY,
                                                            }}
                                                            // value={getRegencyLabel(
                                                            //     dE.ADDRESS_REGENCY
                                                            // )}
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
                                                                    val.value
                                                                );
                                                                inputEditAddress(
                                                                    "ADDRESS_REGENCY",
                                                                    val.value,
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
                                                            value={{
                                                                label: getDistrictLabel(
                                                                    dE.ADDRESS_DISTRICT
                                                                ),
                                                                value: dE.ADDRESS_DISTRICT,
                                                            }}
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
                                                                getVillage(
                                                                    val.value
                                                                );
                                                                inputEditAddress(
                                                                    "ADDRESS_DISTRICT",
                                                                    val.value,
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
                                                            value={{
                                                                label: getVillageLabel(
                                                                    dE.ADDRESS_VILLAGE
                                                                ),
                                                                value: dE.ADDRESS_VILLAGE,
                                                            }}
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
                                                                inputEditAddress(
                                                                    "ADDRESS_VILLAGE",
                                                                    val.value,
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
                                        </>
                                    );
                                }
                            )}
                            <div
                                className="text-gray-600 text-xs hover:underline hover:cursor-pointer w-fit border-b-2 mb-2 mt-2"
                                onClick={(e) => addRowOtherAddress(e)}
                            >
                                <span>
                                    <i>+ Add Other Address</i>
                                </span>
                            </div>
                            {editAddressNew.other_address?.map(
                                (otd: any, i: number) => {
                                    return (
                                        <>
                                            <div className="" key={i}>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-red-600 font-semibold">
                                                        <span>
                                                            Other Address
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <XMarkIcon
                                                            className="w-7 text-red-600 hover:cursor-pointer"
                                                            onClick={() => {
                                                                const updatedData =
                                                                    editAddressNew.other_address.filter(
                                                                        (
                                                                            data: any,
                                                                            a: number
                                                                        ) =>
                                                                            a !==
                                                                            i
                                                                    );
                                                                setEditAddressNew(
                                                                    {
                                                                        ...editAddressNew,
                                                                        other_address:
                                                                            updatedData,
                                                                    }
                                                                );
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
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <option value={""}>
                                                                -- Choose Status
                                                                --
                                                            </option>
                                                            {addressStatus.map(
                                                                (
                                                                    addressStatus: any,
                                                                    i: number
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            key={
                                                                                i
                                                                            }
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
                                                    <div className="mt-2">
                                                        <InputLabel
                                                            htmlFor="ADDRESS_DETAIL"
                                                            value="Address"
                                                        />
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
                                                            onChange={(
                                                                e: any
                                                            ) =>
                                                                inputAddressOther(
                                                                    "ADDRESS_DETAIL",
                                                                    e.target
                                                                        .value,
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
                                                                isSearchable={
                                                                    true
                                                                }
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
                                                                    getRegencyOther(
                                                                        val.value
                                                                    );
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
                                                                    regencySelectOther
                                                                }
                                                                isSearchable={
                                                                    true
                                                                }
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
                                                                    getDistrictOther(
                                                                        val.value
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
                                                                    districtSelectOther
                                                                }
                                                                isSearchable={
                                                                    true
                                                                }
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
                                                                    getVillageOther(
                                                                        val.value
                                                                    );
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
                                                                    villageSelectOther
                                                                }
                                                                isSearchable={
                                                                    true
                                                                }
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
                        </div>
                    </>
                }
            />

            {detailAddressPerson?.map((dAP: any, i: number) => {
                return (
                    <div className="mb-4" key={i}>
                        {dAP.t_address.ADDRESS_LOCATION_TYPE === 1 ? (
                            <div className="flex justify-between items-center">
                                <div className="text-red-600 font-semibold">
                                    <span>KTP Address</span>
                                </div>
                                <div>
                                    <span>
                                        <PencilSquareIcon
                                            className="w-5 text-red-600 hover:cursor-pointer"
                                            onClick={(e) =>
                                                handleEditAddress(
                                                    e,
                                                    dAP.ADDRESS_ID,
                                                    dAP.t_address
                                                        .ADDRESS_PROVINCE,
                                                    dAP.t_address
                                                        .ADDRESS_REGENCY,
                                                    dAP.t_address
                                                        .ADDRESS_DISTRICT,
                                                    dAP.t_address
                                                        .ADDRESS_VILLAGE
                                                )
                                            }
                                        />
                                    </span>
                                </div>
                            </div>
                        ) : dAP.t_address.ADDRESS_LOCATION_TYPE === 2 ? (
                            <div className="flex justify-between items-center">
                                <div className="text-red-600 font-semibold">
                                    <span>Domicile Address</span>
                                </div>
                                <div>
                                    <span>
                                        <PencilSquareIcon
                                            className="w-5 text-red-600 hover:cursor-pointer"
                                            onClick={(e) =>
                                                handleEditAddress(
                                                    e,
                                                    dAP.ADDRESS_ID,
                                                    dAP.t_address
                                                        .ADDRESS_PROVINCE,
                                                    dAP.t_address
                                                        .ADDRESS_REGENCY,
                                                    dAP.t_address
                                                        .ADDRESS_DISTRICT,
                                                    dAP.t_address
                                                        .ADDRESS_VILLAGE
                                                )
                                            }
                                        />
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div className="text-red-600 font-semibold">
                                    <span>Other Address</span>
                                </div>
                                <div>
                                    <span>
                                        <PencilSquareIcon
                                            className="w-5 text-red-600 hover:cursor-pointer"
                                            onClick={(e) =>
                                                handleEditAddress(
                                                    e,
                                                    dAP.ADDRESS_ID,
                                                    dAP.t_address
                                                        .ADDRESS_PROVINCE,
                                                    dAP.t_address
                                                        .ADDRESS_REGENCY,
                                                    dAP.t_address
                                                        .ADDRESS_DISTRICT,
                                                    dAP.t_address
                                                        .ADDRESS_VILLAGE
                                                )
                                            }
                                        />
                                    </span>
                                </div>
                            </div>
                        )}

                        {dAP.t_address.ADDRESS_LOCATION_TYPE !== 1 ? (
                            <div>
                                <div className="text-sm font-semibold">
                                    <span>Status</span>
                                </div>
                                <div className="bg-white w-full rounded-md shadow-md p-2 mt-1 text-xs">
                                    <span>
                                        {
                                            dAP.t_address.address_status
                                                ?.ADDRESS_STATUS_NAME
                                        }
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div>
                            <div className="text-sm font-semibold mt-2">
                                <span>Address</span>
                            </div>
                            <div className="bg-white w-full rounded-md shadow-md p-2 mt-1 h-28 text-xs">
                                <span>{dAP.t_address.ADDRESS_DETAIL}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>RT</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>
                                        {dAP.t_address.ADDRESS_RT_NUMBER}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>RW</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>
                                        {dAP.t_address.ADDRESS_RW_NUMBER}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>Province</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>{dAP.t_address.province.nama}</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>Regency</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>{dAP.t_address.regency.nama}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>District</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>{dAP.t_address.district.nama}</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm mb-1">
                                    <span>Village</span>
                                </div>
                                <div className="bg-white w-full shadow-md rounded-md p-2 text-xs">
                                    <span>{dAP.t_address.village.nama}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
