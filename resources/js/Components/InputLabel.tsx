import { LabelHTMLAttributes } from "react";

export default function InputLabel({
    value,
    required,
    className = "",
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
    value?: string;
    required?: boolean;
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium leading-6 text-gray-900 ` + className
            }
        >
            {value ? value : children}{" "}
            {required && <span className="text-red-500">&#42;</span>}
        </label>
    );
}
