import React, { PropsWithChildren } from "react";
import { MyProvider } from "@/Utility/GlobalContext";
import PhoenixComponent from "./PhoenixComponent";

export default function AppPlugin({
    parameterID,
}: PropsWithChildren<{ parameterID?: any }>) {
    return (
        <>
            <MyProvider>
                <PhoenixComponent otherId={parameterID} />
            </MyProvider>
        </>
    );
}
