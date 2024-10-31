import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import AddPersonPopup from "./AddPerson";
import DetailPersonPopup from "./DetailPerson";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import UserPage from "./User/User";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import SelectTailwind from "react-tailwindcss-select";

export default function PIC({
    auth,
    idRelation,
}: PropsWithChildren<{
    auth: any;
    idRelation: any;
}>) {
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

    const [dataIndividu, setDataIndividu] = useState<any>({
        RELATION_ORGANIZATION_ID: idRelation,
        individu_relation: null,
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
        setDataIndividu({
            ...dataIndividu,
            RELATION_ORGANIZATION_ID: idRelation,
        });
        getIndividuRelation();
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
            setDataIndividu({
                RELATION_ORGANIZATION_ID: idRelation,
                individu_relation: null,
            });

            Swal.fire({
                title: "Success",
                text: "New Person Added",
                icon: "success",
            }).then((result: any) => {
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
    const [individuRelation, setIndividuRelation] = useState<any>([]);
    const getIndividuRelation = async () => {
        await axios
            .post(`/getIndividuRelation`)
            .then((res) => {
                setIndividuRelation(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [akaIndividu, setAkaIndividu] = useState<any>([]);

    const getAKAIndividu = async (idIndividu: number) => {
        await axios
            .post(`/getIndividuAKA`, { idIndividu })
            .then((res) => {
                setAkaIndividu(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const individuSelect = individuRelation
        ?.filter(
            (items: any) =>
                !dataPerson.data?.some(
                    (itemsDb: any) =>
                        itemsDb.RELATION_ORGANIZATION_ID ===
                        items.RELATION_ORGANIZATION_ID
                )
        )
        ?.map((query: any) => {
            // getAKAIndividu(query.RELATION_ORGANIZATION_ID);

            if (query.m_relation_aka[0]?.RELATION_AKA_NAME === undefined) {
                return {
                    value: query.RELATION_ORGANIZATION_ID,
                    label: query.RELATION_ORGANIZATION_NAME,
                };
            } else {
                return {
                    value: query.RELATION_ORGANIZATION_ID,
                    label:
                        query.RELATION_ORGANIZATION_NAME +
                        " (" +
                        query.m_relation_aka[0]?.RELATION_AKA_NAME +
                        ")",
                };
            }
        });

    const deletePersonAlert = (
        e: FormEvent,
        idPerson: any,
        idRelationCorporate: any
    ) => {
        e.preventDefault();
        Swal.fire({
            title: "Delete This PIC?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "Deleted!",
                //     text: "Your file has been deleted.",
                //     icon: "success",
                // });
                deletePerson(idPerson, idRelationCorporate);
            }
        });
    };
    const deletePerson = async (idPerson: any, idRelationCorporate: any) => {
        await axios
            .post(`/deletePerson`, { idPerson, idRelationCorporate })
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    text: "Person Delete",
                    icon: "success",
                }).then((result: any) => {
                    if (result.value) {
                        getPersons();
                        // getPersons();
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
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {/* modal add person */}
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
                buttonAddOns={""}
                title={"Add PIC"}
                url={`/addPic`}
                data={dataIndividu}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
                }
                onSuccess={handleSuccess}
                body={
                    <>
                        <div className="h-96">
                            <div className="">
                                <InputLabel
                                    htmlFor="corporate_pic_for"
                                    value="Select PIC Below"
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
                                    options={individuSelect}
                                    isSearchable={true}
                                    isMultiple={true}
                                    isClearable={true}
                                    placeholder={"--Select PIC--"}
                                    value={dataIndividu.individu_relation}
                                    onChange={(val: any) => {
                                        setDataIndividu({
                                            ...dataIndividu,
                                            individu_relation: val,
                                        });
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal add person */}

            {/* modal detail person */}
            <ModalToAction
                show={modal.view}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    });
                    getPersons();
                }}
                title={"Detail Person"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={null}
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

            <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => handleAddModel(e)}
                        >
                            <span>Add PIC</span>
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
                                    if (searchPerson.PERSON_FIRST_NAME !== "") {
                                        getPersons();
                                        setSearchPerson({
                                            ...searchPerson,
                                            PERSON_FIRST_NAME: "",
                                        });
                                    }
                                }
                            }}
                            placeholder="Search PIC Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer lg:hidden"
                                // onClick={() => clearSearchPerson()}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                // onClick={() => clearSearchPerson()}
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
                                        colSpan={""}
                                        rowSpan={""}
                                        className={
                                            "w-[10px] text-center bg-gray-200 rounded-tl-lg"
                                        }
                                        label={"No."}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={"min-w-[50px] bg-gray-200 "}
                                        label={"Name Person PIC"}
                                    />
                                    <TableTH
                                        colSpan={""}
                                        rowSpan={""}
                                        className={"min-w-[50px] bg-gray-200 "}
                                        label={"VIP"}
                                    />

                                    <TableTH
                                        colSpan={3}
                                        rowSpan={""}
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Action"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataPerson.data?.map(
                                    (dPerson: any, i: number) => {
                                        return (
                                            <tr
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? ""
                                                        : "bg-gray-100"
                                                }
                                            >
                                                <TableTD
                                                    value={dataPerson.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            <div
                                                                className="cursor-pointer"
                                                                onDoubleClick={(
                                                                    e
                                                                ) => {
                                                                    setDetailPerson(
                                                                        {
                                                                            PERSON_ID:
                                                                                dPerson.RELATION_ORGANIZATION_ID,
                                                                            PERSON_FIRST_NAME:
                                                                                dPerson.RELATION_ORGANIZATION_NAME,
                                                                        }
                                                                    );
                                                                    handleDetailModel(
                                                                        e,
                                                                        dPerson.INDIVIDU_RELATION_ID
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    dPerson.PERSON_FIRST_NAME
                                                                }
                                                            </div>
                                                        </>
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        dPerson.PIC_IS_VIP ===
                                                        1 ? (
                                                            <>
                                                                <div className="bg-amber-600 w-fit font-semibold text-sm text-white px-2 rounded-md">
                                                                    <span>
                                                                        VIP
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-fit font-semibold text-sm text-black px-2 rounded-md">
                                                                    <span>
                                                                        -
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    className={""}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            <div
                                                                className="cursor-pointer hover:text-red-500"
                                                                title="Delete Person"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    deletePersonAlert(
                                                                        e,
                                                                        dPerson.PERSON_ID,
                                                                        idRelation
                                                                    );
                                                                }}
                                                            >
                                                                <span>
                                                                    <XMarkIcon className="w-6" />
                                                                </span>
                                                            </div>
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
        </>
    );
}
