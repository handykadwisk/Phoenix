import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { PropsWithChildren } from "react";
import axios from 'axios';


export default function DeleteModal({
    show = false,
    closeable = true,
    onClose = () => {},
    title,
    body,
    data,
    url,
    method,
    onSuccess,
    headers
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title: string;
    body: string;
    data: any;
    url: any;
    method: any;
    onSuccess: any
    headers: any|null|undefined;
}>) {

    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isError, setIsError] = useState<string>('')

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const callAxios = axios.create({
        headers
    })

    const action = async (e: any) => {
        e.preventDefault()

        setIsProcessing(true)
        onSuccess('')
        
        await callAxios({url, data, method})
        .then((res) => {
            setIsProcessing(false)
            setIsError('')
            onSuccess(res.data[0])
            close()
        })
        .catch((err) => {
            setIsProcessing(false)
            setIsError(err)
            console.log(err)
        })
    }

    return (
        
            <>
            <Transition.Root show={show} as={Fragment}>
                <Dialog as="div" className="relative z-9999" onClose={close}>
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
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                        {body}
                                        </p>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <form onSubmit={action}>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className={
                                                `inline-flex w-full justify-center rounded-md bg-danger px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-danger hover:opacity-100 sm:ml-3 sm:w-auto
                                                ${isProcessing ? ' opacity-25 cursor-not-allowed hover:opacity-25' : ' opacity-90'}`
                                            }
                                            disabled={isProcessing}
                                        >
                                            {
                                                isProcessing ?
                                                <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-10" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4}></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg> Processing</> : `Submit`
                                                
                                            }
                                        </button>
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
        
    )

}