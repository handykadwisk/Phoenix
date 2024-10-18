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
import React, {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import AddRelationPopup from "../Relation/AddRelation";
import DetailRelationPopup from "../Relation/DetailRelation";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SelectTailwind from "react-tailwindcss-select";
import DetailSubGroup from "./DetailSubGroup";
import SummaryGroup from "./SummaryGroup";
import SummaryRelation from "./SummaryRelation";

export default function DetailGroup({
    idGroup,
    relationStatus,
    relationGroup,
    relationType,
    profession,
    relationLOB,
    setIdGroup,
}: PropsWithChildren<{
    idGroup: any;
    relationStatus: any;
    relationGroup: any;
    relationType: any;
    profession: any;
    relationLOB: any;
    setIdGroup: any;
}>) {
    const [dataRelationGroupNew, setDataRelationGroupNew] = useState<any>([]);
    const [getDetailRelation, setGetDetailRelation] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_NAME: "",
        RELATION_SALUTATION_PRE: "",
        RELATION_SALUTATION_POST: "",
    });
    const [relationGroupNew, setRelationGroupNew] = useState<any>([]);
    const [relationId, setRelationId] = useState<any>({
        idRelation: "",
        nameRelation: "",
    });
    const [groupName, setGroupName] = useState<any>({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_ID: "",
    });

    const [relationName, setRelationName] = useState<any>({
        RELATION_NAME: "",
        RELATION_ID: "",
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
            text: "New Sub Group Added",
            icon: "success",
        }).then((result: any) => {
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
                setDataSubGroup({
                    ...dataSubGroup,
                    RELATION_GROUP_NAME: "",
                    RELATION_GROUP_PARENT: "",
                    RELATION_GROUP_DESCRIPTION: "",
                });
            }
        });
        // }
        // setIsSuccess(message);
    };

    const [dataRelation, setDataRelation] = useState<any>({
        RELATION_ORGANIZATION_GROUP: "",
        name_relation: [],
    });

    const handleSuccessAddRelation = (message: string) => {
        // setIsSuccess("");
        // reset();
        // if (modal.add) {
        Swal.fire({
            title: "Success",
            text: "New Relation Added",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDetailGroup(idGroup);
                getGroupName(idGroup);
                // setModal({
                //     add: false,
                //     delete: false,
                //     edit: false,
                //     view: false,
                //     document: false,
                //     search: false,
                // });
                setDataRelation({
                    ...dataRelation,
                    RELATION_ORGANIZATION_GROUP: "",
                    name_relation: [],
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
        idRelation: string,
        nameRelation: string
    ) => {
        e.preventDefault();

        setRelationId({
            idRelation: idRelation,
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

    const [modalAddSubGroup, setModalAddSubGroup] = useState({
        add: false,
    });

    const [modalAddRelation, setModalAddRelation] = useState({
        add: false,
    });

    const [modalChangeSubGroup, setModalChangeSubGroup] = useState({
        edit: false,
    });

    const [modalDetailGroup, setModalDetailGroup] = useState({
        view: false,
        edit: false,
    });

    const [modalSummaryGroup, setModalSummaryGroup] = useState({
        view: false,
        edit: false,
    });

    const [modalSummaryRelation, setModalSummaryRelation] = useState({
        view: false,
        edit: false,
    });

    const [modalChangeParent, setModalChangeParent] = useState<any>({
        edit: false,
    });

    const [dataChangeParent, setDataChangeParent] = useState<any>({
        RELATION_GROUP_ID: "",
        RELATION_GROUP_PARENT: "",
    });

    const [dataSubGroup, setDataSubGroup] = useState<any>({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_PARENT: "",
        RELATION_GROUP_DESCRIPTION: "",
    });
    const [dataDetailSubGroupParent, setDataDetailSubGroupParent] =
        useState<any>([]);

    // get detail sub group parent
    const getDetailSubGroupParent = async (id: string) => {
        await axios
            .post(`/getDetailSubGroupParent`, { id })
            .then((res) => {
                setDataDetailSubGroupParent(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Onclick Add Sub Group
    const handleClickAddSubGroup = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();

        getDetailSubGroupParent(idGroup);
        setDataSubGroup({
            ...dataSubGroup,
            RELATION_GROUP_PARENT: idGroup,
        });
        setModalAddSubGroup({
            add: !modalAddSubGroup.add,
        });
    };
    // end Add Sub Group

    // Onclick Change Parent
    const handleClickChangeParent = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();

        getDetailSubGroupParent(idGroup);
        getSubGroupById(idGroup);
        setDataChangeParent({
            ...dataChangeParent,
            RELATION_GROUP_ID: idGroup,
        });
        setModalChangeParent({
            edit: !modalChangeParent.edit,
        });
    };
    // end Change Parent

    const alertRemove = async (e: FormEvent, idRelation: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Remove Relation From This Group!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove!",
        }).then((result) => {
            if (result.isConfirmed) {
                removeRelation(e, idRelation);
            }
        });
    };

    // remove Relation From Group
    const removeRelation = async (e: FormEvent, idRelation: any) => {
        e.preventDefault();
        await axios
            .post(`/removeRelation`, { idRelation })
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    text: "Remove Relation From Group",
                    icon: "success",
                }).then((result: any) => {
                    if (result.value) {
                        getDetailGroup(idGroup);
                        getGroupName(idGroup);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function BasicInfo(dataChildrenNew: any): React.ReactElement {
        return (
            <>
                {dataChildrenNew?.length !== 0
                    ? dataChildrenNew?.map((dChilds: any, a: number) => (
                          <div className="pt-1 pl-[0.32rem]" key={a}>
                              <ul className="flex flex-col pl-4 font-semibold text-black border-l border-red-700 hover:cursor-pointer">
                                  <li>
                                      <div
                                          className="relative flex justify-between hover:text-red-600 w-fit"
                                          onClick={() => {
                                              handleClick(
                                                  dChilds.RELATION_GROUP_ID
                                              );
                                          }}
                                      >
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
                                                          dChilds.RELATION_GROUP_NAME
                                                      }
                                                  </span>
                                              </div>
                                              <div className="text-xs text-gray-300">
                                                  / Sub Group
                                              </div>
                                          </div>
                                      </div>
                                      <div
                                          className="hidden"
                                          key={a}
                                          id={
                                              "item" + dChilds.RELATION_GROUP_ID
                                          }
                                      >
                                          <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                              <li>
                                                  <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                      <div
                                                          className="text-sm bg-yellow-500 p-2 rounded-md text-white cursor-pointer hover:bg-yellow-400"
                                                          onClick={(e) =>
                                                              handleClickChangeParent(
                                                                  e,
                                                                  dChilds.RELATION_GROUP_ID
                                                              )
                                                          }
                                                      >
                                                          <span>
                                                              Change Parent
                                                          </span>
                                                      </div>
                                                      <div
                                                          className="text-sm bg-green-500 p-2 rounded-md text-white cursor-pointer hover:bg-green-400"
                                                          onClick={(e) =>
                                                              handleClickAddSubGroup(
                                                                  e,
                                                                  dChilds.RELATION_GROUP_ID
                                                              )
                                                          }
                                                      >
                                                          <span>
                                                              Add Sub Group
                                                          </span>
                                                      </div>
                                                      <div
                                                          className="text-sm bg-blue-500 p-2 rounded-md text-white cursor-pointer hover:bg-blue-400"
                                                          onClick={(e) =>
                                                              handleClickAddRelation(
                                                                  e,
                                                                  dChilds.RELATION_GROUP_ID
                                                              )
                                                          }
                                                      >
                                                          <span>
                                                              Add Relation
                                                          </span>
                                                      </div>
                                                      <div
                                                          className="text-sm bg-red-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                          onClick={(e) =>
                                                              handleClickDetailGroup(
                                                                  e,
                                                                  dChilds.RELATION_GROUP_ID
                                                              )
                                                          }
                                                      >
                                                          <span>Edit</span>
                                                      </div>
                                                      <div
                                                          className="text-sm bg-amber-400 p-2 rounded-md text-white cursor-pointer hover:bg-amber-200"
                                                          onClick={(e) => {
                                                              handleClickSummary(
                                                                  e,
                                                                  dChilds.RELATION_GROUP_ID,
                                                                  dChilds.RELATION_GROUP_NAME
                                                              );
                                                          }}
                                                      >
                                                          <span>Summary</span>
                                                      </div>
                                                  </div>
                                              </li>
                                          </ul>
                                      </div>
                                      {dChilds.r_group?.length !== 0
                                          ? dChilds.r_group?.map(
                                                (
                                                    dataRelationsNew: any,
                                                    b: number
                                                ) => (
                                                    <div
                                                        className="pt-1 pl-[0.32rem]"
                                                        key={b}
                                                    >
                                                        <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                            <li>
                                                                <div
                                                                    className="relative flex justify-between hover:text-red-600 w-fit"
                                                                    onClick={() => {
                                                                        handleClickRelation(
                                                                            dataRelationsNew.RELATION_ORGANIZATION_NAME
                                                                        );
                                                                    }}
                                                                >
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
                                                                <div
                                                                    className="hidden"
                                                                    key={b}
                                                                    id={
                                                                        "item" +
                                                                        dataRelationsNew.RELATION_ORGANIZATION_NAME
                                                                    }
                                                                >
                                                                    <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                                        <li>
                                                                            <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                                <div
                                                                                    className="text-sm bg-yellow-500 p-2 rounded-md text-white cursor-pointer hover:bg-yellow-400"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleClickChangeSubGroup(
                                                                                            e,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_ID
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        Change
                                                                                        Group
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    className="text-sm bg-blue-500 p-2 rounded-md text-white cursor-pointer hover:bg-blue-400"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleDetailPopup(
                                                                                            e,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_ID,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_NAME
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        Detail
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    className="text-sm bg-red-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                                                    onClick={(
                                                                                        e: any
                                                                                    ) =>
                                                                                        alertRemove(
                                                                                            e,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_ID
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        Remove
                                                                                        From
                                                                                        Group
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    className="text-sm bg-amber-400 p-2 rounded-md text-white cursor-pointer hover:bg-amber-300"
                                                                                    onClick={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        handleClickRelationSummary(
                                                                                            e,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_ID,
                                                                                            dataRelationsNew.RELATION_ORGANIZATION_NAME
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <span>
                                                                                        Summary
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )
                                            )
                                          : null}
                                      {BasicInfo(dChilds.children)}
                                  </li>
                              </ul>
                          </div>
                      ))
                    : null}
            </>
        );
    }

    const handleClick = (i: any) => {
        const element = document.getElementById("item" + i);
        if (!element?.className) {
            element?.setAttribute("class", "hidden");
        } else {
            element?.setAttribute("class", "");
        }
    };

    const handleClickRelation = (i: any) => {
        const element = document.getElementById("item" + i);
        if (!element?.className) {
            element?.setAttribute("class", "hidden");
        } else {
            element?.setAttribute("class", "");
        }
    };

    // Onclick Add Relation
    const handleClickAddRelation = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();
        getRelationNoGroup();
        // getDetailSubGroupParent(idGroup);
        setDataRelation({
            ...dataRelation,
            RELATION_ORGANIZATION_GROUP: idGroup,
        });
        setModalAddRelation({
            add: !modalAddRelation.add,
        });
    };
    // end Add Relation

    // Onclick detail group
    const handleClickDetailGroup = async (e: FormEvent, idGroup: string) => {
        e.preventDefault();
        // getRelationNoGroup();
        getDetailSubGroupParent(idGroup);
        // setDataRelation({
        //     ...dataRelation,
        //     RELATION_ORGANIZATION_GROUP: idGroup,
        // });
        setModalDetailGroup({
            view: false,
            edit: !modalDetailGroup.edit,
        });
    };
    // end Add Detail Group

    // Onclick summary group
    const handleClickSummary = async (
        e: FormEvent,
        idGroup: string,
        name_group: string
    ) => {
        e.preventDefault();
        setGroupName({
            RELATION_GROUP_NAME: name_group,
            RELATION_GROUP_ID: idGroup,
        });
        setModalSummaryGroup({
            view: !modalSummaryGroup.view,
            edit: false,
        });
    };
    // end Add summary Group

    // for handle click relation summary
    const handleClickRelationSummary = async (
        e: FormEvent,
        idRelation: string,
        nameRelation: string
    ) => {
        e.preventDefault();
        setRelationName({
            RELATION_NAME: nameRelation,
            RELATION_ID: idRelation,
        });
        setModalSummaryRelation({
            view: !modalSummaryRelation.view,
            edit: false,
        });
    };
    // end for handle click relation summary

    const inputRefTag = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(true);
    const [relationNoGroup, setRelationNoGroup] = useState<any>([]);
    // get relation yang group nya null
    const getRelationNoGroup = async () => {
        await axios
            .post(`/getRelationNoGroup`)
            .then((res) => {
                setRelationNoGroup(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const filteredTags = relationNoGroup.filter(
        (item: any) =>
            item.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase()?.includes(
                query.toLocaleLowerCase()?.trim()
            ) &&
            !dataRelation.name_relation?.includes(
                item.RELATION_ORGANIZATION_NAME
            )
    );

    const [dataRelationChange, setDataRelationChange] = useState<any>([]);
    const [subGroupById, setSubGroupById] = useState<any>([]);
    const [dataChangeSubGroup, setDataChangeSubGroup] = useState<any>({
        RELATION_ORGANIZATION_ID: "",
        RELATION_ORGANIZATION_GROUP: "",
    });
    const handleSuccessChangeGroup = (message: string) => {
        // setIsSuccess("");
        // reset();
        // if (modal.add) {
        Swal.fire({
            title: "Success",
            text: "Change Sub Group Added",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDetailGroup(idGroup);
                getGroupName(idGroup);
                // setModal({
                //     add: false,
                //     delete: false,
                //     edit: false,
                //     view: false,
                //     document: false,
                //     search: false,
                // });
                setDataChangeSubGroup({
                    ...dataChangeSubGroup,
                    RELATION_ORGANIZATION_ID: "",
                    RELATION_ORGANIZATION_GROUP: "",
                });
            }
        });
        // }
        // setIsSuccess(message);
    };

    const handleSuccessChangeParent = (message: string) => {
        // setIsSuccess("");
        // reset();
        // if (modal.add) {
        Swal.fire({
            title: "Success",
            text: "Change Parent",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDetailGroup(idGroup);
                getGroupName(idGroup);
                // setModal({
                //     add: false,
                //     delete: false,
                //     edit: false,
                //     view: false,
                //     document: false,
                //     search: false,
                // });
                setDataChangeParent({
                    ...dataChangeParent,
                    RELATION_GROUP_PARENT: "",
                });
            }
        });
        // }
        // setIsSuccess(message);
    };

    const handleSuccessEdit = async (message: any) => {
        Swal.fire({
            title: "Success",
            text: "Edit Group",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                getDetailGroup(idGroup);
                getGroupName(idGroup);

                setIdGroup({
                    ...idGroup,
                    RELATION_GROUP_ID: message[0],
                    RELATION_GROUP_NAME: message[1],
                });
                // setModal({
                //     add: false,
                //     delete: false,
                //     edit: false,
                //     view: false,
                //     document: false,
                //     search: false,
                // });
            }
        });
    };

    const getRelationChange = async (idRelation: any) => {
        await axios
            .post(`/getRelationChange`, { idRelation })
            .then((res) => {
                setDataRelationChange(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getSubGroupById = async (idGroupNew: any) => {
        // setIsLoading(true)

        // if (name) {
        await axios
            .post(`/getSubGroupById`, { idGroup })
            .then((res: any) => {
                setSubGroupById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const mappingSubGroupById = subGroupById?.map((query: any) => {
        return {
            value: query.RELATION_GROUP_ID,
            label: query.RELATION_GROUP_NAME,
        };
    });

    const mappingChangeParent = subGroupById
        ?.filter(
            (m: any) =>
                m.RELATION_GROUP_NAME !==
                dataDetailSubGroupParent.RELATION_GROUP_NAME
        )
        .map((query: any) => {
            return {
                value: query.RELATION_GROUP_ID,
                label: query.RELATION_GROUP_NAME,
            };
        });

    const handleClickChangeSubGroup = async (
        e: FormEvent,
        idRelation: string
    ) => {
        e.preventDefault();

        // getDetailSubGroupParent(idRelation);
        setDataChangeSubGroup({
            ...dataChangeSubGroup,
            RELATION_ORGANIZATION_ID: idRelation,
        });
        getSubGroupById(idGroup);
        getRelationChange(idRelation);
        setModalChangeSubGroup({
            edit: !modalChangeSubGroup.edit,
        });
    };
    return (
        <>
            {/* modal detail  */}
            <ModalToAction
                show={modalSummaryGroup.view}
                onClose={() => {
                    setModalSummaryGroup({
                        view: false,
                        edit: false,
                    });
                    getDetailGroup(idGroup);
                    getGroupName(idGroup);
                }}
                title={groupName.RELATION_GROUP_NAME}
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
                        <SummaryGroup idGroup={idGroup} />
                    </>
                }
            />

            {/* modal summary relation */}
            <ModalToAction
                show={modalSummaryRelation.view}
                onClose={() => {
                    setModalSummaryRelation({
                        view: false,
                        edit: false,
                    });
                    getDetailGroup(idGroup);
                    getGroupName(idGroup);
                }}
                title={relationName.RELATION_NAME}
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
                        <SummaryRelation
                            idRelation={relationName.RELATION_ID}
                        />
                    </>
                }
            />

            {/* modal detail group */}
            <DetailSubGroup
                show={modalDetailGroup.edit}
                modal={() =>
                    setModalDetailGroup({
                        view: false,
                        edit: false,
                    })
                }
                dataDetailGroups={dataDetailSubGroupParent}
                handleSuccessEdit={handleSuccessEdit}
            />

            <ModalToAdd
                show={modalChangeParent.edit}
                buttonAddOns={""}
                onClose={() => {
                    setModalChangeParent({
                        edit: false,
                    });
                    getDetailGroup(idGroup);
                    getGroupName(idGroup);
                }}
                title={"Change Parent"}
                url={`/changeParent`}
                data={dataChangeParent}
                onSuccess={handleSuccessChangeParent}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="mb-16">
                            <div className="mt-1 relative">
                                <InputLabel
                                    className="absolute"
                                    value="Change Parent"
                                />
                                <div className="ml-[6.8rem] text-red-600">
                                    *
                                </div>
                                <SelectTailwind
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-red-500 hover:text-white`
                                            }`,
                                    }}
                                    options={mappingChangeParent}
                                    isSearchable={true}
                                    placeholder={"--Select Parent--"}
                                    value={
                                        dataChangeParent.RELATION_GROUP_PARENT
                                    }
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        setDataChangeParent({
                                            ...dataChangeParent,
                                            RELATION_GROUP_PARENT: val,
                                        });
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal detail group */}

            {/* modal change sub group */}
            <ModalToAdd
                show={modalChangeSubGroup.edit}
                buttonAddOns={""}
                onClose={() =>
                    setModalChangeSubGroup({
                        edit: false,
                    })
                }
                title={"Change Sub Group"}
                url={`/changeSubGroup`}
                data={dataChangeSubGroup}
                onSuccess={handleSuccessChangeGroup}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-1">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Relation"
                                />
                                <div className="ml-[6.8rem] text-red-600">
                                    *
                                </div>
                                <div className="bg-gray-500 py-1 px-2 rounded-md">
                                    <span>
                                        {
                                            dataRelationChange.RELATION_ORGANIZATION_NAME
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 mb-56">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Sub Group"
                                />
                                <div className="ml-[4.8rem] text-red-600">
                                    *
                                </div>
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
                                    options={mappingSubGroupById}
                                    isSearchable={true}
                                    placeholder={"--Select Sub Group--"}
                                    value={
                                        dataChangeSubGroup.RELATION_ORGANIZATION_GROUP
                                    }
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) => {
                                        setDataChangeSubGroup({
                                            ...dataChangeSubGroup,
                                            RELATION_ORGANIZATION_GROUP: val,
                                        });
                                    }}
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal change sub group */}

            {/* modal option */}
            <ModalToAdd
                show={modalAddSubGroup.add}
                buttonAddOns={""}
                onClose={() =>
                    setModalAddSubGroup({
                        add: false,
                    })
                }
                title={"Add Sub Group"}
                url={`/addSubGroup`}
                data={dataSubGroup}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-4">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Sub Group Parent"
                                />
                                <div className="ml-[10.8rem] text-red-600">
                                    *
                                </div>
                                <div className="bg-gray-500 py-1 px-2 rounded-md">
                                    <span>
                                        {
                                            dataDetailSubGroupParent.RELATION_GROUP_NAME
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Sub Group"
                                />
                                <div className="ml-[7.8rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={dataSubGroup.RELATION_GROUP_NAME}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataSubGroup({
                                            ...dataSubGroup,
                                            RELATION_GROUP_NAME: e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Name Sub Group"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_DESCRIPTION"
                                    value="Sub Group Description"
                                />
                                <TextArea
                                    className="mt-2"
                                    id="RELATION_GROUP_DESCRIPTION"
                                    name="RELATION_GROUP_DESCRIPTION"
                                    defaultValue={
                                        dataSubGroup.RELATION_GROUP_DESCRIPTION
                                    }
                                    onChange={(e: any) => {
                                        setDataSubGroup({
                                            ...dataSubGroup,
                                            RELATION_GROUP_DESCRIPTION:
                                                e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* end modal option */}

            {/* modal add Relation existing */}
            <ModalToAdd
                show={modalAddRelation.add}
                buttonAddOns={""}
                onClose={() =>
                    setModalAddRelation({
                        add: false,
                    })
                }
                title={"Add Relation"}
                url={`/addRelation`}
                data={dataRelation}
                onSuccess={handleSuccessAddRelation}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="mt-4">
                            {dataRelation.name_relation?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {dataRelation.name_relation?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {tag}
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataRelation.name_relation.filter(
                                                                        (
                                                                            data: any
                                                                        ) =>
                                                                            data !==
                                                                            tag
                                                                    );
                                                                setDataRelation(
                                                                    {
                                                                        ...dataRelation,
                                                                        name_relation:
                                                                            updatedData,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </div>
                                                        {/* </a> */}
                                                    </div>
                                                </div>
                                                // </>
                                            );
                                        }
                                    )}
                                    <div className="w-full text-right">
                                        <span
                                            className="text-red-600 cursor-pointer hover:text-red-300 text-sm"
                                            onClick={() => {
                                                setDataRelation({
                                                    ...dataRelation,
                                                    name_relation: [],
                                                });
                                                inputRefTag.current?.focus();
                                            }}
                                        >
                                            Clear all
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                            <TextInput
                                ref={inputRefTag}
                                type="text"
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value.trimStart())
                                }
                                placeholder="Search Relations"
                                className=""
                                onFocus={() => setMenuOpen(true)}
                                // onBlur={() => setMenuOpen(false)}
                                // onKeyDown={(e) => {
                                //     if (e.key === "Enter" && !isDisableTag) {
                                //         setDataRelation((prev: any) => [
                                //             ...prev,
                                //             query,
                                //         ]);
                                //         setQuery("");
                                //         setMenuOpen(true);
                                //     }
                                // }}
                            />
                            {/* <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisableTag}
                                onClick={() => {
                                    if (isDisableTag) {
                                        return;
                                    }
                                    setDataRelation("relation_name", [
                                        ...dataRelation,
                                        {
                                            name_relation: query,
                                        },
                                    ]);
                                    setQuery("");
                                    inputRefTag.current?.focus();
                                    setMenuOpen(true);
                                }}
                            >
                                + Add
                            </button> */}
                            {menuOpen ? (
                                <div className="bg-white rounded-md shadow-md w-full max-h-52 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                                    <ul className="w-full">
                                        {filteredTags?.length ? (
                                            filteredTags?.map(
                                                (tag: any, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() => {
                                                            setMenuOpen(true);
                                                            setDataRelation({
                                                                ...dataRelation,
                                                                name_relation: [
                                                                    ...dataRelation.name_relation,
                                                                    tag.RELATION_ORGANIZATION_NAME,
                                                                ],
                                                            });
                                                            setQuery("");
                                                        }}
                                                    >
                                                        {
                                                            tag.RELATION_ORGANIZATION_NAME
                                                        }
                                                    </li>
                                                )
                                            )
                                        ) : (
                                            <li className="p-2 text-gray-500">
                                                No options available
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    </>
                }
            />
            {/* end modal relation existing */}

            {/* modal add relation */}
            {/* <AddRelationPopup
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
            /> */}
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
                            setGetDetailRelation={setGetDetailRelation}
                            detailRelation={relationId.idRelation}
                            relationStatus={relationStatus}
                            relationType={relationType}
                            profession={profession}
                            relationLOB={relationLOB}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-1 mb-96">
                <div className="col-span-2 bg-white rounded-lg shadow-md pb-10 mb-5">
                    {/* <div className="flex justify-between items-center mt-4 mb-4"> */}
                    {/* <div className="w-fit px-4 text-md font-semibold">
                            <span className="border-b-2 border-red-600">
                                Sub Group & Relation
                            </span>
                        </div> */}
                    {/* <a
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
                        </a> */}
                    {/* </div> */}
                    <div className="px-4 py-3 pb-6">
                        {/* <Card data={relationGroup} /> */}
                        {dataRelationGroupNew.children?.length === 0 ? (
                            <>
                                <span>No Data Available</span>
                            </>
                        ) : (
                            <>
                                <ul className="flex flex-col space-y-0 text-lg">
                                    {dataRelationGroupNew?.map(
                                        (item: any, i: number) => (
                                            <li className="" key={i}>
                                                <div
                                                    className="relative flex justify-between font-semibold text-black hover:text-red-600 w-fit hover:cursor-pointer"
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     const bb =
                                                    //         document.getElementById(
                                                    //             "item" + i
                                                    //         );
                                                    //     bb?.hidden === false;
                                                    // }}
                                                    onClick={() => {
                                                        handleClick(
                                                            item.RELATION_GROUP_ID
                                                        );
                                                    }}
                                                >
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
                                                            / Group
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="hidden"
                                                    key={i}
                                                    id={
                                                        "item" +
                                                        item.RELATION_GROUP_ID
                                                    }
                                                >
                                                    <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                        <li>
                                                            <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                <div
                                                                    className="text-sm bg-green-600 p-2 rounded-md text-white cursor-pointer hover:bg-green-400"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickAddSubGroup(
                                                                            e,
                                                                            item.RELATION_GROUP_ID
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        Add Sub
                                                                        Group
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="text-sm bg-blue-600 p-2 rounded-md text-white cursor-pointer hover:bg-blue-400"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickAddRelation(
                                                                            e,
                                                                            item.RELATION_GROUP_ID
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        Add
                                                                        Relation
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="text-sm bg-red-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickDetailGroup(
                                                                            e,
                                                                            item.RELATION_GROUP_ID
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        Edit
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="text-sm bg-amber-400 p-2 rounded-md text-white cursor-pointer hover:bg-amber-200"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickSummary(
                                                                            e,
                                                                            item.RELATION_GROUP_ID,
                                                                            item.RELATION_GROUP_NAME
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        Summary
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {item.r_group?.length !== 0
                                                    ? item.r_group?.map(
                                                          (
                                                              dataRelation: any,
                                                              c: number
                                                          ) => (
                                                              <div
                                                                  className="pt-1 pl-[0.32rem]"
                                                                  key={c}
                                                              >
                                                                  <ul className="flex flex-col pl-4 text-gray-500 border-l border-red-700">
                                                                      <li>
                                                                          <div
                                                                              className="relative flex justify-between hover:text-red-600 w-fit"
                                                                              onClick={() => {
                                                                                  handleClickRelation(
                                                                                      dataRelation.RELATION_ORGANIZATION_NAME
                                                                                  );
                                                                              }}
                                                                          >
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
                                                                          <div
                                                                              className="hidden"
                                                                              key={
                                                                                  c
                                                                              }
                                                                              id={
                                                                                  "item" +
                                                                                  dataRelation.RELATION_ORGANIZATION_NAME
                                                                              }
                                                                          >
                                                                              <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                                                  <li>
                                                                                      <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                                          <div
                                                                                              className="text-sm bg-yellow-500 p-2 rounded-md text-white cursor-pointer hover:bg-yellow-400"
                                                                                              onClick={(
                                                                                                  e
                                                                                              ) =>
                                                                                                  handleClickChangeSubGroup(
                                                                                                      e,
                                                                                                      dataRelation.RELATION_ORGANIZATION_ID
                                                                                                  )
                                                                                              }
                                                                                          >
                                                                                              <span>
                                                                                                  Change
                                                                                                  Group
                                                                                              </span>
                                                                                          </div>
                                                                                          <div
                                                                                              className="text-sm bg-blue-500 p-2 rounded-md text-white cursor-pointer hover:bg-blue-400"
                                                                                              onClick={(
                                                                                                  e
                                                                                              ) =>
                                                                                                  handleDetailPopup(
                                                                                                      e,
                                                                                                      dataRelation.RELATION_ORGANIZATION_ID,
                                                                                                      dataRelation.RELATION_ORGANIZATION_NAME
                                                                                                  )
                                                                                              }
                                                                                          >
                                                                                              <span>
                                                                                                  Detail
                                                                                              </span>
                                                                                          </div>
                                                                                          <div
                                                                                              className="text-sm bg-red-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                                                              onClick={(
                                                                                                  e: any
                                                                                              ) =>
                                                                                                  alertRemove(
                                                                                                      e,
                                                                                                      dataRelation.RELATION_ORGANIZATION_ID
                                                                                                  )
                                                                                              }
                                                                                          >
                                                                                              <span>
                                                                                                  Remove
                                                                                                  From
                                                                                                  Group
                                                                                              </span>
                                                                                          </div>
                                                                                          <div
                                                                                              className="text-sm bg-amber-400 p-2 rounded-md text-white cursor-pointer hover:bg-amber-300"
                                                                                              onClick={(
                                                                                                  e: any
                                                                                              ) => {
                                                                                                  handleClickRelationSummary(
                                                                                                      e,
                                                                                                      dataRelation.RELATION_ORGANIZATION_ID,
                                                                                                      dataRelation.RELATION_ORGANIZATION_NAME
                                                                                                  );
                                                                                              }}
                                                                                          >
                                                                                              <span>
                                                                                                  Summary
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  </li>
                                                                              </ul>
                                                                          </div>
                                                                      </li>
                                                                  </ul>
                                                              </div>
                                                          )
                                                      )
                                                    : null}
                                                {BasicInfo(item.children)}
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
