import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";

export default function DetailRelation({ auth }: PageProps) {
    const { success, detailRelation }: any = usePage().props;

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
                                            {
                                                detailRelation.RELATION_ORGANIZATION_NAME
                                            }
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
                                    {detailRelation.RELATION_ORGANIZATION_GROUP ===
                                        "" ||
                                    detailRelation.RELATION_ORGANIZATION_GROUP ===
                                        null ? (
                                        "-"
                                    ) : (
                                        <>
                                            <span>
                                                {
                                                    detailRelation.RELATION_ORGANIZATION_GROUP
                                                }
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="">
                                    <span>Email</span>
                                    <br></br>
                                    <span className="font-normal text-gray-500">
                                        {
                                            detailRelation.RELATION_ORGANIZATION_EMAIL
                                        }
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
                                    {detailRelation.m_tagging?.map(
                                        (dRelation: any, i: number) => {
                                            return (
                                                <>
                                                    <div className="bg-red-400 p-2 rounded-full w-fit">
                                                        <div className="grid gap-4 grid-cols-2 ml-2">
                                                            <div className="text-white xs:text-sm flex items-center">
                                                                {
                                                                    dRelation
                                                                        .tagging
                                                                        .TAG_NAME
                                                                }
                                                            </div>
                                                            <a href="">
                                                                <div className="flex justify-center place-items-end text-white">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
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
                                                </>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}

                    {/* Structure */}
                    <div className="grid gap-9 grid-cols-3 mt-6 xs:grid-cols-2 xs:gap-x-3 lg:grid-cols-3 lg:gap-4">
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Structure</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Division</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Addres & Location</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
                                <span>Job Desc</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 shadow-md rounded-lg">
                            <div className="flex justify-center items-center text-sm font-medium">
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
