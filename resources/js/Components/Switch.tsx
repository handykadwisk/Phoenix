import { Switch } from "@headlessui/react";
import { InputHTMLAttributes, PropsWithChildren, useState } from "react";

export default function SwitchPage({
    enabled,
    onChangeButton = () => {},
}: PropsWithChildren<{
    enabled: any;
    onChangeButton: any;
}>) {
    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    // const [enabled, setEnabled] = useState(false)

    return (
        <Switch
            checked={enabled}
            onChange={onChangeButton}
            className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
            />
            <span
                aria-hidden="true"
                className={classNames(
                    enabled ? "bg-red-600" : "bg-gray-200",
                    "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
            />
            <span
                aria-hidden="true"
                className={classNames(
                    enabled ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
            />
        </Switch>
    );
}
