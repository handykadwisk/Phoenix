import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import AddReminder from "./AddReminder";

export default function Reminder({ auth }: PageProps) {
    // modal for commpany
    const [modalCompany, setModalCompany] = useState<any>({
        add: false,
        view: false,
    });

    // data Request Add Company
    const [dataCompany, setDataCompany] = useState<any>({
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
    const [isSuccess, setIsSuccess] = useState<string>("");
    const handleSuccessAddCompany = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[0]);
            setDataCompany({
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
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [detailCompany, setDetailCompany] = useState<any>({
        COMPANY_NAME: "",
        COMPANY_ID: "",
    });

    const handleDetailCompany = async (data: any) => {
        setDetailCompany({
            COMPANY_NAME: data.COMPANY_NAME,
            COMPANY_ID: data.COMPANY_ID,
        });

        setModalCompany({
            add: false,
            view: !modalCompany.view,
        });
    };

    // for Reminder
    const [data, setData] = useState<any>({
        NOTIFICATION_ID: 1,
        PARTICIPANT: [
            {
                PARTICIPANT_ID: null,
            },
        ],
    });

    // for modal add reminder
    const [modalReminder, setModalReminder] = useState<any>({
        modalAdd: false,
    });

    return (
        <AuthenticatedLayout user={auth.user} header={"Reminder"}>
            <Head title="Reminder" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Add Reminder */}
            <AddReminder
                data={data}
                setData={setData}
                modalReminder={modalReminder}
                setModalReminder={setModalReminder}
            />
            {/* End Modal Add Reminder */}

            {/* Detail Company */}
            <ModalToAction
                show={modalCompany.view}
                onClose={() =>
                    setModalCompany({
                        add: false,
                        view: false,
                    })
                }
                title={detailCompany.COMPANY_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={<></>}
            />

            {/* End y */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                setModalReminder({
                                    modalAdd: !modalReminder.modalAdd,
                                });
                            }}
                        >
                            {"Add Reminder"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <TextInput
                            type="text"
                            className="mt-2 ring-1 ring-red-600"
                            placeholder="Search Reminder"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer">
                                Search
                            </div>
                            <div className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer">
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={null}
                            url={"getCompany"}
                            doubleClickEvent={handleDetailCompany}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Reminder",
                                    field: "",
                                    flex: 7,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
