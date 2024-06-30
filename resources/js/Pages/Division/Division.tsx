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
import DetailDivision from "./DetailDivision";

export default function Division({
    auth,
    idRelation,
    nameRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
    nameRelation: any;
}>) {
    useEffect(() => {
        getDivision();
    }, []);

    const [dataDivision, setDataDivision] = useState<any>([]);
    const [searchDivision, setSearchDivision] = useState<any>({
        RELATION_DIVISION_ALIAS: "",
    });

    const [detailDivision, setDetailDivision] = useState<any>({
        RELATION_DIVISION_ID: "",
        RELATION_DIVISION_NAME: "",
    });
    const [comboDivision, setComboDivision] = useState<any>([]);

    const getDivision = async (pageNumber = "page=1") => {
        await axios
            .post(`/getDivision?${pageNumber}`, {
                idRelation,
                RELATION_DIVISION_ALIAS: searchDivision.RELATION_DIVISION_ALIAS,
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
            .post(`/getDivisionCombo`, { id })
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

        getDivisionCombo(idRelation);
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
        RELATION_DIVISION_ALIAS: "",
        RELATION_DIVISION_INITIAL: "",
        RELATION_DIVISION_DESCRIPTION: "",
        RELATION_DIVISION_PARENT_ID: "",
        RELATION_ORGANIZATION_NAME: nameRelation,
        RELATION_ORGANIZATION_ID: idRelation,
        RELATION_DIVISION_MAPPING: "",
        RELATION_DIVISION_CREATED_BY: "",
        RELATION_DIVISION_CREATED_DATE: "",
    });

    const handleSuccess = (message: string) => {
        setData({
            RELATION_DIVISION_NAME: "",
            RELATION_DIVISION_ALIAS: "",
            RELATION_DIVISION_INITIAL: "",
            RELATION_DIVISION_DESCRIPTION: "",
            RELATION_DIVISION_PARENT_ID: "",
            RELATION_ORGANIZATION_NAME: nameRelation,
            RELATION_ORGANIZATION_ID: idRelation,
            RELATION_DIVISION_MAPPING: "",
            RELATION_DIVISION_CREATED_BY: "",
            RELATION_DIVISION_CREATED_DATE: "",
        });

        Swal.fire({
            title: "Success",
            text: "New Relation Division",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDivision();
                // setGetDetailRelation({
                //     RELATION_ORGANIZATION_NAME: message[1],
                //     RELATION_ORGANIZATION_ID: message[0],
                // });
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
    };
    return (
        <>
            {/* modal add */}
            <ModalToAdd
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
                url={`/addDivision`}
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
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_DIVISION_ALIAS"
                                    value={"Division Name"}
                                />
                                <div className="ml-[6.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_DIVISION_ALIAS"
                                    type="text"
                                    name="RELATION_DIVISION_ALIAS"
                                    value={data.RELATION_DIVISION_ALIAS}
                                    className="mt-2"
                                    autoComplete="RELATION_DIVISION_ALIAS"
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_DIVISION_ALIAS",
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
                                    htmlFor="RELATION_DIVISION_INITIAL"
                                    value={"Initial"}
                                />
                                <div className="ml-[2.6rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_DIVISION_INITIAL"
                                    type="text"
                                    name="RELATION_DIVISION_INITIAL"
                                    value={data.RELATION_DIVISION_INITIAL}
                                    className="mt-2"
                                    autoComplete="RELATION_DIVISION_INITIAL"
                                    onChange={(e) => {
                                        setData(
                                            "RELATION_DIVISION_INITIAL",
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
                                htmlFor="RELATION_DIVISION_PARENT_ID"
                                value={"Parent Division"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.RELATION_DIVISION_PARENT_ID}
                                onChange={(e) => {
                                    setData(
                                        "RELATION_DIVISION_PARENT_ID",
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
                                                    comboDivision.RELATION_DIVISION_ID
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
                                htmlFor="RELATION_DIVISION_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_DIVISION_DESCRIPTION"
                                name="RELATION_DIVISION_DESCRIPTION"
                                defaultValue={
                                    data.RELATION_DIVISION_DESCRIPTION
                                }
                                onChange={(e: any) =>
                                    setData(
                                        "RELATION_DIVISION_DESCRIPTION",
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
                title={detailDivision.RELATION_DIVISION_NAME}
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
                        <DetailDivision
                            idDivision={detailDivision.RELATION_DIVISION_ID}
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
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="RELATION_DIVISION_ALIAS"
                            type="text"
                            name="RELATION_DIVISION_ALIAS"
                            value={searchDivision.RELATION_DIVISION_ALIAS}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchDivision({
                                    ...searchDivision,
                                    RELATION_DIVISION_ALIAS: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchDivision.RELATION_DIVISION_ALIAS !==
                                        ""
                                    ) {
                                        getDivision();
                                        setSearchDivision({
                                            ...searchDivision,
                                            RELATION_DIVISION_ALIAS: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Division Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchRelation()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchRelation()}
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
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                    />
                                    <TableTH
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Name Division"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataDivision.data?.map(
                                    (dDivision: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    getDivisionCombo(
                                                        idRelation
                                                    );
                                                    setDetailDivision({
                                                        RELATION_DIVISION_ID:
                                                            dDivision.RELATION_DIVISION_ID,
                                                        RELATION_DIVISION_NAME:
                                                            dDivision.RELATION_DIVISION_ALIAS,
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
                                                        dataDivision.from + i
                                                    }
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dDivision.RELATION_DIVISION_ALIAS
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
                        <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                            <Pagination
                                links={dataDivision.links}
                                fromData={dataDivision.from}
                                toData={dataDivision.to}
                                totalData={dataDivision.total}
                                clickHref={(url: string) =>
                                    getDivision(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
