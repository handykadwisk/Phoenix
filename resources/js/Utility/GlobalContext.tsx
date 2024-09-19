import React, { createContext, useContext, ReactNode, useState } from "react";

// Mendefinisikan tipe untuk nilai context
interface MyContextType {
    value: string;
    setValue: (value: string) => void;
    getMark: any;
}

// Membuat context dengan nilai default
const MyContext = createContext<MyContextType | undefined>(undefined);

// Provider komponen
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [value, setValue] = useState<string>("default value");
    const getMark = document.querySelectorAll(
        ".cls_can_attach_process"
    ) as NodeListOf<any>;

    return (
        <MyContext.Provider value={{ value, setValue, getMark }}>
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
