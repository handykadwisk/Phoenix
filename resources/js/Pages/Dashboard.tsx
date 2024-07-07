import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Dashboard({ auth }: PageProps) {
    const stats = [
        { name: "Policy", stat: "71,897" },
        { name: "Claim", stat: "58.16%" },
        { name: "Assets", stat: "24.57%" },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={"Dashboard"}>
            <Head title="Dashboard" />

            {/*Quick Access  */}
            <div className="bg-white p-4 rounded-lg shadow-md hidden">
                <div className="w-fit font-semibold">
                    <span className="border-b-2 border-red-600">
                        Quick Access
                    </span>
                </div>

                <div className="mt-4 flex gap-3">
                    {/* Button Add Relation */}
                    <div className="bg-red-600 w-fit p-2 rounded-md text-white cursor-pointer hover:bg-red-400 hover:shadow-lg">
                        <span>Add Relation</span>
                    </div>
                    <div className="bg-red-600 w-fit p-2 rounded-md text-white cursor-pointer hover:bg-red-400 hover:shadow-lg">
                        <span>Add Group</span>
                    </div>
                    {/* End Button Add Relation */}
                </div>
            </div>

            <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                        <div
                            key={item.name}
                            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                        >
                            <dt className="truncate text-sm font-medium text-gray-500">
                                {item.name}
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                {item.stat}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </AuthenticatedLayout>
    );
}
