import { PropsWithChildren } from "react";

export default function TableTH({
    label,
    className = ''
}: PropsWithChildren<{
    label: any;
    className: string;
}>) {
  return (
    <th className={`py-3.5 px-4 font-medium text-black dark:text-white ` + className}>
        {label}
    </th>
  )
}