import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Group({ auth }: PageProps) {
    const {
        xxx    
    }: any = usePage().props
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Group"}
        >
            <Head title="Group" />

            <div>
            <dl className="mt-0 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* {stats.map((item) => ( */}
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">{xxx}</dt>
                </div>
                {/* ))} */}
            </dl>
            </div>
        </AuthenticatedLayout>
    );
}
