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

export default function DetailStructure({
    idStructure,
    grade,
    structureCombo,
}: PropsWithChildren<{
    idStructure: any;
    grade: any;
    structureCombo: any;
}>) {
    const [dataStructureNew, setDataStructureNew] = useState<any>([]);

    useEffect(() => {
        getStructureDetail(idStructure);
    }, [idStructure]);

    const getStructureDetail = async (id: string) => {
        await axios
            .post(`/getStructureDetail`, { id })
            .then((res) => {
                setDataStructureNew(res.data);
                setDataById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_STRUCTURE_NAME: "",
        RELATION_STRUCTURE_ALIAS: "",
        RELATION_STRUCTURE_DESCRIPTION: "",
        RELATION_STRUCTURE_PARENT_ID: "",
        RELATION_ORGANIZATION_ID: "",
        RELATION_STRUCTURE_MAPPING: "",
        RELATION_GRADE_ID: "",
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
            text: "Edit Relation Structure",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getStructureDetail(message[0]);
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
                title={"Edit Structure"}
                url={`/editStructure`}
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
                                    htmlFor="RELATION_STRUCTURE_NAME"
                                    value={"Structure Name"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="RELATION_STRUCTURE_NAME"
                                    type="text"
                                    name="RELATION_STRUCTURE_NAME"
                                    value={dataById.RELATION_STRUCTURE_ALIAS}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_STRUCTURE_ALIAS:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Structure Name"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GRADE_ID"
                                    value={"Grade"}
                                />
                                <div className="ml-[3rem] text-red-600">*</div>
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.RELATION_GRADE_ID}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_GRADE_ID: e.target.value,
                                        });
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Grade --
                                    </option>
                                    {grade?.map((dGrade: any, i: number) => {
                                        return (
                                            <option
                                                value={dGrade.GRADE_ID}
                                                key={i}
                                            >
                                                {dGrade.GRADE_AKA}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="RELATION_STRUCTURE_PARENT_ID"
                                value={"Parent Structure"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.RELATION_STRUCTURE_PARENT_ID}
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_STRUCTURE_PARENT_ID:
                                            e.target.value,
                                    });
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {structureCombo
                                    ?.filter(
                                        (m: any) =>
                                            m.RELATION_STRUCTURE_ALIAS !==
                                            dataById.RELATION_STRUCTURE_ALIAS
                                    )
                                    .map((item: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    item.RELATION_STRUCTURE_ID
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
                                htmlFor="RELATION_STRUCTURE_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_STRUCTURE_DESCRIPTION"
                                name="RELATION_STRUCTURE_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_STRUCTURE_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_STRUCTURE_DESCRIPTION:
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
                                    {dataStructureNew.to_relation
                                        ?.RELATION_ORGANIZATION_ALIAS === null
                                        ? "-"
                                        : dataStructureNew.to_relation
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
                                    {dataStructureNew.parent === null
                                        ? "-"
                                        : dataStructureNew.parent
                                              ?.RELATION_STRUCTURE_NAME}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <a
                                onClick={(e) =>
                                    handleEditModel(
                                        e,
                                        dataStructureNew.RELATION_STRUCTURE_ID
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
                                    {dataStructureNew.RELATION_STRUCTURE_DESCRIPTION ===
                                        "" ||
                                    dataStructureNew.RELATION_STRUCTURE_DESCRIPTION ===
                                        null
                                        ? "-"
                                        : dataStructureNew.RELATION_STRUCTURE_DESCRIPTION}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
