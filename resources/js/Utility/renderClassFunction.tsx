// useCounter.js
import { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";

const renderClassFunction = (detailRelation: number, dataTPlugin: any) => {
    // state untuk munculin menu
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
    const [divId, setDivId] = useState<any>([]);

    useEffect(() => {
        const idChat: any = [];
        setDivId(idChat);
        // jalankan render awal awal yang ada class cls_can_attach_process
        // get classname yang ada cls_can_attach_process
        const getMark = document.querySelectorAll(
            ".cls_can_attach_process"
        ) as NodeListOf<any>;

        const getMarkPlugin = document.querySelectorAll(
            ".chatPlugin"
        ) as NodeListOf<any>;

        // get url untuk di generate
        const url = new URL(window.location.href);
        const getUrl = url.pathname;
        const urlString = getUrl.replace(/[!/@]/g, "");

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

        // render class cls_can_attach_process
        getMark.forEach((element: any, index: number) => {
            element?.classList.add("cursor-help");
            element?.classList.add("tooltip");
            // element?.setAttribute("title", "Attach, Chat, Task, etc For This");
            const elements = element?.getElementsByClassName("bottom");

            if (elements.length > 0) {
            } else {
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

            const stringConvert =
                urlString +
                "_" +
                element?.innerText.replace(" ", "_").toLowerCase();
            const hashDigest = sha256(stringConvert);
            const toString = hashDigest.toString();
            idChat.push(toString + `_` + detailRelation);

            element?.setAttribute("id", toString + `_` + detailRelation);
            element?.addEventListener("contextmenu", handleContextMenu);
            element?.addEventListener("click", handleClick);
        });

        return () => {
            // hilangkan renderan
            const getMark = document.querySelectorAll(
                ".cls_can_attach_process"
            ) as NodeListOf<any>;
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

            const handleClick = (e: any) => {
                e.preventDefault();
                console.log(e.currentTarget.id);
                setShowContext({
                    ...showContext,
                    visible: false,
                });
            };
            getMark.forEach((element: any, index: number) => {
                element?.classList.add("cursor-help");
                // element?.setAttribute(
                //     "title",
                //     "Attach, Chat, Task, etc For This"
                // );
                // generate String
                const stringConvert =
                    urlString +
                    "_" +
                    element?.innerText.replace(" ", "_").toLowerCase();
                const hashDigest = sha256(stringConvert);
                const toString = hashDigest.toString();

                element?.setAttribute("id", toString + `_` + detailRelation);
                element?.removeEventListener("contextmenu", handleContextMenu);
                element?.removeEventListener("click", handleClick);
            });
        };
    }, [detailRelation]);

    // console.log(divId);

    useEffect(() => {
        let divs = document.querySelectorAll(
            ".chatPlugin"
        ) as NodeListOf<HTMLDivElement>;

        divs.forEach((div, index) => {
            if (divId[index]) {
                div.classList.add("flex");
                div.classList.add("gap-2");
                div.id = divId[index]; // Menetapkan ID dari data API
            }
        });
    }, [divId.length !== 0]);

    useEffect(() => {
        const handleModalClick = async () => {
            alert("aloo");
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
                    newDiv.addEventListener("click", handleModalClick);
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
                    newDiv.addEventListener("click", handleModalClick);
                    newDiv.classList.add("hover:cursor-pointer");
                    // newDiv.textContent = item.PLUGIN_PROCESS_ID;

                    // Tambahkan div baru ke dalam container yang sesuai
                    container?.appendChild(newDiv);
                }
            }
        });
    }, [dataTPlugin]);

    return {
        showContext,
        idDiv,
        menuPosition,
        setShowContext,
    };
};

export default renderClassFunction;
