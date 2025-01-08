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
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    EllipsisHorizontalIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import ToastMessage from "@/Components/ToastMessage";
import { FormEvent, Fragment } from "react";
import { InertiaFormProps } from "@inertiajs/react/types/useForm";
import TablePage from "@/Components/Table/Index";
import { link } from "fs";
import dateFormat from "dateformat";
import { Menu, Tab, Transition } from "@headlessui/react";
import Dropdown from "@/Components/Dropdown";
import { Console, log } from "console";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import AGGrid from "@/Components/AgGrid";
import AddPerson from "../Person/AddPerson";

export default function Relation({ auth }: PageProps) {
    const [getDetailRelation, setGetDetailRelation] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
        RELATION_SALUTATION_PRE: "",
        RELATION_SALUTATION_POST: "",
    });

    const [searchRelation, setSearchRelation] = useState<any>({
        relation_search: [
            {
                RELATION_ORGANIZATION_NAME: "",
                RELATION_TYPE_ID: "",
                flag: "flag",
            },
        ],
    });

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

    const [isSuccess, setIsSuccess] = useState<any>("");
    const [switchPage, setSwitchPage] = useState(true);
    const [switchPagePKS, setSwitchPagePKS] = useState({});

    const { data, setData, errors, reset } = useForm<any>({
        name_relation: "",
        abbreviation: "",
        relation_aka: [],
        relation_email: "",
        relation_website: "",
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
        corporate_pic_for: null,
        NPWP_RELATION: "",
        date_of_birth: "",
        DEFAULT_PAYABLE: 0,
        no_pks: [],
        bank_account: [],
    });

    // for detail person
    const [modalPerson, setModalPerson] = useState<any>({
        add: false,
    });

    const [dataPerson, setDataPerson] = useState<any>({
        PERSON_FIRST_NAME: "",
        PERSON_GENDER: "",
        PERSON_BIRTH_PLACE: "",
        PERSON_BIRTH_DATE: "",
        PERSON_KTP: "",
        PERSON_NPWP: "",
        PERSON_CONTACT: "",
        PERSON_EMAIL: "",
        PERSON_KK: "",
        m_person_email: [],
        m_person_contact: [],
        contact_emergency: [],
        INDIVIDU_RELATION_ID: "",
        PERSON_UPDATED_BY: "",
        PERSON_UPDATED_DATE: "",
    });

    // end for detail person

    const handleSuccess = async (message: string) => {
        if (message !== "") {
            if (message[0] === "0" || message[0] === "rType") {
                Swal.fire({
                    title: "Warning",
                    text: message[1],
                    icon: "warning",
                }).then((result: any) => {
                    // console.log(result);
                    if (result.value) {
                        setModal({
                            add: true,
                            delete: false,
                            edit: false,
                            view: false,
                            document: false,
                            search: false,
                        });
                    }
                });
            } else {
                if (message[4] === "2") {
                    Swal.fire({
                        title: "",
                        text: "Do you want to create detail person for this relation?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setDataPerson({
                                ...dataPerson,
                                PERSON_FIRST_NAME: message[1],
                                PERSON_BIRTH_DATE: message[5],
                                INDIVIDU_RELATION_ID: message[0],
                            });
                            setModalPerson({
                                add: !modalPerson.add,
                            });
                        }
                    });
                } else {
                    setIsSuccess("");
                    reset();
                    setData({
                        name_relation: "",
                        abbreviation: "",
                        relation_aka: [],
                        relation_email: "",
                        relation_website: "",
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
                        corporate_pic_for: null,
                        NPWP_RELATION: "",
                        date_of_birth: "",
                        DEFAULT_PAYABLE: 0,
                        no_pks: [],
                        bank_account: [],
                    });
                    Swal.fire({
                        title: "Success",
                        text: "New Relation Added",
                        icon: "success",
                    }).then((result: any) => {
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
                    setSwitchPagePKS(false);
                    setIsSuccess(message);
                }
            }
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

    // search
    const clearSearchRelation = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("RELATION_ORGANIZATION_NAME", "", 0);
        inputDataSearch("RELATION_TYPE_ID", "", 0);
        inputDataSearch("flag", "flag", 0);
        setIsSuccess({
            isSuccess: "success",
        });
    };

    const selectRType = relationType?.map((query: any) => {
        return {
            value: query.RELATION_TYPE_ID,
            label: query.RELATION_TYPE_NAME,
        };
    });

    const handleDetailRelation = async (data: any) => {
        {
            if (
                data?.pre_salutation === null &&
                data?.post_salutation !== null
            ) {
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_NAME,
                    RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
                    RELATION_SALUTATION_PRE: "",
                    RELATION_SALUTATION_POST:
                        data.post_salutation?.salutation_name,
                });
            } else if (
                data?.post_salutation === null &&
                data?.pre_salutation !== null
            ) {
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_NAME,
                    RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
                    RELATION_SALUTATION_PRE:
                        data.pre_salutation?.salutation_name,
                    RELATION_SALUTATION_POST: "",
                });
            } else {
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: data.RELATION_ORGANIZATION_NAME,
                    RELATION_ORGANIZATION_ID: data.RELATION_ORGANIZATION_ID,
                    RELATION_SALUTATION_PRE: "",
                    RELATION_SALUTATION_POST: "",
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
        }
    };

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchRelation.relation_search];
        changeVal[i][name] = value;
        setSearchRelation({ ...searchRelation, relation_search: changeVal });
    };

    const [bank, setBank] = useState<any>([]);
    const getRBank = async () => {
        await axios
            .post(`/getRBank`)
            .then((res) => {
                setBank(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSuccessPersonalInfo = async (message: string) => {
        if (message !== "") {
            setIsSuccess("");
            reset();
            setDataPerson({
                ...dataPerson,
                PERSON_FIRST_NAME: "",
                PERSON_GENDER: "",
                PERSON_BIRTH_PLACE: "",
                PERSON_BIRTH_DATE: "",
                PERSON_KTP: "",
                PERSON_NPWP: "",
                PERSON_KK: "",
                m_person_email: [
                    {
                        t_person_email: {
                            PERSON_EMAIL: "",
                        },
                    },
                ],
                m_person_contact: [
                    {
                        t_person_contact: {
                            PERSON_PHONE_NUMBER: "",
                        },
                    },
                ],
                contact_emergency: [],
                INDIVIDU_RELATION_ID: "",
                PERSON_UPDATED_BY: "",
                PERSON_UPDATED_DATE: "",
            });

            setData({
                name_relation: "",
                abbreviation: "",
                relation_aka: [],
                relation_email: "",
                relation_website: "",
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
                corporate_pic_for: null,
                NPWP_RELATION: "",
                date_of_birth: "",
                DEFAULT_PAYABLE: 0,
                no_pks: [],
                bank_account: [],
            });
            Swal.fire({
                title: "Success",
                text: "New Relation Added",
                icon: "success",
            }).then((result: any) => {
                if (result.value) {
                    setGetDetailRelation({
                        RELATION_ORGANIZATION_NAME: message[0],
                        RELATION_ORGANIZATION_ID: message[1],
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
            setSwitchPagePKS(false);
            setIsSuccess(message);
        }
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

            {/* modal add Person */}
            <AddPerson
                show={modalPerson.add}
                modal={() =>
                    setModalPerson({
                        add: false,
                    })
                }
                data={dataPerson}
                setData={setDataPerson}
                handleSuccessPersonalInfo={handleSuccessPersonalInfo}
            />
            {/* end modal add person */}

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
                bank={bank}
                idGroupRelation={""}
                handleSuccess={handleSuccess}
                relationStatus={relationStatus}
                relationGroup={relationGroup}
                relationType={relationType}
                profession={profession}
                relationLOB={relationLOB}
                // relation={relation}
                data={data}
                setData={setData}
                switchPage={switchPage}
                setSwitchPage={setSwitchPage}
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
                onSuccess={undefined}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailRelationPopup
                            relation={relation}
                            detailRelation={
                                getDetailRelation.RELATION_ORGANIZATION_ID
                            }
                            relationStatus={relationStatus}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                            setGetDetailRelation={setGetDetailRelation}
                            auth={auth}
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
                            onClick={async () => {
                                getRBank();
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
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <TextInput
                            type="text"
                            value={
                                searchRelation.relation_search[0]
                                    .RELATION_ORGANIZATION_NAME === ""
                                    ? ""
                                    : searchRelation.relation_search[0]
                                          .RELATION_ORGANIZATION_NAME
                            }
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch(
                                    "RELATION_ORGANIZATION_NAME",
                                    e.target.value,
                                    0
                                );
                                if (
                                    searchRelation.relation_search[0]
                                        .RELATION_ORGANIZATION_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (
                                        searchRelation.relation_search[0]
                                            .RELATION_TYPE_ID === "" &&
                                        searchRelation.relation_search[0]
                                            .RELATION_ORGANIZATION_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess({
                                        isSuccess: "success",
                                    });
                                }
                            }}
                            placeholder="Search Relation Name"
                        />
                        <Select
                            classNames={{
                                menuButton: () =>
                                    `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-red-600`,
                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                listItem: ({ isSelected }: any) =>
                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                            ? `text-white bg-red-600`
                                            : `text-gray-500 hover:bg-red-200 hover:text-black-500`
                                    }`,
                            }}
                            options={selectRType}
                            isSearchable={true}
                            placeholder={"Search Relation Type"}
                            value={
                                searchRelation.relation_search[0]
                                    .RELATION_TYPE_ID === ""
                                    ? ""
                                    : searchRelation.relation_search[0]
                                          .RELATION_TYPE_ID
                            }
                            onChange={(val: any) => {
                                inputDataSearch("RELATION_TYPE_ID", val, 0);
                                if (
                                    searchRelation.relation_search[0]
                                        .RELATION_TYPE_ID === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            primaryColor={"bg-red-500"}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchRelation.relation_search[0]
                                            .RELATION_TYPE_ID === "" &&
                                        searchRelation.relation_search[0]
                                            .RELATION_ORGANIZATION_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess({
                                        isSuccess: "success",
                                    });
                                }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => clearSearchRelation(e)}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchRelation.relation_search}
                            // loading={isLoading.get_policy}
                            url={"getRelation"}
                            doubleClickEvent={handleDetailRelation}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Relation Name",
                                    field: "RELATION_ORGANIZATION_NAME",
                                    flex: 7,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
