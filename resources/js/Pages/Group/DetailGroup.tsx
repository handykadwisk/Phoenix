import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
} from "@heroicons/react/20/solid";

export default function DetailGroup({ auth }: PageProps) {
    const stats = [{ name: "Policy", stat: "71,897" }];
    const { test, relationGroup }: any = usePage().props;
    const timeline = [
        {
            id: 1,
            content: "Applied to",
            target: "Front End Developer",
            href: "#",
            date: "Sep 20",
            datetime: "2020-09-20",
            icon: UserIcon,
            iconBackground: "bg-gray-400",
        },
        {
            id: 2,
            content: "Advanced to phone screening by",
            target: "Bethany Blake",
            href: "#",
            date: "Sep 22",
            datetime: "2020-09-22",
            icon: UserIcon,
            iconBackground: "bg-blue-500",
        },
        {
            id: 3,
            content: "Completed phone screening with",
            target: "Martha Gardner",
            href: "#",
            date: "Sep 28",
            datetime: "2020-09-28",
            icon: UserIcon,
            iconBackground: "bg-green-500",
        },
        {
            id: 4,
            content: "Advanced to interview by",
            target: "Bethany Blake",
            href: "#",
            date: "Sep 30",
            datetime: "2020-09-30",
            icon: UserIcon,
            iconBackground: "bg-blue-500",
        },
        {
            id: 5,
            content: "Completed interview with",
            target: "Katherine Snyder",
            href: "#",
            date: "Oct 4",
            datetime: "2020-10-04",
            icon: UserIcon,
            iconBackground: "bg-green-500",
        },
        {
            id: 6,
            content: "Completed interview with",
            target: "Katherine Snyder",
            href: "#",
            date: "Oct 4",
            datetime: "2020-10-04",
            icon: UserIcon,
            iconBackground: "bg-green-500",
        },
        {
            id: 7,
            content: "Completed interview with",
            target: "Katherine Snyder",
            href: "#",
            date: "Oct 4",
            datetime: "2020-10-04",
            icon: UserIcon,
            iconBackground: "bg-green-500",
        },
    ];

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }
    //     // console.log(dataRelation.data.r_group);
    //     return (
    //         <>
    //             {relationGroup.data.r_group
    //                 ?.filter(
    //                     (m: any) => m.RELATION_ORGANIZATION_PARENT_ID === 0
    //                 )
    //                 .map((item: any, i: number) => (
    //                     <>
    //                         {item.RELATION_ORGANIZATION_PARENT_ID === 0 ? (
    //                             <ul className="card ml-10" key={i}>
    //                                 {item.RELATION_ORGANIZATION_NAME}
    //                                 {item.children?.map(
    //                                     (dataChildren: any, a: number) => (
    //                                         <>
    //                                             {dataChildren.RELATION_ORGANIZATION_PARENT_ID ===
    //                                             item.RELATION_ORGANIZATION_ID ? (
    //                                                 <li className="ml-6">
    //                                                     {
    //                                                         dataChildren.RELATION_ORGANIZATION_NAME
    //                                                     }
    //                                                 </li>
    //                                             ) : (
    //                                                 "0"
    //                                             )}
    //                                         </>
    //                                     )
    //                                 )}
    //                             </ul>
    //                         ) : (
    //                             ""
    //                         )}
    //                     </>
    //                 ))}
    //         </>
    //     );
    // };

    return (
        <AuthenticatedLayout user={auth.user} header={"Detail Group"}>
            <Head title="Detail Group" />

            <BreadcrumbPage
                firstPage=""
                secondPage="Group"
                threePage="Detail Group"
                urlFirstPage="/dashboard"
                urlSecondPage="/group"
                urlThreePage=""
            />

            <div className="grid grid-cols-3 gap-4">
                <div className=" bg-white rounded-lg shadow-md h-96">
                    <div className="flex justify-center items-center">
                        {/* Foto Group*/}
                        <img
                            className="h-36 w-36 rounded-full border-2 bg-gray-50 mt-10"
                            src={defaultImage}
                            alt=""
                        />
                    </div>
                    <div className="flex justify-center items-center mt-5">
                        {/* Name Group*/}
                        <div className="text-sm text-gray-500">
                            <span>Group</span>
                        </div>
                        <div className="absolute mt-10 text-lg">
                            <span>
                                {relationGroup.RELATION_GROUP_NAME.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 bg-white rounded-lg shadow-md h-96">
                    <div className="bg-red-600 max-w-20 p-2 m-5 rounded-lg text-white">
                        Relation
                    </div>
                    <div className="pl-8 pr-8 pb-6">
                        {/* <Card data={relationGroup} /> */}
                        <ul role="list" className="-mb-11">
                            {relationGroup.r_group
                                ?.filter(
                                    (m: any) =>
                                        m.RELATION_ORGANIZATION_PARENT_ID === 0
                                )
                                .map((item: any, i: number) => (
                                    <li key={i}>
                                        <div className="relative">
                                            {i !==
                                            relationGroup.r_group.length - 1 ? (
                                                <span
                                                    className="absolute left-4 top-4 -ml-px h-56 w-0.5 bg-gray-300"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span
                                                        className={
                                                            "bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center"
                                                        }
                                                    >
                                                        {/* <event.icon
                                                            className="h-5 w-5 text-white"
                                                            aria-hidden="true"
                                                        /> */}
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            <a
                                                                href={""}
                                                                className="font-medium text-gray-900"
                                                            >
                                                                {
                                                                    item.RELATION_ORGANIZATION_NAME
                                                                }
                                                            </a>
                                                        </p>
                                                        <br />
                                                        {item.children?.map(
                                                            (
                                                                dataChildren: any,
                                                                a: number
                                                            ) => (
                                                                <li key={a}>
                                                                    <div className="relative pb-8">
                                                                        {a !==
                                                                        item
                                                                            .children
                                                                            .length -
                                                                            1 ? (
                                                                            <span
                                                                                className="absolute left-4 top-4 -ml-px h-10 w-0.5 bg-gray-300"
                                                                                aria-hidden="true"
                                                                            />
                                                                        ) : null}
                                                                        <div className="relative flex space-x-3">
                                                                            <div>
                                                                                <span
                                                                                    className={
                                                                                        "bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center "
                                                                                    }
                                                                                ></span>
                                                                            </div>
                                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                                <div>
                                                                                    <p className="text-sm text-gray-500">
                                                                                        {
                                                                                            dataChildren.RELATION_ORGANIZATION_NAME
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
