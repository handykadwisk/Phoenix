import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
// import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
// import Alert from "../Alert";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
}: PropsWithChildren<{
    show: boolean;
    onClose: CallableFunction;
    closeable?: boolean | any | undefined;
    typeChatId?: any | undefined;
    auth?: any;
}>) {
    // console.log(auth.user.id);
    useEffect(() => {
        getMessageChatByTypeId(typeChatId);
    }, [typeChatId]);

    // setInterval(() => {
    //     // Assuming you have a function or a way to check for new messages
    //     // Here you might simulate receiving new messages for demonstration
    //     getMessageChatByTypeId(typeChatId);
    // }, 5000);

    // const chatContainerRef = useRef<any>(null);

    // const scrollToBottom = () => {
    //     const container: HTMLElement | null =
    //         document.getElementById("messageChat");
    //     if (container) {
    //         container.scrollTop = container.scrollHeight;
    //     }
    // };
    const today = new Date();

    // Format tanggal dengan date-fns
    const formattedDate = format(today, "dd MMMM yyyy");

    // state for data message
    const [detailMessage, setDetailMessage] = useState<any>([]);
    console.log(detailMessage);

    // Ambil kunci dan urutkan secara terbalik
    const sortedKeys = Object.keys(detailMessage).reverse();

    // Buat objek baru dengan urutan terbalik
    const reversedObj: any = {};
    sortedKeys.forEach((key: any) => {
        reversedObj[key] = detailMessage[key];
    });

    console.log("Adasda", reversedObj);
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

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const modalRef = useRef(null);
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const [data, setData] = useState<any>({
        INITIATE_YOUR_CHAT: "",
        TYPE_CHAT_ID: "",
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
                TYPE_CHAT_ID: "",
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
            <Transition.Root show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-999"
                    onClose={close}
                    initialFocus={modalRef}
                >
                    {/* <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-400 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <div className="fixed inset-0 bg-black transition-opacity" />
                    </Transition.Child> */}

                    <div className="fixed inset-0 z-10">
                        <div className="flex min-h-full">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-400 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                {/* For Chat */}
                                <div className="chatBalon">
                                    <div className="bg-red-500 p-3 rounded-tr-sm rounded-tl-sm h-10 flex justify-between items-center text-white">
                                        <span>Chat</span>
                                        <span
                                            onClick={close}
                                            className="hover:cursor-pointer"
                                        >
                                            <XMarkIcon className="w-6" />
                                        </span>
                                    </div>
                                    <div
                                        className="messageChat h-[348px] overflow-y-auto"
                                        id="messageChat"
                                        ref={messagesEndRef}
                                    >
                                        {Object.keys(reversedObj)?.map(
                                            (dMessage: any, i: number) => {
                                                return (
                                                    <div
                                                        key={dMessage}
                                                        className=""
                                                    >
                                                        <div className="text-center text-xs text-gray-400 mt-2">
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
                                                        {reversedObj[
                                                            dMessage
                                                        ]?.map(
                                                            (
                                                                items: any,
                                                                a: number
                                                            ) => {
                                                                return (
                                                                    <div
                                                                        className="ml-4 mr-4"
                                                                        key={a}
                                                                    >
                                                                        <div
                                                                            className={
                                                                                auth
                                                                                    .user
                                                                                    .id ===
                                                                                items.USER_ID
                                                                                    ? "mb-1 text-right"
                                                                                    : "mb-5"
                                                                            }
                                                                        >
                                                                            <p
                                                                                className={
                                                                                    auth
                                                                                        .user
                                                                                        .id ===
                                                                                    items.USER_ID
                                                                                        ? "bg-blue-500 text-white rounded-lg py-2 px-2 inline-block text-xs"
                                                                                        : "bg-gray-200 text-gray-700 rounded-lg py-2 px-2 inline-block text-xs"
                                                                                }
                                                                            >
                                                                                {
                                                                                    items.MESSAGE_CHAT_TEXT
                                                                                }
                                                                            </p>
                                                                            <p className="text-[10px]">
                                                                                {items
                                                                                    ?.t_user
                                                                                    .name +
                                                                                    " - " +
                                                                                    format(
                                                                                        items.CREATED_MESSAGE_CHAT_DATE,
                                                                                        "HH:mm"
                                                                                    )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                    <hr />
                                    <form onSubmit={action}>
                                        <div className="m-2 flex items-center gap-1">
                                            <TextInput
                                                type="text"
                                                value={data.INITIATE_YOUR_CHAT}
                                                className="w-full ring-1 ring-red-500"
                                                onChange={(e) => {
                                                    setData({
                                                        ...data,
                                                        INITIATE_YOUR_CHAT:
                                                            e.target.value,
                                                        TYPE_CHAT_ID:
                                                            typeChatId,
                                                    });
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
