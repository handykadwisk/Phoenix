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

export default function ModalReminder({
    showReminder,
    closeable = true,
    setShowReminder,
}: PropsWithChildren<{
    showReminder: any;
    closeable?: boolean | any | undefined;
    setShowReminder: any;
}>) {
    useEffect(() => {
        getDataParticipant();
    }, []);
    const close = () => {
        if (closeable) {
            setShowReminder({
                reminder: false,
            });
        }
    };

    // for Reminder
    const [data, setData] = useState<any>({
        START_DATE: "",
        NOTIFICATION_ID: 1,
        PARTICIPANT: [
            {
                PARTICIPANT_ID: null,
            },
        ],
    });

    // for input data participant
    const inputDataParticipant = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.PARTICIPANT];
        changeVal[i][name] = value;
        setData({ ...data, PARTICIPANT: changeVal });
    };

    // for get data participant
    const [optionsParticipant, setOptionsParticipant] = useState<any>([]);
    const getDataParticipant = async () => {
        await axios
            .post(`/getDataParticipant`)
            .then((res) => {
                setOptionsParticipant(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const dataParticipant = optionsParticipant?.map((query: any) => {
        return {
            value: query.PARTICIPANT_NAME + "+" + query.PARTICIPANT_ID,
            label: query.PARTICIPANT_NAME,
        };
    });

    // for add row participant
    const addRowBParticipant = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            PARTICIPANT: [
                ...data.PARTICIPANT,
                {
                    PARTICIPANT_ID: null,
                },
            ],
        });
    };

    // for data notif method
    const dataNotification = [
        { id: 1, name: "App Notification" },
        { id: 2, name: "Email" },
        { id: 3, name: "WA" },
    ];

    // for check default method notif
    const checkCheckedMRelation = (id: number) => {
        if (data.NOTIFICATION_ID === id) {
            return true;
        }
    };

    // for modal add reminder
    const [modalReminder, setModalReminder] = useState<any>({
        modalAdd: false,
    });
    return (
        <>
            <AddReminder
                data={data}
                setData={setData}
                modalReminder={modalReminder}
                setModalReminder={setModalReminder}
            />
            <Transition.Root show={showReminder.reminder} as={Fragment}>
                <Dialog as="div" className="relative z-999" onClose={() => {}}>
                    <div className="fixed inset-0 z-10">
                        <div className="flex min-h-full items-center justify-center">
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

                                <div className="absolute bottom-0 right-0 mr-3 border border-red-500 mb-3 rounded-r-md rounded-l-md bg-white w-[25%] h-[29rem] flex flex-col xs:w-[90%] lg:w-[25%]">
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
                                                    All Reminders
                                                </AccordionTitle>
                                                <AccordionContent>
                                                    <div>All Reminders</div>
                                                </AccordionContent>
                                            </AccordionPanel>
                                        </Accordion>
                                        {/* <div>
                                            <InputLabel
                                                className="text-xs"
                                                value={"Participant"}
                                                required={true}
                                            />
                                            {data?.PARTICIPANT?.map(
                                                (items: any, index: number) => {
                                                    return (
                                                        <div
                                                            className="grid grid-cols-1"
                                                            key={index}
                                                        >
                                                            <div className="text-sm italic">
                                                                <InputLabel
                                                                    className="text-xs"
                                                                    value={
                                                                        "Tier " +
                                                                        `${
                                                                            1 +
                                                                            index
                                                                        }`
                                                                    }
                                                                    required={
                                                                        index ===
                                                                        0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-12">
                                                                <div className="col-span-11 relative">
                                                                    <SelectTailwind
                                                                        classNames={{
                                                                            menuButton:
                                                                                () =>
                                                                                    `flex text-xs text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-red-600 items-center cursor-pointer`,
                                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                            listItem:
                                                                                ({
                                                                                    isSelected,
                                                                                }: any) =>
                                                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                        isSelected
                                                                                            ? `text-white bg-red-600`
                                                                                            : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                                    }`,
                                                                        }}
                                                                        options={
                                                                            dataParticipant
                                                                        }
                                                                        isSearchable={
                                                                            true
                                                                        }
                                                                        isMultiple={
                                                                            true
                                                                        }
                                                                        placeholder={
                                                                            "Select Participant"
                                                                        }
                                                                        isClearable={
                                                                            true
                                                                        }
                                                                        value={
                                                                            items.PARTICIPANT_ID
                                                                        }
                                                                        onChange={(
                                                                            val: any
                                                                        ) => {
                                                                            inputDataParticipant(
                                                                                "PARTICIPANT_ID",
                                                                                val,
                                                                                index
                                                                            );
                                                                        }}
                                                                        primaryColor={
                                                                            "bg-red-500"
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex justify-center items-center">
                                                                    {data
                                                                        .PARTICIPANT
                                                                        ?.length !==
                                                                        1 && (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            stroke="currentColor"
                                                                            className=" h-6 text-red-500 cursor-pointer font-semibold"
                                                                            onClick={() => {
                                                                                const updatedData =
                                                                                    data.PARTICIPANT.filter(
                                                                                        (
                                                                                            data: any,
                                                                                            a: number
                                                                                        ) =>
                                                                                            a !==
                                                                                            index
                                                                                    );
                                                                                setData(
                                                                                    {
                                                                                        ...data,
                                                                                        PARTICIPANT:
                                                                                            updatedData,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >
                                                                            <path
                                                                                fill="#AB7C94"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M6 18 18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                            <div className="mt-1">
                                                <a
                                                    className="text-sm cursor-pointer text-slate-500"
                                                    onClick={(e: any) =>
                                                        addRowBParticipant(e)
                                                    }
                                                >
                                                    <span className="hover:underline hover:decoration-from-font text-xs">
                                                        <i>+ Add Participant</i>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="">
                                            <InputLabel
                                                className="text-xs"
                                                value={"Dates"}
                                                required={true}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={data.TIMES}
                                                        className="ring-1 ring-red-500"
                                                        onChange={(e) => {}}
                                                        required
                                                        placeholder="Times *"
                                                    />
                                                </div>
                                                <div>
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            data.HOW_MANY_DAYS
                                                        }
                                                        className="ring-1 ring-red-500"
                                                        onChange={(e) => {}}
                                                        required
                                                        placeholder="How Many Days *"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 mt-2 relative">
                                                <CalendarDateRangeIcon className="w-5 absolute z-1 pointer-events-none top-2 left-1" />
                                                <DatePicker
                                                    value={
                                                        data.EMPLOYEE_BIRTH_DATE
                                                    }
                                                    onChange={(date: any) =>
                                                        setData({
                                                            ...data,
                                                            START_DATE:
                                                                date.toLocalDateString(
                                                                    "en-CA"
                                                                ),
                                                        })
                                                    }
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    className="border-0 rounded-md shadow-md text-xs h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 ring-1 ring-red-500 px-7"
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText=" dd - mm - yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <InputLabel
                                                className="text-xs"
                                                value={"Reminder Method"}
                                                required={true}
                                            />
                                            <div>
                                                <ul
                                                    role="list"
                                                    className="mt-1 grid grid-cols-3 gap-1"
                                                >
                                                    {dataNotification.map(
                                                        (
                                                            items: any,
                                                            i: number
                                                        ) => {
                                                            return (
                                                                <li
                                                                    key={i}
                                                                    className="col-span-1 flex rounded-md shadow-sm"
                                                                >
                                                                    <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                                        <Checkbox
                                                                            className="checkParticipant"
                                                                            defaultChecked={checkCheckedMRelation(
                                                                                items.id
                                                                            )}
                                                                            value={
                                                                                items.id
                                                                            }
                                                                            // defaultChecked={
                                                                            //     data.relation_type_id
                                                                            // }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setData(
                                                                                    {
                                                                                        ...data,
                                                                                        NOTIFICATION_ID:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                );
                                                                                // handleCheckbox(
                                                                                //     e
                                                                                // );
                                                                                // checkFBIAndAgent();
                                                                                // checkBAA(
                                                                                //     e.target
                                                                                //         .value
                                                                                // );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                                        <div className="flex-1 truncate px-1 py-2 text-xs">
                                                                            <span className="text-gray-900">
                                                                                {
                                                                                    items.name
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
                                        <div className="mt-1">
                                            <InputLabel
                                                className="text-xs"
                                                value="Description"
                                                required={false}
                                            />
                                            <TextArea
                                                className="ring-1 ring-rose-500"
                                                defaultValue={data.DESCRIPTION}
                                                onChange={(e: any) =>
                                                    setData({
                                                        ...data,
                                                        DESCRIPTION:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div> */}
                                    </div>
                                </div>
                                {/* End For Chat */}
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
