import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";

export default function DetailGroup({ auth }: PageProps) {
    const stats = [{ name: "Policy", stat: "71,897" }];
    const { test, relationGroup }: any = usePage().props;
    // console.log(relationGroup);
    const Card = (dataRelation: any) => {
        console.log(dataRelation.data.r_group);
        return (
            <>
                {dataRelation.data.r_group
                    ?.filter(
                        (m: any) => m.RELATION_ORGANIZATION_PARENT_ID === 0
                    )
                    .map((item: any, i: number) => (
                        <>
                            {item.RELATION_ORGANIZATION_PARENT_ID === 0 ? (
                                <ul className="card ml-10" key={i}>
                                    {item.RELATION_ORGANIZATION_NAME}
                                    {item.children?.map(
                                        (dataChildren: any, a: number) => (
                                            <>
                                                {dataChildren.RELATION_ORGANIZATION_PARENT_ID ===
                                                item.RELATION_ORGANIZATION_ID ? (
                                                    <li className="ml-6">
                                                        {
                                                            dataChildren.RELATION_ORGANIZATION_NAME
                                                        }
                                                    </li>
                                                ) : (
                                                    "0"
                                                )}
                                            </>
                                        )
                                    )}
                                </ul>
                            ) : (
                                ""
                            )}
                        </>
                    ))}
            </>
        );
    };

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

            <div className="grid grid-rows-3 grid-flow-col gap-4">
                <div className="row-span-3 bg-white rounded-lg shadow-md">
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
                <div className="row-span-2 col-span-2 bg-white rounded-lg shadow-md h-96">
                    <div className="bg-red-600 max-w-20 p-2 m-5 rounded-lg text-white">
                        Relation
                    </div>
                    <div>
                        <Card data={relationGroup} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
