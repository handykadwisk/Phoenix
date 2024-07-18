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
import {
    PencilIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import PersonPopup from "../Person/Person";
import StructurePopup from "../Structure/Structure";
import Division from "../Division/Division";
import AddressPopup from "../Address/Address";
import JobDesk from "../Job/JobDesk";
import SelectTailwind from "react-tailwindcss-select";

export default function DetailRelation({
    detailRelation,
    relationStatus,
    relationGroup,
    relationType,
    profession,
    relationLOB,
    getDetailMap,
    setGetDetailRelation,
}: PropsWithChildren<{
    detailRelation: any;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
    getDetailMap: any;
    setGetDetailRelation: any;
}>) {
    // const { success, detailRelation }: any = usePage().props;
    const [dataRelationNew, setDataRelationNew] = useState<any>([]);
    const [mRelation, setMRelation] = useState<any>([]);
    const [salutations, setSalutations] = useState<any>([]);
    const [postSalutations, setPostSalutations] = useState<any>([]);
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

    // Structure Modal
    const [structureModal, setStructureModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // Structure Modal
    const [divisionModal, setDivisionModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    // location modal
    const [locationModal, setLocationModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    // job des modal
    const [jobdeskModal, setJobDeskModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    useEffect(() => {
        getDetailRelation(detailRelation);
    }, [detailRelation]);

    // useEffect(() => {
    //     getMappingParent("", "");
    // }, []);

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
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getPreSalutationById`, { id, column })
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

    const getPostSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getPostSalutationById`, { id, column })
                .then((res) => {
                    setPostSalutations(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_ORGANIZATION_GROUP: "",
        RELATION_ORGANIZATION_NAME: "",
        RELATION_ORGANIZATION_PARENT_ID: "",
        RELATION_ORGANIZATION_ABBREVIATION: "",
        RELATION_ORGANIZATION_AKA: "",
        RELATION_ORGANIZATION_EMAIL: "",
        RELATION_ORGANIZATION_WEBSITE: "",
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
        getPostSalutationById(
            dataRelationNew.relation_status_id,
            "relation_status_id"
        );
        if (dataRelationNew.RELATION_ORGANIZATION_GROUP !== null) {
            getMappingParent(
                dataRelationNew.RELATION_ORGANIZATION_GROUP,
                "RELATION_ORGANIZATION_GROUP"
            );
        }

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
            // console.log(message);
            if (result.value) {
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: message[1],
                    RELATION_ORGANIZATION_ID: message[0],
                    RELATION_SALUTATION_PRE: message[2],
                    RELATION_SALUTATION_POST: message[3],
                });
                getDetailRelation(message[0]);
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

    // Onclick Structure
    const handleClickStructure = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setStructureModal({
            add: false,
            delete: false,
            edit: false,
            view: !structureModal.view,
            document: false,
            search: false,
        });
    };
    // end Structure

    // OnClick Division
    const handleClickDivision = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setDivisionModal({
            add: false,
            edit: false,
            view: !divisionModal.view,
        });
    };
    // End Division Click

    // OnClick Address Location
    const handleClickAddressLocation = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setLocationModal({
            add: false,
            edit: false,
            view: !locationModal.view,
        });
    };
    // End Address Location Click

    // OnClick Address Location
    const handleClickJobDesk = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setJobDeskModal({
            add: false,
            edit: false,
            view: !jobdeskModal.view,
        });
    };
    // End Address Location Click

    // Onclick Person
    const handleClickPerson = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };

    const professionSelect = profession?.map((query: any) => {
        return {
            value: query.RELATION_PROFESSION_ID,
            label: query.RELATION_PROFESSION_NAME,
        };
    });

    const lobSelect = relationLOB?.map((query: any) => {
        return {
            value: query.RELATION_LOB_ID,
            label: query.RELATION_LOB_NAME,
        };
    });

    const getProfessionSelect = (value: any) => {
        if (value) {
            const selected = professionSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const getLobSelect = (value: any) => {
        if (value) {
            const selected = lobSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [existingAbb, setExistingAbb] = useState<any>([]);

    const cekAbbreviationRelationEdit = async (name: any, id: any) => {
        const flag = "edit";
        await axios
            .post(`/getCekAbbreviation`, { name, flag, id })
            .then((res: any) => {
                setExistingAbb(res.data);
                if (res.data.length >= 1) {
                    Swal.fire({
                        title: "Warning",
                        text: "Abbreviation already exists",
                        icon: "warning",
                    }).then((result: any) => {
                        // console.log(result);
                    });
                }
                // cekAbbreviation(existingAbb);
            })
            .catch((err) => {
                console.log(err);
            });
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
                onSuccess={handleSuccessEdit}
                method={"patch"}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                submitButtonName={"Submit"}
                body={
                    <>
                        <div className="lg:grid lg:gap-4 lg:grid-cols-2 xs:grid xs:gap-4 xs:grid-cols-1">
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="relation_status_id"
                                    value="Relation Status"
                                />
                                <div className="ml-[6.8rem] text-red-600">
                                    *
                                </div>
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
                                        getPostSalutationById(
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
                            <div className="grid grid-cols-2 gap-2">
                                <div className="lg:mt-4 xs:mt-0">
                                    <InputLabel
                                        htmlFor="PRE_SALUTATION"
                                        value="Pre Salutation"
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.PRE_SALUTATION}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                PRE_SALUTATION: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Pre Salutation --
                                        </option>
                                        {salutations.map(
                                            (
                                                getSalutations: any,
                                                i: number
                                            ) => {
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
                                <div className="lg:mt-4 xs:mt-0">
                                    <InputLabel
                                        htmlFor="POST_SALUTATION"
                                        value="Post Salutation"
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataById.POST_SALUTATION}
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                POST_SALUTATION: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Post Salutation --
                                        </option>
                                        {postSalutations.map(
                                            (
                                                getSalutations: any,
                                                i: number
                                            ) => {
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
                        </div>
                        <div className="lg:grid lg:gap-4 lg:grid-cols-2 xs:grid xs:gap-0 xs:grid-cols-1">
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_ORGANIZATION_NAME"
                                    value="Name Relation"
                                />
                                <div className="ml-[6.7rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={dataById.RELATION_ORGANIZATION_NAME}
                                    className="mt-2"
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
                            <div className="mt-4 relative" id="abbr">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_ORGANIZATION_ABBREVIATION"
                                    value="Abbreviation"
                                />
                                <div className="ml-[5.8rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={
                                        dataById.RELATION_ORGANIZATION_ABBREVIATION
                                    }
                                    className="mt-2"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_ABBREVIATION:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    onBlur={() => {
                                        cekAbbreviationRelationEdit(
                                            dataById.RELATION_ORGANIZATION_ABBREVIATION,
                                            dataById.RELATION_ORGANIZATION_ID
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="xs:grid xs:gap-0 xs:grid-cols-1 mt-4 lg:grid lg:gap-4 lg:grid-cols-2">
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
                            <div className="mt-4 hidden">
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
                                <option value={""}>-- Choose Group --</option>
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
                                {/* {mappingParent.mapping_parent.map(
                                    (parents: any, i: number) => { */}
                                {mappingParent.mapping_parent
                                    ?.filter(
                                        (m: any) =>
                                            m.RELATION_ORGANIZATION_ALIAS !==
                                            dataById.RELATION_ORGANIZATION_ALIAS
                                    )
                                    .map((parents: any, i: number) => {
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
                                    })}
                            </select>
                        </div>
                        <div className="xs:grid xs:gap-4 xs:grid-cols-1 lg:grid lg:gap-4 lg:grid-cols-2">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_EMAIL"
                                    value="Email"
                                />
                                <TextInput
                                    type="email"
                                    value={dataById.RELATION_ORGANIZATION_EMAIL}
                                    className="mt-2"
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
                            <div className="xs:-mt-5 lg:mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_WEBSITE"
                                    value="Email"
                                />
                                <TextInput
                                    type="text"
                                    value={
                                        dataById.RELATION_ORGANIZATION_WEBSITE
                                    }
                                    className="mt-2"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_WEBSITE:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="www.example.com"
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
                            <SelectTailwind
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-500`
                                                : `text-gray-500 hover:bg-red-500 hover:text-white`
                                        }`,
                                }}
                                options={professionSelect}
                                isSearchable={true}
                                placeholder={"--Select LOB--"}
                                value={{
                                    label: getProfessionSelect(
                                        dataById.RELATION_PROFESSION_ID
                                    ),
                                    value: dataById.RELATION_PROFESSION_ID,
                                }}
                                // value={dataById.RELATION_PROFESSION_ID}
                                // onChange={(e) =>
                                //     inputDataBank(
                                //         "BANK_ID",
                                //         e.target.value,
                                //         i
                                //     )
                                // }
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_PROFESSION_ID: val.value,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                            {/* <select
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
                            </select> */}
                        </div>
                        <div className="mt-4" id="relationLob">
                            <InputLabel
                                htmlFor="RELATION_LOB_ID"
                                value="Business Sector"
                            />
                            <SelectTailwind
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                            isSelected
                                                ? `text-white bg-red-500`
                                                : `text-gray-500 hover:bg-red-500 hover:text-white`
                                        }`,
                                }}
                                options={lobSelect}
                                isSearchable={true}
                                placeholder={"--Select LOB--"}
                                // value={dataById.RELATION_LOB_ID}
                                value={{
                                    label: getLobSelect(
                                        dataById.RELATION_LOB_ID
                                    ),
                                    value: dataById.RELATION_LOB_ID,
                                }}
                                // onChange={(e) =>
                                //     inputDataBank(
                                //         "BANK_ID",
                                //         e.target.value,
                                //         i
                                //     )
                                // }
                                onChange={(val: any) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_LOB_ID: val.value,
                                    })
                                }
                                primaryColor={"bg-red-500"}
                            />
                            {/* <select
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
                            </select> */}
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

            {/* modal for structure */}
            <ModalToAction
                show={structureModal.view}
                onClose={() =>
                    setStructureModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Structure"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <StructurePopup
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal for structure */}

            {/* Modal Division */}
            <ModalToAction
                show={divisionModal.view}
                onClose={() =>
                    setDivisionModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Division"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <Division
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal Division */}

            {/* Modal Address Location */}
            <ModalToAction
                show={locationModal.view}
                onClose={() =>
                    setLocationModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Address & Location"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <AddressPopup
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal Address Location */}

            {/* modal for job desc */}
            <ModalToAction
                show={jobdeskModal.view}
                onClose={() =>
                    setJobDeskModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Job Desc"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <JobDesk
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end modal for job desc */}

            {/* modal for person */}
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
                title={"Person & User"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <PersonPopup auth={""} idRelation={detailRelation} />
                    </>
                }
            />
            {/* end modal for person */}

            {/* Detail Relation*/}
            {/* Top */}
            <div className="bg-white p-4 rounded-md shadow-md">
                {/* Official Information */}
                <div className="flex justify-between">
                    <div className="text-md font-semibold w-fit">
                        <span className="border-b-2 border-red-600">
                            Relation Information
                        </span>
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
                        <div className="bg-red-600 p-2 rounded-md text-white">
                            <PencilSquareIcon className="w-5" />
                        </div>
                    </a>
                </div>
                <div className="xs:grid xs:grid-cols-1 xs:gap-2 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div>
                        <div className="font-semibold">
                            <span>Group</span>
                        </div>
                        {dataRelationNew.group_relation?.length === 0 ? (
                            <>
                                <div className="text-sm text-gray-400">-</div>
                            </>
                        ) : (
                            <>
                                {dataRelationNew.group_relation?.map(
                                    (gRelation: any, i: number) => {
                                        return (
                                            <div
                                                className="text-sm text-gray-400"
                                                key={i}
                                            >
                                                {gRelation.RELATION_GROUP_NAME}
                                            </div>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </div>
                    <div className="xs:col-span-2 lg:col-span-1">
                        <div className="font-semibold">
                            {dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                "" ||
                            dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                null ? (
                                <span>Website</span>
                            ) : (
                                <span>Email</span>
                            )}
                        </div>
                        {dataRelationNew.RELATION_ORGANIZATION_EMAIL === "" ||
                        dataRelationNew.RELATION_ORGANIZATION_EMAIL === null ? (
                            dataRelationNew.RELATION_ORGANIZATION_WEBSITE ===
                                "" ||
                            dataRelationNew.RELATION_ORGANIZATION_WEBSITE ===
                                null ? (
                                <div className="text-sm text-gray-400">-</div>
                            ) : (
                                <div className="text-sm text-gray-400">
                                    {
                                        dataRelationNew.RELATION_ORGANIZATION_WEBSITE
                                    }
                                </div>
                            )
                        ) : dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                              "" ||
                          dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                              null ? (
                            <div className="text-sm text-gray-400">-</div>
                        ) : (
                            <div className="text-sm text-gray-400">
                                {dataRelationNew.RELATION_ORGANIZATION_EMAIL}
                            </div>
                        )}
                    </div>
                    <div className="col-span-2">
                        <div className="font-semibold">
                            <span>Address & Location</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            <span className="font-normal">-</span>
                        </div>
                    </div>
                </div>
                {/* End Official Information */}

                {/* Relation Type And */}
                <div className="text-md font-semibold border-b-2 w-fit border-red-600 mt-4">
                    <span>Relation Type</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="grid grid-cols-1 gap-4 mt-2">
                        <div className="mb-2 relative flex flex-wrap gap-3">
                            {dataRelationNew.m_relation_type?.map(
                                (dRelation: any, i: number) => {
                                    return (
                                        // <>
                                        <div
                                            key={i}
                                            className="rounded-lg w-fit py-1.5 px-3 bg-red-500 flex items-center gap-2 text-sm"
                                        >
                                            <span className="text-white">
                                                {
                                                    dRelation.relation_type
                                                        .RELATION_TYPE_NAME
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
                                                    <XMarkIcon className="w-5" />
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
                    <div></div>
                </div>
                {/* END Relation Type And */}
            </div>
            {/* End Top */}

            {/* Button */}
            <div className="mt-4 mb-2 xs:grid xs:grid-cols-2 xs:gap-3 lg:grid lg:grid-cols-4 lg:gap-3">
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickStructure(
                            e,
                            dataRelationNew.RELATION_ORGANIZATION_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Structure</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickDivision(
                            e,
                            dataRelationNew.RELATION_ORGANIZATION_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Division</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg hover:cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickAddressLocation(
                            e,
                            dataRelationNew.RELATION_ORGANIZATION_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Address & Location</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg hover:cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickJobDesk(
                            e,
                            dataRelationNew.RELATION_ORGANIZATION_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Job Desc</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickPerson(
                            e,
                            dataRelationNew.RELATION_ORGANIZATION_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Person & User</span>
                    </div>
                </div>
            </div>
            {/* End Button */}
        </>

        // </AuthenticatedLayout>
    );
}
