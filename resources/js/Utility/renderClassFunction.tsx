// useCounter.js
import { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";

const renderClassFunction = (getMark: any, detailRelation: number) => {
    const [showContext, setShowContext] = useState<any>({
        visible: false,
    });

    const [idDiv, setIdDiv] = useState<any>({
        setIdName: "",
    });

    const [menuPosition, setMenuPosition] = useState<any>({
        x: "",
        y: "",
    });

    const handleContextMenu = async (e: any) => {
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

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 90;
        const menuHeight = 90;
        // Calculate the position of the context menu
        let x = e.clientX;
        let y = e.clientY;

        // Adjust position if the menu exceeds the viewport width
        if (x + menuWidth > viewportWidth) {
            x = viewportWidth - menuWidth;
        }

        // Adjust position if the menu exceeds the viewport height
        if (y + menuHeight > viewportHeight) {
            y = viewportHeight - menuHeight;
        }
        setMenuPosition({
            x: x,
            y: y,
        });
    };

    const handleClick = async (e: any) => {
        e.preventDefault();
        console.log(e.currentTarget.id);
        setShowContext({
            ...showContext,
            visible: false,
        });
    };

    const getContents = (
        getMark: any,
        detailRelation?: number | null | undefined
    ) => {
        // const getMark = document.querySelectorAll(
        //     ".cls_can_attach_process"
        // ) as NodeListOf<any>;
        // console.log(getMark);
        getMark.forEach((element: any) => {
            if (element.className === "cls_can_attach_process") {
                element?.setAttribute("class", "cursor-help");
                element?.setAttribute(
                    "title",
                    "Attach, Chat, Task, etc For This"
                );
            }
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
        });
    };

    useEffect(() => {
        getContents(getMark, detailRelation);
    }, [getMark]);

    return {
        showContext,
        idDiv,
        menuPosition,
        setShowContext,
    };
};

export default renderClassFunction;
