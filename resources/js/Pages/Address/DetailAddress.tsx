import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    CheckIcon,
    HandThumbUpIcon,
    PencilSquareIcon,
    UserIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import AddRelationPopup from "../Relation/AddRelation";
import DetailRelationPopup from "../Relation/DetailRelation";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import SelectTailwind from "react-tailwindcss-select";
import Checkbox from "@/Components/Checkbox";
import BeatLoader from "react-spinners/BeatLoader";
import ToastMessage from "@/Components/ToastMessage";

export default function DetailAddress({
    idAddress,
    comboOffice,
    wilayah,
    locationType,
    setDetailAddress,
}: PropsWithChildren<{
    idAddress: any;
    comboOffice: any;
    wilayah: any;
    locationType: any;
    setDetailAddress: any;
    // divisionCombo: any;
}>) {
    const [dataOfficeNew, setDataDetailOffice] = useState<any>([]);
    const [regency, setRegency] = useState<any>([]);

    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    useEffect(() => {
        getOfficeDetail(idAddress);
    }, [idAddress]);

    const getOfficeDetail = async (id: string) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getOfficeDetail`, { id })
            .then((res) => {
                setDataDetailOffice(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_OFFICE_ALIAS: "",
        RELATION_OFFICE_DESCRIPTION: "",
        RELATION_OFFICE_ADDRESS: "",
        RELATION_OFFICE_PHONENUMBER: "",
        RELATION_OFFICE_PROVINCE: "",
        RELATION_OFFICE_REGENCY: "",
        m_location_type: [
            {
                M_RELATION_OFFICE_LOCATION_TYPE_ID: "",
                RELATION_OFFICE_ID: "",
                LOCATION_TYPE_ID: "",
            },
        ],
        RELATION_OFFICE_REGENCYNEW: "",
    });

    useEffect(() => {
        getRegency(dataById.RELATION_OFFICE_PROVINCE);
    }, [dataById.RELATION_OFFICE_PROVINCE]);

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        setDataById(dataOfficeNew);
        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    const wilayahSelect = wilayah?.map((query: any) => {
        return {
            value: query.kode,
            label: query.nama,
        };
    });

    const getRegency = async (id: any) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        const valueKode = id;
        await axios
            .post(`/getRegency`, { valueKode })
            .then((res) => {
                setRegency(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
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

    const checkedLocationType = (id: number) => {
        if (
            dataById.m_location_type?.find(
                (f: any) => f.LOCATION_TYPE_ID === id
            )
        ) {
            return true;
        }
    };

    const handleCheckboxEdit = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setDataById({
                ...dataById,
                m_location_type: [
                    ...dataById.m_location_type,
                    {
                        LOCATION_TYPE_ID: value,
                    },
                ],
            });
        } else {
            const updatedData = dataById.m_location_type.filter(
                (data: any) =>
                    data.location_type?.RELATION_LOCATION_TYPE_ID !==
                    parseInt(value)
            );
            setDataById({ ...dataById, m_location_type: updatedData });
        }
    };

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
            const selectedRegency = regencySelect.filter(
                (option: any) => option.value === value
            );
            return selectedRegency[0].label;
        }
    };
    // const getRegencyLabel = (value: any) => {
    //     if (value) {
    //         const selectedRegency = regencySelect.filter(
    //             (optionRegency: any) => optionRegency.value === value
    //         );
    //         if (selectedRegency?.length === 0) {
    //             dataById.RELATION_OFFICE_REGENCY;
    //         } else {
    //             return {
    //                 label: selectedRegency[0].label,
    //                 value: dataById.RELATION_OFFICE_REGENCY,
    //             };
    //         }
    //         // return selectedRegency[0].label;
    //     }
    // };

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setDetailAddress({
                RELATION_OFFICE_ID: message[0],
                RELATION_OFFICE_ALIAS: message[1],
            });
            getOfficeDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [isSuccess, setIsSuccess] = useState<string>("");
    return (
        <>
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* <span>Detail Division</span> */}
            {/* modal edit*/}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.edit}
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
                title={"Edit Address"}
                url={`/editOffice`}
                data={dataById}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className=""
                                htmlFor="RELATION_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-0">
                                {
                                    dataOfficeNew.to_relation
                                        ?.RELATION_ORGANIZATION_ALIAS
                                }
                            </div>
                        </div>
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-3 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_OFFICE_ALIAS"
                                    value={"Address Name"}
                                />
                                <div className="ml-[6.7rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_OFFICE_ALIAS"
                                    type="text"
                                    name="RELATION_OFFICE_ALIAS"
                                    value={dataById.RELATION_OFFICE_ALIAS}
                                    className="mt-0"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_OFFICE_ALIAS:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Address Name"
                                />
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="RELATION_OFFICE_PARENT_ID"
                                    value={"Address Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.RELATION_OFFICE_PARENT_ID}
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_OFFICE_PARENT_ID:
                                                e.target.value,
                                        });
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Parent --
                                    </option>
                                    {comboOffice
                                        ?.filter(
                                            (m: any) =>
                                                m.RELATION_OFFICE_ALIAS !==
                                                dataOfficeNew.RELATION_OFFICE_ALIAS
                                        )
                                        .map((cOffice: any, i: number) => {
                                            return (
                                                <option
                                                    value={
                                                        cOffice.RELATION_OFFICE_ID
                                                    }
                                                    key={i}
                                                >
                                                    {cOffice.text_combo}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="RELATION_OFFICE_PHONENUMBER"
                                    value={"Phone Number"}
                                />
                                <TextInput
                                    id="RELATION_OFFICE_PHONENUMBER"
                                    type="text"
                                    name="RELATION_OFFICE_PHONENUMBER"
                                    value={dataById.RELATION_OFFICE_PHONENUMBER}
                                    className="mt-0"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_OFFICE_PHONENUMBER:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>
                        <div className="relative mt-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="RELATION_OFFICE_ADDRESS"
                                value={"Location Detail"}
                            />
                            <div className="ml-[6.9rem] text-red-600">*</div>
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_DIVISION_DESCRIPTION"
                                name="RELATION_DIVISION_DESCRIPTION"
                                defaultValue={dataById.RELATION_OFFICE_ADDRESS}
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_OFFICE_ADDRESS: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className=" relative lg:grid lg:grid-cols-2 lg:gap-4 mt-2 xs:grid xs:grid-cols-1 xs:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_OFFICE_PROVINCE"
                                    value={"Province"}
                                />
                                <div className="ml-[4.1rem] text-red-600">
                                    *
                                </div>
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
                                    options={wilayahSelect}
                                    isSearchable={true}
                                    placeholder={"--Select Province--"}
                                    value={{
                                        label: getProvinceLabel(
                                            dataById.RELATION_OFFICE_PROVINCE
                                        ),
                                        value: dataById.RELATION_OFFICE_PROVINCE,
                                    }}
                                    // value={dataById.RELATION_OFFICE_PROVINCE}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        // return false;
                                        getRegency(val.value);
                                        setDataById({
                                            ...dataById,
                                            RELATION_OFFICE_PROVINCE: val.value,
                                        });
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_OFFICE_REGENCY"
                                    value={"Regency"}
                                />
                                <div className="ml-[4.1rem] text-red-600">
                                    *
                                </div>
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
                                    options={regencySelect}
                                    isSearchable={true}
                                    placeholder={"--Select Regency--"}
                                    value={{
                                        label: getRegencyLabel(
                                            dataById.RELATION_OFFICE_REGENCY
                                        ),
                                        value: dataById.RELATION_OFFICE_REGENCY,
                                    }}
                                    // value={getRegencyLabel(
                                    //     dataById.RELATION_OFFICE_REGENCY
                                    // )}
                                    // value={dataById.RELATION_OFFICE_REGENCY}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_OFFICE_REGENCY: val.value,
                                        });
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>
                        <div className="relative mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_LOCATION_TYPE"
                                    value={"Location Type"}
                                />
                                <div className="ml-[6.3rem] text-red-600">
                                    *
                                </div>
                                <div>
                                    <ul
                                        role="list"
                                        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                                    >
                                        {locationType.map(
                                            (lType: any, i: number) => {
                                                return (
                                                    <li
                                                        key={i}
                                                        className="col-span-1 flex rounded-md shadow-sm"
                                                    >
                                                        <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                            <Checkbox
                                                                name="relation_type_id[]"
                                                                id={
                                                                    lType.RELATION_LOCATION_TYPE_ID
                                                                }
                                                                value={
                                                                    lType.RELATION_LOCATION_TYPE_ID
                                                                }
                                                                defaultChecked={checkedLocationType(
                                                                    lType.RELATION_LOCATION_TYPE_ID
                                                                )}
                                                                onChange={(e) =>
                                                                    handleCheckboxEdit(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                            <div className="flex-1 truncate px-1 py-2 text-xs">
                                                                <span className="text-gray-900">
                                                                    {
                                                                        lType.RELATION_LOCATION_TYPE_NAME
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-2 mb-4">
                            <InputLabel
                                className=""
                                htmlFor="RELATION_OFFICE_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_OFFICE_DESCRIPTION"
                                name="RELATION_OFFICE_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_OFFICE_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_OFFICE_DESCRIPTION:
                                            e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal edit*/}
            <div className="bg-white py-4 shadow-md rounded-md mb-2 h-[310px]">
                {isLoading.get_detail ? (
                    <div className="flex justify-center items-center sweet-loading h-[199px]">
                        <BeatLoader
                            // cssOverride={override}
                            size={10}
                            color={"#ff4242"}
                            loading={true}
                            speedMultiplier={1.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 px-4">
                            <div className="">
                                <div className="text-sm font-semibold">
                                    <span>Relation Name</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span>
                                        {
                                            dataOfficeNew.to_relation
                                                ?.RELATION_ORGANIZATION_ALIAS
                                        }
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-semibold">
                                        <span>Parent Name</span>
                                    </div>
                                    <div>
                                        <a
                                            onClick={(e) =>
                                                handleEditModel(
                                                    e,
                                                    dataOfficeNew.RELATION_OFFICE_ID
                                                )
                                            }
                                            className="cursor-pointer"
                                            title="Edit Office"
                                        >
                                            <div className="p-1 rounded-md text-red-600">
                                                <PencilSquareIcon className="w-5" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span>
                                        {dataOfficeNew?.parent === null
                                            ? "-"
                                            : dataOfficeNew.parent
                                                  ?.RELATION_OFFICE_ALIAS}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 px-4">
                            <div>
                                <div className="text-sm font-semibold">
                                    <span>Location Type</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    <div className="mb-2 relative flex flex-wrap gap-3">
                                        {dataOfficeNew.m_location_type?.map(
                                            (dOffice: any, i: number) => {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="rounded-lg w-fit py-1.5 px-3 bg-red-500 flex items-center gap-2 text-sm"
                                                    >
                                                        <span className="text-white">
                                                            {
                                                                dOffice
                                                                    .location_type
                                                                    .RELATION_LOCATION_TYPE_NAME
                                                            }
                                                        </span>
                                                        <div>
                                                            <div
                                                                className="text-white cursor-pointer"
                                                                onMouseDown={(
                                                                    e
                                                                ) =>
                                                                    e.preventDefault()
                                                                }
                                                            >
                                                                <XMarkIcon className="w-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 px-4">
                            <div>
                                <div className="text-sm font-semibold">
                                    <span>Description</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p>
                                        {dataOfficeNew.RELATION_OFFICE_DESCRIPTION ===
                                            null ||
                                        dataOfficeNew.RELATION_OFFICE_DESCRIPTION ===
                                            ""
                                            ? "-"
                                            : dataOfficeNew.RELATION_OFFICE_DESCRIPTION}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
