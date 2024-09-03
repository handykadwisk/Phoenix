import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
// import DetailDivision from "./DetailDivision";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import DetailDivisionCompany from "./DetailDivisionCompany";

export default function DivisionCompany({
    idCompany,
    // setIsSuccess,
    // isSuccess,
    nameCompany,
}: PropsWithChildren<{
    idCompany: any;
    // setIsSuccess: any | string | null;
    // isSuccess: any | string | null;
    nameCompany: string;
}>) {
    useEffect(() => {
        getDivision();
    }, []);

    const [dataDivision, setDataDivision] = useState<any>([]);

    const [detailDivision, setDetailDivision] = useState<any>({
        COMPANY_DIVISION_ID: "",
        COMPANY_DIVISION_NAME: "",
    });
    const [comboDivision, setComboDivision] = useState<any>([]);

    const getDivision = async (pageNumber = "page=1") => {
        await axios
            .post(`/getDivision?${pageNumber}`, {
                idCompany,
                COMPANY_DIVISION_ALIAS: searchDivision.COMPANY_DIVISION_ALIAS,
            })
            .then((res) => {
                setDataDivision(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDivisionCombo = async (id: string) => {
        await axios
            .post(`/getDivisionComboCompany`, { id })
            .then((res) => {
                setComboDivision(res.data);
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

    const addDivisionPopup = async (e: FormEvent) => {
        e.preventDefault();

        getDivisionCombo(idCompany);
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
        COMPANY_DIVISION_ALIAS: "",
        COMPANY_DIVISION_INITIAL: "",
        COMPANY_DIVISION_DESCRIPTION: "",
        COMPANY_DIVISION_PARENT_ID: "",
        COMPANY_ID: idCompany,
        COMPANY_DIVISION_MAPPING: "",
        COMPANY_DIVISION_CREATED_BY: "",
        COMPANY_DIVISION_CREATED_DATE: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setData({
                COMPANY_DIVISION_NAME: "",
                COMPANY_DIVISION_ALIAS: "",
                COMPANY_DIVISION_INITIAL: "",
                COMPANY_DIVISION_DESCRIPTION: "",
                COMPANY_DIVISION_PARENT_ID: "",
                COMPANY_ID: idCompany,
                COMPANY_DIVISION_MAPPING: "",
                COMPANY_DIVISION_CREATED_BY: "",
                COMPANY_DIVISION_CREATED_DATE: "",
            });
            getDivision();
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleClickDetailCompanyDivision = async (data: any) => {
        getDivisionCombo(idCompany);
        setDetailDivision({
            COMPANY_DIVISION_ID: data.COMPANY_DIVISION_ID,
            COMPANY_DIVISION_NAME: data.COMPANY_DIVISION_ALIAS,
        });
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };

    const [searchDivision, setSearchDivision] = useState<any>({
        company_division: [
            {
                COMPANY_DIVISION_NAME: "",
                COMPANY_DIVISION_ID: "",
                flag: "",
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchDivision.company_division];
        changeVal[i][name] = value;
        setSearchDivision({
            ...searchDivision,
            company_division: changeVal,
        });
    };
    const [refreshGrid, setRefreshGrid] = useState<any>("");
    // search
    const clearSearchDivision = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("COMPANY_DIVISION_NAME", "", 0);
        inputDataSearch("flag", "", 0);
        setRefreshGrid("success");
        setTimeout(() => {
            setRefreshGrid("");
        }, 1000);
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
                title={"Add Division"}
                url={`/addDivisionCompany`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-2">
                                {nameCompany}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_DIVISION_ALIAS"
                                    value={"Division Name"}
                                />
                                <div className="ml-[6.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="COMPANY_DIVISION_ALIAS"
                                    type="text"
                                    name="COMPANY_DIVISION_ALIAS"
                                    value={data.COMPANY_DIVISION_ALIAS}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_DIVISION_ALIAS",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Division Name"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_DIVISION_INITIAL"
                                    value={"Initial"}
                                />
                                <div className="ml-[2.6rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="COMPANY_DIVISION_INITIAL"
                                    type="text"
                                    name="COMPANY_DIVISION_INITIAL"
                                    value={data.COMPANY_DIVISION_INITIAL}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_DIVISION_INITIAL",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Initial"
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_DIVISION_PARENT_ID"
                                value={"Parent Division"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.COMPANY_DIVISION_PARENT_ID}
                                onChange={(e) => {
                                    setData(
                                        "COMPANY_DIVISION_PARENT_ID",
                                        e.target.value
                                    );
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {comboDivision?.map(
                                    (comboDivision: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    comboDivision.COMPANY_DIVISION_ID
                                                }
                                                key={i}
                                            >
                                                {comboDivision.text_combo}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="COMPANY_DIVISION_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_DIVISION_DESCRIPTION"
                                name="COMPANY_DIVISION_DESCRIPTION"
                                defaultValue={data.COMPANY_DIVISION_DESCRIPTION}
                                onChange={(e: any) =>
                                    setData(
                                        "COMPANY_DIVISION_DESCRIPTION",
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
                    getDivision();
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={detailDivision.COMPANY_DIVISION_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailDivisionCompany
                            setIsSuccess={setIsSuccess}
                            isSuccess={isSuccess}
                            idDivision={detailDivision.COMPANY_DIVISION_ID}
                            divisionCombo={comboDivision}
                            setDetailDivision={setDetailDivision}
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
                            onClick={(e) => addDivisionPopup(e)}
                        >
                            <span>Add Division</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="PERSON_FIRST_NAME"
                            type="text"
                            name="PERSON_FIRST_NAME"
                            value={
                                searchDivision.company_division[0]
                                    .COMPANY_DIVISION_NAME === ""
                                    ? ""
                                    : searchDivision.company_division[0]
                                          .COMPANY_DIVISION_NAME
                            }
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch(
                                    "COMPANY_DIVISION_NAME",
                                    e.target.value,
                                    0
                                );
                                if (
                                    searchDivision.company_division[0]
                                        .COMPANY_DIVISION_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            placeholder="Search Division Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchDivision.company_division[0]
                                            .COMPANY_DIVISION_NAME === ""
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
                                onClick={(e) => clearSearchDivision(e)}
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
                            searchParam={searchDivision.company_division}
                            // loading={isLoading.get_policy}
                            url={"getDivisionCompany"}
                            doubleClickEvent={handleClickDetailCompanyDivision}
                            triggeringRefreshData={refreshGrid}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Company Division Name",
                                    field: "COMPANY_DIVISION_ALIAS",
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
