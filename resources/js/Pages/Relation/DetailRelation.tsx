import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import axios from "axios";
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";

export default function DetailRelation({
    detailRelation,
    relationStatus,
    relationGroup,
    relationType,
    profession,
    relationLOB,
}: PropsWithChildren<{
    detailRelation: any;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
}>) {
    // const { success, detailRelation }: any = usePage().props;
    const [dataRelationNew, setDataRelationNew] = useState<any>([]);
    const [mRelation, setMRelation] = useState<any>([]);
    const [salutations, setSalutations] = useState<any>([]);
    const [switchPage, setSwitchPage] = useState(false);
    const [switchPageTBK, setSwitchPageTBK] = useState(false);
    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    });
    const [isSuccess, setIsSuccess] = useState<string>("");

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    useEffect(() => {
        getDetailRelation(detailRelation);
    }, [detailRelation]);

    useEffect(() => {
        getMappingParent("", "");
    }, []);

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

    const getDetailRelation = async (id: string) => {
        await axios
            .post(`/getRelationDetail`, { id })
            .then((res) => {
                setDataRelationNew(res.data);
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

    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        // await axios
        //     .get(`/getRelation/${id}`)
        //     .then((res) => {
        setDataById(dataRelationNew);
        // console.log();
        setMRelation(dataRelationNew.m_relation_type);
        getSalutationById(
            dataRelationNew.relation_status_id,
            "relation_status_id"
        );
        getMappingParent(
            dataRelationNew.RELATION_ORGANIZATION_GROUP,
            "RELATION_ORGANIZATION_GROUP"
        );
        if (dataRelationNew.HR_MANAGED_BY_APP == "1") {
            setSwitchPage(true);
        } else {
            setSwitchPage(false);
        }
        if (dataRelationNew.MARK_TBK_RELATION == "1") {
            setSwitchPageTBK(true);
        } else {
            setSwitchPageTBK(false);
        }
        // })
        // .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefTag = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [queryTag, setQueryTag] = useState("");
    const isDisableEdit =
        !query?.trim() ||
        dataById.m_relation_aka.filter(
            (item: any) =>
                item.RELATION_AKA_NAME?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;
    const isDisableTagEdit =
        !queryTag?.trim() ||
        dataById.m_tagging.filter(
            (item: any) =>
                item.tagging.TAG_NAME?.toLocaleLowerCase()?.trim() ===
                queryTag?.toLocaleLowerCase()?.trim()
        )?.length;

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

    const handleSuccessEdit = (message: string) => {
        // if (modal.add) {
        setIsSuccess("");
        Swal.fire({
            title: "Success",
            text: "Relation Edit",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
            if (result.value) {
                getDetailRelation(message);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: false,
                    document: false,
                    search: false,
                });
            }
        });
        // }
        setIsSuccess(message);
    };
    return (
        // <AuthenticatedLayout user={auth.user} header={"Detail Relation"}>
        // <Head title="Detail Relation" />
        // { detailRelation?.map((data:, i: number) => {
        // })}
        <>
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
                url={`/editRelation/${detailRelation}`}
                data={dataById}
                addOns={mRelation}
                onSuccess={handleSuccessEdit}
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
                        <div className={"grid gap-4 grid-cols-2"}>
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
                                            // setMenuOpen(true);
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
                                        // setMenuOpen(true);
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
                                value={queryTag}
                                onChange={(e) =>
                                    setQueryTag(e.target.value.trimStart())
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
                                                        TAG_ID: "",
                                                        TAG_NAME: queryTag,
                                                    },
                                                },
                                            ],
                                        });
                                        setQueryTag("");
                                        // setMenuOpen(true);
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
                                                    TAG_ID: "",
                                                    TAG_NAME: queryTag,
                                                },
                                            },
                                        ],
                                    });
                                    setQueryTag("");
                                    inputRefTag.current?.focus();
                                    // setMenuOpen(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </>
                }
            />
            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-3 gap-4 xs:grid-cols-1 md:grid-cols-3">
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md sm:p-6">
                            {/* profile */}
                            <div className="">
                                <div className="p-5">
                                    <div className="flex justify-center items-center">
                                        <img
                                            className="h-36 w-36 rounded-full border-2 bg-gray-50"
                                            src={defaultImage}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex justify-center items-center mt-5">
                                        <span className="font-medium">
                                            {
                                                dataRelationNew.RELATION_ORGANIZATION_NAME
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* end profile */}
                        </div>
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="flex justify-between">
                                <div className="bg-red-600 w-44 p-2 text-center rounded-md text-white">
                                    <span>Official Information</span>
                                </div>
                                <a
                                    onClick={(e) =>
                                        handleEditModel(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_ID
                                        )
                                    }
                                    className="cursor-pointer"
                                    title="Edit Relation"
                                >
                                    <div className="bg-red-600 w-10 p-2 rounded-md text-white">
                                        <PencilSquareIcon className="w-auto" />
                                    </div>
                                </a>
                            </div>
                            <div className="grid gap-x-2 gap-y-2 grid-cols-3 mt-4 ml-3">
                                <div className="">
                                    <span>Group</span>
                                    <br></br>
                                    {dataRelationNew.group_relation?.length ===
                                    0 ? (
                                        <>
                                            <span>-</span>
                                        </>
                                    ) : (
                                        <>
                                            {dataRelationNew.group_relation?.map(
                                                (gRelation: any, i: number) => {
                                                    return (
                                                        <span
                                                            className="text-gray-500"
                                                            key={i}
                                                        >
                                                            {
                                                                gRelation.RELATION_GROUP_NAME
                                                            }
                                                        </span>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="">
                                    <span>Email</span>
                                    <br></br>
                                    {dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                        "" ||
                                    dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                        null ? (
                                        <span>-</span>
                                    ) : (
                                        <span className="font-normal text-gray-500">
                                            {
                                                dataRelationNew.RELATION_ORGANIZATION_EMAIL
                                            }
                                        </span>
                                    )}
                                </div>
                                <div className="">
                                    <span>Address</span>
                                    <br></br>
                                    <span className="font-normal text-gray-500">
                                        Jl.Gatot Subroto, Kuningan, Mampang
                                        Perampatan, Jakarta Selatan
                                    </span>
                                </div>
                            </div>
                            <hr className="mt-5" />
                            <div className="bg-red-600 w-44 p-2 text-center rounded-md mt-10 text-white">
                                <span>Tags</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-3">
                                <div className="p-2 mb-2 relative flex flex-wrap gap-3">
                                    {dataRelationNew.m_tagging?.map(
                                        (dRelation: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-lg w-fit py-1.5 px-3 bg-red-500 flex items-center gap-2"
                                                >
                                                    <span className="text-white">
                                                        {
                                                            dRelation.tagging
                                                                .TAG_NAME
                                                        }
                                                    </span>
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-white cursor-pointer"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
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
                                </div>
                            </div>
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}

                    {/* Structure */}
                    <div className="grid gap-9 grid-cols-3 mt-6 xs:grid-cols-2 xs:gap-x-3 lg:grid-cols-3 lg:gap-4">
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Structure</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Division</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Addres & Location</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Job Desc</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Person</span>
                            </div>
                        </div>
                    </div>

                    {/* end Structure */}
                </dl>
            </div>
        </>

        // </AuthenticatedLayout>
    );
}
