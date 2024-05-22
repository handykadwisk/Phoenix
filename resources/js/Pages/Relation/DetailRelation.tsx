import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";

export default function DetailRelation({ auth }: PageProps) {
    const stats = [{ name: "Policy", stat: "71,897" }];

    return (
        <AuthenticatedLayout user={auth.user} header={"Detail Relation"}>
            <Head title="Detail Relation" />

            <BreadcrumbPage
                firstPage=""
                secondPage="Relation"
                threePage="Detail Relation"
                urlFirstPage="/dashboard"
                urlSecondPage="/relation"
                urlThreePage=""
            />

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-3 gap-4 xs:grid-cols-1 md:grid-cols-3">
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md sm:p-6">
                            {/* profile */}
                            <div className="">
                                <div className="p-5">
                                    <div className="flex justify-center items-center">
                                        <img
                                            className="h-36 w-36 rounded-full border-2 bg-gray-50"
                                            src={defaultImage}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex justify-center items-center mt-5">
                                        <span className="font-medium">
                                            FRESNEL PERDANA MANDIRI
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* end profile */}
                        </div>
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="bg-red-600 w-44 p-2 text-center rounded-md text-white">
                                <span>Offical Information</span>
                            </div>
                            <div className="grid gap-x-2 gap-y-2 grid-cols-3 mt-4 ml-3">
                                <div className="">
                                    <span>Group</span>
                                    <br></br>
                                    <span className="font-normal text-gray-500">
                                        FRESNEL
                                    </span>
                                </div>
                                <div className="">
                                    <span>Email</span>
                                    <br></br>
                                    <span className="font-normal text-gray-500">
                                        fresnel@gmail.co.id
                                    </span>
                                </div>
                                <div className="">
                                    <span>Address</span>
                                    <br></br>
                                    <span className="font-normal text-gray-500">
                                        Jl.Gatot Subroto, Kuningan, Mampang
                                        Perampatan, Jakarta Selatan
                                    </span>
                                </div>
                            </div>
                            <hr className="mt-5" />
                            <div className="bg-red-600 w-44 p-2 text-center rounded-md text-white mt-10">
                                <span>Tags</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                <div className="grid grid-cols-5 col-span-2 gap-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-red-400 p-2 rounded-full w-full">
                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                            <div className="text-white xs:text-sm">
                                                Tagging
                                            </div>
                                            <a href="">
                                                <div className="flex justify-center place-items-end text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 ml-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}

                    {/* Structure */}
                    <div className="grid gap-x-8 gap-y-4 grid-cols-4 mt-6 xs:grid-cols-2 xs:gap-x-3 lg:grid-cols-4">
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center">
                                {/* <img
                                    className="h-24 w-24 rounded-full border-2 bg-gray-50"
                                    src={defaultImage}
                                    alt=""
                                /> */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-20 h-20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                                        clipRule="evenodd"
                                        className="text-red-600"
                                    />
                                    <path
                                        d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"
                                        className="text-red-600"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                <span>Structure</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-20 h-20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                                        clipRule="evenodd"
                                        className="text-red-600"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                <span>Division</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-20 h-20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z"
                                        clipRule="evenodd"
                                        className="text-red-600"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                <span>Address Location</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-20 h-20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                        clipRule="evenodd"
                                        className="text-red-600"
                                    />
                                    <path
                                        d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z"
                                        className="text-red-600"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                <span>Job Desc</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-20 h-20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                        clipRule="evenodd"
                                        className="text-red-600"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                <span>Person</span>
                            </div>
                        </div>
                    </div>

                    {/* end Structure */}
                </dl>
            </div>
        </AuthenticatedLayout>
    );
}
