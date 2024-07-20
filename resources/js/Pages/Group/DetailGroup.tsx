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
                console.log(res.data);
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
                          <div className="pt-1 pl-[0.32rem]" key={a}>
                              <ul className="flex flex-col pl-4 font-semibold text-black border-l border-red-700">
                                  <li>
                                      <div className="relative flex justify-between hover:text-red-600 w-fit">
                                          <div className="flex items-center justify-center pr-2">
                                              <span
                                                  className={
                                                      "bg-red-500 h-3 w-3 rounded-full"
                                                  }
                                              ></span>
                                          </div>
                                          <div className="flex items-center w-full gap-1">
                                              <div className="text-sm">
                                                  <span>
                                                      {
                                                          dChild.RELATION_GROUP_NAME
                                                      }
                                                  </span>
                                              </div>
                                              <div className="text-xs text-gray-300">
                                                  / Sub Group
                                              </div>
                                          </div>
                                      </div>
                                      {dChild.r_group?.length !== 0
                                          ? dChild.r_group?.map(
                                                (
                                                    dataRelationsNew: any,
                                                    z: number
                                                ) => (
                                                    <div
                                                        className="pt-1 pl-[0.32rem]"
                                                        key={z}
                                                    >
                                                        <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                            <li>
                                                                <div className="relative flex justify-between hover:text-red-600 w-fit">
                                                                    <div className="flex items-center justify-center pr-2">
                                                                        <span
                                                                            className={
                                                                                "bg-green-500 h-3 w-3 rounded-full"
                                                                            }
                                                                        ></span>
                                                                    </div>
                                                                    <div className="flex items-center w-full gap-1">
                                                                        <div className="text-sm">
                                                                            <span>
                                                                                {
                                                                                    dataRelationsNew.RELATION_ORGANIZATION_NAME
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-300">
                                                                            /
                                                                            Relation
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )
                                            )
                                          : null}
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
                    <div className="flex justify-between items-center mt-4 mb-4">
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
                            <div className="bg-red-600 w-fit p-2 m-5 rounded-lg text-white hover:bg-red-500 text-sm hidden">
                                Add Relation To Group
                            </div>
                        </a>
                    </div>
                    <div className="px-4 pb-6">
                        {/* <Card data={relationGroup} /> */}
                        {dataRelationGroupNew.children?.length === 0 ? (
                            <>
                                <span>No Data Available</span>
                            </>
                        ) : (
                            <>
                                <ul className="flex flex-col space-y-0 text-lg">
                                    {dataRelationGroupNew.children?.map(
                                        (item: any, i: number) => (
                                            <li className="" key={i}>
                                                <div className="relative flex justify-between font-semibold text-black hover:text-red-600 w-fit">
                                                    <div className="flex items-center justify-center pr-2">
                                                        <span
                                                            className={
                                                                "bg-red-500 h-3 w-3 rounded-full"
                                                            }
                                                        ></span>
                                                    </div>
                                                    <div className="flex items-center w-full gap-1">
                                                        <div className="text-sm">
                                                            <span>
                                                                {
                                                                    item.RELATION_GROUP_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-300">
                                                            / Sub Group
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.r_group?.length !== 0
                                                    ? item.r_group?.map(
                                                          (
                                                              dataRelation: any,
                                                              z: number
                                                          ) => (
                                                              <div
                                                                  className="pt-1 pl-[0.32rem]"
                                                                  key={z}
                                                              >
                                                                  <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                                      <li>
                                                                          <div className="relative flex justify-between hover:text-red-600 w-fit">
                                                                              <div className="flex items-center justify-center pr-2">
                                                                                  <span
                                                                                      className={
                                                                                          "bg-green-500 h-3 w-3 rounded-full"
                                                                                      }
                                                                                  ></span>
                                                                              </div>
                                                                              <div className="flex items-center w-full gap-1">
                                                                                  <div className="text-sm">
                                                                                      <span>
                                                                                          {
                                                                                              dataRelation.RELATION_ORGANIZATION_NAME
                                                                                          }
                                                                                      </span>
                                                                                  </div>
                                                                                  <div className="text-xs text-gray-300">
                                                                                      /
                                                                                      Relation
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </li>
                                                                  </ul>
                                                              </div>
                                                          )
                                                      )
                                                    : null}
                                                {item.children?.map(
                                                    (
                                                        dataChildren: any,
                                                        a: number
                                                    ) => (
                                                        <div
                                                            className="pt-1 pl-[0.32rem]"
                                                            key={a}
                                                        >
                                                            <ul className="flex flex-col pl-4 font-semibold text-black border-l border-red-700">
                                                                <li>
                                                                    <div className="relative flex justify-between hover:text-red-600 w-fit">
                                                                        <div className="flex items-center justify-center pr-2">
                                                                            <span
                                                                                className={
                                                                                    "bg-red-500 h-3 w-3 rounded-full"
                                                                                }
                                                                            ></span>
                                                                        </div>
                                                                        <div className="flex items-center w-full gap-1">
                                                                            <div className="text-sm">
                                                                                <span>
                                                                                    {
                                                                                        dataChildren.RELATION_GROUP_NAME
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-xs text-gray-300">
                                                                                /
                                                                                Sub
                                                                                Group
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {dataChildren
                                                                        .r_group
                                                                        ?.length !==
                                                                    0
                                                                        ? dataChildren.r_group?.map(
                                                                              (
                                                                                  dataRelations: any,
                                                                                  z: number
                                                                              ) => (
                                                                                  <div
                                                                                      className="pt-1 pl-[0.32rem]"
                                                                                      key={
                                                                                          z
                                                                                      }
                                                                                  >
                                                                                      <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                                                          <li>
                                                                                              <div className="relative flex justify-between hover:text-red-600 w-fit">
                                                                                                  <div className="flex items-center justify-center pr-2">
                                                                                                      <span
                                                                                                          className={
                                                                                                              "bg-green-500 h-3 w-3 rounded-full"
                                                                                                          }
                                                                                                      ></span>
                                                                                                  </div>
                                                                                                  <div className="flex items-center w-full gap-1">
                                                                                                      <div className="text-sm">
                                                                                                          <span>
                                                                                                              {
                                                                                                                  dataRelations.RELATION_ORGANIZATION_NAME
                                                                                                              }
                                                                                                          </span>
                                                                                                      </div>
                                                                                                      <div className="text-xs text-gray-300">
                                                                                                          /
                                                                                                          Relation
                                                                                                      </div>
                                                                                                  </div>
                                                                                              </div>
                                                                                          </li>
                                                                                      </ul>
                                                                                  </div>
                                                                              )
                                                                          )
                                                                        : null}
                                                                    {BasicInfo(
                                                                        dataChildren.children
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )
                                                )}
                                            </li>
                                        )
                                    )}
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
