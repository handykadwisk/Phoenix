import { PropsWithChildren } from "react";

export default function Badge({
    body,
    color,
}: PropsWithChildren<{
    body: string;
    color: string;
}>) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-${color}-400 ring-1 ring-inset ring-${color}-500`}
        >
            {body}
        </span>
    );
}
