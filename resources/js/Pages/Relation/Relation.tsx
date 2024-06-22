import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    EllipsisHorizontalIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAdd from "@/Components/Modal/ModalToAddRelation";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ToastMessage from "@/Components/ToastMessage";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Button from "@/Components/Button/Button";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { InertiaFormProps } from "@inertiajs/react/types/useForm";
import TablePage from "@/Components/Table/Index";
import Pagination from "@/Components/Pagination";
import axios from "axios";
import { link } from "fs";
import dateFormat from "dateformat";
import { Menu, Tab, Transition } from "@headlessui/react";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import Dropdown from "@/Components/Dropdown";
import { Console } from "console";
import Swal from "sweetalert2";
import DetailRelationPopup from "./DetailRelation";
import AddRelationPopup from "./AddRelation";

export default function Relation({ auth }: PageProps) {
    useEffect(() => {
        getMappingParent("", "");
    }, []);

    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    });

    const [getDetailRelation, setGetDetailRelation] = useState<any>("");

    const [relations, setRelations] = useState<any>([]);
    const [salutations, setSalutations] = useState<any>([]);
    const [searchRelation, setSearchRelation] = useState<any>({
        RELATION_ORGANIZATION_NAME: "",
    });

    const getRelation = async (pageNumber = "page=1") => {
        await axios
            .post(`/getRelation?${pageNumber}`, {
                RELATION_ORGANIZATION_NAME:
                    searchRelation.RELATION_ORGANIZATION_NAME,
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
        salutation_id: "",
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
        salutation_id: "",
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
            salutation_id: "",
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
                setGetDetailRelation(message);
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
        // }
        setIsSuccess(message);
    };

    // edit
    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getRelation/${id}`)
            .then((res) => {
                setDataById(res.data);
                setMRelation(res.data.m_relation_type);
                getSalutationById(
                    res.data.relation_status_id,
                    "relation_status_id"
                );
                getMappingParent(
                    res.data.RELATION_ORGANIZATION_GROUP,
                    "RELATION_ORGANIZATION_GROUP"
                );
                if (res.data.HR_MANAGED_BY_APP == "1") {
                    setSwitchPage(true);
                } else {
                    setSwitchPage(false);
                }
                if (res.data.MARK_TBK_RELATION == "1") {
                    setSwitchPageTBK(true);
                } else {
                    setSwitchPageTBK(false);
                }
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
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

    const checkChecked = (id: number) => {
        // return true;
        if (id === 1) {
            return true;
        } else {
            return false;
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

    const handleCheckbox = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setData("relation_type_id", [
                ...data.relation_type_id,
                {
                    id: value,
                },
            ]);
        } else {
            const updatedData = data.relation_type_id.filter(
                (d: any) => d.id !== value
            );
            setData("relation_type_id", updatedData);
        }
    };

    const handleCheckboxHR = (e: any) => {
        if (e == true) {
            setSwitchPage(true);
            setData("is_managed", "1");
        } else {
            setSwitchPage(false);
            setData("is_managed", "0");
        }
    };

    const handleCheckboxTBK = (e: any) => {
        if (e == true) {
            setSwitchPageTBK(true);
            setData("mark_tbk_relation", "1");
        } else {
            setSwitchPageTBK(false);
            setData("mark_tbk_relation", "0");
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
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
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
            />
            {/* end modal add relation */}

            {/* modal edit relation */}
            <ModalToAction
                show={modal.edit}
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
                title={"Edit Relation"}
                url={`/editRelation/${dataById.RELATION_ORGANIZATION_ID}`}
                data={dataById}
                addOns={mRelation}
                onSuccess={handleSuccess}
                method={"patch"}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                submitButtonName={"Submit"}
                body={
                    <>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="relation_status_id"
                                    value="Relation Status"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.relation_status_id}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            relation_status_id: e.target.value,
                                        });
                                        getSalutationById(
                                            e.target.value,
                                            "relation_status_id"
                                        );
                                        disableLob(e.target.value);
                                    }}
                                >
                                    <option>
                                        -- Choose Relation Status --
                                    </option>
                                    {relationStatus.map(
                                        (relationStatus: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        relationStatus.relation_status_id
                                                    }
                                                >
                                                    {
                                                        relationStatus.relation_status_name
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="salutation_id"
                                    value="Salutation"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.salutation_id}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            salutation_id: e.target.value,
                                        });
                                    }}
                                >
                                    <option>-- Choose Salutation --</option>
                                    {salutations.map(
                                        (getSalutations: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        getSalutations.salutation_id
                                                    }
                                                >
                                                    {
                                                        getSalutations.salutation_name
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        </div>
                        <div
                            className={
                                dataById.relation_status_id === "1"
                                    ? "grid gap-4 grid-cols-2"
                                    : "grid gap-4"
                            }
                        >
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_NAME"
                                    value="Name Relation"
                                />
                                <TextInput
                                    id="RELATION_ORGANIZATION_NAME"
                                    type="text"
                                    name="RELATION_ORGANIZATION_NAME"
                                    value={dataById.RELATION_ORGANIZATION_NAME}
                                    className="mt-2"
                                    autoComplete="RELATION_ORGANIZATION_NAME"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_NAME:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    placeholder="Name Relation"
                                />
                            </div>
                            <div className="mt-4" id="abbr">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_ABBREVIATION"
                                    value="Abbreviation"
                                />
                                <TextInput
                                    id="RELATION_ORGANIZATION_ABBREVIATION"
                                    type="text"
                                    name="RELATION_ORGANIZATION_ABBREVIATION"
                                    value={
                                        dataById.RELATION_ORGANIZATION_ABBREVIATION
                                    }
                                    className="mt-2"
                                    autoComplete="RELATION_ORGANIZATION_ABBREVIATION"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_ABBREVIATION:
                                                e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2 mt-4">
                            <div className="mt-4">
                                {dataById.m_relation_aka?.length ? (
                                    <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                        {dataById.m_relation_aka?.map(
                                            (tag: any, i: number) => {
                                                return (
                                                    // <>
                                                    <div
                                                        key={i}
                                                        className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                    >
                                                        {tag.RELATION_AKA_NAME}
                                                        <div>
                                                            {/* <a href=""> */}
                                                            <div
                                                                className="text-red-600"
                                                                onMouseDown={(
                                                                    e
                                                                ) =>
                                                                    e.preventDefault()
                                                                }
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        dataById.m_relation_aka.filter(
                                                                            (
                                                                                data: any
                                                                            ) =>
                                                                                data.RELATION_AKA_NAME !==
                                                                                tag.RELATION_AKA_NAME
                                                                        );
                                                                    setDataById(
                                                                        {
                                                                            ...dataById,
                                                                            m_relation_aka:
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
                                                    setDataById({
                                                        ...dataById,
                                                        m_relation_aka: [],
                                                    });
                                                    inputRef.current?.focus();
                                                }}
                                            >
                                                Clear all
                                            </span>
                                        </div>
                                    </div>
                                ) : null}
                                <TextInput
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(e.target.value.trimStart())
                                    }
                                    placeholder="Create AKA"
                                    className=""
                                    autoComplete="relation_aka"
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            !isDisableEdit
                                        ) {
                                            setDataById({
                                                ...dataById,
                                                m_relation_aka: [
                                                    ...dataById.m_relation_aka,
                                                    {
                                                        RELATION_AKA_NAME:
                                                            query,
                                                    },
                                                ],
                                            });
                                            setQuery("");
                                            setMenuOpen(true);
                                        }
                                    }}
                                />
                                <button
                                    className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                    disabled={isDisableEdit}
                                    onClick={() => {
                                        if (isDisableEdit) {
                                            return;
                                        }
                                        setDataById({
                                            ...dataById,
                                            m_relation_aka: [
                                                ...dataById.m_relation_aka,
                                                {
                                                    RELATION_AKA_NAME: query,
                                                },
                                            ],
                                        });
                                        setQuery("");
                                        inputRef.current?.focus();
                                        setMenuOpen(true);
                                    }}
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="mt-4">
                                {/* <InputLabel
                                    htmlFor="is_managed"
                                    value="HR MANAGED BY APP"
                                /> */}
                                <ul role="list" className="">
                                    <li className="col-span-1 flex rounded-md shadow-sm">
                                        <div className="flex flex-1 items-center truncate rounded-md shadow-md bg-white h-9">
                                            <span className="mt-1 ml-2">
                                                <Switch
                                                    enabled={switchPage}
                                                    onChangeButton={(e: any) =>
                                                        handleCheckboxHREdit(e)
                                                    }
                                                />
                                            </span>
                                            <span className="ml-2 text-sm">
                                                HR MANAGED BY APP
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="RELATION_ORGANIZATION_GROUP"
                                value="Group"
                                className="block"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_ORGANIZATION_GROUP}
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_ORGANIZATION_GROUP:
                                            e.target.value,
                                    });
                                    getMappingParent(
                                        e.target.value,
                                        "RELATION_ORGANIZATION_GROUP"
                                    );
                                }}
                            >
                                <option>-- Choose Group --</option>
                                {relationGroup?.map(
                                    (groups: any, i: number) => {
                                        return (
                                            <option
                                                key={i}
                                                value={groups.RELATION_GROUP_ID}
                                            >
                                                {groups.RELATION_GROUP_NAME}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="RELATION_ORGANIZATION_PARENT_ID"
                                value="Parent"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_ORGANIZATION_PARENT_ID}
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_ORGANIZATION_PARENT_ID:
                                            e.target.value,
                                    })
                                }
                            >
                                <option value={""} className="text-white">
                                    -- Choose Parent --
                                </option>
                                {mappingParent.mapping_parent.map(
                                    (parents: any, i: number) => {
                                        return (
                                            <option
                                                key={i}
                                                value={
                                                    parents.RELATION_ORGANIZATION_ID
                                                }
                                            >
                                                {parents.text_combo}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_EMAIL"
                                    value="Email"
                                />
                                <TextInput
                                    id="RELATION_ORGANIZATION_EMAIL"
                                    type="email"
                                    name="RELATION_ORGANIZATION_EMAIL"
                                    value={dataById.RELATION_ORGANIZATION_EMAIL}
                                    className="mt-2"
                                    autoComplete="RELATION_ORGANIZATION_EMAIL"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_EMAIL:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="mt-4">
                                {/* <InputLabel
                                    htmlFor="is_managed"
                                    value="HR MANAGED BY APP"
                                /> */}
                                <ul role="list" className="mt-8">
                                    <li className="col-span-1 flex rounded-md shadow-sm">
                                        <div className="flex flex-1 items-center truncate rounded-md shadow-md bg-white h-9">
                                            <span className="mt-1 ml-2">
                                                <Switch
                                                    enabled={switchPageTBK}
                                                    onChangeButton={(e: any) =>
                                                        handleCheckboxTBKEdit(e)
                                                    }
                                                />
                                            </span>
                                            <span className="ml-2 text-sm">
                                                MARK TBK RELATION
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="relation_type_id"
                                value="Relation Type"
                            />
                            <div>
                                <ul
                                    role="list"
                                    className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                                >
                                    {relationType.map(
                                        (typeRelation: any, i: number) => {
                                            return (
                                                <li
                                                    key={
                                                        typeRelation.RELATION_TYPE_ID
                                                    }
                                                    className="col-span-1 flex rounded-md shadow-sm"
                                                >
                                                    <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                        <Checkbox
                                                            value={
                                                                typeRelation.RELATION_TYPE_ID
                                                            }
                                                            defaultChecked={checkCheckedMRelation(
                                                                dataById.RELATION_ORGANIZATION_ID,
                                                                typeRelation.RELATION_TYPE_ID
                                                            )}
                                                            onChange={(e) =>
                                                                handleCheckboxEdit(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                        <div className="flex-1 truncate px-1 py-2 text-xs">
                                                            <span className="text-gray-900">
                                                                {
                                                                    typeRelation.RELATION_TYPE_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4" id="relationJobs">
                            <InputLabel
                                htmlFor="profession_id"
                                value="Relation Profession"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_PROFESSION_ID}
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_PROFESSION_ID: e.target.value,
                                    })
                                }
                            >
                                <option>
                                    -- Choose Relation Profession --
                                </option>
                                <option>-- Choose Relation Lob --</option>
                                {profession.map((rProf: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={rProf.RELATION_PROFESSION_ID}
                                        >
                                            {rProf.RELATION_PROFESSION_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4" id="relationLob">
                            <InputLabel
                                htmlFor="RELATION_LOB_ID"
                                value="Relation Lob"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_LOB_ID}
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_LOB_ID: e.target.value,
                                    })
                                }
                            >
                                <option>-- Choose Relation Lob --</option>
                                {relationLOB.map((rLob: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={rLob.RELATION_LOB_ID}
                                        >
                                            {rLob.RELATION_LOB_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="RELATION_ORGANIZATION_DESCRIPTION"
                                value="Relation Description"
                            />
                            <TextArea
                                className="mt-2"
                                id="RELATION_ORGANIZATION_DESCRIPTION"
                                name="RELATION_ORGANIZATION_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_ORGANIZATION_DESCRIPTION
                                }
                                onChange={(e: any) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_ORGANIZATION_DESCRIPTION:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mt-4">
                            {dataById.m_tagging?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {dataById.m_tagging?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {tag.tagging.TAG_NAME}
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataById.m_tagging.filter(
                                                                        (
                                                                            data: any
                                                                        ) =>
                                                                            data
                                                                                .tagging
                                                                                .TAG_NAME !==
                                                                            tag
                                                                                .tagging
                                                                                .TAG_NAME
                                                                    );
                                                                setDataById({
                                                                    ...dataById,
                                                                    m_tagging:
                                                                        updatedData,
                                                                });
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
                                                setDataById({
                                                    ...dataById,
                                                    m_tagging: [],
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
                                placeholder="Create Tags"
                                className=""
                                autoComplete="tagging"
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !isDisableTagEdit
                                    ) {
                                        setDataById({
                                            ...dataById,
                                            m_tagging: [
                                                ...dataById.m_tagging,
                                                {
                                                    tagging: {
                                                        TAG_NAME: query,
                                                    },
                                                },
                                            ],
                                        });
                                        setQuery("");
                                        setMenuOpen(true);
                                    }
                                }}
                            />
                            <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisableTagEdit}
                                onClick={() => {
                                    if (isDisableTagEdit) {
                                        return;
                                    }
                                    setDataById({
                                        ...dataById,
                                        m_tagging: [
                                            ...dataById.m_tagging,
                                            {
                                                tagging: {
                                                    TAG_NAME: query,
                                                },
                                            },
                                        ],
                                    });
                                    setQuery("");
                                    inputRefTag.current?.focus();
                                    setMenuOpen(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </>
                }
            />
            {/* end modal edit relation */}

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
                title={"Detail Relation"}
                url={""}
                data={""}
                addOns={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailRelationPopup
                            detailRelation={getDetailRelation}
                            relationStatus={relationStatus}
                            relationGroup={relationGroup}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                        />
                    </>
                }
            />
            {/* end modal detail */}

            {/* Modal Search */}
            {/* modal search */}
            <ModalSearch
                show={modal.search}
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
                title={"Search Relation"}
                submitButtonName={"Search"}
                onAction={() => {
                    if (searchRelation.RELATION_ORGANIZATION_NAME !== "") {
                        getRelation();
                    }
                }}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="RELATION_ORGANIZATION_NAME"
                                value="Relation Name"
                            />
                            <TextInput
                                id="RELATION_ORGANIZATION_NAME"
                                type="text"
                                name="RELATION_ORGANIZATION_NAME"
                                value={
                                    searchRelation.RELATION_ORGANIZATION_NAME
                                }
                                className="mt-2"
                                onChange={(e) =>
                                    setSearchRelation({
                                        ...searchRelation,
                                        RELATION_ORGANIZATION_NAME:
                                            e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (
                                            searchRelation.RELATION_ORGANIZATION_NAME !==
                                            ""
                                        ) {
                                            getRelation();
                                        }
                                    }
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal search */}
            {/* Modal End search */}

            <div className="grid grid-rows-3 grid-flow-col gap-4 mt-4">
                <div className="bg-white shadow-md rounded-md p-4 max-h-20">
                    <div className="text-center w-auto">
                        <Button
                            className="p-3"
                            // onClick={() => {
                            //     // setSwitchPage(false);
                            //     setModal({
                            //         add: false,
                            //         delete: false,
                            //         edit: false,
                            //         view: !modal.view,
                            //         document: false,
                            //         search: false,
                            //     });
                            // }}
                            // onClick={(e) => handleAddModel(e)}
                        >
                            {"Add Relation"}
                        </Button>
                    </div>
                </div>
                <div className="row-span-2 bg-white shadow-md rounded-md pl-4 pr-4 pt-4">
                    <div className="">
                        <TextInput
                            id="RELATION_ORGANIZATION_NAME"
                            type="text"
                            name="RELATION_ORGANIZATION_NAME"
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
                                    }
                                }
                            }}
                            placeholder="Search Relation Name"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <div
                            className="bg-red-600 text-white p-2 w-52 rounded-md text-center hover:bg-red-500 cursor-pointer"
                            onClick={() => clearSearchRelation()}
                        >
                            Clear Search
                        </div>
                    </div>
                </div>
                <div className="relative row-span-3 col-span-9 bg-white shadow-md rounded-md p-4">
                    {/* Table Relation */}
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
                                        className={"min-w-[50px] bg-gray-200"}
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
                                                    setModal({
                                                        add: false,
                                                        delete: false,
                                                        edit: false,
                                                        view: true,
                                                        document: false,
                                                        search: false,
                                                    });
                                                    setGetDetailRelation(
                                                        dataRelation.RELATION_ORGANIZATION_ID
                                                    );
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
                    </div>
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

            {/* <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="p-6 text-gray-900 mb-60">
                        <div className="rounded-md bg-white pt-6 pl-10 pr-10 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                            header table
                            <div className="md:grid md:grid-cols-8 md:gap-4">
                                <Button
                                    className="text-sm w-full lg:w-1/2 font-semibold px-6 py-1.5 mb-4 md:col-span-2"
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
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 xs:gap-0 lg:grid-cols-3 lg:gap-4">
                            <div className="bg-white rounded-md p-10 mb-5 lg:mb-0">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                        <button
                                            className=" w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4 hover:ring-red-500"
                                            onClick={() => {
                                                setModal({
                                                    add: false,
                                                    delete: false,
                                                    edit: false,
                                                    view: false,
                                                    document: false,
                                                    search: !modal.search,
                                                });
                                            }}
                                        >
                                            <MagnifyingGlassIcon
                                                className="mx-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            Search Relation
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center xs:col-span-3 lg:col-auto">
                                        <Button
                                            className="mb-4 w-full py-1.5 px-2"
                                            onClick={() =>
                                                clearSearchRelation()
                                            }
                                        >
                                            Clear Search
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md col-span-2 p-10">
                                {relations.length === 0 ? (
                                    <div className="text-center text-lg">
                                        <span>No Data Available</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible">
                                            <table className="w-full table-auto divide-y divide-gray-300">
                                                <thead className="bg-gray-100">
                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                        <TableTH
                                                            className={
                                                                "max-w-[0px] text-center"
                                                            }
                                                            label={"No"}
                                                        />
                                                        <TableTH
                                                            className={
                                                                "min-w-[50px]"
                                                            }
                                                            label={
                                                                "Name Relation"
                                                            }
                                                        />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {relations.data?.map(
                                                        (
                                                            dataRelation: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr
                                                                    onDoubleClick={() => {
                                                                        setModal(
                                                                            {
                                                                                add: false,
                                                                                delete: false,
                                                                                edit: false,
                                                                                view: true,
                                                                                document:
                                                                                    false,
                                                                                search: false,
                                                                            }
                                                                        );
                                                                        setGetDetailRelation(
                                                                            dataRelation.RELATION_ORGANIZATION_ID
                                                                        );
                                                                    }}
                                                                    key={i}
                                                                    className={
                                                                        i %
                                                                            2 ===
                                                                        0
                                                                            ? "cursor-pointer"
                                                                            : "bg-gray-100 cursor-pointer"
                                                                    }
                                                                >
                                                                    <TableTD
                                                                        value={
                                                                            relations.from +
                                                                            i
                                                                        }
                                                                        className={
                                                                            "text-center"
                                                                        }
                                                                    />
                                                                    <TableTD
                                                                        value={
                                                                            <>
                                                                                {
                                                                                    dataRelation.RELATION_ORGANIZATION_NAME
                                                                                }
                                                                            </>
                                                                        }
                                                                        className={
                                                                            ""
                                                                        }
                                                                    />
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            links={relations.links}
                                            fromData={relations.from}
                                            toData={relations.to}
                                            totalData={relations.total}
                                            clickHref={(url: string) =>
                                                getRelation(
                                                    url.split("?").pop()
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        table page
                    </div>
                </div>
            </div> */}
        </AuthenticatedLayout>
    );
}
