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
import DetailJobDescPopup from "./DetailJobDesc";
import ToastMessage from "@/Components/ToastMessage";

export default function JobDesk({
    auth,
    idRelation,
    nameRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
    nameRelation: any;
}>) {
    useEffect(() => {
        getJobDesc();
    }, []);

    const [dataJobDesc, setDataJobDesc] = useState<any>([]);
    const [searchJobDesc, setSearchJobDesc] = useState<any>({
        RELATION_JOBDESC_ALIAS: "",
    });

    const [detailJobDesc, setDetailJobDesc] = useState<any>({
        RELATION_JOBDESC_ID: "",
        RELATION_JOBDESC_ALIAS: "",
    });
    const [comboJobDesc, setComboJobDesc] = useState<any>([]);

    const getJobDesc = async (pageNumber = "page=1") => {
        await axios
            .post(`/getJobDesc?${pageNumber}`, {
                idRelation,
                RELATION_JOBDESC_ALIAS: searchJobDesc.RELATION_JOBDESC_ALIAS,
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
            .post(`/getJobDescCombo`, { id })
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

        // getLocationType(idRelation);
        getJobDescCombo(idRelation);
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
        RELATION_JOBDESC_ALIAS: "",
        RELATION_JOBDESC_DESCRIPTION: "",
        RELATION_JOBDESC_PARENT_ID: "",
        RELATION_ORGANIZATION_ID: idRelation,
        RELATION_ORGANIZATION_ALIAS: nameRelation,
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setData({
                RELATION_JOBDESC_ALIAS: "",
                RELATION_JOBDESC_DESCRIPTION: "",
                RELATION_JOBDESC_PARENT_ID: "",
                RELATION_ORGANIZATION_ID: idRelation,
                RELATION_ORGANIZATION_ALIAS: nameRelation,
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
                idRelation,
            })
            .then((res) => {
                setDataJobDesc(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
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
                url={`/addJobDesc`}
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
                                htmlFor="RELATION_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-0">
                                {nameRelation}
                            </div>
                        </div>
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_JOBDESC_ALIAS"
                                    value={"Job Desc"}
                                />
                                <div className="ml-[4.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_JOBDESC_ALIAS"
                                    type="text"
                                    name="RELATION_JOBDESC_ALIAS"
                                    value={data.RELATION_JOBDESC_ALIAS}
                                    className="mt-0"
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_JOBDESC_ALIAS",
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
                                    htmlFor="RELATION_JOBDESC_PARENT_ID"
                                    value={"Job Desc Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.RELATION_JOBDESC_PARENT_ID}
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_JOBDESC_PARENT_ID",
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
                                                        cOffice.RELATION_JOBDESC_ID
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
                                htmlFor="RELATION_JOBDESC_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_JOBDESC_DESCRIPTION"
                                name="RELATION_JOBDESC_DESCRIPTION"
                                defaultValue={data.RELATION_JOBDESC_DESCRIPTION}
                                onChange={(e: any) =>
                                    setData(
                                        "RELATION_JOBDESC_DESCRIPTION",
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
                title={detailJobDesc.RELATION_JOBDESC_ALIAS}
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
                        <DetailJobDescPopup
                            idAddress={detailJobDesc.RELATION_JOBDESC_ID}
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
                            id="RELATION_JOBDESC_ALIAS"
                            type="text"
                            name="RELATION_JOBDESC_ALIAS"
                            value={searchJobDesc.RELATION_JOBDESC_ALIAS}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchJobDesc({
                                    ...searchJobDesc,
                                    RELATION_JOBDESC_ALIAS: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchJobDesc.RELATION_JOBDESC_ALIAS !==
                                        ""
                                    ) {
                                        getJobDesc();
                                        setSearchJobDesc({
                                            ...searchJobDesc,
                                            RELATION_JOBDESC_ALIAS: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Job Desc Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchJobDesc.RELATION_JOBDESC_ALIAS !==
                                        ""
                                    ) {
                                        getJobDesc();
                                        setSearchJobDesc({
                                            ...searchJobDesc,
                                            RELATION_JOBDESC_ALIAS: "",
                                        });
                                    }
                                }}
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
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[60rem] xs:mt-4 lg:mt-0">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
                        <table className="w-full table-auto divide-y divide-gray-300">
                            <thead className="">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Name Job Desc"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataJobDesc.data?.map(
                                    (dOffice: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    getJobDescCombo(idRelation);
                                                    setDetailJobDesc({
                                                        RELATION_JOBDESC_ID:
                                                            dOffice.RELATION_JOBDESC_ID,
                                                        RELATION_JOBDESC_ALIAS:
                                                            dOffice.RELATION_JOBDESC_ALIAS,
                                                    });
                                                    setModal({
                                                        add: false,
                                                        delete: false,
                                                        edit: false,
                                                        view: true,
                                                        document: false,
                                                        search: false,
                                                    });
                                                }}
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? "cursor-pointer"
                                                        : "bg-gray-100 cursor-pointer"
                                                }
                                            >
                                                <TableTD
                                                    value={dataJobDesc.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dOffice.RELATION_JOBDESC_ALIAS
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
                            links={dataJobDesc.links}
                            fromData={dataJobDesc.from}
                            toData={dataJobDesc.to}
                            totalData={dataJobDesc.total}
                            clickHref={(url: string) =>
                                getJobDesc(url.split("?").pop())
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
