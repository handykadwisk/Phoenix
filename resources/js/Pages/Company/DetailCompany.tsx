import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToastMessage from "@/Components/ToastMessage";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Employee from "./Employee/Employee";
import Structure from "./Structure/Structure";
import Division from "../Division/Division";
import DivisionCompany from "../DivisionCompany/DivisionCompany";
import AddressCompany from "../AddressCompany/AddressCompany";
import JobCompany from "../JobCompany/JobCompany";
import PhoenixComponent from "@/Utility/PhoenixComponent";

export default function DetailCompany({
    idCompany,
    setIsSuccess,
    isSuccess,
    setDetailCompanyNew,
}: PropsWithChildren<{
    idCompany: any;
    setIsSuccess: any | string | null;
    isSuccess: any | string | null;
    setDetailCompanyNew: any;
}>) {
    // const { value, setValue } = useMyContext();
    // load otomatis detail relation
    useEffect(() => {
        getDetailCompany(idCompany);
    }, [idCompany]);

    // state for detail company
    const [detailCompany, setDetailCompany] = useState<any>([]);
    // state edit company
    const [editCompany, setEditCompany] = useState<any>({
        COMPANY_NAME: "",
        COMPANY_ABBREVIATION: "",
        COMPANY_AKA: "",
        COMPANY_EMAIL: "",
        COMPANY_WEBSITE: "",
        COMPANY_DESCRIPTION: "",
        COMPANY_SIGNATURE_NAME: "",
        COMPANY_SIGNATURE_TITLE: "",
        COMPANY_BANK_ACCOUNT_NUMBER: "",
        COMPANY_BANK_ACCOUNT_NAME: "",
    });

    // get Detail Company
    const getDetailCompany = async (idCompany: string) => {
        await axios
            .post(`/getCompanyDetail`, { idCompany })
            .then((res) => {
                setDetailCompany(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // modal edit company
    const [editModalCompany, setEditModalCompany] = useState<any>({
        edit: false,
    });

    const handleClickEditCompany = async (e: FormEvent, companyId: string) => {
        e.preventDefault();
        setEditCompany(detailCompany);
        setEditModalCompany({
            edit: !editModalCompany.edit,
        });
    };
    const handleSuccessEditCompany = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            getDetailCompany(message[0]);
            setDetailCompanyNew({
                COMPANY_NAME: message[1],
                COMPANY_ID: message[0],
            });
            setIsSuccess(message[2]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    // modal for employee
    const [modalDetailEmployee, setModalDetailEmployee] = useState<any>({
        view: false,
    });

    // modal for structure
    const [modalDetailStructure, setModalDetailStructure] = useState<any>({
        view: false,
    });

    // handle employee
    const handleClickEmployee = async (e: FormEvent, idCompany: number) => {
        e.preventDefault();
        setModalDetailEmployee({
            view: !modalDetailEmployee.view,
        });
    };

    // handle Structure
    const handleClickStructure = async (
        e: FormEvent,
        idCompany: number,
        nameCompany: string
    ) => {
        e.preventDefault();
        setNameCompany({
            COMPANY_NAME: nameCompany,
        });
        setModalDetailStructure({
            view: !modalDetailStructure.view,
        });
    };

    const [nameCompany, setNameCompany] = useState<any>({
        COMPANY_NAME: "",
    });

    // Division Modal
    const [divisionModal, setDivisionModal] = useState({
        add: false,
        edit: false,
        view: false,
    });

    // OnClick Division
    const handleClickDivision = async (
        e: FormEvent,
        idCompany: number,
        nameCompany: string
    ) => {
        e.preventDefault();
        setNameCompany({
            COMPANY_NAME: nameCompany,
        });
        setDivisionModal({
            add: false,
            edit: false,
            view: !divisionModal.view,
        });
    };
    // End Division Click

    // location modal
    const [locationModal, setLocationModal] = useState({
        add: false,
        edit: false,
        view: false,
    });
    // OnClick Address Location
    const handleClickAddressLocation = async (
        e: FormEvent,
        idCompany: number,
        nameCompany: string
    ) => {
        e.preventDefault();
        setNameCompany({
            COMPANY_NAME: nameCompany,
        });
        setLocationModal({
            add: false,
            edit: false,
            view: !locationModal.view,
        });
    };
    // End Address Location Click

    // job des modal
    const [jobDeskModal, setJobDeskModal] = useState({
        add: false,
        edit: false,
        view: false,
    });
    // OnClick Address Location
    const handleClickJobDesk = async (
        e: FormEvent,
        idCompany: number,
        nameCompany: string
    ) => {
        e.preventDefault();
        setNameCompany({
            COMPANY_NAME: nameCompany,
        });

        setJobDeskModal({
            add: false,
            edit: false,
            view: !jobDeskModal.view,
        });
    };
    // End Address Location Click
    return (
        <>
            {/* <PhoenixComponent otherId={idCompany} setIsSuccess={setIsSuccess} /> */}

            {/* <div className="cls">Relation Information</div> */}
            {/* modal for job desc */}
            <ModalToAction
                show={jobDeskModal.view}
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
                        <JobCompany
                            auth={""}
                            idCompany={idCompany}
                            nameCompany={nameCompany.COMPANY_NAME}
                        />
                    </>
                }
            />
            {/* end modal for job desc */}

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
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <AddressCompany
                            auth={""}
                            idCompany={idCompany}
                            nameCompany={nameCompany.COMPANY_NAME}
                        />
                    </>
                }
            />
            {/* end Modal Address Location */}

            {/* Modal Edit Company */}
            <ModalToAdd
                buttonAddOns={""}
                show={editModalCompany.edit}
                onClose={() =>
                    setEditModalCompany({
                        edit: false,
                    })
                }
                title={"Edit Company"}
                url={`/editCompany`}
                data={editCompany}
                onSuccess={handleSuccessEditCompany}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div className="h-[100%] mb-2">
                            <div className="">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Company Name"}
                                    />
                                    <div className="ml-[7.5rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={editCompany.COMPANY_NAME}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_NAME: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Abbreviation"}
                                    />
                                    <div className="ml-[5.8rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={editCompany.COMPANY_ABBREVIATION}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_ABBREVIATION:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Abbreviation"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"AKA"}
                                    />
                                    <div className="ml-[1.9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={editCompany.COMPANY_AKA}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_AKA: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="AKA"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="">
                                    <InputLabel className="" value={"Email"} />
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_EMAIL === null
                                                ? ""
                                                : editCompany.COMPANY_EMAIL
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_EMAIL: e.target.value,
                                            });
                                        }}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Website"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_WEBSITE === null
                                                ? ""
                                                : editCompany.COMPANY_WEBSITE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_WEBSITE: e.target.value,
                                            });
                                        }}
                                        placeholder="www.example.com"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Signature Name"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_SIGNATURE_NAME ===
                                            null
                                                ? ""
                                                : editCompany.COMPANY_SIGNATURE_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_SIGNATURE_NAME:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Signature Name
"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Signature Position"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_SIGNATURE_TITLE ===
                                            null
                                                ? ""
                                                : editCompany.COMPANY_SIGNATURE_TITLE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_SIGNATURE_TITLE:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Signature Position"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Account Number"}
                                    />
                                    <div className="ml-[7.8rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_BANK_ACCOUNT_NUMBER
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_BANK_ACCOUNT_NUMBER:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Account Number"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Account Name"}
                                    />
                                    <div className="ml-[6.9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            editCompany.COMPANY_BANK_ACCOUNT_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setEditCompany({
                                                ...editCompany,
                                                COMPANY_BANK_ACCOUNT_NAME:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Account Name"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    htmlFor="COMPANY_DESCRIPTION"
                                    value="Company Description"
                                />
                                <TextArea
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    defaultValue={
                                        editCompany.COMPANY_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setEditCompany({
                                            ...editCompany,
                                            COMPANY_DESCRIPTION: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Edit Company */}

            {/* Modal Detail Employee */}
            <ModalToAction
                show={modalDetailEmployee.view}
                onClose={() =>
                    setModalDetailEmployee({
                        view: false,
                    })
                }
                title={"Employee"}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <Employee
                            isSuccess={isSuccess}
                            idCompany={idCompany}
                            setIsSuccess={setIsSuccess}
                        />
                    </>
                }
            />
            {/* End Modal Detail Employee */}

            {/* Modal Detail Structure */}
            <ModalToAction
                show={modalDetailStructure.view}
                onClose={() =>
                    setModalDetailStructure({
                        view: false,
                    })
                }
                title={"Structure"}
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
                        <Structure
                            isSuccess={isSuccess}
                            idCompany={idCompany}
                            setIsSuccess={setIsSuccess}
                            nameCompany={nameCompany.COMPANY_NAME}
                        />
                    </>
                }
            />
            {/* End Modal Detail Structure */}

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
                        <DivisionCompany
                            // isSuccess={isSuccess}
                            idCompany={idCompany}
                            // setIsSuccess={setIsSuccess}
                            nameCompany={nameCompany.COMPANY_NAME}
                        />
                    </>
                }
            />
            {/* end Modal Division */}

            {/* Call Component Chat Plugin */}
            {/* <PhoenixComponent otherId={idCompany} setIsSuccess={setIsSuccess} /> */}
            {/* End Call Component Chat Plugin */}
            <div className="bg-white rounded-md shadow-md mb-2 p-4">
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="text-md font-semibold w-fit">
                            <span className="border-b-2 border-red-600 ">
                                Company Information
                            </span>
                        </div>
                    </div>
                    <div
                        className="text-red-600 cursor-pointer"
                        title="Edit Company"
                        onClick={(e) => {
                            handleClickEditCompany(e, detailCompany.COMPANY_ID);
                        }}
                    >
                        <span>
                            <PencilSquareIcon className="w-6" />
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                        <div className="font-semibold cls_">
                            <span>Website</span>
                        </div>
                        <div className="text-gray-500">
                            <span>-</span>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="font-semibold ">
                            <span>Email</span>
                        </div>
                        <div className="text-gray-500">
                            <span>-</span>
                        </div>
                    </div>
                    <div className="col-span-2 hidden">
                        <div className="font-semibold">
                            <span>Address & Location</span>
                        </div>
                        <div className="text-gray-500">
                            <span>-</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button Company */}
            <div className="grid grid-cols-4 gap-3 mb-2">
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickEmployee(e, detailCompany.COMPANY_ID)
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Employee</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickStructure(
                            e,
                            detailCompany.COMPANY_ID,
                            detailCompany.COMPANY_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Structure</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickDivision(
                            e,
                            detailCompany.COMPANY_ID,
                            detailCompany.COMPANY_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Division</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickAddressLocation(
                            e,
                            detailCompany.COMPANY_ID,
                            detailCompany.COMPANY_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Address Location Company</span>
                    </div>
                </div>
                <div
                    className="bg-white p-5 shadow-md rounded-lg cursor-pointer hover:text-red-500"
                    onClick={(e) =>
                        handleClickJobDesk(
                            e,
                            detailCompany.COMPANY_ID,
                            detailCompany.COMPANY_NAME
                        )
                    }
                >
                    <div className="flex justify-center items-center text-sm font-medium">
                        <span>Job Desc</span>
                    </div>
                </div>
            </div>
            <div className="h-[100%] mb-40"></div>
            {/* End Button Company */}
        </>
    );
}
