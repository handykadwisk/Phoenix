import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Button from "@/Components/Button/Button";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import { useEffect, useRef, useState } from "react";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import Swal from "sweetalert2";
import DetailRelationPopup from "./DetailRelation";
import AddRelationPopup from "./AddRelation";
import Select from "react-tailwindcss-select";

export default function Relation({ auth }: PageProps) {
    // useEffect(() => {
    //     getMappingParent("", "");
    // }, []);

    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    });

    const [getDetailRelation, setGetDetailRelation] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
        RELATION_SALUTATION_PRE: "",
        RELATION_SALUTATION_POST: "",
    });

    const [relations, setRelations] = useState<any>([]);
    const [salutations, setSalutations] = useState<any>([]);
    const [searchRelation, setSearchRelation] = useState<any>({
        RELATION_ORGANIZATION_NAME: "",
        RELATION_TYPE_ID: "",
    });

    const getRelation = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelation?${pageNumber}`, {
                RELATION_ORGANIZATION_NAME:
                    searchRelation.RELATION_ORGANIZATION_NAME,
                RELATION_TYPE_ID: searchRelation.RELATION_TYPE_ID.value,
            })
            .then((res) => {
                setRelations(res.data);
                if (modal.search) {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    setSearchRelation({
                        ...searchRelation,
                        RELATION_ORGANIZATION_NAME: "",
                        RELATION_TYPE_ID: "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const {
        flash,
        relation,
        relationGroup,
        salutation,
        relationType,
        relationStatus,
        relationLOB,
        mRelationType,
        profession,
        custom_menu,
    }: any = usePage().props;

    const [isSuccess, setIsSuccess] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mRelation, setMRelation] = useState<any>([]);
    const [switchPage, setSwitchPage] = useState(false);
    const [switchPageTBK, setSwitchPageTBK] = useState(false);

    const getMappingParent = async (name: string, column: string) => {
        // setIsLoading(true)

        // if (name) {
        await axios
            .post(`/getMappingParent`, { name, column })
            .then((res: any) => {
                setMappingParent({
                    mapping_parent: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getSalutationById`, { id, column })
                .then((res) => {
                    setSalutations(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (id == "1") {
            // jika corporate
            document.getElementById("relationLob").style.display = "";
            document.getElementById("relationJobs").style.display = "none";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
        }
    };

    const { data, setData, errors, reset } = useForm<any>({
        group_id: "",
        name_relation: "",
        parent_id: "",
        abbreviation: "",
        relation_aka: [],
        relation_email: "",
        relation_description: "",
        relation_lob_id: "",
        pre_salutation_id: "",
        post_salutation_id: "",
        relation_status_id: "",
        tagging_name: [],
        is_managed: "",
        mark_tbk_relation: "",
        profession_id: "",
        relation_type_id: [],
    });

    const [dataById, setDataById] = useState<any>({
        RELATION_ORGANIZATION_GROUP: "",
        RELATION_ORGANIZATION_NAME: "",
        RELATION_ORGANIZATION_PARENT_ID: "",
        RELATION_ORGANIZATION_ABBREVIATION: "",
        RELATION_ORGANIZATION_AKA: "",
        RELATION_ORGANIZATION_EMAIL: "",
        relation_description: "",
        RELATION_PROFESSION_ID: "",
        RELATION_LOB_ID: "",
        PRE_SALUTATION: "",
        POST_SALUTATION: "",
        relation_status_id: "",
        TAG_NAME: "",
        HR_MANAGED_BY_APP: "",
        MARK_TBK_RELATION: "",
        m_relation_type: [
            {
                RELATION_ORGANIZATION_TYPE_ID: "",
                RELATION_ORGANIZATION_ID: "",
                RELATION_TYPE_ID: "",
            },
        ],
        m_relation_aka: [
            {
                RELATION_AKA_NAME: "",
            },
        ],
        m_tagging: [],
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            group_id: "",
            name_relation: "",
            parent_id: "",
            abbreviation: "",
            relation_aka: [],
            relation_email: "",
            relation_description: "",
            relation_lob_id: "",
            pre_salutation_id: "",
            post_salutation_id: "",
            relation_status_id: "",
            tagging_name: [],
            is_managed: "",
            mark_tbk_relation: "",
            profession_id: "",
            relation_type_id: [],
        });
        // if (modal.add) {
        Swal.fire({
            title: "Success",
            text: "New Relation Added",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
            if (result.value) {
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: message[1],
                    RELATION_ORGANIZATION_ID: message[0],
                    RELATION_SALUTATION_PRE: message[2],
                    RELATION_SALUTATION_POST: message[3],
                });
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: true,
                    document: false,
                    search: false,
                });
            }
        });
        setSwitchPage(false);
        setSwitchPageTBK(false);
        // }
        setIsSuccess(message);
    };

    const handleCheckboxEdit = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setDataById({
                ...dataById,
                m_relation_type: [
                    ...dataById.m_relation_type,
                    {
                        RELATION_ORGANIZATION_TYPE_ID: "",
                        RELATION_ORGANIZATION_ID:
                            dataById.RELATION_ORGANIZATION_ID,
                        RELATION_TYPE_ID: value,
                    },
                ],
            });
        } else {
            const updatedData = dataById.m_relation_type.filter(
                (data: any) => data.RELATION_TYPE_ID !== parseInt(value)
            );
            setDataById({ ...dataById, m_relation_type: updatedData });
        }
    };

    const checkCheckedMRelation = (id: number, idr: number) => {
        if (
            dataById.m_relation_type.find(
                (f: any) =>
                    f.RELATION_ORGANIZATION_ID === id &&
                    f.RELATION_TYPE_ID === idr
            )
        ) {
            return true;
        }
    };

    const disableLob = async (id: string) => {
        if (id == "1") {
            // jika corporate
            document.getElementById("relationLob").style.display = "";
            document.getElementById("relationJobs").style.display = "none";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
        }
    };

    const handleCheckboxHREdit = (e: any) => {
        // alert('aloo');
        // const { value, checked } = e.target;
        if (e == true) {
            setSwitchPage(true);
            setDataById({ ...dataById, HR_MANAGED_BY_APP: "1" });
        } else {
            setSwitchPage(false);
            setDataById({ ...dataById, HR_MANAGED_BY_APP: "0" });
        }
    };

    const handleCheckboxTBKEdit = (e: any) => {
        // alert('aloo');
        // const { value, checked } = e.target;
        if (e == true) {
            setSwitchPageTBK(true);
            setDataById({ ...dataById, MARK_TBK_RELATION: "1" });
        } else {
            setSwitchPageTBK(false);
            setDataById({ ...dataById, MARK_TBK_RELATION: "0" });
        }
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // new haris
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<any>([]);
    const [menuOpen, setMenuOpen] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefTag = useRef<HTMLInputElement>(null);

    const tags = [
        "Tutorial",
        "HowTo",
        "DIY",
        "Review",
        "Tech",
        "Gaming",
        "Travel",
        "Fitness",
        "Cooking",
        "Vlog",
    ];

    const filteredTags = tags.filter(
        (item) =>
            item
                ?.toLocaleLowerCase()
                ?.includes(query.toLocaleLowerCase()?.trim()) &&
            !selected.includes(item)
    );

    const isDisable =
        !query?.trim() ||
        data.relation_aka.filter(
            (item: any) =>
                item.name_aka?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    const isDisableEdit =
        !query?.trim() ||
        dataById.m_relation_aka.filter(
            (item: any) =>
                item.RELATION_AKA_NAME?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    const isDisableTag =
        !query?.trim() ||
        data.tagging_name.filter(
            (item: any) =>
                item.name_tag?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    const isDisableTagEdit =
        !query?.trim() ||
        dataById.m_tagging.filter(
            (item: any) =>
                item.tagging.TAG_NAME?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    // search
    const clearSearchRelation = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelation?${pageNumber}`)
            .then((res) => {
                setRelations([]);
                setSearchRelation({
                    ...searchRelation,
                    RELATION_ORGANIZATION_NAME: "",
                    RELATION_TYPE: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectRType = relationType?.map((query: any) => {
        return {
            value: query.RELATION_TYPE_ID,
            label: query.RELATION_TYPE_NAME,
        };
    });
    return (
        <AuthenticatedLayout user={auth.user} header={"Relation"}>
            <Head title="Relation" />

            {/* {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
                />
            )} */}

            {/* modal add relation */}
            <AddRelationPopup
                show={modal.add}
                modal={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                idGroupRelation={""}
                handleSuccess={handleSuccess}
                relationStatus={relationStatus}
                relationGroup={relationGroup}
                relationType={relationType}
                profession={profession}
                relationLOB={relationLOB}
                data={data}
                setData={setData}
                switchPage={switchPage}
                setSwitchPage={setSwitchPage}
                switchPageTBK={switchPageTBK}
                setSwitchPageTBK={setSwitchPageTBK}
            />
            {/* end modal add relation */}

            {/* modal detail  */}
            <ModalToAction
                show={modal.view}
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
                title={
                    getDetailRelation.RELATION_SALUTATION_PRE !== ""
                        ? getDetailRelation.RELATION_SALUTATION_PRE +
                          " " +
                          getDetailRelation.RELATION_ORGANIZATION_NAME
                        : getDetailRelation.RELATION_ORGANIZATION_NAME +
                          " " +
                          getDetailRelation.RELATION_SALUTATION_POST
                }
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailRelationPopup
                            detailRelation={
                                getDetailRelation.RELATION_ORGANIZATION_ID
                            }
                            relationStatus={relationStatus}
                            relationGroup={relationGroup}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                            getDetailMap={getDetailRelation}
                            setGetDetailRelation={setGetDetailRelation}
                        />
                    </>
                }
            />
            {/* end modal detail */}

            {/* Page */}
            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                setSwitchPage(false);
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
                            {"Add Relation"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[100rem] h-96">
                        <TextInput
                            type="text"
                            value={searchRelation.RELATION_ORGANIZATION_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) =>
                                setSearchRelation({
                                    ...searchRelation,
                                    RELATION_ORGANIZATION_NAME: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchRelation.RELATION_ORGANIZATION_NAME !==
                                        ""
                                    ) {
                                        getRelation();
                                        setSearchRelation({
                                            ...searchRelation,
                                            RELATION_ORGANIZATION_NAME: "",
                                            RELATION_TYPE_ID: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search Relation Name"
                        />
                        <Select
                            classNames={{
                                menuButton: () =>
                                    `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-red-600`,
                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                listItem: ({ isSelected }: any) =>
                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                            ? `text-white bg-primary-pelindo`
                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                    }`,
                            }}
                            options={selectRType}
                            isSearchable={true}
                            placeholder={"Search Relation Type"}
                            value={searchRelation.RELATION_TYPE_ID}
                            // onChange={(e) =>
                            //     inputDataBank(
                            //         "BANK_ID",
                            //         e.target.value,
                            //         i
                            //     )
                            // }
                            onChange={(val: any) =>
                                setSearchRelation({
                                    ...searchRelation,
                                    RELATION_TYPE_ID: val,
                                })
                            }
                            primaryColor={"bg-red-500"}
                        />
                        {/* <select
                            className="mt-4 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6 ring-1 ring-red-600"
                            value={searchRelation.RELATION_TYPE_ID}
                            onChange={(e) =>
                                setSearchRelation({
                                    ...searchRelation,
                                    RELATION_TYPE_ID: e.target.value,
                                })
                            }
                        >
                            <option>-- Relation Type --</option>
                            {relationType.map((rType: any, i: number) => {
                                return (
                                    <option
                                        key={i}
                                        value={rType.RELATION_TYPE_ID}
                                    >
                                        {rType.RELATION_TYPE_NAME}
                                    </option>
                                );
                            })}
                        </select> */}
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    getRelation();
                                    setSearchRelation({
                                        ...searchRelation,
                                        RELATION_ORGANIZATION_NAME: "",
                                        RELATION_TYPE_ID: "",
                                    });
                                }}
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
                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
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
                                        label={"Name Relation"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {relations.data?.map(
                                    (dataRelation: any, i: number) => {
                                        return (
                                            <tr
                                                onDoubleClick={() => {
                                                    if (
                                                        dataRelation?.pre_salutation ===
                                                            null &&
                                                        dataRelation?.post_salutation !==
                                                            null
                                                    ) {
                                                        setGetDetailRelation({
                                                            RELATION_ORGANIZATION_NAME:
                                                                dataRelation.RELATION_ORGANIZATION_NAME,
                                                            RELATION_ORGANIZATION_ID:
                                                                dataRelation.RELATION_ORGANIZATION_ID,
                                                            RELATION_SALUTATION_PRE:
                                                                "",
                                                            RELATION_SALUTATION_POST:
                                                                dataRelation
                                                                    .post_salutation
                                                                    ?.salutation_name,
                                                        });
                                                    } else if (
                                                        dataRelation?.post_salutation ===
                                                            null &&
                                                        dataRelation?.pre_salutation !==
                                                            null
                                                    ) {
                                                        setGetDetailRelation({
                                                            RELATION_ORGANIZATION_NAME:
                                                                dataRelation.RELATION_ORGANIZATION_NAME,
                                                            RELATION_ORGANIZATION_ID:
                                                                dataRelation.RELATION_ORGANIZATION_ID,
                                                            RELATION_SALUTATION_PRE:
                                                                dataRelation
                                                                    .pre_salutation
                                                                    ?.salutation_name,
                                                            RELATION_SALUTATION_POST:
                                                                "",
                                                        });
                                                    } else {
                                                        setGetDetailRelation({
                                                            RELATION_ORGANIZATION_NAME:
                                                                dataRelation.RELATION_ORGANIZATION_NAME,
                                                            RELATION_ORGANIZATION_ID:
                                                                dataRelation.RELATION_ORGANIZATION_ID,
                                                            RELATION_SALUTATION_PRE:
                                                                "",
                                                            RELATION_SALUTATION_POST:
                                                                "",
                                                        });
                                                    }
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
                                                    value={relations.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dataRelation.RELATION_ORGANIZATION_NAME
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
                                links={relations.links}
                                fromData={relations.from}
                                toData={relations.to}
                                totalData={relations.total}
                                clickHref={(url: string) =>
                                    getRelation(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
