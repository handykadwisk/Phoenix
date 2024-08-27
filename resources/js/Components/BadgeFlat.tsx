import { PropsWithChildren } from "react";

export default function BadgeFlat({
    className,
    body,
    title,
}: PropsWithChildren<{
    className: any;
    body: any;
    title: any;
}>) {
    return (
        <span
            className={
                `inline-flex items-center rounded-md px-2 py-1 text-xs font-medium hover:cursor-pointer ` +
                className
            }
            title={title}
        >
            {body}
        </span>
    );
}
