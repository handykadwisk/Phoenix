import React, { PropsWithChildren, useEffect, useState } from "react";
import { useMyContext } from "@/Utility/GlobalContext";
import sha256 from "crypto-js/sha256";
import MenuPlugin from "@/Pages/PluginModul/MenuPlugin";
import axios from "axios";
import AddChatPlugin from "@/Pages/PluginModul/AddChatPlugin";

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

export default function MyComponent({
    otherId,
    setIsSuccess,
}: PropsWithChildren<{ otherId?: any; setIsSuccess?: any }>) {
    const { value, setValue } = useMyContext();

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

    // jika other id ada dan tidak ada
    var newId = "";
    if (otherId === undefined) {
        var newId = "";
    } else {
        var newId = "_" + otherId;
    }
    // end other id

    // get url untuk di generate
    const url = new URL(window.location.href);
    const getUrl = url.pathname;
    const urlString = getUrl.replace(/[!/@]/g, "");
    // end get url untuk di generate

    useEffect(() => {
        const getMark = document.querySelectorAll(".cls") as NodeListOf<any>;
        // handle click context meny
        const handleContextMenu = (e: any) => {
            e.preventDefault();
            console.log(e.currentTarget.id);
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
            console.log(e.currentTarget.id);
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
            element?.classList.add("hover:bg-yellow-100/35");
            // End Tambah Class

            // Get element class Buttom
            const elements = element?.getElementsByClassName("bottom");
            // Cek Ada apa tidak Class "Bottom"
            if (elements.length > 0) {
            } else {
                // Jika tidak ada bikin element div yang classnya bottom untuk munculin tooltip

                // create div tooltip
                const newElementDiv = document.createElement("div");
                newElementDiv.classList.add("bottom");

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
            // idChat.push(toString + `_` + detailRelation);

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

            // if (message[1] === "1") {
            //     setShowChatMessage({
            //         chatModal: !showChatMessage.chatModal,
            //     });
            //     setFlagPlugin(false);
            //     setTypeChatId({
            //         typeID: message[3],
            //     });
            // }

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
        </>
    );
}
