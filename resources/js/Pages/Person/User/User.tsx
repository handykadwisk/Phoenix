import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";

export default function User({
    idRelation,
    dataUsers,
}: PropsWithChildren<{
    idRelation: any;
    dataUsers: any;
}>) {
    // useEffect(() => {
    //     getUsers();
    // }, []);

    // const [dataUsers, setDataUsers] = useState<any>([]);
    console.log("xxx", dataUsers.data.users);

    // const getPersons = async (pageNumber = "page=1") => {
    //     await axios
    //         .post(`/getPersons?${pageNumber}`, {
    //             idRelation,
    //             // PERSON_FIRST_NAME: searchPerson.PERSON_FIRST_NAME,
    //         })
    //         .then((res) => {
    //             setDataPerson(res.data);
    //             // if (modal.search) {
    //             //     setModal({
    //             //         add: false,
    //             //         delete: false,
    //             //         edit: false,
    //             //         view: false,
    //             //         document: false,
    //             //         search: false,
    //             //     });
    //             //     setSearchRelation({
    //             //         ...searchRelation,
    //             //         RELATION_ORGANIZATION_NAME: "",
    //             //     });
    //             // }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    return (
        <>
            <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            // onClick={(e) => handleAddModel(e)}
                        >
                            <span>Add User</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[293px]">
                        <TextInput
                            id="PERSON_FIRST_NAME"
                            type="text"
                            name="PERSON_FIRST_NAME"
                            // value={searchPerson.PERSON_FIRST_NAME}
                            className="mt-2 ring-1 ring-red-600"
                            // onChange={(e) =>
                            //     setSearchPerson({
                            //         ...searchPerson,
                            //         PERSON_FIRST_NAME: e.target.value,
                            //     })
                            // }
                            // onKeyDown={(e) => {
                            //     if (e.key === "Enter") {
                            //         if (searchPerson.PERSON_FIRST_NAME !== "") {
                            //             getPersons();
                            //             setSearchPerson({
                            //                 ...searchPerson,
                            //                 PERSON_FIRST_NAME: "",
                            //             });
                            //         }
                            //     }
                            // }}
                            placeholder="Search User Name"
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
                                        className={
                                            "min-w-[50px] bg-gray-200 rounded-tr-lg"
                                        }
                                        label={"Name Person"}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {dataUsers.data.users?.map(
                                    (dPerson: any, i: number) => {
                                        return (
                                            <tr
                                                // onDoubleClick={(e) => {
                                                //     setDetailPerson({
                                                //         PERSON_ID:
                                                //             dPerson.PERSON_ID,
                                                //         PERSON_FIRST_NAME:
                                                //             dPerson.PERSON_FIRST_NAME,
                                                //     });
                                                //     handleDetailModel(
                                                //         e,
                                                //         dPerson.PERSON_ID
                                                //     );
                                                // }}
                                                key={i}
                                                className={
                                                    i % 2 === 0
                                                        ? "cursor-pointer"
                                                        : "bg-gray-100 cursor-pointer"
                                                }
                                            >
                                                <TableTD
                                                    value={dataUsers.from + i}
                                                    className={"text-center"}
                                                />
                                                <TableTD
                                                    value={
                                                        <>
                                                            {
                                                                dPerson.users
                                                                    ?.name
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
                    {/* <div className="w-full px-5 py-2 bottom-0 left-0 absolute">
                            <Pagination
                                links={dataPerson.links}
                                fromData={dataPerson.from}
                                toData={dataPerson.to}
                                totalData={dataPerson.total}
                                clickHref={(url: string) =>
                                    getPersons(url.split("?").pop())
                                }
                            />
                        </div> */}
                </div>
            </div>
        </>
    );
}
