import { ButtonHTMLAttributes } from "react";

export default function Button({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `${className.includes("rounded") ? className : "rounded-md"} ${
                    className.includes("bg-") ? "" : "bg-red-600"
                } text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    disabled && "opacity-25 cursor-not-allowed"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
