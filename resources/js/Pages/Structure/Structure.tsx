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
import DetailStructure from "./DetailStructure";
import ToastMessage from "@/Components/ToastMessage";

export default function Structure({
    auth,
    idRelation,
    nameRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
    nameRelation: any;
}>) {
    useEffect(() => {
        getStructure();
    }, []);
    const [isSuccess, setIsSuccess] = useState<string>("");

    const [dataStructure, setDataStructure] = useState<any>([]);
    const [grade, setGrade] = useState<any>([]);
    const [structureCombo, setSetStructureCombo] = useState<any>([]);
    const [searchStructure, setSearchStructure] = useState<any>({
        RELATION_STRUCTURE_ALIAS: "",
    });
    const [detailStructure, setDetailStructure] = useState<any>({
        RELATION_STRUCTURE_NAME: "",
        RELATION_STRUCTURE_ID: "",
    });

    // for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const getStructureCombo = async (id: string) => {
        await axios
            .post(`/getStructureCombo`, { id })
            .then((res) => {
                setSetStructureCombo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getGrade = async () => {
        await axios
            .post(`/getGrade`)
            .then((res) => {
                setGrade(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addStructurePopup = async (e: FormEvent) => {
        e.preventDefault();

        getGrade();
        getStructureCombo(idRelation);
        setModal({
            add: !modal.add,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    };

    const getStructure = async (pageNumber = "page=1") => {
        await axios
            .post(`/getStructure?${pageNumber}`, {
                idRelation,
                RELATION_STRUCTURE_ALIAS:
                    searchStructure.RELATION_STRUCTURE_ALIAS,
            })
            .then((res) => {
                setDataStructure(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const { data, setData, errors, reset } = useForm<any>({
        RELATION_STRUCTURE_NAME: "",
        RELATION_STRUCTURE_ALIAS: "",
        RELATION_STRUCTURE_DESCRIPTION: "",
        RELATION_STRUCTURE_PARENT_ID: "",
        RELATION_ORGANIZATION_ID: idRelation,
        RELATION_STRUCTURE_MAPPING: "",
        RELATION_GRADE_ID: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setData({
                RELATION_STRUCTURE_NAME: "",
                RELATION_STRUCTURE_ALIAS: "",
                RELATION_STRUCTURE_DESCRIPTION: "",
                RELATION_STRUCTURE_PARENT_ID: "",
                RELATION_ORGANIZATION_ID: idRelation,
                RELATION_STRUCTURE_MAPPING: "",
                RELATION_GRADE_ID: "",
            });
            getStructure();
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        // Swal.fire({
        //     title: "Success",
        //     text: "New Relation Structure",
        //     icon: "success",
        // }).then((result: any) => {
        //     if (result.value) {
        //         // setGetDetailRelation({
        //         //     RELATION_ORGANIZATION_NAME: message[1],
        //         //     RELATION_ORGANIZATION_ID: message[0],
        //         // });
        //         // setModal({
        //         //     add: false,
        //         //     delete: false,
        //         //     edit: false,
        //         //     view: true,
        //         //     document: false,
        //         //     search: false,
        //         // });
        //     }
        // });
    };

    // search
    const clearSearchStructure = async (pageNumber = "page=1") => {
        await axios
            .post(`/getStructure?${pageNumber}`, {
                idRelation,
            })
            .then((res) => {
                setDataStructure(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // const clearSearchStructure = async (pageNumber = "page=1") => {
    //     await axios
    //         .post(`/getStructure?${pageNumber}`)
    //         .then((res) => {
    //             setRelations([]);
    //             setSearchRelation({
    //                 ...searchRelation,
    //                 RELATION_ORGANIZATION_NAME: "",
    //             });
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

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
                title={"Add Structure"}
                url={`/addStructure`}
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
                                htmlFor="RELATION_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-2">
                                {nameRelation}
                            </div>
                        </div>
                        <div className="xs:grid xs:grid-cols-1 xs:gap-4 mt-2 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_STRUCTURE_NAME"
                                    value={"Structure Name"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_STRUCTURE_NAME"
                                    type="text"
                                    name="RELATION_STRUCTURE_NAME"
                                    value={data.RELATION_STRUCTURE_ALIAS}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_STRUCTURE_ALIAS",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Structure Name"
                                />
                            </div>
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GRADE_ID"
                                    value={"Grade"}
                                />
                                <div className="ml-[3rem] text-red-600">*</div>
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.RELATION_GRADE_ID}
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_GRADE_ID",
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Grade --
                                    </option>
                                    {grade?.map((dGrade: any, i: number) => {
                                        return (
                                            <option
                                                value={dGrade.GRADE_ID}
                                                key={i}
                                            >
                                                {dGrade.GRADE_AKA}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="RELATION_STRUCTURE_PARENT_ID"
                                value={"Parent Structure"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.RELATION_STRUCTURE_PARENT_ID}
                                onChange={(e) => {
                                    setData(
                                        "RELATION_STRUCTURE_PARENT_ID",
                                        e.target.value
                                    );
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {structureCombo?.map(
                                    (comboStructure: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    comboStructure.RELATION_STRUCTURE_ID
                                                }
                                                key={i}
                                            >
                                                {comboStructure.text_combo}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="RELATION_STRUCTURE_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_STRUCTURE_DESCRIPTION"
                                name="RELATION_STRUCTURE_DESCRIPTION"
                                defaultValue={
                                    data.RELATION_STRUCTURE_DESCRIPTION
                                }
                                onChange={(e: any) =>
                                    setData(
                                        "RELATION_STRUCTURE_DESCRIPTION",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* end modal add */}

            {/* modal detail  */}
            <ModalToAction
                show={modal.view}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    getStructure();
                }}
                title={detailStructure.RELATION_STRUCTURE_NAME}
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
                        <DetailStructure
                            idStructure={detailStructure.RELATION_STRUCTURE_ID}
                            grade={grade}
                            structureCombo={structureCombo}
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
                            onClick={(e) => addStructurePopup(e)}
                        >
                            <span>Add Structure</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="RELATION_STRUCTURE_ALIAS"
                            type="text"
                            name="RELATION_STRUCTURE_ALIAS"
                            value={searchStructure.RELATION_STRUCTURE_ALIAS}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchStructure({
                                    ...searchStructure,
                                    RELATION_STRUCTURE_ALIAS: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchStructure.RELATION_STRUCTURE_ALIAS !==
                                        ""
                                    ) {
                                        getStructure();
                                        setSearchStructure({
                                            ...searchStructure,
                                            RELATION_STRUCTURE_ALIAS: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Structure Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                // onClick={() => clearSearchStructurer()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchStructure()}
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
                                        label={"No"}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={"min-w-[50px] bg-gray-200"}
                                        label={"Name Structure"}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg text-center"
                                        }
                                        label={"Grade"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataStructure.data?.map(
                                    (dStructure: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    getGrade();
                                                    getStructureCombo(
                                                        idRelation
                                                    );
                                                    setDetailStructure({
                                                        RELATION_STRUCTURE_NAME:
                                                            dStructure.RELATION_STRUCTURE_ALIAS,
                                                        RELATION_STRUCTURE_ID:
                                                            dStructure.RELATION_STRUCTURE_ID,
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
                                                    value={
                                                        dataStructure.from + i
                                                    }
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dStructure.RELATION_STRUCTURE_ALIAS
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dStructure.grade
                                                                    ?.GRADE_AKA
                                                            }
                                                        </>
                                                    }
                                                    className={"text-center"}
                                                />
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                        <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                            <Pagination
                                links={dataStructure.links}
                                fromData={dataStructure.from}
                                toData={dataStructure.to}
                                totalData={dataStructure.total}
                                clickHref={(url: string) =>
                                    getStructure(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
