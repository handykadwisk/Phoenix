import React, {
    FormEvent,
    PropsWithChildren,
    useEffect,
    Fragment,
    useState,
} from "react";
import iconGrid from "@/Images/grid-icon.svg";
import {
    ArrowUpIcon,
    BellAlertIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import ModalChatMessage from "@/Pages/PluginModul/ModalChatMessage";
import { usePage } from "@inertiajs/react";
import ModalReminder from "@/Pages/Reminder/ModalReminder";

export default function ButtonPlugin({}: PropsWithChildren<{}>) {
    const { auth }: any = usePage().props;
    useEffect(() => {
        getDataPluginChat();
        connectWebSocket();

        return () => {
            window.Echo.leave(webSocketChannel);
        };
    }, []);
    // for modal show menu plugin
    const [show, setShow] = useState<boolean>(false);

    // for handle click show
    const handleClickShow = (e: FormEvent) => {
        e.preventDefault();
        if (show === false) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    // for load data chat plugin
    const [dataPluginProcess, setDataPluginProcess] = useState<any>([]);
    const getDataPluginChat = async () => {
        await axios
            .post(`/getDataPluginChat`)
            .then((res) => {
                setDataPluginProcess(res.data);
                setShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [flagPlugin, setFlagPlugin] = useState<boolean>(false);
    // for modal chat message
    const [showChatMessage, setShowChatMessage] = useState({
        chatModal: false,
    });
    // flag for chat object
    const [flagObject, setFlagObject] = useState<any>("");

    // for show modal chat
    const handleClickModalChatMessage = async (e: FormEvent) => {
        e.preventDefault();
        setShowChatMessage({
            chatModal: true,
        });
        setFlagObject("flagObject");
        setFlagPlugin(true);
        setShow(false);
    };

    // for handle reminder modal
    const [showReminder, setShowReminder] = useState<any>({
        reminder: false,
    });
    const handleClickReminder = async (e: FormEvent) => {
        e.preventDefault();
        setShowReminder({
            reminder: !showReminder.reminder,
        });
        setShow(false);
    };

    const [notification, setNotification] = useState<boolean>(false);
    const webSocketChannel = `channel-name`;
    const connectWebSocket = () => {
        window.Echo.private(webSocketChannel).listen("GotMessage", (e: any) => {
            // e.message
            setNotification(true);
        });
    };

    return (
        <>
            <ModalReminder
                showReminder={showReminder}
                setShowReminder={setShowReminder}
            />

            <ModalChatMessage
                showChatMessage={showChatMessage}
                setShowChatMessage={setShowChatMessage}
                setFlagObject={setFlagObject}
                flagObject={flagObject}
                tagIdChat={1}
                // onClose={() =>
                //     setShowChatMessage({
                //         chatModal: false,
                //     })
                // }
                auth={auth}
                flagPlugin={flagPlugin}
                setFlagPlugin={setFlagPlugin}
            />
            {/* {show === true ? (
                <> */}
            <Transition.Root show={show} as={Fragment}>
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed z-99 bottom-0 right-0 mr-3 mb-[70px] cursor-pointer text-white">
                        {/* <div
                            className="bg-red-600 flex flex-col-reverse mb-2 rounded-full w-12 h-12 justify-center items-center z-999999"
                            onClick={(e: any) => handleClickReminder(e)}
                            title="Reminder"
                        >
                            <span>
                                <BellAlertIcon className="w-5" />
                            </span>
                        </div> */}
                        {dataPluginProcess?.map((items: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="bg-red-600 flex flex-col-reverse mb-2 rounded-full w-12 h-12 justify-center items-center z-999999"
                                    onClick={(e: any) => {
                                        items.PLUGIN_PROCESS_NAME === "Chat"
                                            ? handleClickModalChatMessage(e)
                                            : items.PLUGIN_PROCESS_NAME ===
                                              "Reminder"
                                            ? handleClickReminder(e)
                                            : null;
                                    }}
                                    title={items.PLUGIN_PROCESS_NAME}
                                >
                                    <span>
                                        {items.PLUGIN_PROCESS_NAME ===
                                        "Chat" ? (
                                            <ChatBubbleLeftRightIcon className="w-5" />
                                        ) : items.PLUGIN_PROCESS_NAME ===
                                          "Task" ? (
                                            <ClockIcon className="w-5" />
                                        ) : (
                                            <BellAlertIcon className="w-5" />
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Transition.Child>
            </Transition.Root>
            {/* </>
            ) : null} */}

            <div
                className="fixed z-50 bg-red-600 bottom-0 right-0 rounded-full w-12 h-12 mr-3 mb-5 flex justify-center items-center cursor-pointer text-white"
                onClick={(e) => handleClickShow(e)}
            >
                {notification && (
                    <div className="absolute top-0 right-0 bg-yellow-300 w-15 h-15 p-2 rounded-lg">
                        {/* <span>a</span> */}
                    </div>
                )}

                <span>
                    <img src={iconGrid} className="w-5" />
                </span>
            </div>
        </>
    );
}
