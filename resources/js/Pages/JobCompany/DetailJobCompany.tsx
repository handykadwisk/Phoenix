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
import ToastMessage from "@/Components/ToastMessage";

export default function DetailJobCompany({
    idAddress,
    comboJobDesc,
    setDetailJobDesc,
    setIsSuccess,
    isSuccess,
}: PropsWithChildren<{
    idAddress: any;
    comboJobDesc: any;
    setDetailJobDesc: any;
    setIsSuccess: any;
    isSuccess: any;
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
            .post(`/getJobDescCompanyDetail`, { id })
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
        COMPANY_JOBDESC_ALIAS: "",
        COMPANY_JOBDESC_DESCRIPTION: "",
        COMPANY_JOBDESC_PARENT_ID: "",
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
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            setDetailJobDesc({
                COMPANY_JOBDESC_ID: message[0],
                COMPANY_JOBDESC_ALIAS: message[1],
            });
            getJobDescDetail(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };
    return (
        <>
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* <span>Detail Division</span> */}
            {/* modal edit*/}
            <ModalToAdd
                buttonAddOns={""}
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
                url={`/editJobDescCompany`}
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
                                htmlFor="COMPANY_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-0">
                                {dataJobDesc.to_company?.COMPANY_NAME}
                            </div>
                        </div>
                        <div className="relative mt-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div>
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_JOBDESC_ALIAS"
                                    value={"Job Desc Name"}
                                />
                                <div className="ml-[7rem] text-red-600">*</div>
                                <TextInput
                                    id="COMPANY_JOBDESC_ALIAS"
                                    type="text"
                                    name="COMPANY_JOBDESC_ALIAS"
                                    value={dataById.COMPANY_JOBDESC_ALIAS}
                                    className="mt-0"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            COMPANY_JOBDESC_ALIAS:
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
                                    htmlFor="COMPANY_JOBDESC_PARENT_ID"
                                    value={"Job Desc Parent"}
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.COMPANY_JOBDESC_PARENT_ID}
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            COMPANY_JOBDESC_PARENT_ID:
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
                                                m.COMPANY_JOBDESC_ALIAS !==
                                                dataJobDesc.COMPANY_JOBDESC_ALIAS
                                        )
                                        .map((cOffice: any, i: number) => {
                                            return (
                                                <option
                                                    value={
                                                        cOffice.COMPANY_JOBDESC_ID
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
                                htmlFor="COMPANY_JOBDESC_DESCRIPTION"
                                value={"Description"}
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                id="COMPANY_JOBDESC_DESCRIPTION"
                                name="COMPANY_JOBDESC_DESCRIPTION"
                                defaultValue={
                                    dataById.COMPANY_JOBDESC_DESCRIPTION
                                }
                                onChange={(e: any) => {
                                    setDataById({
                                        ...dataById,
                                        COMPANY_JOBDESC_DESCRIPTION:
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
                                        {dataJobDesc.to_company?.COMPANY_NAME}
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
                                                    dataJobDesc.COMPANY_JOBDESC_ID
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
                                                  ?.COMPANY_JOBDESC_ALIAS}
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
                                        {dataJobDesc.COMPANY_JOBDESC_DESCRIPTION ===
                                            null ||
                                        dataJobDesc.COMPANY_JOBDESC_DESCRIPTION ===
                                            ""
                                            ? "-"
                                            : dataJobDesc.COMPANY_JOBDESC_DESCRIPTION}
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
