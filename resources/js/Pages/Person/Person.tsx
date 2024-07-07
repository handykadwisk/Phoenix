import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import AddPersonPopup from "./AddPerson";
import DetailPersonPopup from "./DetailPerson";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import UserPage from "./User/User";

export default function Person({
    auth,
    idRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
}>) {
    const stats = [
        { name: "Policy", stat: "71,897" },
        { name: "Claim", stat: "58.16%" },
        { name: "Assets", stat: "24.57%" },
    ];
    // data person
    const [dataPerson, setDataPerson] = useState<any>([]);
    const [dataPersonRelationship, setDataPersonRelationship] = useState<any>(
        []
    );
    const [detailPerson, setDetailPerson] = useState<any>({
        PERSON_ID: "",
        PERSON_FIRST_NAME: "",
    });
    const [idPerson, setIdPerson] = useState<string>("");
    const [searchPerson, setSearchPerson] = useState<any>({
        PERSON_FIRST_NAME: "",
    });

    useEffect(() => {
        getPersons();
    }, []);

    const getPersons = async (pageNumber = "page=1") => {
        await axios
            .post(`/getPersons?${pageNumber}`, {
                idRelation,
                PERSON_FIRST_NAME: searchPerson.PERSON_FIRST_NAME,
            })
            .then((res) => {
                setDataPerson(res.data);
                // if (modal.search) {
                //     setModal({
                //         add: false,
                //         delete: false,
                //         edit: false,
                //         view: false,
                //         document: false,
                //         search: false,
                //     });
                //     setSearchRelation({
                //         ...searchRelation,
                //         RELATION_ORGANIZATION_NAME: "",
                //     });
                // }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const { data, setData, errors, reset } = useForm<any>({
        PERSONE_ID: "",
        PERSON_FIRST_NAME: "",
        PERSON_MIDDLE_NAME: "",
        PERSON_LAST_NAME: "",
        PERSON_NICKNAME: "",
        PERSON_GENDER: "",
        PERSON_BIRTH_PLACE: "",
        PERSON_BIRTH_DATE: "",
        PERSON_EMAIL: "",
        PERSON_CONTACT: "",
        PERSON_PARENT: "",
        PERSON_MAPPING: "",
        RELATION_ORGANIZATION_ID: "",
        STRUCTURE_ID: "",
        DIVISION_ID: "",
        OFFICE_ID: "",
        PERSON_IS_DELETED: "",
        PERSON_CREATED_BY: "",
        PERSON_CREATED_DATE: "",
        PERSON_UPDATED_BY: "",
        PERSON_UPDATED_DATE: "",
        PERSON_CATEGORY: "",
        PERSON_HIRE_DATE: "",
        PERSON_END_DATE: "",
        PERSON_KTP: "",
        PERSON_NPWP: "",
        PERSON_BANK_ACCOUNT_ID: "",
        PERSON_IMAGE_ID: "",
        PERSON_KK: "",
        PERSON_BLOOD_TYPE: "",
        PERSON_BLOOD_RHESUS: "",
        PERSON_MARITAL_STATUS: "",
        TAX_STATUS_ID: "",
        PERSON_RECRUITMENT_LOCATION: "",
        PERSON_LOCK_UPDATE: "",
        PERSON_LOCK_UPDATED_DATE: "",
        PERSON_SALARY_ADJUSTMENT1: "",
        PERSON_SALARY_ADJUSTMENT2: "",
        CONTACT_EMERGENCY: [],
    });

    const getPersonRelationship = async () => {
        await axios
            .get(`/getPersonRelationship`)
            .then((res) => {
                setDataPersonRelationship(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const handleAddModel = async (e: FormEvent) => {
        e.preventDefault();
        getPersonRelationship();
        setData("RELATION_ORGANIZATION_ID", idRelation);
        setModal({
            add: !modal.add,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    };

    const handleDetailModel = async (e: FormEvent, idPerson: string) => {
        e.preventDefault();
        // show modal detail
        getPersonRelationship();
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
        setIdPerson(idPerson);
    };

    const handleSuccess = (message: string) => {
        // setIsSuccess("");
        if (message !== "") {
            setData({
                PERSON_FIRST_NAME: "",
                PERSON_MIDDLE_NAME: "",
                PERSON_LAST_NAME: "",
                PERSON_NICKNAME: "",
                PERSON_GENDER: "",
                PERSON_BIRTH_PLACE: "",
                PERSON_BIRTH_DATE: "",
                PERSON_EMAIL: "",
                PERSON_CONTACT: "",
                PERSON_PARENT: "",
                PERSON_MAPPING: "",
                RELATION_ORGANIZATION_ID: "",
                STRUCTURE_ID: "",
                DIVISION_ID: "",
                OFFICE_ID: "",
                PERSON_IS_DELETED: "",
                PERSON_CREATED_BY: "",
                PERSON_CREATED_DATE: "",
                PERSON_UPDATED_BY: "",
                PERSON_UPDATED_DATE: "",
                PERSON_CATEGORY: "",
                PERSON_HIRE_DATE: "",
                PERSON_END_DATE: "",
                PERSON_KTP: "",
                PERSON_NPWP: "",
                PERSON_BANK_ACCOUNT_ID: "",
                PERSON_IMAGE_ID: "",
                PERSON_KK: "",
                PERSON_BLOOD_TYPE: "",
                PERSON_BLOOD_RHESUS: "",
                PERSON_MARITAL_STATUS: "",
                TAX_STATUS_ID: "",
                PERSON_RECRUITMENT_LOCATION: "",
                PERSON_LOCK_UPDATE: "",
                PERSON_LOCK_UPDATED_DATE: "",
                PERSON_SALARY_ADJUSTMENT1: "",
                PERSON_SALARY_ADJUSTMENT2: "",
                CONTACT_EMERGENCY: [],
            });

            Swal.fire({
                title: "Success",
                text: "New Person Added",
                icon: "success",
            }).then((result: any) => {
                // console.log(result);
                if (result.value) {
                    getPersons();
                    // setGetDetailRelation(message);
                    // setModal({
                    //     add: false,
                    //     delete: false,
                    //     edit: false,
                    //     view: true,
                    //     document: false,
                    //     search: false,
                    // });
                }
            });
        }
    };

    const [tab, setTab] = useState<any>({
        nameTab: "Person",
        currentTab: true,
    });
    const tabs = [
        { name: "Person", href: "#", current: true },
        { name: "User", href: "#", current: false },
    ];

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <>
            {/* modal add person */}
            <AddPersonPopup
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
                data={data}
                setData={setData}
                handleSuccess={handleSuccess}
                dataPersonRelationship={dataPersonRelationship}
            />
            {/* end modal add person */}

            {/* modal detail person */}
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
                title={"Detail Person"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailPersonPopup
                            idPerson={idPerson}
                            idRelation={idRelation}
                            dataPersonRelationship={dataPersonRelationship}
                        />
                    </>
                }
            />
            {/* end detail person */}

            <div className="mb-4">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={tabs.find((tab) => tab.current).name}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav
                            className="-mb-px flex space-x-2"
                            aria-label="Tabs"
                        >
                            {tabs.map((tabNew) => (
                                <a
                                    key={tabNew.name}
                                    onClick={() => {
                                        setTab({
                                            nameTab: tabNew.name,
                                            currentTab: true,
                                        });
                                    }}
                                    className={classNames(
                                        tabNew.name === tab.nameTab &&
                                            tab.currentTab === true
                                            ? "border-red-500 text-red-600 cursor-pointer"
                                            : "border-transparent text-gray-500 hover:border-red-300 hover:text-red-700 cursor-pointer",
                                        "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                                    )}
                                    aria-current={
                                        tabNew.name === tab.nameTab &&
                                        tab.currentTab === true
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {tabNew.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            {tab.nameTab === "Person" ? (
                // person
                <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                        <div className="bg-white mb-4 rounded-md shadow-md p-4">
                            <div
                                className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                                onClick={(e) => handleAddModel(e)}
                            >
                                <span>Add Person</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                            <TextInput
                                id="PERSON_FIRST_NAME"
                                type="text"
                                name="PERSON_FIRST_NAME"
                                value={searchPerson.PERSON_FIRST_NAME}
                                className="mt-2 ring-1 ring-red-600"
                                onChange={(e) =>
                                    setSearchPerson({
                                        ...searchPerson,
                                        PERSON_FIRST_NAME: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (
                                            searchPerson.PERSON_FIRST_NAME !==
                                            ""
                                        ) {
                                            getPersons();
                                            setSearchPerson({
                                                ...searchPerson,
                                                PERSON_FIRST_NAME: "",
                                            });
                                        }
                                    }
                                }}
                                placeholder="Search Person Name"
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <div
                                    className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                    onClick={() => clearSearchPerson()}
                                >
                                    Search
                                </div>
                                <div
                                    className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                    onClick={() => clearSearchPerson()}
                                >
                                    Clear Search
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[60rem] xs:mt-4 lg:mt-0">
                        <div className="max-w-full ring-1 ring-gray-200 rounded-lg custom-table overflow-visible mb-20">
                            <table className="w-full table-auto divide-y divide-gray-300">
                                <thead className="">
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <TableTH
                                            className={
                                                "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                            }
                                            label={"No."}
                                        />
                                        <TableTH
                                            className={
                                                "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                            }
                                            label={"Name Person"}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPerson.data?.map(
                                        (dPerson: any, i: number) => {
                                            return (
                                                <tr
                                                    onDoubleClick={(e) => {
                                                        setDetailPerson({
                                                            PERSON_ID:
                                                                dPerson.PERSON_ID,
                                                            PERSON_FIRST_NAME:
                                                                dPerson.PERSON_FIRST_NAME,
                                                        });
                                                        handleDetailModel(
                                                            e,
                                                            dPerson.PERSON_ID
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
                                                        value={
                                                            dataPerson.from + i
                                                        }
                                                        className={
                                                            "text-center"
                                                        }
                                                    />
                                                    <TableTD
                                                        value={
                                                            <>
                                                                {
                                                                    dPerson.PERSON_FIRST_NAME
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
                        <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                            <Pagination
                                links={dataPerson.links}
                                fromData={dataPerson.from}
                                toData={dataPerson.to}
                                totalData={dataPerson.total}
                                clickHref={(url: string) =>
                                    getPersons(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // user
                <UserPage idRelation={idRelation} dataUsers={dataPerson} />
            )}
        </>
    );
}
