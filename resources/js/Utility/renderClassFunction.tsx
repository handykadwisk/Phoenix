// useCounter.js
import { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";

const renderClassFunction = (detailRelation: number) => {
    const [showContext, setShowContext] = useState<any>({
        visible: false,
    });

    const [idDiv, setIdDiv] = useState<any>({
        setIdName: "",
    });

    const [menuPosition, setMenuPosition] = useState<any>({
        x: "",
        y: "",
        marginTop: "",
        marginLeft: "",
    });

    // const getContents = (
    //     getMark: any,
    //     detailRelation?: number | null | undefined
    // ) => {
    //     const handleContextMenu = async (e: any) => {
    //         e.preventDefault();
    //         console.log(e.currentTarget.id);
    //         setShowContext({
    //             ...showContext,
    //             visible: true,
    //         });
    //         setIdDiv({
    //             ...idDiv,
    //             setIdName: e.currentTarget.id,
    //         });

    //         const container = e.currentTarget.closest(
    //             ".modal-action-container"
    //         );
    //         const containerRect = container.getBoundingClientRect();

    //         setMenuPosition({
    //             x: e.clientX,
    //             y: e.clientY,
    //             marginTop: containerRect.top,
    //             marginLeft: containerRect.left,
    //         });
    //     };

    //     const handleClick = async (e: any) => {
    //         e.preventDefault();
    //         console.log(e.currentTarget.id);
    //         setShowContext({
    //             ...showContext,
    //             visible: false,
    //         });
    //     };
    //     // const getMark = document.querySelectorAll(
    //     //     ".cls_can_attach_process"
    //     // ) as NodeListOf<any>;
    //     // console.log(getMark);
    //     getMark.forEach((element: any, index: number) => {
    //         // console.log(element);
    //         // if (element.className === "cls_can_attach_process") {
    //         element?.classList.add("cursor-help");
    //         element?.setAttribute("title", "Attach, Chat, Task, etc For This");
    //         // }
    //         // generate String
    //         const hashDigest = sha256(
    //             element?.innerText.replace(" ", "_").toLowerCase()
    //         );
    //         const toString = hashDigest.toString();

    //         element?.setAttribute(
    //             "id",
    //             element?.innerText.replace(" ", "_").toLowerCase() +
    //                 `_` +
    //                 toString.substring(0, 3) +
    //                 `_` +
    //                 detailRelation
    //         );
    //         element?.addEventListener("contextmenu", handleContextMenu);
    //         element?.addEventListener("click", handleClick);
    //         // console.log(element); // Safe, since it's known to be HTMLElement

    //         // console.log(dataTPlugin);
    //         // dataTPlugin?.forEach((dataPlug: any, i: number) => {
    //         //     console.log(dataPlug);
    //         //     // const container = document.querySelector(".pluginChat");
    //         //     // // console.log(container);
    //         //     // const newDiv = document.createElement("div");
    //         //     // const className =
    //         //     //     dataPlug.r_plugin_process.PLUG_PROCESS_CLASS.toString();
    //         //     // console.log("asda", className);
    //         //     // newDiv.className = className;

    //         //     // // Tambahkan div baru ke elemen container
    //         //     // if (
    //         //     //     dataPlug.T_TAG ===
    //         //     //     element?.innerText.replace(" ", "_").toLowerCase() +
    //         //     //         `_` +
    //         //     //         toString.substring(0, 3) +
    //         //     //         `_` +
    //         //     //         detailRelation
    //         //     // ) {
    //         //     //     container?.appendChild(newDiv);
    //         //     // }
    //         // });
    //     });
    // };

    // const unGetContents = (getMark: any) => {
    //     const handleContextMenu = (e: any) => {
    //         e.preventDefault();
    //         console.log(e.currentTarget.id);
    //         setShowContext({
    //             ...showContext,
    //             visible: true,
    //         });
    //         setIdDiv({
    //             ...idDiv,
    //             setIdName: e.currentTarget.id,
    //         });

    //         const container = e.currentTarget.closest(
    //             ".modal-action-container"
    //         );
    //         const containerRect = container.getBoundingClientRect();

    //         setMenuPosition({
    //             x: e.clientX,
    //             y: e.clientY,
    //             marginTop: containerRect.top,
    //             marginLeft: containerRect.left,
    //         });
    //     };

    //     const handleClick = (e: any) => {
    //         e.preventDefault();
    //         console.log(e.currentTarget.id);
    //         setShowContext({
    //             ...showContext,
    //             visible: false,
    //         });
    //     };
    //     getMark.forEach((element: any, index: number) => {
    //         element?.removeEventListener("contextmenu", handleContextMenu);
    //         element?.removeEventListener("click", handleClick);
    //     });
    // };

    useEffect(() => {
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
        // const getMark = document.querySelectorAll(
        //     ".cls_can_attach_process"
        // ) as NodeListOf<any>;
        // console.log(getMark);
        getMark.forEach((element: any, index: number) => {
            // console.log(element);
            // if (element.className === "cls_can_attach_process") {
            element?.classList.add("cursor-help");
            element?.setAttribute("title", "Attach, Chat, Task, etc For This");
            // }
            // generate String
            const hashDigest = sha256(
                element?.innerText.replace(" ", "_").toLowerCase()
            );
            const toString = hashDigest.toString();

            element?.setAttribute(
                "id",
                element?.innerText.replace(" ", "_").toLowerCase() +
                    `_` +
                    toString.substring(0, 3) +
                    `_` +
                    detailRelation
            );
            element?.addEventListener("contextmenu", handleContextMenu);
            element?.addEventListener("click", handleClick);
            // console.log(element); // Safe, since it's known to be HTMLElement

            // console.log(dataTPlugin);
            // dataTPlugin?.forEach((dataPlug: any, i: number) => {
            //     console.log(dataPlug);
            //     // const container = document.querySelector(".pluginChat");
            //     // // console.log(container);
            //     // const newDiv = document.createElement("div");
            //     // const className =
            //     //     dataPlug.r_plugin_process.PLUG_PROCESS_CLASS.toString();
            //     // console.log("asda", className);
            //     // newDiv.className = className;

            //     // // Tambahkan div baru ke elemen container
            //     // if (
            //     //     dataPlug.T_TAG ===
            //     //     element?.innerText.replace(" ", "_").toLowerCase() +
            //     //         `_` +
            //     //         toString.substring(0, 3) +
            //     //         `_` +
            //     //         detailRelation
            //     // ) {
            //     //     container?.appendChild(newDiv);
            //     // }
            // });
        });

        return () => {
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
            // const getMark = document.querySelectorAll(
            //     ".cls_can_attach_process"
            // ) as NodeListOf<any>;
            // console.log(getMark);
            getMark.forEach((element: any, index: number) => {
                // console.log(element);
                // if (element.className === "cls_can_attach_process") {
                element?.classList.add("cursor-help");
                element?.setAttribute(
                    "title",
                    "Attach, Chat, Task, etc For This"
                );
                // }
                // generate String
                const hashDigest = sha256(
                    element?.innerText.replace(" ", "_").toLowerCase()
                );
                const toString = hashDigest.toString();

                element?.setAttribute(
                    "id",
                    element?.innerText.replace(" ", "_").toLowerCase() +
                        `_` +
                        toString.substring(0, 3) +
                        `_` +
                        detailRelation
                );
                element?.removeEventListener("contextmenu", handleContextMenu);
                element?.removeEventListener("click", handleClick);
                // console.log(element); // Safe, since it's known to be HTMLElement

                // console.log(dataTPlugin);
                // dataTPlugin?.forEach((dataPlug: any, i: number) => {
                //     console.log(dataPlug);
                //     // const container = document.querySelector(".pluginChat");
                //     // // console.log(container);
                //     // const newDiv = document.createElement("div");
                //     // const className =
                //     //     dataPlug.r_plugin_process.PLUG_PROCESS_CLASS.toString();
                //     // console.log("asda", className);
                //     // newDiv.className = className;

                //     // // Tambahkan div baru ke elemen container
                //     // if (
                //     //     dataPlug.T_TAG ===
                //     //     element?.innerText.replace(" ", "_").toLowerCase() +
                //     //         `_` +
                //     //         toString.substring(0, 3) +
                //     //         `_` +
                //     //         detailRelation
                //     // ) {
                //     //     container?.appendChild(newDiv);
                //     // }
                // });
            });
        };
    }, [detailRelation]);

    return {
        showContext,
        idDiv,
        menuPosition,
        setShowContext,
    };
};

export default renderClassFunction;
