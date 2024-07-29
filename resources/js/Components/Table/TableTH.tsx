import { PropsWithChildren } from "react";

export default function TableTH({
    label,
    className = "",
    colSpan = "",
    rowSpan = "",
}: PropsWithChildren<{
    label: any;
    className: string;
    colSpan: any;
    rowSpan: any;
}>) {
    return (
        <th
            className={
                `py-3.5 px-4 font-medium text-black dark:text-white ` +
                className
            }
            colSpan={colSpan}
            rowSpan={rowSpan}
        >
            {label}
        </th>
    );
}
