import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    CheckIcon,
    HandThumbUpIcon,
    PencilSquareIcon,
    UserIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import AddRelationPopup from "../Relation/AddRelation";
import DetailRelationPopup from "../Relation/DetailRelation";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

export default function DetailDivision({
    idDivision,
    divisionCombo,
}: PropsWithChildren<{
    idDivision: any;
    divisionCombo: any;
}>) {
    const [dataDivisionNew, setDataDivisionNew] = useState<any>([]);

    useEffect(() => {
        getDivisionDetail(idDivision);
    }, [idDivision]);

    const getDivisionDetail = async (id: string) => {
        await axios
            .post(`/getDivisionDetail`, { id })
            .then((res) => {
                setDataDivisionNew(res.data);
                // setDataById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_DIVISION_NAME: "",
        RELATION_DIVISION_ALIAS: "",
        RELATION_DIVISION_INITIAL: "",
        RELATION_DIVISION_DESCRIPTION: "",
        RELATION_DIVISION_PARENT_ID: "",
        RELATION_DIVISION_MAPPING: "",
        RELATION_DIVISION_CREATED_BY: "",
        RELATION_DIVISION_CREATED_DATE: "",
    });

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        setDataById(dataDivisionNew);
        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    const handleSuccess = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Edit Relation Division",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDivisionDetail(message[0]);
                // setGetDetailRelation({
                //     RELATION_ORGANIZATION_NAME: message[1],
                //     RELATION_ORGANIZATION_ID: message[0],
                // });
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
    };
    return (
        <>
            {/* <span>Detail Division</span> */}
            {/* modal edit*/}
            <ModalToAdd
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
                title={"Edit Division"}
                url={`/editDivision`}
                data={dataById}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className=""
                                htmlFor="RELATION_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-2">
                                {
                                    dataById.to_relation
                                        ?.RELATION_ORGANIZATION_NAME
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_DIVISION_NAME"
                                    value={"Division Name"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_DIVISION_NAME"
                                    type="text"
                                    name="RELATION_DIVISION_NAME"
                                    value={dataById.RELATION_DIVISION_NAME}
                                    className="mt-2"
                                    autoComplete="RELATION_DIVISION_NAME"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_DIVISION_NAME:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_DIVISION_INITIAL"
                                    value={"Initial"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_DIVISION_INITIAL"
                                    type="text"
                                    name="RELATION_DIVISION_INITIAL"
                                    value={dataById.RELATION_DIVISION_INITIAL}
                                    className="mt-2"
                                    autoComplete="RELATION_DIVISION_INITIAL"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_DIVISION_INITIAL:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="RELATION_DIVISION_PARENT_ID"
                                value={"Parent Division"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_DIVISION_PARENT_ID}
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_DIVISION_PARENT_ID:
                                            e.target.value,
                                    });
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {divisionCombo
                                    ?.filter(
                                        (m: any) =>
                                            m.RELATION_DIVISION_ALIAS !==
                                            dataById.RELATION_DIVISION_ALIAS
                                    )
                                    .map((item: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    item.RELATION_DIVISION_ID
                                                }
                                                key={i}
                                            >
                                                {item.text_combo}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="RELATION_DIVISION_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_DIVISION_DESCRIPTION"
                                name="RELATION_DIVISION_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_DIVISION_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_DIVISION_DESCRIPTION:
                                            e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal edit*/}
            <div className="bg-white rounded-md shadow-md p-4 mb-2">
                <div className="">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2">
                            <div className="font-semibold text-sm">
                                Relation Name
                            </div>
                            <div className="text-xs text-gray-500">
                                <span>
                                    {dataDivisionNew.to_relation
                                        ?.RELATION_ORGANIZATION_ALIAS === null
                                        ? "-"
                                        : dataDivisionNew.to_relation
                                              ?.RELATION_ORGANIZATION_ALIAS}
                                </span>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="font-semibold text-sm">
                                Parent Name
                            </div>
                            <div className="text-xs text-gray-500">
                                <span>
                                    {dataDivisionNew.parent === null
                                        ? "-"
                                        : dataDivisionNew.parent
                                              ?.RELATION_DIVISION_ALIAS}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <a
                                onClick={(e) =>
                                    handleEditModel(
                                        e,
                                        dataDivisionNew.RELATION_DIVISION_ID
                                    )
                                }
                                className="cursor-pointer"
                                title="Edit Structure"
                            >
                                <div className="p-1 rounded-md text-red-600">
                                    <PencilSquareIcon className="w-5" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="grid grid-cols-1">
                        <div>
                            <div className="font-semibold text-sm">
                                Description
                            </div>
                            <div className="text-xs text-gray-500">
                                <span>
                                    {dataDivisionNew.RELATION_DIVISION_DESCRIPTION ===
                                        "" ||
                                    dataDivisionNew.RELATION_DIVISION_DESCRIPTION ===
                                        null
                                        ? "-"
                                        : dataDivisionNew.RELATION_DIVISION_DESCRIPTION}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
