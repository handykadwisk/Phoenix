import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import SelectTailwind from "react-tailwindcss-select";
// import DetailAddressPopup from "./DetailAddress";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import DetailAddressCompany from "./DetailAddressCompany";

export default function AddressCompany({
    auth,
    idCompany,
    nameCompany,
}: PropsWithChildren<{
    auth: any;
    idCompany: any;
    nameCompany: any;
}>) {
    // useEffect(() => {
    //     getCompanyOffice();
    // }, []);

    const [dataOffice, setDataOffice] = useState<any>([]);
    const [searchOffice, setSearchOffice] = useState<any>({
        COMPANY_OFFICE_ALIAS: "",
    });

    const [detailAddress, setDetailAddress] = useState<any>({
        COMPANY_OFFICE_ID: "",
        COMPANY_OFFICE_ALIAS: "",
    });
    const [locationType, setLocationType] = useState<any>([]);
    const [comboOffice, setComboOffice] = useState<any>([]);
    const [wilayah, setWilayah] = useState<any>([]);
    const [regency, setRegency] = useState<any>([]);

    const getCompanyOffice = async (pageNumber = "page=1") => {
        await axios
            .post(`/getOffice?${pageNumber}`, {
                idCompany,
                COMPANY_OFFICE_ALIAS: searchOffice.COMPANY_OFFICE_ALIAS,
            })
            .then((res) => {
                setDataOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getLocationType = async (id: string) => {
        await axios
            .post(`/getLocationType`, { id })
            .then((res) => {
                setLocationType(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getOfficeCombo = async (id: string) => {
        await axios
            .post(`/getOfficeComboCompany`, { id })
            .then((res) => {
                setComboOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getWilayah = async () => {
        await axios
            .post(`/getWilayah`)
            .then((res) => {
                setWilayah(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getRegency = async (id: any) => {
        const valueKode = id.value;
        await axios
            .post(`/getRegency`, { valueKode })
            .then((res) => {
                setRegency(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const wilayahSelect = wilayah?.map((query: any) => {
        return {
            value: query.kode,
            label: query.nama,
        };
    });

    const regencySelect = regency?.map((query: any) => {
        return {
            value: query.kode_mapping,
            label: query.nama,
        };
    });

    const addAddressPopup = async (e: FormEvent) => {
        e.preventDefault();

        getLocationType(idCompany);
        getOfficeCombo(idCompany);
        getWilayah();
        setModal({
            add: !modal.add,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    };

    const { data, setData } = useForm<any>({
        COMPANY_OFFICE_NAME: "",
        COMPANY_OFFICE_ALIAS: "",
        COMPANY_OFFICE_DESCRIPTION: "",
        COMPANY_OFFICE_PARENT_ID: "",
        COMPANY_ID: idCompany,
        COMPANY_NAME: nameCompany,
        COMPANY_OFFICE_MAPPING: "",
        COMPANY_OFFICE_ADDRESS: "",
        COMPANY_OFFICE_PHONENUMBER: "",
        COMPANY_OFFICE_PROVINCE: "",
        COMPANY_OFFICE_REGENCY: "",
        COMPANY_LOCATION_TYPE: [],
    });

    const handleCheckbox = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setData("COMPANY_LOCATION_TYPE", [
                ...data.COMPANY_LOCATION_TYPE,
                {
                    id: value,
                },
            ]);
        } else {
            const updatedData = data.COMPANY_LOCATION_TYPE.filter(
                (d: any) => d.id !== value
            );
            setData("COMPANY_LOCATION_TYPE", updatedData);
        }
    };

    const handleSuccess = (message: string) => {
        if (message[0] === "lType") {
            Swal.fire({
                title: "Warning",
                text: message[1],
                icon: "warning",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                    setModal({
                        add: true,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }
            });
        } else {
            setIsSuccess(message[2]);
            setData({
                COMPANY_OFFICE_NAME: "",
                COMPANY_OFFICE_ALIAS: "",
                COMPANY_OFFICE_DESCRIPTION: "",
                COMPANY_OFFICE_PARENT_ID: "",
                COMPANY_ID: idCompany,
                COMPANY_OFFICE_MAPPING: "",
                COMPANY_OFFICE_ADDRESS: "",
                COMPANY_OFFICE_PHONENUMBER: "",
                COMPANY_OFFICE_PROVINCE: "",
                COMPANY_OFFICE_REGENCY: "",
                COMPANY_LOCATION_TYPE: [],
            });
            // getCompanyOffice();
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const clearSearchAddress = async (pageNumber = "page=1") => {
        await axios
            .post(`/getOffice?${pageNumber}`, {
                idCompany,
            })
            .then((res) => {
                setDataOffice(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleClickDetailCompanyOffice = async (data: any) => {
        getOfficeCombo(idCompany);
        getLocationType(idCompany);
        getWilayah();
        setDetailAddress({
            COMPANY_OFFICE_ID: data.COMPANY_OFFICE_ID,
            COMPANY_OFFICE_ALIAS: data.COMPANY_OFFICE_ALIAS,
        });
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: true,
            document: false,
            search: false,
        });
    };
    return (
        <>
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* modal add */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.add}
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
                title={"Add Address & Location"}
                url={`/addAddressCompany`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-0">
                                {nameCompany}
                            </div>
                        </div>
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-3 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_OFFICE_ALIAS"
                                    value={"Address Name"}
                                />
                                <div className="ml-[6.7rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="COMPANY_OFFICE_ALIAS"
                                    type="text"
                                    name="COMPANY_OFFICE_ALIAS"
                                    value={data.COMPANY_OFFICE_ALIAS}
                                    className="mt-0"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_OFFICE_ALIAS",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Address Name"
                                />
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="COMPANY_OFFICE_PARENT_ID"
                                    value={"Address Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.COMPANY_OFFICE_PARENT_ID}
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_OFFICE_PARENT_ID",
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Parent --
                                    </option>
                                    {comboOffice?.map(
                                        (cOffice: any, i: number) => {
                                            return (
                                                <option
                                                    value={
                                                        cOffice.COMPANY_OFFICE_ID
                                                    }
                                                    key={i}
                                                >
                                                    {cOffice.text_combo}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="COMPANY_OFFICE_PHONENUMBER"
                                    value={"Phone Number"}
                                />
                                <TextInput
                                    id="COMPANY_OFFICE_PHONENUMBER"
                                    type="text"
                                    name="COMPANY_OFFICE_PHONENUMBER"
                                    value={data.COMPANY_OFFICE_PHONENUMBER}
                                    className="mt-0"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_OFFICE_PHONENUMBER",
                                            e.target.value
                                        );
                                    }}
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>
                        <div className="relative mt-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="COMPANY_OFFICE_ADDRESS"
                                value={"Location Detail"}
                            />
                            <div className="ml-[6.9rem] text-red-600">*</div>
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_DIVISION_DESCRIPTION"
                                name="COMPANY_DIVISION_DESCRIPTION"
                                defaultValue={data.COMPANY_OFFICE_ADDRESS}
                                onChange={(e: any) =>
                                    setData(
                                        "COMPANY_OFFICE_ADDRESS",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>
                        <div className=" relative lg:grid lg:grid-cols-2 lg:gap-4 mt-2 xs:grid xs:grid-cols-1 xs:gap-4">
                            <div>
                                <InputLabel
                                    className=""
                                    htmlFor="COMPANY_OFFICE_PROVINCE"
                                    value={"Province"}
                                />
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
                                    value={data.COMPANY_OFFICE_PROVINCE}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        getRegency(val);
                                        setData("COMPANY_OFFICE_PROVINCE", val);
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    className=""
                                    htmlFor="COMPANY_OFFICE_REGENCY"
                                    value={"Regency"}
                                />
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
                                    value={data.COMPANY_OFFICE_REGENCY}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        setData("COMPANY_OFFICE_REGENCY", val);
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>
                        <div className="relative mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_LOCATION_TYPE"
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
                                                                onChange={(e) =>
                                                                    handleCheckbox(
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
                                htmlFor="COMPANY_OFFICE_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_OFFICE_DESCRIPTION"
                                name="COMPANY_OFFICE_DESCRIPTION"
                                defaultValue={data.COMPANY_OFFICE_DESCRIPTION}
                                onChange={(e: any) =>
                                    setData(
                                        "COMPANY_OFFICE_DESCRIPTION",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* end modal add */}

            {/* modal detail */}
            <ModalToAction
                show={modal.view}
                onClose={() => {
                    // getCompanyOffice();
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={detailAddress.COMPANY_OFFICE_ALIAS}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[60%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailAddressCompany
                            setIsSuccess={setIsSuccess}
                            isSuccess={isSuccess}
                            idAddress={detailAddress.COMPANY_OFFICE_ID}
                            comboOffice={comboOffice}
                            wilayah={wilayah}
                            locationType={locationType}
                            setDetailAddress={setDetailAddress}
                            // divisionCombo={comboDivision}
                        />
                    </>
                }
            />
            {/* end modal detail */}

            <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => addAddressPopup(e)}
                        >
                            <span>Add Address</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="COMPANY_OFFICE_ALIAS"
                            type="text"
                            name="COMPANY_OFFICE_ALIAS"
                            value={searchOffice.COMPANY_OFFICE_ALIAS}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchOffice({
                                    ...searchOffice,
                                    COMPANY_OFFICE_ALIAS: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchOffice.COMPANY_OFFICE_ALIAS !== ""
                                    ) {
                                        getCompanyOffice();

                                        setSearchOffice({
                                            ...searchOffice,
                                            COMPANY_OFFICE_ALIAS: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Address Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchAddress()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchAddress()}
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
                            searchParam={null}
                            // loading={isLoading.get_policy}
                            url={"getOfficeCompany"}
                            doubleClickEvent={handleClickDetailCompanyOffice}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Company Address",
                                    field: "COMPANY_OFFICE_ALIAS",
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
