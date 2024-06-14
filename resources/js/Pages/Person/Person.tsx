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
    // const [detailPerson, setDetailPerson] = useState<any>([]);
    const [idPerson, setIdPerson] = useState<string>("");

    useEffect(() => {
        getPersons();
    }, []);

    const getPersons = async (pageNumber = "page=1") => {
        await axios
            .post(`/getPersons?${pageNumber}`, {
                idRelation,
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
        TEXT_STATUS_ID: "",
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
                TEXT_STATUS_ID: "",
                PERSON_RECRUITMENT_LOCATION: "",
                PERSON_LOCK_UPDATE: "",
                PERSON_LOCK_UPDATED_DATE: "",
                PERSON_SALARY_ADJUSTMENT1: "",
                PERSON_SALARY_ADJUSTMENT2: "",
                CONTACT_EMERGENCY: [],
            });

            Swal.fire({
                title: "Success",
                text: "New Relation Added",
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
                        <DetailPersonPopup
                            idPerson={idPerson}
                            idRelation={idRelation}
                        />
                    </>
                }
            />
            {/* end detail person */}

            <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="p-6 text-gray-900 mb-60">
                        <div className="rounded-md bg-white pt-6 pl-10 pr-10 pb-10 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                            {/* header table */}
                            <div className="md:grid md:grid-cols-8 md:gap-4">
                                <Button
                                    className="text-sm w-full lg:w-1/2 font-semibold px-6 py-1.5 mb-4 md:col-span-2"
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
                                    onClick={(e) => handleAddModel(e)}
                                >
                                    {"Add Person"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 xs:gap-0 lg:grid-cols-3 lg:gap-4">
                            <div className="bg-white rounded-md p-10 mb-5 lg:mb-0 shadow-lg">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2 xs:col-span-3 lg:col-span-2">
                                        <button
                                            className=" w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4 hover:ring-red-500"
                                            onClick={() => {
                                                // setModal({
                                                //     add: false,
                                                //     delete: false,
                                                //     edit: false,
                                                //     view: false,
                                                //     document: false,
                                                //     search: !modal.search,
                                                // });
                                            }}
                                        >
                                            <MagnifyingGlassIcon
                                                className="mx-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            Search Relation
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center xs:col-span-3 lg:col-auto text-sm">
                                        <Button
                                            className="mb-4 w-full py-2 px-3"
                                            // onClick={() =>
                                            //     clearSearchRelation()
                                            // }
                                        >
                                            Clear Search
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md col-span-2 p-10 shadow-lg">
                                {dataPerson.data?.length === 0 ? (
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
                                                                "Name Person"
                                                            }
                                                        />
                                                        <TableTH
                                                            className={
                                                                "min-w-[50px] text-center"
                                                            }
                                                            label={"Action"}
                                                        />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataPerson.data?.map(
                                                        (
                                                            dPerson: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <tr
                                                                    key={i}
                                                                    className={
                                                                        i %
                                                                            2 ===
                                                                        0
                                                                            ? ""
                                                                            : "bg-gray-100"
                                                                    }
                                                                >
                                                                    <TableTD
                                                                        value={
                                                                            dataPerson.from +
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
                                                                                    dPerson.PERSON_FIRST_NAME
                                                                                }
                                                                            </>
                                                                        }
                                                                        className={
                                                                            ""
                                                                        }
                                                                    />
                                                                    <TableTD
                                                                        value={
                                                                            <>
                                                                                <a
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleDetailModel(
                                                                                            e,
                                                                                            dPerson.PERSON_ID
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className="flex justify-center items-center"
                                                                                        title="Detail"
                                                                                    >
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            strokeWidth={
                                                                                                1.5
                                                                                            }
                                                                                            stroke="currentColor"
                                                                                            className="size-6 text-red-700 cursor-pointer"
                                                                                        >
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                                            />
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                                            />
                                                                                        </svg>
                                                                                    </div>
                                                                                </a>
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
                                            links={dataPerson.links}
                                            fromData={dataPerson.from}
                                            toData={dataPerson.to}
                                            totalData={dataPerson.total}
                                            clickHref={(url: string) =>
                                                getPersons(url.split("?").pop())
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        {/* table page*/}
                    </div>
                </div>
            </div>
        </>
    );
}
