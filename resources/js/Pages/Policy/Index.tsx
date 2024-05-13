import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import Button from "@/Components/Button/Button";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useState } from "react";
import { InertiaFormProps } from "@inertiajs/react/types/useForm";

export default function PolicyIndex({ auth }: PageProps) {
    const { flash, policy, custom_menu }: any = usePage().props;
    const [isSuccess, setIsSuccess] = useState<string>("");

    const client = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];

    const group = [
        { id: "1", stat: "CHUBB" },
        { id: "2", stat: "BRINS" },
        { id: "3", stat: "ACA" },
    ];

    const parent = [
        { id: "1", stat: "KILLAN" },
        { id: "1", stat: "FRENSEL" },
        { id: "1", stat: "TEKNOLOGI" },
    ];

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
    });

    const { data, setData, errors, reset } = useForm({
        relation_id: "",
        policy_number: "",
        insurance_type_id: "",
        policy_the_insured: "",
        policy_inception_date: "",
        policy_due_date: "",
        policy_status_id: "",
        policy_insurance_panel: "",
        policy_share: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            relation_id: "",
            policy_number: "",
            insurance_type_id: "",
            policy_the_insured: "",
            policy_inception_date: "",
            policy_due_date: "",
            policy_status_id: "",
            policy_insurance_panel: "",
            policy_share: "",
        });
        setIsSuccess(message);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Policy"}>
            <Head title="Policy" />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-0">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* button add Policy */}
                            <Button
                                className="text-sm font-semibold px-3 py-2 mb-5"
                                onClick={() =>
                                    setModal({
                                        add: true,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                    })
                                }
                            >
                                Create Policy
                            </Button>
                            {/* modal add policy */}
                            <ModalToAdd
                                show={modal.add}
                                onClose={() =>
                                    setModal({
                                        add: false,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                    })
                                }
                                title={"Create Policy"}
                                url={`/policy`}
                                data={data}
                                onSuccess={handleSuccess}
                                body={
                                    <>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="client_name"
                                                value="Client Name"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={""}
                                                onChange={(e) =>
                                                    setData(
                                                        "relation_id",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Client Name</i>{" "}
                                                    --
                                                </option>
                                                {client.map(
                                                    (
                                                        clients: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    clients.id
                                                                }
                                                            >
                                                                {clients.stat}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="policy_number"
                                                value="Policy Number"
                                            />
                                            <TextInput
                                                id="policy_number"
                                                type="text"
                                                name="policy_number"
                                                // value={data.policy_number}
                                                className=""
                                                autoComplete="policy_number"
                                                // onChange={(e) => setData('policy_number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="insurance_type"
                                                value="Insurance Type"
                                            />
                                            <select
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={""}
                                                onChange={(e) =>
                                                    setData(
                                                        "insurance_type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>
                                                    -- <i>Choose Group</i> --
                                                </option>
                                                {group.map(
                                                    (
                                                        groups: any,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={i}
                                                                value={
                                                                    groups.id
                                                                }
                                                            >
                                                                {groups.stat}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="the_insured"
                                                value="The Insured"
                                            />
                                            <TextInput
                                                id="the_insured"
                                                type="text"
                                                name="the_insured"
                                                // value={data.policy_number}
                                                className=""
                                                autoComplete="the_insured"
                                                // onChange={(e) => setData('policy_number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="inception_date"
                                                value="Inception Date"
                                            />
                                            <TextInput
                                                id="inception_date"
                                                type="date"
                                                name="inception_date"
                                                // value={data.inception_date}
                                                className=""
                                                autoComplete="inception_date"
                                                // onChange={(e) => setData('inception_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="due_date"
                                                value="Due Date"
                                            />
                                            <TextInput
                                                id="due_date"
                                                type="date"
                                                name="due_date"
                                                // value={data.due_date}
                                                className=""
                                                autoComplete="due_date"
                                                // onChange={(e) => setData('due_date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="insurance_panel"
                                                value="Insurance Panel"
                                            />
                                            <TextInput
                                                id="insurance_panel"
                                                type="text"
                                                name="insurance_panel"
                                                // value={data.insurance_panel}
                                                className=""
                                                autoComplete="insurance_panel"
                                                // onChange={(e) => setData('insurance_panel', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="installment"
                                                value="Installment"
                                            />
                                            <TextInput
                                                id="installment"
                                                type="text"
                                                name="installment"
                                                // value={data.installment}
                                                className=""
                                                autoComplete="installment"
                                                // onChange={(e) => setData('installment', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <InputLabel
                                                htmlFor="share"
                                                value="Share %"
                                            />
                                            <TextInput
                                                id="share"
                                                type="text"
                                                name="share"
                                                // value={data.share}
                                                className=""
                                                autoComplete="share"
                                                // onChange={(e) => setData('share', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                }
                            />
                            {/* end Modal add Policy */}
                            {/* table policy in here */}
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead>
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                    >
                                                        Policy Number
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Insurance Type
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Periode
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                {policy?.map(
                                                    (d: any, i: number) => (
                                                        <tr
                                                            key={i}
                                                            className="even:bg-gray-50"
                                                        >
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                                {
                                                                    d.POLICY_NUMBER
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* end table relaton in here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
