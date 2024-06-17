import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
import Alert from "../Alert";

export default function ModalToAdd({
    show = false,
    closeable = true,
    onClose = () => {},
    title,
    body,
    url,
    data,
    onSuccess,
    classPanel = "",
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title: string;
    body: any;
    url: string;
    data: any;
    classPanel: any;
    onSuccess: any;
}>) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<string>("");

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const action = async (e: any) => {
        // console.log(data);
        e.preventDefault();

        setIsProcessing(true);
        await axios
            .post(url, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                setIsProcessing(false);
                setIsError("");
                onSuccess(res.data[0]);
                close();
            })
            .catch((err) => {
                setIsProcessing(false);
                setIsError(err.response.data[0]);
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
                                <Dialog.Panel
                                    className={classPanel}
                                    // style={{ maxWidth: "65%" }}
                                >
                                    <form onSubmit={action}>
                                        <div className="bg-gray-100 p-6 sm:pb-4">
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
                                        <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <PrimaryButton
                                                className="inline-flex w-full sm:ml-3 sm:w-auto"
                                                disabled={isProcessing}
                                            >
                                                Submit
                                            </PrimaryButton>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={close}
                                            >
                                                Cancel
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
