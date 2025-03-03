import {
    FormEvent,
    HTMLAttributes,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import PersonPopup from "../Person/Person";
import StructurePopup from "../Structure/Structure";
import Division from "../Division/Division";
import AddressPopup from "../Address/Address";
import JobDesk from "../Job/JobDesk";
import SelectTailwind from "react-tailwindcss-select";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { BeatLoader } from "react-spinners";
import PIC from "../Person/Pic";
import DatePicker from "react-datepicker";
import SwitchPage from "@/Components/Switch";
import Select from "react-tailwindcss-select";
import DetailDocumentRelation from "./DetailDocument";
// import { MyProvider } from "@/Utility/GlobalContext";
import PhoenixComponent from "@/Utility/PhoenixComponent";
import { MyProvider } from "@/Utility/GlobalContext";
import AppPlugin from "@/Utility/AppPlugin";
import DetailPerson from "../Person/DetailPerson";

export default function DetailRelation({
    detailRelation,
    relationStatus,
    relationType,
    profession,
    relationLOB,
    setGetDetailRelation,
    auth,
    relation,
}: PropsWithChildren<{
    detailRelation: any;
    relationStatus: any;
    relationType: any;
    profession: any;
    relationLOB: any;
    setGetDetailRelation: any;
    auth?: any;
    relation?: any;
}>) {
    // const { success, detailRelation }: any = usePage().props;
    const [dataRelationNew, setDataRelationNew] = useState<any>([]);
    const [salutations, setSalutations] = useState<any>([]);
    const [postSalutations, setPostSalutations] = useState<any>([]);
    const [switchPage, setSwitchPage] = useState(false);

    const [isSuccess, setIsSuccess] = useState<string>("");

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // Structure Modal
    const [structureModal, setStructureModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // Structure Edit Corporate PIC
    const [modalCorporatePIC, setModalCorporatePIC] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // Structure Modal
    const [divisionModal, setDivisionModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    // location modal
    const [locationModal, setLocationModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    // job des modal
    const [jobdeskModal, setJobDeskModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    useEffect(() => {
        getDetailRelation(detailRelation);
    }, [detailRelation]);

    useEffect(() => {
        getTPluginProcess();
    }, [detailRelation]);

    const [dataTPlugin, setDataTPlugin] = useState<any>([]);

    const getTPluginProcess = async () => {
        await axios
            .post(`/getTPluginProcess`)
            .then((res) => {
                // getPlugin(res.data);
                setDataTPlugin(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getMappingParent = async (name: string, column: string) => {
        await axios
            .post(`/getMappingParent`, { name, column })
            .then((res: any) => {})
            .catch((err) => {
                console.log(err);
            });
    };

    const getDetailRelation = async (id: string) => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getRelationDetail`, { id })
            .then((res) => {
                setDataRelationNew(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getCorporatePIC = async (id: string, idPerson: any) => {
        await axios
            .post(`/getCorporatePIC`, { id })
            .then((res) => {
                setDetailCorporatePIC({
                    PERSON_ID: idPerson,
                    detail_corporate: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getPreSalutationById`, { id, column })
                .then((res) => {
                    setSalutations(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const getPostSalutationById = async (id: string, column: string) => {
        if (id) {
            await axios
                .post(`/getPostSalutationById`, { id, column })
                .then((res) => {
                    setPostSalutations(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const [dataById, setDataById] = useState<any>({
        RELATION_ORGANIZATION_NAME: "",
        RELATION_ORGANIZATION_ABBREVIATION: "",
        RELATION_ORGANIZATION_AKA: "",
        RELATION_ORGANIZATION_EMAIL: "",
        RELATION_ORGANIZATION_WEBSITE: "",
        relation_description: "",
        RELATION_PROFESSION_ID: "",
        RELATION_LOB_ID: "",
        PRE_SALUTATION: "",
        POST_SALUTATION: "",
        relation_status_id: "",
        TAG_NAME: "",
        HR_MANAGED_BY_APP: "",
        MARK_TBK_RELATION: "",
        RELATION_ORGANIZATION_DATE_OF_BIRTH: "",
        RELATION_ORGANIZATION_NPWP: "",
        DEFAULT_PAYABLE: "",
        m_relation_type: [
            {
                RELATION_ORGANIZATION_TYPE_ID: "",
                RELATION_ORGANIZATION_ID: "",
                RELATION_TYPE_ID: "",
            },
        ],
        m_relation_aka: [
            {
                RELATION_AKA_NAME: "",
            },
        ],
        m_tagging: [],
    });

    const [nameRelationOld, setNameRelationOld] = useState<string>("");
    const handleEditModel = async (e: FormEvent, id: number) => {
        e.preventDefault();

        setDataById(dataRelationNew);
        setNameRelationOld(dataRelationNew.RELATION_ORGANIZATION_NAME);
        getSalutationById(
            dataRelationNew.relation_status_id,
            "relation_status_id"
        );
        getPostSalutationById(
            dataRelationNew.relation_status_id,
            "relation_status_id"
        );
        if (dataRelationNew.RELATION_ORGANIZATION_GROUP !== null) {
            getMappingParent(
                dataRelationNew.RELATION_ORGANIZATION_GROUP,
                "RELATION_ORGANIZATION_GROUP"
            );
        }

        if (dataRelationNew.DEFAULT_PAYABLE === 1) {
            setSwitchPage(true);
        } else {
            setSwitchPage(false);
        }

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefTag = useRef<HTMLInputElement>(null);
    const inputRefCorporate = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [queryTag, setQueryTag] = useState("");
    const [queryCorporate, setQueryCorporate] = useState("");
    const [menuOpen, setMenuOpen] = useState(true);
    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    const [relationAll, setRelationAll] = useState<any>([]);
    const getRelationAll = async () => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getRelationAll`)
            .then((res) => {
                setRelationAll(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [detailCorporatePIC, setDetailCorporatePIC] = useState<any>({
        INDIVIDU_RELATION_ID: detailRelation,
        detail_corporate: [
            {
                RELATION_ORGANIZATION_NAME: "",
            },
        ],
    });
    const filteredAllRelation = relationAll.filter(
        (item: any) =>
            item.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase()?.includes(
                queryCorporate.toLocaleLowerCase()?.trim()
            ) &&
            !detailCorporatePIC.detail_corporate?.find(
                (f: any) =>
                    f?.RELATION_ORGANIZATION_NAME ===
                    item.RELATION_ORGANIZATION_NAME
            )
    );

    const isDisableEdit =
        !query?.trim() ||
        dataById.m_relation_aka.filter(
            (item: any) =>
                item.RELATION_AKA_NAME?.toLocaleLowerCase()?.trim() ===
                query?.toLocaleLowerCase()?.trim()
        )?.length;
    const isDisableTagEdit =
        !queryTag?.trim() ||
        dataById.m_tagging.filter(
            (item: any) =>
                item.tagging.TAG_NAME?.toLocaleLowerCase()?.trim() ===
                queryTag?.toLocaleLowerCase()?.trim()
        )?.length;

    const handleCheckboxHREdit = (e: any) => {
        if (e == true) {
            setSwitchPage(true);
            setDataById({ ...dataById, HR_MANAGED_BY_APP: "1" });
        } else {
            setSwitchPage(false);
            setDataById({ ...dataById, HR_MANAGED_BY_APP: "0" });
        }
    };

    const handleCheckboxDefault = (e: any) => {
        if (e == true) {
            setSwitchPage(true);
            setDataById({ ...dataById, DEFAULT_PAYABLE: "1" });
        } else {
            setSwitchPage(false);
            setDataById({ ...dataById, DEFAULT_PAYABLE: "0" });
        }
    };

    const checkCheckedMRelation = (id: number, idr: number) => {
        if (
            dataById.m_relation_type.find(
                (f: any) =>
                    f.RELATION_ORGANIZATION_ID === id &&
                    f.RELATION_TYPE_ID === idr
            )
        ) {
            return true;
        }
    };
    const handleCheckboxEdit = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setDataById({
                ...dataById,
                m_relation_type: [
                    ...dataById.m_relation_type,
                    {
                        RELATION_ORGANIZATION_TYPE_ID: "",
                        RELATION_ORGANIZATION_ID:
                            dataById.RELATION_ORGANIZATION_ID,
                        RELATION_TYPE_ID: parseInt(value),
                    },
                ],
            });
        } else {
            const updatedData = dataById.m_relation_type.filter(
                (data: any) => data.RELATION_TYPE_ID !== parseInt(value)
            );
            setDataById({ ...dataById, m_relation_type: updatedData });
        }
    };

    const handleSuccessEdit = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            if (message[0] === "0") {
                Swal.fire({
                    title: "Warning",
                    text: message[1],
                    icon: "warning",
                }).then((result: any) => {});
            } else {
                setIsSuccess(message[4]);
                setGetDetailRelation({
                    RELATION_ORGANIZATION_NAME: message[1],
                    RELATION_ORGANIZATION_ID: message[0],
                    RELATION_SALUTATION_PRE: message[2],
                    RELATION_SALUTATION_POST: message[3],
                });
                getDetailRelation(message[0]);
                setTimeout(() => {
                    setIsSuccess("");
                }, 1000);
            }
        }
    };
    const handleSuccessEditCorporate = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[1]);
            getDetailRelation(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 1000);
        }
    };

    const handleSuccessEditDocument = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[1]);
            getDetailRelation(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 1000);
        }
    };

    // Onclick Structure
    const handleClickStructure = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setStructureModal({
            add: false,
            delete: false,
            edit: false,
            view: !structureModal.view,
            document: false,
            search: false,
        });
    };
    // end Structure

    // OnClick Division
    const handleClickDivision = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setDivisionModal({
            add: false,
            edit: false,
            view: !divisionModal.view,
        });
    };
    // End Division Click

    // OnClick Address Location
    const handleClickAddressLocation = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setLocationModal({
            add: false,
            edit: false,
            view: !locationModal.view,
        });
    };
    // End Address Location Click

    // handle click personal info
    const [modalPersonalInfo, setModalPersonalInfo] = useState<any>({
        view: false,
    });
    const [idIndividuRelation, setIdIndividuRelation] = useState<any>("");
    const [flagFrom, setFlagFrom] = useState<any>("");
    const handleClickPersonalInfo = async (e: FormEvent, idRelation: any) => {
        e.preventDefault();
        setIdIndividuRelation(idRelation);
        setFlagFrom("flagFromPersonalInfo");
        getPersonRelationship();
        setModalPersonalInfo({
            view: !modalPersonalInfo.view,
        });
    };

    const [dataPersonRelationship, setDataPersonRelationship] = useState<any>(
        []
    );

    const getPersonRelationship = async () => {
        await axios
            .get(`/getPersonRelationship`)
            .then((res) => {
                setDataPersonRelationship(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // end handle click personal info

    // OnClick Address Location
    const handleClickJobDesk = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setJobDeskModal({
            add: false,
            edit: false,
            view: !jobdeskModal.view,
        });
    };
    // End Address Location Click

    // Onclick Person
    const handleClickPerson = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };

    const [modalPIC, setModalPIC] = useState<any>({
        view: false,
    });

    const handleClickPIC = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setModalPIC({
            add: false,
            delete: false,
            edit: false,
            view: !modalPIC.view,
            document: false,
            search: false,
        });
    };

    const [modalDocument, setModalDocument] = useState<any>({
        view: false,
    });

    const handleClickDocument = async (
        e: FormEvent,
        idRelationOrganization: string
    ) => {
        e.preventDefault();

        setModalDocument({
            view: !modalDocument.view,
        });
    };

    const professionSelect = profession?.map((query: any) => {
        return {
            value: query.RELATION_PROFESSION_ID,
            label: query.RELATION_PROFESSION_NAME,
        };
    });

    const lobSelect = relationLOB?.map((query: any) => {
        return {
            value: query.RELATION_LOB_ID,
            label: query.RELATION_LOB_NAME,
        };
    });

    const getProfessionSelect = (value: any) => {
        if (value) {
            const selected = professionSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const getLobSelect = (value: any) => {
        if (value) {
            const selected = lobSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const [existingAbb, setExistingAbb] = useState<any>([]);

    const cekAbbreviationRelationEdit = async (name: any, id: any) => {
        const flag = "edit";
        await axios
            .post(`/getCekAbbreviation`, { name, flag, id })
            .then((res: any) => {
                setExistingAbb(res.data);
                if (res.data.length >= 1) {
                    Swal.fire({
                        title: "Warning",
                        text: "Abbreviation already exists",
                        icon: "warning",
                    }).then((result: any) => {});
                    setDataById({
                        ...dataById,
                        RELATION_ORGANIZATION_ABBREVIATION: "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleClickEditCorporate = async (
        e: FormEvent,
        idRelationOrganization: string,
        idPerson: string
    ) => {
        e.preventDefault();

        getCorporatePIC(idRelationOrganization, idPerson);
        getRelationAll();
        setModalCorporatePIC({
            add: false,
            delete: false,
            edit: !modalCorporatePIC.edit,
            view: false,
            document: false,
            search: false,
        });
    };

    let valueEmail;
    if (dataById.RELATION_ORGANIZATION_EMAIL === null) {
        valueEmail = "";
    } else {
        valueEmail = dataById.RELATION_ORGANIZATION_EMAIL;
    }

    let valueWebsite;
    if (dataById.RELATION_ORGANIZATION_WEBSITE === null) {
        valueWebsite = "";
    } else {
        valueWebsite = dataById.RELATION_ORGANIZATION_WEBSITE;
    }

    // modal edit bank account
    const [modalEditBankRelation, setModalEditBankRelation] = useState<any>({
        edit: false,
    });

    const [editBankRelation, setEditBankRelation] = useState<any>({
        RELATION_ORGANIZATION_ID: detailRelation,
        bank_account: [
            {
                BANK_ID: "",
                ACCOUNT_NAME: "",
                ACCOUNT_NUMBER: "",
                NPWP_NAME: "",
                RELATION_ORGANIZATION_ID: detailRelation,
            },
        ],
    });

    const handleEditBankRelation = async (e: FormEvent, relationId: number) => {
        e.preventDefault();

        getRBank();
        setEditBankRelation({
            RELATION_ORGANIZATION_ID: detailRelation,
            bank_account: dataRelationNew.m_bank_relation,
        });
        setModalEditBankRelation({
            edit: !modalEditBankRelation.edit,
        });
    };

    const [bank, setBank] = useState<any>([]);
    const getRBank = async () => {
        await axios
            .post(`/getRBank`)
            .then((res) => {
                setBank(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const bankSelect = bank?.map((query: any) => {
        return {
            value: query.BANK_ID,
            label: query.BANK_ABBREVIATION,
        };
    });

    const getNameBank = (value: any) => {
        if (value) {
            const selected = bankSelect.filter(
                (option: any) => option.value === value
            );
            return selected[0]?.label;
        }
    };

    const addRowBankAccount = (e: FormEvent) => {
        e.preventDefault();

        setEditBankRelation({
            ...editBankRelation,
            bank_account: [
                ...editBankRelation.bank_account,
                {
                    BANK_ID: "",
                    ACCOUNT_NAME: "",
                    ACCOUNT_NUMBER: "",
                    NPWP_NAME: "",
                    RELATION_ORGANIZATION_ID: detailRelation,
                },
            ],
        });
    };

    const inputDataBank = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...editBankRelation.bank_account];
        changeVal[i][name] = value;
        setEditBankRelation({
            ...editBankRelation,
            bank_account: changeVal,
        });
    };

    const handleSuccessEditBankRelation = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[1]);
            getDetailRelation(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 1000);
        }
    };

    // for cek relation existing
    const inputRefEditRelation = useRef<HTMLInputElement>(null);
    const [showRelation, setShowRelation] = useState<boolean>(false);

    const filterResult = relation.filter(
        (m: any) =>
            m.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase() !==
            nameRelationOld?.toLocaleLowerCase()
    );

    const filteredRelation = filterResult.filter((item: any) =>
        item.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase()?.includes(
            dataById.RELATION_ORGANIZATION_NAME.toLocaleLowerCase()?.trim()
        )
    );

    // cek relation existing
    const cekRelationName = () => {
        if (
            dataById.relation_status_id === 1 ||
            dataById.relation_status_id === "1"
        ) {
            const filterRelation = filterResult.filter(
                (items: any) =>
                    items.RELATION_ORGANIZATION_NAME?.toLocaleLowerCase() ===
                    dataById.RELATION_ORGANIZATION_NAME.toLocaleLowerCase()?.trim()
            );

            if (filterRelation.length !== 0) {
                Swal.fire({
                    title: "Warning",
                    text: "Relation Already Exists",
                    icon: "warning",
                }).then((result: any) => {});
                setDataById({
                    ...dataById,
                    RELATION_ORGANIZATION_NAME: "",
                });
            }
        }
    };

    return (
        <>
            <AppPlugin parameterID={detailRelation} />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            <ModalToAction
                show={modalPersonalInfo.view}
                onClose={() => {
                    setModalPersonalInfo({
                        view: false,
                    });
                    setFlagFrom("");
                }}
                title={"Detail Person"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailPerson
                            idPerson={idIndividuRelation}
                            dataPersonRelationship={dataPersonRelationship}
                            flagFrom={flagFrom}
                        />
                    </>
                }
            />

            <ModalToAction
                show={modalDocument.view}
                onClose={() =>
                    setModalDocument({
                        view: false,
                    })
                }
                title={"Document"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailDocumentRelation
                            idRelation={detailRelation}
                            dataRelationNew={dataRelationNew}
                            handleSuccessEditDocument={
                                handleSuccessEditDocument
                            }
                            setIsSuccess={setIsSuccess}
                            isSuccess={isSuccess}
                        />
                    </>
                }
            />

            {/* edit bank account relation */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalEditBankRelation.edit}
                onClose={() =>
                    setModalEditBankRelation({
                        edit: false,
                    })
                }
                title={"Edit Bank Relation"}
                url={`/editBankRelation`}
                data={editBankRelation}
                onSuccess={handleSuccessEditBankRelation}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                body={
                    <>
                        <div className="h-[100vh]">
                            <div>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <div className="text-md font-semibold">
                                            <span>Bank Name</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-md font-semibold">
                                            <span>Account Name</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-md font-semibold">
                                            <span>Account Number</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-md font-semibold">
                                            <span>NPWP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {editBankRelation.bank_account?.length !== 0
                                ? editBankRelation.bank_account?.map(
                                      (bankAccount: any, i: number) => {
                                          return (
                                              <div
                                                  className="grid grid-cols-4 gap-2"
                                                  key={i}
                                              >
                                                  <div className="mt-1 shadow-lg">
                                                      <Select
                                                          classNames={{
                                                              menuButton: () =>
                                                                  `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                              menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                              listItem: ({
                                                                  isSelected,
                                                              }: any) =>
                                                                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                      isSelected
                                                                          ? `text-white bg-red-600`
                                                                          : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                  }`,
                                                          }}
                                                          options={bankSelect}
                                                          isSearchable={true}
                                                          placeholder={
                                                              "Bank Name *"
                                                          }
                                                          value={
                                                              bankAccount.BANK_ID ===
                                                              ""
                                                                  ? null
                                                                  : {
                                                                        label: getNameBank(
                                                                            bankAccount.BANK_ID
                                                                        ),
                                                                        value: bankAccount.BANK_ID,
                                                                    }
                                                          }
                                                          onChange={(
                                                              val: any
                                                          ) => {
                                                              inputDataBank(
                                                                  "BANK_ID",
                                                                  val.value,
                                                                  i
                                                              );
                                                          }}
                                                          primaryColor={
                                                              "bg-red-500"
                                                          }
                                                      />
                                                  </div>
                                                  <div className="">
                                                      <TextInput
                                                          type="text"
                                                          value={
                                                              bankAccount.ACCOUNT_NAME
                                                          }
                                                          className="mt-2"
                                                          onChange={(e) =>
                                                              inputDataBank(
                                                                  "ACCOUNT_NAME",
                                                                  e.target
                                                                      .value,
                                                                  i
                                                              )
                                                          }
                                                          placeholder="Account Name"
                                                      />
                                                  </div>
                                                  <div className="">
                                                      <TextInput
                                                          type="text"
                                                          value={
                                                              bankAccount.ACCOUNT_NUMBER
                                                          }
                                                          className="mt-2"
                                                          onChange={(e) =>
                                                              inputDataBank(
                                                                  "ACCOUNT_NUMBER",
                                                                  e.target
                                                                      .value,
                                                                  i
                                                              )
                                                          }
                                                          placeholder="Account Number"
                                                      />
                                                  </div>
                                                  <div className="">
                                                      <div className="flex items-center">
                                                          <TextInput
                                                              type="text"
                                                              value={
                                                                  bankAccount.NPWP_NAME
                                                              }
                                                              className="mt-2"
                                                              onChange={(e) =>
                                                                  inputDataBank(
                                                                      "NPWP_NAME",
                                                                      e.target
                                                                          .value,
                                                                      i
                                                                  )
                                                              }
                                                              placeholder="NPWP"
                                                          />
                                                          <span
                                                              className="mt-2"
                                                              onClick={() => {
                                                                  const updatedData =
                                                                      editBankRelation.bank_account.filter(
                                                                          (
                                                                              data: any,
                                                                              a: number
                                                                          ) =>
                                                                              a !==
                                                                              i
                                                                      );
                                                                  setEditBankRelation(
                                                                      {
                                                                          ...editBankRelation,
                                                                          bank_account:
                                                                              updatedData,
                                                                      }
                                                                  );
                                                              }}
                                                          >
                                                              <XMarkIcon className="w-7 text-red-600 cursor-pointer" />
                                                          </span>
                                                      </div>
                                                  </div>
                                              </div>
                                          );
                                      }
                                  )
                                : null}
                            <div
                                className="text-sm text-gray-500 mt-2 hover:cursor-pointer hover:underline"
                                onClick={(e) => addRowBankAccount(e)}
                            >
                                <span>+ Add Row Bank Account</span>
                            </div>
                        </div>
                    </>
                }
            />
            {/* edit bank account relation */}

            {/* edit corporate PIC */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalCorporatePIC.edit}
                onClose={() =>
                    setModalCorporatePIC({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Edit Corporate PIC"}
                url={`/editCorporatePIC`}
                data={detailCorporatePIC}
                onSuccess={handleSuccessEditCorporate}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-5xl"
                }
                body={
                    <>
                        <div className="mt-4">
                            {detailCorporatePIC.detail_corporate?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {detailCorporatePIC.detail_corporate?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {
                                                        tag?.RELATION_ORGANIZATION_NAME
                                                    }
                                                    <div className="cursor-pointer">
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    detailCorporatePIC.detail_corporate.filter(
                                                                        (
                                                                            data: any
                                                                        ) =>
                                                                            data.RELATION_ORGANIZATION_NAME !==
                                                                            tag.RELATION_ORGANIZATION_NAME
                                                                    );
                                                                setDetailCorporatePIC(
                                                                    {
                                                                        ...detailCorporatePIC,
                                                                        detail_corporate:
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
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                    <div className="w-full text-right">
                                        <span
                                            className="text-red-600 cursor-pointer hover:text-red-300 text-sm"
                                            onClick={() => {
                                                setDetailCorporatePIC({
                                                    ...detailCorporatePIC,
                                                    INDIVIDU_RELATION_ID:
                                                        detailRelation,
                                                    detail_corporate: [],
                                                });
                                                inputRefCorporate.current?.focus();
                                            }}
                                        >
                                            Clear all
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                            <TextInput
                                ref={inputRefCorporate}
                                type="text"
                                value={queryCorporate}
                                onChange={(e) =>
                                    setQueryCorporate(
                                        e.target.value.trimStart()
                                    )
                                }
                                placeholder="Search Relations"
                                className=""
                                onFocus={() => setMenuOpen(true)}
                            />
                            {menuOpen ? (
                                <div className="bg-white rounded-md shadow-md w-full max-h-72 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                                    {isLoading.get_detail ? (
                                        <div className="m-auto py-20 sweet-loading h-[199px]">
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
                                        <ul className="w-full">
                                            {filteredAllRelation?.length ? (
                                                filteredAllRelation?.map(
                                                    (tag: any, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                setMenuOpen(
                                                                    true
                                                                );
                                                                setDetailCorporatePIC(
                                                                    {
                                                                        ...detailCorporatePIC,
                                                                        detail_corporate:
                                                                            [
                                                                                ...detailCorporatePIC.detail_corporate,
                                                                                {
                                                                                    PIC_IS_DELETED: 0,
                                                                                    RELATION_ORGANIZATION_NAME:
                                                                                        tag.RELATION_ORGANIZATION_NAME,
                                                                                },
                                                                            ],
                                                                    }
                                                                );
                                                                setQueryCorporate(
                                                                    ""
                                                                );
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
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </>
                }
            />
            {/* End Edit Corporate PIC */}

            <ModalToAction
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
                title={"Edit Relation"}
                url={`/editRelation/${detailRelation}`}
                data={dataById}
                onSuccess={handleSuccessEdit}
                method={"patch"}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[100%]"
                }
                submitButtonName={"Submit"}
                body={
                    <>
                        <div className="lg:grid lg:gap-4 lg:grid-cols-2 xs:grid xs:gap-4 xs:grid-cols-1">
                            <div className="mt-4">
                                <InputLabel
                                    className=""
                                    htmlFor="relation_status_id"
                                    value="Relation Status"
                                    required={true}
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.relation_status_id}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            relation_status_id: parseInt(
                                                e.target.value
                                            ),
                                        });
                                        getSalutationById(
                                            e.target.value,
                                            "relation_status_id"
                                        );
                                        getPostSalutationById(
                                            e.target.value,
                                            "relation_status_id"
                                        );
                                    }}
                                >
                                    <option>
                                        -- Choose Relation Status --
                                    </option>
                                    {relationStatus.map(
                                        (relationStatus: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        relationStatus.relation_status_id
                                                    }
                                                >
                                                    {
                                                        relationStatus.relation_status_name
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="lg:mt-4 xs:mt-0">
                                    <InputLabel
                                        htmlFor="PRE_SALUTATION"
                                        value="Pre Salutation"
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataById.PRE_SALUTATION === null
                                                ? ""
                                                : dataById.PRE_SALUTATION
                                        }
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                PRE_SALUTATION: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Pre Salutation --
                                        </option>
                                        {salutations.map(
                                            (
                                                getSalutations: any,
                                                i: number
                                            ) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            getSalutations.salutation_id
                                                        }
                                                    >
                                                        {
                                                            getSalutations.salutation_name
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                                <div className="lg:mt-4 xs:mt-0">
                                    <InputLabel
                                        htmlFor="POST_SALUTATION"
                                        value="Post Salutation"
                                    />
                                    <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={
                                            dataById.POST_SALUTATION === null
                                                ? ""
                                                : dataById.POST_SALUTATION
                                        }
                                        onChange={(e) => {
                                            setDataById({
                                                ...dataById,
                                                POST_SALUTATION: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={""}>
                                            -- Choose Post Salutation --
                                        </option>
                                        {postSalutations.map(
                                            (
                                                getSalutations: any,
                                                i: number
                                            ) => {
                                                return (
                                                    <option
                                                        key={i}
                                                        value={
                                                            getSalutations.salutation_id
                                                        }
                                                    >
                                                        {
                                                            getSalutations.salutation_name
                                                        }
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="lg:grid lg:gap-4 lg:grid-cols-2 xs:grid xs:gap-0 xs:grid-cols-1">
                            <div className="mt-4 relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_ORGANIZATION_NAME"
                                    value="Name Relation"
                                />
                                <div className="ml-[6.7rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    ref={inputRefEditRelation}
                                    type="text"
                                    value={dataById.RELATION_ORGANIZATION_NAME}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_NAME:
                                                e.target.value,
                                        });
                                        if (e.target.value !== "") {
                                            setShowRelation(true);
                                        } else {
                                            setShowRelation(false);
                                        }
                                    }}
                                    onBlur={() => {
                                        // cekRelationName();
                                        setShowRelation(false);
                                    }}
                                    required
                                    placeholder="Name Relation"
                                />
                                {showRelation &&
                                    filteredRelation.length !== 0 && (
                                        <div className="bg-white shadow-md rounded-md absolute mt-1 w-full px-2 text-sm overflow-y-auto h-32">
                                            <div className="mt-1 font-semibold italic">
                                                <span>
                                                    Relation Already Exists
                                                </span>
                                            </div>
                                            {filteredRelation?.map(
                                                (items: any, index: number) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="mt-1 px-2 flex gap-2 items-center"
                                                        >
                                                            <div>
                                                                {
                                                                    items.RELATION_ORGANIZATION_NAME
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {"(" +
                                                                    items
                                                                        ?.relation_status
                                                                        .relation_status_name +
                                                                    ")"}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                            </div>
                            <div className="mt-4 relative" id="abbr">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_ORGANIZATION_ABBREVIATION"
                                    value="Abbreviation"
                                />
                                <div className="ml-[5.8rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={
                                        dataById.RELATION_ORGANIZATION_ABBREVIATION
                                    }
                                    className="mt-2"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_ABBREVIATION:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    onBlur={() => {
                                        cekAbbreviationRelationEdit(
                                            dataById.RELATION_ORGANIZATION_ABBREVIATION,
                                            dataById.RELATION_ORGANIZATION_ID
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="xs:grid xs:gap-0 xs:grid-cols-1 mt-4 lg:grid lg:gap-4 lg:grid-cols-2">
                            <div className="mt-4">
                                {dataById.m_relation_aka?.length ? (
                                    <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                        {dataById.m_relation_aka?.map(
                                            (tag: any, i: number) => {
                                                return (
                                                    // <>
                                                    <div
                                                        key={i}
                                                        className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                    >
                                                        {tag.RELATION_AKA_NAME}
                                                        <div>
                                                            {/* <a href=""> */}
                                                            <div
                                                                className="text-red-600"
                                                                onMouseDown={(
                                                                    e
                                                                ) =>
                                                                    e.preventDefault()
                                                                }
                                                                onClick={() => {
                                                                    const updatedData =
                                                                        dataById.m_relation_aka.filter(
                                                                            (
                                                                                data: any
                                                                            ) =>
                                                                                data.RELATION_AKA_NAME !==
                                                                                tag.RELATION_AKA_NAME
                                                                        );
                                                                    setDataById(
                                                                        {
                                                                            ...dataById,
                                                                            m_relation_aka:
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
                                                    setDataById({
                                                        ...dataById,
                                                        m_relation_aka: [],
                                                    });
                                                    inputRef.current?.focus();
                                                }}
                                            >
                                                Clear all
                                            </span>
                                        </div>
                                    </div>
                                ) : null}
                                <TextInput
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(e.target.value.trimStart())
                                    }
                                    placeholder="Create AKA"
                                    className=""
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            !isDisableEdit
                                        ) {
                                            setDataById({
                                                ...dataById,
                                                m_relation_aka: [
                                                    ...dataById.m_relation_aka,
                                                    {
                                                        RELATION_AKA_NAME:
                                                            query,
                                                    },
                                                ],
                                            });
                                            setQuery("");
                                            // setMenuOpen(true);
                                        }
                                    }}
                                />
                                <button
                                    className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                    disabled={isDisableEdit}
                                    onClick={() => {
                                        if (isDisableEdit) {
                                            return;
                                        }
                                        setDataById({
                                            ...dataById,
                                            m_relation_aka: [
                                                ...dataById.m_relation_aka,
                                                {
                                                    RELATION_AKA_NAME: query,
                                                },
                                            ],
                                        });
                                        setQuery("");
                                        inputRef.current?.focus();
                                        // setMenuOpen(true);
                                    }}
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="mt-4 hidden">
                                {/* <InputLabel
                                    htmlFor="is_managed"
                                    value="HR MANAGED BY APP"
                                /> */}
                                <ul role="list" className="">
                                    <li className="col-span-1 flex rounded-md shadow-sm">
                                        <div className="flex flex-1 items-center truncate rounded-md shadow-md bg-white h-9">
                                            <span className="mt-1 ml-2">
                                                <Switch
                                                    enabled={switchPage}
                                                    onChangeButton={(e: any) =>
                                                        handleCheckboxHREdit(e)
                                                    }
                                                />
                                            </span>
                                            <span className="ml-2 text-sm">
                                                HR MANAGED BY APP
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div
                            className={
                                dataById.relation_status_id === "2" ||
                                dataById.relation_status_id === 2
                                    ? "xs:grid xs:gap-4 xs:grid-cols-1 lg:grid lg:gap-4 lg:grid-cols-2"
                                    : "xs:grid xs:gap-4 xs:grid-cols-1 lg:grid lg:gap-4 lg:grid-cols-3"
                            }
                        >
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_DATE_OF_BIRTH"
                                    value="Date Of Birth"
                                />
                                <div className="relative grid grid-cols-1">
                                    <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 mt-2 pointer-events-none">
                                        <svg
                                            className="w-3 h-3 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <DatePicker
                                        popperPlacement="top-end"
                                        selected={
                                            dataById.RELATION_ORGANIZATION_DATE_OF_BIRTH
                                        }
                                        onChange={(date: any) => {
                                            setDataById({
                                                ...dataById,
                                                RELATION_ORGANIZATION_DATE_OF_BIRTH:
                                                    date.toLocaleDateString(
                                                        "en-CA"
                                                    ),
                                            });
                                        }}
                                        className="border-0 rounded-md shadow-md text-sm mt-2 h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyy"
                                    />
                                </div>
                            </div>
                            <div
                                className={
                                    dataById.relation_status_id === "2" ||
                                    dataById.relation_status_id === 2
                                        ? "hidden"
                                        : "mt-4"
                                }
                            >
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_EMAIL"
                                    value="Email"
                                />
                                <TextInput
                                    type="email"
                                    value={valueEmail}
                                    className="mt-2"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_EMAIL:
                                                e.target.value,
                                        });
                                    }}
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="xs:-mt-5 lg:mt-4">
                                <InputLabel
                                    htmlFor="RELATION_ORGANIZATION_WEBSITE"
                                    value="Website"
                                />
                                <TextInput
                                    type="text"
                                    value={valueWebsite}
                                    className="mt-2"
                                    onChange={(e: any) => {
                                        setDataById({
                                            ...dataById,
                                            RELATION_ORGANIZATION_WEBSITE:
                                                e.target.value,
                                        });
                                    }}
                                    placeholder="www.example.com"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="relation_type_id"
                                value="Relation Type"
                            />
                            <div>
                                <ul
                                    role="list"
                                    className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                                >
                                    {relationType.map(
                                        (typeRelation: any, i: number) => {
                                            return (
                                                <li
                                                    key={
                                                        typeRelation.RELATION_TYPE_ID
                                                    }
                                                    className="col-span-1 flex rounded-md shadow-sm"
                                                >
                                                    <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                        <Checkbox
                                                            value={
                                                                typeRelation.RELATION_TYPE_ID
                                                            }
                                                            defaultChecked={checkCheckedMRelation(
                                                                dataById.RELATION_ORGANIZATION_ID,
                                                                typeRelation.RELATION_TYPE_ID
                                                            )}
                                                            onChange={(e) =>
                                                                handleCheckboxEdit(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                        <div className="flex-1 truncate px-1 py-2 text-xs">
                                                            <span className="text-gray-900">
                                                                {
                                                                    typeRelation.RELATION_TYPE_NAME
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                        </div>
                        {(dataById.relation_status_id === 2 &&
                            dataById.m_relation_type.find(
                                (f: any) => f.RELATION_TYPE_ID === 3
                            )) ||
                        dataById.m_relation_type.find(
                            (f: any) => f.RELATION_TYPE_ID === 13
                        ) ||
                        (dataById.relation_status_id === 1 &&
                            dataById.m_relation_type.find(
                                (f: any) => f.RELATION_TYPE_ID === 3
                            )) ||
                        dataById.m_relation_type.find(
                            (f: any) => f.RELATION_TYPE_ID === 13
                        ) ? (
                            <>
                                <div className="grid grid-cols-2 gap-1 mt-2 relative">
                                    <div>
                                        <InputLabel
                                            value="NPWP"
                                            className="absolute"
                                        />
                                        <div className="ml-[2.7rem] text-red-600">
                                            *
                                        </div>
                                        <TextInput
                                            type="text"
                                            value={
                                                dataById.RELATION_ORGANIZATION_NPWP
                                            }
                                            className="mt-2"
                                            onChange={(e) =>
                                                setDataById({
                                                    ...dataById,
                                                    RELATION_ORGANIZATION_NPWP:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="NPWP"
                                        />
                                    </div>
                                    <div className="text-sm mt-8 flex">
                                        <div className="rotate-90 -ml-3">
                                            <SwitchPage
                                                enabled={switchPage}
                                                onChangeButton={
                                                    handleCheckboxDefault
                                                }
                                            />
                                        </div>
                                        <div className="">
                                            <div className="text-xs mb-1">
                                                <span>
                                                    Default Payable By Relation
                                                </span>
                                            </div>
                                            <div className="text-xs">
                                                <span>
                                                    Default Payable By Fresnel
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {dataById.relation_status_id === 1 ||
                        dataById.relation_status_id === "1" ? (
                            <div className="mt-4" id="relationLob">
                                <InputLabel
                                    htmlFor="RELATION_LOB_ID"
                                    value="Business Sector"
                                />
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
                                    options={lobSelect}
                                    isSearchable={true}
                                    placeholder={"--Select LOB--"}
                                    // value={dataById.RELATION_LOB_ID}
                                    value={{
                                        label: getLobSelect(
                                            dataById.RELATION_LOB_ID
                                        ),
                                        value: dataById.RELATION_LOB_ID,
                                    }}
                                    // onChange={(e) =>
                                    //     inputDataBank(
                                    //         "BANK_ID",
                                    //         e.target.value,
                                    //         i
                                    //     )
                                    // }
                                    onChange={(val: any) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_LOB_ID: val.value,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        ) : (
                            <div className="mt-4" id="relationJobs">
                                <InputLabel
                                    htmlFor="profession_id"
                                    value="Relation Profession"
                                />
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
                                    options={professionSelect}
                                    isSearchable={true}
                                    placeholder={"--Select Profession--"}
                                    value={{
                                        label: getProfessionSelect(
                                            dataById.RELATION_PROFESSION_ID
                                        ),
                                        value: dataById.RELATION_PROFESSION_ID,
                                    }}
                                    onChange={(val: any) =>
                                        setDataById({
                                            ...dataById,
                                            RELATION_PROFESSION_ID: val.value,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="RELATION_ORGANIZATION_DESCRIPTION"
                                value="Relation Description"
                            />
                            <TextArea
                                className="mt-2"
                                id="RELATION_ORGANIZATION_DESCRIPTION"
                                name="RELATION_ORGANIZATION_DESCRIPTION"
                                defaultValue={
                                    dataById.RELATION_ORGANIZATION_DESCRIPTION
                                }
                                onChange={(e: any) =>
                                    setDataById({
                                        ...dataById,
                                        RELATION_ORGANIZATION_DESCRIPTION:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mt-4">
                            {dataById.m_tagging?.length ? (
                                <div className="bg-white p-2 mb-2 relative flex flex-wrap gap-1 rounded-lg shadow-md">
                                    {dataById.m_tagging?.map(
                                        (tag: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-full w-fit py-1.5 px-3 border border-red-600 bg-gray-50 text-gray-500 flex items-center gap-2"
                                                >
                                                    {tag.tagging.TAG_NAME}
                                                    <div>
                                                        {/* <a href=""> */}
                                                        <div
                                                            className="text-red-600"
                                                            onMouseDown={(e) =>
                                                                e.preventDefault()
                                                            }
                                                            onClick={() => {
                                                                const updatedData =
                                                                    dataById.m_tagging.filter(
                                                                        (
                                                                            data: any
                                                                        ) =>
                                                                            data
                                                                                .tagging
                                                                                .TAG_NAME !==
                                                                            tag
                                                                                .tagging
                                                                                .TAG_NAME
                                                                    );
                                                                setDataById({
                                                                    ...dataById,
                                                                    m_tagging:
                                                                        updatedData,
                                                                });
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
                                                setDataById({
                                                    ...dataById,
                                                    m_tagging: [],
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
                                value={queryTag}
                                onChange={(e) =>
                                    setQueryTag(e.target.value.trimStart())
                                }
                                placeholder="Create Tags"
                                className=""
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !isDisableTagEdit
                                    ) {
                                        setDataById({
                                            ...dataById,
                                            m_tagging: [
                                                ...dataById.m_tagging,
                                                {
                                                    tagging: {
                                                        TAG_ID: "",
                                                        TAG_NAME: queryTag,
                                                    },
                                                },
                                            ],
                                        });
                                        setQueryTag("");
                                        // setMenuOpen(true);
                                    }
                                }}
                            />
                            <button
                                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                                disabled={isDisableTagEdit}
                                onClick={() => {
                                    if (isDisableTagEdit) {
                                        return;
                                    }
                                    setDataById({
                                        ...dataById,
                                        m_tagging: [
                                            ...dataById.m_tagging,
                                            {
                                                tagging: {
                                                    TAG_ID: "",
                                                    TAG_NAME: queryTag,
                                                },
                                            },
                                        ],
                                    });
                                    setQueryTag("");
                                    inputRefTag.current?.focus();
                                    // setMenuOpen(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </>
                }
            />

            {/* modal for structure */}
            <ModalToAction
                show={structureModal.view}
                onClose={() =>
                    setStructureModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Structure"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <StructurePopup
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal for structure */}

            {/* Modal Division */}
            <ModalToAction
                show={divisionModal.view}
                onClose={() =>
                    setDivisionModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Division"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <Division
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal Division */}

            {/* Modal Address Location */}
            <ModalToAction
                show={locationModal.view}
                onClose={() =>
                    setLocationModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Address & Location"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <AddressPopup
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end Modal Address Location */}

            {/* modal for job desc */}
            <ModalToAction
                show={jobdeskModal.view}
                onClose={() =>
                    setJobDeskModal({
                        add: false,
                        edit: false,
                        view: false,
                    })
                }
                title={"Job Desc"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <JobDesk
                            auth={""}
                            idRelation={detailRelation}
                            nameRelation={
                                dataRelationNew.RELATION_ORGANIZATION_NAME
                            }
                        />
                    </>
                }
            />
            {/* end modal for job desc */}

            {/* modal for person */}
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
                title={"Person & User"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={null}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <PersonPopup auth={""} idRelation={detailRelation} />
                    </>
                }
            />
            {/* end modal for person */}

            {/* modal for person */}
            <ModalToAction
                show={modalPIC.view}
                onClose={() =>
                    setModalPIC({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"PIC"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <PIC auth={""} idRelation={detailRelation} />
                    </>
                }
            />
            {/* end modal for person */}

            <div className="bg-white p-4 rounded-md shadow-md mb-3">
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
                        {/* Official Information */}
                        <div className="flex justify-between">
                            <div className="font-semibold text-md">
                                <span className="border-b-2 border-red-600 ">
                                    Relation Information
                                    {/* <div className="chatPlugin float-right mt-2 ml-2"></div> */}
                                </span>
                            </div>
                            <a
                                onClick={(e) =>
                                    handleEditModel(
                                        e,
                                        dataRelationNew.RELATION_ORGANIZATION_ID
                                    )
                                }
                                className="cursor-pointer"
                                title="Edit Relation"
                            >
                                <div className="bg-red-600 p-1 rounded-md text-white">
                                    <PencilSquareIcon className="w-5" />
                                </div>
                            </a>
                        </div>
                        <div className="xs:grid xs:grid-cols-1 xs:gap-2 lg:grid lg:grid-cols-4 lg:gap-4">
                            <div>
                                <div className="font-semibold">
                                    <span>Group</span>
                                </div>
                                {dataRelationNew.group_relation === null ? (
                                    <>
                                        <div className="text-sm text-gray-400">
                                            -
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-sm text-gray-400">
                                            {
                                                dataRelationNew.group_relation
                                                    ?.RELATION_GROUP_NAME
                                            }
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="xs:col-span-2 lg:col-span-1">
                                <div className="font-semibold">
                                    {dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                        "" ||
                                    dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                        null ? (
                                        <span>Website</span>
                                    ) : (
                                        <span>Email</span>
                                    )}
                                </div>
                                {dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                    "" ||
                                dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                    null ? (
                                    dataRelationNew.RELATION_ORGANIZATION_WEBSITE ===
                                        "" ||
                                    dataRelationNew.RELATION_ORGANIZATION_WEBSITE ===
                                        null ? (
                                        <div className="text-sm text-gray-400">
                                            -
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 w-fit italic hover:border-b-2 hover:text-blue-400 hover:border-blue-300">
                                            <span>
                                                <a
                                                    href={
                                                        "https://" +
                                                        dataRelationNew.RELATION_ORGANIZATION_WEBSITE
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {
                                                        dataRelationNew.RELATION_ORGANIZATION_WEBSITE
                                                    }
                                                </a>
                                            </span>
                                        </div>
                                    )
                                ) : dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                      "" ||
                                  dataRelationNew.RELATION_ORGANIZATION_EMAIL ===
                                      null ? (
                                    <div className="text-sm text-gray-400">
                                        -
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        {
                                            dataRelationNew.RELATION_ORGANIZATION_EMAIL
                                        }
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2 ">
                                <div className="font-semibold">
                                    <span>Description</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    <span className="font-normal">
                                        {dataRelationNew.RELATION_ORGANIZATION_DESCRIPTION ===
                                        null
                                            ? "-"
                                            : dataRelationNew.RELATION_ORGANIZATION_DESCRIPTION}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 hidden">
                                <div className="font-semibold">
                                    <span>Address & Location</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    <span className="font-normal">-</span>
                                </div>
                            </div>
                        </div>
                        {/* End Official Information */}

                        {/* Relation Type And */}
                        <div>
                            <div className="text-md font-semibold mt-4 w-fit">
                                <span className="border-b-2 border-red-600 ">
                                    Relation Type
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                <div className="mb-2 relative flex flex-wrap gap-3">
                                    {dataRelationNew.m_relation_type?.map(
                                        (dRelation: any, i: number) => {
                                            return (
                                                // <>
                                                <div
                                                    key={i}
                                                    className="rounded-lg w-fit py-1.5 px-3 bg-red-600 flex items-center gap-2 text-sm"
                                                >
                                                    <span className="text-white">
                                                        {
                                                            dRelation
                                                                .relation_type
                                                                .RELATION_TYPE_NAME
                                                        }
                                                    </span>
                                                </div>
                                                // </>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                            <div></div>
                        </div>
                        {/* END Relation Type And */}

                        {/* bank account relation */}
                        <div className="">
                            <div className="flex justify-between items-center">
                                <div className="text-md font-semibold mt-4 w-fit">
                                    <span className="border-b-2 border-red-600">
                                        Bank Account Relation
                                    </span>
                                </div>
                                <a
                                    onClick={(e) =>
                                        handleEditBankRelation(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_ID
                                        )
                                    }
                                    className="cursor-pointer"
                                    title="Edit Bank Account Relation"
                                >
                                    <div className="bg-red-600 p-1 rounded-md text-white">
                                        <PencilSquareIcon className="w-5" />
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            <div>
                                <div className="text-sm font-semibold">
                                    <span className="cls_can_attach_process">
                                        Bank Name
                                    </span>
                                    {/* <div
                                className="chatPlugin float-right mt-2 ml-2"
                                id="2d8d70c14c03d1b22f7445fa7cea69b41664709c6a0208e21af8c7110d898423"
                            ></div> */}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">
                                    <span className="cls_can_attach_process w-fit">
                                        Account Name
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">
                                    <span className="cls_can_attach_process">
                                        Account Number
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">
                                    <span>NPWP</span>
                                </div>
                            </div>
                        </div>
                        {dataRelationNew.m_bank_relation?.length === 0 ? (
                            <>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            <span>-</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            <span>-</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            <span>-</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            <span>-</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            dataRelationNew.m_bank_relation?.map(
                                (bAR: any, i: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-4 gap-2"
                                            key={i}
                                        >
                                            <div>
                                                <div className="text-sm text-gray-500 ">
                                                    <span className="">
                                                        {
                                                            bAR.r_bank
                                                                ?.BANK_ABBREVIATION
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    <span>
                                                        {bAR.ACCOUNT_NAME}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    <span>
                                                        {bAR.ACCOUNT_NUMBER}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    <span>{bAR.NPWP_NAME}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}

                        {/* end bank account relation */}

                        {dataRelationNew.relation_status_id !== 2 ? null : (
                            <>
                                {/* Corporate Pic For */}
                                <div className="mt-4 flex gap-2">
                                    <div className="text-md font-semibold border-b-2 w-fit border-red-600">
                                        <span>Corporate PIC For</span>
                                    </div>
                                    <div
                                        className="gap-2 text-sm bg-red-600 text-white px-2 flex items-center rounded-md cursor-pointer hover:bg-red-500"
                                        title="Edit Corporate PIC"
                                        onClick={(e) =>
                                            handleClickEditCorporate(
                                                e,
                                                dataRelationNew.RELATION_ORGANIZATION_ID,
                                                dataRelationNew?.t_person
                                                    ?.PERSON_ID
                                            )
                                        }
                                    >
                                        <span>
                                            <PencilSquareIcon className="w-4" />
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <div className="mb-2 relative flex flex-wrap gap-3">
                                            {dataRelationNew?.t_person?.t_p_i_c
                                                ?.filter(
                                                    (items: any) =>
                                                        items.PIC_IS_DELETED ===
                                                        0
                                                )
                                                ?.map(
                                                    (
                                                        dCorporate: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            // <>
                                                            <div
                                                                key={i}
                                                                className="rounded-lg w-fit py-1.5 px-3 bg-red-500 flex items-center gap-2 text-sm text-white"
                                                            >
                                                                <span>
                                                                    {
                                                                        dCorporate
                                                                            ?.t_relation_corporate
                                                                            .RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </span>
                                                            </div>
                                                            // </>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                                {/* End Corporate PIC For */}
                            </>
                        )}
                    </>
                )}
            </div>
            {/* End Top */}

            {isLoading.get_detail ? (
                <>
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
                </>
            ) : (
                <>
                    {dataRelationNew.relation_status_id !== 2 ? (
                        <>
                            {/* Button */}
                            <div className="mt-4 mb-2 xs:grid xs:grid-cols-2 xs:gap-3 lg:grid lg:grid-cols-4 lg:gap-3">
                                <div
                                    className="bg-white p-5 shadow-md rounded-lg hover:cursor-pointer hover:text-red-500"
                                    onClick={(e) =>
                                        handleClickAddressLocation(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>Address & Location</span>
                                    </div>
                                </div>
                                <div
                                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                                    onClick={(e) =>
                                        handleClickPIC(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>PIC</span>
                                    </div>
                                </div>
                                <div
                                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                                    onClick={(e) =>
                                        handleClickDocument(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>Document</span>
                                    </div>
                                </div>
                                <div className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500">
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <div>
                                            <span
                                                className=""
                                                onClick={(e) =>
                                                    handleClickStructure(
                                                        e,
                                                        dataRelationNew.RELATION_ORGANIZATION_NAME
                                                    )
                                                }
                                            >
                                                Structure
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                                    onClick={(e) =>
                                        handleClickDivision(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>Division</span>
                                    </div>
                                </div>

                                <div
                                    className="bg-white p-5 shadow-md rounded-lg hover:cursor-pointer hover:text-red-500"
                                    onClick={(e) =>
                                        handleClickJobDesk(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>Job Desc</span>
                                    </div>
                                </div>
                                <div
                                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500 hidden"
                                    onClick={(e) =>
                                        handleClickPerson(
                                            e,
                                            dataRelationNew.RELATION_ORGANIZATION_NAME
                                        )
                                    }
                                >
                                    <div className="flex justify-center items-center text-sm font-medium">
                                        <span>Person & User</span>
                                    </div>
                                </div>
                            </div>
                            {/* End Button */}
                        </>
                    ) : (
                        <div className="mt-4 mb-10 xs:grid xs:grid-cols-2 xs:gap-3 lg:grid lg:grid-cols-4 lg:gap-3">
                            <div
                                className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                                onClick={(e) =>
                                    handleClickPersonalInfo(
                                        e,
                                        dataRelationNew.RELATION_ORGANIZATION_ID
                                    )
                                }
                            >
                                <div className="flex justify-center items-center text-sm font-medium">
                                    <span>Personal Info</span>
                                </div>
                            </div>
                            <div
                                className="bg-white p-5 shadow-md rounded-lg hover:cursor-pointer hover:text-red-500"
                                onClick={(e) =>
                                    handleClickAddressLocation(
                                        e,
                                        dataRelationNew.RELATION_ORGANIZATION_NAME
                                    )
                                }
                            >
                                <div className="flex justify-center items-center text-sm font-medium">
                                    <span>Address & Location</span>
                                </div>
                            </div>
                            <div
                                className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                                onClick={(e) =>
                                    handleClickDocument(
                                        e,
                                        dataRelationNew.RELATION_ORGANIZATION_NAME
                                    )
                                }
                            >
                                <div className="flex justify-center items-center text-sm font-medium">
                                    <span>Document</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
