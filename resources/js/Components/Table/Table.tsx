import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { PropsWithChildren } from "react";
import Button from "../Button/Button";

export default function Table({ 
    addButtonLabel,
    addButtonModalState = () => {},
    searchButtonModalState = () => {},
    clearSearchButtonAction = () => {},
    tableHead,
    tableBody,
    pagination
 }: PropsWithChildren<{
    addButtonLabel: string | null | undefined;
    addButtonModalState: CallableFunction | undefined;
    searchButtonModalState: CallableFunction | undefined;
    clearSearchButtonAction: CallableFunction;
    tableHead: any;
    tableBody: any;
    pagination: any;
 }>) {
    return (
        <div className="rounded-md bg-white pt-10 pl-10 pr-10 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
            <div className='md:grid md:grid-cols-8 md:gap-4'>
                <Button
                    className="text-sm w-full lg:w-1/2 font-semibold px-3 py-1.5 mb-4 md:col-span-2"
                    onClick={() => addButtonModalState()}
                >
                    {addButtonLabel}
                </Button>
                <hr className='mb-3 md:mb-0 md:hidden' />
                <button 
                    className="md:mb-4 mb-2 relative md:ml-auto lg:w-1/2 md:w-3/4 w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4"
                    onClick={() => searchButtonModalState()}
                >
                    <MagnifyingGlassIcon className="mx-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Search...
                </button>
                <Button
                    className="mb-4 md:col-span-2 lg:col-span-1 w-full py-1.5 px-2"
                    onClick={() => clearSearchButtonAction()}
                >
                    Clear Search
                </Button>
            </div>
            <div className="max-w-full overflow-x-auto mb-10 mt-5 md:h-full h-75 ring-1 ring-gray-200 shadow-xl rounded-lg custom-table overflow-visible">
                <table className="w-full table-auto divide-y divide-gray-300">
                    <thead className='bg-gray-100'>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            {
                                tableHead
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableBody
                        }
                    </tbody>
                </table>
            </div>
            {pagination}
        </div>
    );
}
