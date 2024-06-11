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

export default function DetailGroup({
    idGroup,
    relationStatus,
    relationGroup,
    relationType,
    profession,
    relationLOB,
}: PropsWithChildren<{
    idGroup: any;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
}>) {
    const [dataRelationGroupNew, setDataRelationGroupNew] = useState<any>([]);
    const [relationGroupNew, setRelationGroupNew] = useState<any>([]);
    const [relationId, setRelationId] = useState<string>("");

    // variable for modal
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    useEffect(() => {
        getDetailGroup(idGroup);
    }, [idGroup]);

    useEffect(() => {
        getGroupName(idGroup);
    }, [idGroup]);

    const getDetailGroup = async (id: string) => {
        await axios
            .post(`/getRelationGroupDetail`, { id })
            .then((res) => {
                setDataRelationGroupNew(res.data);
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getGroupName = async (idGroup: string) => {
        // alert("aaa");
        // setIsLoading(true)

        // if (name) {
        await axios
            .post(`/getGroup`, { idGroup })
            .then((res: any) => {
                setRelationGroupNew(res.data);
                // console.log("xxx", res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleSuccess = (message: string) => {
        // setIsSuccess("");
        // reset();
        // if (modal.add) {
        const { data, setData, errors, reset } = useForm<any>({
            group_id: "",
            name_relation: "",
            parent_id: "",
            abbreviation: "",
            relation_aka: [],
            relation_email: "",
            relation_description: "",
            relation_lob_id: "",
            salutation_id: "",
            relation_status_id: "",
            tagging_name: [],
            is_managed: "",
            mark_tbk_relation: "",
            profession_id: "",
            relation_type_id: [],
        });
        Swal.fire({
            title: "Success",
            text: "New Relation Added",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
            if (result.value) {
                getDetailGroup(message);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: false,
                    document: false,
                    search: false,
                });
            }
        });
        // }
        // setIsSuccess(message);
    };

    const handleAddRelationGroup = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();

        getGroupName(idGroup);
        setModal({
            add: !modal.add,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
        });
    };

    const handleDetailPopup = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();

        setRelationId(idGroup);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };
    return (
        <>
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
                handleSuccess={handleSuccess}
                idGroupRelation={idGroup}
                relationStatus={relationStatus}
                relationGroup={relationGroupNew}
                relationType={relationType}
                profession={profession}
                relationLOB={relationLOB}
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
                title={"Detail Relation"}
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
                        <DetailRelationPopup
                            detailRelation={relationId}
                            relationStatus={relationStatus}
                            relationGroup={relationGroup}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-3 gap-4">
                <div className=" bg-white rounded-lg shadow-md pb-10">
                    <div className="flex justify-center items-center">
                        {/* Foto Group*/}
                        <img
                            className="h-36 w-36 rounded-full border-2 bg-gray-50 mt-10"
                            src={defaultImage}
                            alt=""
                        />
                    </div>
                    <div className="flex justify-center items-center mt-5">
                        {/* Name Group*/}
                        <div className="text-sm text-gray-500">
                            <span>Group</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="text-lg">
                            <span>
                                {dataRelationGroupNew.RELATION_GROUP_NAME}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 bg-white rounded-lg shadow-md pb-10">
                    <div className="flex justify-between">
                        <div className="bg-red-600 w-fit p-2 m-5 rounded-lg text-white">
                            Relation
                        </div>
                        <a
                            onClick={(e) =>
                                handleAddRelationGroup(
                                    e,
                                    dataRelationGroupNew.RELATION_GROUP_ID
                                )
                            }
                            className="cursor-pointer"
                            title="Edit Relation"
                        >
                            <div className="bg-red-600 w-fit p-2 m-5 rounded-lg text-white">
                                Add Relation To Group
                            </div>
                        </a>
                    </div>
                    <div className="pl-8 pr-8 pb-6">
                        {/* <Card data={relationGroup} /> */}
                        {dataRelationGroupNew.r_group?.length === 0 ? (
                            <>
                                <span>No Data Available</span>
                            </>
                        ) : (
                            <>
                                <ul role="list" className="mb-4">
                                    {dataRelationGroupNew.r_group
                                        ?.filter(
                                            (m: any) =>
                                                m.RELATION_ORGANIZATION_PARENT_ID ===
                                                0
                                        )
                                        .map((item: any, i: number) => (
                                            <li key={i}>
                                                <div className="relative">
                                                    {item.children.length !==
                                                    0 ? (
                                                        <span
                                                            className="absolute left-4 top-4 -ml-px h-24 w-0.5 bg-gray-300"
                                                            aria-hidden="true"
                                                        />
                                                    ) : null}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span
                                                                className={
                                                                    "bg-red-500 h-8 w-8 rounded-full flex items-center justify-center"
                                                                }
                                                            ></span>
                                                        </div>
                                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                            <div>
                                                                <p className="text-sm text-gray-500">
                                                                    <a
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleDetailPopup(
                                                                                e,
                                                                                item.RELATION_ORGANIZATION_ID
                                                                            )
                                                                        }
                                                                        className="font-medium text-gray-900 hover:text-red-500 cursor-pointer"
                                                                    >
                                                                        {
                                                                            item.RELATION_ORGANIZATION_NAME
                                                                        }
                                                                    </a>
                                                                </p>
                                                                <br />
                                                                {item.children?.map(
                                                                    (
                                                                        dataChildren: any,
                                                                        a: number
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                a
                                                                            }
                                                                        >
                                                                            <div className="relative pb-8">
                                                                                {a !==
                                                                                item
                                                                                    .children
                                                                                    .length -
                                                                                    1 ? (
                                                                                    <span
                                                                                        className="absolute left-4 top-4 -ml-px h-10 w-0.5 bg-gray-300"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                ) : null}
                                                                                <div className="relative flex space-x-3">
                                                                                    <div>
                                                                                        <span
                                                                                            className={
                                                                                                "bg-red-500 h-8 w-8 rounded-full flex items-center justify-center "
                                                                                            }
                                                                                        ></span>
                                                                                    </div>
                                                                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                                                                                        <div>
                                                                                            <a
                                                                                                onClick={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleDetailPopup(
                                                                                                        e,
                                                                                                        dataChildren.RELATION_ORGANIZATION_ID
                                                                                                    )
                                                                                                }
                                                                                                className="text-sm text-gray-500 hover:text-red-500 cursor-pointer"
                                                                                            >
                                                                                                {
                                                                                                    dataChildren.RELATION_ORGANIZATION_NAME
                                                                                                }
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
        // </AuthenticatedLayout>
    );
}
