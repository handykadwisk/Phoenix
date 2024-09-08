import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Dashboard({ auth, language }: any) {
    // props language dikirim langsung dari middleware Language yang diinject langsung melalui Inertia. cek file Language.php di folder Middleware
    // kemudian ambil array pertama dari language
    // selanjutnya, tinggal panggil di tiap string yang mau diambil dari file language. contoh: lang.policy --ada di bawah contohnya--
    const lang: any = language[0];

    const stats = [
        // { name: lang.policy, stat: "71,897" },
        // { name: lang.claim, stat: "58.16%" },
        // { name: lang.assets, stat: "24.57%" },
        { name: lang.policy, stat: "0" },
        { name: lang.claim, stat: "0" },
        { name: lang.assets, stat: "0" },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={lang.dashboard}>
            <Head title={lang.dashboard} />

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
