import { Fragment, useEffect, useRef, useState } from "react";
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

    const today = new Date();

    // Format tanggal dengan date-fns
    const formattedDate = format(today, "dd MMMM yyyy");

    // state for data message
    const [detailMessage, setDetailMessage] = useState<any>([]);
    const [detailTypeChat, setDetailTypeChat] = useState<any>([]);

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

                                <div className="fixed bottom-0 right-0 mr-6 border border-red-500 mb-3 rounded-r-md rounded-l-md bg-white w-[25%] h-[70%] xs:w-[90%] lg:w-[25%]">
                                    <div className="bg-red-500 p-3 rounded-tr-sm rounded-tl-sm h-10 flex justify-between items-center text-white">
                                        {flagPlugin === false ? (
                                            <span
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    setFlagPlugin(true);
                                                }}
                                            >
                                                <ArrowLeftIcon className="w-6" />
                                            </span>
                                        ) : null}
                                        {flagPlugin === false ? (
                                            <span>Chat</span>
                                        ) : (
                                            <span>List Chat</span>
                                        )}

                                        <span
                                            onClick={close}
                                            className="hover:cursor-pointer"
                                        >
                                            <XMarkIcon className="w-6" />
                                        </span>
                                    </div>
                                    {flagPlugin === false ? (
                                        <>
                                            <div
                                                className="messageChat chat-height overflow-y-auto custom-scrollbar"
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
                                                                                                ? "bg-blue-500 text-white rounded-lg py-2 px-2 inline-block text-xs"
                                                                                                : "bg-gray-200 text-gray-700 rounded-lg py-2 px-2 inline-block text-xs"
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            items.CHAT_DETAIL_TEXT
                                                                                        }
                                                                                    </p>
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
                                                                            // END CHAT BALON
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            <hr />
                                            {/* INPUT CHAT MESSAGE */}
                                            <form onSubmit={action}>
                                                <div className="m-2 flex items-center gap-1">
                                                    <TextInput
                                                        type="text"
                                                        value={
                                                            data.INITIATE_YOUR_CHAT
                                                        }
                                                        className="w-full ring-1 ring-red-500"
                                                        onChange={(e) => {
                                                            if (
                                                                typeChatId !==
                                                                ""
                                                            ) {
                                                                setData({
                                                                    ...data,
                                                                    INITIATE_YOUR_CHAT:
                                                                        e.target
                                                                            .value,
                                                                    CHAT_ID:
                                                                        typeChatId,
                                                                });
                                                            } else {
                                                                setData({
                                                                    ...data,
                                                                    INITIATE_YOUR_CHAT:
                                                                        e.target
                                                                            .value,
                                                                });
                                                            }
                                                        }}
                                                        // onChange={(e) => permissionObject(e)}
                                                        placeholder="Your Chat"
                                                    />
                                                    <PrimaryButton
                                                        className="inline-flex w-full sm:ml-3 sm:w-auto"
                                                        disabled={isProcessing}
                                                    >
                                                        <span>
                                                            <PaperAirplaneIcon className="w-6" />
                                                        </span>
                                                    </PrimaryButton>
                                                </div>
                                            </form>
                                            {/* END INPUT CHAT MESSAGE */}
                                        </>
                                    ) : (
                                        <>
                                            {/* LIST CHAT */}
                                            <div>
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
                                            </div>
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
