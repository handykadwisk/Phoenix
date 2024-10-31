import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
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
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import SelectTailwind from "react-tailwindcss-select";
import Input from "@/Components/Input";
import Select from "react-tailwindcss-select";
import DatePicker from "react-datepicker";
import SwitchPage from "@/Components/Switch";

export default function AddRelation({
    idGroupRelation,
    relationStatus,
    relationGroup,
    relationType,
    profession,
    relationLOB,
    show,
    modal,
    handleSuccess,
    relation,
    data,
    setData,
    switchPage,
    bank,
    setSwitchPage,
}: PropsWithChildren<{
    idGroupRelation: string;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
    relation: any;
    show: any;
    modal: any;
    handleSuccess: any;
    data: any;
    bank: any;
    setData: any;
    switchPage: any;
    setSwitchPage: any;
}>) {
    const [salutations, setSalutations] = useState<any>([]);
    const [postSalutations, setPostSalutation] = useState<any>([]);
    // const [switchPage, setSwitchPage] = useState(false);
    // const [switchPageTBK, setSwitchPageTBK] = useState(false);
    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    });
    // const { data, setData, errors, reset } = useForm<any>({
    //     group_id: "",
    //     name_relation: "",
    //     parent_id: "",
    //     abbreviation: "",
    //     relation_aka: [],
    //     relation_email: "",
    //     relation_description: "",
    //     relation_lob_id: "",
    //     salutation_id: "",
    //     relation_status_id: "",
    //     tagging_name: [],
    //     is_managed: "",
    //     mark_tbk_relation: "",
    //     profession_id: "",
    //     relation_type_id: [],
    // });

    const getPostSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getPostSalutationById`, { id, column })
                .then((res) => {
                    setPostSalutation(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (id == "1") {
            // jika corporate
            const relationLOB = document.getElementById(
                "relationLob"
            ) as HTMLElement;
            relationLOB.style.display = "";
            // jika corporate
            const relationJobs = document.getElementById(
                "relationJobs"
            ) as HTMLElement;
            relationJobs.style.display = "none";
        } else if (id == "2") {
            // jika corporate
            const relationLOB = document.getElementById(
                "relationLob"
            ) as HTMLElement;
            relationLOB.style.display = "none";
            // jika corporate
            const relationJobs = document.getElementById(
                "relationJobs"
            ) as HTMLElement;
            relationJobs.style.display = "";
        }
    };

    const getPreSalutationById = async (id: string, column: string) => {
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
    };

    const disableLob = async (id: string) => {
        if (id == "1") {
            // jika corporate
            const relationLOB = document.getElementById(
                "relationLob"
            ) as HTMLElement;
            relationLOB.style.display = "";
            // jika corporate
            const relationJobs = document.getElementById(
                "relationJobs"
            ) as HTMLElement;
            relationJobs.style.display = "none";
        } else if (id == "2") {
            // jika corporate
            const relationLOB = document.getElementById(
                "relationLob"
            ) as HTMLElement;
            relationLOB.style.display = "none";
            // jika corporate
            const relationJobs = document.getElementById(
                "relationJobs"
            ) as HTMLElement;
            relationJobs.style.display = "";
        }
    };
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefTag = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const isDisable =
        !query?.trim() ||
        data.relation_aka.filter(
            (item: any) =>
                item.name_aka?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

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
    const handleSwitchPKS = (e: any) => {
        if (e == true) {
            setSwitchPage(true);
            setData("DEFAULT_PAYABLE", "1");
        } else {
            setSwitchPage(false);
            setData("DEFAULT_PAYABLE", "0");
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
    const isDisableTag =
        !query?.trim() ||
        data.tagging_name.filter(
            (item: any) =>
                item.name_tag?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;

    const lobSelect = relationLOB?.map((query: any) => {
        return {
            value: query.RELATION_LOB_ID,
            label: query.RELATION_LOB_NAME,
        };
    });

    const professionSelect = profession?.map((query: any) => {
        return {
            value: query.RELATION_PROFESSION_ID,
            label: query.RELATION_PROFESSION_NAME,
        };
    });

    const relationSelect = relation?.map((query: any) => {
        return {
            value: query.RELATION_ORGANIZATION_ID,
            label: query.RELATION_ORGANIZATION_NAME,
        };
    });

    const [existingAbb, setExistingAbb] = useState<any>([]);

    const cekAbbreviationRelation = async (name: any) => {
        const flag = "";
        await axios
            .post(`/getCekAbbreviation`, { name, flag })
            .then((res: any) => {
                setExistingAbb(res.data);
                if (res.data.length >= 1) {
                    Swal.fire({
                        title: "Warning",
                        text: "Abbreviation already exists",
                        icon: "warning",
                    }).then((result: any) => {});
                }
                // cekAbbreviation(existingAbb);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const bankSelect = bank?.map((query: any) => {
        return {
            value: query.BANK_ID,
            label: query.BANK_ABBREVIATION,
        };
    });

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

    const deleteRowNoPKS = (i: number) => {
        const val = [...data.no_pks];
        val.splice(i, 1);
        setData("no_pks", val);
    };
    const deleteRowBankAccount = (i: number) => {
        const val = [...data.bank_account];
        val.splice(i, 1);
        setData("bank_account", val);
    };

    const addRowPKS = (e: FormEvent) => {
        e.preventDefault();

        setData("no_pks", [
            ...data.no_pks,
            {
                FOR_PKS: "",
                NO_PKS: "",
                STAR_DATE_PKS: "",
                END_DATE_PKS: "",
                DOCUMENT_PKS_ID: "",
                STATUS_PKS: 0,
                REMARKS_PKS: "",
                ENDING_BY_CANCEL: 0,
            },
        ]);
    };

    const addRowBankAccount = (e: FormEvent) => {
        e.preventDefault();

        setData("bank_account", [
            ...data.bank_account,
            {
                BANK_ID: "",
                ACCOUNT_NAME: "",
                ACCOUNT_NUMBER: "",
                NPWP_NAME: "",
            },
        ]);
    };

    const inputDataPKS = (
        name: string,
        value: string | undefined | File,
        i: number
    ) => {
        const changeVal: any = [...data.no_pks];
        changeVal[i][name] = value;
        setData("no_pks", changeVal);
    };

    const handleCheckboxEnding = (e: any, i: number) => {
        if (e.target.checked) {
            const changeVal: any = [...data.no_pks];
            changeVal[i]["ENDING_BY_CANCEL"] = 0;
            setData("no_pks", changeVal);
        } else {
            const changeVal: any = [...data.no_pks];
            changeVal[i]["ENDING_BY_CANCEL"] = 1;
            setData("no_pks", changeVal);
        }
    };

    const inputDataSwitchPKS = (e: any, i: number) => {
        if (e.target.checked) {
            const changeVal: any = [...data.no_pks];
            changeVal[i]["STATUS_PKS"] = 0;
            setData("no_pks", changeVal);
        } else {
            const changeVal: any = [...data.no_pks];
            changeVal[i]["STATUS_PKS"] = 1;
            setData("no_pks", changeVal);
        }
    };

    const inputDataBank = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.bank_account];
        changeVal[i][name] = value;
        setData("bank_account", changeVal);
    };

    const [showRelation, setShowRelation] = useState<boolean>(false);
    const inputRefRelation = useRef<HTMLInputElement>(null);
    const filteredRelation = relation.filter((item: any) =>
        item.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase()?.includes(
            data.name_relation.toLocaleLowerCase()?.trim()
        )
    );

    // cek relation existing
    const cekRelationName = () => {
        const filterRelation = relation.filter(
            (items: any) =>
                items.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase() ===
                data.name_relation.toLocaleLowerCase()?.trim()
        );

        if (filterRelation.length !== 0) {
            Swal.fire({
                title: "Warning",
                text: "Relation Already Exists",
                icon: "warning",
            }).then((result: any) => {});
            setData("name_relation", "");
        }
    };

    const checkCheckedMRelation = (id: string) => {
        if (data.relation_type_id.find((f: any) => f.id === String(id))) {
            return true;
        }
    };

    return (
        <>
            <ModalToAdd
                buttonAddOns={""}
                show={show}
                onClose={modal}
                title={"Add Relation"}
                url={`/relation`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[100%]"
                }
                body={
                    <>
                        <div className="xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-2 lg:grid lg:gap-4">
                            <div className="relative">
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
                                    value={data.relation_status_id}
                                    required
                                    onChange={(e) => {
                                        setData(
                                            "relation_status_id",
                                            e.target.value
                                        );
                                        getPreSalutationById(
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
                                    <option value={""}>
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
                            <div className="relative grid grid-cols-2 gap-2">
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="pre_salutation_id"
                                        value="Pre Salutation"
                                    />
                                    <div className="ml-[4.8rem] text-red-600"></div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.pre_salutation_id}
                                        onChange={(e) => {
                                            setData(
                                                "pre_salutation_id",
                                                e.target.value
                                            );
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
                                <div>
                                    <InputLabel
                                        className=""
                                        htmlFor="post_salutation_id"
                                        value="Post Salutation"
                                    />
                                    <div className="ml-[4.8rem] text-red-600"></div>
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={data.post_salutation_id}
                                        onChange={(e) => {
                                            setData(
                                                "post_salutation_id",
                                                e.target.value
                                            );
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
                        <div className="xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-2 lg:grid lg:gap-4">
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="name_relation"
                                    value="Name Relation"
                                />
                                <div className="ml-[6.7rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    ref={inputRefRelation}
                                    type="text"
                                    value={data.name_relation}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setData(
                                            "name_relation",
                                            e.target.value
                                        );

                                        if (e.target.value !== "") {
                                            setShowRelation(true);
                                        } else {
                                            setShowRelation(false);
                                        }
                                    }}
                                    onBlur={() => {
                                        cekRelationName();
                                        setShowRelation(false);
                                    }}
                                    required
                                    placeholder="Name Relation"
                                />
                                {showRelation &&
                                    filteredRelation.length !== 0 && (
                                        <div className="bg-white shadow-md rounded-md absolute mt-1 w-full px-2 text-sm overflow-y-auto h-32">
                                            <div className="mt-1 font-semibold italic">
                                                <span>
                                                    Relation Already Exists
                                                </span>
                                            </div>
                                            {filteredRelation?.map(
                                                (items: any, index: number) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="mt-1 px-2"
                                                        >
                                                            {
                                                                items.RELATION_ORGANIZATION_NAME
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                            </div>
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="abbreviation"
                                    value="Abbreviation"
                                />
                                <div className="ml-[5.8rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.abbreviation}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData("abbreviation", e.target.value)
                                    }
                                    required
                                    placeholder="Abbreviation"
                                    onBlur={() => {
                                        cekAbbreviationRelation(
                                            data.abbreviation
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-4 xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-2 lg:grid lg:gap-4">
                            <div className="mt-4">
                                {data.relation_aka?.length ? (
                                    <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
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
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        data.relation_aka.filter(
                                                                            (
                                                                                d: any
                                                                            ) =>
                                                                                d.name_aka !==
                                                                                tag.name_aka
                                                                        );
                                                                    setData(
                                                                        "relation_aka",
                                                                        updatedData
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
                                                    setData("relation_aka", []);
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
                                        if (e.key === "Enter" && !isDisable) {
                                            setData("relation_aka", [
                                                ...data.relation_aka,
                                                {
                                                    name_aka: query,
                                                },
                                            ]);
                                            setQuery("");
                                            // setMenuOpen(true);
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
                                        // setMenuOpen(true);
                                    }}
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                        <div
                            className={
                                data.relation_status_id === "2"
                                    ? "xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-2 lg:grid lg:gap-4"
                                    : "xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-3 lg:grid lg:gap-4"
                            }
                        >
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="date_of_birth"
                                    value="Date Of Birth"
                                />
                                <div className="relative grid grid-cols-1">
                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
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
                                        selected={data.date_of_birth}
                                        onChange={(date: any) => {
                                            setData(
                                                "date_of_birth",
                                                date.toLocaleDateString("en-CA")
                                            );
                                        }}
                                        className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyy"
                                    />
                                </div>
                            </div>
                            <div
                                className={
                                    data.relation_status_id === "2"
                                        ? "hidden"
                                        : "mt-4"
                                }
                            >
                                <InputLabel
                                    htmlFor="relation_email"
                                    value="Email"
                                />
                                <TextInput
                                    type="email"
                                    value={data.relation_email}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData(
                                            "relation_email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="xs:mt-0 lg:mt-4">
                                <InputLabel
                                    htmlFor="relation_website"
                                    value="Website"
                                />
                                <TextInput
                                    type="text"
                                    value={data.relation_website}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData(
                                            "relation_website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="www.example.com"
                                />
                            </div>
                        </div>
                        <div className="mt-4 relative">
                            <InputLabel
                                className="absolute"
                                htmlFor="relation_type_id"
                                value="Relation Type"
                            />
                            <div className="ml-[6.2rem] text-red-600">*</div>
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
                                                            defaultChecked={checkCheckedMRelation(
                                                                typeRelation.RELATION_TYPE_ID
                                                            )}
                                                            onChange={(e) => {
                                                                handleCheckbox(
                                                                    e
                                                                );
                                                                // checkFBIAndAgent();
                                                                // checkBAA(
                                                                //     e.target
                                                                //         .value
                                                                // );
                                                            }}
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
                        {/* field for agent dan fbi pks */}

                        {(data.relation_status_id === "2" &&
                            data.relation_type_id.find(
                                (f: any) => f.id === "3"
                            )) ||
                        data.relation_type_id.find((f: any) => f.id === "13") ||
                        (data.relation_status_id === "1" &&
                            data.relation_type_id.find(
                                (f: any) => f.id === "3"
                            )) ||
                        data.relation_type_id.find(
                            (f: any) => f.id === "13"
                        ) ? (
                            <>
                                <div className="grid grid-cols-2 gap-1 mt-2 relative">
                                    <div>
                                        <InputLabel
                                            value="NPWP"
                                            className="absolute"
                                        />
                                        <div className="ml-[2.7rem] text-red-600">
                                            *
                                        </div>
                                        <TextInput
                                            type="text"
                                            value={data.NPWP_RELATION}
                                            className="mt-2"
                                            onChange={(e) =>
                                                setData(
                                                    "NPWP_RELATION",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="NPWP"
                                        />
                                    </div>
                                    <div className="text-sm mt-8 flex">
                                        <div className="rotate-90 -ml-3">
                                            <SwitchPage
                                                enabled={switchPage}
                                                onChangeButton={handleSwitchPKS}
                                            />
                                        </div>
                                        <div className="">
                                            <div className="text-xs mb-1">
                                                <span>
                                                    Default Payable By Relation
                                                </span>
                                            </div>
                                            <div className="text-xs">
                                                <span>
                                                    Default Payable By Fresnel
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-2">
                                    <InputLabel value="PKS" required={false} />
                                </div> */}
                                {data.no_pks?.map((noPKS: any, i: number) => {
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
                                                        <div className="mt-1">
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
                                                className="col-span-1 flex justify-start items-center hover:cursor-pointer"
                                                title="Delete Row PKS"
                                                onClick={(e: any) => {
                                                    deleteRowNoPKS(e);
                                                }}
                                            >
                                                <span>
                                                    <XMarkIcon className="w-7 text-red-600" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div
                                    className="w-fit text-sm mt-1 text-gray-600 hover:cursor-pointer hover:underline"
                                    onClick={(e: any) => {
                                        addRowPKS(e);
                                    }}
                                >
                                    + Add Row PKS
                                </div>
                                {/* Bank Account */}
                                <div className="mt-2">
                                    <InputLabel
                                        value="Bank Account"
                                        className=""
                                    />
                                    {data.bank_account?.map(
                                        (bankAccount: any, i: number) => {
                                            return (
                                                <div
                                                    className="grid grid-cols-4 gap-2"
                                                    key={i}
                                                >
                                                    <div className="mt-1 shadow-lg">
                                                        <Select
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
                                                                            ? `text-white bg-red-600`
                                                                            : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                    }`,
                                                            }}
                                                            options={bankSelect}
                                                            isSearchable={true}
                                                            placeholder={
                                                                "Bank Name *"
                                                            }
                                                            value={
                                                                bankAccount.BANK_ID
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
                                                                inputDataBank(
                                                                    "BANK_ID",
                                                                    val,
                                                                    i
                                                                );
                                                            }}
                                                            primaryColor={
                                                                "bg-red-500"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                bankAccount.ACCOUNT_NAME
                                                            }
                                                            className="mt-2"
                                                            onChange={(e) =>
                                                                inputDataBank(
                                                                    "ACCOUNT_NAME",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            placeholder="Account Name"
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <TextInput
                                                            type="text"
                                                            value={
                                                                bankAccount.ACCOUNT_NUMBER
                                                            }
                                                            className="mt-2"
                                                            onChange={(e) =>
                                                                inputDataBank(
                                                                    "ACCOUNT_NUMBER",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            placeholder="Account Number"
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <div className="flex items-center">
                                                            <TextInput
                                                                type="text"
                                                                value={
                                                                    bankAccount.NPWP_NAME ===
                                                                    ""
                                                                        ? data.NPWP_RELATION
                                                                        : bankAccount.NPWP_NAME
                                                                }
                                                                className="mt-2"
                                                                onChange={(e) =>
                                                                    inputDataBank(
                                                                        "NPWP_NAME",
                                                                        e.target
                                                                            .value,
                                                                        i
                                                                    )
                                                                }
                                                                placeholder="NPWP"
                                                            />
                                                            <span
                                                                className="mt-2"
                                                                onClick={() => {
                                                                    deleteRowBankAccount(
                                                                        i
                                                                    );
                                                                }}
                                                            >
                                                                <XMarkIcon className="w-7 text-red-600 cursor-pointer" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                    <div
                                        className="text-sm text-gray-500 hover:underline hover:text-black hover:cursor-pointer w-fit mt-2"
                                        onClick={(e) => addRowBankAccount(e)}
                                    >
                                        <span>+ Add Bank Account</span>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {/* end field for agent dan fbi pks */}
                        {data.relation_status_id === "2" ? (
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="corporate_pic_for"
                                    value="Corporate PIC For"
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
                                    options={relationSelect}
                                    isSearchable={true}
                                    isMultiple={true}
                                    isClearable={true}
                                    placeholder={"--Select Relation--"}
                                    value={data.corporate_pic_for}
                                    onChange={(val: any) => {
                                        setData("corporate_pic_for", val);
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        ) : null}

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
                                placeholder={"--Select Profession--"}
                                value={data.profession_id}
                                // onChange={(e) =>
                                //     inputDataBank(
                                //         "BANK_ID",
                                //         e.target.value,
                                //         i
                                //     )
                                // }
                                onChange={(val: any) => {
                                    setData("profession_id", val);
                                }}
                                primaryColor={"bg-red-500"}
                            />
                        </div>
                        <div className="mt-4" id="relationLob">
                            <InputLabel
                                htmlFor="relation_lob_id"
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
                                value={data.relation_lob_id}
                                // onChange={(e) =>
                                //     inputDataBank(
                                //         "BANK_ID",
                                //         e.target.value,
                                //         i
                                //     )
                                // }
                                onChange={(val: any) => {
                                    setData("relation_lob_id", val);
                                }}
                                primaryColor={"bg-red-500"}
                            />
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
                        <div className="mt-4">
                            {data.tagging_name?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {data.tagging_name?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {tag.name_tag}
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    data.tagging_name.filter(
                                                                        (
                                                                            d: any
                                                                        ) =>
                                                                            d.name_tag !==
                                                                            tag.name_tag
                                                                    );
                                                                setData(
                                                                    "tagging_name",
                                                                    updatedData
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
                                                setData("tagging_name", []);
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !isDisableTag) {
                                        setData("tagging_name", [
                                            ...data.tagging_name,
                                            {
                                                name_tag: query,
                                            },
                                        ]);
                                        setQuery("");
                                        // setMenuOpen(true);
                                    }
                                }}
                            />
                            <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisableTag}
                                onClick={() => {
                                    if (isDisableTag) {
                                        return;
                                    }
                                    setData("tagging_name", [
                                        ...data.tagging_name,
                                        {
                                            name_tag: query,
                                        },
                                    ]);
                                    setQuery("");
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
        </>
    );
}
