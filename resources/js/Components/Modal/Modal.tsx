import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PropsWithChildren } from "react";
import { router } from '@inertiajs/react';
import PrimaryButton from '../Button/PrimaryButton';

export default function Modal({
    show = false,
    closeable = true,
    onClose = () => {},
    title,
    body,
    method,
    url,
    data
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title: string;
    body: any;
    method: any;
    url: string;
    data: any;
}>) {

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const action = (e: any) => {
        e.preventDefault()
        
        router.visit(url, {
            method: method,
            data: data,
            onBefore: () => {
                setIsProcessing(true)
            },
            onFinish: () => {
                setIsProcessing(false)
            },
            // onSuccess: () => {
            //     close()
            // }
        })
    }

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-9999" onClose={() => {}}>
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
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <form onSubmit={action}>
                                <div className="bg-white px-4 pb-4 pt-3 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <hr className="my-3" />
                                    {body}
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
        
    )

}