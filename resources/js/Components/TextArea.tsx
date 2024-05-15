import { InputHTMLAttributes } from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <textarea
          rows={4}
          {...props}
            className={
                'resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 ' +
                className
            }
        />
    );
}
