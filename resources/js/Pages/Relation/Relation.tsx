import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    EllipsisHorizontalIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
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

export default function Relation({ auth }: PageProps) {
    // useEffect(() => {
    //     getRelation();
    // }, []);

    interface FormInterface {
        group_id: string;
        name_relation: string;
        parent_id: BigInteger;
        abbreviation: string;
        relation_aka: string;
        relation_email: string;
        relation_description: string;
        relation_type_id: any;
    }

    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    });

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
                }
                // console.log(res.data.links);
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
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

    const getMappingParent = async (name: string, column: string) => {
        // setIsLoading(true)

        if (name) {
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
        }

        // setIsLoading(false)
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
            document.getElementById("abbr").style.display = "";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
            document.getElementById("abbr").style.display = "none";
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
        tagging_name: "",
        is_managed: "",
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
        m_relation_type: [
            {
                RELATION_ORGANIZATION_TYPE_ID: "",
                RELATION_ORGANIZATION_ID: "",
                RELATION_TYPE_ID: "",
            },
        ],
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
            tagging_name: "",
            is_managed: "",
            profession_id: "",
            relation_type_id: [],
        });
        getRelation();
        setIsSuccess(message);
    };

    // edit
    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getRelation/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
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

    // const disableLob = (){
    //     const element = document.getElementById("relationLob");

    //     console.log(element);
    // }

    const disableLob = async (id: string) => {
        if (id == "1") {
            // jika corporate
            document.getElementById("relationLob").style.display = "";
            document.getElementById("relationJobs").style.display = "none";
            document.getElementById("abbr").style.display = "";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
            document.getElementById("abbr").style.display = "none";
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
        // console.log(e);
        if (e == true) {
            setSwitchPage(true);
            setData("is_managed", "1");
        } else {
            setSwitchPage(false);
            setData("is_managed", "0");
        }
        // const { value, checked } = e.target

        // if (checked) {
        //     setData('is_managed', "1")
        // } else {
        //     setData('is_managed', "0")
        // }
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
        selected.filter(
            (item: any) =>
                item?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    return (
        <AuthenticatedLayout user={auth.user} header={"Relation"}>
            <Head title="Relation" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
                />
            )}

            {/* modal add relation */}
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
                title={"Add Relation"}
                url={`/relation`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                body={
                    <>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="group_id"
                                value="Group"
                                className="block"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.group_id}
                                onChange={(e) => {
                                    setData("group_id", e.target.value);
                                    getMappingParent(
                                        e.target.value,
                                        "group_id"
                                    );
                                }}
                            >
                                <option>-- Choose Group --</option>
                                {relationGroup.map((groups: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={groups.RELATION_GROUP_ID}
                                        >
                                            {groups.RELATION_GROUP_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="relation_status_id"
                                    value="Relation Status"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.relation_status_id}
                                    onChange={(e) => {
                                        setData(
                                            "relation_status_id",
                                            e.target.value
                                        );
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
                                    value={data.salutation_id}
                                    onChange={(e) => {
                                        setData(
                                            "salutation_id",
                                            e.target.value
                                        );
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
                                data.relation_status_id === "1"
                                    ? "grid gap-4 grid-cols-2"
                                    : "grid gap-4"
                            }
                        >
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name_relation"
                                    value="Name Relation"
                                />
                                <TextInput
                                    id="name_relation"
                                    type="text"
                                    name="name_relation"
                                    value={data.name_relation}
                                    className="mt-2"
                                    autoComplete="name_relation"
                                    onChange={(e) =>
                                        setData("name_relation", e.target.value)
                                    }
                                    required
                                    placeholder="Name Relation"
                                />
                            </div>
                            <div className="mt-4" id="abbr">
                                <InputLabel
                                    htmlFor="abbreviation"
                                    value="Abbreviation"
                                />
                                <TextInput
                                    id="abbreviation"
                                    type="text"
                                    name="abbreviation"
                                    value={data.abbreviation}
                                    className="mt-2"
                                    autoComplete="abbreviation"
                                    onChange={(e) =>
                                        setData("abbreviation", e.target.value)
                                    }
                                    required
                                    placeholder="Abbreviation"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                {data.relation_aka?.length ? (
                                    <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-md">
                                        {data.relation_aka?.map(
                                            (tag: any, i: number) => {
                                                return (
                                                    // <>
                                                    <div
                                                        key={i}
                                                        className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                    >
                                                        {tag.name_aka}
                                                        <div>
                                                            {/* <a href=""> */}
                                                            <div
                                                                className="text-red-600"
                                                                onMouseDown={(
                                                                    e
                                                                ) =>
                                                                    e.preventDefault()
                                                                }
                                                                onClick={() =>
                                                                    setSelected(
                                                                        selected.filter(
                                                                            (
                                                                                i: any
                                                                            ) =>
                                                                                i !==
                                                                                tag
                                                                        )
                                                                    )
                                                                }
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
                                                    setSelected([]);
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
                                    required
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isDisable) {
                                            setData("relation_aka", [
                                                ...data.relation_aka,
                                                {
                                                    name_aka: query,
                                                },
                                            ]);
                                            setQuery("");
                                            setMenuOpen(true);
                                        }
                                    }}
                                />
                                <button
                                    className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                    disabled={isDisable}
                                    onClick={() => {
                                        if (isDisable) {
                                            return;
                                        }
                                        setData("relation_aka", [
                                            ...data.relation_aka,
                                            {
                                                name_aka: query,
                                            },
                                        ]);
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
                                                        handleCheckboxHR(e)
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
                            <InputLabel htmlFor="parent_id" value="Parent" />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.parent_id}
                                onChange={(e) =>
                                    setData("parent_id", e.target.value)
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
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="group_id"
                                value="Group"
                                className="block"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.group_id}
                                onChange={(e) => {
                                    setData("group_id", e.target.value);
                                    getMappingParent(
                                        e.target.value,
                                        "group_id"
                                    );
                                }}
                            >
                                <option>-- Choose Group --</option>
                                {relationGroup.map((groups: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={groups.RELATION_GROUP_ID}
                                        >
                                            {groups.RELATION_GROUP_NAME}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="relation_email"
                                    value="Email"
                                />
                                <TextInput
                                    id="relation_email"
                                    type="email"
                                    name="relation_email"
                                    value={data.relation_email}
                                    className="mt-2"
                                    autoComplete="relation_email"
                                    onChange={(e) =>
                                        setData(
                                            "relation_email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="tagging_name"
                                    value="Tag"
                                />
                                <TextInput
                                    id="tagging_name"
                                    type="text"
                                    name="tagging_name"
                                    value={data.tagging_name}
                                    className="mt-2"
                                    autoComplete="tagging_name"
                                    onChange={(e) =>
                                        setData("tagging_name", e.target.value)
                                    }
                                    placeholder="Tag"
                                />
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
                                                            name="relation_type_id[]"
                                                            id={
                                                                typeRelation.RELATION_TYPE_ID
                                                            }
                                                            value={
                                                                typeRelation.RELATION_TYPE_ID
                                                            }
                                                            onChange={(e) =>
                                                                handleCheckbox(
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
                                value={data.profession_id}
                                onChange={(e) =>
                                    setData("profession_id", e.target.value)
                                }
                            >
                                <option>
                                    -- Choose Relation Profession --
                                </option>
                                {profession?.map((rProf: any, i: number) => {
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
                                htmlFor="relation_lob_id"
                                value="Relation Lob"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.relation_lob_id}
                                onChange={(e) =>
                                    setData("relation_lob_id", e.target.value)
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
                                htmlFor="relation_description"
                                value="Relation Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="relation_description"
                                name="relation_description"
                                defaultValue={data.relation_description}
                                onChange={(e: any) =>
                                    setData(
                                        "relation_description",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                }
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
                        <div className="grid gap-4 grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_AKA"
                                    value="AKA"
                                />
                                <TextInput
                                    id="RELATION_ORGANIZATION_AKA"
                                    type="text"
                                    name="RELATION_ORGANIZATION_AKA"
                                    value={dataById.RELATION_ORGANIZATION_AKA}
                                    className="mt-2"
                                    autoComplete="RELATION_ORGANIZATION_AKA"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_AKA:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    placeholder="AKA"
                                />
                            </div>
                            <div className="mt-4">
                                <ul role="list" className="mt-8">
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
                                <InputLabel htmlFor="TAG_NAME" value="Tag" />
                                <TextInput
                                    id="TAG_NAME"
                                    type="text"
                                    name="TAG_NAME"
                                    value={dataById.TAG_NAME}
                                    className="mt-2"
                                    autoComplete="TAG_NAME"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            TAG_NAME: e.target.value,
                                        })
                                    }
                                    placeholder="Tag"
                                />
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
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_ORGANIZATION_DESCRIPTION:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                        {selected?.length ? (
                            <div className="bg-white w-80 relative text-xs flex flex-wrap gap-1 p-2 mb-2">
                                {selected.map((tag: any) => {
                                    return (
                                        <div
                                            key={tag}
                                            className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                  flex items-center gap-2"
                                        >
                                            {tag}
                                            <div
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    setSelected(
                                                        selected.filter(
                                                            (i: any) =>
                                                                i !== tag
                                                        )
                                                    )
                                                }
                                            >
                                                {/* <Icons.Close /> */}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="w-full text-right">
                                    <span
                                        className="text-gray-400 cursor-pointer"
                                        onClick={() => {
                                            setSelected([]);
                                            inputRef.current?.focus();
                                        }}
                                    >
                                        Clear all
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div className="card flex items-center justify-between p-3 w-80 gap-2.5">
                            {/* <Icons.Search /> */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value.trimStart())
                                }
                                placeholder="Search or Create tags"
                                className="bg-transparent text-sm flex-1 caret-rose-600"
                                onFocus={() => setMenuOpen(true)}
                                onBlur={() => setMenuOpen(false)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !isDisable) {
                                        setSelected((prev: any) => [
                                            ...prev,
                                            query,
                                        ]);
                                        setQuery("");
                                        setMenuOpen(true);
                                    }
                                }}
                            />
                            <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisable}
                                onClick={() => {
                                    if (isDisable) {
                                        return;
                                    }
                                    setSelected((prev: any) => [
                                        ...prev,
                                        query,
                                    ]);
                                    setQuery("");
                                    inputRef.current?.focus();
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
                    getRelation();
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
                                className=""
                                onChange={(e) =>
                                    setSearchRelation({
                                        ...searchRelation,
                                        RELATION_ORGANIZATION_NAME:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* end modal search */}
            {/* Modal End search */}

            <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="p-6 text-gray-900 mb-60">
                        {/* table page*/}
                        <TablePage
                            addButtonLabel={"Add Relation"}
                            addButtonModalState={() => {
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
                            searchButtonModalState={() =>
                                setModal({
                                    add: false,
                                    delete: false,
                                    edit: false,
                                    view: false,
                                    document: false,
                                    search: !modal.search,
                                })
                            }
                            tableHead={
                                <>
                                    <TableTH
                                        className={"max-w-[0px] text-center"}
                                        label={"No"}
                                    />
                                    <TableTH
                                        className={"min-w-[50px]"}
                                        label={"Name Relation"}
                                    />
                                    <TableTH
                                        className={"min-w-[50px] text-center"}
                                        label={"Action"}
                                    />
                                </>
                            }
                            tableBody={relations.data?.map(
                                (dataRelation: any, i: number) => {
                                    return (
                                        <tr
                                            key={i}
                                            className={
                                                i % 2 === 0 ? "" : "bg-gray-100"
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
                                            <TableTD
                                                value={
                                                    <Dropdown
                                                        title="Actions"
                                                        children={
                                                            <>
                                                                <a
                                                                    href=""
                                                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleEditModel(
                                                                            e,
                                                                            dataRelation.RELATION_ORGANIZATION_ID
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </a>
                                                                <a
                                                                    href={`/relation/detailRelation/${dataRelation.RELATION_ORGANIZATION_ID}`}
                                                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                >
                                                                    Detail
                                                                </a>
                                                            </>
                                                        }
                                                    />
                                                }
                                                className={"text-center"}
                                            />
                                        </tr>
                                    );
                                }
                            )}
                            pagination={
                                <Pagination
                                    links={relations.links}
                                    fromData={relations.from}
                                    toData={relations.to}
                                    totalData={relations.total}
                                    clickHref={(url: string) =>
                                        getRelation(url.split("?").pop())
                                    }
                                />
                            }
                        />

                        {/* end table page */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
