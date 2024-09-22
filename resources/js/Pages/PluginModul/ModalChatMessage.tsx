import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
// import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
// import Alert from "../Alert";
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import TextInput from "@/Components/TextInput";
import dateFormat from "dateformat";
import { format } from "date-fns";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
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

export default function ModalChatMessage({
    show = false,
    onClose,
    closeable = true,
    typeChatId,
    auth,
    flagPlugin = false,
    setFlagPlugin,
    setShowChatMessage,
    tagIdChat,
    showChatMessage,
}: PropsWithChildren<{
    show?: boolean;
    onClose?: CallableFunction;
    closeable?: boolean | any | undefined;
    typeChatId?: any | undefined;
    auth?: any;
    tagIdChat?: any;
    flagPlugin?: boolean | any | undefined;
    setFlagPlugin?: any;
    setShowChatMessage: any;
    showChatMessage: any;
}>) {
    useEffect(() => {
        getMessageChatByTypeId(typeChatId);
    }, [typeChatId]);
    useEffect(() => {
        getTypeChatByTagId(tagIdChat.TAG_ID);
    }, [tagIdChat]);
    useEffect(() => {
        getChatPin(tagIdChat.TAG_ID);
    }, [tagIdChat]);

    const [isSuccessChat, setIsSuccessChat] = useState<string>("");
    const today = new Date();

    // Format tanggal dengan date-fns
    const formattedDate = format(today, "dd MMMM yyyy");

    // state for data message
    const [detailMessage, setDetailMessage] = useState<any>([]);
    const [detailTypeChat, setDetailTypeChat] = useState<any>([]);
    const [pinChatDetail, setPinChatDetail] = useState<any>([]);

    // Ambil kunci dan urutkan secara terbalik
    const sortedKeys = Object.keys(detailMessage).reverse();

    // Buat objek baru dengan urutan terbalik
    const reversedObj: any = {};
    sortedKeys.forEach((key: any) => {
        reversedObj[key] = detailMessage[key];
    });

    // Get Message Chat From Type Id
    const getMessageChatByTypeId = async (typeChatId: any) => {
        await axios
            .post(`/getMessageChatByTypeId`, { typeChatId })
            .then((res) => {
                setDetailMessage(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Get Type Chat By Id
    const getTypeChatByTagId = async (tagIdChat: any) => {
        await axios
            .post(`/getTypeChatByTagId`, { tagIdChat })
            .then((res) => {
                setDetailTypeChat(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Get Type Chat Pin Detail
    const getChatPin = async (tagIdChat: any) => {
        await axios
            .post(`/getChatPin`, { tagIdChat })
            .then((res) => {
                setPinChatDetail(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const modalRef = useRef(null);
    const close = () => {
        if (closeable) {
            setShowChatMessage({
                chatModal: false,
            });
        }
    };

    const [data, setData] = useState<any>({
        INITIATE_YOUR_CHAT: "",
        CHAT_ID: "",
    });

    const messagesEndRef = useRef<any>(null);

    // Use effect to scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop =
                messagesEndRef.current.scrollHeight;
        }
    }, [detailMessage]);

    const handleSuccessMessage = async (message: string) => {
        if (message !== "") {
            getMessageChatByTypeId(message[0]);
            setData({
                INITIATE_YOUR_CHAT: "",
                CHAT_ID: message[0],
            });

            // const fixedBottom = document.getElementById("messageChat");
            // if (fixedBottom) {
            //     fixedBottom.scrollTop = fixedBottom.scrollHeight;
            // }
        }
    };

    const action = async (e: any) => {
        const url = "/addChatMessage";
        // return false;
        e.preventDefault();
        await axios
            .post(url, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                setIsProcessing(false);
                handleSuccessMessage(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [showContext, setShowContext] = useState<any>({
        visible: false,
    });

    const [activeIndex, setActiveIndex] = useState<any>(null);
    const [chatId, setChatId] = useState<any>("");
    const handleContextMenu = (e: any, idChat: any) => {
        e.preventDefault();
        setChatId(idChat);
        setShowContext({
            ...showContext,
            visible: true,
        });
    };

    const alertPin = async (
        e: FormEvent,
        idChatDetail: any,
        typeChatId: any
    ) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't Pin Message?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
        }).then((result) => {
            if (result.isConfirmed) {
                pinMessage(idChatDetail, typeChatId);
            }
        });
    };

    const pinMessage = async (idChatDetail: string, typeChatId: any) => {
        setIsSuccessChat("");
        await axios
            .post(`/pinMessage`, { idChatDetail, typeChatId })
            .then((res) => {
                setIsSuccessChat(res.data[0]);
                getMessageChatByTypeId(res.data[1]);
                setShowContext({
                    ...showContext,
                    visible: false,
                });

                setTimeout(() => {
                    setIsSuccessChat("");
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const alertPinMessageObject = async (
        e: FormEvent,
        idChatDetail: any,
        typeChatId: any
    ) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't Pin Message?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
        }).then((result) => {
            if (result.isConfirmed) {
                pinMessageObject(idChatDetail, typeChatId);
            }
        });
    };

    const pinMessageObject = async (idChatDetail: string, typeChatId: any) => {
        setIsSuccessChat("");
        await axios
            .post(`/pinMessageObject`, { idChatDetail, typeChatId })
            .then((res) => {
                setIsSuccessChat(res.data[0]);
                getTypeChatByTagId(res.data[1]);
                getChatPin(res.data[1]);
                setShowContext({
                    ...showContext,
                    visible: false,
                });

                setTimeout(() => {
                    setIsSuccessChat("");
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // show text replay
    const [textReply, setTextReply] = useState<any>(false);

    const [showMentions, setShowMentions] = useState<any>(false);
    const [filteredUsers, setFilteredUsers] = useState<any>([]);

    const users = ["Alice", "Bob", "Charlie", "David", "Eva"]; // Contoh daftar pengguna
    // onchange chat
    const onchangeChatText = async (e: any) => {
        if (typeChatId !== "") {
            setData({
                ...data,
                INITIATE_YOUR_CHAT: e.target.value,
                CHAT_ID: typeChatId,
            });
        } else {
            setData({
                ...data,
                INITIATE_YOUR_CHAT: e.target.value,
            });
        }

        // Cek apakah karakter terakhir adalah '@'
        const lastChar = e.target.value;
        const parts = lastChar.split("@");

        if (parts.length > 1) {
            // Jika ada lebih dari satu '@'
            let allValid = true;

            // Periksa setiap bagian setelah '@'
            for (let i = 1; i < parts.length; i++) {
                if (parts[i].trim() === "") {
                    allValid = false; // Jika ada bagian kosong setelah '@'
                    break;
                }
            }

            if (allValid) {
                setShowMentions(false); // Sembunyikan dropdown jika '@' tidak ada
            } else {
                setShowMentions(true); // Tampilkan dropdown mention
            }
        } else {
            setShowMentions(false); // Sembunyikan dropdown jika '@' tidak ada
        }

        // Filter pengguna yang sesuai dengan input setelah '@'
        const lastWord = e.target.value.split(" ").pop(); // Ambil kata terakhir setelah '@'
        if (lastWord.startsWith("@")) {
            const searchQuery = lastWord.slice(1).toLowerCase();
            const filtered = users.filter((user: any) =>
                user.toLowerCase().startsWith(searchQuery)
            );
            setFilteredUsers(filtered);
        }
    };

    // Event handler untuk memilih mention dari dropdown
    const handleMentionClick = (e: FormEvent, usersParticipant: any) => {
        e.preventDefault();
        const words = data?.INITIATE_YOUR_CHAT.split(" ");
        words[words.length - 1] = "@" + usersParticipant; // Ganti kata terakhir dengan mention yang dipilih
        setData({
            ...data,
            INITIATE_YOUR_CHAT: words.join(" ") + " ", // Tambahkan spasi setelah mention
        });
        document.getElementById("textInput")?.focus();
        setShowMentions(false); // Sembunyikan dropdown
    };

    return (
        <>
            <Transition.Root show={showChatMessage.chatModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-999"
                    onClose={close}
                    initialFocus={modalRef}
                >
                    <div className="fixed inset-0 z-10">
                        <div className="flex min-h-full items-center justify-center">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full sm:scale-95"
                                enterTo="translate-x-0 sm:scale-100"
                                leave="transition ease-in-out duration-400 transform"
                                leaveFrom="translate-x-0 sm:scale-100"
                                leaveTo="translate-x-full sm:scale-95"
                            >
                                {/* For Chat */}

                                <div className="absolute bottom-0 right-0 mr-6 border border-red-500 mb-3 rounded-r-md rounded-l-md bg-white w-[25%] h-[29rem] flex flex-col xs:w-[90%] lg:w-[25%]">
                                    <div className="bg-red-500 p-3 rounded-tr-sm rounded-tl-sm h-10 flex justify-between items-center text-white">
                                        {isSuccessChat && (
                                            <ToastMessage
                                                message={isSuccessChat}
                                                isShow={true}
                                                type={"success"}
                                            />
                                        )}
                                        {flagPlugin === false ? (
                                            showContext.visible !== true ? (
                                                <span
                                                    className="hover:cursor-pointer"
                                                    onClick={() => {
                                                        setFlagPlugin(true);
                                                        setData({
                                                            ...data,
                                                            INITIATE_YOUR_CHAT:
                                                                "",
                                                        });
                                                    }}
                                                >
                                                    <ArrowLeftIcon className="w-6" />
                                                </span>
                                            ) : (
                                                <>
                                                    <span
                                                        onClick={(e: any) => {
                                                            e.preventDefault();
                                                            setShowContext({
                                                                ...showContext,
                                                                visible: false,
                                                            });
                                                            setChatId("");
                                                        }}
                                                        className="hover:cursor-pointer"
                                                    >
                                                        <XMarkIcon className="w-6" />
                                                    </span>
                                                </>
                                            )
                                        ) : null}
                                        {flagPlugin === false ? (
                                            showContext.visible !== true ? (
                                                <span>Chat</span>
                                            ) : (
                                                <>
                                                    <div className="flex gap-2">
                                                        <span
                                                            className="cursor-pointer"
                                                            title="Pin Message"
                                                            onClick={(e: any) =>
                                                                alertPin(
                                                                    e,
                                                                    chatId,
                                                                    data.CHAT_ID
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faThumbtack
                                                                }
                                                            />
                                                        </span>
                                                        <span
                                                            className="cursor-pointer"
                                                            title="Reply Message"
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                e.preventDefault;
                                                                setTextReply(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faReply}
                                                            />
                                                        </span>
                                                    </div>
                                                </>
                                            )
                                        ) : showContext.visible !== true ? (
                                            <span>List Chat</span>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    <span
                                                        className="cursor-pointer"
                                                        title="Pin Message"
                                                        onClick={(e: any) =>
                                                            alertPinMessageObject(
                                                                e,
                                                                chatId,
                                                                data.CHAT_ID
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faThumbtack}
                                                        />
                                                    </span>
                                                    {/* <span
                                                        className="cursor-pointer"
                                                        title="Reply Message"
                                                        onClick={(e: any) => {
                                                            e.preventDefault;
                                                            setTextReply(true);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faReply}
                                                        />
                                                    </span> */}
                                                </div>
                                            </>
                                        )}
                                        {showContext.visible !== true ? (
                                            <span
                                                onClick={close}
                                                className="hover:cursor-pointer"
                                            >
                                                <XMarkIcon className="w-6" />
                                            </span>
                                        ) : (
                                            <span
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                    setShowContext({
                                                        ...showContext,
                                                        visible: false,
                                                    });
                                                    setChatId("");
                                                }}
                                                className="hover:cursor-pointer"
                                            >
                                                <XMarkIcon className="w-6" />
                                            </span>
                                        )}
                                    </div>
                                    {flagPlugin === false ? (
                                        <>
                                            {/* <div className="flex flex-col h-auto"> */}
                                            <div
                                                className="messageChat chat-height overflow-y-auto custom-scrollbar flex-grow"
                                                id="messageChat"
                                                ref={messagesEndRef}
                                            >
                                                {Object.keys(
                                                    detailMessage
                                                )?.map(
                                                    (
                                                        dMessage: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <div
                                                                key={dMessage}
                                                                className=""
                                                            >
                                                                {/* TANGGAL CHAT */}
                                                                <div className="text-center text-xs text-gray-400 mt-2 mb-1">
                                                                    {formattedDate ===
                                                                    dateFormat(
                                                                        dMessage,
                                                                        "dd mmmm yyyy"
                                                                    )
                                                                        ? "Today"
                                                                        : dateFormat(
                                                                              dMessage,
                                                                              "dd mmmm yyyy"
                                                                          )}
                                                                </div>
                                                                {/* END TANGGAL CHAT */}
                                                                {reversedObj[
                                                                    dMessage
                                                                ]?.map(
                                                                    (
                                                                        items: any,
                                                                        a: number
                                                                    ) => {
                                                                        return (
                                                                            // CHAT BALON
                                                                            <div
                                                                                className="ml-4 mr-4"
                                                                                key={
                                                                                    a
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        auth
                                                                                            .user
                                                                                            .id ===
                                                                                        items.CREATED_CHAT_DETAIL_BY
                                                                                            ? "mb-1 text-right"
                                                                                            : "mb-2"
                                                                                    }
                                                                                >
                                                                                    <p
                                                                                        className={
                                                                                            auth
                                                                                                .user
                                                                                                .id ===
                                                                                            items.CREATED_CHAT_DETAIL_BY
                                                                                                ? "bg-blue-500 text-white rounded-lg py-2 px-2 inline-block text-xs w-fit "
                                                                                                : "bg-gray-200 text-gray-700 rounded-lg py-2 px-2 inline-block text-xs w-fit"
                                                                                        }
                                                                                        // onClick={(
                                                                                        //     e: any
                                                                                        // ) =>
                                                                                        //     handleContextMenu(
                                                                                        //         e,
                                                                                        //         items.CHAT_DETAIL_ID
                                                                                        //     )
                                                                                        // }
                                                                                    >
                                                                                        {
                                                                                            items.CHAT_DETAIL_TEXT
                                                                                        }
                                                                                    </p>
                                                                                    <div
                                                                                        className={
                                                                                            auth
                                                                                                .user
                                                                                                .id ===
                                                                                            items.CREATED_CHAT_DETAIL_BY
                                                                                                ? "flex gap-1 justify-end"
                                                                                                : "flex gap-1 justify-start"
                                                                                        }
                                                                                    >
                                                                                        <span className="text-[10px] rotate-45">
                                                                                            {items?.pin_chat.find(
                                                                                                (
                                                                                                    f: any
                                                                                                ) =>
                                                                                                    f.CREATED_PIN_CHAT_BY ===
                                                                                                    auth
                                                                                                        .user
                                                                                                        .id
                                                                                            ) ? (
                                                                                                <>
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={
                                                                                                            faThumbtack
                                                                                                        }
                                                                                                    />
                                                                                                </>
                                                                                            ) : null}
                                                                                        </span>
                                                                                        <p className="text-[10px]">
                                                                                            {items
                                                                                                ?.t_user
                                                                                                .name +
                                                                                                " - " +
                                                                                                format(
                                                                                                    items.CREATED_CHAT_DETAIL_DATE,
                                                                                                    "HH:mm"
                                                                                                )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            // END CHAT BALON
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* INPUT CHAT MESSAGE */}
                                            <div className="">
                                                <form onSubmit={action}>
                                                    <hr />
                                                    {showMentions && (
                                                        <div className="m-2">
                                                            {filteredUsers?.map(
                                                                (
                                                                    dataParticipant: any,
                                                                    a: number
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                a
                                                                            }
                                                                            onClick={(
                                                                                e: any
                                                                            ) =>
                                                                                handleMentionClick(
                                                                                    e,
                                                                                    dataParticipant
                                                                                )
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    dataParticipant
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                    {textReply && (
                                                        <>
                                                            <div className="m-2 border border-red-500 rounded-md py-1 px-2 relative">
                                                                <div className="flex justify-between">
                                                                    <div className="text-xs font-semibold">
                                                                        <span>
                                                                            Admin
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span>
                                                                            <XMarkIcon
                                                                                className="w-5 cursor-pointer"
                                                                                onClick={(
                                                                                    e: any
                                                                                ) => {
                                                                                    e.preventDefault;
                                                                                    setTextReply(
                                                                                        false
                                                                                    );
                                                                                    setShowContext(
                                                                                        {
                                                                                            ...showContext,
                                                                                            visible:
                                                                                                false,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs message">
                                                                    <p className="">
                                                                        {"nama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkew".substr(
                                                                            0,
                                                                            90
                                                                        ) +
                                                                            ("nama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkewnama saya haris subhan maulana okwokwokwokwokwowkokokwokwo okweokwoekwoekwe owkeowkeowkeow kwokeo wkew"
                                                                                .length >
                                                                            5
                                                                                ? "..."
                                                                                : "")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="m-2 flex items-center gap-1">
                                                        <TextArea
                                                            id="textInput"
                                                            type="text"
                                                            value={
                                                                data.INITIATE_YOUR_CHAT
                                                            }
                                                            className="w-full ring-1 ring-red-500 h-10"
                                                            onChange={(
                                                                e: any
                                                            ) => {
                                                                onchangeChatText(
                                                                    e
                                                                );
                                                            }}
                                                            onInput={(
                                                                e: any
                                                            ) => {
                                                                e.target.style.height =
                                                                    "40px"; // Reset tinggi setiap kali input berubah
                                                                e.target.style.height =
                                                                    e.target
                                                                        .scrollHeight +
                                                                    "px"; // Atur tinggi sesuai dengan scrollHeight
                                                            }}
                                                            // onChange={(e) => permissionObject(e)}
                                                            placeholder="Your Chat"
                                                        />
                                                        <PrimaryButton
                                                            className="inline-flex w-full sm:ml-3 sm:w-auto"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            <span>
                                                                <PaperAirplaneIcon className="w-6" />
                                                            </span>
                                                        </PrimaryButton>
                                                    </div>
                                                </form>
                                            </div>
                                            {/* </div> */}

                                            {/* END INPUT CHAT MESSAGE */}
                                        </>
                                    ) : (
                                        <>
                                            {/* LIST CHAT */}
                                            {/* Global Chat */}

                                            <div className="m-1 flex-grow overflow-y-auto custom-scrollbar">
                                                <Accordion collapseAll>
                                                    <AccordionPanel>
                                                        <AccordionTitle className="text-xs">
                                                            All Chat
                                                        </AccordionTitle>
                                                        <AccordionContent>
                                                            <div className="">
                                                                {detailTypeChat?.map(
                                                                    (
                                                                        dTypeChat: any,
                                                                        i: number
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={
                                                                                    showContext.visible ===
                                                                                        true &&
                                                                                    activeIndex ===
                                                                                        i
                                                                                        ? "hover:bg-red-600 bg-red-600 cursor-pointer rounded-md hover:text-white text-sm p-1 text-white mb-2"
                                                                                        : "hover:bg-red-600 cursor-pointer rounded-md hover:text-white text-sm p-1 mb-2"
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className="flex justify-between items-center"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        if (
                                                                                            showContext.visible !==
                                                                                            true
                                                                                        ) {
                                                                                            getMessageChatByTypeId(
                                                                                                dTypeChat.CHAT_ID
                                                                                            );
                                                                                            setFlagPlugin(
                                                                                                false
                                                                                            );
                                                                                            setData(
                                                                                                {
                                                                                                    ...data,
                                                                                                    CHAT_ID:
                                                                                                        dTypeChat.CHAT_ID,
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    onContextMenu={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        handleContextMenu(
                                                                                            e,
                                                                                            dTypeChat.CHAT_ID
                                                                                        );
                                                                                        setActiveIndex(
                                                                                            i
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div>
                                                                                        <div className="">
                                                                                            <span>
                                                                                                {
                                                                                                    dTypeChat.CHAT_TITLE
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="text-[10px]">
                                                                                            <span>
                                                                                                {dTypeChat
                                                                                                    ?.t_user
                                                                                                    .name +
                                                                                                    " - " +
                                                                                                    format(
                                                                                                        dTypeChat.CREATED_CHAT_DATE,
                                                                                                        "dd-MM-yyyy"
                                                                                                    )}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex">
                                                                                        <span className="text-[15px] rotate-45">
                                                                                            {/* <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faThumbtack
                                                                                                }
                                                                                            /> */}
                                                                                            {dTypeChat?.CREATED_PIN_CHAT_BY ===
                                                                                            auth
                                                                                                .user
                                                                                                .id ? (
                                                                                                <>
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={
                                                                                                            faThumbtack
                                                                                                        }
                                                                                                    />
                                                                                                </>
                                                                                            ) : null}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionPanel>
                                                    <AccordionPanel>
                                                        <AccordionTitle className="text-xs">
                                                            Pinned By You
                                                        </AccordionTitle>
                                                        <AccordionContent>
                                                            <div className="">
                                                                {pinChatDetail?.map(
                                                                    (
                                                                        dTypeChat: any,
                                                                        i: number
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={
                                                                                    showContext.visible ===
                                                                                        true &&
                                                                                    activeIndex ===
                                                                                        i
                                                                                        ? "hover:bg-red-600 bg-red-600 cursor-pointer rounded-md hover:text-white text-sm p-1 text-white mb-2"
                                                                                        : "hover:bg-red-600 cursor-pointer rounded-md hover:text-white text-sm p-1 mb-2"
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className="flex justify-between items-center"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        if (
                                                                                            showContext.visible !==
                                                                                            true
                                                                                        ) {
                                                                                            getMessageChatByTypeId(
                                                                                                dTypeChat.CHAT_ID
                                                                                            );
                                                                                            setFlagPlugin(
                                                                                                false
                                                                                            );
                                                                                            setData(
                                                                                                {
                                                                                                    ...data,
                                                                                                    CHAT_ID:
                                                                                                        dTypeChat.CHAT_ID,
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <div>
                                                                                        <div className="">
                                                                                            <span>
                                                                                                {
                                                                                                    dTypeChat.CHAT_TITLE
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="text-[10px]">
                                                                                            <span>
                                                                                                {dTypeChat
                                                                                                    ?.t_user
                                                                                                    .name +
                                                                                                    " - " +
                                                                                                    format(
                                                                                                        dTypeChat.CREATED_CHAT_DATE,
                                                                                                        "dd-MM-yyyy"
                                                                                                    )}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex">
                                                                                        <span className="text-[15px] rotate-45">
                                                                                            {/* <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faThumbtack
                                                                                                }
                                                                                            /> */}
                                                                                            {dTypeChat?.CREATED_PIN_CHAT_BY ===
                                                                                            auth
                                                                                                .user
                                                                                                .id ? (
                                                                                                <>
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={
                                                                                                            faThumbtack
                                                                                                        }
                                                                                                    />
                                                                                                </>
                                                                                            ) : null}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionPanel>
                                                    <AccordionPanel>
                                                        <AccordionTitle className="text-xs">
                                                            Mentioned To You
                                                        </AccordionTitle>
                                                        <AccordionContent>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                The main
                                                                difference is
                                                                that the core
                                                                components from
                                                                Flowbite are
                                                                open source
                                                                under the MIT
                                                                license, whereas
                                                                Tailwind UI is a
                                                                paid product.
                                                                Another
                                                                difference is
                                                                that Flowbite
                                                                relies on
                                                                smaller and
                                                                standalone
                                                                components,
                                                                whereas Tailwind
                                                                UI offers
                                                                sections of
                                                                pages.
                                                            </p>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                However, we
                                                                actually
                                                                recommend using
                                                                both Flowbite,
                                                                Flowbite Pro,
                                                                and even
                                                                Tailwind UI as
                                                                there is no
                                                                technical reason
                                                                stopping you
                                                                from using the
                                                                best of two
                                                                worlds.
                                                            </p>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                Learn more about
                                                                these
                                                                technologies:
                                                            </p>
                                                            <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                                                                <li>
                                                                    <a
                                                                        href="https://flowbite.com/pro/"
                                                                        className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                                    >
                                                                        Flowbite
                                                                        Pro
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        href="https://tailwindui.com/"
                                                                        rel="nofollow"
                                                                        className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                                    >
                                                                        Tailwind
                                                                        UI
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </AccordionContent>
                                                    </AccordionPanel>
                                                    <AccordionPanel>
                                                        <AccordionTitle className="text-xs">
                                                            Inactive Chat
                                                        </AccordionTitle>
                                                        <AccordionContent>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                The main
                                                                difference is
                                                                that the core
                                                                components from
                                                                Flowbite are
                                                                open source
                                                                under the MIT
                                                                license, whereas
                                                                Tailwind UI is a
                                                                paid product.
                                                                Another
                                                                difference is
                                                                that Flowbite
                                                                relies on
                                                                smaller and
                                                                standalone
                                                                components,
                                                                whereas Tailwind
                                                                UI offers
                                                                sections of
                                                                pages.
                                                            </p>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                However, we
                                                                actually
                                                                recommend using
                                                                both Flowbite,
                                                                Flowbite Pro,
                                                                and even
                                                                Tailwind UI as
                                                                there is no
                                                                technical reason
                                                                stopping you
                                                                from using the
                                                                best of two
                                                                worlds.
                                                            </p>
                                                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                                Learn more about
                                                                these
                                                                technologies:
                                                            </p>
                                                            <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                                                                <li>
                                                                    <a
                                                                        href="https://flowbite.com/pro/"
                                                                        className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                                    >
                                                                        Flowbite
                                                                        Pro
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        href="https://tailwindui.com/"
                                                                        rel="nofollow"
                                                                        className="text-cyan-600 hover:underline dark:text-cyan-500"
                                                                    >
                                                                        Tailwind
                                                                        UI
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </AccordionContent>
                                                    </AccordionPanel>
                                                </Accordion>
                                            </div>

                                            {/* <div>
                                                <div className="m-2 bg-red-600 w-fit p-2 rounded-md text-white cursor-pointer hover:bg-red-300 text-xs">
                                                    <span>Add Chat</span>
                                                </div>
                                                <div className="p-2">
                                                    <fieldset className="pb-2 pt-2 rounded-lg border-slate-100 border-2 p2">
                                                        <legend className="ml-2 px-3 text-sm">
                                                            List Chat
                                                        </legend>
                                                        <div className="">
                                                            {detailTypeChat?.map(
                                                                (
                                                                    dTypeChat: any,
                                                                    i: number
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <div
                                                                                className="hover:bg-red-600 cursor-pointer m-2 p-2 rounded-md shadow-md mb-2 hover:text-white text-sm"
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    getMessageChatByTypeId(
                                                                                        dTypeChat.CHAT_ID
                                                                                    );
                                                                                    setFlagPlugin(
                                                                                        false
                                                                                    );
                                                                                    setData(
                                                                                        {
                                                                                            ...data,
                                                                                            CHAT_ID:
                                                                                                dTypeChat.CHAT_ID,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="flex">
                                                                                    <span>
                                                                                        {
                                                                                            dTypeChat.CHAT_TITLE
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex justify-end text-[10px]">
                                                                                    <span>
                                                                                        {dTypeChat
                                                                                            ?.t_user
                                                                                            .name +
                                                                                            " - " +
                                                                                            format(
                                                                                                dTypeChat.CREATED_CHAT_DATE,
                                                                                                "dd-MM-yyyy"
                                                                                            )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div> */}
                                            {/* END LIST CHAT */}
                                        </>
                                    )}
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
