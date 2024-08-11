import { MouseEventHandler, PropsWithChildren } from "react";

export default function TableTD({
    value,
    className = "",
}: PropsWithChildren<{
    value: any;
    className: string;
}>) {
    return (
        <td
            className={
                `border-b border-[#eee] py-2 px-4 dark:border-strokedark ` +
                className
            }
        >
            {value}
        </td>
    );
}
