import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import AGGrid from "@/Components/AgGrid";
import { BeatLoader } from "react-spinners";

export default function DetailAgent({
    auth,
    // isSuccessNew,
    // setIsSuccessNew,
    idAgent,
}: PropsWithChildren<{
    auth: any;
    // isSuccessNew: any;
    idAgent: any;
    // setIsSuccessNew: any;
}>) {
    const [detailAgentNew, setDetailAgentNew] = useState<any>([]);
    const [relationAgent, setRelationAgent] = useState<any>([]);

    const [isSuccessNew, setIsSuccessNew] = useState<any>("");
    // console.log(dataAgent);
    // useEffect(() => {
    //     getMRelationAgent(idAgent);
    // }, [idAgent]);
    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    // get detail agent
    const getMRelationAgent = async (id: string) => {
        await axios
            .post(`/getMRelationAgent`, { id })
            .then((res) => {
                setDetailAgentNew(res.data);
                // setDataRelationById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // get detail agent
    const getRelationAgent = async () => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getRelationAgentSelect`)
            .then((res) => {
                setRelationAgent(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modalAgent, setModalAgent] = useState<any>({
        add: false,
    });

    // handle modal add relation agent
    const handleClickAddRelationAgent = async (
        // e: FormEvent,
        idRelationOrganization: string
    ) => {
        // e.preventDefault();
        getRelationAgent();
        setModalAgent({
            add: !modalAgent.false,
        });
    };

    const [dataRelation, setDataRelation] = useState<any>({
        idAgent: idAgent,
        name_relation: [],
    });
    const inputRefTag = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(true);

    const filteredTags = relationAgent.filter(
        (item: any) =>
            item.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase()?.includes(
                query.toLocaleLowerCase()?.trim()
            ) &&
            !dataRelation.name_relation?.includes(
                item.RELATION_ORGANIZATION_NAME
            )
    );

    const isDisableTag =
        !query?.trim() ||
        dataRelation.name_relation.filter(
            (item: any) =>
                item.name_relation?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;
    // console.log(dataRelation.name_relation);

    const handleSuccess = async (message: string) => {
        // if (modal.add) {
        setDataRelation({
            idAgent: idAgent,
            name_relation: [],
        });
        Swal.fire({
            title: "Success",
            text: "Relation Add",
            icon: "success",
        }).then((result: any) => {
            // console.log(message);
            if (result.value) {
                // getMRelationAgent(message[0]);
                setIsSuccessNew({
                    isSuccessNew: "success",
                });
            }
        });
    };

    const deleteProcess = async (id: string) => {
        await axios
            .post(`/deleteAgent`, { id })
            .then((res) => {
                setIsSuccessNew({
                    isSuccessNew: "success",
                });
                // console.log(id);
                // getMRelationAgent(idAgent);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteRelation = async (id: string) => {
        // console.log(data);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't delete this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProcess(id);
            }
        });
        // Swal.fire({
        //     title: "Success",
        //     text: "Images Change",
        //     icon: "success",
        // }).then((result: any) => {
        //     // console.log(result);
        //     if (result.value) {
        //         deleteProcess(id);
        //     }
        // });
    };
    const CustomButtonComponent = (props: any) => {
        return (
            <span>
                <XMarkIcon
                    className="w-7 text-red-500 cursor-pointer"
                    onClick={(e) =>
                        deleteRelation(props.data.M_RELATION_AGENT_ID)
                    }
                />
            </span>
        );
    };
    return (
        <>
            {/* daftar list agent */}
            {/* <div className="p-2 bg-red-600 w-fit mb-3 text-white rounded-md cursor-pointer">
                <span>+ Add</span>
            </div> */}
            {/* modal agent */}
            <ModalToAdd
                show={modalAgent.add}
                onClose={() =>
                    setModalAgent({
                        add: false,
                    })
                }
                title={"Add Relation Agent"}
                buttonAddOns={""}
                url={`/addMRelationAgent`}
                data={dataRelation}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="mt-4">
                            {dataRelation.name_relation?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {dataRelation.name_relation?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {tag}
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataRelation.name_relation.filter(
                                                                        (
                                                                            data: any
                                                                        ) =>
                                                                            data !==
                                                                            tag
                                                                    );
                                                                setDataRelation(
                                                                    {
                                                                        ...dataRelation,
                                                                        name_relation:
                                                                            updatedData,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </div>
                                                        {/* </a> */}
                                                    </div>
                                                </div>
                                                // </>
                                            );
                                        }
                                    )}
                                    <div className="w-full text-right">
                                        <span
                                            className="text-red-600 cursor-pointer hover:text-red-300 text-sm"
                                            onClick={() => {
                                                setDataRelation({
                                                    ...dataRelation,
                                                    name_relation: [],
                                                });
                                                inputRefTag.current?.focus();
                                            }}
                                        >
                                            Clear all
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                            <TextInput
                                ref={inputRefTag}
                                type="text"
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value.trimStart())
                                }
                                placeholder="Search Relations"
                                className=""
                                onFocus={() => setMenuOpen(true)}
                                // onBlur={() => setMenuOpen(false)}
                                // onKeyDown={(e) => {
                                //     if (e.key === "Enter" && !isDisableTag) {
                                //         setDataRelation((prev: any) => [
                                //             ...prev,
                                //             query,
                                //         ]);
                                //         setQuery("");
                                //         setMenuOpen(true);
                                //     }
                                // }}
                            />
                            {/* <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisableTag}
                                onClick={() => {
                                    if (isDisableTag) {
                                        return;
                                    }
                                    setDataRelation("relation_name", [
                                        ...dataRelation,
                                        {
                                            name_relation: query,
                                        },
                                    ]);
                                    setQuery("");
                                    inputRefTag.current?.focus();
                                    setMenuOpen(true);
                                }}
                            >
                                + Add
                            </button> */}
                            {menuOpen ? (
                                <div className="bg-white rounded-md shadow-md w-full max-h-72 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                                    {isLoading.get_detail ? (
                                        <div className="m-auto py-20 sweet-loading h-[199px]">
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
                                        <ul className="w-full">
                                            {filteredTags?.length ? (
                                                filteredTags?.map(
                                                    (tag: any, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                setMenuOpen(
                                                                    true
                                                                );
                                                                setDataRelation(
                                                                    {
                                                                        ...dataRelation,
                                                                        name_relation:
                                                                            [
                                                                                ...dataRelation.name_relation,
                                                                                tag.RELATION_ORGANIZATION_NAME,
                                                                            ],
                                                                    }
                                                                );
                                                                setQuery("");
                                                            }}
                                                        >
                                                            {
                                                                tag.RELATION_ORGANIZATION_NAME
                                                            }
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li className="p-2 text-gray-500">
                                                    No options available
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </>
                }
            />
            {/* end modal agent */}

            <div className="max-w-full h-[100%] mt-2">
                <AGGrid
                    searchParam={""}
                    // loading={isLoading.get_policy}
                    url={"getMRelationAgent"}
                    addButtonLabel={"Add Relation"}
                    withParam={idAgent}
                    addButtonModalState={() =>
                        handleClickAddRelationAgent(idAgent)
                    }
                    doubleClickEvent={undefined}
                    triggeringRefreshData={isSuccessNew}
                    colDefs={[
                        {
                            headerName: "No.",
                            valueGetter: "node.rowIndex + 1",
                            flex: 1,
                        },
                        {
                            headerName: "Relation Name",
                            field: "RELATION_ORGANIZATION_ALIAS",
                            flex: 7,
                            filter: "agTextColumnFilter",
                            filterParams: {
                                filterOptions: ["contains"],
                            },
                            floatingFilter: true,
                        },
                        {
                            field: "button",
                            cellRenderer: CustomButtonComponent,
                        },
                    ]}
                />
                {/* <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                    <table className="w-full table-auto divide-y divide-gray-300">
                        <thead className="">
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <TableTH
                                    className={
                                        "w-[10px] text-center bg-gray-200 rounded-tl-lg rounded-bl-lg"
                                    }
                                    label={"No"}
                                />
                                <TableTH
                                    className={"min-w-[50px] bg-gray-200"}
                                    label={"Name Relation Agent"}
                                />
                                <th className="flex justify-end items-center bg-gray-200 p-2 font-semibold">
                                    <div
                                        className="p-2 bg-red-600 w-fit text-white rounded-md cursor-pointer"
                                        onClick={(e) =>
                                            handleClickAddRelationAgent(
                                                e,
                                                idAgent
                                            )
                                        }
                                    >
                                        <span>+ Add</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailAgentNew?.length !== 0 ? (
                                detailAgentNew?.map(
                                    (dAgent: any, i: number) => {
                                        return (
                                            <tr
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? ""
                                                        : "bg-gray-100"
                                                }
                                            >
                                                <TableTD
                                                    onButton={() => {}}
                                                    value={i + 1 + "."}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    onButton={() => {}}
                                                    value={
                                                        <>
                                                            {
                                                                dAgent.relation
                                                                    .RELATION_ORGANIZATION_NAME
                                                            }
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <td
                                                    className="flex justify-center items-center"
                                                    colSpan={2}
                                                    onClick={(e) =>
                                                        deleteRelation(
                                                            dAgent.M_RELATION_AGENT_ID
                                                        )
                                                    }
                                                >
                                                    <XMarkIcon className="w-7 text-red-600" />
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            ) : (
                                <></>
                            )}
                        </tbody>
                    </table>
                    {detailAgentNew?.length === 0 && (
                        <div className="flex justify-center items-center">
                            No data result!
                        </div>
                    )}
                </div> */}
            </div>
        </>
    );
}
