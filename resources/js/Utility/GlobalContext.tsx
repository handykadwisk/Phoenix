import React, { createContext, useContext, ReactNode, useState } from "react";

// Mendefinisikan tipe untuk nilai context
interface MyContextType {
    value: string;
    setValue: (value: string) => void;
}

// Membuat context dengan nilai default
const MyContext = createContext<MyContextType | undefined>(undefined);

// Provider komponen
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [value, setValue] = useState<string>("default value");
    // // console.log(getMark);
    // getMark.forEach((element: any, index: number) => {
    //     element?.classList.add("cursor-help");
    //     element?.classList.add("tooltip");
    //     // element?.setAttribute("title", "Attach, Chat, Task, etc For This");
    //     const elements = element?.getElementsByClassName("bottom");

    //     if (elements.length > 0) {
    //     } else {
    //         // create div tooltip
    //         const newElementDiv = document.createElement("div");
    //         newElementDiv.classList.add("bottom");

    //         // Tambahkan div baru ke dalam container yang sesuai
    //         element?.appendChild(newElementDiv);

    //         // create p for text
    //         const newElementP = document.createElement("p");
    //         newElementP.textContent = "Attach, Chat, Task, etc For This";

    //         // Tambahkan div baru ke dalam container yang sesuai
    //         newElementDiv?.appendChild(newElementP);

    //         const newElementI = document.createElement("i");

    //         // Tambahkan div baru ke dalam container yang sesuai
    //         newElementDiv?.appendChild(newElementI);
    //     }

    //     // const stringConvert =
    //     //     urlString +
    //     //     "_" +
    //     //     element?.innerText.replace(" ", "_").toLowerCase();
    //     // const hashDigest = sha256(stringConvert);
    //     // const toString = hashDigest.toString();
    //     // idChat.push(toString + `_` + detailRelation);

    //     // element?.setAttribute("id", toString + `_` + detailRelation);
    //     // element?.addEventListener("contextmenu", handleContextMenu);
    //     // element?.addEventListener("click", handleClick);
    // });
    return (
        <MyContext.Provider value={{ value, setValue }}>
            {children}
        </MyContext.Provider>
    );
};

// Hook custom untuk menggunakan context
export const useMyContext = (): MyContextType => {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error("useMyContext must be used within a MyProvider");
    }
    return context;
};
