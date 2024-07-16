import { ButtonHTMLAttributes } from "react";

export default function ButtonNotification({
    className,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={className}
        >
            {children}
            <span className="flex absolute bg-red-600 text-white -top-3 -right-4 px-2 rounded-full">
                0
            </span>
        </button>
    );
}
