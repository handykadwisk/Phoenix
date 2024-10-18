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
import DetailRelation from "./DetailRelation";

export default function DetailBaa({
    auth,
    // isSuccessBAA,
    // setIsSuccessBAA,
    idBaa,
}: PropsWithChildren<{
    auth: any;
    // isSuccessBAA: any;
    idBaa: any;
    // setIsSuccessBAA: any;
}>) {
    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    const [relationAgent, setRelationBAA] = useState<any>([]);
    const [isSuccessBAA, setIsSuccessBAA] = useState<any>("");
    const [dataRelation, setDataRelation] = useState<any>({
        idBaa: idBaa,
        name_relation: [],
    });

    // get detail agent
    const getRelationBAA = async () => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getRelationBaaSelect`)
            .then((res) => {
                setRelationBAA(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [modalBAA, setModalBAA] = useState<any>({
        add: false,
        relation: false,
    });

    // handle modal add relation agent
    const handleClickAddRelationBAA = async (
        // e: FormEvent,
        idRelationOrganization: string
    ) => {
        // e.preventDefault();
        getRelationBAA();
        setModalBAA({
            add: !modalBAA.false,
        });
    };

    const [detailRelation, setDetailRelation] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
    });

    // handle detail relation
    const handleDetailRelation = async (data: any) => {
        // getDivisionCombo(idRelation);
        setDetailRelation({
            RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
            RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_NAME,
        });
        setModalBAA({
            add: false,
            relation: true,
        });
    };

    const deleteProcess = async (id: string) => {
        await axios
            .post(`/deleteBaa`, { id })
            .then((res) => {
                setIsSuccessBAA({
                    isSuccessBAA: "success",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteRelation = async (id: string) => {
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
    };

    const CustomButtonComponent = (props: any) => {
        return (
            <span>
                <XMarkIcon
                    className="w-7 text-red-500 cursor-pointer"
                    onClick={(e) =>
                        deleteRelation(props.data.M_RELATION_BAA_ID)
                    }
                />
            </span>
        );
    };

    const handleSuccess = async (message: string) => {
        // if (modal.add) {
        setDataRelation({
            idBaa: idBaa,
            name_relation: [],
        });
        Swal.fire({
            title: "Success",
            text: "Relation Add",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                setIsSuccessBAA({
                    isSuccessBAA: "success",
                });
            }
        });
    };

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

    return (
        <>
            {/* modal agent */}
            <ModalToAdd
                show={modalBAA.add}
                onClose={() =>
                    setModalBAA({
                        add: false,
                    })
                }
                title={"Add Relation BAA"}
                buttonAddOns={""}
                url={`/addMRelationBaa`}
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

            {/* modal relation */}
            <ModalToAction
                show={modalBAA.relation}
                onClose={() =>
                    setModalBAA({
                        add: false,
                        relation: false,
                    })
                }
                title={detailRelation.RELATION_ORGANIZATION_NAME}
                url={""}
                data={""}
                onSuccess={null}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailRelation
                            auth={auth}
                            idRelation={detailRelation.RELATION_ORGANIZATION_ID}
                        />
                    </>
                }
            />
            {/* end modal relation */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-[100%]">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => handleClickAddRelationBAA(idBaa)}
                        >
                            <span>Add Relation</span>
                        </div>
                    </div>
                    {/* <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <TextInput
                            type="text"
                            value={searchAgent.RELATION_ORGANIZATION_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchAgent({
                                    ...searchAgent,
                                    RELATION_ORGANIZATION_NAME: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchAgent.RELATION_ORGANIZATION_NAME !==
                                        ""
                                    ) {
                                        getAgent();
                                    }
                                }
                            }}
                            placeholder="Search Agent Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                onClick={() => clearSearchAgent()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => clearSearchAgent()}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            searchParam={""}
                            // loading={isLoading.get_policy}
                            url={"getMRelationBAA"}
                            addButtonLabel={undefined}
                            withParam={idBaa}
                            addButtonModalState={undefined}
                            doubleClickEvent={handleDetailRelation}
                            triggeringRefreshData={isSuccessBAA}
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
                                    field: "Action",
                                    cellRenderer: CustomButtonComponent,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
