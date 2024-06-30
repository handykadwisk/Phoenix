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
    XMarkIcon,
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
import SelectTailwind from "react-tailwindcss-select";
import Checkbox from "@/Components/Checkbox";
import BeatLoader from "react-spinners/BeatLoader";

export default function DetailJobDesc({
    idAddress,
    comboJobDesc,
    setDetailJobDesc,
}: PropsWithChildren<{
    idAddress: any;
    comboJobDesc: any;
    setDetailJobDesc: any;
    // divisionCombo: any;
}>) {
    const [dataJobDesc, setDataDetailJobDesc] = useState<any>([]);

    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    useEffect(() => {
        getJobDescDetail(idAddress);
    }, [idAddress]);

    const getJobDescDetail = async (id: string) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getJobDescDetail`, { id })
            .then((res) => {
                setDataDetailJobDesc(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_JOBDESC_ALIAS: "",
        RELATION_JOBDESC_DESCRIPTION: "",
        RELATION_JOBDESC_PARENT_ID: "",
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

        setDataById(dataJobDesc);
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
            text: "Edit Relation Job Desc",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                setDetailJobDesc({
                    RELATION_JOBDESC_ID: message[0],
                    RELATION_JOBDESC_ALIAS: message[1],
                });
                getJobDescDetail(message[0]);
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
                title={"Edit Job Desc"}
                url={`/editJobDesc`}
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
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-0">
                                {
                                    dataJobDesc.to_relation
                                        ?.RELATION_ORGANIZATION_ALIAS
                                }
                            </div>
                        </div>
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_JOBDESC_ALIAS"
                                    value={"Job Desc Name"}
                                />
                                <div className="ml-[7rem] text-red-600">*</div>
                                <TextInput
                                    id="RELATION_JOBDESC_ALIAS"
                                    type="text"
                                    name="RELATION_JOBDESC_ALIAS"
                                    value={dataById.RELATION_JOBDESC_ALIAS}
                                    className="mt-0"
                                    autoComplete="RELATION_JOBDESC_ALIAS"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_JOBDESC_ALIAS:
                                                e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Job Desc Name"
                                />
                            </div>
                            <div className="xs:mt-2 lg:mt-0">
                                <InputLabel
                                    className=""
                                    htmlFor="RELATION_JOBDESC_PARENT_ID"
                                    value={"Job Desc Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.RELATION_JOBDESC_PARENT_ID}
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_JOBDESC_PARENT_ID:
                                                e.target.value,
                                        });
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Parent --
                                    </option>
                                    {comboJobDesc
                                        ?.filter(
                                            (m: any) =>
                                                m.RELATION_JOBDESC_ALIAS !==
                                                dataJobDesc.RELATION_JOBDESC_ALIAS
                                        )
                                        .map((cOffice: any, i: number) => {
                                            return (
                                                <option
                                                    value={
                                                        cOffice.RELATION_JOBDESC_ID
                                                    }
                                                    key={i}
                                                >
                                                    {cOffice.text_combo}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className="relative mt-2 mb-4">
                            <InputLabel
                                className=""
                                htmlFor="RELATION_JOBDESC_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="RELATION_JOBDESC_DESCRIPTION"
                                name="RELATION_JOBDESC_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_JOBDESC_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        RELATION_JOBDESC_DESCRIPTION:
                                            e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </>
                }
            />
            {/* end modal edit*/}
            <div className="bg-white py-4 shadow-md rounded-md mb-2 h-[210px]">
                {isLoading.get_detail ? (
                    <div className="flex justify-center items-center sweet-loading h-[199px]">
                        <BeatLoader
                            // cssOverride={override}
                            size={10}
                            color={"#ff4242"}
                            loading={true}
                            speedMultiplier={1.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 px-4">
                            <div className="">
                                <div className="text-sm font-semibold">
                                    <span>Relation Name</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span>
                                        {
                                            dataJobDesc.to_relation
                                                ?.RELATION_ORGANIZATION_ALIAS
                                        }
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-semibold">
                                        <span>Parent Name</span>
                                    </div>
                                    <div>
                                        <a
                                            onClick={(e) =>
                                                handleEditModel(
                                                    e,
                                                    dataJobDesc.RELATION_JOBDESC_ID
                                                )
                                            }
                                            className="cursor-pointer"
                                            title="Edit Office"
                                        >
                                            <div className="p-1 rounded-md text-red-600">
                                                <PencilSquareIcon className="w-5" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span>
                                        {dataJobDesc?.parent === null
                                            ? "-"
                                            : dataJobDesc.parent
                                                  ?.RELATION_JOBDESC_ALIAS}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 px-4">
                            <div>
                                <div className="text-sm font-semibold">
                                    <span>Description</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p>
                                        {dataJobDesc.RELATION_JOBDESC_DESCRIPTION ===
                                            null ||
                                        dataJobDesc.RELATION_JOBDESC_DESCRIPTION ===
                                            ""
                                            ? "-"
                                            : dataJobDesc.RELATION_JOBDESC_DESCRIPTION}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
