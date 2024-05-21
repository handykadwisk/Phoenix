import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
import Alert from "../Alert";

export default function ModalToAction({
    show = false,
    closeable = true,
    onClose = () => {},
    title,
    body,
    url,
    data,
    method,
    onSuccess,
    headers,
    submitButtonName,
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title: string;
    body: any;
    url: string;
    data: any | null;
    method: string;
    onSuccess: any;
    headers: any | null | undefined;
    submitButtonName: string | null;
}>) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<string>("");

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const callAxios = axios.create({
        headers,
    });

    const action = async (e: any) => {
        e.preventDefault();

        setIsProcessing(true);
        onSuccess("");

        await callAxios({ url, data, method })
            .then((res) => {
                setIsProcessing(false);
                setIsError("");
                onSuccess(res.data[0]);
                close();
            })
            .catch((err) => {
                setIsProcessing(false);
                setIsError(err);
                console.log(err);
            });
    };

    return (
        <>
            <Transition.Root show={show} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg lg:max-w-3xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl">
                                    <form onSubmit={action}>
                                        <div className="bg-white px-4 pb-4 pt-3 sm:pb-4">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-xl font-semibold leading-6 text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                            <hr className="my-3" />
                                            {isError && (
                                                <Alert body={isError} />
                                            )}
                                            {body}
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            {submitButtonName && (
                                                <PrimaryButton
                                                    className="inline-flex w-full sm:ml-3 sm:w-auto"
                                                    disabled={isProcessing}
                                                >
                                                    {submitButtonName}
                                                </PrimaryButton>
                                            )}
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={close}
                                            >
                                                {data ? "Cancel" : "Close"}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
