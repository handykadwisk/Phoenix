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
                    className.includes("bg-") ? className : "bg-red-600"
                } ${className.includes("text") ? className : "text-white"} ${className.includes("shadow") ? className : "shadow-sm"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    disabled && "opacity-25 cursor-not-allowed"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
