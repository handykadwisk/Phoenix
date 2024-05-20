import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PropsWithChildren } from "react";

export default function Pagination({
    links, fromData, toData, totalData, clickHref  = () => {},
}: PropsWithChildren<{
    links: any | undefined;
    fromData: number | undefined;
    toData: number | undefined;
    totalData: number | undefined;
    clickHref: CallableFunction;
}>) {
    return (
        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between mt-5 mb-10">
            <div>
                <p className="text-sm text-gray-700 mb-2 md:mb-0">
                    Showing <span className="font-medium">{fromData}</span> to <span className="font-medium">{toData}</span> of{' '}
                    <span className="font-medium">{totalData}</span> results
                </p>
            </div>
            <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {/* <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </a> */}
                    {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                    {
                        links?.map((link: any, i:number) => {
                            if ((link.label).includes('&laquo;')) {
                                return <a
                                key={i}
                                    href=""
                                    className={`
                                        relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                                        ${
                                            link.url === null &&
                                            "cursor-not-allowed hover:bg-transparent"
                                        }
                                    `}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        clickHref(link.url)
                                    }}
                                    >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                            } else if ((link.label).includes('&raquo;')) {
                                return <a
                                key={i}
                                    href=""
                                    className={`
                                    relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                                    ${
                                        link.url === null &&
                                        "cursor-not-allowed hover:bg-transparent"
                                    }
                                `}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        clickHref(link.url)
                                    }}
                                    >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                            } else {
                                return <a
                                key={i}
                                    href=""
                                    aria-current="page"
                                    className={`${link.active ? 
                                        "relative z-10 inline-flex items-center bg-red-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" 
                                        : 
                                        "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}
                                        
                                    `}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        clickHref(link.url)
                                    }}
                                >
                                {link.label}
                                </a>
                            }

                        })
                    }
                    {/* <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </a> */}
                </nav>
            </div>
        </div>
    )
}