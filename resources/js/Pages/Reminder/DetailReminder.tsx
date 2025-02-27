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
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToastMessage from "@/Components/ToastMessage";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import Checkbox from "@/Components/Checkbox";

export default function DetailReminder({
    textButton,
    idReminder,
    dataDetailReminder,
    setDataDetailReminder,
}: PropsWithChildren<{
    textButton?: any;
    idReminder?: any;
    dataDetailReminder: any;
    setDataDetailReminder: any;
}>) {
    useEffect(() => {
        getDetailReminder(idReminder);
        getDataParticipant();
        getMethodNotification();
    }, []);

    const [resultReminder, setResultReminder] = useState<any>([]);

    // const [dataDetailReminder, setDataDetailReminder] = useState<any>({
    //     REMINDER_TITLE: "",
    //     REMINDER_TIMES: "",
    //     REMINDER_DAYS: "",
    //     REMINDER_START_DATE: "",
    //     REMINDER_DESKRIPSI: "",
    //     NOTIFICATION: [],
    //     PARTICIPANT: [],
    //     TIER_REMINDER: [],
    // });
    // getDetail Reminder
    const getDetailReminder = async (idReminder: any) => {
        await axios
            .post(`/getDetailReminder`, { idReminder })
            .then((res) => {
                // setResultReminder(res.data);
                setDataDetailReminder({
                    REMINDER_ID: res.data.REMINDER_ID,
                    REMINDER_TITLE: res.data.REMINDER_TITLE,
                    REMINDER_TIMES: res.data.REMINDER_TIMES,
                    REMINDER_DAYS: res.data.REMINDER_DAYS,
                    REMINDER_START_DATE: res.data.REMINDER_START_DATE,
                    REMINDER_DESKRIPSI: res.data.REMINDER_DESKRIPSI,
                    NOTIFICATION: res.data.m_method_reminder,
                    PARTICIPANT: res.data.m_reminder_participant,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const groupedData = dataDetailReminder?.PARTICIPANT.reduce(
        (acc: any, currentItem: any) => {
            const category = currentItem.REMINDER_TIER_ID;

            // Jika kategori belum ada di accumulator, buat array baru
            if (!acc[category]) {
                acc[category] = [];
            }

            // Tambahkan item ke dalam array kategori yang sesuai
            acc[category].push(currentItem);

            return acc;
        },
        {}
    );

    const [optionsParticipant, setOptionsParticipant] = useState<any>([]);
    const getDataParticipant = async () => {
        await axios
            .post(`/getParticipantAll`)
            .then((res) => {
                setOptionsParticipant(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const dataParticipant = optionsParticipant?.map((query: any) => {
        return {
            value: query.PARTICIPANT_ID,
            label: query.PARTICIPANT_NAME,
        };
    });

    // Ambil kunci dan urutkan secara terbalik
    const sortedKeys = Object.keys(groupedData).reverse();

    // Buat objek baru dengan urutan terbalik
    const reversedObj: any = {};
    sortedKeys.forEach((key: any) => {
        reversedObj[key] = groupedData[key];
    });

    const getNameParticipant = (dB: any, i: number) => {
        // console.log("logRevers", reversedObj[dB]);
        // console.log("logdatapartcioant", dataParticipant);

        const filteredArray = dataParticipant.filter((items: any) =>
            reversedObj[dB].some(
                (itemsDb: any) => itemsDb.USER_ID === items.value
            )
        );

        const bankFor = filteredArray?.map((query: any) => {
            return {
                value: query.value,
                label: query.label,
            };
        });
        return bankFor;
    };

    // console.log("dataParticipant", dataDetailReminder.PARTICIPANT);
    const inputDataParticipant = (
        name: string,
        value: string | undefined | any,
        i: number
    ) => {
        const idTier = i + 1;

        // get data yang sesuai reminder idnya
        const data = dataDetailReminder?.PARTICIPANT?.filter(
            (data: any) => data.REMINDER_TIER_ID === idTier
        );
        console.log("data", data);

        // get data yang mau di hilangkan
        const filteredArray = data?.filter(
            (items: any) =>
                !value?.some(
                    (itemsDb: any) =>
                        items.USER_ID === null ||
                        itemsDb.value === items.USER_ID
                )
        );
        console.log("filteredArray", filteredArray);

        if (filteredArray.length !== 0) {
            if (data.length === 1) {
                console.log("ada");
                const updatedUsers = dataDetailReminder.PARTICIPANT.map(
                    (items: any) =>
                        items.USER_ID === filteredArray[0]["USER_ID"]
                            ? {
                                  ...items,
                                  USER_ID: null,
                              }
                            : items
                );
                setDataDetailReminder({
                    ...dataDetailReminder,
                    PARTICIPANT: updatedUsers,
                });
            } else {
                // hasil filter data sesuai data yang hilang
                const resultFilter = dataDetailReminder?.PARTICIPANT?.filter(
                    (items: any) =>
                        !filteredArray?.some(
                            (itemsDb: any) => itemsDb.USER_ID === items.USER_ID
                        )
                );

                setDataDetailReminder({
                    ...dataDetailReminder,
                    PARTICIPANT: resultFilter,
                });
            }
        } else {
            // get filter data yang di tambah
            const filteredArray = value?.filter(
                (items: any) =>
                    !data?.some(
                        (itemsDb: any) => itemsDb.USER_ID === items.value
                    )
            );

            setDataDetailReminder({
                ...dataDetailReminder,
                PARTICIPANT: [
                    ...dataDetailReminder.PARTICIPANT,
                    {
                        REMINDER_TIER_ID: idTier,
                        USER_ID: filteredArray[0].value,
                    },
                ],
            });
        }
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

    const checkValueMethodNotification = (id: number, idr: number) => {
        if (
            dataDetailReminder.NOTIFICATION.find(
                (f: any) =>
                    f.METHOD_NOTIFICATION_ID === id && f.REMINDER_ID === idr
            )
        ) {
            return true;
        }
    };

    const handleCheckboxEdit = (e: any, idReminder: any) => {
        const { value, checked } = e.target;

        if (checked) {
            setDataDetailReminder({
                ...dataDetailReminder,
                NOTIFICATION: [
                    ...dataDetailReminder.NOTIFICATION,
                    {
                        METHOD_NOTIFICATION_ID: parseInt(value),
                        REMINDER_ID: idReminder,
                    },
                ],
            });
        } else {
            const updatedData = dataDetailReminder.NOTIFICATION.filter(
                (data: any) => data.METHOD_NOTIFICATION_ID !== parseInt(value)
            );
            setDataDetailReminder({
                ...dataDetailReminder,
                NOTIFICATION: updatedData,
            });
        }
    };

    const addRowBParticipant = (e: FormEvent) => {
        const tierIdReminder = Object.keys(groupedData)?.length;
        e.preventDefault();
        setDataDetailReminder({
            ...dataDetailReminder,
            PARTICIPANT: [
                ...dataDetailReminder.PARTICIPANT,
                {
                    REMINDER_TIER_ID: tierIdReminder + 1,
                    USER_ID: null,
                },
            ],
        });
    };

    return (
        <>
            <div className="">
                <div>
                    <InputLabel
                        className=""
                        value={"Title Reminder"}
                        required={
                            textButton.textButton === "Edit" ? false : true
                        }
                    />
                    <TextInput
                        type="text"
                        value={dataDetailReminder.REMINDER_TITLE}
                        className={
                            textButton.textButton === "Edit"
                                ? "bg-gray-300 text-black"
                                : ""
                        }
                        onChange={(e) => {
                            setDataDetailReminder({
                                ...dataDetailReminder,
                                REMINDER_TITLE: e.target.value,
                            });
                        }}
                        disabled={
                            textButton.textButton === "Edit" ? true : false
                        }
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
                        required={
                            textButton.textButton === "Edit" ? false : true
                        }
                    />
                </div>
                {Object.keys(groupedData)?.map((items: any, index: number) => {
                    return (
                        <div className="" key={index}>
                            <div className="text-sm italic">
                                <InputLabel
                                    className=""
                                    value={"Tier " + `${1 + index}`}
                                    required={index === 0 ? true : false}
                                />
                            </div>
                            <div className="grid-cols-1 grid">
                                <div className="relative flex">
                                    <SelectTailwind
                                        classNames={{
                                            menuButton: () =>
                                                `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                                    textButton.textButton !==
                                                    "Edit"
                                                        ? `bg-white`
                                                        : `bg-gray-300`
                                                }`,
                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                    isSelected
                                                        ? `text-white bg-red-600`
                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                }`,
                                        }}
                                        isDisabled={
                                            textButton.textButton === "Edit"
                                                ? true
                                                : false
                                        }
                                        options={dataParticipant}
                                        isSearchable={true}
                                        isMultiple={true}
                                        placeholder={"Select Participant"}
                                        isClearable={false}
                                        // value={{
                                        //     label: getLabelParticipant(items),
                                        //     value: getValueParticipant(items),
                                        // }}
                                        value={getNameParticipant(items, index)}
                                        onChange={(val: any) => {
                                            inputDataParticipant(
                                                "USER_ID",
                                                val,
                                                index
                                            );
                                            // inputDataTier(
                                            //     "TIER",
                                            //     "Tier " + `${1 + index}`,
                                            //     index
                                            // );
                                        }}
                                        primaryColor={"bg-red-500"}
                                    />
                                    <div className="flex items-center">
                                        {Object.keys(groupedData)?.length !==
                                            1 && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className=" h-6 text-red-500 cursor-pointer font-semibold"
                                                onClick={() => {
                                                    if (
                                                        textButton.textButton !==
                                                        "Edit"
                                                    ) {
                                                        const updatedData =
                                                            dataDetailReminder.PARTICIPANT.filter(
                                                                (
                                                                    data: any,
                                                                    a: number
                                                                ) =>
                                                                    data.REMINDER_TIER_ID !==
                                                                    index + 1
                                                            );
                                                        if (index === 0) {
                                                            const updatedUsers =
                                                                updatedData.map(
                                                                    (
                                                                        items: any
                                                                    ) =>
                                                                        items.REMINDER_TIER_ID ===
                                                                        2
                                                                            ? {
                                                                                  ...items,
                                                                                  REMINDER_TIER_ID: 1,
                                                                              }
                                                                            : {
                                                                                  ...items,
                                                                                  REMINDER_TIER_ID: 2,
                                                                              }
                                                                );
                                                            setDataDetailReminder(
                                                                {
                                                                    ...dataDetailReminder,
                                                                    PARTICIPANT:
                                                                        updatedUsers,
                                                                }
                                                            );
                                                        } else if (
                                                            index === 1
                                                        ) {
                                                            const updatedUsers =
                                                                updatedData.map(
                                                                    (
                                                                        items: any
                                                                    ) =>
                                                                        items.REMINDER_TIER_ID ===
                                                                        3
                                                                            ? {
                                                                                  ...items,
                                                                                  REMINDER_TIER_ID: 2,
                                                                              }
                                                                            : {
                                                                                  ...items,
                                                                                  REMINDER_TIER_ID: 1,
                                                                              }
                                                                );
                                                            setDataDetailReminder(
                                                                {
                                                                    ...dataDetailReminder,
                                                                    PARTICIPANT:
                                                                        updatedUsers,
                                                                }
                                                            );
                                                        } else {
                                                            setDataDetailReminder(
                                                                {
                                                                    ...dataDetailReminder,
                                                                    PARTICIPANT:
                                                                        updatedData,
                                                                }
                                                            );
                                                        }
                                                    } else {
                                                        null;
                                                    }
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
                })}
                {Object.keys(groupedData)?.length === 3 ? null : (
                    <div className="mt-1">
                        <a
                            className="text-sm cursor-pointer text-slate-500"
                            onClick={(e: any) => addRowBParticipant(e)}
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
                        required={
                            textButton.textButton === "Edit" ? false : true
                        }
                    />
                </div>
                <div className="grid grid-cols-9 gap-2">
                    <div className="col-span-3">
                        <TextInput
                            type="text"
                            value={dataDetailReminder.REMINDER_TIMES}
                            className={
                                textButton.textButton === "Edit"
                                    ? "bg-gray-300 text-black"
                                    : ""
                            }
                            onChange={(e) => {
                                setDataDetailReminder({
                                    ...dataDetailReminder,
                                    REMINDER_TIMES: e.target.value,
                                });
                            }}
                            disabled={
                                textButton.textButton === "Edit" ? true : false
                            }
                            required
                            placeholder="How Many Times *"
                        />
                    </div>
                    <div className="col-span-3">
                        <TextInput
                            type="text"
                            value={dataDetailReminder.REMINDER_DAYS}
                            className={
                                textButton.textButton === "Edit"
                                    ? "bg-gray-300 text-black"
                                    : ""
                            }
                            onChange={(e) => {
                                setDataDetailReminder({
                                    ...dataDetailReminder,
                                    REMINDER_DAYS: e.target.value,
                                });
                            }}
                            disabled={
                                textButton.textButton === "Edit" ? true : false
                            }
                            placeholder="How Many Days Apart *"
                        />
                    </div>
                    <div className="col-span-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 z-1 start-0 flex items-center px-3 pointer-events-none">
                                <svg
                                    className={
                                        textButton.textButton === "Edit"
                                            ? "w-3 h-3 text-black"
                                            : "w-3 h-3 text-gray-500 dark:text-gray-400"
                                    }
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
                                    value={dateFormat(
                                        dataDetailReminder.REMINDER_START_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    onChange={(date: any) => {
                                        setDataDetailReminder({
                                            ...dataDetailReminder,
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
                                    className={
                                        textButton.textButton === "Edit"
                                            ? "bg-gray-300 border-0 rounded-md shadow-md text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8 text-black"
                                            : "border-0 rounded-md shadow-md text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                    }
                                    // onChange={(e) => {
                                    //     setData({
                                    //         ...data,
                                    //         REMINDER_TITLE: e.target.value,
                                    //     });
                                    // }}
                                    disabled={
                                        textButton.textButton === "Edit"
                                            ? true
                                            : false
                                    }
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
                        required={
                            textButton.textButton === "Edit" ? false : true
                        }
                    />
                </div>
                <div>
                    <ul
                        role="list"
                        className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3"
                    >
                        {methodNotification.map((items: any, i: number) => {
                            return (
                                <li
                                    key={i}
                                    className="col-span-1 flex rounded-md shadow-sm"
                                >
                                    <div
                                        className={
                                            textButton.textButton !== "Edit"
                                                ? "flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium  text-white bg-white"
                                                : "flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium  bg-gray-300 text-black"
                                        }
                                    >
                                        <Checkbox
                                            defaultChecked={checkValueMethodNotification(
                                                items.METHOD_NOTIFICATION_ID,
                                                dataDetailReminder.REMINDER_ID
                                            )}
                                            value={items.METHOD_NOTIFICATION_ID}
                                            onChange={(e) => {
                                                handleCheckboxEdit(
                                                    e,
                                                    dataDetailReminder.REMINDER_ID
                                                );
                                            }}
                                            disabled={
                                                textButton.textButton === "Edit"
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            textButton.textButton !== "Edit"
                                                ? "flex flex-1 items-center justify-between truncate rounded-r-md bg-white"
                                                : "flex flex-1 items-center justify-between truncate rounded-r-md bg-gray-300"
                                        }
                                    >
                                        <div className="flex-1 truncate px-1 py-2 text-xs">
                                            <span className="text-gray-900">
                                                {items.METHOD_NOTIFICATION_NAME}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
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
                    className={
                        textButton.textButton === "Edit"
                            ? "bg-gray-300 text-black"
                            : ""
                    }
                    onChange={(e: any) => {
                        setDataDetailReminder({
                            ...dataDetailReminder,
                            REMINDER_DESKRIPSI: e.target.value,
                        });
                    }}
                    disabled={textButton.textButton === "Edit" ? true : false}
                    defaultValue={dataDetailReminder.REMINDER_DESKRIPSI}
                    // onChange={(e: any) =>
                    //     setData({
                    //         ...data,
                    //         REMINDER_DESKRIPSI: e.target.value,
                    //     })
                    // }
                />
            </div>
        </>
    );
}
