import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

export default forwardRef(function Input(
    { id, name, type = 'text', value, placeholder, className = '', isFocused = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <input
            {...props}
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 ${className.includes("focus:ring-" ? className : `focus:ring-indigo-600`)} ${className}`}
            ref={localRef}
        />
    );
});