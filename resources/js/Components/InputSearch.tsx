import { InputHTMLAttributes } from "react";

export default function InputSearch({
    id,
    name,
    type = "text",
    value,
    placeholder,
    className = "",
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="mb-5">
            <input
                {...props}
                id={id}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                className={
                    `block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm ` +
                    className
                }
            />
        </div>
    );
}
