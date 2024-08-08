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
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import SelectTailwind from "react-tailwindcss-select";

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
    data,
    setData,
    switchPage,
    setSwitchPage,
    switchPageTBK,
    setSwitchPageTBK,
}: PropsWithChildren<{
    idGroupRelation: string;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
    show: any;
    modal: any;
    handleSuccess: any;
    data: any;
    setData: any;
    switchPage: any;
    setSwitchPage: any;
    switchPageTBK: any;
    setSwitchPageTBK: any;
}>) {
    // console.log("xx", relationGroup);
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
            document.getElementById("relationLob").style.display = "";
            document.getElementById("relationJobs").style.display = "none";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
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
            document.getElementById("relationLob").style.display = "";
            document.getElementById("relationJobs").style.display = "none";
        } else if (id == "2") {
            document.getElementById("relationLob").style.display = "none";
            document.getElementById("relationJobs").style.display = "";
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
    const handleCheckboxHR = (e: any) => {
        if (e == true) {
            setSwitchPage(true);
            setData("is_managed", "1");
        } else {
            setSwitchPage(false);
            setData("is_managed", "0");
        }
    };
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
    const handleCheckboxTBK = (e: any) => {
        if (e == true) {
            setSwitchPageTBK(true);
            setData("mark_tbk_relation", "1");
        } else {
            setSwitchPageTBK(false);
            setData("mark_tbk_relation", "0");
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

    // const cekAbbreviation = (result: any) => {
    //     console.log(result.length);
    //     if (result.length === 1) {
    //         alert("ADA");
    //     } else {
    //         alert("gaada");
    //     }
    // };
    return (
        // <AuthenticatedLayout user={auth.user} header={"Detail Relation"}>
        // <Head title="Detail Relation" />
        // { detailRelation?.map((data:, i: number) => {
        // })}
        <>
            <ModalToAdd
                show={show}
                onClose={modal}
                title={"Add Relation"}
                url={`/relation`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
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
                                    type="text"
                                    value={data.name_relation}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setData("name_relation", e.target.value)
                                    }
                                    required
                                    placeholder="Name Relation"
                                />
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
                        {/* <div className="mt-4">
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
                        </div> */}
                        {/* <div className="mt-4">
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
                        </div> */}
                        <div className="xs:grid-cols-1 xs:grid xs:gap-0 lg:grid-cols-2 lg:grid lg:gap-4">
                            <div className="mt-4">
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
                                                            // defaultChecked={
                                                            //     data.relation_type_id
                                                            // }
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
                            {/* <select
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
                            </select> */}
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
                            {/* <select
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
                            </select> */}
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

        // </AuthenticatedLayout>
    );
}
