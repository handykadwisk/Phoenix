import InputLabel from "@/Components/InputLabel";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextInput from "@/Components/TextInput";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import SelectTailwind from "react-tailwindcss-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/Components/Checkbox";

export default function AddReminder({
    data,
    setData,
    modalReminder,
    setModalReminder,
}: PropsWithChildren<{
    data: any;
    setData: any;
    modalReminder: any;
    setModalReminder: any;
}>) {
    useEffect(() => {
        getDataParticipant();
    }, []);

    const dataNotification = [
        { id: 1, name: "App Notification" },
        { id: 2, name: "Email" },
        { id: 3, name: "WA" },
    ];

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

    const checkCheckedMRelation = (id: number) => {
        if (data.NOTIFICATION_ID === id) {
            return true;
        }
    };

    const checkboxes =
        document.querySelectorAll<HTMLInputElement>(".checkParticipant");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            // Jika checkbox yang diklik dicentang
            if (checkbox.checked) {
                // Matikan semua checkbox lainnya
                checkboxes.forEach((cb) => {
                    if (cb !== checkbox) {
                        cb.checked = false; // Set checkbox lain menjadi tidak tercentang
                    }
                });
            }
        });
    });
    console.log(data);

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
                        NOTIFICATION_ID: 1,
                    });
                }}
                title={"Add Reminder"}
                url={`/addCompany`}
                data={data}
                onSuccess={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div>
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
                                        <div
                                            className="grid grid-cols-1"
                                            key={index}
                                        >
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
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-11">
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
                                                        }}
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    {data.PARTICIPANT
                                                        ?.length !== 1 && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
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
                                    );
                                }
                            )}
                            <div className="mt-1">
                                <a
                                    className="text-sm cursor-pointer text-slate-500"
                                    onClick={(e: any) => addRowBParticipant(e)}
                                >
                                    <span className="hover:underline hover:decoration-from-font">
                                        <i>+ Add Participant</i>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <div>
                                <InputLabel
                                    className="text-lg"
                                    value={"Dates"}
                                    required={true}
                                />
                            </div>
                            <div className="grid grid-cols-9 gap-2">
                                <div className="col-span-3">
                                    <TextInput
                                        type="text"
                                        value={
                                            data.EMPLOYEE_BANK_ACCOUNT_NUMBER
                                        }
                                        className=""
                                        onChange={(e) => {}}
                                        required
                                        placeholder="Times *"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <TextInput
                                        type="text"
                                        value={
                                            data.EMPLOYEE_BANK_ACCOUNT_NUMBER
                                        }
                                        className=""
                                        onChange={(e) => {}}
                                        required
                                        placeholder="How Many Days *"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3 pointer-events-none">
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
                                                value={data.EMPLOYEE_BIRTH_DATE}
                                                onChange={(date: any) =>
                                                    setData(
                                                        "EMPLOYEE_BIRTH_DATE",
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
                                                    )
                                                }
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                className="border-0 rounded-md shadow-md text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600 px-8"
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd - mm - yyyy"
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
                                    className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                                >
                                    {dataNotification.map(
                                        (items: any, i: number) => {
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
                                                            value={items.id}
                                                            // defaultChecked={
                                                            //     data.relation_type_id
                                                            // }
                                                            onChange={(e) => {
                                                                setData({
                                                                    ...data,
                                                                    NOTIFICATION_ID:
                                                                        e.target
                                                                            .value,
                                                                });
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
                                                                {items.name}
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
                    </>
                }
            />
        </>
    );
}
