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
// import DetailJobDescPopup from "./DetailJobDesc";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import DetailJobCompany from "./DetailJobCompany";

export default function JobCompany({
    auth,
    idCompany,
    nameCompany,
}: PropsWithChildren<{
    auth: any;
    idCompany: any;
    nameCompany: any;
}>) {
    // useEffect(() => {
    //     getJobDesc();
    // }, []);

    const [dataJobDesc, setDataJobDesc] = useState<any>([]);
    const [searchJobDesc, setSearchJobDesc] = useState<any>({
        COMPANY_JOBDESC_ALIAS: "",
    });

    const [detailJobDesc, setDetailJobDesc] = useState<any>({
        COMPANY_JOBDESC_ID: "",
        COMPANY_JOBDESC_ALIAS: "",
    });
    const [comboJobDesc, setComboJobDesc] = useState<any>([]);

    const getJobDesc = async (pageNumber = "page=1") => {
        await axios
            .post(`/getJobDesc?${pageNumber}`, {
                idCompany,
                COMPANY_JOBDESC_ALIAS: searchJobDesc.COMPANY_JOBDESC_ALIAS,
            })
            .then((res) => {
                setDataJobDesc(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getJobDescCombo = async (id: string) => {
        await axios
            .post(`/getJobDescCompanyCombo`, { id })
            .then((res) => {
                setComboJobDesc(res.data);
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

    const addJobDescPopup = async (e: FormEvent) => {
        e.preventDefault();

        // getLocationType(idCompany);
        getJobDescCombo(idCompany);
        // getWilayah();
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
        COMPANY_JOBDESC_ALIAS: "",
        COMPANY_JOBDESC_DESCRIPTION: "",
        COMPANY_JOBDESC_PARENT_ID: "",
        COMPANY_ID: idCompany,
        COMPANY_NAME: nameCompany,
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setData({
                COMPANY_JOBDESC_ALIAS: "",
                COMPANY_JOBDESC_DESCRIPTION: "",
                COMPANY_JOBDESC_PARENT_ID: "",
                COMPANY_ID: idCompany,
                COMPANY_NAME: nameCompany,
            });
            getJobDesc();
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const clearSearchJobDesc = async (pageNumber = "page=1") => {
        await axios
            .post(`/getJobDesc?${pageNumber}`, {
                idCompany,
            })
            .then((res) => {
                setDataJobDesc(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleClickDetailCompanyJob = async (data: any) => {
        getJobDescCombo(idCompany);
        setDetailJobDesc({
            COMPANY_JOBDESC_ID: data.COMPANY_JOBDESC_ID,
            COMPANY_JOBDESC_ALIAS: data.COMPANY_JOBDESC_ALIAS,
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
                title={"Add Job Desc"}
                url={`/addJobDescCompany`}
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
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_JOBDESC_ALIAS"
                                    value={"Job Desc"}
                                />
                                <div className="ml-[4.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="COMPANY_JOBDESC_ALIAS"
                                    type="text"
                                    name="COMPANY_JOBDESC_ALIAS"
                                    value={data.COMPANY_JOBDESC_ALIAS}
                                    className="mt-0"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_JOBDESC_ALIAS",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Job Desc"
                                />
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="COMPANY_JOBDESC_PARENT_ID"
                                    value={"Job Desc Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.COMPANY_JOBDESC_PARENT_ID}
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_JOBDESC_PARENT_ID",
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Parent --
                                    </option>
                                    {comboJobDesc?.map(
                                        (cOffice: any, i: number) => {
                                            return (
                                                <option
                                                    value={
                                                        cOffice.COMPANY_JOBDESC_ID
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
                        </div>
                        <div className="relative mt-2 mb-4">
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_JOBDESC_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_JOBDESC_DESCRIPTION"
                                name="COMPANY_JOBDESC_DESCRIPTION"
                                defaultValue={data.COMPANY_JOBDESC_DESCRIPTION}
                                onChange={(e: any) =>
                                    setData(
                                        "COMPANY_JOBDESC_DESCRIPTION",
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
                    getJobDesc();
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                }}
                title={detailJobDesc.COMPANY_JOBDESC_ALIAS}
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
                        <DetailJobCompany
                            setIsSuccess={setIsSuccess}
                            isSuccess={isSuccess}
                            idAddress={detailJobDesc.COMPANY_JOBDESC_ID}
                            comboJobDesc={comboJobDesc}
                            setDetailJobDesc={setDetailJobDesc}
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
                            onClick={(e) => addJobDescPopup(e)}
                        >
                            <span>Add Job Desc</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="COMPANY_JOBDESC_ALIAS"
                            type="text"
                            name="COMPANY_JOBDESC_ALIAS"
                            value={searchJobDesc.COMPANY_JOBDESC_ALIAS}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchJobDesc({
                                    ...searchJobDesc,
                                    COMPANY_JOBDESC_ALIAS: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchJobDesc.COMPANY_JOBDESC_ALIAS !==
                                        ""
                                    ) {
                                        getJobDesc();
                                        setSearchJobDesc({
                                            ...searchJobDesc,
                                            COMPANY_JOBDESC_ALIAS: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Job Desc Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchJobDesc()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchJobDesc()}
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
                            url={"getJobDescCompany"}
                            doubleClickEvent={handleClickDetailCompanyJob}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Company Job Desc",
                                    field: "COMPANY_JOBDESC_ALIAS",
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
