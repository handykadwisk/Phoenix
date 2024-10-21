import InputLabel from "@/Components/InputLabel";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextInput from "@/Components/TextInput";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import SelectTailwind from "react-tailwindcss-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";

export default function AddReminder({
    data,
    setData,
    modalReminder,
    setModalReminder,
    setIsSuccessChat,
}: PropsWithChildren<{
    data: any;
    setData: any;
    modalReminder: any;
    setModalReminder: any;
    setIsSuccessChat?: any;
}>) {
    useEffect(() => {
        getDataParticipant();
        getReminderTier();
        getMethodNotification();
    }, []);

    // for tier Participant
    const [reminderTier, setReminderTier] = useState<any>([]);
    const getReminderTier = async () => {
        await axios
            .post(`/getReminderTier`)
            .then((res) => {
                setReminderTier(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // for get notification method
    const [methodNotification, setMethodNotification] = useState<any>([]);
    const getMethodNotification = async () => {
        await axios
            .post(`/getMethodNotification`)
            .then((res) => {
                setMethodNotification(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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

    const addRowBParticipant = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            PARTICIPANT: [
                ...data.PARTICIPANT,
                {
                    TIER: "",
                    PARTICIPANT_ID: null,
                },
            ],
        });
    };

    const inputDataParticipant = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.PARTICIPANT];
        changeVal[i][name] = value;
        setData({ ...data, PARTICIPANT: changeVal });
    };

    const inputDataTier = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...data.PARTICIPANT];
        changeVal[i][name] = value;
        setData({ ...data, PARTICIPANT: changeVal });
    };

    const checkCheckedMRelation = (id: number) => {
        if (data.NOTIFICATION[0].NOTIFICATION_ID === id) {
            return true;
        }
    };

    const handleCheckbox = (e: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setData({
                ...data,
                NOTIFICATION: [
                    ...data.NOTIFICATION,
                    {
                        NOTIFICATION_ID: value,
                    },
                ],
            });
        } else {
            const updatedData = data.NOTIFICATION.filter(
                (data: any) => data.NOTIFICATION_ID !== value
            );
            setData({ ...data, NOTIFICATION: updatedData });
        }
    };

    const handleSuccessAddReminder = async (message: any) => {
        setIsSuccessChat("");
        if (message !== "") {
            setIsSuccessChat(message[0]);
            setData({
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

            setTimeout(() => {
                setIsSuccessChat("");
            }, 2000);
        }
    };

    // const checkboxes =
    //     document.querySelectorAll<HTMLInputElement>(".checkParticipant");

    // checkboxes.forEach((checkbox) => {
    //     checkbox.addEventListener("change", () => {
    //         // Jika checkbox yang diklik dicentang
    //         if (checkbox.checked) {
    //             // Matikan semua checkbox lainnya
    //             checkboxes.forEach((cb) => {
    //                 if (cb !== checkbox) {
    //                     cb.checked = false; // Set checkbox lain menjadi tidak tercentang
    //                 }
    //             });
    //         }
    //     });
    // });

    return (
        <>
            <ModalToAdd
                buttonAddOns={""}
                show={modalReminder.modalAdd}
                onClose={() => {
                    setModalReminder({
                        modalAdd: false,
                    });
                    setData({
                        ...data,
                        NOTIFICATION: [
                            {
                                NOTIFICATION_ID: 1,
                            },
                        ],
                    });
                }}
                title={"Add Reminder"}
                url={`/addReminder`}
                data={data}
                onSuccess={handleSuccessAddReminder}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div>
                            <div>
                                <InputLabel
                                    className=""
                                    value={"Title Reminder"}
                                    required={true}
                                />
                                <TextInput
                                    type="text"
                                    value={data.REMINDER_TITLE}
                                    className=""
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            REMINDER_TITLE: e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Title Reminder *"
                                />
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>
                                <InputLabel
                                    className=""
                                    value={"Participant"}
                                    required={true}
                                />
                            </div>
                            {data?.PARTICIPANT?.map(
                                (items: any, index: number) => {
                                    return (
                                        <div className="" key={index}>
                                            <div className="text-sm italic">
                                                <InputLabel
                                                    className=""
                                                    value={
                                                        "Tier " + `${1 + index}`
                                                    }
                                                    required={
                                                        index === 0
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </div>
                                            <div className="grid-cols-1 grid">
                                                <div className="relative flex">
                                                    <SelectTailwind
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
                                                        options={
                                                            dataParticipant
                                                        }
                                                        isSearchable={true}
                                                        isMultiple={true}
                                                        placeholder={
                                                            "Select Participant"
                                                        }
                                                        isClearable={true}
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
                                                            inputDataTier(
                                                                "TIER",
                                                                "Tier " +
                                                                    `${
                                                                        1 +
                                                                        index
                                                                    }`,
                                                                index
                                                            );
                                                        }}
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                    <div className="flex items-center">
                                                        {data.PARTICIPANT
                                                            ?.length !== 1 && (
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
                                                                    setData({
                                                                        ...data,
                                                                        PARTICIPANT:
                                                                            updatedData,
                                                                    });
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
                                        </div>
                                    );
                                }
                            )}
                            {data.PARTICIPANT.length ===
                            reminderTier.length ? null : (
                                <div className="mt-1">
                                    <a
                                        className="text-sm cursor-pointer text-slate-500"
                                        onClick={(e: any) =>
                                            addRowBParticipant(e)
                                        }
                                    >
                                        <span className="hover:underline hover:decoration-from-font">
                                            <i>+ Add Tier</i>
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="mt-1">
                            <div>
                                <InputLabel
                                    className="text-lg"
                                    value={"Set Reminder"}
                                    required={true}
                                />
                            </div>
                            <div className="grid grid-cols-9 gap-2">
                                <div className="col-span-3">
                                    <TextInput
                                        type="text"
                                        value={data.REMINDER_TIMES}
                                        className=""
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                REMINDER_TIMES: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="How Many Times *"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <TextInput
                                        type="text"
                                        value={data.REMINDER_DAYS}
                                        className=""
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                REMINDER_DAYS: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="How Many Days Apart *"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 z-1 start-0 flex items-center px-3 pointer-events-none">
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
                                        <div className="grid grid-cols-1">
                                            <DatePicker
                                                value={data.REMINDER_START_DATE}
                                                onChange={(date: any) => {
                                                    setData({
                                                        ...data,
                                                        REMINDER_START_DATE:
                                                            date.toLocaleDateString(
                                                                "en-CA"
                                                            ),
                                                    });
                                                }}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                className="border-0 rounded-md shadow-md text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="Start Form"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1">
                            <div>
                                <InputLabel
                                    className="text-lg"
                                    value={"Reminder Method"}
                                    required={true}
                                />
                            </div>
                            <div>
                                <ul
                                    role="list"
                                    className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3"
                                >
                                    {methodNotification.map(
                                        (items: any, i: number) => {
                                            return (
                                                <li
                                                    key={i}
                                                    className="col-span-1 flex rounded-md shadow-sm"
                                                >
                                                    <div className="flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white bg-white">
                                                        <Checkbox
                                                            defaultChecked={checkCheckedMRelation(
                                                                items.METHOD_NOTIFICATION_ID
                                                            )}
                                                            value={
                                                                items.METHOD_NOTIFICATION_ID
                                                            }
                                                            onChange={(e) => {
                                                                handleCheckbox(
                                                                    e
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                        <div className="flex-1 truncate px-1 py-2 text-xs">
                                                            <span className="text-gray-900">
                                                                {
                                                                    items.METHOD_NOTIFICATION_NAME
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
                        <div className="mb-2">
                            <div className="mt-1">
                                <InputLabel
                                    className="text-lg"
                                    value={"Description"}
                                    required={false}
                                />
                            </div>
                            <TextArea
                                className=""
                                defaultValue={data.REMINDER_DESKRIPSI}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        REMINDER_DESKRIPSI: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
        </>
    );
}
