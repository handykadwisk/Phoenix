import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { PropsWithChildren } from "react";
// import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
// import Alert from "../Alert";
import {
    ArrowLeftIcon,
    CalendarDateRangeIcon,
    PaperAirplaneIcon,
    UserGroupIcon,
    UserPlusIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import TextInput from "@/Components/TextInput";
import dateFormat from "dateformat";
import { format } from "date-fns";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { faThumbtackSlash } from "@fortawesome/free-solid-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ToastMessage from "@/Components/ToastMessage";
import {
    Accordion,
    AccordionContent,
    AccordionPanel,
    AccordionTitle,
} from "flowbite-react";
import TextArea from "@/Components/TextArea";
import SelectTailwind from "react-tailwindcss-select";
import { Dialog, Transition } from "@headlessui/react";
import InputLabel from "@/Components/InputLabel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/Components/Checkbox";
import AddReminder from "./AddReminder";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailReminder from "./DetailReminder";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { usePage } from "@inertiajs/react";

export default function ModalReminder({
    showReminder,
    closeable = true,
    setShowReminder,
}: PropsWithChildren<{
    showReminder: any;
    closeable?: boolean | any | undefined;
    setShowReminder: any;
}>) {
    const { auth }: any = usePage().props;
    useEffect(() => {
        getTReminder(auth.user.id);
        getTDetailReminder(auth.user.id);
    }, [showReminder.reminder === true]);

    const close = () => {
        if (closeable) {
            setShowReminder({
                reminder: false,
            });
        }
    };

    // for get reminder
    const [dataReminder, setDataReminder] = useState<any>([]);
    const getTReminder = async (idUser: any) => {
        await axios
            .post(`/getTReminder`, { idUser })
            .then((res) => {
                setDataReminder(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for get reminder
    const [dataDetailReminderNew, setDataDetailReminderNew] = useState<any>([]);
    const getTDetailReminder = async (userIdLogin: any) => {
        await axios
            .post(`/getCekDetailReminder`, { userIdLogin })
            .then((res) => {
                setDataDetailReminderNew(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for detail reminder
    const [dataDetailReminder, setDataDetailReminder] = useState<any>({
        REMINDER_TITLE: "",
        REMINDER_TIMES: "",
        REMINDER_DAYS: "",
        REMINDER_START_DATE: "",
        REMINDER_DESKRIPSI: "",
        NOTIFICATION: [],
        PARTICIPANT: [],
        TIER_REMINDER: [],
    });

    // for Reminder
    const [data, setData] = useState<any>({
        REMINDER_TITLE: "",
        REMINDER_TIMES: "",
        REMINDER_DAYS: "",
        REMINDER_START_DATE: "",
        REMINDER_DESKRIPSI: "",
        NOTIFICATION: [
            {
                NOTIFICATION_ID: 1,
            },
        ],
        PARTICIPANT: [
            {
                TIER: "",
                PARTICIPANT_ID: null,
            },
        ],
    });

    // for modal add reminder
    const [modalReminder, setModalReminder] = useState<any>({
        modalAdd: false,
        modalDetail: false,
    });

    const [textTitle, setTextTitle] = useState<any>({
        textTitle: "Detail Reminder",
    });

    const [textButton, setTextButton] = useState<any>({
        textButton: "Edit",
    });

    const [idReminder, setIdReminder] = useState<any>({
        idReminder: "",
    });

    const handleDetailReminder = async (e: FormEvent, idReminder: any) => {
        setModalReminder({
            modalDetail: !modalReminder.modalDetail,
        });
        setIdReminder({
            idReminder: idReminder,
        });
        setTextButton({
            textButton: "Edit",
        });
        setTextTitle({
            textTitle: "Detail Reminder",
        });
    };

    // for edit
    const actionEdit = async (e: FormEvent) => {
        e.preventDefault();
        // alert("aloo");
        setTextTitle({
            textTitle: "Edit Reminder",
        });
        setTextButton({
            textButton: "detail",
        });
    };

    const handleSuccessEdit = (message: string) => {
        setIsSuccessChat("");
        if (message !== "") {
            setIsSuccessChat(message[0]);

            getTReminder(message[2]);

            setTimeout(() => {
                setIsSuccessChat("");
            }, 2000);
        }
    };
    const [isSuccessChat, setIsSuccessChat] = useState<string>("");

    return (
        <>
            <Transition.Root show={showReminder.reminder} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => {}}>
                    <div className="fixed inset-0 z-10">
                        <div className="flex min-h-full items-center justify-center">
                            {isSuccessChat && (
                                <ToastMessage
                                    message={isSuccessChat}
                                    isShow={true}
                                    type={"success"}
                                />
                            )}
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full sm:scale-95"
                                enterTo="translate-x-0 sm:scale-100"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0 sm:scale-100"
                                leaveTo="translate-x-full sm:scale-95"
                            >
                                {/* For Chat */}

                                <Dialog.Panel
                                    className={
                                        "absolute bottom-0 right-0 mr-3 border border-red-500 mb-3 rounded-r-md rounded-l-md bg-white w-[25%] h-[29rem] flex flex-col xs:w-[90%] lg:w-[25%]"
                                    }
                                >
                                    <AddReminder
                                        setIsSuccessChat={setIsSuccessChat}
                                        data={data}
                                        setData={setData}
                                        modalReminder={modalReminder}
                                        setModalReminder={setModalReminder}
                                        getTReminder={getTReminder}
                                        // handleSuccessAddReminder={
                                        //     handleSuccessAddReminder
                                        // }
                                    />

                                    <ModalToAction
                                        show={modalReminder.modalDetail}
                                        onClose={() => {
                                            setModalReminder({
                                                modalAdd: false,
                                                modalDetail: false,
                                            });
                                        }}
                                        buttonEdit={textButton}
                                        actionEdit={actionEdit}
                                        title={textTitle.textTitle}
                                        url={`/editReminder/${dataDetailReminder}`}
                                        data={dataDetailReminder}
                                        onSuccess={handleSuccessEdit}
                                        method={"patch"}
                                        headers={null}
                                        classPanel={
                                            "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                                        }
                                        submitButtonName={
                                            textButton?.textButton === "Edit"
                                                ? ""
                                                : "Submit"
                                        }
                                        body={
                                            <>
                                                <DetailReminder
                                                    dataDetailReminder={
                                                        dataDetailReminder
                                                    }
                                                    setDataDetailReminder={
                                                        setDataDetailReminder
                                                    }
                                                    textButton={textButton}
                                                    idReminder={
                                                        idReminder.idReminder
                                                    }
                                                />
                                            </>
                                        }
                                    />
                                    <div className="">
                                        <div className="bg-red-500 p-3 rounded-tr-sm rounded-tl-sm h-10 flex justify-between items-center text-white">
                                            <div>
                                                <span>Reminder</span>
                                            </div>
                                            <div
                                                className="cursor-pointer"
                                                onClick={close}
                                            >
                                                <span>
                                                    <XMarkIcon className="w-6" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative p-2 overflow-y-auto custom-scrollbar">
                                            <div
                                                className="text-sm bg-red-600 w-fit rounded-md p-2 text-white cursor-pointer hover:bg-red-500 mb-2"
                                                onClick={() => {
                                                    setModalReminder({
                                                        modalAdd:
                                                            !modalReminder.modalAdd,
                                                    });
                                                }}
                                            >
                                                <span>Add Reminder</span>
                                            </div>
                                            <Accordion collapseAll>
                                                <AccordionPanel>
                                                    <AccordionTitle className="text-xs">
                                                        All Your Reminders
                                                    </AccordionTitle>
                                                    <AccordionContent>
                                                        {dataReminder?.length ===
                                                        0 ? (
                                                            <>
                                                                <div className="text-xs text-red-600">
                                                                    <span>
                                                                        Reminder
                                                                        No
                                                                        Existing
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {dataReminder?.map(
                                                                    (
                                                                        itemsReminder: any,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="text-sm cursor-pointer hover:bg-red-600 p-1 rounded-md hover:text-white"
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    handleDetailReminder(
                                                                                        e,
                                                                                        itemsReminder.REMINDER_ID
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        itemsReminder.REMINDER_TITLE
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionPanel>
                                                <AccordionPanel>
                                                    <AccordionTitle className="text-xs">
                                                        Reminder Notification
                                                    </AccordionTitle>
                                                    <AccordionContent>
                                                        {dataDetailReminderNew?.length ===
                                                        0 ? (
                                                            <>
                                                                <div className="text-xs text-red-600">
                                                                    <span>
                                                                        Reminder
                                                                        No
                                                                        Existing
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {dataDetailReminderNew?.map(
                                                                    (
                                                                        itemsReminder: any,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <div>
                                                                                Reminder
                                                                            </div>
                                                                            // <div
                                                                            //     key={
                                                                            //         index
                                                                            //     }
                                                                            //     className="text-sm cursor-pointer hover:bg-red-600 p-1 rounded-md hover:text-white"
                                                                            //     onClick={(
                                                                            //         e
                                                                            //     ) => {
                                                                            //         handleDetailReminder(
                                                                            //             e,
                                                                            //             itemsReminder.REMINDER_ID
                                                                            //         );
                                                                            //     }}
                                                                            // >
                                                                            //     <span>
                                                                            //         {
                                                                            //             itemsReminder.REMINDER_TITLE
                                                                            //         }
                                                                            //     </span>
                                                                            // </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionPanel>
                                            </Accordion>
                                        </div>
                                    </div>
                                    {/* End For Chat */}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
