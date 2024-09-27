import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
// import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
// import Alert from "../Alert";
import {
    ArrowLeftIcon,
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
        // getDataParticipant();
        getTypeChatByTagId(tagIdChat.TAG_ID);
    }, [tagIdChat]);
    useEffect(() => {
        getChatPin(tagIdChat.TAG_ID, auth.user.id);
    }, [tagIdChat]);

    const [isSuccessChat, setIsSuccessChat] = useState<string>("");
    const today = new Date();
    const [dataParticipant, setDataParticipant] = useState<any>([]);

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

    // get Data Participant dan Division
    const getDataParticipantById = async (chatId: any) => {
        await axios
            .post(`/getDataParticipantById`, { chatId })
            .then((res) => {
                setDataParticipant(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Get Type Chat Pin Detail
    const getChatPin = async (tagIdChat: any, idAuthUser: any) => {
        await axios
            .post(`/getChatPin`, { tagIdChat, idAuthUser })
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
        PARTICIPANT: [],
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
        }
    };

    const handleSuccessAddParticipant = async (message: string) => {
        setIsSuccessChat("");
        if (message !== "") {
            setIsSuccessChat(message[0]);
            getDataParticipantById(message[1]);

            setShowParticipant(false);
            setShowAddParticipant("showParticipant");
            setDataAddParticipant({
                ...dataAddParticipant,
                PARTICIPANT: null,
            });

            setTimeout(() => {
                setIsSuccessChat("");
            }, 5000);
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
    const [unpin, setUnpin] = useState<any>("");
    const [chatId, setChatId] = useState<any>("");
    const handleContextMenu = (e: any, idChat: any, flag: string) => {
        e.preventDefault();
        setChatId(idChat);
        setUnpin(flag);
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
        typeChatId: any,
        flag: any
    ) => {
        var textAlert = "";
        if (flag === "pin") {
            var textAlert = "You won't Pin Message?";
        } else {
            var textAlert = "You won't Upin Message?";
        }

        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: textAlert,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
        }).then((result) => {
            if (result.isConfirmed) {
                if (flag === "pin") {
                    pinMessageObject(idChatDetail, typeChatId);
                } else {
                    unPinMessageObject(idChatDetail, typeChatId);
                }
            }
        });
    };

    const unPinMessageObject = async (
        idChatDetail: string,
        typeChatId: any
    ) => {
        setIsSuccessChat("");
        await axios
            .post(`/unPinMessageObject`, { idChatDetail, typeChatId })
            .then((res) => {
                setIsSuccessChat(res.data[0]);
                getTypeChatByTagId(res.data[1]);
                getChatPin(res.data[1], res.data[2]);
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

    const pinMessageObject = async (idChatDetail: string, typeChatId: any) => {
        setIsSuccessChat("");
        await axios
            .post(`/pinMessageObject`, { idChatDetail, typeChatId })
            .then((res) => {
                setIsSuccessChat(res.data[0]);
                getTypeChatByTagId(res.data[1]);
                getChatPin(res.data[1], res.data[2]);
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
        if (e.target.value === "") {
            setData({
                ...data,
                PARTICIPANT: [],
            });
        }
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
                // setShowMentions(true); // Sembunyikan dropdown jika '@' tidak ada
            } else {
                setShowMentions(true); // Tampilkan dropdown mention
            }
        } else {
            // getDataParticipantById();
            setShowMentions(false); // Sembunyikan dropdown jika '@' tidak ada
        }

        // Filter pengguna yang sesuai dengan input setelah '@'
        const lastWord = e.target.value.split(" ").pop(); // Ambil kata terakhir setelah '@'
        if (lastWord.startsWith("@")) {
            const searchQuery = lastWord.slice(1).toLowerCase();
            const filtered = dataParticipant.filter((userP: any) =>
                userP.CHAT_PARTICIPANT_NAME.toLowerCase().startsWith(
                    searchQuery
                )
            );
            console.log("data", filtered);
            setFilteredUsers(filtered);
        }
    };

    // Event handler untuk memilih mention dari dropdown
    const handleMentionClick = (
        e: FormEvent,
        usersParticipant: any,
        idParticipant: any
    ) => {
        e.preventDefault();
        console.log("idPar:", idParticipant);

        const words = data?.INITIATE_YOUR_CHAT.split(" ");
        words[words.length - 1] = "@" + usersParticipant; // Ganti kata terakhir dengan mention yang dipilih
        setData({
            ...data,
            INITIATE_YOUR_CHAT: words.join(" ") + " ",
            PARTICIPANT: [
                ...data.PARTICIPANT,
                {
                    id: usersParticipant,
                },
            ], // Tambahkan spasi setelah mention
        });

        // const updatedData = dataParticipant.filter(
        //     (data: any) => data.PARTICIPANT_NAME !== usersParticipant
        // );
        // console.log("up", updatedData);
        // setDataParticipant(updatedData);
        document.getElementById("textInput")?.focus();
        setShowMentions(false); // Sembunyikan dropdown
    };

    const [showAddParticipant, setShowAddParticipant] =
        useState<any>("showParticipant");
    const [showParticipant, setShowParticipant] = useState<boolean>(false);
    const [dataAddParticipant, setDataAddParticipant] = useState<any>({
        PARTICIPANT: null,
        CHAT_ID: "",
    });
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

    const commonElements = optionsParticipant.filter((item1: any) => {
        return dataParticipant.some(
            (item2: any) =>
                item1.PARTICIPANT_NAME !== item2.CHAT_PARTICIPANT_NAME
        );
    });

    const selectParticipant = optionsParticipant
        ?.filter(
            (m: any) =>
                !dataParticipant.some(
                    (item2: any) =>
                        m.PARTICIPANT_NAME === item2.CHAT_PARTICIPANT_NAME
                )
        )
        .map((query: any) => {
            return {
                value: query.PARTICIPANT_NAME + "+" + query.PARTICIPANT_ID,
                label: query.PARTICIPANT_NAME,
            };
        });
    console.log("asda", commonElements);
    // handle click add participant
    const handleClickShowParticipant = async (e: FormEvent) => {
        e.preventDefault();
        if (showParticipant === false) {
            setShowParticipant(true);
            setShowAddParticipant("showParticipant");
        } else {
            setShowParticipant(false);
            setShowAddParticipant("showParticipant");
            setDataAddParticipant({
                ...dataAddParticipant,
                PARTICIPANT: null,
            });
        }
        getDataParticipant();
    };

    const handleClickAddParticipant = async (e: FormEvent) => {
        e.preventDefault();
        if (showAddParticipant === "showParticipant") {
            setShowAddParticipant("AddParticipant");
        } else {
            setShowAddParticipant("showParticipant");
            setDataAddParticipant({
                ...dataAddParticipant,
                PARTICIPANT: null,
            });
        }
        getDataParticipant();
    };

    const actionAddParticipant = async (e: any) => {
        const url = "/addParticipant";
        // return false;
        e.preventDefault();
        await axios
            .post(url, dataAddParticipant, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                setIsProcessing(false);
                handleSuccessAddParticipant(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(showAddParticipant);

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
                                                <div className="flex">
                                                    <span
                                                        className="hover:cursor-pointer"
                                                        onClick={(e: any) => {
                                                            e.preventDefault();
                                                            setFlagPlugin(true);
                                                            setData({
                                                                ...data,
                                                                INITIATE_YOUR_CHAT:
                                                                    "",
                                                                PARTICIPANT: [],
                                                            });
                                                            setShowParticipant(
                                                                false
                                                            );
                                                            setShowAddParticipant(
                                                                "showParticipant"
                                                            );
                                                            setDataAddParticipant(
                                                                {
                                                                    ...dataAddParticipant,
                                                                    PARTICIPANT:
                                                                        null,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        <ArrowLeftIcon className="w-6" />
                                                    </span>
                                                    <span
                                                        className="cursor-pointer"
                                                        title="Participant"
                                                        onClick={(e: any) => {
                                                            handleClickShowParticipant(
                                                                e
                                                            );
                                                        }}
                                                    >
                                                        <UserGroupIcon className="w-6" />
                                                    </span>
                                                </div>
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
                                                {unpin === "pin" ? (
                                                    <div className="flex gap-2">
                                                        <span
                                                            className="cursor-pointer"
                                                            title="Pin Message"
                                                            onClick={(e: any) =>
                                                                alertPinMessageObject(
                                                                    e,
                                                                    chatId,
                                                                    data.CHAT_ID,
                                                                    unpin
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faThumbtack
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    // unpin
                                                    <div className="flex gap-2">
                                                        <span
                                                            className="cursor-pointer"
                                                            title="Pin Message"
                                                            onClick={(e: any) =>
                                                                alertPinMessageObject(
                                                                    e,
                                                                    chatId,
                                                                    data.CHAT_ID,
                                                                    unpin
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faThumbtackSlash
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                )}
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
                                                {showParticipant && (
                                                    <>
                                                        <div className="absolute p-2 bg-white w-full shadow-md rounded-br-md rounded-bl-md">
                                                            <div
                                                                onClick={(
                                                                    e: any
                                                                ) => {
                                                                    handleClickAddParticipant(
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                <span>
                                                                    <UserPlusIcon
                                                                        className="w-5 text-red-600 cursor-pointer"
                                                                        title="Add Participant"
                                                                    />
                                                                </span>
                                                            </div>
                                                            {showAddParticipant ===
                                                            "showParticipant" ? (
                                                                <div className="text-xs mt-2">
                                                                    {dataParticipant?.map(
                                                                        (
                                                                            dParticipant: any,
                                                                            i: number
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="mb-2 hover:bg-red-600 hover:text-white hover:p-2 hover:rounded-md"
                                                                                >
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="cursor-pointer">
                                                                                            {
                                                                                                dParticipant.CHAT_PARTICIPANT_NAME
                                                                                            }
                                                                                        </span>
                                                                                        <span>
                                                                                            <XMarkIcon className="w-4 " />
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <form
                                                                    onSubmit={
                                                                        actionAddParticipant
                                                                    }
                                                                >
                                                                    <div className="w-full">
                                                                        <div className="hover:cursor-pointer">
                                                                            <SelectTailwind
                                                                                classNames={{
                                                                                    menuButton:
                                                                                        () =>
                                                                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                                                    selectParticipant
                                                                                }
                                                                                isSearchable={
                                                                                    true
                                                                                }
                                                                                isMultiple={
                                                                                    true
                                                                                }
                                                                                placeholder={
                                                                                    "Select to Add Participant"
                                                                                }
                                                                                isClearable={
                                                                                    true
                                                                                }
                                                                                value={
                                                                                    dataAddParticipant.PARTICIPANT
                                                                                }
                                                                                onChange={(
                                                                                    val: any
                                                                                ) => {
                                                                                    setDataAddParticipant(
                                                                                        {
                                                                                            ...dataAddParticipant,
                                                                                            PARTICIPANT:
                                                                                                val,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                primaryColor={
                                                                                    "bg-red-500"
                                                                                }
                                                                            />
                                                                        </div>
                                                                        {dataAddParticipant.PARTICIPANT !==
                                                                        null ? (
                                                                            <div className="mt-2">
                                                                                <PrimaryButton
                                                                                    className="w-full text-xs"
                                                                                    disabled={
                                                                                        isProcessing
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        Add
                                                                                        Participant
                                                                                    </span>
                                                                                </PrimaryButton>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </form>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
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
                                                        <div className="m-2 text-xs cursor-pointer w-fit">
                                                            {filteredUsers?.map(
                                                                (
                                                                    dataParticipant: any,
                                                                    a: number
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            className="hover:bg-red-600 p-1 rounded-md hover:text-white"
                                                                            key={
                                                                                a
                                                                            }
                                                                            onClick={(
                                                                                e: any
                                                                            ) =>
                                                                                handleMentionClick(
                                                                                    e,
                                                                                    dataParticipant.CHAT_PARTICIPANT_NAME,
                                                                                    dataParticipant.CHAT_PARTICIPANT_ID
                                                                                )
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    dataParticipant.CHAT_PARTICIPANT_NAME
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
                                                                                        e.preventDefault();
                                                                                        if (
                                                                                            showContext.visible !==
                                                                                            true
                                                                                        ) {
                                                                                            getMessageChatByTypeId(
                                                                                                dTypeChat.CHAT_ID
                                                                                            );
                                                                                            getDataParticipantById(
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
                                                                                            setDataAddParticipant(
                                                                                                {
                                                                                                    ...dataAddParticipant,
                                                                                                    CHAT_ID:
                                                                                                        dTypeChat.CHAT_ID,
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    onContextMenu={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        if (
                                                                                            dTypeChat
                                                                                                ?.pin_chat
                                                                                                .length !==
                                                                                                0 &&
                                                                                            dTypeChat?.pin_chat.find(
                                                                                                (
                                                                                                    f: any
                                                                                                ) =>
                                                                                                    f.CREATED_PIN_CHAT_BY ===
                                                                                                    auth
                                                                                                        .user
                                                                                                        .id
                                                                                            )
                                                                                        ) {
                                                                                            handleContextMenu(
                                                                                                e,
                                                                                                dTypeChat.CHAT_ID,
                                                                                                "unpin"
                                                                                            );
                                                                                            setActiveIndex(
                                                                                                i
                                                                                            );
                                                                                        } else {
                                                                                            handleContextMenu(
                                                                                                e,
                                                                                                dTypeChat.CHAT_ID,
                                                                                                "pin"
                                                                                            );
                                                                                            setActiveIndex(
                                                                                                i
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
                                                                                            {dTypeChat?.pin_chat.find(
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
                                                            Chats You Pin
                                                        </AccordionTitle>
                                                        <AccordionContent>
                                                            <div className="">
                                                                {pinChatDetail?.length ===
                                                                0 ? (
                                                                    <>
                                                                        <div className="text-xs text-red-500">
                                                                            <span>
                                                                                There
                                                                                are
                                                                                no
                                                                                chats
                                                                                pinned
                                                                                yet
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    pinChatDetail?.map(
                                                                        (
                                                                            pinChat: any,
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
                                                                                        // onClick={(
                                                                                        //     e
                                                                                        // ) => {
                                                                                        //     if (
                                                                                        //         showContext.visible !==
                                                                                        //         true
                                                                                        //     ) {
                                                                                        //         getMessageChatByTypeId(
                                                                                        //             dTypeChat.CHAT_ID
                                                                                        //         );
                                                                                        //         setFlagPlugin(
                                                                                        //             false
                                                                                        //         );
                                                                                        //         setData(
                                                                                        //             {
                                                                                        //                 ...data,
                                                                                        //                 CHAT_ID:
                                                                                        //                     dTypeChat.CHAT_ID,
                                                                                        //             }
                                                                                        //         );
                                                                                        //     }
                                                                                        // }}
                                                                                        // onContextMenu={(
                                                                                        //     e: any
                                                                                        // ) => {
                                                                                        //     handleContextMenu(
                                                                                        //         e,
                                                                                        //         dTypeChat.CHAT_ID
                                                                                        //     );
                                                                                        //     setActiveIndex(
                                                                                        //         i
                                                                                        //     );
                                                                                        // }}
                                                                                    >
                                                                                        <div>
                                                                                            <div className="">
                                                                                                <span>
                                                                                                    {
                                                                                                        pinChat.CHAT_TITLE
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="text-[10px]">
                                                                                                <span>
                                                                                                    {pinChat
                                                                                                        ?.t_user
                                                                                                        .name +
                                                                                                        " - " +
                                                                                                        format(
                                                                                                            pinChat.CREATED_CHAT_DATE,
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
                                                                                                {pinChat?.CREATED_PIN_CHAT_BY ===
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
                                                                    )
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionPanel>
                                                    <AccordionPanel>
                                                        <AccordionTitle className="text-xs">
                                                            Chat That Mention
                                                            You
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
