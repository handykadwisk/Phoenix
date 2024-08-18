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
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToastMessage from "@/Components/ToastMessage";

export default function DetailStructure({
    idStructure,
    grade,
    structureCombo,
    setIsSuccess,
    setDetailStructure,
}: PropsWithChildren<{
    setDetailStructure: any;
    idStructure: any;
    grade: any;
    structureCombo: any;
    setIsSuccess: any;
}>) {
    const [dataStructureNew, setDataStructureNew] = useState<any>([]);
    useEffect(() => {
        getCompanyStructureDetail(idStructure);
    }, [idStructure]);

    const getCompanyStructureDetail = async (id: string) => {
        await axios
            .post(`/getCompanyStructureDetail`, { id })
            .then((res) => {
                setDataStructureNew(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // modal edit
    const [modalEdit, setModalEdit] = useState<any>({
        edit: false,
    });

    // data edit structure
    const [dataById, setDataById] = useState<any>({
        COMPANY_STRUCTURE_NAME: "",
        COMPANY_STRUCTURE_ALIAS: "",
        COMPANY_STRUCTURE_DESCRIPTION: "",
        COMPANY_STRUCTURE_PARENT_ID: "",
        COMPANY_ID: "",
        COMPANY_STRUCTURE_MAPPING: "",
        COMPANY_GRADE_ID: "",
    });

    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();
        setDataById(dataStructureNew);
        setModalEdit({
            edit: !modalEdit.edit,
        });
    };
    const handleSuccess = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setDetailStructure({
                COMPANY_STRUCTURE_NAME: message[1],
                COMPANY_STRUCTURE_ID: message[0],
            });
            getCompanyStructureDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };
    return (
        <>
            {/* Modal Edit Structure */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEdit.edit}
                onClose={() =>
                    setModalEdit({
                        edit: false,
                    })
                }
                title={"Edit Structure Company"}
                url={`/editStructureCompany`}
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
                                htmlFor="COMPANY_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-2">
                                {dataById.to_company?.COMPANY_NAME}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_STRUCTURE_NAME"
                                    value={"Structure Name"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={dataById.COMPANY_STRUCTURE_ALIAS}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            COMPANY_STRUCTURE_ALIAS:
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
                                    htmlFor="COMPANY_GRADE_ID"
                                    value={"Grade"}
                                />
                                <div className="ml-[3rem] text-red-600">*</div>
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.COMPANY_GRADE_ID}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            COMPANY_GRADE_ID: e.target.value,
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
                                htmlFor="COMPANY_STRUCTURE_PARENT_ID"
                                value={"Parent Structure"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={dataById.COMPANY_STRUCTURE_PARENT_ID}
                                onChange={(e) => {
                                    setDataById({
                                        ...dataById,
                                        COMPANY_STRUCTURE_PARENT_ID:
                                            e.target.value,
                                    });
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {structureCombo
                                    ?.filter(
                                        (m: any) =>
                                            m.COMPANY_STRUCTURE_ALIAS !==
                                            dataById.COMPANY_STRUCTURE_ALIAS
                                    )
                                    .map((item: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    item.COMPANY_STRUCTURE_ID
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
                                htmlFor="COMPANY_STRUCTURE_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_STRUCTURE_DESCRIPTION"
                                name="COMPANY_STRUCTURE_DESCRIPTION"
                                defaultValue={
                                    dataById.COMPANY_STRUCTURE_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        COMPANY_STRUCTURE_DESCRIPTION:
                                            e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* End Modal Edit Structure */}
            <div className="bg-white rounded-md shadow-md p-4 mb-2">
                <div className="">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2">
                            <div className="font-semibold text-sm">
                                Company Name
                            </div>
                            <div className="text-xs text-gray-500">
                                <span>
                                    {dataStructureNew.to_company
                                        ?.COMPANY_NAME === null
                                        ? "-"
                                        : dataStructureNew.to_company
                                              ?.COMPANY_NAME}
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
                                              ?.COMPANY_STRUCTURE_NAME}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <a
                                onClick={(e) =>
                                    handleEditModel(
                                        e,
                                        dataStructureNew.COMPANY_STRUCTURE_ID
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
                                    {dataStructureNew.COMPANY_STRUCTURE_DESCRIPTION ===
                                        "" ||
                                    dataStructureNew.COMPANY_STRUCTURE_DESCRIPTION ===
                                        null
                                        ? "-"
                                        : dataStructureNew.COMPANY_STRUCTURE_DESCRIPTION}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
