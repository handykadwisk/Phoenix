import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import AddPersonPopup from "./AddPerson";
import DetailPersonPopup from "./DetailPerson";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";

export default function Structure({
    auth,
    idRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
}>) {
    useEffect(() => {
        getStructure();
    }, []);
    const [dataStructure, setDataStructure] = useState<any>([]);
    const [searchStructure, setSearchStructure] = useState<any>({
        RELATION_STRUCTURE_ALIAS: "",
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
                title={"Add Structure"}
                url={`/relation`}
                data={""}
                onSuccess={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                body={
                    <>
                        <span>add</span>
                    </>
                }
            />
            {/* end modal add */}
            <div className="grid grid-cols-4 gap-4 py-2">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                setModal({
                                    add: true,
                                    delete: false,
                                    edit: false,
                                    view: false,
                                    document: false,
                                    search: false,
                                });
                            }}
                        >
                            {"Add Structure"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[313px]">
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
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[60rem]">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                        <table className="w-full table-auto divide-y divide-gray-300">
                            <thead className="">
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <TableTH
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No"}
                                    />
                                    <TableTH
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Name Structure"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataStructure.data?.map(
                                    (dStructure: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    setGetDetailRelation({
                                                        RELATION_ORGANIZATION_NAME:
                                                            dStructure.RELATION_ORGANIZATION_NAME,
                                                        RELATION_ORGANIZATION_ID:
                                                            dStructure.RELATION_ORGANIZATION_ID,
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
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                        <div className="absolute bottom-0 w-[46.3rem] mb-2">
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
