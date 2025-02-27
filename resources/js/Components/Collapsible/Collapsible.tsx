import React, { useState } from "react";
const Collapsible = (props:any) => {
    const [open, setOPen] = useState<boolean>(false);
    const toggle = () => {
        setOPen(!open);
    };
    return (
        // <div>
        //     <button>toggle</button>
        //     {open && <div>toggle me</div>}
        // </div>
        <div>
            <button onClick={toggle}>
                <div className="grid grid-cols-4">
                    <div className="col-span-3 items-start text-left font-semibold">
                        {props.label}
                    </div>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4 cursor-pointer ml-4 mt-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={`${
                                    open
                                        ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                                        : "m19.5 8.25-7.5 7.5-7.5-7.5"
                                }`}
                            />
                        </svg>
                    </div>
                </div>
            </button>
            {open && (
                <div className="toggle border-2">
                    <div className="ml-2 mt-2 mr-2 mb-2">{props.children}</div>
                </div>
            )}
        </div>
    );
};
export default Collapsible;
