import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import SelectTailwind from "react-tailwindcss-select";
import Input from "@/Components/Input";
import DatePicker from "react-datepicker";
import Checkbox from "@/Components/Checkbox";

export default function DetailDocumentRelation({
    idRelation,
    dataRelationNew,
    handleSuccessEditDocument,
    setIsSuccess,
    isSuccess,
}: PropsWithChildren<{
    idRelation: any;
    dataRelationNew: any;
    handleSuccessEditDocument: any;
    setIsSuccess: any;
    isSuccess: any;
}>) {
    const [modalEditDocument, setModalEditDocument] = useState<any>({
        edit: false,
    });

    const [dataDocumentPks, setDataDocumentPks] = useState<any>({
        no_pks: [],
    });

    const handleEditDocument = async (e: FormEvent) => {
        e.preventDefault();

        setModalEditDocument({
            edit: !modalEditDocument.edit,
        });

        setDataDocumentPks({
            ...dataDocumentPks,
            no_pks: [],
        });
    };

    const dataFor = [
        {
            value: "1",
            label: "Agent",
        },
        {
            value: "2",
            label: "FBI By PKS",
        },
    ];

    const pksSelect = dataFor?.map((query: any) => {
        return {
            value: query.value,
            label: query.label,
        };
    });

    const inputDataPKS = (
        name: string,
        value: string | undefined | File,
        i: number
    ) => {
        const changeVal: any = [...dataDocumentPks.no_pks];
        changeVal[i][name] = value;
        setDataDocumentPks({
            ...dataDocumentPks,
            no_pks: changeVal,
        });
    };

    const handleCheckboxEnding = (e: any, i: number) => {
        if (e.target.checked) {
            const changeVal: any = [...dataDocumentPks.no_pks];
            changeVal[i]["ENDING_BY_CANCEL"] = 0;
            setDataDocumentPks({
                ...dataDocumentPks,
                no_pks: changeVal,
            });
        } else {
            const changeVal: any = [...dataDocumentPks.no_pks];
            changeVal[i]["ENDING_BY_CANCEL"] = 1;
            setDataDocumentPks({
                ...dataDocumentPks,
                no_pks: changeVal,
            });
        }
    };

    const inputDataSwitchPKS = (e: any, i: number) => {
        if (e.target.checked) {
            const changeVal: any = [...dataDocumentPks.no_pks];
            changeVal[i]["STATUS_PKS"] = 0;
            setDataDocumentPks({
                ...dataDocumentPks,
                no_pks: changeVal,
            });
        } else {
            const changeVal: any = [...dataDocumentPks.no_pks];
            changeVal[i]["STATUS_PKS"] = 1;
            setDataDocumentPks({
                ...dataDocumentPks,
                no_pks: changeVal,
            });
        }
    };

    const addRowPKS = (e: FormEvent) => {
        e.preventDefault();

        setDataDocumentPks({
            ...dataDocumentPks,
            no_pks: [
                ...dataDocumentPks.no_pks,
                {
                    FOR_PKS: "",
                    NO_PKS: "",
                    STAR_DATE_PKS: "",
                    END_DATE_PKS: "",
                    DOCUMENT_PKS_ID: "",
                    STATUS_PKS: 0,
                    REMARKS_PKS: "",
                    ENDING_BY_CANCEL: 0,
                    RELATION_ORGANIZATION_ID: idRelation,
                },
            ],
        });
    };
    return (
        <>
            {" "}
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* modal add document fbi dan agent */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEditDocument.edit}
                onClose={() => {
                    setModalEditDocument({
                        edit: false,
                    });
                }}
                title={"Add Document"}
                url={`/editDocumentPks`}
                data={dataDocumentPks}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                onSuccess={handleSuccessEditDocument}
                body={
                    <>
                        <div>
                            {dataDocumentPks.no_pks?.map(
                                (noPKS: any, i: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-6 gap-3 mt-2"
                                            key={i}
                                        >
                                            <div className="col-span-5">
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="relative">
                                                        <InputLabel
                                                            value="PKS For"
                                                            required={true}
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
                                                            options={pksSelect}
                                                            isSearchable={true}
                                                            placeholder={
                                                                "--Choose Type--"
                                                            }
                                                            value={
                                                                noPKS.FOR_PKS
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
                                                                inputDataPKS(
                                                                    "FOR_PKS",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            value="No PKS"
                                                            required={true}
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={noPKS.NO_PKS}
                                                            className="mt-1"
                                                            onChange={(e) =>
                                                                inputDataPKS(
                                                                    "NO_PKS",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            placeholder="No. PKS"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            value="Document PKS"
                                                            required={true}
                                                        />
                                                        <Input
                                                            type="file"
                                                            onChange={(
                                                                e: any
                                                            ) => {
                                                                inputDataPKS(
                                                                    "DOCUMENT_PKS_ID",
                                                                    e.target
                                                                        .files[0],
                                                                    i
                                                                );
                                                            }}
                                                            className="mt-1 bg-white ring-white shadow-xl"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 mt-2">
                                                    <div className="col-span-2">
                                                        <InputLabel
                                                            value="Remarks"
                                                            required={false}
                                                        />
                                                        <TextArea
                                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 h-[179px]"
                                                            id="relation_description"
                                                            name="relation_description"
                                                            defaultValue={
                                                                noPKS.REMARKS_PKS
                                                            }
                                                            onChange={(
                                                                e: any
                                                            ) =>
                                                                inputDataPKS(
                                                                    "REMARKS_PKS",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            value="Date"
                                                            required={false}
                                                        />
                                                        <div className="mt-1 grid grid-cols-1">
                                                            <div className="relative max-w-sm">
                                                                <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                                    popperPlacement="top-end"
                                                                    selected={
                                                                        noPKS.STAR_DATE_PKS
                                                                    }
                                                                    onChange={(
                                                                        date: any
                                                                    ) => {
                                                                        inputDataPKS(
                                                                            "STAR_DATE_PKS",
                                                                            date.toLocaleDateString(
                                                                                "en-CA"
                                                                            ),
                                                                            i
                                                                        );
                                                                    }}
                                                                    className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                                    dateFormat={
                                                                        "dd-MM-yyyy"
                                                                    }
                                                                    placeholderText="Star Date ( dd-mm-yyyy )"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div>
                                                                <ul
                                                                    role="list"
                                                                    className="mt-2 mb-1 w-full"
                                                                >
                                                                    <li className="col-span-1 flex rounded-md shadow-sm">
                                                                        <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                                            <Checkbox
                                                                                // className={
                                                                                //     noPKS.ENDING_BY_CANCEL ===
                                                                                //     0
                                                                                //         ? "checked"
                                                                                //         : ""
                                                                                // }
                                                                                defaultChecked={
                                                                                    noPKS.ENDING_BY_CANCEL ===
                                                                                    0
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleCheckboxEnding(
                                                                                        e,
                                                                                        i
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                                            <div className="flex-1 truncate px-1 py-2 text-xs">
                                                                                <span className="text-gray-900">
                                                                                    {
                                                                                        "Ending By Cancel"
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        {noPKS.ENDING_BY_CANCEL ===
                                                        0 ? null : (
                                                            <div className="">
                                                                <div className="relative max-w-sm grid grid-cols-1">
                                                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-1 pointer-events-none">
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
                                                                        popperPlacement="top-end"
                                                                        selected={
                                                                            noPKS.END_DATE_PKS
                                                                        }
                                                                        onChange={(
                                                                            date: any
                                                                        ) => {
                                                                            inputDataPKS(
                                                                                "END_DATE_PKS",
                                                                                date.toLocaleDateString(
                                                                                    "en-CA"
                                                                                ),
                                                                                i
                                                                            );
                                                                        }}
                                                                        className="border-0 rounded-md shadow-md text-sm mt-1 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                                        dateFormat={
                                                                            "dd-MM-yyyy"
                                                                        }
                                                                        placeholderText="End Date ( dd-mm-yyyy )"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="text-sm mt-4 flex">
                                                            <div className="-rotate-90">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        defaultChecked={
                                                                            noPKS.STATUS_PKS ===
                                                                            0
                                                                        }
                                                                        id={i.toString()}
                                                                        onChange={(
                                                                            e: any
                                                                        ) => {
                                                                            inputDataSwitchPKS(
                                                                                e,
                                                                                i
                                                                            );
                                                                        }}
                                                                    />
                                                                    <span className="slider round"></span>
                                                                </label>
                                                            </div>
                                                            <div className="-ml-3">
                                                                <div className="text-sm mb-1">
                                                                    <span>
                                                                        Current
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span>
                                                                        Lapse
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-span-1 flex justify-start items-center hover:cursor-pointer w-fit h-fit m-auto"
                                                title="Delete Row PKS"
                                                onClick={() => {
                                                    const updatedData =
                                                        dataDocumentPks.no_pks.filter(
                                                            (
                                                                data: any,
                                                                a: number
                                                            ) => a !== i
                                                        );
                                                    setDataDocumentPks({
                                                        ...dataDocumentPks,
                                                        no_pks: updatedData,
                                                    });
                                                }}
                                            >
                                                <span>
                                                    <XMarkIcon className="w-7 text-red-600" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                            <div
                                className="w-fit text-sm mt-1 text-gray-600 hover:cursor-pointer hover:underline"
                                onClick={(e: any) => {
                                    addRowPKS(e);
                                }}
                            >
                                + Add Row PKS
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal add document fbi dan agent */}
            <div className="h-[100vh]">
                {dataRelationNew.m_relation_type.find(
                    (f: any) => f.RELATION_TYPE_ID === 3
                ) &&
                dataRelationNew.m_relation_type.find(
                    (f: any) => f.RELATION_TYPE_ID === 13
                ) ? (
                    <div className="bg-white rounded-md shadow-md mb-2 p-2">
                        {/* for Document PKS */}
                        <div className="flex justify-between items-center">
                            <div className="border-b-2 border-red-600 font-semibold">
                                <span>Document PKS Agent</span>
                            </div>
                            <div
                                className="bg-red-600 p-2 rounded-md shadow-md text-white cursor-pointer hover:bg-red-400"
                                onClick={(e: FormEvent) => {
                                    handleEditDocument(e);
                                }}
                            >
                                <span>
                                    <PencilSquareIcon className="w-5" />
                                </span>
                            </div>
                        </div>
                        {/* ag grid Document PKS Agent */}
                        <div className="mt-2 ag-grid-layout">
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={idRelation}
                                searchParam={""}
                                // loading={isLoading.get_policy}
                                url={"getDocumentPKSAgent"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={isSuccess}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "No. PKS Agent",
                                        field: "NO_PKS",
                                        flex: 11,
                                    },
                                    {
                                        headerName: "Document",
                                        field: "DOCUMENT_ORIGINAL_NAME",
                                        flex: 11,
                                    },
                                ]}
                            />
                        </div>
                        {/* for Document PKS */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="border-b-2 border-red-600 font-semibold">
                                <span>Document PKS FBI By PKS</span>
                            </div>
                            <div
                                className="bg-red-600 p-2 rounded-md shadow-md text-white cursor-pointer hover:bg-red-400"
                                onClick={(e: FormEvent) => {
                                    handleEditDocument(e);
                                }}
                            >
                                <span>
                                    <PencilSquareIcon className="w-5" />
                                </span>
                            </div>
                        </div>
                        {/* ag grid Document PKS FBI */}
                        <div className="mt-2 ag-grid-layout">
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={idRelation}
                                searchParam={""}
                                // loading={isLoading.get_policy}
                                url={"getDocumentPKSFbi"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={isSuccess}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "No. PKS FBI By PKS",
                                        field: "NO_PKS",
                                        flex: 11,
                                    },
                                    {
                                        headerName: "Document",
                                        field: "DOCUMENT_ORIGINAL_NAME",
                                        flex: 11,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : dataRelationNew.m_relation_type.find(
                      (f: any) => f.RELATION_TYPE_ID === 3
                  ) ? (
                    <div className="bg-white rounded-md shadow-md mb-2 p-2">
                        {/* for Document PKS */}
                        <div className="flex justify-between items-center">
                            <div className="border-b-2 border-red-600 font-semibold">
                                <span>Document PKS Agent</span>
                            </div>
                            <div
                                className="bg-red-600 p-2 rounded-md shadow-md text-white cursor-pointer hover:bg-red-400"
                                onClick={(e: FormEvent) => {
                                    handleEditDocument(e);
                                }}
                            >
                                <span>
                                    <PencilSquareIcon className="w-5" />
                                </span>
                            </div>
                        </div>
                        {/* ag grid Document PKS Agent */}
                        <div className="mt-2 ag-grid-layout">
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={idRelation}
                                searchParam={""}
                                // loading={isLoading.get_policy}
                                url={"getDocumentPKSAgent"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={isSuccess}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "No. PKS Agent",
                                        field: "NO_PKS",
                                        flex: 11,
                                    },
                                    {
                                        headerName: "Document",
                                        field: "DOCUMENT_ORIGINAL_NAME",
                                        flex: 11,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : dataRelationNew.m_relation_type.find(
                      (f: any) => f.RELATION_TYPE_ID === 13
                  ) ? (
                    <div className="bg-white rounded-md shadow-md mb-2 p-2">
                        <div className="flex justify-between items-center">
                            <div className="border-b-2 border-red-600 font-semibold">
                                <span>Document PKS FBI By PKS</span>
                            </div>
                            <div
                                className="bg-red-600 p-2 rounded-md shadow-md text-white cursor-pointer hover:bg-red-400"
                                onClick={(e: FormEvent) => {
                                    handleEditDocument(e);
                                }}
                            >
                                <span>
                                    <PencilSquareIcon className="w-5" />
                                </span>
                            </div>
                        </div>
                        {/* ag grid Document PKS FBI */}
                        <div className="mt-2 ag-grid-layout">
                            <AGGrid
                                addButtonLabel={undefined}
                                addButtonModalState={undefined}
                                withParam={idRelation}
                                searchParam={""}
                                // loading={isLoading.get_policy}
                                url={"getDocumentPKSFbi"}
                                doubleClickEvent={undefined}
                                triggeringRefreshData={isSuccess}
                                colDefs={[
                                    {
                                        headerName: "No.",
                                        valueGetter: "node.rowIndex + 1",
                                        flex: 1,
                                    },
                                    {
                                        headerName: "No. PKS FBI By PKS",
                                        field: "NO_PKS",
                                        flex: 11,
                                    },
                                    {
                                        headerName: "Document",
                                        field: "DOCUMENT_ORIGINAL_NAME",
                                        flex: 11,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-red-400">
                            <span>Document No Exist!</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
