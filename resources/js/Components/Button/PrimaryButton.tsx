import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    disabled && "opacity-25 cursor-not-allowed"
                } ` + className
            }
            disabled={disabled}
        >
            {disabled ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 my-auto text-white"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-10"
                            cx={12}
                            cy={12}
                            r={10}
                            stroke="currentColor"
                            strokeWidth={4}
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>{" "}
                    Processing
                </>
            ) : (
                children
            )}
        </button>
    );
}
