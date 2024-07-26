import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
// import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import InsurancePanelIndex from "../InsurancePanel/Index";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import Table from "@/Components/Table/Table";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";

export default function PolicyDetail({ auth }: PageProps) {
    const stats = [{ name: "Policy", stat: "71,897" }];
    const { policy, insurancePanels }: any = usePage().props;
    
    // const { insurance }: any = usePage().props;
    console.log(insurancePanels);

    return (
        <AuthenticatedLayout user={auth.user} header={"Detail Policy"}>
            <Head title="Detail Policy" />

            {/* <BreadcrumbPage
                firstPage=""
                secondPage="Relation"
                threePage="Detail Relation"
                urlFirstPage="/dashboard"
                urlSecondPage="/relation"
                urlThreePage=""
            /> */}

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-1">
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="mt-2">
                                <div className="grid grid-cols-3 gap-4 mr-6">
                                    <div className="col-span-2">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Policy {policy.POLICY_NUMBER}
                                        </h3>
                                    </div>
                                    <div className="col-end-5">
                                        {policy.POLICY_STATUS_ID == 1 ? (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Current
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                Lapse
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <hr className="my-3 w-auto ml-4 mr-6" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Client Name</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    policy.relation
                                                        .RELATION_ORGANIZATION_NAME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {/* <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Insurance Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    policy.insurance_type
                                                        .INSURANCE_TYPE_NAME
                                                }
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>The Insured</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_THE_INSURED}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Inception Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_INCEPTION_DATE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Insurance Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {
                                                    policy.insurance_type
                                                        .INSURANCE_TYPE_NAME
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {/* <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Status</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_STATUS_ID == 1
                                                    ? "Current"
                                                    : "Lapse"}
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Expired Date</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {policy.POLICY_DUE_DATE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <hr className="mt-5" /> */}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Initial Premium
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 ml-0">
                                        {/* <div className="mt-8 flow-root"> */}
                                        {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            No
                                                        </th>
                                                        {/* <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Currency
                                                        </th> */}
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Sum Insured
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Rate %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Initial Premium
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {policy.policy_initial_premium.map(
                                                        (
                                                            pip: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                </td> */}
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.SUM_INSURED
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        // decimalSeparator={','}
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {pip.RATE}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.INITIAL_PREMIUM
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        // decimalSeparator={','}
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Installment
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 -ml-2">
                                        {/* <div className="mt-8 flow-root"> */}
                                        {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            Installment
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Term Rate %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Due Date
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Payment
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {policy.policy_installment.map(
                                                        (
                                                            pI: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {
                                                                        pI.POLICY_INSTALLMENT_TERM
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pI.POLICY_INSTALLMENT_PERCENTAGE
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pI.INSTALLMENT_DUE_DATE
                                                                    }
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {/* Cek Ke DN. Jika sudah ada DN maka Paid tampilkan tanggal, jika belum Unpaid, tampilkan selisihnya */}
                                                                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                                        Unpaid
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Panel */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Insurer Information
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 -ml-2">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            No.
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Insurance
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Share
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {insurancePanels.map(
                                                        (
                                                            insurancePanel: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {insurancePanel.IP_POLICY_LEADER ==
                                                                    1
                                                                        ? insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Leader"
                                                                        : insurancePanel
                                                                              .insurance
                                                                              .RELATION_ORGANIZATION_NAME +
                                                                          " - Co Member"}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {insurancePanel.IP_POLICY_SHARE +
                                                                        " %"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {/* <div className="mt-10">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            Initial Premium
                                        </h3>
                                        <hr className="my-3 w-auto ml-4 mr-6" />
                                    </div>
                                    <div className="grid gap-x-2 gap-y-2 -mt-4 ml-0">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                                        >
                                                            No
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Sum Insured
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Rate %
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                        >
                                                            Initial Premium
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {policy.policy_initial_premium.map(
                                                        (
                                                            pip: any,
                                                            i: number
                                                        ) => (
                                                            <tr key={i}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {i + 1}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.SUM_INSURED
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {pip.RATE}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {
                                                                        pip
                                                                            .currency
                                                                            .CURRENCY_SYMBOL
                                                                    }
                                                                    <CurrencyInput
                                                                        value={
                                                                            pip.INITIAL_PREMIUM
                                                                        }
                                                                        decimalScale={
                                                                            2
                                                                        }
                                                                        decimalsLimit={
                                                                            2
                                                                        }
                                                                        readOnly
                                                                        className="border-none"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            {/* End Insurance Panel */}
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}

                    {/* Insurance Panel */}
                    {/* <div className="grid mt-2 grid-cols-3 gap-4 xs:grid-cols-1 md:grid-cols-3">
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-3 sm:p-6 xs:col-span-1 md:col-span-3">
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                    Insurance Panel
                                </h3>
                                <hr className="my-3" />
                            </div>
                            <div className="">
                                <InsurancePanelIndex
                                    auth={auth}
                                    policyData={policy}
                                />
                            </div>
                        </div>
                    </div> */}
                    {/* End Insurance Panel */}
                </dl>
            </div>
        </AuthenticatedLayout>
    );
}
