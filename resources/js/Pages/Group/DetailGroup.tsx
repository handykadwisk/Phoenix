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
    const [relationId, setRelationId] = useState<any>({
        idGroup: "",
        nameRelation: "",
    });

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
        Swal.fire({
            title: "Success",
            text: "New Relation Added",
            icon: "success",
        }).then((result: any) => {
            // console.log(result);
            if (result.value) {
                getDetailGroup(idGroup);
                getGroupName(idGroup);
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

    const handleDetailPopup = async (
        e: FormEvent,
        idGroup: string,
        nameRelation: string
    ) => {
        e.preventDefault();

        setRelationId({
            idGroup: idGroup,
            nameRelation: nameRelation,
        });
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };
    const [switchPage, setSwitchPage] = useState(false);
    const [switchPageTBK, setSwitchPageTBK] = useState(false);
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

    function BasicInfo(dataChildrenNew: any): React.ReactElement {
        return (
            <>
                {dataChildrenNew?.length !== 0
                    ? dataChildrenNew?.map((dChild: any, a: number) => (
                          <div className="pt-0 pl-[0.32rem]" key={a}>
                              <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                  <li>
                                      <div className="relative flex justify-between hover:text-red-600">
                                          <div className="flex items-center justify-center pr-2">
                                              <span
                                                  className={
                                                      "bg-red-500 h-3 w-3 rounded-full"
                                                  }
                                              ></span>
                                          </div>
                                          <div className="flex items-center w-full">
                                              <a
                                                  href="#"
                                                  className="inline-block w-full py-1 pr-4 text-sm"
                                                  onClick={(e) =>
                                                      handleDetailPopup(
                                                          e,
                                                          dChild.RELATION_ORGANIZATION_ID,
                                                          dChild.RELATION_ORGANIZATION_NAME
                                                      )
                                                  }
                                              >
                                                  {
                                                      dChild.RELATION_ORGANIZATION_NAME
                                                  }
                                              </a>
                                          </div>
                                      </div>
                                      {BasicInfo(dChild.children)}
                                  </li>
                              </ul>
                          </div>
                      ))
                    : null}
            </>
        );
    }

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
                data={data}
                setData={setData}
                switchPage={switchPage}
                setSwitchPage={setSwitchPage}
                switchPageTBK={switchPageTBK}
                setSwitchPageTBK={setSwitchPageTBK}
            />
            {/* end modal add relation */}

            {/* modal detail  */}
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
                    getDetailGroup(idGroup);
                    getGroupName(idGroup);
                }}
                title={relationId.nameRelation}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailRelationPopup
                            detailRelation={relationId.idGroup}
                            relationStatus={relationStatus}
                            relationGroup={relationGroup}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-1">
                <div className="col-span-2 bg-white rounded-lg shadow-md pb-10">
                    <div className="flex justify-between items-center">
                        <div className="w-fit px-4 text-md font-semibold">
                            <span className="border-b-2 border-red-600">
                                Relation
                            </span>
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
                            <div className="bg-red-600 w-fit p-2 m-5 rounded-lg text-white hover:bg-red-500 text-sm">
                                Add Relation To Group
                            </div>
                        </a>
                    </div>
                    <div className="px-4 pb-6">
                        {/* <Card data={relationGroup} /> */}
                        {dataRelationGroupNew.r_group?.length === 0 ? (
                            <>
                                <span>No Data Available</span>
                            </>
                        ) : (
                            <>
                                <ul className="flex flex-col space-y-2 text-lg">
                                    {dataRelationGroupNew.r_group
                                        ?.filter(
                                            (m: any) =>
                                                m.RELATION_ORGANIZATION_PARENT_ID ===
                                                0
                                        )
                                        .map((item: any, i: number) => (
                                            <li className="" key={i}>
                                                <div className="relative flex justify-between font-semibold hover:text-red-600">
                                                    <div className="flex items-center justify-center pr-2">
                                                        <span
                                                            className={
                                                                "bg-red-500 h-3 w-3 rounded-full"
                                                            }
                                                        ></span>
                                                    </div>
                                                    <div className="flex items-center w-full">
                                                        <a
                                                            href="#"
                                                            className="inline-block w-full py-1 pr-4 text-sm"
                                                            onClick={(e) =>
                                                                handleDetailPopup(
                                                                    e,
                                                                    item.RELATION_ORGANIZATION_ID,
                                                                    item.RELATION_ORGANIZATION_NAME
                                                                )
                                                            }
                                                        >
                                                            {
                                                                item.RELATION_ORGANIZATION_NAME
                                                            }
                                                        </a>
                                                    </div>
                                                </div>
                                                {item.children?.map(
                                                    (
                                                        dataChildren: any,
                                                        a: number
                                                    ) => (
                                                        <div
                                                            className="pt-0 pl-[0.32rem]"
                                                            key={a}
                                                        >
                                                            <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                                <li>
                                                                    <div className="relative flex justify-between hover:text-red-600">
                                                                        <div className="flex items-center justify-center pr-2">
                                                                            <span
                                                                                className={
                                                                                    "bg-red-500 h-3 w-3 rounded-full"
                                                                                }
                                                                            ></span>
                                                                        </div>
                                                                        <div className="flex items-center w-full">
                                                                            <a
                                                                                href="#"
                                                                                className="inline-block w-full py-1 pr-4 text-sm"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleDetailPopup(
                                                                                        e,
                                                                                        dataChildren.RELATION_ORGANIZATION_ID,
                                                                                        dataChildren.RELATION_ORGANIZATION_NAME
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    dataChildren.RELATION_ORGANIZATION_NAME
                                                                                }
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    {BasicInfo(
                                                                        dataChildren.children
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )
                                                )}
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
