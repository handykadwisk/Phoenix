import React, { PropsWithChildren, useEffect, useState } from "react";
import { useMyContext } from "@/Utility/GlobalContext";
import sha256 from "crypto-js/sha256";
import MenuPlugin from "@/Pages/PluginModul/MenuPlugin";
import axios from "axios";
import AddChatPlugin from "@/Pages/PluginModul/AddChatPlugin";
import ModalChatMessage from "@/Pages/PluginModul/ModalChatMessage";
import { usePage } from "@inertiajs/react";

// const MyComponent: React.FC = () => {
//     const { value, setValue } = useMyContext();

//     return (
//         <div>
//             <p>Context Value: {value}</p>
//             <button onClick={() => setValue("new value")}>Change Value</button>
//         </div>
//     );
// };

// export default MyComponent;

export default function PhoenixComponent({
    otherId,
    setIsSuccess,
}: PropsWithChildren<{ otherId?: any; setIsSuccess?: any }>) {
    const { value, setValue } = useMyContext();
    const { auth }: any = usePage().props;

    const [showContext, setShowContext] = useState<any>({
        visible: false,
    });

    const [idDiv, setIdDiv] = useState<any>({
        setIdName: "",
    });

    // state untuk menuu position jika di klik
    const [menuPosition, setMenuPosition] = useState<any>({
        x: "",
        y: "",
        marginTop: "",
        marginLeft: "",
    });

    const [showChatMessage, setShowChatMessage] = useState({
        chatModal: false,
    });

    const [tagIdChat, setTagIdChat] = useState<any>({
        TAG_ID: "",
    });

    // Parameter for chat message
    const [typeChatId, setTypeChatId] = useState<any>({
        typeID: "",
    });

    const [flagPlugin, setFlagPlugin] = useState<boolean>(false);

    // jika other id ada dan tidak ada
    var newId = "";
    if (otherId === undefined) {
        var newId = "";
    } else {
        var newId = "_" + otherId;
    }
    // end other id

    useEffect(() => {
        getTPluginProcess();
    }, []);
    const [dataTPlugin, setDataTPlugin] = useState<any>([]);

    const getTPluginProcess = async () => {
        await axios
            .post(`/getTPluginProcess`)
            .then((res) => {
                // getPlugin(res.data);
                setDataTPlugin(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // get url untuk di generate
    const url = new URL(window.location.href);
    const getUrl = url.pathname;
    const urlString = getUrl.replace(/[!/@]/g, "");
    // end get url untuk di generate
    const [divId, setDivId] = useState<any>([]);
    useEffect(() => {
        const getMark = document.querySelectorAll(
            ".cls_can_attach_process"
        ) as NodeListOf<any>;
        const idChat: any = [];
        setDivId(idChat);
        // handle click context meny
        const handleContextMenu = (e: any) => {
            e.preventDefault();
            setShowContext({
                ...showContext,
                visible: true,
            });
            setIdDiv({
                ...idDiv,
                setIdName: e.currentTarget.id,
            });

            const container = e.currentTarget.closest(
                ".modal-action-container"
            );
            const containerRect = container.getBoundingClientRect();

            setMenuPosition({
                x: e.clientX,
                y: e.clientY,
                marginTop: containerRect.top,
                marginLeft: containerRect.left,
            });
        };

        // handleClick hilangkan menu
        const handleClick = (e: any) => {
            e.preventDefault();
            setShowContext({
                ...showContext,
                visible: false,
            });
        };

        // RENDER ELEMENT YANG PUNYA CLASS "cls_can_attach_process"
        getMark.forEach((element: any) => {
            // Tambah Class
            element?.classList.add("cursor-help");
            element?.classList.add("tooltip");
            element?.classList.add("bg-yellow-100/35");
            // End Tambah Class

            const divPlugin = document?.getElementsByClassName("chatPlugin");
            // console.log(elements);
            // if (divPlugin.length > 0) {
            // } else {
            // create div tooltip
            var newElementDiv = document.createElement("div");
            newElementDiv.classList.add("chatPlugin");
            newElementDiv.classList.add("float-right");
            newElementDiv.classList.add("mt-1");
            newElementDiv.classList.add("ml-2");

            // var header = document?.getElementsByClassName(
            //     "cls_can_attach_process"
            // );

            const referenceElement = element;

            if (referenceElement.parentNode) {
                referenceElement.parentNode.insertBefore(
                    newElementDiv,
                    referenceElement
                );
            }

            // document.body.insertBefore(newElementDiv, header[0].parentNode);
            // }

            // Get element class Buttom
            const elements = element?.getElementsByClassName("bottom");
            // Cek Ada apa tidak Class "Bottom"
            if (elements.length > 0) {
            } else {
                // Jika tidak ada bikin element div yang classnya bottom untuk munculin tooltip

                // create div tooltip
                const newElementDiv = document.createElement("div");
                newElementDiv.classList.add("bottom");
                newElementDiv.classList.add("z-999999");

                // Tambahkan div baru ke dalam container yang sesuai
                element?.appendChild(newElementDiv);

                // create p for text
                const newElementP = document.createElement("p");
                newElementP.textContent = "Attach, Chat, Task, etc For This";

                // Tambahkan div baru ke dalam container yang sesuai
                newElementDiv?.appendChild(newElementP);

                const newElementI = document.createElement("i");

                // Tambahkan div baru ke dalam container yang sesuai
                newElementDiv?.appendChild(newElementI);
            }
            // End Cek Ada apa tidak Class "Bottom"

            const stringConvert =
                urlString +
                "_" +
                element?.innerText.replace(" ", "_").toLowerCase();
            const hashDigest = sha256(stringConvert);
            const toString = hashDigest.toString();
            idChat.push(toString + newId);

            // add id ke class yang mempunyai class "cls_can_attach_process"
            element?.setAttribute("id", toString + newId);
            element?.addEventListener("contextmenu", handleContextMenu);
            element?.addEventListener("click", handleClick);
        });
        // END RENDER ELEMENT YANG PUNYA CLASS "cls_can_attach_process"

        return () => {
            getMark.forEach((element: any) => {
                element?.removeEventListener("contextmenu", handleContextMenu);
                element?.removeEventListener("click", handleClick);
            });
        };
    }, []);

    // render chat plugin
    useEffect(() => {
        let divs = document.querySelectorAll(
            ".chatPlugin"
        ) as NodeListOf<HTMLDivElement>;

        divs.forEach((div, index) => {
            if (divId[index]) {
                div.classList.add("flex");
                div.classList.add("gap-2");
                // div.classList.add("gap-2");
                div.id = divId[index]; // Menetapkan ID dari data API
            }
        });
    }, [divId.length !== 0]);
    // end Render Chat Plugin

    useEffect(() => {
        const handleModalClick = async (
            PLUGIN_PROCESS_ID: any,
            TAG_ID: any
            // event: FormEvent
        ) => {
            // event.preventDefault();

            if (PLUGIN_PROCESS_ID === "1" || PLUGIN_PROCESS_ID === 1) {
                setShowChatMessage({
                    chatModal: true,
                });
                setTagIdChat({
                    TAG_ID: TAG_ID,
                });
                setFlagPlugin(true);
            } else {
                alert("Coming Soon");
            }
        };

        dataTPlugin.forEach((item: any) => {
            const className =
                item.r_plugin_process.PLUG_PROCESS_CLASS.toString();
            // Temukan container berdasarkan ID dari data
            const divElements = document.querySelectorAll(`.${className}`);

            divElements.forEach((div) => {
                div.remove();
            });
        });

        dataTPlugin.forEach((item: any) => {
            const className =
                item.r_plugin_process.PLUG_PROCESS_CLASS.toString();
            // Temukan container berdasarkan ID dari data
            const container = document.querySelector(
                `.chatPlugin[id="${item.TAG_ID}"]`
            );
            // console.log(container?.id);

            // cek ada ga div yang idnya sama TAG_ID

            if (container?.id === item.TAG_ID) {
                // Buat elemen div baru
                // const newDiv = document.createElement("div");
                // // hapus dulu cls yang lama

                // newDiv.className = "";
                // newDiv.className = className;
                // // newDiv.textContent = item.PLUGIN_PROCESS_ID;

                // // Tambahkan div baru ke dalam container yang sesuai
                // container?.appendChild(newDiv);
                // const classDiv = document.querySelectorAll(`.${className}`);
                const divExists =
                    document.querySelector(`.${className}`) !== null;
                // // classDiv.forEach((div: any) => {
                // //     div.remove();
                // // });
                if (divExists === false) {
                    // Buat elemen div baru
                    const newDiv = document.createElement("div");
                    // hapus dulu cls yang lama

                    // newDiv.className = "";
                    // newDiv.className = className;
                    newDiv.classList.add(className);
                    newDiv.addEventListener("click", function (event: any) {
                        handleModalClick(item.PLUGIN_PROCESS_ID, item.TAG_ID);
                    });
                    // newDiv.addEventListener(
                    //     "click",
                    //     handleModalClick(item.PLUGIN_PROCESS_ID)
                    // );
                    newDiv.classList.add("hover:cursor-pointer");
                    // newDiv.textContent = item.PLUGIN_PROCESS_ID;

                    // Tambahkan div baru ke dalam container yang sesuai
                    container?.appendChild(newDiv);
                } else {
                    const newDiv = document.createElement("div");
                    // hapus dulu cls yang lama

                    // newDiv.className = "";
                    // newDiv.className = className;
                    newDiv.classList.add(className);
                    newDiv.addEventListener("click", function (event: any) {
                        handleModalClick(item.PLUGIN_PROCESS_ID, item.TAG_ID);
                    });
                    newDiv.classList.add("hover:cursor-pointer");
                    // newDiv.textContent = item.PLUGIN_PROCESS_ID;

                    // Tambahkan div baru ke dalam container yang sesuai
                    container?.appendChild(newDiv);
                }
            }
        });
    }, [dataTPlugin]);

    const [modalPlugin, setModalPlugin] = useState<any>({
        add: false,
    });

    // data menu
    const [dataPluginProcess, setDataPluginProcess] = useState<any>({
        TAG_ID: "",
        PLUGIN_PROCESS_ID: "",
        TITLE_CHAT: "",
        OBJECT_CHAT: "",
        INITIATE_YOUR_CHAT: "",
    });

    const handleAddPluginProcess = async (idPlug: number) => {
        // e.preventDefault();

        // if (idPlug === 1) {
        setModalPlugin({
            add: !modalPlugin.add,
        });
        setDataPluginProcess({
            ...dataPluginProcess,
            TAG_ID: idDiv.setIdName,
            PLUGIN_PROCESS_ID: idPlug,
            TITLE_CHAT: "",
            OBJECT_CHAT: "chat_",
            INITIATE_YOUR_CHAT: "",
        });
        // } else {
        //     alert("coming soon");
        // }

        // setDataPluginProcess({
        //     TAG_ID: idDiv.setIdName,
        //     PLUGIN_PROCESS_ID: idPlug,
        //     UID_CHAT: "chat_",
        // });

        // if (modalPlugin.add === false) {
        setShowContext({
            ...showContext,
            visible: false,
        });
        // }
    };

    const handleSuccessPlugin = async (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[2]);
            // getDetailRelation(message[0]);
            getTPluginProcess();
            setShowContext({
                ...showContext,
                visible: false,
            });

            if (message[1] === "1") {
                setShowChatMessage({
                    chatModal: !showChatMessage.chatModal,
                });
                setFlagPlugin(false);
                setTagIdChat({
                    TAG_ID: message[4],
                });
                setTypeChatId({
                    typeID: message[3],
                });
            }

            // getContents();
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    return (
        <>
            {/* show chat Initiate */}
            <AddChatPlugin
                modalPlugin={modalPlugin}
                setModalPlugin={setModalPlugin}
                dataPluginProcess={dataPluginProcess}
                setDataPluginProcess={setDataPluginProcess}
                handleSuccessPlugin={handleSuccessPlugin}
            />

            {/* show menu plugin */}
            {showContext.visible && (
                <>
                    <MenuPlugin
                        handleAddPluginProcess={handleAddPluginProcess}
                        top={menuPosition.y}
                        left={menuPosition.x}
                        marginTop={menuPosition.marginTop}
                        marginLeft={menuPosition.marginLeft}
                    />
                </>
            )}

            <ModalChatMessage
                showChatMessage={showChatMessage}
                setShowChatMessage={setShowChatMessage}
                // onClose={() =>
                //     setShowChatMessage({
                //         chatModal: false,
                //     })
                // }
                typeChatId={typeChatId.typeID}
                tagIdChat={tagIdChat}
                auth={auth}
                flagPlugin={flagPlugin}
                setFlagPlugin={setFlagPlugin}
            />
        </>
    );
}
