import React, { PropsWithChildren, useEffect, useState } from "react";
import iconGrid from "@/Images/grid-icon.svg";
import { ArrowUpIcon } from "@heroicons/react/20/solid";

export default function ButtonPlugin({}: PropsWithChildren<{}>) {
    return (
        <>
            <div className="absolute z-50 bg-red-500 bottom-0 right-0 rounded-full w-12 h-12 mr-3 mb-5 flex justify-center items-center cursor-pointer text-white">
                <span>
                    <img src={iconGrid} className="w-5" />
                </span>
            </div>
        </>
    );
}
