import React, { PropsWithChildren } from "react";
import { useMyContext } from "@/Utility/GlobalContext";

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

export default function MyComponent({}: PropsWithChildren<{}>) {
    const { value, setValue } = useMyContext();
    const handleClick = async () => {
        alert("aloo");
    };

    return (
        <>
            {/* <div
                onClick={() => {
                    handleClick();
                }}
            >
                adada
            </div> */}
        </>
    );
}
